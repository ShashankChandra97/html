import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../lib/sceneTiming.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const api = {};
runInNewContext(compiled, { exports: api });
const { buildSceneTransitions, phaseAtScroll } = api;

test("padded desktop and mobile headings settle at the reading line, not on approach", () => {
  for (const { height, header, padding } of [{ height: 900, header: 88, padding: 180 }, { height: 812, header: 72, padding: 330 }]) {
    const sectionTop = 1200;
    const anchors = [{ top: 0, phase: 0 }, { top: sectionTop + padding, phase: 1 }, { top: 4000, phase: 2 }];
    const timeline = buildSceneTransitions(anchors, height, header, 6000);
    const oldCompletion = sectionTop - height * .3;
    assert.ok(phaseAtScroll(timeline, oldCompletion) < .85, "the old premature completion must still be mid-transition");
    assert.equal(phaseAtScroll(timeline, sectionTop + padding - Math.max(header + 24, height * .18)), 1);
    assert.equal(phaseAtScroll(timeline, timeline[1].end + 200), 1, "hold the formation during reading");
  }
});

test("long chapters have a slower transition and a stable reading interval", () => {
  const timeline = buildSceneTransitions([{ top: 0, phase: 0 }, { top: 2000, phase: 1 }, { top: 5000, phase: 2 }], 900, 88, 6000);
  assert.equal(timeline[2].end - timeline[2].start, 1260);
  assert.equal(phaseAtScroll(timeline, 2800), 1);
});

test("reverse scrolling retraces the same poses and resize recalculates the content anchors", () => {
  const anchors = [{ top: 0, phase: 0 }, { top: 1700, phase: 1 }, { top: 4000, phase: 2 }];
  const timeline = buildSceneTransitions(anchors, 900, 88, 5000);
  const positions = Array.from({ length: 101 }, (_, i) => i * 50);
  const forward = positions.map(y => phaseAtScroll(timeline, y));
  assert.ok(forward.every((p, i) => i === 0 || p >= forward[i - 1]));
  assert.deepEqual(positions.toReversed().map(y => phaseAtScroll(timeline, y)).toReversed(), forward);
  const resized = buildSceneTransitions(anchors, 600, 72, 5000);
  assert.notEqual(resized[1].end, timeline[1].end);
});

test("the final composition remains reachable on a short last section", () => {
  const timeline = buildSceneTransitions([{ top: 0, phase: 0 }, { top: 1200, phase: 1 }, { top: 2400, phase: 2 }], 900, 88, 2000);
  assert.equal(phaseAtScroll(timeline, 2000), 2);
  assert.equal(phaseAtScroll(timeline, -100), 0);
});
