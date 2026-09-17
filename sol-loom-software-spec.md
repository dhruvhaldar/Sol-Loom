
# Sol Loom

## Product and Software Specification

**Tagline:** The solar system, alive in your browser.
**Document status:** Build-ready product specification
**Target:** Responsive web application, deployed on Vercel
**Primary stack:** Next.js App Router, TypeScript, React, Three.js, React Three Fiber

---

## 1. Product summary

Sol Loom is an interactive, time-aware 3D model of the solar system. Users can fly from a system-wide view to individual planets and moons, inspect orbital relationships, change time, search for bodies, and share the exact view with a URL.

The experience borrows the strongest interaction ideas from Stuff in Space—an immersive full-screen canvas, direct navigation, searchable objects, orbit visualization, and an unobtrusive information card—but applies them to a heliocentric solar-system model with a calmer, more legible visual language.

### Product promise

Within five seconds, a first-time visitor should be able to understand what they are looking at, move the camera, select a planet, and see the system advance through time.

### Working name rationale

“Sol” identifies the subject; “Loom” describes orbital paths weaving a dynamic model. The name is short, pronounceable, visually suggestive, and suitable for a product, repository, and domain. A preliminary web search found no obvious exact-name software collision; this is not trademark clearance.

---

## 2. Goals and non-goals

### Goals

1. Make the scale, structure, and motion of the solar system intuitive.
2. Deliver a fast, cinematic 3D experience on modern desktop and mobile browsers.
3. Show defensible astronomical data and clearly label approximations.
4. Make every selected body, date, camera mode, and overlay shareable through the URL.
5. Run as a mostly static client experience with minimal Vercel serverless cost.
6. Establish an architecture that can later support asteroids, comets, missions, and live ephemerides.

### Non-goals for v1

- Full N-body simulation or research-grade orbital determination.
- Spacecraft flight controls, collisions, landing, or game mechanics.
- User accounts, saved collections, social features, or payments.
- Photorealistic terrain at landing-scale resolution.
- Rendering every known minor body.
- Claims of exact physical size and distance in the same default view; the UI will disclose visual exaggeration.

---

## 3. Target users

### Curious explorer

Wants a beautiful, low-friction way to understand the solar system. Needs guided labels, familiar controls, and memorable comparisons.

### Student or educator

Wants to demonstrate orbital periods, inclination, retrograde rotation, relative position, and time. Needs reliable labels, pausing, time control, and shareable lesson states.

### Space enthusiast

Wants data-rich inspection and precise navigation. Needs orbital elements, timestamps, reference-frame disclosure, keyboard controls, and uncluttered overlays.

---

## 4. Experience principles

- **Canvas first:** the 3D scene owns the viewport; interface chrome stays at the edges.
- **Progressive disclosure:** show name and one-line context first, detailed science on demand.
- **Motion with meaning:** animation communicates orbit and rotation; it is not decorative noise.
- **Honest scaling:** distinguish true ratios from display exaggeration everywhere it matters.
- **Focus without losing context:** selecting a body highlights it while keeping parent orbit and neighbors legible.
- **A URL is a state:** a shared link restores the same object, time, camera, and enabled layers.

---

## 5. Information architecture

### Routes

| Route            | Purpose                                                                              |
| ---------------- | ------------------------------------------------------------------------------------ |
| `/`            | Main interactive experience; defaults to “Now” and system overview                 |
| `/body/[slug]` | Canonical, indexable body page that opens the same 3D experience focused on the body |
| `/about`       | Methodology, data sources, credits, controls, and approximation disclosures          |
| `/embed`       | Minimal UI variant for lessons, articles, and presentations                          |
| `/api/og`      | Dynamic social image generated from selected object metadata                         |

### Share-state query parameters

```text
/body/saturn?t=2030-06-01T12:00:00Z&view=orbit&layers=orbits,labels&speed=0
```

Supported parameters:

- Fingerprinted textures and binary ephemeris assets: `public, max-age=31536000, immutable`.
- HTML and route output: framework-managed revalidation/static behavior.
- Small catalog manifest: versioned URL and long-lived immutable cache.
- Never overwrite a data asset at an existing versioned URL.

### Runtime limits

- Ordinary exploration performs no server request after static assets load.
- Keep OG generation bounded and cacheable.
- Build scripts that contact upstream data sources run in an explicit data-update workflow, not every Vercel build.

---

## 16. Delivery plan

### Phase 0 — technical proof (3–5 days)

- Sun, Earth, Moon, Mars.
- camera-relative coordinates and Explore scale.
- time loop and worker spike.
- desktop and representative mobile performance measurement.
- Go/no-go criteria: stable coordinates, smooth focus, no visible jitter, ≥ 30 fps on target mobile.

### Phase 1 — MVP (2–3 weeks)

- Full initial catalog.
- search, selection, focus transitions, details, time controls.
- orbit and label layers.
- responsive UI and accessible list fallback.
- shareable URL state.
- static data validation and preview deployment.

### Phase 2 — polish and launch (1–2 weeks)

- texture/lighting polish, guided tour, quality tiers.
- performance, accessibility, and browser hardening.
- About/methodology page, credits, analytics, OG cards.
- E2E gate and production promotion workflow.

### Phase 3 — candidates after launch

- Asteroids and comets from a curated, filterable catalog.
- Spacecraft and mission trajectories.
- Event layer for conjunctions, eclipses, and oppositions.
- Measurement tool and side-by-side scale comparisons.
- WebXR or WebGPU experiments.
- Embeddable classroom presets.

---

## 17. MVP release acceptance criteria

The MVP is releasable when all of the following are true:

1. All catalog bodies can be found, selected, focused, and deep-linked.
2. Positions pass defined ephemeris validation across the supported date range.
3. Time can be paused, reversed, accelerated, reset to Now, and restored from a URL.
4. Scale mode and approximation status are always visible and accurate.
5. Desktop, touch, keyboard-only, reduced-motion, and WebGL-fallback flows pass.
6. No critical accessibility violations are found in automated checks or keyboard review.
7. Performance budgets are met on the agreed representative devices, or exceptions are documented and approved.
8. No uncaught error occurs during the E2E suite or 20-focus soak test.
9. Every external texture and dataset has recorded provenance and compatible licensing.
10. A validated Preview deployment can be promoted to Production without rebuilding.

---

## 18. Key risks and mitigations

| Risk                                    | Impact                                           | Mitigation                                                                                     |
| --------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Astronomical and visual scales conflict | Objects vanish or distances feel false           | Separate simulation/display transforms, persistent scale badge, two explicit scale modes       |
| Floating-point jitter                   | Camera and nearby moons shake at large distances | Float64 simulation, camera-relative rendering, origin rebasing                                 |
| Mobile GPU overload                     | Low frame rate, crashes, overheating             | Quality tiers, DPR clamp, LOD, limited post-processing, adaptive downgrade                     |
| Texture/data licensing ambiguity        | Launch or redistribution risk                    | Per-asset manifest, source URL, license, author, retrieval date, automated validation          |
| Deep-link hydration mismatch            | Broken initial route or flicker                  | Server-render textual shell; validate URL server-side; restore 3D state after client readiness |
| Labels become unreadable                | Visual clutter                                   | priority culling, collision avoidance, focused-neighborhood emphasis                           |
| Upstream ephemeris dependency fails     | Broken production experience                     | precomputed versioned assets; upstream contact only in controlled data pipeline                |
| “Accurate” is misunderstood           | Trust and education risk                         | explicit accuracy contract, methodology page, validity range, approximation labels             |

---

## 19. Definition of done for each feature

A feature is done only when it has:

- an implemented happy path and recovery/error state;
- keyboard and touch behavior where applicable;
- unit or integration coverage for its core logic;
- updated URL/state behavior if it changes shareable state;
- analytics only if the event is on the approved privacy-safe list;
- responsive review at mobile, tablet, and desktop widths;
- reduced-motion and high-contrast review;
- no unexplained performance-budget regression;
- user-facing copy and scientific disclosures reviewed;
- preview verification on Vercel.

---

## 20. Primary references

- Reference interaction: [Stuff in Space](https://stuffin-space.vader.zone/?intldes=2021-015E)
- Ephemeris source/API: [JPL Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html)
- Rendering engine: [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)
- Draw-call optimization: [Three.js InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html)
- Deployment platform: [Vercel deployment documentation](https://vercel.com/docs/deployments)
