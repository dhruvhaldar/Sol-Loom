import assert from 'node:assert/strict';
import test from 'node:test';
import { bodies, J2000, bodyBySlug } from '../lib/bodies.ts';
import { solveKepler, positionAt, orbitPoint, MIN_TIME, MAX_TIME } from '../lib/ephemeris.ts';
import { readState, stateUrl } from '../lib/view-state.ts';

test('Kepler solver satisfies the equation across high eccentricity and negative anomalies',()=>{
  for(const e of [0,.0167,.2056,.8]) for(const m of [-3,-1,0,.4,2.9]) {
    const E=solveKepler(m,e);assert.ok(Math.abs(E-e*Math.sin(E)-m)<1e-10);
  }
});
test('J2000 Earth barycenter has the expected ecliptic quadrant and radial distance',()=>{
  const [x,y,z]=positionAt(bodyBySlug('earth'),J2000,'distance');
  assert.ok(x<-.3&&x>-.4);assert.ok(z<-1.9&&z>-2);assert.ok(Math.abs(y)<.001);
  assert.ok(Math.abs(Math.hypot(x,y,z)/2-.9833)<.001);
});
test('all catalog positions stay finite throughout the advertised dates',()=>{
  for(const time of [MIN_TIME,J2000,Date.UTC(2026,8,17),MAX_TIME]) for(const b of bodies) {
    assert.ok(positionAt(b,time).every(Number.isFinite));
    assert.ok(positionAt(b,time,'distance').every(Number.isFinite));
  }
});
test('lunar position is relative to its moving parent',()=>{
  for(const t of [J2000,J2000+12345678900]){
    const earth=positionAt(bodyBySlug('earth'),t),moon=positionAt(bodyBySlug('moon'),t),local=orbitPoint(bodyBySlug('moon'),t);
    assert.ok(Math.abs(Math.hypot(...moon.map((v,i)=>v-earth[i]))-Math.hypot(...local))<1e-10);
  }
});
test('complete state survives a shared link including camera and disabled layers',()=>{
  const original={body:'saturn',view:'focus',scale:'distance',orbits:false,labels:false,time:Date.UTC(2030,5,1,12),speed:-10,camera:[2,3,4,5,6,7]};
  const url=new URL(stateUrl(original),'https://example.test');
  assert.deepEqual(readState(url.search,url.pathname.split('/').pop()),original);
  const embed=new URL(stateUrl(original,true),'https://example.test');
  assert.deepEqual(readState(embed.search),original);
});
test('untrusted date, speed, camera and object parameters are bounded',()=>{
  const s=readState('?t=2200-01-01&speed=Infinity&body=unknown&camera=NaN,0,0,0,0,0');
  assert.equal(s.time,MAX_TIME);assert.equal(s.speed,1);assert.equal(s.body,'earth');assert.equal(s.camera,undefined);
  assert.equal(readState('?speed=100000').speed,100);
});
