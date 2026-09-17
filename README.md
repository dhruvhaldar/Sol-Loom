# Sol Loom

The solar system, alive in your browser. Sol Loom is a responsive, time-aware 3D model built with Next.js, React, TypeScript, Three.js, and React Three Fiber.

## Run locally

The application runs from the repository root. The product specification is in `sol-loom-software-spec.md`.

```bash
pnpm install
pnpm dev
```

Open the local URL shown in the terminal. Production output is created with `pnpm build`.

## Routes

- `/` — interactive system overview
- `/body/[slug]` — canonical deep link for every catalog body
- `/about` — methodology, controls, sources, and approximation disclosure
- `/embed` — reduced-chrome classroom and article embed
- `/api/og` — cacheable social preview endpoint

## Scientific scope

The client-only model uses JPL approximate planetary elements and rates over 1900–2050, with a Kepler solver. Moon and Pluto motion are illustrative. Explore mode compresses distances; distance mode preserves planetary semimajor-axis ratios while still exaggerating body sizes and the Moon’s separation. Rotation and texture orientations are illustrative. This is not intended for navigation, eclipse prediction, or research-grade observation planning.

The rebuilt experience includes textured planets, smooth focus flights, an accessible searchable catalog, a guided journey, reversible time controls, and URL restoration of body, date, overlays, scale, and camera. Texture licensing and scientific sources are documented on `/about` and in `public/textures/v1/CREDITS.md`.

Run the orbital and URL-state tests with `pnpm test` from the repository root. The app uses vinext/Vite and does not require Vercel hosting.
