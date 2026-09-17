import { bodyBySlug } from './bodies.ts';
import { clampTime } from './ephemeris.ts';
export type ViewState = { body: string; view:'system'|'focus'|'top'; scale:'explore'|'distance'; orbits:boolean; labels:boolean; time:number; speed:number; camera?:number[] };
export function readState(search:string,slug?:string): ViewState {
  const q=new URLSearchParams(search), t=Date.parse(q.get('t')||''), speed=Number(q.get('speed'));
  const body=bodyBySlug(q.get('body')||slug)?.slug||'earth';
  const view=q.get('view'), layer=q.get('layers');
  const camera=q.get('camera')?.split(',').map(Number);
  return {body,view:view==='top'?'top':view==='focus'||view==='orbit'?'focus':view==='system'||view==='overview'?'system':slug?'focus':'system',scale:q.get('scale')==='distance'?'distance':'explore',orbits:layer===null||layer.split(',').includes('orbits'),labels:layer===null||layer.split(',').includes('labels'),time:clampTime(Number.isFinite(t)?t:Date.now()),speed:q.has('speed')&&Number.isFinite(speed)?Math.max(-100,Math.min(100,speed)):1,camera:camera?.length===6&&camera.every(n=>Number.isFinite(n)&&Math.abs(n)<1000)?camera:undefined};
}
export function stateUrl(state:ViewState,embed=false) {
  const q=new URLSearchParams({t:new Date(state.time).toISOString(),view:state.view,layers:[state.orbits?'orbits':'',state.labels?'labels':''].filter(Boolean).join(','),speed:String(state.speed),scale:state.scale});
  q.set('body',state.body);
  if(state.camera) q.set('camera',state.camera.map(n=>n.toFixed(5)).join(','));
  return `${embed?'/embed':state.view==='system'||state.view==='top'?'/':`/body/${state.body}`}?${q}`;
}
