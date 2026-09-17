'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars, useTexture } from '@react-three/drei';
import { Component, Suspense, useEffect, useMemo, useRef, type ComponentRef, type MutableRefObject, type ReactNode } from 'react';
import { AdditiveBlending, BackSide, Color, DoubleSide, Group, Mesh, RingGeometry, SRGBColorSpace, Vector3 } from 'three';
type Controls = ComponentRef<typeof OrbitControls>;
import { bodies, bodyBySlug, J2000, type CelestialBody } from '@/lib/bodies';
import { orbitPoint, positionAt, renderRadius } from '@/lib/ephemeris';
import type { ViewState } from '@/lib/view-state';

const textureNames:Record<string,string>={mercury:'mercury',venus:'venus_atmosphere',earth:'earth_daymap',mars:'mars',jupiter:'jupiter',saturn:'saturn',uranus:'uranus',neptune:'neptune',moon:'moon'};
export const texturePath=(slug:string)=>textureNames[slug]?`/textures/v1/2k_${textureNames[slug]}.jpg`:undefined;
type Props={state:ViewState;time:MutableRefObject<number>;onSelect:(slug:string)=>void;cameraState:MutableRefObject<number[]|undefined>;reduced:boolean;reset:number;onError:()=>void};
class TextureBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}> {
  state={failed:false}; static getDerivedStateFromError(){return {failed:true};} render(){return this.state.failed?this.props.fallback:this.props.children;}
}
function Surface({body}:{body:CelestialBody}) {
  const map=useTexture(texturePath(body.slug)!); map.colorSpace=SRGBColorSpace;
  return <meshStandardMaterial map={map} roughness={body.slug==='earth'?.65:.95} />;
}
function Clouds(){const map=useTexture('/textures/v1/2k_earth_clouds.jpg');return <mesh><sphereGeometry args={[1.016,48,32]}/><meshStandardMaterial alphaMap={map} transparent opacity={.72} depthWrite={false}/></mesh>;}
function Rings(){
  const texture=useTexture('/textures/v1/2k_saturn_ring_alpha.png'); texture.colorSpace=SRGBColorSpace;
  const geometry=useMemo(()=>{const g=new RingGeometry(1.28,2.35,128);const p=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(Math.hypot(p.getX(i),p.getY(i))-1.28)/(2.35-1.28),.5);return g;},[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} rotation-x={-Math.PI/2}><meshStandardMaterial map={texture} transparent opacity={.9} side={DoubleSide} depthWrite={false}/></mesh>;
}
function Atmosphere({color}:{color:string}){return <mesh scale={1.055}><sphereGeometry args={[1,40,24]}/><shaderMaterial transparent blending={AdditiveBlending} side={BackSide} depthWrite={false} uniforms={{tint:{value:new Color(color)}}} vertexShader={'varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}'} fragmentShader={'varying vec3 vNormal; varying vec3 vPosition; uniform vec3 tint; void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),3.0);gl_FragColor=vec4(tint,rim*0.6);}'}/></mesh>;}
function BodyLabel({body,radius,time,state,onSelect}:{body:CelestialBody;radius:number;time:MutableRefObject<number>;state:ViewState;onSelect:(slug:string)=>void}) {
  const ref=useRef<HTMLButtonElement>(null),{camera,size}=useThree(),point=useMemo(()=>new Vector3(),[]);
  useFrame(()=>{point.set(...positionAt(body,time.current,state.scale));point.y+=radius+.7;point.project(camera);const x=(point.x*.5+.5)*size.width,y=(-point.y*.5+.5)*size.height;const blocked=y<96||y>size.height-225||(x<390&&y<265)||(size.width>700&&x>size.width-340&&y>210&&y<680);if(ref.current)ref.current.style.visibility=blocked?'hidden':'visible';});
  return <Html position={[0,radius+.7,0]} center zIndexRange={[12,0]}><button ref={ref} className={'planet-label '+(body.slug===state.body?'selected':'')} onClick={()=>onSelect(body.slug)}>{body.name}<span/></button></Html>;
}
function World({body,state,time,onSelect}:{body:CelestialBody;state:ViewState;time:MutableRefObject<number>;onSelect:(slug:string)=>void}){
  const group=useRef<Group>(null),surface=useRef<Mesh>(null);
  const radius=renderRadius(body,state.scale), selected=body.slug===state.body;
  useFrame(()=>{group.current?.position.set(...positionAt(body,time.current,state.scale));if(surface.current) surface.current.rotation.y=((time.current-J2000)/3600000/Math.abs(body.rotationHours||1)*Math.PI*2)%(Math.PI*2);});
  const colorMaterial=<meshStandardMaterial color={body.color} roughness={.9}/>;
  const neighbor=selected||body.slug===bodyBySlug(state.body)?.parent||body.parent===state.body;
  return <group ref={group} visible={state.view!=='focus'||neighbor}>
    <group scale={radius} rotation-z={body.axialTilt*Math.PI/180}>
      <mesh ref={surface} onClick={e=>{e.stopPropagation();onSelect(body.slug);}} onPointerOver={()=>{document.body.style.cursor='pointer';}} onPointerOut={()=>{document.body.style.cursor='';}}>
        <sphereGeometry args={[1,64,40]}/>
        {body.slug==='sun'?<shaderMaterial vertexShader={'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'} fragmentShader={'varying vec2 v;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}void main(){float n=noise(v*90.)*.5+noise(v*180.)*.3+noise(v*360.)*.2;vec3 color=mix(vec3(.95,.24,.025),vec3(1.,.89,.45),n);gl_FragColor=vec4(color*1.4,1.);}'}/>:texturePath(body.slug)?<TextureBoundary fallback={colorMaterial}><Suspense fallback={colorMaterial}><Surface body={body}/></Suspense></TextureBoundary>:colorMaterial}
        {body.slug==='earth'&&<TextureBoundary fallback={null}><Suspense fallback={null}><Clouds/></Suspense></TextureBoundary>}
      </mesh>
      {body.slug==='saturn'&&<TextureBoundary fallback={null}><Suspense fallback={null}><Rings/></Suspense></TextureBoundary>}
      {(body.slug==='earth'||body.slug==='venus'||body.slug==='sun')&&<Atmosphere color={body.slug==='earth'?'#3c91ff':body.slug==='sun'?'#ffad36':'#e6cda5'}/>}
    </group>
    {body.slug==='sun'&&<><mesh scale={radius*2.8}><sphereGeometry args={[1,32,24]}/><shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} uniforms={{}} vertexShader={'varying vec3 n; varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}'} fragmentShader={'varying vec3 n;varying vec3 v;void main(){float a=pow(max(0.,dot(n,v)),7.);gl_FragColor=vec4(1.,.38,.05,a*.13);}'}/></mesh></>}
    {state.labels&&(state.view!=='focus'&&body.kind!=='moon')&&<BodyLabel body={body} radius={radius} time={time} state={state} onSelect={onSelect}/>}
  </group>;
}
function Paths({state,time}:{state:ViewState;time:MutableRefObject<number>}){
  const year=new Date(state.time).getUTCFullYear();
  const paths=useMemo(()=>bodies.filter(b=>b.slug!=='sun').map(body=>({body,points:Array.from({length:181},(_,i)=>orbitPoint(body,Date.UTC(year,0,1),i/180*Math.PI*2,state.scale))})),[year,state.scale]);
  const moonGroup=useRef<Group>(null);
  useFrame(()=>moonGroup.current?.position.set(...positionAt(bodyBySlug('earth')!,time.current,state.scale)));
  return <group visible={state.orbits}>{paths.map(({body,points})=>body.parent?<group key={body.slug} ref={moonGroup}><Line points={points} color="#9faebe" transparent opacity={.26} lineWidth={.8}/></group>:<Line key={body.slug} points={points} color={state.body===body.slug?'#cdb18a':'#68778d'} transparent opacity={state.view==='focus'?.1:state.body===body.slug?.56:.25} lineWidth={state.body===body.slug?1:.65}/>)}</group>;
}
function Camera({state,time,cameraState,reduced,reset}:{state:ViewState;time:MutableRefObject<number>;cameraState:Props['cameraState'];reduced:boolean;reset:number}){
  const controls=useRef<Controls>(null),{camera,size}=useThree();
  const transition=useRef(true),previous=useRef(new Vector3());
  const offset=useRef(new Vector3(0,64,100)),target=new Vector3(),delta=new Vector3();
  useEffect(()=>{if('setViewOffset' in camera){if(size.width<700)camera.setViewOffset(size.width,size.height,0,size.height*.1,size.width,size.height);else camera.clearViewOffset();}},[camera,size.width,size.height]);
  useEffect(()=>{
    const body=bodyBySlug(state.body)!; const p=state.view==='focus'?new Vector3(...positionAt(body,time.current,state.scale)):new Vector3();
    const r=renderRadius(body,state.scale)*(body.slug==='saturn'?1.65:1);
    const direction=p.clone().normalize();if(direction.length()<.1)direction.set(1,0,1);
    offset.current.copy(state.view==='focus'?direction.multiplyScalar(-r*6).add(new Vector3(r*1.5,r*2.3,r*2.2)):state.view==='top'?new Vector3(0,165,.01):new Vector3(0,74,110));
    if(size.width<700)offset.current.multiplyScalar(state.view==='focus'?1.7:1.6);
    previous.current.copy(p);transition.current=true;
    if(state.camera){camera.position.fromArray(state.camera.slice(0,3));controls.current?.target.fromArray(state.camera.slice(3));transition.current=false;}
  // Camera transitions are deliberate navigation actions, not clock ticks.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[state.body,state.view,state.scale,reset]);
  useFrame((_,dt)=>{
    const c=controls.current;if(!c)return;
    target.set(...(state.view==='focus'?positionAt(bodyBySlug(state.body)!,time.current,state.scale):[0,0,0] as [number,number,number]));
    if(transition.current){const a=reduced?1:1-Math.exp(-dt*4);c.target.lerp(target,a);camera.position.lerp(target.clone().add(offset.current),a);if(camera.position.distanceTo(target.clone().add(offset.current))<.025)transition.current=false;}
    else if(state.view==='focus'){delta.copy(target).sub(previous.current);camera.position.add(delta);c.target.add(delta);}
    previous.current.copy(target);c.update();cameraState.current=[...camera.position.toArray(),...c.target.toArray()];
  });
  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={.075} minDistance={state.view==='focus'?renderRadius(bodyBySlug(state.body)!,state.scale)*2.7:.5} maxDistance={350} enablePan={state.view!=='focus'} onStart={()=>{transition.current=false;}}/>;
}
class SceneBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(){this.props.onError();}render(){return this.state.failed?null:this.props.children;}}
export default function SolarScene(props:Props){return <SceneBoundary onError={props.onError}><Canvas camera={{position:[0,74,110],fov:45,near:.01,far:1200}} dpr={[1,1.5]} gl={{antialias:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();window.setTimeout(()=>{if(gl.domElement.isConnected&&gl.getContext().isContextLost())props.onError();},150);});}} fallback={<div className="canvas-fallback">3D is unavailable. Explore the accessible body catalog below.</div>}><color attach="background" args={['#05080e']}/><ambientLight intensity={.5}/><pointLight intensity={3.2} decay={0} color="#fff5e2"/><Stars radius={350} depth={150} count={1800} factor={2} saturation={.2} fade speed={0}/><Paths state={props.state} time={props.time}/>{bodies.map(body=><World key={body.slug} body={body} state={props.state} time={props.time} onSelect={props.onSelect}/>)}<Camera {...props}/></Canvas></SceneBoundary>;}
