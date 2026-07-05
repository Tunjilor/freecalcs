import { test } from "node:test";
import assert from "node:assert/strict";
import { computeSavingsGoal, type SavingsGoalInputs } from "./compute.ts";
import { futureValue, futureValueOfSeries } from "../../lib/calculator/finance.ts";

const base: SavingsGoalInputs = {
  targetAmount: 50000,
  currentSavings: 10000,
  monthsToGoal: 36,
  annualReturn: 5,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("required monthly hits the target when contributed over the term", () => {
  const r = computeSavingsGoal(base);
  const mr = 0.05 / 12;
  const projected = futureValue(10000, mr, 36) + futureValueOfSeries(r.requiredMonthly, mr, 36);
  approx(projected, 50000, 2, "current + contributions should reach the target");
});

test("required monthly = needed-from-contributions / FV of $1 series", () => {
  const r = computeSavingsGoal(base);
  const mr = 0.05 / 12;
  approx(r.requiredMonthly, r.neededFromContributions / futureValueOfSeries(1, mr, 36), 0.5);
});

test("growth earned is part of reaching the goal", () => {
  const r = computeSavingsGoal(base);
  assert.ok(r.growthEarned > 0);
  approx(r.growthEarned, 50000 - 10000 - r.totalContributed, 1);
});

test("more time lowers the required monthly", () => {
  const r = computeSavingsGoal(base);
  assert.ok(r.requiredMonthlyExtended < r.requiredMonthly);
  assert.equal(r.leverMonths, 12);
});

test("edge: already past the goal needs no contribution and shows a surplus", () => {
  const r = computeSavingsGoal({ ...base, currentSavings: 60000 });
  assert.equal(r.onTrack, true);
  assert.equal(r.requiredMonthly, 0);
  assert.ok(r.surplus > 0);
});

test("edge: current savings that grows into the target needs nothing", () => {
  // 48000 at 5% over 36 months grows past 50000
  const r = computeSavingsGoal({ ...base, currentSavings: 48000 });
  assert.equal(r.onTrack, true);
  assert.equal(r.requiredMonthly, 0);
});

test("edge: 0% return means pure division of the gap", () => {
  const r = computeSavingsGoal({ ...base, annualReturn: 0 });
  approx(r.requiredMonthly, (50000 - 10000) / 36, 0.5);
  assert.equal(r.growthEarned, 0);
});

test("chart starts at current savings and ends near the target", () => {
  const r = computeSavingsGoal(base);
  assert.equal(r.chart[0].y, base.currentSavings);
  approx(r.chart[r.chart.length - 1].y, 50000, 50);
});
