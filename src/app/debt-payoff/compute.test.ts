import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDebtPayoff, type DebtPayoffInputs } from "./compute.ts";

// A blank slate; individual tests fill in the debts they need.
const blank: DebtPayoffInputs = {
  d1Balance: 0, d1Apr: 0, d1Min: 0,
  d2Balance: 0, d2Apr: 0, d2Min: 0,
  d3Balance: 0, d3Apr: 0, d3Min: 0,
  d4Balance: 0, d4Apr: 0, d4Min: 0,
  d5Balance: 0, d5Apr: 0, d5Min: 0,
  extra: 0,
  method: "avalanche",
};

// Small low-APR debt + large high-APR debt: the classic case where avalanche
// (attack the 25% debt) beats snowball (attack the $1k debt first).
const aVsB: DebtPayoffInputs = {
  ...blank,
  d1Balance: 1000, d1Apr: 5, d1Min: 25,
  d2Balance: 8000, d2Apr: 25, d2Min: 160,
  extra: 300,
  method: "avalanche",
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("aggregates count, starting balance, minimums, and monthly outlay", () => {
  const r = computeDebtPayoff(aVsB);
  assert.equal(r.debtCount, 2);
  approx(r.totalStartingBalance, 9000, 0.01);
  approx(r.totalMinimum, 185, 0.01);
  approx(r.monthlyOutlay, 485, 0.01); // 185 + 300 extra
});

test("both strategies eventually clear the debts", () => {
  const r = computeDebtPayoff(aVsB);
  assert.equal(r.paysOff, true);
  assert.ok(r.avalancheMonths > 0 && r.snowballMonths > 0);
});

test("avalanche costs less interest than snowball here", () => {
  const r = computeDebtPayoff(aVsB);
  assert.equal(r.betterMethod, "avalanche");
  assert.ok(r.avalancheInterest < r.snowballInterest);
  assert.ok(r.interestSavedByAvalanche > 0);
});

test("highest-APR debt is flagged (the 25% one)", () => {
  const r = computeDebtPayoff(aVsB);
  assert.equal(r.highestApr, 25);
  assert.equal(r.highestAprLabel, "Debt 2");
});

test("selected method drives debtFreeLabel and schedule", () => {
  const r = computeDebtPayoff({ ...aVsB, method: "avalanche" });
  assert.equal(r.method, "avalanche");
  assert.equal(r.selMonths, r.avalancheMonths);
  assert.match(r.debtFreeLabel, /\d+ (yr|mo)/);
  assert.ok(r.schedule.length === r.selMonths);
  // schedule is monotonically non-increasing and ends near zero
  assert.ok(r.schedule[r.schedule.length - 1].balance <= 1);
});

test("switching method to snowball changes the selected totals", () => {
  const aval = computeDebtPayoff({ ...aVsB, method: "avalanche" });
  const snow = computeDebtPayoff({ ...aVsB, method: "snowball" });
  assert.equal(snow.selTotalInterest, snow.snowballInterest);
  assert.ok(snow.selTotalInterest >= aval.selTotalInterest);
});

test("payoff order records each debt exactly once, in clearing order", () => {
  const r = computeDebtPayoff(aVsB);
  assert.equal(r.payoffOrder.length, 2);
  const labels = r.payoffOrder.map((p) => p.label).sort();
  assert.deepEqual(labels, ["Debt 1", "Debt 2"]);
  // months are non-decreasing
  assert.ok(r.payoffOrder[0].month <= r.payoffOrder[1].month);
});

test("the extra payment saves both time and interest", () => {
  const withExtra = computeDebtPayoff(aVsB);
  assert.ok(withExtra.monthsSavedByExtra > 0);
  assert.ok(withExtra.interestSavedByExtra > 0);
});

test("edge: a single debt makes snowball and avalanche identical (tie)", () => {
  const r = computeDebtPayoff({ ...blank, d1Balance: 5000, d1Apr: 18, d1Min: 150, extra: 100 });
  assert.equal(r.debtCount, 1);
  assert.equal(r.avalancheMonths, r.snowballMonths);
  approx(r.avalancheInterest, r.snowballInterest, 0.01);
  assert.equal(r.betterMethod, "tie");
});

test("edge: no debts entered -> zeroed, already debt-free", () => {
  const r = computeDebtPayoff(blank);
  assert.equal(r.debtCount, 0);
  assert.equal(r.selMonths, 0);
  assert.equal(r.debtFreeLabel, "0 mo");
  assert.equal(r.schedule.length, 0);
});

test("edge: minimums below interest never pay off (flagged, not NaN)", () => {
  // 10000 @ 30% ≈ $250/mo interest; a $50 min with no extra can't cover it.
  const r = computeDebtPayoff({ ...blank, d1Balance: 10000, d1Apr: 30, d1Min: 50, extra: 0 });
  assert.equal(r.paysOff, false);
  assert.equal(r.debtFreeLabel, "Not on this plan");
  assert.equal(r.monthsSavedByExtra, 0);
  assert.ok(Number.isFinite(r.selTotalInterest));
});

test("edge: 0% APR debts pay off by pure division of balance", () => {
  const r = computeDebtPayoff({ ...blank, d1Balance: 1200, d1Apr: 0, d1Min: 100, extra: 0 });
  assert.equal(r.selTotalInterest, 0);
  assert.equal(r.selMonths, 12); // 1200 / 100
});

test("three debts: avalanche order attacks the highest APR first", () => {
  const r = computeDebtPayoff({
    ...blank,
    d1Balance: 3000, d1Apr: 22, d1Min: 90,
    d2Balance: 6000, d2Apr: 8, d2Min: 120,
    d3Balance: 1500, d3Apr: 15, d3Min: 40,
    extra: 250,
    method: "avalanche",
  });
  assert.equal(r.debtCount, 3);
  assert.equal(r.highestApr, 22);
  assert.equal(r.paysOff, true);
  assert.ok(r.avalancheInterest <= r.snowballInterest);
});
