import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import * as THREE from "three";
import {mergeGeometries} from "three/addons/utils/BufferGeometryUtils.js";
import {RoundedBoxGeometry} from "three/addons/geometries/RoundedBoxGeometry.js";
const api={};
runInNewContext(ts.transpileModule(readFileSync(new URL("../lib/sculptureModels.ts",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,
  {exports:api,require:name=>name==="three"?THREE:name.includes("BufferGeometryUtils")?{mergeGeometries}:{RoundedBoxGeometry}});

test("all mobile models stay opaque and inside portrait, tablet, and landscape compositions through their tilt",()=>{
  for(let phase=0;phase<9;phase++) {
    const model=api.createSculptureModel(phase);
    assert.ok(model.group.children.length<=5,"mobile model uses at most five material draw calls");
    const bounds=new THREE.Box3().setFromObject(model.group),radius=bounds.getBoundingSphere(new THREE.Sphere()).radius;
    assert.ok(radius>1&&radius<4);
    model.group.position.sub(bounds.getCenter(new THREE.Vector3()));
    for(const aspect of [1,4/3,2.3])for(const progress of [-.5,0,.5]) {
      const camera=new THREE.PerspectiveCamera(33,aspect,.1,60);
      model.group.rotation.set(phase===6?.32:.07,-.14+progress*.24,0);model.group.updateMatrixWorld(true);
      const halfFov=Math.atan(Math.tan(THREE.MathUtils.degToRad(16.5))*Math.min(1,aspect));
      camera.position.set(0,phase===6?.7:.15,radius/Math.sin(halfFov)*1.04);camera.lookAt(0,0,0);camera.updateMatrixWorld();
      const p=new THREE.Vector3();
      model.group.traverse(mesh=>{
        if(!(mesh instanceof THREE.Mesh))return;
        assert.equal(mesh.material.opacity,1);assert.equal(mesh.material.transparent,false);
        const positions=mesh.geometry.getAttribute("position");
        for(let i=0;i<positions.count;i++) {
          p.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld).project(camera);
          assert.ok(Math.abs(p.x)<.96&&Math.abs(p.y)<.96&&p.z<1,`phase ${phase}, aspect ${aspect}: model is clipped`);
        }
      });
    }
    model.dispose();
  }
});
