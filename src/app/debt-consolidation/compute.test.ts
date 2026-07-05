import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDebtConsolidation, type DebtConsolidationInputs } from "./compute.ts";

const blank: DebtConsolidationInputs = {
  d1Balance: 0, d1Apr: 0, d1Min: 0,
  d2Balance: 0, d2Apr: 0, d2Min: 0,
  d3Balance: 0, d3Apr: 0, d3Min: 0,
  d4Balance: 0, d4Apr: 0, d4Min: 0,
  d5Balance: 0, d5Apr: 0, d5Min: 0,
  newRate: 11, newTermMonths: 60, fee: 300,
};

// High-rate cards consolidated into a lower-rate loan.
const base: DebtConsolidationInputs = {
  ...blank,
  d1Balance: 8000, d1Apr: 22, d1Min: 200,
  d2Balance: 5000, d2Apr: 18, d2Min: 120,
  d3Balance: 3000, d3Apr: 25, d3Min: 90,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("aggregates balance, blended APR, and total minimums", () => {
  const r = computeDebtConsolidation(base);
  assert.equal(r.debtCount, 3);
  assert.equal(r.totalBalance, 16000);
  assert.equal(r.currentTotalMinPayment, 410);
  // weighted avg: (8000*22 + 5000*18 + 3000*25)/16000
  approx(r.weightedAvgApr, (8000 * 22 + 5000 * 18 + 3000 * 25) / 16000, 0.1);
});

test("consolidation loan finances the fee and computes a payment", () => {
  const r = computeDebtConsolidation(base);
  assert.equal(r.newLoanAmount, 16000 + 300);
  assert.ok(r.newPayment > 0);
  approx(r.newTotalInterest, r.newPayment * 60 - r.newLoanAmount, 0.5);
  approx(r.consolidationTotalCost, r.newTotalInterest + 300, 0.5);
});

test("consolidating high-rate cards into a lower rate saves interest", () => {
  const r = computeDebtConsolidation(base);
  assert.equal(r.saves, true);
  assert.ok(r.interestSaved > 0);
  assert.match(r.breakEvenLabel, /mo|yr|Immediate/);
});

test("edge: a higher consolidation rate costs MORE, not less", () => {
  const r = computeDebtConsolidation({ ...base, newRate: 28, newTermMonths: 72, fee: 800 });
  assert.equal(r.saves, false);
  assert.ok(r.interestSaved < 0, "should report added cost");
});

test("edge: break-even is 'Never' when there's no monthly saving", () => {
  // Short 12-month term forces a high payment, so no monthly savings.
  const r = computeDebtConsolidation({ ...base, newTermMonths: 12 });
  assert.ok(r.monthlySavings < 0);
  assert.equal(r.breakEvenLabel, "Never");
});

test("edge: single debt still works", () => {
  const r = computeDebtConsolidation({ ...blank, d1Balance: 10000, d1Apr: 24, d1Min: 250 });
  assert.equal(r.debtCount, 1);
  assert.equal(r.totalBalance, 10000);
  assert.equal(r.weightedAvgApr, 24);
});

test("edge: no debts -> zeros, not NaN", () => {
  const r = computeDebtConsolidation(blank);
  assert.equal(r.debtCount, 0);
  assert.equal(r.totalBalance, 0);
  assert.equal(r.weightedAvgApr, 0);
  assert.ok(Number.isFinite(r.newPayment));
});

test("zero-fee consolidation gives immediate break-even when it lowers the payment", () => {
  const r = computeDebtConsolidation({ ...base, fee: 0 });
  assert.ok(r.monthlySavings > 0);
  assert.equal(r.breakEvenLabel, "Immediate");
});
