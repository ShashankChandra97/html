import * as THREE from "three";
import { PHOTO_PARTICLE_COUNT, samplePhotoPixels } from "./photoParticles";

export type PhotoRect={left:number;top:number;width:number;height:number};

/** One GPU point cloud travels between pixels sampled from the unchanged photographs. */
export async function createPhotoMorph(host:HTMLElement,images:HTMLImageElement[],onFailure:()=>void) {
  const sampler=document.createElement("canvas");sampler.width=320;sampler.height=240;
  const context=sampler.getContext("2d",{willReadFrequently:true});
  if(!context) throw new Error("Image sampling unavailable");
  await Promise.all(images.map(image=>image.decode()));
  const samples=images.map(image=>{
    context.clearRect(0,0,320,240);context.drawImage(image,0,0,320,240);
    return samplePhotoPixels(context.getImageData(0,0,320,240).data,320,240);
  });
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:"low-power"});
  renderer.setClearColor(0xffffff,0);
  renderer.domElement.className="photo-particles";
  renderer.domElement.setAttribute("aria-hidden","true");
  const uniforms={
    uProgress:{value:0},uViewport:{value:new THREE.Vector2(1,1)},uPixelRatio:{value:1},
    uSourceRect:{value:new THREE.Vector4()},uTargetRect:{value:new THREE.Vector4()},
  };
  const material=new THREE.ShaderMaterial({
    uniforms,depthTest:false,depthWrite:false,transparent:false,
    vertexShader:`
      attribute vec2 sourceUV; attribute vec2 targetUV;
      attribute vec3 sourceColor; attribute vec3 targetColor;
      uniform float uProgress; uniform float uPixelRatio;
      uniform vec2 uViewport; uniform vec4 uSourceRect; uniform vec4 uTargetRect;
      varying vec3 vColor; varying float vVisible;
      void main() {
        float release=.04+sourceUV.x*.28;
        float arrival=.68+targetUV.x*.28;
        float local=clamp((uProgress-release)/(arrival-release),0.,1.);
        float eased=local*local*(3.-2.*local);
        float flight=sin(local*3.14159265);
        vec2 source=uSourceRect.xy+sourceUV*uSourceRect.zw;
        vec2 target=uTargetRect.xy+targetUV*uTargetRect.zw;
        vec2 p=mix(source,target,eased);
        float band=sourceUV.x*6.2831853;
        vec2 center=mix(uSourceRect.xy+uSourceRect.zw*.5,uTargetRect.xy+uTargetRect.zw*.5,eased);
        // A shallow depth arc carries the same pixels forward before they settle into the next photo.
        p=center+(p-center)*(1.+flight*.12);
        float span=min(uSourceRect.z,uTargetRect.z);
        p+=vec2(sin(band)*.075,cos(band)*.065)*span*flight;
        gl_Position=vec4(p.x/uViewport.x*2.-1.,1.-p.y/uViewport.y*2.,0.,1.);
        gl_PointSize=clamp(span/230.,1.4,3.2)*(1.+flight*.18)*uPixelRatio;
        vColor=mix(sourceColor,targetColor,eased);
        vVisible=step(release,uProgress)*(1.-step(arrival,uProgress));
      }`,
    fragmentShader:`
      varying vec3 vColor; varying float vVisible;
      void main(){if(vVisible<.5)discard;gl_FragColor=vec4(vColor,1.);}`,
  });
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute("position",new THREE.BufferAttribute(new Float32Array(PHOTO_PARTICLE_COUNT*3),3));
  for(const [name,size] of [["sourceUV",2],["targetUV",2],["sourceColor",3],["targetColor",3]] as const)
    geometry.setAttribute(name,new THREE.BufferAttribute(new Float32Array(PHOTO_PARTICLE_COUNT*size),size).setUsage(THREE.DynamicDrawUsage));
  const points=new THREE.Points(geometry,material);points.frustumCulled=false;
  const scene=new THREE.Scene();scene.add(points);
  const camera=new THREE.Camera();
  let connected=-1,failed=false;
  function lost(event:Event){event.preventDefault();failed=true;onFailure();}
  renderer.domElement.addEventListener("webglcontextlost",lost);
  host.appendChild(renderer.domElement);
  function resize(width:number,height:number){
    const ratio=Math.min(window.devicePixelRatio||1,2);
    renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);
    uniforms.uViewport.value.set(width,height);uniforms.uPixelRatio.value=ratio;
  }
  function render(from:number,to:number,progress:number,source:PhotoRect,target:PhotoRect){
    if(failed)return;
    if(connected!==from){
      for(const [name,values] of [["sourceUV",samples[from].positions],["targetUV",samples[to].positions],["sourceColor",samples[from].colors],["targetColor",samples[to].colors]] as const){
        const attribute=geometry.getAttribute(name) as THREE.BufferAttribute;
        (attribute.array as Float32Array).set(values);attribute.needsUpdate=true;
      }
      connected=from;
    }
    uniforms.uProgress.value=progress;
    uniforms.uSourceRect.value.set(source.left,source.top,source.width,source.height);
    uniforms.uTargetRect.value.set(target.left,target.top,target.width,target.height);
    renderer.render(scene,camera);
  }
  return {render,resize,dispose(){
    renderer.domElement.removeEventListener("webglcontextlost",lost);
    geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove();
  }};
}
