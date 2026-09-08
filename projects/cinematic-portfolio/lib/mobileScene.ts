import * as THREE from "three";
import { createSculptureModel } from "./sculptureModels";
import { createStudioEnvironment } from "./studioEnvironment";

/** One lightweight context paints only the inline models currently on screen. */
export function createMobileScene(host: HTMLDivElement, reducedMotion: boolean, onFailure:()=>void, onReady:()=>void) {
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.95;
  host.appendChild(renderer.domElement);
  const environment=createStudioEnvironment(renderer);
  const camera=new THREE.PerspectiveCamera(33,1,.1,60);
  const entries=Array.from(document.querySelectorAll<HTMLElement>("[data-mobile-model]")).map(slot=>{
    const phase=Number(slot.dataset.mobileModel);
    const model=createSculptureModel(phase);
    const scene=new THREE.Scene(); scene.environment=environment.texture; scene.add(model.group);
    const key=new THREE.DirectionalLight(0xffffff,3); key.position.set(-3,5,7);
    const fill=new THREE.DirectionalLight(0xbae3ff,1); fill.position.set(4,1,3);
    scene.add(key,fill,new THREE.HemisphereLight(0xffffff,0x293747,1));
    const bounds=new THREE.Box3().setFromObject(model.group);
    const center=bounds.getCenter(new THREE.Vector3());
    model.group.position.sub(center);
    return {slot,phase,model,scene,radius:bounds.getBoundingSphere(new THREE.Sphere()).radius};
  });
  let frame=0,alive=true;
  function render() {
    frame=0;
    if(!alive)return;
    const width=host.clientWidth,height=host.clientHeight;
    if(renderer.domElement.clientWidth!==width||renderer.domElement.clientHeight!==height)renderer.setSize(width,height,false);
    renderer.setScissorTest(false); renderer.setClearColor(0x000000,0); renderer.clear();
    renderer.setScissorTest(true);
    for(const {slot,phase,model,scene,radius} of entries) {
      const rect=slot.getBoundingClientRect();
      if(rect.bottom<=0||rect.top>=height||rect.width===0)continue;
      const progress=THREE.MathUtils.clamp((height/2-(rect.top+rect.height/2))/height,-.5,.5);
      model.setFinish(phase+(reducedMotion?0:progress*.65),reducedMotion?0:Math.abs(progress)*.7);
      model.group.rotation.set(phase===6?.32:.07, reducedMotion?-.14:-.14+progress*.24,0);
      camera.aspect=rect.width/rect.height;
      const halfFov=Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*Math.min(1,camera.aspect));
      camera.position.set(0,phase===6?.7:.15,radius/Math.sin(halfFov)*1.04);
      camera.lookAt(0,0,0); camera.updateProjectionMatrix();
      renderer.setViewport(rect.left,height-rect.bottom,rect.width,rect.height);
      renderer.setScissor(rect.left,height-rect.bottom,rect.width,rect.height);
      renderer.render(scene,camera);
    }
  }
  function queue(){if(!alive)return;if(document.hidden)render();else if(!frame)frame=requestAnimationFrame(render);}
  function lost(event:Event){event.preventDefault();alive=false;onFailure();}
  function restored(){alive=true;render();onReady();}
  function resized(){renderer.setSize(host.clientWidth,host.clientHeight,false);queue();}
  const observer=new ResizeObserver(resized); observer.observe(host);
  entries.forEach(({slot})=>observer.observe(slot));
  window.addEventListener("scroll",queue,{passive:true});
  window.addEventListener("resize",resized);
  document.addEventListener("visibilitychange",queue);
  renderer.domElement.addEventListener("webglcontextlost",lost);
  renderer.domElement.addEventListener("webglcontextrestored",restored);
  renderer.setSize(host.clientWidth,host.clientHeight,false); render();
  void document.fonts.ready.then(queue);
  return ()=>{
    alive=false;cancelAnimationFrame(frame);observer.disconnect();
    window.removeEventListener("scroll",queue);window.removeEventListener("resize",resized);
    document.removeEventListener("visibilitychange",queue);
    renderer.domElement.removeEventListener("webglcontextlost",lost);renderer.domElement.removeEventListener("webglcontextrestored",restored);
    entries.forEach(({model})=>model.dispose());environment.dispose();renderer.dispose();renderer.domElement.remove();
  };
}
