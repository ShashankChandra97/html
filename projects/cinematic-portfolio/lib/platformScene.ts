import * as THREE from "three";
import { createSculptureModel } from "./sculptureModels";
import { attachSurfaceSweep, createPixelFlow, sampleSurface } from "./surfaceMorph";
import { createStudioEnvironment } from "./studioEnvironment";
import { buildSceneTransitions, phaseAtScroll, staticPhaseAtScroll, type SceneTransition } from "./sceneTiming";

type SceneOptions = {
  reducedMotion: boolean;
  onReady: () => void;
  onFailure: () => void;
};

const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
const smooth = (value: number) => value * value * (3 - 2 * value);
const vector = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const rotation = (x: number, y: number, z: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));

/** All poses are a pure function of document scroll; no continuous animation loop. */
export function createPlatformScene(host: HTMLDivElement, options: SceneOptions) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0xf5f7fa, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 80);
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const environment = createStudioEnvironment(renderer);
  scene.environment = environment.texture;

  const key = new THREE.DirectionalLight(0xffffff, 3);
  key.position.set(3.5, 6, 5);
  const fill = new THREE.DirectionalLight(0xbae3ff, 0.65);
  fill.position.set(-5, 1, 2);
  const rim = new THREE.DirectionalLight(0xffffff, 2.2);
  rim.position.set(3, -1, -5);
  scene.add(key, fill, rim, new THREE.HemisphereLight(0xffffff, 0x52606d, 0.85));

  // Desktop and mobile share exactly the same continuous, closed model surfaces.
  const models = Array.from({length:9},(_,phase)=>{
    const model=createSculptureModel(phase);
    const center=new THREE.Box3().setFromObject(model.group).getCenter(new THREE.Vector3());
    model.group.traverse(item=>{if(item instanceof THREE.Mesh)item.geometry.translate(-center.x,-center.y,-center.z);});
    const samples=sampleSurface(model.group);
    const sweep=attachSurfaceSweep(model.group);
    sculpture.add(model.group);
    return {...model,samples,sweep};
  });
  const pixels=createPixelFlow();sculpture.add(pixels.points);
  let connectedIndex=-1;
  const sceneRotations = [rotation(0,.06,0), rotation(0,-.08,0), rotation(0,.16,0), rotation(0,-.08,0), rotation(0,.06,0), rotation(0,-.06,0), rotation(.08,.28,-.08), rotation(0,-.06,0), rotation(0,.06,0)];
  const cameraPositions = [vector(2,1.2,9.8),vector(.6,.4,10.4),vector(2,1.6,10.5),vector(.6,.5,10.6),vector(.5,.4,10.2),vector(.5,.35,10.8),vector(3.3,4.8,8.8),vector(.5,.3,10.2),vector(2,1.2,9.8)];
  const screenSides = [1,-1,1,-1,1,-1,1,-1,1];
  let viewportWidth = 1;
  let viewportHeight = 1;
  let currentPhase = 0;
  let resizeFrame = 0;
  let scrollFrame = 0;
  let alive = true;
  let transitions: SceneTransition[] = [];

  function render(phase = currentPhase) {
    if (!alive) return;
    currentPhase = clamp(phase, 0, models.length - 1);
    const index = Math.min(models.length - 2, Math.floor(currentPhase));
    const progress = currentPhase-index;
    const blend = smooth(progress);
    for(const model of models)model.group.visible=false;
    const from=models[index],to=models[index+1];
    const finishPhase=index+blend;
    const energy=options.reducedMotion?0:Math.sin(progress*Math.PI);
    from.setFinish(finishPhase,energy);to.setFinish(finishPhase,energy);
    from.group.visible=progress<.32;
    from.sweep.incoming.value=0;
    from.sweep.cut.value=(progress-.04)/.28;
    to.group.visible=progress>.68;
    to.sweep.incoming.value=1;
    to.sweep.cut.value=(progress-.68)/.28;
    pixels.points.visible=progress>.04&&progress<.96;
    if(connectedIndex!==index){pixels.connect(from.samples,to.samples);connectedIndex=index;}
    pixels.uniforms.progress.value=progress;
    sculpture.quaternion.slerpQuaternions(sceneRotations[index], sceneRotations[index + 1], blend);
    camera.position.lerpVectors(cameraPositions[index], cameraPositions[index + 1], blend);
    const side = mix(screenSides[index],screenSides[index+1],blend);
    camera.setViewOffset(viewportWidth,viewportHeight,-viewportWidth*.245*side,0,viewportWidth,viewportHeight);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    renderer.render(scene, camera);
    host.dataset.phase = currentPhase.toFixed(3);
    host.dataset.transition = pixels.points.visible ? "pixel-flow" : "solid";
    host.dataset.drawCalls = String(renderer.info.render.calls);
  }

  function measure() {
    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-core-phase]"))
      .map((element) => {
        const content = element.querySelector<HTMLElement>(":scope > .section-heading, :scope > .reading-column") ?? element;
        return { top: content.getBoundingClientRect().top + window.scrollY, phase: Number(element.dataset.corePhase) };
      })
      .filter((anchor) => Number.isFinite(anchor.phase))
      .sort((a, b) => a.top - b.top);
    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 88;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    transitions = buildSceneTransitions(anchors, window.innerHeight, headerHeight, maxScroll);
  }

  function updateScroll() {
    scrollFrame=0;
    if(!alive)return;
    const phase = options.reducedMotion
      ? staticPhaseAtScroll(transitions, window.scrollY)
      : phaseAtScroll(transitions, window.scrollY);
    render(phase);
  }

  function queueScroll() {
    // Safari can throttle rAF for an occluded window. A scroll or accessibility
    // action must still update the pose; there is no idle animation to keep alive.
    if(document.hidden)updateScroll();
    else if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);
  }

  function resize() {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    viewportWidth = width; viewportHeight = height;
    const pixelRatio=Math.min(window.devicePixelRatio || 1,2);
    renderer.setPixelRatio(pixelRatio);pixels.uniforms.pixelRatio.value=pixelRatio;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // A full-viewport render with an off-axis lens reserves real negative space
    // for the HTML column without moving the sculpture into a distorted frustum.
    camera.setViewOffset(width, height, -width * 0.235, 0, width, height);
    camera.updateProjectionMatrix();
    measure();
    updateScroll();
  }

  function queueResize() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(resize);
  }

  function handleVisibility() {
    if (!document.hidden) { measure(); updateScroll(); }
  }

  function contextLost(event: Event) {
    event.preventDefault();
    alive = false;
    options.onFailure();
  }

  function contextRestored() {
    alive = true;
    resize();
    options.onReady();
  }

  const observer = new ResizeObserver(queueResize);
  observer.observe(host);
  resize();
  options.onReady();
  window.addEventListener("scroll",queueScroll,{passive:true});
  document.addEventListener("visibilitychange", handleVisibility);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
  // Font metrics may settle after the canvas initializes.
  void document.fonts.ready.then(() => {
    if (alive) { measure(); updateScroll(); }
  });

  return () => {
    alive = false;
    cancelAnimationFrame(resizeFrame);
    cancelAnimationFrame(scrollFrame);
    window.removeEventListener("scroll",queueScroll);
    observer.disconnect();
    document.removeEventListener("visibilitychange", handleVisibility);
    renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
    models.forEach(model=>model.dispose());
    pixels.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
