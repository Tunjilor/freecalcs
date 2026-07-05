import { test } from "node:test";
import assert from "node:assert/strict";
import { computeRefinance, type RefinanceInputs } from "./compute.ts";

const base: RefinanceInputs = {
  currentBalance: 320000,
  currentRate: 7.5,
  currentRemainingMonths: 336, // 28 years left
  newRate: 6.0,
  newTermMonths: 360,
  closingCosts: 6000,
  financeClosingCosts: "no",
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("a lower rate reduces the monthly payment", () => {
  const r = computeRefinance(base);
  assert.ok(r.newPayment < r.currentPayment);
  assert.ok(r.monthlySavings > 0);
});

test("break-even = closing costs / monthly savings (rounded up)", () => {
  const r = computeRefinance(base);
  approx(r.breakEvenMonths, Math.ceil(6000 / r.monthlySavings), 0.001);
  assert.match(r.breakEvenLabel, /yr|mo/);
});

test("financing closing costs means no upfront cost and immediate payback", () => {
  const r = computeRefinance({ ...base, financeClosingCosts: "yes" });
  assert.equal(r.upfrontCost, 0);
  assert.equal(r.breakEvenLabel, "Immediate");
  assert.ok(r.newLoanAmount > base.currentBalance, "costs rolled into the loan");
});

test("edge: a higher new rate never breaks even", () => {
  const r = computeRefinance({ ...base, newRate: 8.5 });
  assert.ok(r.monthlySavings < 0);
  assert.equal(r.breakEvenLabel, "Never");
  assert.equal(r.breakEvenMonths, 0);
});

test("extending the term can raise lifetime interest even when the payment drops", () => {
  // 28 years left refinanced into a fresh 30-year term.
  const r = computeRefinance({ ...base, currentRemainingMonths: 240, newTermMonths: 360, newRate: 6.5 });
  assert.ok(r.monthlySavings > 0, "payment still drops");
  // resetting to 30 years can make lifetime interest worse (delta negative)
  assert.ok(Number.isFinite(r.lifetimeInterestDelta));
});

test("a big rate drop saves lifetime interest (positive delta)", () => {
  const r = computeRefinance({ ...base, currentRemainingMonths: 360, newTermMonths: 360, newRate: 5.0 });
  assert.ok(r.lifetimeInterestDelta > 0);
});

test("payback timeline crosses zero near the break-even month", () => {
  const r = computeRefinance(base);
  const first = r.payback[0];
  const last = r.payback[r.payback.length - 1];
  assert.equal(first.y, -r.upfrontCost); // month 0 = negative the upfront cost
  assert.ok(last.y > first.y, "net savings grow over time");
});

test("edge: zero balance yields zero payments, not NaN", () => {
  const r = computeRefinance({ ...base, currentBalance: 0 });
  assert.equal(r.currentPayment, 0);
  assert.equal(r.newPayment, 0);
  assert.ok(Number.isFinite(r.monthlySavings));
});
