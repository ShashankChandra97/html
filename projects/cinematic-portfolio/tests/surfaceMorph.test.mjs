import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import * as THREE from "three";
import {mergeGeometries} from "three/addons/utils/BufferGeometryUtils.js";
import {RoundedBoxGeometry} from "three/addons/geometries/RoundedBoxGeometry.js";
function load(file) {
  const api={};
  runInNewContext(ts.transpileModule(readFileSync(new URL(file,import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,
    {exports:api,require:name=>name==="three"?THREE:name.includes("BufferGeometryUtils")?{mergeGeometries}:{RoundedBoxGeometry}});
  return api;
}
const {sampleSurface,pixelWindow,createPixelFlow,attachSurfaceSweep,PIXEL_COUNT}=load("../lib/surfaceMorph.ts");
const {createSculptureModel}=load("../lib/sculptureModels.ts");

test("pixels sample all nine solid surfaces deterministically, retain material colors, and never form a voxel grid",()=>{
  for(let phase=0;phase<9;phase++) {
    const model=createSculptureModel(phase);
    const bounds=new THREE.Box3().setFromObject(model.group);
    const samples=sampleSurface(model.group);
    assert.equal(samples.positions.length,PIXEL_COUNT*3);
    const p=new THREE.Vector3();
    for(let i=0;i<PIXEL_COUNT;i++) {
      p.fromArray(samples.positions,i*3);
      assert.ok(bounds.clone().expandByScalar(.00001).containsPoint(p));
      assert.ok(samples.ranks[i]>=0&&samples.ranks[i]<=1);
      if(i>0)assert.ok(samples.ranks[i]>=samples.ranks[i-1],"sweep bands retain spatial order");
    }
    assert.ok(new Set(samples.positions).size>PIXEL_COUNT,"samples follow smooth faces rather than lattice coordinates");
    const repeated=sampleSurface(model.group);
    assert.deepEqual(samples.positions,repeated.positions);
    assert.deepEqual(samples.colors,repeated.colors);
    model.dispose();
  }
});

test("solid holds have no pixels, middle poses move, and reverse scrolling retraces every pixel",()=>{
  for(const source of [0,.25,.5,.75,1])for(const target of [0,.25,.5,.75,1]) {
    assert.equal(pixelWindow(0,source,target).visible,false);
    assert.equal(pixelWindow(1,source,target).visible,false);
    assert.equal(pixelWindow(.5,source,target).visible,true);
    const positions=Array.from({length:101},(_,i)=>i/100);
    const forward=positions.map(t=>pixelWindow(t,source,target).local);
    assert.deepEqual(forward,positions.toReversed().map(t=>pixelWindow(t,source,target).local).toReversed());
    assert.equal(forward[0],0);assert.equal(forward.at(-1),1);
    assert.ok(forward.every((value,i)=>i===0||value>=forward[i-1]));
  }
});

test("transition uses reusable GPU point buffers and keeps remaining metal opaque",()=>{
  const a=createSculptureModel(0),b=createSculptureModel(1);
  const source=sampleSurface(a.group),target=sampleSurface(b.group);
  const flow=createPixelFlow();flow.connect(source,target);
  assert.ok(flow.points instanceof THREE.Points);
  assert.equal(flow.points.material.transparent,false);
  const attributes={...flow.points.geometry.attributes};
  flow.connect(target,source);
  for(const key of Object.keys(attributes))assert.equal(flow.points.geometry.attributes[key],attributes[key],"scrolling between scenes must not leak GPU buffers");
  const sweep=attachSurfaceSweep(a.group);sweep.cut.value=.5;
  for(const mesh of a.group.children) {
    assert.equal(mesh.material.opacity,1);assert.equal(mesh.material.transparent,false);
    const shader={uniforms:{},vertexShader:THREE.ShaderLib.physical.vertexShader,fragmentShader:THREE.ShaderLib.physical.fragmentShader};
    mesh.material.onBeforeCompile(shader);
    assert.equal(shader.uniforms.uSweepCut,sweep.cut);
    assert.ok(shader.fragmentShader.includes("discard;"));
  }
  flow.dispose();a.dispose();b.dispose();
});
