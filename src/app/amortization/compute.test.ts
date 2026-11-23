import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAmortization, type AmortizationInputs } from "./compute.ts";

const base: AmortizationInputs = { loanAmount: 300000, rate: 6.5, termYears: 30, extraMonthly: 0 };
const approx = (a: number, b: number, eps = 1) =>
  assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("standard 30-year schedule", () => {
  const r = computeAmortization(base);
  approx(r.monthlyPayment, 1896.2, 0.5);
  assert.equal(r.payoffMonths, 360);
  assert.equal(r.years.length, 30);
  approx(r.totalInterest, 1896.2 * 360 - 300000, 200);
  approx(r.totalPaid, 300000 + r.totalInterest, 0.02);
  assert.equal(r.monthsSaved, 0);
  assert.equal(r.interestSaved, 0);
});

test("first payment is mostly interest; crossover comes late", () => {
  const r = computeAmortization(base);
  // Month 1 interest = 300,000 × 6.5%/12 = 1,625
  approx(r.firstYear[0].interest, 1625, 0.01);
  assert.ok(r.firstPaymentInterestPct > 85);
  assert.ok(r.crossoverMonth > 200 && r.crossoverMonth < 260, `got ${r.crossoverMonth}`);
  assert.ok(r.halfPaidMonth > 240, `got ${r.halfPaidMonth}`);
});

test("yearly rows add up", () => {
  const r = computeAmortization(base);
  const p = r.years.reduce((a, y) => a + y.principal, 0);
  approx(p, 300000, 1);
  assert.equal(r.years[29].endBalance, 0);
  approx(r.years[29].cumulativeInterest, r.totalInterest, 1);
});

test("extra payments shorten the loan and are tracked per year", () => {
  const r = computeAmortization({ ...base, extraMonthly: 250 });
  assert.ok(r.monthsSaved > 60, `got ${r.monthsSaved}`);
  assert.ok(r.interestSaved > 80000);
  approx(r.years[0].extra, 3000, 0.5);
  approx(r.totalPayment, r.monthlyPayment + 250, 0.01);
});

test("edge: zero rate and zero loan", () => {
  const z = computeAmortization({ ...base, rate: 0 });
  approx(z.monthlyPayment, 300000 / 360, 0.01);
  assert.equal(z.totalInterest, 0);
  const e = computeAmortization({ ...base, loanAmount: 0 });
  assert.equal(e.monthlyPayment, 0);
  assert.equal(e.years.length, 0);
  assert.equal(e.firstPaymentInterestPct, 0);
});
