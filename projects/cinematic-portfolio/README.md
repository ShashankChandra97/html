# Shashank Chandra — Platform core portfolio

A light, static portfolio with a continuous, scroll-driven 3D cloud made of instanced modules. It reforms into a workstation, server racks, capability network, Star-Ways parking pin, CloudVeyra cloud telemetry, graduation cap, and certification medal before returning to a cloud. Content alternates left and right while the camera places each formation opposite the reading column. Verified portfolio content comes from the existing root `index.html`.

The implementation uses the existing Next.js / React / TypeScript stack, Three.js, and GSAP ScrollTrigger. Next.js compiles static browser assets at build time. The deployed site requires only static hosting; there is no application server, API, database, hosted inference, or contact-form backend.

## Develop

```bash
cd projects/cinematic-portfolio
npm ci
npm run dev
```

Use Node.js 22. Open `http://localhost:3000`. Navigation, project links, résumé, and contact links remain available independently of the scroll journey. Native scrolling is preserved, with responsive layouts and intentional reduced-motion / WebGL fallback content.

## Build and preview

```bash
npm run lint
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/html npm run build
npm run preview -- --port 4187
```

Open `http://127.0.0.1:4187/html/`. The preview needs Python 3 and serves only the contents of `out/`. Omit the base-path environment variable for a root-hosted deployment. The GitHub Pages workflow uses `/html`, includes the existing browser-only demos, and uploads only `out/`.

See [BUILD.md](BUILD.md) for semantic versioning, generated build metadata, and reproduction details. See [CHANGELOG.md](CHANGELOG.md) for this revision. Build metadata remains a static artifact for reproducibility; it is not displayed on the page. The visible footer contains only identity and contact links.

Typography and procedural asset provenance are documented in [ASSETS.md](ASSETS.md). The résumé link serves the user-provided PDF unchanged.
