// Unit tests for the 15 vs 30 year mortgage compute — `npm test`.

import { test } from "node:test";
import assert from "node:assert/strict";
import { computeFifteenThirty, type FifteenThirtyInputs } from "./compute.ts";

const base: FifteenThirtyInputs = {
  loanAmount: 320000,
  rate15: 5.75,
  rate30: 6.375,
  investReturn: 7,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("payments match the amortization formula", () => {
  const r = computeFifteenThirty(base);
  // $320k @ 5.75% / 15yr ≈ $2,657.31 ; @ 6.375% / 30yr ≈ $1,996.38
  approx(r.payment15, 2657.31, 1);
  approx(r.payment30, 1996.38, 1);
  approx(r.paymentDifference, r.payment15 - r.payment30, 0.02);
});

test("15-year saves a large amount of interest", () => {
  const r = computeFifteenThirty(base);
  assert.ok(r.interest30 > 2 * r.interest15);
  approx(r.interestSaved, r.interest30 - r.interest15, 0.02);
  assert.equal(r.rateGap, 0.63); // 0.625 rounded
});

test("30-year paid at the 15-year payment ends near 15 years but costs more interest", () => {
  const r = computeFifteenThirty(base);
  assert.ok(r.thirtyAtFifteenPaymentMonths > 180 && r.thirtyAtFifteenPaymentMonths < 200);
  assert.ok(r.rateAdvantage > 0, "higher 30yr rate costs more at the same cash flow");
});

test("invest-the-difference: net is invested pot minus remaining balance", () => {
  const r = computeFifteenThirty(base);
  approx(r.investNetAtYear15, r.investedAtYear15 - r.balance30AtYear15, 0.02);
  assert.equal(r.fifteenWinsAtYear15, r.investNetAtYear15 < 0);
});

test("break-even return sits between 0 and 30% and flips the winner", () => {
  const r = computeFifteenThirty(base);
  assert.ok(r.breakEvenReturn > 0 && r.breakEvenReturn < 30);
  const above = computeFifteenThirty({ ...base, investReturn: r.breakEvenReturn + 1 });
  const below = computeFifteenThirty({ ...base, investReturn: Math.max(0, r.breakEvenReturn - 1) });
  assert.equal(above.fifteenWinsAtYear15, false);
  assert.equal(below.fifteenWinsAtYear15, true);
});

test("series run 31 points each and end at zero", () => {
  const r = computeFifteenThirty(base);
  assert.equal(r.series15.length, 31);
  assert.equal(r.series30.length, 31);
  assert.equal(r.series15[15].y, 0);
  assert.ok(r.series30[30].y <= 1);
});

test("edge: zero loan", () => {
  const r = computeFifteenThirty({ ...base, loanAmount: 0 });
  assert.equal(r.payment15, 0);
  assert.equal(r.interestSaved, 0);
  assert.equal(r.breakEvenReturn, 0);
});

test("edge: zero rates", () => {
  const r = computeFifteenThirty({ ...base, rate15: 0, rate30: 0 });
  approx(r.payment15, 320000 / 180, 0.01);
  assert.equal(r.interestSaved, 0);
});
