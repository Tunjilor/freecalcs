import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCarLease, type CarLeaseInputs } from "./compute.ts";

const base: CarLeaseInputs = {
  msrp: 40000, negotiatedPrice: 38000, downPayment: 2000, tradeIn: 0, fees: 1000,
  termMonths: 36, residualPct: 58, apr: 6, salesTaxPct: 7,
};
const approx = (a: number, b: number, eps = 0.01) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("standard lease formula", () => {
  const r = computeCarLease(base);
  assert.equal(r.moneyFactor, 0.0025);
  assert.equal(r.adjustedCapCost, 37000);
  assert.equal(r.residualValue, 23200);
  approx(r.depreciationFee, (37000 - 23200) / 36); // 383.33
  approx(r.financeFee, (37000 + 23200) * 0.0025); // 150.50
  approx(r.basePayment, 383.33 + 150.5, 0.02);
  approx(r.monthlyPayment, r.basePayment * 1.07, 0.02);
  approx(r.totalLeaseCost, r.monthlyPayment * 36 + 2000, 0.5);
  assert.equal(r.discountFromMsrp, 2000);
  assert.equal(r.discountPct, 5);
});

test("bigger down payment lowers the payment", () => {
  const a = computeCarLease(base);
  const b = computeCarLease({ ...base, downPayment: 5000 });
  assert.ok(b.monthlyPayment < a.monthlyPayment);
});

test("edge: zero APR, residual above cap cost, zero msrp", () => {
  const z = computeCarLease({ ...base, apr: 0 });
  assert.equal(z.financeFee, 0);
  const hi = computeCarLease({ ...base, residualPct: 120 });
  assert.equal(hi.depreciationFee, 0);
  const m = computeCarLease({ ...base, msrp: 0 });
  assert.equal(m.discountPct, 0);
  assert.ok(Number.isFinite(m.monthlyPayment));
});
