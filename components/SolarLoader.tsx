'use client';

import dynamic from 'next/dynamic';

const SolarExperience = dynamic(() => import('./SolarExperience'), {
  ssr: false,
  loading: () => <main className="experience"><div className="model-loading"><span className="brand-mark" /><p>ALIGNING THE ORBITS</p></div></main>,
});

export default SolarExperience;
