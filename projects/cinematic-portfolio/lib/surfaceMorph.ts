import * as THREE from "three";

export const PIXEL_COUNT = 12000;
export type SurfaceSamples = { positions: Float32Array; colors: Float32Array; ranks: Float32Array };

export function sweepRank(x: number, y: number, min: number, span: number) {
  return THREE.MathUtils.clamp((x + y * .22 - min) / span, 0, 1);
}

/** Shared timing for the solid sweep and pixels: no transparent model crossfade. */
export function pixelWindow(progress: number, sourceRank: number, targetRank: number) {
  const release = .04 + sourceRank * .28;
  const arrival = .68 + targetRank * .28;
  return {
    release, arrival,
    local: THREE.MathUtils.clamp((progress-release)/(arrival-release),0,1),
    visible: progress > release && progress < arrival,
  };
}

/** Area-weighted samples land on the actual solid surfaces, including their inlays. */
export function sampleSurface(group: THREE.Group, count = PIXEL_COUNT): SurfaceSamples {
  const triangles: { a: THREE.Vector3; b: THREE.Vector3; c: THREE.Vector3; color: THREE.Color; shades?: THREE.Color[]; total: number }[] = [];
  const bounds = new THREE.Box3().setFromObject(group);
  const min = bounds.min.x + bounds.min.y*.22;
  const span = bounds.max.x + bounds.max.y*.22 - min;
  let total = 0;
  group.updateMatrixWorld(true);
  group.traverse(item => {
    if (!(item instanceof THREE.Mesh)) return;
    const material = item.material as THREE.MeshStandardMaterial;
    const geometry = item.geometry;
    const positions = geometry.getAttribute("position");
    const index = geometry.index;
    for(let i=0;i<(index?.count ?? positions.count);i+=3) {
      const [a,b,c] = [0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(positions,index?index.getX(i+j):i+j).applyMatrix4(item.matrixWorld));
      const area = new THREE.Vector3().subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a)).length()/2;
      if(area<1e-9)continue;
      const attribute=geometry.getAttribute("color");
      const shades=attribute?[0,1,2].map(j=>new THREE.Color().fromArray(attribute.array,(index?index.getX(i+j):i+j)*3)):undefined;
      total+=area;triangles.push({a,b,c,color:material.color,shades,total});
    }
  });
  const points: { position: THREE.Vector3; color: THREE.Color; rank: number }[] = [];
  // Stratified area selection avoids random clumps and is identical on reversal.
  for(let i=0;i<count;i++) {
    const area=(i+.5)/count*total;
    let low=0,high=triangles.length-1;
    while(low<high){const mid=(low+high)>>1;if(triangles[mid].total<area)low=mid+1;else high=mid;}
    const triangle=triangles[low];
    const u=Math.sqrt((i*.754877666+.5)%1),v=(i*.569840296+.5)%1;
    const position=triangle.a.clone().multiplyScalar(1-u).addScaledVector(triangle.b,u*(1-v)).addScaledVector(triangle.c,u*v);
    const color=triangle.color.clone();
    if(triangle.shades){
      const shade=triangle.shades[0].clone().multiplyScalar(1-u).add(triangle.shades[1].clone().multiplyScalar(u*(1-v))).add(triangle.shades[2].clone().multiplyScalar(u*v));
      color.multiply(shade);
    }
    points.push({position,color,rank:sweepRank(position.x,position.y,min,span)});
  }
  // Nearby sweep bands travel together; every pixel has a persistent destination.
  points.sort((a,b)=>a.rank-b.rank || a.position.y-b.position.y || a.position.z-b.position.z);
  const result={positions:new Float32Array(count*3),colors:new Float32Array(count*3),ranks:new Float32Array(count)};
  points.forEach((point,i)=>{point.position.toArray(result.positions,i*3);point.color.toArray(result.colors,i*3);result.ranks[i]=point.rank;});
  return result;
}

/** Fragment discard keeps all remaining metal fully opaque during disassembly. */
export function attachSurfaceSweep(group: THREE.Group) {
  const bounds=new THREE.Box3().setFromObject(group);
  const min=bounds.min.x+bounds.min.y*.22;
  const uniforms={cut:{value:-1},incoming:{value:0},min:{value:min},span:{value:bounds.max.x+bounds.max.y*.22-min}};
  group.traverse(item=>{
    if(!(item instanceof THREE.Mesh))return;
    const material=item.material as THREE.MeshStandardMaterial;
    material.onBeforeCompile=shader=>{
      Object.assign(shader.uniforms,{uSweepCut:uniforms.cut,uIncoming:uniforms.incoming,uSweepMin:uniforms.min,uSweepSpan:uniforms.span});
      shader.vertexShader="varying vec3 vSweepPosition;\n"+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace("#include <begin_vertex>","#include <begin_vertex>\nvSweepPosition = position;");
      shader.fragmentShader="uniform float uSweepCut; uniform float uIncoming; uniform float uSweepMin; uniform float uSweepSpan; varying vec3 vSweepPosition;\n"+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace("#include <alphatest_fragment>",`#include <alphatest_fragment>
        float rank = clamp((vSweepPosition.x + vSweepPosition.y * .22 - uSweepMin) / uSweepSpan, 0.0, 1.0);
        if (uIncoming < .5 && rank < uSweepCut) discard;
        if (uIncoming > .5 && rank > uSweepCut) discard;`);
    };
    material.customProgramCacheKey=()=>"opaque-surface-sweep-v1";
  });
  return uniforms;
}

export function createPixelFlow() {
  const geometry=new THREE.BufferGeometry();
  const uniforms={progress:{value:0},pixelRatio:{value:1}};
  const material=new THREE.ShaderMaterial({
    uniforms:{uProgress:uniforms.progress,uPixelRatio:uniforms.pixelRatio},
    depthWrite:true,transparent:false,
    vertexShader:`
      attribute vec3 target; attribute vec3 sourceColor; attribute vec3 targetColor;
      attribute float sourceRank; attribute float targetRank;
      uniform float uProgress; uniform float uPixelRatio;
      varying vec3 vColor; varying float vVisible;
      void main() {
        float release = .04 + sourceRank * .28;
        float arrival = .68 + targetRank * .28;
        float local = clamp((uProgress-release)/(arrival-release),0.0,1.0);
        float eased = local*local*(3.0-2.0*local);
        float flight = sin(local*3.14159265359);
        vec3 p = mix(position,target,eased);
        float band = sourceRank*6.28318530718;
        p.x += sin(band)*flight*.2;
        p.y += cos(band)*flight*.28;
        p.z += flight*(.45 + .2*sin(band*2.0));
        vec4 view = modelViewMatrix*vec4(p,1.0);
        gl_Position = projectionMatrix*view;
        gl_PointSize = clamp(27.0 / -view.z,1.5,3.2) * uPixelRatio;
        vColor = mix(sourceColor,targetColor,eased);
        // A cool travelling glint makes color evolve with the pixel flight.
        vColor = mix(vColor,vec3(.08,.65,.78),flight*.14);
        vVisible = step(release,uProgress)*(1.0-step(arrival,uProgress));
      }`,
    fragmentShader:`
      varying vec3 vColor; varying float vVisible;
      void main() {
        if(vVisible < .5) discard;
        gl_FragColor = vec4(vColor,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const points=new THREE.Points(geometry,material);points.frustumCulled=false;
  function connect(source:SurfaceSamples,target:SurfaceSamples) {
    function update(name:string,values:Float32Array,size:number) {
      const attribute=geometry.getAttribute(name) as THREE.BufferAttribute|undefined;
      if(attribute){attribute.array.set(values);attribute.needsUpdate=true;}
      else geometry.setAttribute(name,new THREE.BufferAttribute(values.slice(),size).setUsage(THREE.DynamicDrawUsage));
    }
    update("position",source.positions,3);update("target",target.positions,3);
    update("sourceColor",source.colors,3);update("targetColor",target.colors,3);
    update("sourceRank",source.ranks,1);update("targetRank",target.ranks,1);
  }
  return {points,uniforms,connect,dispose:()=>{geometry.dispose();material.dispose();}};
}
