import { test } from "node:test";
import assert from "node:assert/strict";
import { computeFinalGrade } from "./compute.ts";

test("88% now, final worth 25%, want 90%", () => {
  const r = computeFinalGrade({ currentGrade: 88, finalWeight: 25, desiredGrade: 90 });
  assert.equal(r.requiredScore, 96);
  assert.equal(r.possible, true);
  assert.equal(r.gradeIfZero, 66);
  assert.equal(r.gradeIfPerfect, 91);
  assert.equal(r.rows[1].needed, 56);
});

test("impossible and already secured", () => {
  assert.equal(computeFinalGrade({ currentGrade: 70, finalWeight: 20, desiredGrade: 90 }).possible, false);
  const s = computeFinalGrade({ currentGrade: 95, finalWeight: 10, desiredGrade: 80 });
  assert.equal(s.alreadySecured, true);
});

test("edge: zero weight", () => {
  const r = computeFinalGrade({ currentGrade: 85, finalWeight: 0, desiredGrade: 90 });
  assert.equal(r.requiredScore, 0);
  assert.equal(r.possible, false);
  assert.equal(r.gradeIfPerfect, 85);
});

test("labels for out-of-range targets", () => {
  const hi = computeFinalGrade({ currentGrade: 60, finalWeight: 20, desiredGrade: 90 });
  assert.equal(hi.requiredLabel, "Not reachable");
  const lo = computeFinalGrade({ currentGrade: 95, finalWeight: 20, desiredGrade: 70 });
  assert.equal(lo.requiredLabel, "Already secured");
  assert.equal(lo.rows[3].neededLabel, "Already secured");
  const ok = computeFinalGrade({ currentGrade: 88, finalWeight: 25, desiredGrade: 90 });
  assert.equal(ok.requiredLabel, "96.0%");
  assert.equal(computeFinalGrade({ currentGrade: 88, finalWeight: 0, desiredGrade: 90 }).requiredLabel, "—");
});
