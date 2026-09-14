import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import ts from "typescript";
const api={};
runInNewContext(ts.transpileModule(readFileSync(new URL("../lib/photoParticles.ts",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:api});

test("photographic particles preserve foreground colors, exclude white, and reproduce the same mapping",()=>{
  const data=new Uint8ClampedArray([
    255,255,255,255, 40,80,120,255, 255,255,255,255,
    220,180,90,255, 255,255,255,255, 60,70,80,255,
  ]);
  const a=api.samplePhotoPixels(data,3,2,12),b=api.samplePhotoPixels(data,3,2,12);
  assert.deepEqual(a,b);
  assert.equal(a.positions.length,24);assert.equal(a.colors.length,36);
  for(let i=0;i<12;i++){
    const x=Math.floor(a.positions[i*2]*3),y=Math.floor(a.positions[i*2+1]*2),offset=(y*3+x)*4;
    assert.ok(Math.min(...data.slice(offset,offset+3))<236);
    for(let channel=0;channel<3;channel++)assert.ok(Math.abs(a.colors[i*3+channel]-data[offset+channel]/255)<1e-7);
    if(i)assert.ok(a.positions[i*2]>=a.positions[(i-1)*2],"sweep bands must remain spatially ordered");
  }
  assert.throws(()=>api.samplePhotoPixels(new Uint8ClampedArray(16).fill(255),2,2));
});

test("photographs stay complete at the endpoints and reassemble on the original particle schedule",()=>{
  assert.deepEqual({...api.photoSweep(0)},{outgoing:0,incoming:0,particles:false});
  assert.deepEqual({...api.photoSweep(.5)},{outgoing:1,incoming:0,particles:true});
  assert.deepEqual({...api.photoSweep(1)},{outgoing:1,incoming:1,particles:false});
  const positions=Array.from({length:101},(_,i)=>i/100);
  assert.deepEqual(positions.map(api.photoSweep),positions.toReversed().map(api.photoSweep).toReversed());
  for(const progress of [.12,.24,.76,.88]){
    const sweep=api.photoSweep(progress);
    const sourceRelease=.04+sweep.outgoing*.28,targetArrival=.68+sweep.incoming*.28;
    if(progress<.32)assert.ok(Math.abs(progress-sourceRelease)<1e-8);
    else assert.ok(Math.abs(progress-targetArrival)<1e-8);
  }
});
