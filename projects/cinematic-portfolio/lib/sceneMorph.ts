import { gsap } from "./gsap";

/** Equal arc-length samples keep topology stable while the silhouette changes. */
export function addSceneMorph(timeline: gsap.core.Timeline, root: Element | null, duration: number) {
  if (!root) return;
  const target = root.querySelector<SVGPathElement>("[data-morph-target]");
  const contours = root.querySelectorAll<SVGPathElement>("[data-morph-contour]");
  if (!target || !contours.length) return;
  const length = target.getTotalLength();
  const count = 96;
  const points = Array.from({ length: count }, (_, i) => target.getPointAtLength(i / count * length));
  const outline = (phase: number, layer: number) => {
    const blend = Math.max(0, Math.min(1, (phase - 0.35) / 0.65));
    const open = Math.sin(Math.min(1, phase / 0.7) * Math.PI);
    return points.map((point, i) => {
      const angle = i / count * Math.PI * 2 - Math.PI / 2;
      const radius = 158 + Math.sin(angle * 3 + layer * 0.4) * 17;
      const x = 320 + Math.cos(angle) * (radius + open * 82);
      const y = 320 + Math.sin(angle) * (radius - open * 65);
      const depth = (layer - 2) * (13 + open * 12) * (1 - blend);
      return `${i ? "L" : "M"}${(x + (point.x - x) * blend).toFixed(2)},${(y + (point.y - y) * blend + depth).toFixed(2)}`;
    }).join(" ") + " Z";
  };
  const state = { phase: 0 };
  contours.forEach((path, i) => gsap.set(path, { attr: { d: outline(0, i) } }));
  gsap.set(root.querySelector("[data-scene-detail]"), { opacity: 0 });
  timeline.to(state, {
    phase: 1, duration: duration * 0.82, ease: "sine.inOut",
    onUpdate: () => contours.forEach((path, i) => path.setAttribute("d", outline(state.phase, i))),
  }, 0);
  timeline.fromTo(root.querySelector("[data-spatial-frame]"),
    { opacity: 0.15, scale: 0.72, rotation: -24, svgOrigin: "320 320" },
    { opacity: 0.6, scale: 1.08, rotation: 8, duration: duration * 0.65, ease: "sine.inOut" }, 0);
  timeline.to(contours, { opacity: 0, stagger: 0.025, duration: duration * 0.16 }, duration * 0.76);
  timeline.to(root.querySelector("[data-scene-detail]"), { opacity: 1, duration: duration * 0.26 }, duration * 0.65);
}
