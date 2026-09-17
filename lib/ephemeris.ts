import { bodyBySlug, J2000, type CelestialBody } from './bodies.ts';

// JPL Table 1: elements and rates per Julian century, 1800–2050.
// Order: a (AU), e, I, L, longitude of perihelion, ascending node (degrees).
export const elements: Record<string, number[][]> = {
  mercury: [[.38709927,.20563593,7.00497902,252.25032350,77.45779628,48.33076593],[.00000037,.00001906,-.00594749,149472.67411175,.16047689,-.12534081]],
  venus: [[.72333566,.00677672,3.39467605,181.97909950,131.60246718,76.67984255],[.00000390,-.00004107,-.00078890,58517.81538729,.00268329,-.27769418]],
  earth: [[1.00000261,.01671123,-.00001531,100.46457166,102.93768193,0],[.00000562,-.00004392,-.01294668,35999.37244981,.32327364,0]],
  mars: [[1.52371034,.09339410,1.84969142,-4.55343205,-23.94362959,49.55953891],[.00001847,.00007882,-.00813131,19140.30268499,.44441088,-.29257343]],
  jupiter: [[5.202887,.04838624,1.30439695,34.39644051,14.72847983,100.47390909],[-.00011607,-.00013253,-.00183714,3034.74612775,.21252668,.20469106]],
  saturn: [[9.53667594,.05386179,2.48599187,49.95424423,92.59887831,113.66242448],[-.0012506,-.00050991,.00193609,1222.49362201,-.41897216,-.28867794]],
  uranus: [[19.18916464,.04725744,.77263783,313.23810451,170.9542763,74.01692503],[-.00196176,-.00004397,-.00242939,428.48202785,.40805281,.04240589]],
  neptune: [[30.06992276,.00859048,1.77004347,-55.12002969,44.96476227,131.78422574],[.00026291,.00005105,.00035372,218.45945325,-.32241464,-.00508664]],
};
const RAD = Math.PI / 180;
export const MIN_TIME = Date.UTC(1900,0,1);
export const MAX_TIME = Date.UTC(2050,0,1);
export const clampTime = (time: number) => Math.max(MIN_TIME,Math.min(MAX_TIME,time));
export function solveKepler(mean: number, eccentricity: number) {
  const m = ((mean + Math.PI) % (2*Math.PI) + 2*Math.PI) % (2*Math.PI) - Math.PI;
  let e = m;
  for (let n=0;n<12;n++) { const step=(e-eccentricity*Math.sin(e)-m)/(1-eccentricity*Math.cos(e)); e-=step; if (Math.abs(step)<1e-12) break; }
  return e;
}
export function orbitElements(body: CelestialBody, time: number) {
  const source = elements[body.slug];
  if (!source) return [body.distanceMkm/149.5978707,body.eccentricity,body.inclination,body.phase*360+(time-J2000)/86400000/body.periodDays*360,0,0];
  const t=(time-J2000)/(36525*86400000);
  return source[0].map((value,index)=>value+source[1][index]*t);
}
export function orbitPoint(body: CelestialBody,time: number, eccentricAnomaly?: number, scale: 'explore'|'distance'='explore'): [number,number,number] {
  if(body.slug==='sun') return [0,0,0];
  const [a,e,i,l,p,n]=orbitElements(body,time);
  const E=eccentricAnomaly ?? solveKepler((l-p)*RAD,e);
  const r=body.parent ? body.orbitRadius : scale==='distance' ? a*2.0 : body.orbitRadius;
  const x=r*(Math.cos(E)-e), y=r*Math.sqrt(1-e*e)*Math.sin(E), w=(p-n)*RAD, node=n*RAD, inc=i*RAD;
  return [(Math.cos(w)*Math.cos(node)-Math.sin(w)*Math.sin(node)*Math.cos(inc))*x+(-Math.sin(w)*Math.cos(node)-Math.cos(w)*Math.sin(node)*Math.cos(inc))*y,
    Math.sin(w)*Math.sin(inc)*x+Math.cos(w)*Math.sin(inc)*y,
    -((Math.cos(w)*Math.sin(node)+Math.sin(w)*Math.cos(node)*Math.cos(inc))*x+(-Math.sin(w)*Math.sin(node)+Math.cos(w)*Math.cos(node)*Math.cos(inc))*y)];
}
export function positionAt(body: CelestialBody,time: number,scale: 'explore'|'distance'='explore'): [number,number,number] {
  const position=orbitPoint(body,time,undefined,scale);
  if(body.parent) { const parent=positionAt(bodyBySlug(body.parent)!,time,scale); return position.map((v,i)=>v+parent[i]) as [number,number,number]; }
  return position;
}
export function renderRadius(body: CelestialBody,scale: 'explore'|'distance') {
  return scale==='distance' ? (body.slug==='sun'?.36:Math.max(.055,body.displayRadius*.22)) : body.displayRadius*(body.slug==='sun'?1:1.65);
}
