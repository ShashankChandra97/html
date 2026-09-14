export const PHOTO_PARTICLE_COUNT = 16000;

/** Deterministic foreground sampling retains the photograph's own colors and silhouette. */
export function samplePhotoPixels(data:Uint8ClampedArray,width:number,height:number,count=PHOTO_PARTICLE_COUNT) {
  const candidates:number[]=[];
  for(let x=0;x<width;x++)for(let y=0;y<height;y++) {
    const offset=(y*width+x)*4;
    // Leave the white studio background in place rather than turning it into a rectangle of dots.
    if(data[offset+3]>128 && Math.min(data[offset],data[offset+1],data[offset+2])<236) candidates.push(offset);
  }
  if(!candidates.length) throw new Error("The photograph has no visible foreground");
  const positions=new Float32Array(count*2),colors=new Float32Array(count*3);
  for(let i=0;i<count;i++) {
    const offset=candidates[Math.min(candidates.length-1,Math.floor((i+.5)*candidates.length/count))];
    const pixel=offset/4;
    positions[i*2]=(pixel%width+.5)/width;
    positions[i*2+1]=(Math.floor(pixel/width)+.5)/height;
    colors.set([data[offset]/255,data[offset+1]/255,data[offset+2]/255],i*3);
  }
  return {positions,colors};
}

/** Match the original solid → pixels → solid timing without changing image opacity. */
export function photoSweep(progress:number) {
  const clamp=(value:number)=>Math.max(0,Math.min(1,value));
  return {outgoing:clamp((progress-.04)/.28),incoming:clamp((progress-.68)/.28),particles:progress>.04&&progress<.96};
}
