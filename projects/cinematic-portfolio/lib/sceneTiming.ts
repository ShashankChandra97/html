export type ContentAnchor = { top: number; phase: number };
export type SceneTransition = { start: number; end: number; phase: number };

/** Settle with the visible heading, including the section's real content padding. */
export function buildSceneTransitions(anchors: ContentAnchor[], viewportHeight: number, headerHeight: number, maxScroll: number, stageHeight = 0): SceneTransition[] {
  const readingLine = Math.max(headerHeight + stageHeight + 24, viewportHeight * .18);
  const distance = (stageHeight > 0 ? Math.max(160, viewportHeight - headerHeight - stageHeight) : viewportHeight) * 1.4;
  let previousEnd = 0;
  return anchors.map((anchor, index) => {
    const end = index === 0 ? 0 : Math.max(previousEnd, Math.min(maxScroll, Math.max(0, anchor.top - readingLine)));
    const start = index === 0 ? 0 : Math.max(previousEnd, end - distance);
    previousEnd = end;
    return { start, end, phase: anchor.phase };
  });
}

/** Pure scroll mapping: identical positions produce identical forward/reverse poses. */
export function phaseAtScroll(transitions: SceneTransition[], scrollY: number): number {
  if (!transitions.length) return 0;
  let previous = transitions[0].phase;
  for (let i = 1; i < transitions.length; i++) {
    const next = transitions[i];
    if (scrollY < next.start) return previous;
    if (scrollY < next.end) {
      const progress = (scrollY - next.start) / Math.max(1, next.end - next.start);
      return previous + (next.phase - previous) * progress;
    }
    previous = next.phase;
  }
  return previous;
}
