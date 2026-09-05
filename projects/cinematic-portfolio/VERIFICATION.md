# Revision 2.1.0 verification

Performed on the final static `/html` export:

- ESLint passed; production compilation, TypeScript, and static prerender/export passed.
- Served `out/` through the Python static preview at `http://127.0.0.1:4188/html/`.
- 13 local HTML-linked URLs and 14 JS/CSS/font assets returned HTTP 200.
- Nine ordered scene anchors (0–8); unique HTML IDs; in-page navigation targets resolve.
- Each of the nine procedural formations contains 1,800 finite module positions and scales.
- Supplied résumé and exported PDF are byte-identical (110,155 bytes), SHA-256 `4f4e9a89537ea53d61966d09b35a1c55ead32372f65eff921a6ea73af36fa8cf`.
- Exported page contains no Jarvis or Container Command showcase and no build/commit footer.
- Active page/scene code has no fetch, WebSocket, XMLHttpRequest, server action, or API route. Fonts and PDF are static local assets.

Not completed for this revision: live scroll reversal, screenshots, mobile/resizing, reduced-motion/context-loss behavior, browser console and browser network trace. Native Chrome control timed out repeatedly; Safari reported active user changes. No new screenshots or measured performance results are claimed. Source implements native scrolling, capped pixel density, demand rendering, reduced-motion and WebGL fallback paths, but these runtime paths need a live browser pass.

## Scroll synchronization follow-up

Four timing regression tests pass (`node --test tests/sceneTiming.test.mjs`): actual content padding, reading pauses, deterministic reversal, resize-dependent anchors, and final-scene reachability. The installed GSAP reusable scrub tween was also exercised through forward/reverse targets and an immediate reset without a browser. ESLint and the production build pass. These verify timing logic, not perceived motion or frame rate; native browser discovery still exposed no connected browser, and Safari's active content was unrelated to this preview.
