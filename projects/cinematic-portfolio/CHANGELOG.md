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

### Cube clarity and theme refinement
- Remove scene-wide fading in reduced-motion and fallback modes. Reduced motion shows complete chapter poses without interpolated movement; the desktop fallback scrolls away with the hero.
- Use solid bevelled cubes, deeper blue color, restrained lighting, and 2x pixel density. Separate settled cube surfaces instead of stacking spare instances at intersecting depth offsets.
- Apply the Blue Vivid + Cool Grey palette, a solid header, tighter hero spacing, consistent text contrast, and opaque project/credential surfaces. Consolidate the desktop and mobile CSS rules.
- Generate an opaque cube SVG fallback and cover formation separation and reduced-motion chapter poses with regression tests.

### Metallic finish and model details
- Add polished blue metal, silver inlays, gold accents, and broader bevel highlights under a procedural five-softbox reflection environment.
- Add cloud circuit inlays, workstation screen/keyboard details, server vents and status indicators, chip contacts, parking bays and cars, telemetry readouts, mortarboard trim/tassel strands, and a recessed medallion face.
- Increase the fixed instance budget to 2,400 to preserve the expanded models while retaining separated surfaces and existing scroll/reduced-motion behavior. Update the static fallback to the metallic appearance.

### Typography refinement
- Pair locally hosted Manrope headings and key figures with Geist body text. Use slightly more open tracking and line spacing, consistent navigation sizes, and clearer sans-serif labels.

### Reference cloud silhouette
- Reshape every cloud into a shallow, rounded profile with a continuous level base, smaller left lobe, taller upper lobe, and rounded end caps, following the supplied reference. Use finer cubes around the curves, reposition circuit inlays, and frame hero/final clouds more frontally.
- Regenerate the metallic fallback and verify that all depth layers preserve the flat base and rounded crown without missing vertical strips.

### Dense sculptures and a separate mobile experience
- Rebuild the desktop cloud with an 89-column surface grid and greater depth. Subdivide coarse modules in other scenes, fill rack faces and the parking pin, and preserve contiguous fine circuit inlays. Keep a 14,000-instance ceiling without silently removing geometry.
- Sort modules spatially for calmer reversible morphs, reduce random travel/tumbling, and soften tiny bevel reflections. Generate formation data offline and draw only each transition's required instance range.
- Replace mobile's fixed sculpture strip with inline, smooth metallic models for every chapter. Share one WebGL context, render only visible compositions on scroll/resize, retain native touch scrolling, and disable tilt for reduced motion. Mobile does not initialize the desktop cube scene.
- Generate matching compact WebP posters for initial load and rendering failure. Add checks for density, separated surfaces, full cloud contours, and mobile camera fit across aspect ratios and tilt endpoints.
- Validation: 10 geometry/timing tests pass, including mobile opacity/framing and a four-draw-call-per-model ceiling; lint, typecheck, and production export pass. Inspected generated desktop and all nine mobile artworks. Live browser scroll, touch interaction, and device frame-rate checks remain unverified because browser control was unavailable/stalled.

### Solid models with moving pixel morphs
- Replace every desktop voxel formation with the same continuous, bevelled metallic models used by mobile. Remove the cube geometry generators, binary voxel data, and cube fallback images.
- Use 12,000 area-weighted surface samples as small moving pixel sprites during transitions. The outgoing surface disappears in a directional sweep; pixels follow reversible curved paths and settle into the next fully opaque surface. Solid reading poses contain no pixel grid.
- Replace the scrub tween with coalesced native scroll updates, including direct updates for background/accessibility scrolling in Safari. Keep independent resize and scroll scheduling, reduced-motion settled poses, and disposable GPU buffers.
- Verify the solid hero and an intermediate pixel morph visually in Safari. Chrome was not used.
