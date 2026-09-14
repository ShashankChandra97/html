import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import * as THREE from "three";
import {mergeGeometries} from "three/addons/utils/BufferGeometryUtils.js";
import {RoundedBoxGeometry} from "three/addons/geometries/RoundedBoxGeometry.js";

test("native scroll drives solid-pixel-solid poses, including Safari background scroll and reverse",()=>{
  const callbacks=new Map(),frames=new Map();let nextFrame=0,scene,renderCount=0;
  const events={addEventListener:(key,fn)=>callbacks.set(key,fn),removeEventListener:key=>callbacks.delete(key)};
  const window={...events,innerHeight:800,scrollY:0,devicePixelRatio:1};
  const host={clientWidth:1280,clientHeight:800,dataset:{},appendChild(){}};
  const document={hidden:false,...events,documentElement:{scrollHeight:11000},fonts:{ready:Promise.resolve()},
    querySelector:()=>({getBoundingClientRect:()=>({height:76})}),
    querySelectorAll:()=>Array.from({length:9},(_,i)=>({dataset:{corePhase:String(i)},querySelector:()=>null,getBoundingClientRect:()=>({top:i*1200-window.scrollY})})),
  };
  class Renderer {
    domElement={...events,setAttribute(){},remove(){}};
    info={render:{calls:1}};
    setClearColor(){}setPixelRatio(){}setSize(){}dispose(){}
    render(current){scene=current;renderCount++;}
  }
  const cache={};
  function load(name){
    if(name==="three")return {...THREE,WebGLRenderer:Renderer};
    if(name.includes("RoundedBoxGeometry"))return {RoundedBoxGeometry};
    if(name.includes("BufferGeometryUtils"))return {mergeGeometries};
    if(name==="./studioEnvironment")return {createStudioEnvironment:()=>({texture:new THREE.Texture(),dispose(){}})};
    if(cache[name])return cache[name];
    const api={};cache[name]=api;
    runInNewContext(ts.transpileModule(readFileSync(new URL(`../lib/${name.replace("./","")}.ts`,import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,
      {exports:api,require:load,window,document,ResizeObserver:class {observe(){}disconnect(){}},requestAnimationFrame:fn=>{frames.set(++nextFrame,fn);return nextFrame;},cancelAnimationFrame:id=>frames.delete(id)});
    return api;
  }
  const {createPlatformScene}=load("./platformScene");
  let ready=false;
  const dispose=createPlatformScene(host,{reducedMotion:false,onReady:()=>{ready=true;},onFailure:()=>assert.fail("scene failed")});
  assert.ok(ready);assert.equal(host.dataset.transition,"solid");
  function scroll(y,hidden=false){document.hidden=hidden;window.scrollY=y;callbacks.get("scroll")();for(const [id,fn] of [...frames]){frames.delete(id);fn();}}
  scroll(796);assert.equal(host.dataset.phase,"0.500");assert.equal(host.dataset.transition,"pixel-flow");
  const pixelObject=scene.children.find(item=>item instanceof THREE.Group).children.find(item=>item instanceof THREE.Points);
  assert.ok(pixelObject.visible);
  scroll(1056);assert.equal(host.dataset.phase,"1.000");assert.equal(host.dataset.transition,"solid");assert.equal(pixelObject.visible,false);
  scroll(796,true);assert.equal(host.dataset.phase,"0.500");assert.ok(pixelObject.visible,"background/accessibility scrolling must update the rendered pose");
  scroll(0);assert.equal(host.dataset.phase,"0.000");assert.equal(pixelObject.visible,false);
  assert.ok(renderCount>=5);
  dispose();assert.equal(callbacks.has("scroll"),false);
});
