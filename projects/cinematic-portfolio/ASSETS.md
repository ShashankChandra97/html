# Assets and design references

- `public/resume/Shashank_Chandra_DevOps.pdf`: supplied by Shashank Chandra; copied byte-for-byte from the attachment path. All résumé links point directly to this static PDF.
- `public/fonts/Geist-Latin.woff2` and `Geist-Medium.woff2`: Geist 1.4.2, Vercel, SIL Open Font License. Retrieved from the npm package via https://cdn.jsdelivr.net/npm/geist@1.4.2/dist/fonts/geist-sans/ . Original license included as `public/fonts/OFL.txt`. Fonts are bundled and self-hosted; no external font request at runtime.
- All cloud models, workstation, servers, capability network, location pin, telemetry, graduation cap, medal, studio lighting environment and fallback SVG are procedural code created for this site. No downloaded 3D models or HDR images.
- Three.js `RoundedBoxGeometry` is a bundled MIT-licensed Three.js example. A local five-softbox studio generates the metallic reflection map without a downloaded HDR image. Native scroll updates drive the reversible GPU surface-to-pixel morph.

References reviewed: https://www.apple.com/airpods-pro/ (isolated object presentation and readable feature chapters), https://www.rockstargames.com/VI (chapter-based art direction), https://tympanus.net/codrops/2022/01/05/crafting-scroll-based-animations-in-three-js/ (shared Three.js camera and scrolling). Page/document inspection was available; their live motion was not verified. No reference assets were copied.

- Theme foundation: Palette 8 (Blue Vivid + Cool Grey) from svengraziani's `color-palettes` skill: https://github.com/svengraziani/ui-design/blob/main/skills/color-palettes/SKILL.md, discovered through https://mcpmarket.com/tools/skills/professional-ui-color-palettes. Semantic CSS variables map the palette to text, surfaces, actions, and borders.

- `public/fonts/Manrope-Latin-Variable.woff2`: Manrope, Mikhail Sharanda / The Manrope Project Authors, SIL Open Font License. Latin variable font (200–800) retrieved through the official Google Fonts CSS API; license from https://github.com/google/fonts/blob/main/ofl/manrope/OFL.txt is included as `Manrope-OFL.txt`. Self-hosted via `next/font/local` for headings, key numbers, and primary actions. Geist remains the body face.

- `lib/sculptureModels.ts` defines the nine shared solid 3D compositions for desktop, phones, and touch tablets. `public/images/mobile-model-*.webp` are local software-rendered, depth-tested stills of those same geometries, produced by `scripts/generate-mobile-posters.mjs`. No external model, texture, or image service is used.
- Scroll Craft remains a reference outside the repository at `~/.codex/skills/scroll-craft`. This refinement uses its separate mobile composition, restrained motion, and complete fallback principles; no skill or engine files are copied into this project.
- `lib/surfaceMorph.ts`: deterministic area-weighted samples of the shared solid surfaces, an opaque surface sweep, and 12,000 GPU-animated pixel sprites. The pixel flow only appears between settled solid poses. It replaces the former cube geometry, voxel data, and cube fallback assets.
