import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import gsap from "gsap";
import { createFormations } from "./coreFormations";
import { mobileCameraDistance } from "./mobileFraming";
import { buildSceneTransitions, phaseAtScroll, type SceneTransition } from "./sceneTiming";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
const pose = (x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => ({ position: vector(x,y,z), rotation: rotation(rx,ry,rz) });

/** All poses are a pure function of document scroll; no continuous animation loop. */
export function createPlatformScene(host: HTMLDivElement, options: SceneOptions) {
  gsap.registerPlugin(ScrollTrigger);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0xf5f7fb, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 80);
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const environmentScene = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(environmentScene, 0.035);
  scene.environment = environment.texture;
  environmentScene.dispose();
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xf4f4e7, 5);
  key.position.set(3.5, 6, 5);
  const fill = new THREE.DirectionalLight(0x84ceff, 3.7);
  fill.position.set(-5, 1, 2);
  const rim = new THREE.DirectionalLight(0xf3ba75, 4);
  rim.position.set(3, -1, -5);
  scene.add(key, fill, rim, new THREE.AmbientLight(0xc7e5fa, 0.28));

  const chassisGeometry = new RoundedBoxGeometry(0.82, 0.82, 0.82, 2, 0.085);
  const panelGeometry = new RoundedBoxGeometry(0.665, 0.665, 0.032, 1, 0.015);
  const seamGeometry = new THREE.BoxGeometry(0.23, 0.012, 0.007);
  const chassisMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d77a6, roughness: 0.29, metalness: 0.74, envMapIntensity: 1.4,
  });
  const panelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.24, metalness: 0.68, clearcoat: 0.32,
    clearcoatRoughness: 0.24, envMapIntensity: 1.45,
  });
  const seamMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });

  const count = 1800;
  const states = createFormations(count);
  const modulePositions = Array.from({ length: count }, () => new THREE.Vector3());
  const chassis = new THREE.InstancedMesh(chassisGeometry, chassisMaterial, count);
  const panels = new THREE.InstancedMesh(panelGeometry, panelMaterial, count * 6);
  const seams = new THREE.InstancedMesh(seamGeometry, seamMaterial, count * 6);
  for (const mesh of [chassis, panels, seams]) {
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    sculpture.add(mesh);
  }
  const panelTransforms = [
    pose(0, 0, 0.421), pose(0, 0, -0.421, 0, Math.PI),
    pose(0.421, 0, 0, 0, Math.PI / 2), pose(-0.421, 0, 0, 0, -Math.PI / 2),
    pose(0, 0.421, 0, -Math.PI / 2), pose(0, -0.421, 0, Math.PI / 2),
  ];
  const panelMatrices = panelTransforms.map((face) =>
    new THREE.Matrix4().compose(face.position, face.rotation, vector(1, 1, 1)));
  const seamMatrices = panelMatrices.map((face) => face.clone().multiply(new THREE.Matrix4().makeTranslation(0, -0.237, 0.02)));
  const silver = new THREE.Color(0xb5d8f2);
  const graphite = new THREE.Color(0x5593c8);
  const warmMetal = new THREE.Color(0xe4af57);
  for (let i = 0; i < count; i++) {
    for (let face = 0; face < 6; face++) {
      panels.setColorAt(i * 6 + face, i === 6 || i === 19 ? warmMetal : i % 7 === 0 ? graphite : silver);
      seams.setColorAt(i * 6 + face, new THREE.Color(i === 6 || i === 19 ? 0xffbc72 : 0xa4d9ed));
    }
  }

  // Identical topology and independently computed normals make this a lit surface morph.
  const coreGeometry = new THREE.SphereGeometry(0.88, 64, 40);
  const cubeGeometry = coreGeometry.clone();
  const cubePositions = cubeGeometry.getAttribute("position");
  const point = new THREE.Vector3();
  for (let i = 0; i < cubePositions.count; i++) {
    point.fromBufferAttribute(cubePositions, i).normalize();
    const radius = 0.79 / Math.pow(Math.pow(Math.abs(point.x), 7) + Math.pow(Math.abs(point.y), 7) + Math.pow(Math.abs(point.z), 7), 1 / 7);
    point.multiplyScalar(radius);
    cubePositions.setXYZ(i, point.x, point.y, point.z);
  }
  cubeGeometry.computeVertexNormals();
  coreGeometry.morphAttributes.position = [cubePositions.clone()];
  coreGeometry.morphAttributes.normal = [cubeGeometry.getAttribute("normal").clone()];
  cubeGeometry.dispose();
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x71bad2, metalness: 0.78, roughness: 0.16,
    emissive: 0x17415a, emissiveIntensity: 0.28,
    clearcoat: 0.85, clearcoatRoughness: 0.12, envMapIntensity: 1.8,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  sculpture.add(core);

  const ringGeometry = new THREE.TorusGeometry(2.45, 0.018, 8, 144);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x6d92a4, metalness: 0.8, roughness: 0.3, emissive: 0x284f68,
    emissiveIntensity: 0.18, transparent: true, opacity: 0.58,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  sculpture.add(ring);

  const object = new THREE.Object3D();
  const faceMatrix = new THREE.Matrix4();
  const sceneRotations = [rotation(.04,.1,-.04), rotation(0,-.08,0), rotation(0,.16,0), rotation(0,-.08,0), rotation(0,.06,0), rotation(0,-.06,0), rotation(.08,.28,-.08), rotation(0,-.06,0), rotation(.04,.1,-.04)];
  const cameraPositions = [vector(2.7,1.6,9.4),vector(.6,.4,10.4),vector(2,1.6,10.5),vector(.6,.5,10.6),vector(.5,.4,10.2),vector(.5,.35,10.8),vector(3.3,4.8,8.8),vector(.5,.3,10.2),vector(2.7,1.6,9.4)];
  const screenSides = [1,-1,1,-1,1,-1,1,-1,1];
  const coreScales = [0,0,0,0.48,0,0,0,0,0];
  const coreMorph = [0,0,1,1,0,0,1,0,0];
  const ringOpacity = [.12,.05,.09,.25,.03,.08,.03,.02,.12];
  const panelColor = new THREE.Color();
  const seamColor = new THREE.Color();
  let viewportWidth = 1;
  let viewportHeight = 1;
  let mobile = false;
  let currentPhase = 0;
  let targetPhase = 0;
  let trigger: ScrollTrigger | undefined;
  let frame = 0;
  let alive = true;
  let transitions: SceneTransition[] = [];

  function render(phase = currentPhase) {
    if (!alive || document.hidden) return;
    currentPhase = clamp(phase, 0, states.length - 1);
    const index = Math.min(states.length - 2, Math.floor(currentPhase));
    const blend = smooth(currentPhase - index);
    for (let i = 0; i < count; i++) {
      const from = states[index][i];
      const to = states[index + 1][i];
      // A short, deterministic release gives each module a curved flight path.
      // Shared progress keeps the camera and modules together. A small symmetric
      // offset retains the wave of movement without letting early cubes rush ahead.
      const phaseProgress = currentPhase - index;
      const stagger = ((i % 13) / 12 - .5) * .07 * Math.sin(phaseProgress * Math.PI);
      const local = smooth(clamp(phaseProgress + stagger, 0, 1));
      const flight = Math.sin(local*Math.PI);
      object.position.lerpVectors(from.position, to.position, local);
      object.position.x += Math.sin(i*2.399)*flight*.46;
      object.position.y += Math.cos(i*1.618)*flight*.38;
      object.position.z += Math.sin(i*.73)*flight*.85;
      modulePositions[i].copy(object.position);
      object.quaternion.setFromEuler(new THREE.Euler(flight*Math.sin(i)*1.7,flight*Math.cos(i)*1.7,0));
      object.scale.setScalar(mix(from.scale,to.scale,local)*.18);
      object.updateMatrix();
      chassis.setMatrixAt(i, object.matrix);
      for (let face = 0; face < 6; face++) {
        panels.setMatrixAt(i * 6 + face, faceMatrix.multiplyMatrices(object.matrix, panelMatrices[face]));
        panelColor.copy(from.gold ? warmMetal : i % 9 === 0 ? graphite : silver).lerp(to.gold ? warmMetal : i % 9 === 0 ? graphite : silver,local);
        panels.setColorAt(i*6+face,panelColor);
        seamColor.set(from.gold || to.gold ? 0xf6c765 : 0x237ed4);
        seams.setColorAt(i*6+face,seamColor);
        seams.setMatrixAt(i * 6 + face, faceMatrix.multiplyMatrices(object.matrix, seamMatrices[face]));
      }
    }
    if (panels.instanceColor) panels.instanceColor.needsUpdate = true;
    if (seams.instanceColor) seams.instanceColor.needsUpdate = true;
    chassis.instanceMatrix.needsUpdate = panels.instanceMatrix.needsUpdate = seams.instanceMatrix.needsUpdate = true;
    const coreScale = mix(coreScales[index], coreScales[index + 1], blend);
    core.visible = coreScale > .01;
    core.scale.setScalar(Math.max(.001, coreScale));
    if (core.morphTargetInfluences) core.morphTargetInfluences[0] = mix(coreMorph[index], coreMorph[index + 1], blend);
    core.rotation.set(currentPhase * 0.11, currentPhase * 0.47, currentPhase * 0.13);
    core.position.set(0, 0, currentPhase > 3 ? -(currentPhase - 3) * 0.3 : 0);
    sculpture.quaternion.slerpQuaternions(sceneRotations[index], sceneRotations[index + 1], blend);
    camera.position.lerpVectors(cameraPositions[index], cameraPositions[index + 1], blend);
    if (mobile) {
      camera.lookAt(0, 0, 0);
      camera.position.setLength(mobileCameraDistance(modulePositions, sculpture.quaternion, camera.quaternion, camera.fov, camera.aspect));
    }
    const side = mix(screenSides[index],screenSides[index+1],blend);
    camera.setViewOffset(viewportWidth,viewportHeight,-viewportWidth*(mobile ? 0 : .245*side),0,viewportWidth,viewportHeight);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    ring.rotation.set(1.2 + currentPhase * 0.12, 0.1 + currentPhase * 0.22, currentPhase * 0.1);
    ringMaterial.opacity = mix(ringOpacity[index], ringOpacity[index + 1], blend);
    ring.scale.setScalar(currentPhase > 3 ? mix(1, 0.78, clamp((currentPhase - 3) / 2, 0, 1)) : 1);
    renderer.render(scene, camera);
    host.dataset.phase = currentPhase.toFixed(3);
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
    const stageHeight = mobile ? host.getBoundingClientRect().height : 0;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    transitions = buildSceneTransitions(anchors, window.innerHeight, headerHeight, maxScroll, stageHeight);
  }

  const playback = { phase: 0 };
  const followScroll = gsap.quickTo(playback, "phase", {
    duration: .4, ease: "power1.out", onUpdate: () => render(playback.phase),
  });
  const scrollTween = followScroll.tween;
  function updateScroll(immediate = false) {
    targetPhase = options.reducedMotion ? 0 : phaseAtScroll(transitions, window.scrollY);
    if (immediate || options.reducedMotion) {
      followScroll(targetPhase, targetPhase);
      followScroll.tween.pause();
      playback.phase = targetPhase;
      render(targetPhase);
    } else {
      followScroll(targetPhase);
    }
  }

  function resize() {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    mobile = window.matchMedia("(max-width: 767px), (pointer: coarse) and (max-width: 1024px)").matches;
    viewportWidth = width; viewportHeight = height;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // A full-viewport render with an off-axis lens reserves real negative space
    // for the HTML column without moving the sculpture into a distorted frustum.
    camera.setViewOffset(width, height, -width * (mobile ? 0 : 0.235), 0, width, height);
    camera.updateProjectionMatrix();
    measure();
    updateScroll(true);
  }

  function queueResize() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(resize);
  }

  function handleVisibility() {
    if (document.hidden) scrollTween?.pause();
    else updateScroll(true);
  }

  function contextLost(event: Event) {
    event.preventDefault();
    alive = false;
    scrollTween?.pause();
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
  if (!options.reducedMotion) {
    trigger = ScrollTrigger.create({
      start: 0, end: "max", onUpdate: () => updateScroll(),
      onRefresh: () => { measure(); updateScroll(true); },
    });
  }
  document.addEventListener("visibilitychange", handleVisibility);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
  // Font metrics may settle after the canvas initializes.
  void document.fonts.ready.then(() => {
    if (alive) { measure(); updateScroll(true); trigger?.refresh(); }
  });

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
    scrollTween?.kill();
    trigger?.kill();
    observer.disconnect();
    document.removeEventListener("visibilitychange", handleVisibility);
    renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
    for (const geometry of [chassisGeometry, panelGeometry, seamGeometry, coreGeometry, ringGeometry]) geometry.dispose();
    for (const material of [chassisMaterial, panelMaterial, seamMaterial, coreMaterial, ringMaterial]) material.dispose();
    chassis.dispose(); panels.dispose(); seams.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
