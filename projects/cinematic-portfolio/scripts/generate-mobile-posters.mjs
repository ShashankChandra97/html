/** Code-native stills for motion-off, initial load, and WebGL failure. */
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import * as THREE from "three";
import {mergeGeometries} from "three/addons/utils/BufferGeometryUtils.js";
import {RoundedBoxGeometry} from "three/addons/geometries/RoundedBoxGeometry.js";
import sharp from "sharp";
const api={};
runInNewContext(ts.transpileModule(readFileSync(new URL("../lib/sculptureModels.ts",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,
  {exports:api,require:name=>name==="three"?THREE:name.includes("BufferGeometryUtils")?{mergeGeometries}:{RoundedBoxGeometry}});
const light=new THREE.Vector3(-3,5,7).normalize();
for(let phase=0;phase<9;phase++){
  const model=api.createSculptureModel(phase);
  const bounds=new THREE.Box3().setFromObject(model.group),radius=bounds.getBoundingSphere(new THREE.Sphere()).radius;
  model.group.position.sub(bounds.getCenter(new THREE.Vector3()));
  model.group.rotation.set(phase===6?.32:.07,-.14,0);model.group.updateMatrixWorld(true);
  const camera=new THREE.PerspectiveCamera(33,4/3,.1,60);
  camera.position.set(0,phase===6?.7:.15,radius/Math.sin(THREE.MathUtils.degToRad(16.5))*1.04);
  camera.lookAt(0,0,0);camera.updateMatrixWorld();
  const width=1000,height=750;
  const pixels=new Uint8ClampedArray(width*height*4);
  const depthBuffer=new Float32Array(width*height).fill(Infinity);
  model.group.traverse(mesh=>{
    if(!(mesh instanceof THREE.Mesh))return;
    const geometry=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry;
    const pos=geometry.getAttribute("position"),normals=geometry.getAttribute("normal");
    const normalMatrix=new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
    for(let i=0;i<pos.count;i+=3){
      const vertices=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(pos,i+j).applyMatrix4(mesh.matrixWorld));
      const normal=new THREE.Vector3().subVectors(vertices[1],vertices[0]).cross(new THREE.Vector3().subVectors(vertices[2],vertices[0])).normalize();
      if(normal.dot(camera.position.clone().sub(vertices[0]))<=0)continue;
      const n=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(normals,i+j).applyMatrix3(normalMatrix).normalize());
      const vertexColors=geometry.getAttribute("color");
      const shades=[0,1,2].map(j=>vertexColors?new THREE.Color().fromArray(vertexColors.array,(i+j)*3):new THREE.Color(1,1,1));
      const shade=new THREE.Color();
      const projected=vertices.map(v=>v.clone().project(camera));
      const p=projected.map(v=>({x:(v.x+1)*width/2,y:(1-v.y)*height/2,z:v.z}));
      const minX=Math.max(0,Math.floor(Math.min(...p.map(v=>v.x)))),maxX=Math.min(width-1,Math.ceil(Math.max(...p.map(v=>v.x))));
      const minY=Math.max(0,Math.floor(Math.min(...p.map(v=>v.y)))),maxY=Math.min(height-1,Math.ceil(Math.max(...p.map(v=>v.y))));
      const denom=(p[1].y-p[2].y)*(p[0].x-p[2].x)+(p[2].x-p[1].x)*(p[0].y-p[2].y);
      if(Math.abs(denom)<.000001)continue;
      const smooth=new THREE.Vector3(),color=new THREE.Color(),highlight=new THREE.Color("#f1f7ff");
      for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
        const a=((p[1].y-p[2].y)*(x+.5-p[2].x)+(p[2].x-p[1].x)*(y+.5-p[2].y))/denom;
        const b=((p[2].y-p[0].y)*(x+.5-p[2].x)+(p[0].x-p[2].x)*(y+.5-p[2].y))/denom;
        const c=1-a-b;if(a<0||b<0||c<0)continue;
        const depth=a*p[0].z+b*p[1].z+c*p[2].z,index=y*width+x;
        if(depth>=depthBuffer[index])continue;depthBuffer[index]=depth;
        smooth.copy(n[0]).multiplyScalar(a).addScaledVector(n[1],b).addScaledVector(n[2],c).normalize();
        const reflection=Math.pow(Math.max(0,smooth.dot(light)),12)*.55;
        shade.copy(shades[0]).multiplyScalar(a).add(shades[1].clone().multiplyScalar(b)).add(shades[2].clone().multiplyScalar(c));
        color.copy(mesh.material.color).multiply(shade).multiplyScalar(.48+Math.max(0,smooth.dot(light))*.6).lerp(highlight,reflection).add(mesh.material.emissive.clone().multiplyScalar(mesh.material.emissiveIntensity*.3)).convertLinearToSRGB();
        pixels[index*4]=Math.min(255,color.r*255);pixels[index*4+1]=Math.min(255,color.g*255);pixels[index*4+2]=Math.min(255,color.b*255);pixels[index*4+3]=255;
      }
    }
    if(geometry!==mesh.geometry)geometry.dispose();
  });
  const output=new URL(`../public/images/mobile-model-${phase}.webp`,import.meta.url);
  await sharp(Buffer.from(pixels),{raw:{width,height,channels:4}}).resize(800,600).webp({quality:88}).toFile(output.pathname);
  console.log(`Mobile ${phase}: depth-tested solid poster`);model.dispose();
}
