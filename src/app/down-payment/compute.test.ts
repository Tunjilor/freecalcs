import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDownPayment, type DownPaymentInputs } from "./compute.ts";

const base: DownPaymentInputs = {
  homePrice: 400000,
  targetPercent: 10,
  currentSavings: 30000,
  monthsToGoal: 24,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("target down payment = price × target percent", () => {
  const r = computeDownPayment(base);
  approx(r.targetDownPayment, 40000, 0.01);
  approx(r.twentyPercentDown, 80000, 0.01);
});

test("monthly savings needed = gap / months", () => {
  const r = computeDownPayment(base);
  approx(r.gapToTarget, 10000, 0.01); // 40000 − 30000
  approx(r.monthlySavingsNeeded, 10000 / 24, 0.5);
});

test("a sub-20% target flags PMI and a gap to 20%", () => {
  const r = computeDownPayment(base);
  assert.equal(r.avoidsPmi, false);
  assert.ok(r.pmiMonthly > 0);
  approx(r.gapTo20, 80000 - 30000, 0.01);
});

test("a 20%+ target avoids PMI", () => {
  const r = computeDownPayment({ ...base, targetPercent: 20 });
  assert.equal(r.avoidsPmi, true);
  assert.equal(r.pmiMonthly, 0);
});

test("progress percent reflects savings vs target", () => {
  const r = computeDownPayment(base);
  approx(r.progressPct, (30000 / 40000) * 100, 0.1); // 75%
});

test("edge: already saved the target -> zero gap and zero monthly", () => {
  const r = computeDownPayment({ ...base, currentSavings: 40000 });
  assert.equal(r.gapToTarget, 0);
  assert.equal(r.monthlySavingsNeeded, 0);
  assert.ok(r.progressPct >= 100);
});

test("edge: zero months doesn't divide by zero", () => {
  const r = computeDownPayment({ ...base, monthsToGoal: 0 });
  assert.ok(Number.isFinite(r.monthlySavingsNeeded));
});

test("savings path ends at (or below) the target down payment", () => {
  const r = computeDownPayment(base);
  const last = r.savingsPath[r.savingsPath.length - 1];
  assert.ok(last.y <= r.targetDownPayment + 0.01);
  assert.equal(r.savingsPath[0].y, base.currentSavings);
});
