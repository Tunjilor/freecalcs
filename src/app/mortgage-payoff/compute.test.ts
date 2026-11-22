// Unit tests for the mortgage payoff compute — run with `npm test` (node --test).

import { test } from "node:test";
import assert from "node:assert/strict";
import { computeMortgagePayoff, type MortgagePayoffInputs } from "./compute.ts";

const base: MortgagePayoffInputs = {
  originalLoan: 300000,
  rate: 6.5,
  termYears: 30,
  yearsPaid: 5,
  extraMonthly: 200,
  lumpSum: 0,
  targetYears: 0,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("scheduled payment and balance after 5 years match amortization", () => {
  const r = computeMortgagePayoff(base);
  // $300k @ 6.5% / 30yr ≈ $1,896.20
  approx(r.monthlyPI, 1896.2, 0.5);
  // Balance after 60 payments ≈ $280,900
  assert.ok(r.currentBalance > 280000 && r.currentBalance < 282000, `got ${r.currentBalance}`);
  assert.equal(r.remainingMonths, 300);
});

test("extra $200/month shortens the loan and saves interest", () => {
  const r = computeMortgagePayoff(base);
  assert.ok(r.monthsSaved > 36, `got ${r.monthsSaved}`);
  assert.ok(r.interestSaved > 40000, `got ${r.interestSaved}`);
  approx(r.interestSaved, r.interestRemaining - r.interestWithPlan, 0.02);
  // Extra paid ≈ $200 × payoff months (last month partial)
  approx(r.totalExtraPaid, 200 * (r.newPayoffMonths - 1), 250);
  assert.ok(r.savedPerDollar > 0.5);
});

test("lump sum alone cuts months and counts as extra paid", () => {
  const r = computeMortgagePayoff({ ...base, extraMonthly: 0, lumpSum: 20000 });
  assert.ok(r.monthsSaved > 0);
  assert.ok(r.interestSaved > 20000);
  approx(r.totalExtraPaid, 20000, 0.01);
});

test("no extra: plan equals schedule", () => {
  const r = computeMortgagePayoff({ ...base, extraMonthly: 0 });
  assert.equal(r.monthsSaved, 0);
  assert.equal(r.interestSaved, 0);
  assert.equal(r.totalExtraPaid, 0);
  assert.equal(r.savedPerDollar, 0);
});

test("target: extra needed to finish in 15 years from now", () => {
  const r = computeMortgagePayoff({ ...base, targetYears: 15 });
  assert.equal(r.targetReachable, true);
  // Payment on ~$280.9k over 180 months @ 6.5% ≈ $2,447 → extra ≈ $550
  assert.ok(r.extraForTarget > 500 && r.extraForTarget < 600, `got ${r.extraForTarget}`);
});

test("target longer than the remaining schedule needs no extra", () => {
  const r = computeMortgagePayoff({ ...base, targetYears: 30 });
  assert.equal(r.hasTarget, true);
  assert.equal(r.targetReachable, false);
  assert.equal(r.extraForTarget, 0);
});

test("one extra payment a year saves years", () => {
  const r = computeMortgagePayoff(base);
  approx(r.oneExtraPerYear, r.monthlyPI, 0.01);
  assert.ok(r.oneExtraMonthsSaved >= 36, `got ${r.oneExtraMonthsSaved}`);
  assert.ok(r.oneExtraInterestSaved > 0);
});

test("edge: zero loan and fully paid loan", () => {
  const z = computeMortgagePayoff({ ...base, originalLoan: 0 });
  assert.equal(z.currentBalance, 0);
  assert.equal(z.interestSaved, 0);
  const done = computeMortgagePayoff({ ...base, yearsPaid: 30 });
  assert.equal(done.currentBalance, 0);
  assert.equal(done.remainingMonths, 0);
});

test("edge: lump sum larger than the balance pays it off", () => {
  const r = computeMortgagePayoff({ ...base, lumpSum: 9e9, extraMonthly: 0 });
  assert.equal(r.newPayoffMonths, 0);
  approx(r.totalExtraPaid, r.currentBalance, 0.01);
});

test("edge: zero rate", () => {
  const r = computeMortgagePayoff({ ...base, rate: 0 });
  approx(r.monthlyPI, 300000 / 360, 0.01);
  assert.equal(r.interestRemaining, 0);
});
