export type BodyKind = 'star' | 'planet' | 'dwarf planet' | 'moon';

export type CelestialBody = {
  slug: string;
  name: string;
  symbol: string;
  kind: BodyKind;
  color: string;
  accent: string;
  radiusKm: number;
  distanceMkm: number;
  orbitRadius: number;
  periodDays: number;
  rotationHours: number;
  axialTilt: number;
  inclination: number;
  eccentricity: number;
  displayRadius: number;
  phase: number;
  moons: number;
  description: string;
  fact: string;
  parent?: string;
};

export const bodies: CelestialBody[] = [
  { slug: 'sun', name: 'Sun', symbol: '☉', kind: 'star', color: '#ffc85a', accent: '#fff0a0', radiusKm: 696340, distanceMkm: 0, orbitRadius: 0, periodDays: 0, rotationHours: 609.1, axialTilt: 7.25, inclination: 0, eccentricity: 0, displayRadius: 2.9, phase: 0, moons: 8, description: 'Our G-type main-sequence star, holding 99.86% of the solar system’s mass.', fact: 'Sunlight reaches Earth in about 8 minutes 20 seconds.' },
  { slug: 'mercury', name: 'Mercury', symbol: '☿', kind: 'planet', color: '#a8a49b', accent: '#d8d3c7', radiusKm: 2439.7, distanceMkm: 57.9, orbitRadius: 8, periodDays: 87.969, rotationHours: 1407.6, axialTilt: 0.034, inclination: 7.005, eccentricity: 0.2056, displayRadius: 0.42, phase: 0.12, moons: 0, description: 'The smallest planet and the quickest world around the Sun.', fact: 'One solar day lasts 176 Earth days.' },
  { slug: 'venus', name: 'Venus', symbol: '♀', kind: 'planet', color: '#d5aa68', accent: '#f2d39b', radiusKm: 6051.8, distanceMkm: 108.2, orbitRadius: 12, periodDays: 224.701, rotationHours: -5832.5, axialTilt: 177.36, inclination: 3.394, eccentricity: 0.0068, displayRadius: 0.62, phase: 0.58, moons: 0, description: 'A cloud-wrapped world with the hottest surface of any planet.', fact: 'Venus rotates backward compared with most planets.' },
  { slug: 'earth', name: 'Earth', symbol: '⊕', kind: 'planet', color: '#3f8fa7', accent: '#83c7ca', radiusKm: 6371, distanceMkm: 149.6, orbitRadius: 16.5, periodDays: 365.256, rotationHours: 23.934, axialTilt: 23.44, inclination: 0, eccentricity: 0.0167, displayRadius: 0.66, phase: 0.33, moons: 1, description: 'Our ocean world — the only known place where life has taken hold.', fact: 'Earth travels around the Sun at nearly 30 km/s.' },
  { slug: 'moon', name: 'Moon', symbol: '☾', kind: 'moon', color: '#c6c3b9', accent: '#ebe8de', radiusKm: 1737.4, distanceMkm: 0.384, orbitRadius: 2.1, periodDays: 27.322, rotationHours: 655.7, axialTilt: 6.68, inclination: 5.145, eccentricity: 0.0549, displayRadius: 0.22, phase: 0.72, moons: 0, parent: 'earth', description: 'Earth’s natural satellite and the most familiar world in our night sky.', fact: 'The same lunar hemisphere always faces Earth.' },
  { slug: 'mars', name: 'Mars', symbol: '♂', kind: 'planet', color: '#a74e2e', accent: '#df8a59', radiusKm: 3389.5, distanceMkm: 227.9, orbitRadius: 21.5, periodDays: 686.98, rotationHours: 24.623, axialTilt: 25.19, inclination: 1.85, eccentricity: 0.0934, displayRadius: 0.5, phase: 0.81, moons: 2, description: 'A cold desert world shaped by volcanoes, canyons, and ancient water.', fact: 'Olympus Mons rises about 22 km above its surroundings.' },
  { slug: 'jupiter', name: 'Jupiter', symbol: '♃', kind: 'planet', color: '#c69972', accent: '#e0c3a2', radiusKm: 69911, distanceMkm: 778.5, orbitRadius: 30.5, periodDays: 4332.59, rotationHours: 9.925, axialTilt: 3.13, inclination: 1.303, eccentricity: 0.0489, displayRadius: 1.25, phase: 0.05, moons: 95, description: 'The largest planet, a banded gas giant with a storm older than telescopes.', fact: 'Jupiter is more massive than every other planet combined.' },
  { slug: 'saturn', name: 'Saturn', symbol: '♄', kind: 'planet', color: '#d2b278', accent: '#f0d69b', radiusKm: 58232, distanceMkm: 1434, orbitRadius: 39.5, periodDays: 10759.22, rotationHours: 10.656, axialTilt: 26.73, inclination: 2.485, eccentricity: 0.0565, displayRadius: 1.08, phase: 0.46, moons: 146, description: 'A pale gas giant encircled by a spectacular system of ice and rock.', fact: 'Its rings are broad but astonishingly thin.' },
  { slug: 'uranus', name: 'Uranus', symbol: '⛢', kind: 'planet', color: '#7fc3c6', accent: '#b8e4df', radiusKm: 25362, distanceMkm: 2871, orbitRadius: 48.5, periodDays: 30688.5, rotationHours: -17.24, axialTilt: 97.77, inclination: 0.773, eccentricity: 0.0457, displayRadius: 0.84, phase: 0.66, moons: 28, description: 'An ice giant rolling around the Sun almost entirely on its side.', fact: 'Its extreme tilt creates seasons lasting about 21 years.' },
  { slug: 'neptune', name: 'Neptune', symbol: '♆', kind: 'planet', color: '#3565ae', accent: '#7595d0', radiusKm: 24622, distanceMkm: 4495, orbitRadius: 57.5, periodDays: 60182, rotationHours: 16.11, axialTilt: 28.32, inclination: 1.77, eccentricity: 0.0113, displayRadius: 0.82, phase: 0.9, moons: 16, description: 'The outermost planet, a blue ice giant swept by supersonic winds.', fact: 'Neptune takes nearly 165 Earth years to orbit the Sun.' },
  { slug: 'pluto', name: 'Pluto', symbol: '♇', kind: 'dwarf planet', color: '#b8a18c', accent: '#dac8b5', radiusKm: 1188.3, distanceMkm: 5906, orbitRadius: 65, periodDays: 90560, rotationHours: -153.3, axialTilt: 122.53, inclination: 17.16, eccentricity: 0.2488, displayRadius: 0.3, phase: 0.23, moons: 5, description: 'A complex dwarf planet in the distant, icy Kuiper Belt.', fact: 'Its heart-shaped Tombaugh Regio contains vast nitrogen-ice plains.' },
];

export const primaryBodies = bodies.filter((body) => !body.parent);
export const bodyBySlug = (slug?: string | null) => bodies.find((body) => body.slug === slug);

export const J2000 = Date.UTC(2000, 0, 1, 12);

export function orbitalAngle(body: CelestialBody, timestamp: number) {
  if (!body.periodDays) return 0;
  const elapsedDays = (timestamp - J2000) / 86_400_000;
  return (body.phase * Math.PI * 2 + (elapsedDays / body.periodDays) * Math.PI * 2) % (Math.PI * 2);
}

export function bodyPosition(body: CelestialBody, timestamp: number): [number, number, number] {
  if (body.slug === 'sun') return [0, 0, 0];
  const angle = orbitalAngle(body, timestamp);
  const eccentricScale = 1 - body.eccentricity * Math.cos(angle);
  const radius = body.orbitRadius * eccentricScale;
  const inclination = body.inclination * Math.PI / 180;
  const local: [number, number, number] = [Math.cos(angle) * radius, Math.sin(angle) * radius * Math.sin(inclination), Math.sin(angle) * radius * Math.cos(inclination)];
  if (!body.parent) return local;
  const parent = bodyBySlug(body.parent);
  if (!parent) return local;
  const parentPosition = bodyPosition(parent, timestamp);
  return [parentPosition[0] + local[0], parentPosition[1] + local[1], parentPosition[2] + local[2]];
}

export function formatDistance(value: number) {
  if (value === 0) return 'System center';
  if (value < 1) return `${Math.round(value * 1_000_000).toLocaleString()} km from parent`;
  return `${value.toLocaleString()} million km from Sun`;
}

export function formatPeriod(days: number) {
  if (!days) return '—';
  if (days < 400) return `${Number(days.toFixed(1))} Earth days`;
  return `${Number((days / 365.256).toFixed(1))} Earth years`;
}
