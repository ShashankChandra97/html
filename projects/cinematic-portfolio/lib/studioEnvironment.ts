import * as THREE from "three";

/** Broad photographic softboxes give metal readable reflections across solid model surfaces. */
export function createStudioEnvironment(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x293747);
  const softboxes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];

  function softbox(width: number, height: number, position: [number, number, number], intensity: number, tint = 0xffffff) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(intensity), side: THREE.DoubleSide }),
    );
    panel.position.set(...position);
    panel.lookAt(0, 0, 0);
    studio.add(panel);
    softboxes.push(panel);
  }

  softbox(5, 6, [-3, 4, 6], 3.5);
  softbox(1.8, 7, [5, 1, 2], 4);
  softbox(4, 5, [-5, 0, 1], 1.5, 0xbae3ff);
  softbox(6, 4, [0, 6, -3], 3);
  softbox(3, 5, [1, 1, -6], 2);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, 0.045);
  for (const panel of softboxes) {
    panel.geometry.dispose();
    panel.material.dispose();
  }
  pmrem.dispose();
  return environment;
}
