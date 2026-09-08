import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// A chapter finish sequence: cobalt, petrol, sapphire, indigo, ocean, jade,
// blue-violet, midnight enamel, and back to the original cobalt.
export const SCULPTURE_COLORS = [0x236bd7,0x128b94,0x365dd2,0x6956c7,0x227ead,0x159b91,0x4853a8,0x245a86,0x236bd7];
const finishes=SCULPTURE_COLORS.map(hex=>new THREE.Color(hex));

export function finishColorAt(phase:number,out=new THREE.Color()) {
  const value=THREE.MathUtils.clamp(phase,0,8),index=Math.min(7,Math.floor(value));
  const t=value-index,blend=t*t*(3-2*t);
  return out.copy(finishes[index]).lerp(finishes[index+1],blend);
}

/** Shared desktop and mobile models with continuous machined surfaces. */
export function createSculptureModel(phase: number) {
  const group = new THREE.Group();
  const blue = new THREE.MeshPhysicalMaterial({ color:SCULPTURE_COLORS[phase], metalness:.68, roughness:.24, clearcoat:.48, clearcoatRoughness:.18, envMapIntensity:1.4, vertexColors:true });
  const silver = new THREE.MeshPhysicalMaterial({ color:0xd8e6f0, metalness:.88, roughness:.2 });
  const gold = new THREE.MeshPhysicalMaterial({ color:0xdcb673, metalness:.8, roughness:.23 });
  const dark = new THREE.MeshStandardMaterial({ color:0x0a192d, metalness:.42, roughness:.34 });
  const signal = new THREE.MeshStandardMaterial({color:0x99f1ef,emissive:0x26bbce,emissiveIntensity:.65,metalness:.25,roughness:.22});
  blue.name="anodized-body";silver.name="platinum-trim";gold.name="brass-details";dark.name="recessed-panels";signal.name="status-lights";
  const materials=[blue,silver,gold,dark,signal];
  function mesh(geometry: THREE.BufferGeometry, material: THREE.MeshStandardMaterial = blue, x=0,y=0,z=0) {
    const item = new THREE.Mesh(geometry, material);
    item.position.set(x,y,z); group.add(item); return item;
  }
  function box(w:number,h:number,d:number,x=0,y=0,z=0,material: THREE.MeshStandardMaterial=blue) {
    return mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(w,h,d)*.14),material,x,y,z);
  }
  function path(points:number[][],material: THREE.MeshStandardMaterial=silver,radius=.035) {
    for (let i=1;i<points.length;i++) {
      const a=new THREE.Vector3(...points[i-1] as [number,number,number]);
      const b=new THREE.Vector3(...points[i] as [number,number,number]);
      const rod=mesh(new THREE.CylinderGeometry(radius,radius,a.distanceTo(b),8),material);
      rod.position.copy(a).add(b).multiplyScalar(.5);
      rod.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());
    }
  }
  function ring(radius:number,x:number,y:number,z:number,material:THREE.MeshStandardMaterial=silver,tube=.025) {
    return mesh(new THREE.TorusGeometry(radius,tube,8,48),material,x,y,z);
  }
  function bolt(x:number,y:number,z:number,scale=1) {
    const cap=mesh(new THREE.CylinderGeometry(.045*scale,.045*scale,.022*scale,12),silver,x,y,z);cap.rotation.x=Math.PI/2;
    box(.047*scale,.009*scale,.006*scale,x,y,z+.014*scale,dark);
  }
  function cloud(scale=1,x=0,y=0) {
    const outline = new THREE.Shape();
    outline.moveTo(-1.45,-.8);
    outline.lineTo(1.4,-.8);
    outline.bezierCurveTo(2.15,-.8,2.16,.26,1.47,.35);
    outline.bezierCurveTo(1.43,1.37,.25,1.61,-.2,.86);
    outline.bezierCurveTo(-.66,1.4,-1.6,1.05,-1.5,.35);
    outline.bezierCurveTo(-2.3,.48,-2.32,-.8,-1.45,-.8);
    const shell=mesh(new THREE.ExtrudeGeometry(outline,{depth:.46,bevelEnabled:true,bevelSize:.085,bevelThickness:.08,bevelSegments:4,steps:1,curveSegments:40}),silver);
    shell.scale.set(scale*1.035,scale*1.035,scale);shell.position.set(x,y,-.3*scale);
    const body=mesh(new THREE.ExtrudeGeometry(outline,{depth:.48,bevelEnabled:true,bevelSize:.075,bevelThickness:.075,bevelSegments:4,steps:1,curveSegments:40}));
    body.scale.setScalar(scale);body.position.set(x,y,-.23*scale);
    const coords=(points:number[][])=>points.map(p=>[p[0]*scale+x,p[1]*scale+y,p[2]*scale]);
    const inset=outline.getPoints(70).map(p=>[p.x*.92*scale+x,p.y*.92*scale+y,.34*scale]);
    path(inset,silver,.012*scale);
    box(1.13*scale,.88*scale,.075*scale,x,y+.2*scale,.34*scale,dark);
    box(.7*scale,.7*scale,.08*scale,x,y+.2*scale,.4*scale,silver);
    box(.52*scale,.52*scale,.09*scale,x,y+.2*scale,.48*scale,gold);
    box(.34*scale,.34*scale,.035*scale,x,y+.2*scale,.54*scale,dark);
    box(.15*scale,.15*scale,.015*scale,x,y+.2*scale,.565*scale,signal);
    for(const sign of [-1,1]) {
      path(coords([[sign*.58,.22,.41],[sign*.91,.22,.41],[sign*.91,-.05,.41],[sign*1.35,-.05,.41]]),silver,.024*scale);
      path(coords([[sign*.4,-.3,.38],[sign*.4,-.46,.38],[sign*1.28,-.46,.38]]),gold,.014*scale);
      ring(.085*scale,x+sign*1.38*scale,y-.05*scale,.39*scale,gold,.021*scale);
      for(const dy of [-.16,0,.16])box(.15*scale,.055*scale,.04*scale,x+sign*.42*scale,y+(.2+dy)*scale,.43*scale,gold);
      bolt(x+sign*.49*scale,y+.55*scale,.39*scale,scale*.6);
      bolt(x+sign*.49*scale,y-.15*scale,.39*scale,scale*.6);
    }
    for(const dx of [-.18,0,.18])box(.08*scale,.035*scale,.025*scale,x+dx*scale,y-.59*scale,.35*scale,signal);
  }
  if (phase===0 || phase===8) cloud();
  if (phase===1) {
    box(3,1.85,.32,-.3,-.15);box(2.82,1.68,.035,-.3,-.15,.185,silver);box(2.67,1.51,.045,-.3,-.15,.215,dark);
    box(.22,.55,.3,-.3,-1.23,0,silver); box(1.25,.12,.7,-.3,-1.53,0,silver);
    box(3,.12,.7,-.3,-1.77,.3,silver);
    for (let x=-1.5;x<1;x+=.23) for (const z of [.1,.32,.54]) box(.16,.025,.15,x,-1.69,z,dark);
    path([[-1.3,.28,.255],[-.98,.03,.255],[-1.3,-.22,.255]],gold,.045);
    path([[-.76,-.22,.255],[-.26,-.22,.255]],silver);
    for(const [y,w] of [[.36,.52],[.13,.72],[-.46,.83]])box(w,.04,.018,-.85,y,.255,silver);
    box(.75,1.04,.024,.48,-.14,.253,blue);
    for(let i=0;i<4;i++)box(.09,.15+i*.12,.02,.22+i*.17,-.39+i*.06,.275,i===3?gold:signal);
    for(const x of [-1.48,-1.3,-1.12])ring(.028,x,.49,.257,signal,.012);
    box(2.25,.02,.02,-.3,-.73,.26,signal);
    bolt(-1.67,.67,.19,.55);bolt(1.07,.67,.19,.55);
    box(.35,.13,.53,1.43,-1.72,.3,blue);box(.015,.04,.15,1.43,-1.64,.25,silver);
    cloud(.4,.65,1.52);
  }
  if (phase===2) for (let col=-1;col<=1;col++) {
    box(1.12,3.35,.75,col*1.35,0,-.12,dark);
    for(const sign of [-1,1])box(.075,3.55,.98,col*1.35+sign*.59,0,-.12,silver);
    box(1.32,.14,1.05,col*1.35,-1.79,-.12,blue);
    for (let row=0;row<4;row++) {
      const y=1.23-row*.81,x=col*1.35;
      box(1.03,.66,.85,x,y);
      for (let vent=0;vent<4;vent++) box(.42,.035,.025,x-.14,y-.15+vent*.1,.44,dark);
      ring(.145,x+.27,y,.455,silver,.014);
      ring(.06,x+.27,y,.463,dark,.027);
      for(let blade=0;blade<5;blade++){const a=blade/5*Math.PI*2;path([[x+.27+Math.cos(a)*.05,y+Math.sin(a)*.05,.468],[x+.27+Math.cos(a+.55)*.12,y+Math.sin(a+.55)*.12,.468]],dark,.014);}
      box(.09,.045,.026,x-.17,y-.245,.457,signal);box(.055,.045,.026,x-.02,y-.245,.457,gold);
      for(const sign of [-1,1])bolt(x+sign*.43,y+.255,.455,.48);
      box(.05,.42,.04,x-.44,y,.45,silver);
    }
  }
  if (phase===3) {
    box(1.05,1.05,.3,0,0,-.1,silver);box(.86,.86,.38,0,0,.1,gold);box(.6,.6,.045,0,0,.315,dark);box(.36,.36,.035,0,0,.355,blue);
    for(const x of [-.1,.1])for(const y of [-.1,.1])box(.13,.13,.025,x,y,.382,signal);
    for (let i=0;i<6;i++) {
      const a=i/6*Math.PI*2,x=Math.cos(a)*1.72,y=Math.sin(a)*1.72;
      path([[0,0,-.12],[x,y,-.12]],silver,.045);
      box(.8,.8,.34,x,y,0,silver);box(.7,.7,.43,x,y);box(.46,.46,.055,x,y,.25,dark);
      box(.27,.27,.025,x,y,.292,blue);box(.08,.08,.014,x,y,.314,signal);
      for(const dx of [-.12,.12])path([[x+dx,y+.24,.28],[x+dx,y+.33,.28]],gold,.012);
      for (const dx of [-.2,0,.2]) for (const sign of [-1,1]) box(.075,.17,.07,x+dx,y+sign*.44,.05,gold);
    }
  }
  if (phase===4) {
    const pin=new THREE.Shape(); pin.moveTo(0,-1.45);
    pin.bezierCurveTo(-.7,-.5,-1.28,.15,-1.28,.75);
    pin.bezierCurveTo(-1.28,2.4,1.28,2.4,1.28,.75);
    pin.bezierCurveTo(1.28,.15,.7,-.5,0,-1.45);
    mesh(new THREE.ExtrudeGeometry(pin,{depth:.34,bevelEnabled:true,bevelSize:.07,bevelThickness:.06,bevelSegments:3,curveSegments:32}),blue,0,0,-.17);
    ring(.81,0,.77,.27,silver,.027);ring(.89,0,.77,.265,gold,.012);
    path([[-.35,.15,.3],[-.35,1.32,.3],[.36,1.32,.3],[.49,1.08,.3],[.36,.78,.3],[-.35,.78,.3]],gold,.075);
    box(3.7,.13,1.8,0,-1.7,0,dark);
    for (const x of [-1.6,-.55,.55,1.6]) path([[x,-1.62,-.75],[x,-1.62,.75]],silver,.025);
    for (const x of [-1.05,1.05]) {
      box(.58,.24,1.05,x,-1.48,0);box(.44,.18,.47,x,-1.27,-.06,silver);
      box(.37,.02,.18,x,-1.17,.1,dark);box(.35,.02,.12,x,-1.17,-.21,dark);
      for(const sign of [-1,1]) {
        box(.09,.055,.025,x+sign*.17,-1.44,.54,signal);
        for(const z of [-.32,.32]){const wheel=mesh(new THREE.CylinderGeometry(.09,.09,.06,16),dark,x+sign*.29,-1.54,z);wheel.rotation.z=Math.PI/2;}
      }
    }
    for(const z of [-.55,-.15,.25,.65])box(.025,.015,.17,0,-1.62,z,gold);
    for(const x of [-1.78,1.78]){box(.065,.55,.065,x,-1.36,-.67,silver);box(.11,.1,.11,x,-1.06,-.67,signal);}
  }
  if (phase===5) {
    cloud(.8,0,.9);
    path([[-1.8,-.52,.32],[-1.2,-.52,.32],[-.9,.03,.32],[-.55,-1.13,.32],[-.12,-.25,.32],[.3,-.7,.32],[1.8,-.7,.32]],gold,.04);
    for (const x of [-1.3,0,1.3]) { path([[x,-.9,0],[x,-1.7,0]]); box(.9,.53,.5,x,-1.92);box(.73,.36,.035,x,-1.92,.273,dark);
      for(let i=0;i<4;i++)box(.1,.06+i*.035,.02,x-.23+i*.15,-2.01+i*.0175,.3,i===3?gold:signal);
      for(const sign of [-1,1])bolt(x+sign*.36,-1.73,.279,.45); }
  }
  if (phase===6) {
    mesh(new THREE.CylinderGeometry(1,1,1.05,64),blue,0,-.1,0);
    box(3.18,.075,3.18,0,.49,0,silver);box(3.1,.19,3.1,0,.56,0);
    path([[-1.4,.662,-1.4],[1.4,.662,-1.4],[1.4,.662,1.4],[-1.4,.662,1.4],[-1.4,.662,-1.4]],gold,.012);
    const band=mesh(new THREE.CylinderGeometry(1.012,1.012,.1,64),silver,0,-.5,0);band.name="graduation-band";
    path([[0,.7,0],[1.65,.7,.2],[1.65,-.85,.2]],gold,.045);
    ring(.07,1.65,-.84,.2,silver,.018);
    for(const dx of [-.08,-.04,0,.04,.08])path([[1.65+dx,-.87,.2],[1.65+dx,-1.33,.2]],gold,.018);
    mesh(new THREE.SphereGeometry(.1,16,8),gold,0,.75,0);
  }
  if (phase===7) {
    const disk=mesh(new THREE.CylinderGeometry(1.23,1.23,.24,64),gold,0,.35,0); disk.rotation.x=Math.PI/2;
    const face=mesh(new THREE.CylinderGeometry(1.04,1.04,.27,64),blue,0,.35,0); face.rotation.x=Math.PI/2;
    ring(1.13,0,.35,.16,silver,.018);ring(.97,0,.35,.175,gold,.02);
    for(let i=0;i<36;i++){const a=i/36*Math.PI*2;path([[Math.cos(a)*1.17,.35+Math.sin(a)*1.17,.14],[Math.cos(a)*1.22,.35+Math.sin(a)*1.22,.14]],silver,.012);}
    const star=new THREE.Shape();
    for(let i=0;i<10;i++) { const a=i/10*Math.PI*2+Math.PI/2,r=i%2?.38:.8; if(i===0)star.moveTo(Math.cos(a)*r,Math.sin(a)*r); else star.lineTo(Math.cos(a)*r,Math.sin(a)*r); } star.closePath();
    mesh(new THREE.ExtrudeGeometry(star,{depth:.07,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:2}),gold,0,.35,.16);
    for (const sign of [-1,1]) { const ribbon=box(.65,1.5,.13,sign*.55,-1.17,-.12);ribbon.rotation.z=sign*-.28;
      for(const stripe of [-.19,.19]){const trim=box(.045,1.42,.014,sign*.55+stripe,-1.17,-.039,gold);trim.rotation.z=sign*-.28;} }
    for(let i=0;i<12;i++) { const a=i/12*Math.PI*2; mesh(new THREE.SphereGeometry(.035,8,6),silver,Math.cos(a)*.95,.35+Math.sin(a)*.95,.17); }
  }
  // Parts share a rigid silhouette. Bake their transforms and merge each
  // metal into one draw call, including the many vents and keyboard keys.
  group.updateMatrixWorld(true);
  for(const material of materials) {
    const parts=group.children.filter((item):item is THREE.Mesh=>item instanceof THREE.Mesh&&item.material===material);
    if(!parts.length)continue;
    const geometries=parts.map(part=>{
      const geometry=part.geometry.index?part.geometry.toNonIndexed():part.geometry.clone();
      geometry.applyMatrix4(part.matrixWorld);
      group.remove(part);part.geometry.dispose();return geometry;
    });
    const merged=mergeGeometries(geometries);
    geometries.forEach(geometry=>geometry.dispose());
    if(merged)group.add(new THREE.Mesh(merged,material));
  }
  // A broad finish gradient gives the flat machined panels depth without texture noise.
  const bounds=new THREE.Box3().setFromObject(group),height=Math.max(.1,bounds.max.y-bounds.min.y);
  for(const item of group.children) {
    const part=item as THREE.Mesh;
    if(part.material!==blue)continue;
    const positions=part.geometry.getAttribute("position"),colors=new Float32Array(positions.count*3);
    for(let i=0;i<positions.count;i++) {
      const t=(positions.getY(i)-bounds.min.y)/height;
      const shade=.54+.67*t;
      colors.set([shade*.9,shade,Math.min(1.2,shade*1.12)],i*3);
    }
    part.geometry.setAttribute("color",new THREE.BufferAttribute(colors,3));
  }
  function setFinish(scrollPhase:number,motion=0) {
    finishColorAt(scrollPhase,blue.color);
    blue.roughness=.24-Math.min(1,Math.max(0,motion))*.045;
    signal.emissiveIntensity=.65+Math.min(1,Math.max(0,motion))*.55;
  }
  return { group, setFinish, dispose:()=>{ group.traverse(item=>{if(item instanceof THREE.Mesh)item.geometry.dispose();}); materials.forEach(material=>material.dispose()); } };
}
