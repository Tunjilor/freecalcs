import { test } from "node:test";
import assert from "node:assert/strict";
import { computeRuleOf72 } from "./compute.ts";

test("8% doubles in ~9 years", () => {
  const r = computeRuleOf72({ rate: 8, targetYears: 10, amount: 10000, horizonYears: 18 });
  assert.equal(r.yearsRule72, 9);
  assert.equal(r.yearsExact, 9.01);
  assert.equal(r.rateToDoubleRule, 7.2);
  assert.equal(r.rateToDoubleExact, 7.18);
  assert.ok(Math.abs(r.doublingsInHorizon - 2) < 0.01);
  assert.ok(Math.abs(r.valueAtHorizon - 10000 * Math.pow(1.08, 18)) < 0.01);
  assert.equal(r.rows.length, 12);
});

test("edge: zero rate / zero target", () => {
  const r = computeRuleOf72({ rate: 0, targetYears: 0, amount: 100, horizonYears: 10 });
  assert.equal(r.yearsRule72, 0);
  assert.equal(r.yearsExact, 0);
  assert.equal(r.rateToDoubleRule, 0);
  assert.equal(r.valueAtHorizon, 100);
});
