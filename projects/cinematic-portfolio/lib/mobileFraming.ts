import { MathUtils, Quaternion, Vector3 } from "three";

/** Fit the actual moving modules into the canvas, including their bevels and flight arcs. */
export function mobileCameraDistance(points: Vector3[], sculptureRotation: Quaternion, cameraRotation: Quaternion, verticalFov: number, aspect: number): number {
  const tanY = Math.tan(MathUtils.degToRad(verticalFov) / 2);
  const tanX = tanY * Math.max(.1, aspect);
  const inverseCamera = cameraRotation.clone().invert();
  const projected = new Vector3();
  let distance = 1;
  for (const point of points) {
    projected.copy(point).applyQuaternion(sculptureRotation).applyQuaternion(inverseCamera);
    distance = Math.max(distance, projected.z + Math.max((Math.abs(projected.x) + .18) / tanX, (Math.abs(projected.y) + .18) / tanY));
  }
  return distance * 1.12;
}
