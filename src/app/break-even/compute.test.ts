import { test } from "node:test";
import assert from "node:assert/strict";
import { computeBreakEven } from "./compute.ts";

const base = { fixedCosts: 6000, pricePerUnit: 50, variableCostPerUnit: 20, targetProfit: 3000, expectedUnits: 300 };

test("break-even units and revenue", () => {
  const r = computeBreakEven(base);
  assert.equal(r.contributionMargin, 30);
  assert.equal(r.contributionMarginRatio, 60);
  assert.equal(r.breakEvenUnits, 200);
  assert.equal(r.breakEvenRevenue, 10000);
  assert.equal(r.unitsForTarget, 300);
  assert.equal(r.profitAtExpected, 3000);
  assert.equal(r.marginOfSafetyPct, 33.33);
  assert.equal(r.breakEvenLabel, "200 units");
});

test("rounds partial units up", () => {
  assert.equal(computeBreakEven({ ...base, fixedCosts: 6010 }).breakEvenUnits, 201);
});

test("never breaks even when price ≤ variable cost", () => {
  const r = computeBreakEven({ ...base, variableCostPerUnit: 50 });
  assert.equal(r.viable, false);
  assert.equal(r.breakEvenUnits, -1);
  assert.equal(r.breakEvenRevenue, 0);
  assert.equal(r.breakEvenLabel, "Not reachable");
});
