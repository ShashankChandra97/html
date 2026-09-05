import { Vector3 } from "three";

export type FormationPoint = { position: Vector3; scale: number; gold: boolean };
const point = (x: number, y: number, z = 0, scale = 1, gold = false): FormationPoint => ({ position: new Vector3(x, y, z), scale, gold });

function line(out: FormationPoint[], vertices: number[][], step = 0.22, gold = false) {
  for (let i = 1; i < vertices.length; i++) {
    const a = new Vector3(...vertices[i - 1] as [number, number, number]);
    const b = new Vector3(...vertices[i] as [number, number, number]);
    const steps = Math.max(1, Math.ceil(a.distanceTo(b) / (step * .6)));
    for (let j = 0; j < steps; j++) {
      const p = a.clone().lerp(b, j / steps);
      out.push(point(p.x, p.y, p.z, 0.86, gold));
    }
  }
}
function ring(out: FormationPoint[], radius: number, cx = 0, cy = 0, z = 0, gold = false) {
  const n = Math.ceil(radius * 2 * Math.PI / 0.12);
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2;
    out.push(point(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, z, 0.9, gold));
  }
}
function cloud(out: FormationPoint[], scale = 1, offset = new Vector3()) {
  const lobes = [[-1.2, 0, .84], [-.5, .65, 1], [.55, .53, 1.13], [1.38, -.04, .74]];
  for (let x = -2.04; x <= 2.08; x += .17) {
    for (let y = -.85; y <= 1.7; y += .17) {
      for (let z = -.56; z <= .57; z += .17) {
        if (lobes.some(([cx, cy, r]) => (x-cx)**2 + (y-cy)**2 + z*z * 1.6 < r*r) && y > -.72) {
          out.push(point(x * scale + offset.x, y * scale + offset.y, z * scale + offset.z, scale));
        }
      }
    }
  }
}

/** Original procedural silhouettes; all formations reuse the same instanced modules. */
export function createFormations(count: number): FormationPoint[][] {
  const shapes: FormationPoint[][] = Array.from({ length: 9 }, () => []);
  cloud(shapes[0]);
  // Workstation and the connected cloud: screen, feet, keyboard, cloud above.
  for (const z of [-.16, .16]) {
    line(shapes[1], [[-1.85,.75,z],[1.15,.75,z],[1.15,-1.1,z],[-1.85,-1.1,z],[-1.85,.75,z]]);
    line(shapes[1], [[-.35,-1.1,z],[-.35,-1.55,z],[-1.15,-1.55,z],[.45,-1.55,z]]);
    line(shapes[1], [[-2,-1.9,z],[1.5,-1.9,z],[1.15,-1.7,z],[-1.65,-1.7,z],[-2,-1.9,z]]);
  }
  cloud(shapes[1], .47, new Vector3(.85,1.55,0));
  line(shapes[1], [[-1.25,0,.2],[-.9,.25,.2],[-1.25,.5,.2]],.16,true);
  line(shapes[1], [[-.4,0,.2],[.25,0,.2]],.16,true);
  // Three racks: discrete, stacked infrastructure modules with data lanes.
  for (let col = -1; col <= 1; col++) {
    for (let row = 0; row < 4; row++) {
      const cx = col * 1.5, cy = 1.3 - row * .78;
      for (const z of [-.3,0,.3]) {
        line(shapes[2], [[cx-.51,cy+.24,z],[cx+.51,cy+.24,z],[cx+.51,cy-.24,z],[cx-.51,cy-.24,z],[cx-.51,cy+.24,z]]);
      }
    }
  }
  // Capability graph: six distributed processing nodes and physical connections.
  for (let node = 0; node < 6; node++) {
    const a = node / 6 * Math.PI * 2;
    const cx = Math.cos(a) * 1.9, cy = Math.sin(a) * 1.9;
    for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) for (let z = -2; z <= 2; z++) {
      shapes[3].push(point(cx+x*.115,cy+y*.115,z*.115,.83));
    }
    line(shapes[3], [[cx,cy,0],[0,0,0]],.18,true);
  }
  ring(shapes[3],.47,0,0,.1,true);
  // Star-Ways: dimensional location pin, P glyph, and a street-level parking plane.
  for (const z of [-.25,0,.25]) {
    const path: number[][] = [];
    for (let i = 0; i <= 36; i++) {
      const a = Math.PI * (-.16 + i / 36 * 1.32);
      path.push([Math.cos(a)*1.35,Math.sin(a)*1.35+.6,z]);
    }
    path.push([0,-1.65,z],path[0]);
    line(shapes[4],path);
  }
  line(shapes[4], [[-.36,-.08,.33],[-.36,1.22,.33],[.4,1.22,.33],[.58,.98,.33],[.4,.65,.33],[-.36,.65,.33]],.16,true);
  for (const z of [-.9,-.45,0,.45,.9]) line(shapes[4], [[-1.7,-1.9,z],[1.7,-1.9,z]],.26);
  // CloudVeyra: cloud resource layer connected to a legible telemetry waveform.
  cloud(shapes[5],.83,new Vector3(0,.7,0));
  line(shapes[5], [[-2,-.6,.25],[-1.35,-.6,.25],[-1.05,.02,.25],[-.65,-1.28,.25],[-.2,.05,.25],[.25,-.7,.25],[.6,-.3,.25],[.95,-.7,.25],[2,-.7,.25]],.15,true);
  for (const x of [-1.45,0,1.45]) {
    line(shapes[5],[[x,-1,0],[x,-1.75,0]],.19);
    line(shapes[5],[[x-.36,-1.8,0],[x+.36,-1.8,0],[x+.36,-2.13,0],[x-.36,-2.13,0],[x-.36,-1.8,0]],.16);
  }
  // Graduation: solid mortarboard in the XZ plane, cylindrical band and tassel.
  for (let x = -1.6; x <= 1.61; x += .145) for (let z = -1.6; z <= 1.61; z += .145) shapes[6].push(point(x,.7,z,.85));
  for (let y = -.65; y <= .41; y += .145) for (let i = 0; i < 58; i++) {
    const a = i/58*Math.PI*2;
    shapes[6].push(point(Math.cos(a)*1.02,y,Math.sin(a)*1.02,.84));
  }
  line(shapes[6],[[0,.88,0],[1.8,.88,.2],[1.8,-.9,.2],[1.7,-1.25,.2],[1.95,-1.25,.2],[1.8,-.9,.2]],.13,true);
  // Credentials: a layered medallion, five-point star and two ribbon tails.
  for (const z of [-.24,0,.24]) { ring(shapes[7],1.23,0,.3,z,true); ring(shapes[7],1.02,0,.3,z,true); }
  const star: number[][] = [];
  for (let i = 0; i <= 10; i++) { const a = i/10*Math.PI*2+Math.PI/2; const r = i%2 ? .35 : .76; star.push([Math.cos(a)*r,.3+Math.sin(a)*r,.3]); }
  line(shapes[7],star,.12,true);
  for (const sign of [-1,1]) for (let band = 0; band < 3; band++) {
    line(shapes[7],[[sign*.5,-.68,-.15],[sign*(.9+band*.15),-2,-.15],[sign*.52,-1.7,-.15],[sign*.15,-1.98,-.15],[sign*.18,-.85,-.15]],.17);
  }
  cloud(shapes[8],.9);
  // Arc-length-like uniform resampling keeps every silhouette complete regardless
  // of complexity, while slight depth offsets avoid coincident duplicate modules.
  return shapes.map(shape => Array.from({ length: count }, (_, i) => {
    const sourceIndex = Math.floor(i / count * shape.length);
    const source = shape[sourceIndex];
    const position = source.position.clone();
    if (shape.length < count) {
      const duplicate = i - Math.ceil(sourceIndex * count / shape.length);
      const copies = Math.ceil((sourceIndex + 1) * count / shape.length) - Math.ceil(sourceIndex * count / shape.length);
      position.z += (duplicate - (copies - 1) / 2) * .11;
    }
    return { ...source, position };
  }));
}
