# Changelog

## 2.0.0 — 2026-09-04

- Replace the earlier flat visual treatment with a continuous, scroll-driven 3D platform core, coordinated assembly, and readable project chapters.
- Support native scrolling, reduced motion, keyboard navigation, mobile layouts, and an intentional static visual fallback.
- Generate a shared build identity for the footer and `build-info.json`; export the existing public demos and add a base-path-aware static preview.

## 2.1.0
- Light blue/ivory visual system with self-hosted Geist typography and alternating content columns.
- Cloud modules reform into a workstation, infrastructure, parking, telemetry, graduation cap, and medal as their sections enter.
- Removed Jarvis Pipeline and Container Command showcases. Linked the user-supplied PDF résumé.
- Removed build and commit details from the visible footer.

### Detail refinement
- Increased each formation from 440 to 1,800 instanced cubes; reduced cube edge length by approximately 41%.
- Increased curve, cloud, network, and graduation-cap sampling density; simplified tiny bevel geometry to limit rendering cost.

### Scroll synchronization fix
- Anchor morph completion to the section heading or project content, including responsive padding.
- Give full transitions 1.4 viewport heights (previously 1.12); retain reading pauses and deterministic reversal.
- Align module timing with the camera and reuse one scrub tween instead of restarting an accelerating tween on every scroll event.
- Add `node --test tests/sceneTiming.test.mjs` regression coverage for content alignment, reading holds, reversal, resizing, and final-scene reachability.
