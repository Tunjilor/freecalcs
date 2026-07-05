import { test } from "node:test";
import assert from "node:assert/strict";
import { computeHeloc, type HelocInputs } from "./compute.ts";

const base: HelocInputs = {
  homeValue: 500000,
  mortgageBalance: 300000,
  cltvLimit: 85,
  drawAmount: 50000,
  rate: 8.5,
  drawPeriodYears: 10,
  repayPeriodYears: 20,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("available credit line = home value × CLTV − mortgage balance", () => {
  const r = computeHeloc(base);
  // 500000 × 85% − 300000 = 125000
  approx(r.availableCreditLine, 125000, 0.01);
  approx(r.maxBorrow, 425000, 0.01);
  approx(r.totalEquity, 200000, 0.01);
});

test("current CLTV is reported as a percent", () => {
  const r = computeHeloc(base);
  approx(r.currentCltv, 60, 0.01); // 300000/500000
  assert.equal(r.overLimit, false);
});

test("interest-only payment = draw × monthly rate", () => {
  const r = computeHeloc(base);
  approx(r.interestOnlyPayment, 50000 * (0.085 / 12), 0.02);
});

test("repayment payment amortizes the draw and exceeds interest-only", () => {
  const r = computeHeloc(base);
  assert.ok(r.repaymentPayment > r.interestOnlyPayment);
  assert.ok(r.paymentJump > 0);
});

test("edge: CLTV over limit yields no available credit", () => {
  const r = computeHeloc({ ...base, mortgageBalance: 450000 });
  assert.equal(r.overLimit, true);
  assert.equal(r.availableCreditLine, 0);
});

test("edge: draw is capped at the available credit line", () => {
  const r = computeHeloc({ ...base, drawAmount: 999999 });
  assert.equal(r.draw, r.availableCreditLine);
});

test("edge: zero home value yields zeros, not NaN", () => {
  const r = computeHeloc({ ...base, homeValue: 0, mortgageBalance: 0 });
  assert.equal(r.availableCreditLine, 0);
  assert.equal(r.currentCltv, 0);
  assert.ok(Number.isFinite(r.interestOnlyPayment));
});

test("balance path stays flat through the draw period then falls", () => {
  const r = computeHeloc(base);
  assert.equal(r.balancePath[0].y, r.draw); // starts at the draw amount
  assert.ok(r.balancePath[r.balancePath.length - 1].y < r.draw, "amortizes down by the end");
});
