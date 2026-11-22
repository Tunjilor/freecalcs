// Unit tests for the emergency fund compute — run with `npm test`.

import { test } from "node:test";
import assert from "node:assert/strict";
import { computeEmergencyFund, targetMonthsFor, type EmergencyFundInputs } from "./compute.ts";

const base: EmergencyFundInputs = {
  housing: 1600,
  utilities: 250,
  food: 600,
  transportation: 400,
  insurance: 200,
  debtMinimums: 150,
  otherEssentials: 200,
  incomeType: "single",
  currentSavings: 5000,
  monthlyContribution: 500,
  apy: 4,
};

test("target months by income stability", () => {
  assert.equal(targetMonthsFor("dual"), 3);
  assert.equal(targetMonthsFor("single"), 6);
  assert.equal(targetMonthsFor("variable"), 9);
});

test("sizes the fund from essentials", () => {
  const r = computeEmergencyFund(base);
  assert.equal(r.monthlyEssentials, 3400);
  assert.equal(r.targetFund, 20400);
  assert.equal(r.gap, 15400);
  assert.equal(r.monthsCovered, 1.47);
  assert.equal(r.minTargetFund, 10200);
  assert.equal(r.maxTargetFund, 20400);
  assert.equal(r.starterFund, 3400);
  assert.equal(r.starterReached, true);
});

test("months to goal with interest is fewer than without", () => {
  const r = computeEmergencyFund(base);
  const noInt = computeEmergencyFund({ ...base, apy: 0 });
  assert.equal(noInt.monthsToGoal, 31); // ceil(15,400 / 500)
  assert.ok(r.monthsToGoal <= noInt.monthsToGoal);
  assert.ok(r.monthsToGoal >= 27);
  assert.ok(r.interestEarned > 0);
  assert.equal(noInt.interestEarned, 0);
});

test("already funded reports 0 months", () => {
  const r = computeEmergencyFund({ ...base, currentSavings: 25000 });
  assert.equal(r.monthsToGoal, 0);
  assert.equal(r.gap, 0);
  assert.equal(r.progressPct, 100);
});

test("no contribution and no interest never reaches the goal", () => {
  const r = computeEmergencyFund({ ...base, monthlyContribution: 0, apy: 0 });
  assert.equal(r.monthsToGoal, -1);
  assert.ok(r.path.length > 1);
});

test("starter fund floor is $1,000", () => {
  const r = computeEmergencyFund({
    ...base,
    housing: 500, utilities: 0, food: 200, transportation: 0, insurance: 0, debtMinimums: 0, otherEssentials: 0,
    currentSavings: 0,
  });
  assert.equal(r.starterFund, 1000);
  assert.equal(r.starterReached, false);
  assert.equal(r.monthsToStarter, 2);
});

test("edge: zero expenses", () => {
  const r = computeEmergencyFund({
    ...base,
    housing: 0, utilities: 0, food: 0, transportation: 0, insurance: 0, debtMinimums: 0, otherEssentials: 0,
  });
  assert.equal(r.targetFund, 0);
  assert.equal(r.monthsCovered, 0);
  assert.equal(r.progressPct, 0);
  assert.equal(r.monthsToGoal, 0);
});

test("path ends at the target when the goal is reached", () => {
  const r = computeEmergencyFund(base);
  assert.equal(r.path[r.path.length - 1].y, r.targetFund);
});
