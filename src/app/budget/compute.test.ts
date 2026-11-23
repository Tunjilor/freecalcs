import { test } from "node:test";
import assert from "node:assert/strict";
import { computeBudget } from "./compute.ts";

test("50/30/20 targets", () => {
  const r = computeBudget({ monthlyTakeHome: 5000, needs: 2500, wants: 1500, savings: 1000 });
  assert.equal(r.targetNeeds, 2500);
  assert.equal(r.targetWants, 1500);
  assert.equal(r.targetSavings, 1000);
  assert.equal(r.onTrack, true);
  assert.equal(r.unallocated, 0);
  assert.equal(r.annualSavings, 12000);
});

test("overspending on needs and a savings gap", () => {
  const r = computeBudget({ monthlyTakeHome: 5000, needs: 3100, wants: 1400, savings: 300 });
  assert.equal(r.needsPct, 62);
  assert.equal(r.overNeeds, 600);
  assert.equal(r.overWants, 0);
  assert.equal(r.savingsGap, 700);
  assert.equal(r.onTrack, false);
  assert.equal(r.unallocated, 200);
});

test("spending more than take-home shows a negative remainder", () => {
  const r = computeBudget({ monthlyTakeHome: 4000, needs: 2500, wants: 1500, savings: 500 });
  assert.equal(r.unallocated, -500);
  assert.equal(r.onTrack, false);
});

test("edge: zero income", () => {
  const r = computeBudget({ monthlyTakeHome: 0, needs: 100, wants: 0, savings: 0 });
  assert.equal(r.needsPct, 0);
  assert.equal(r.onTrack, false);
  assert.equal(r.rows.length, 3);
});
