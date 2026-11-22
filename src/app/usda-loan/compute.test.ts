// Unit tests for the USDA loan compute — run with `npm test` (node --test).

import { test } from "node:test";
import assert from "node:assert/strict";
import { computeUsda, type UsdaInputs } from "./compute.ts";

const base: UsdaInputs = {
  homePrice: 275000,
  downPayment: 0,
  rate: 6.25,
  termYears: 30,
  financeFee: "yes",
  propTaxAnnual: 3025,
  insuranceAnnual: 1375,
  hoaMonthly: 0,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("typical $0-down USDA loan finances a 1% guarantee fee", () => {
  const r = computeUsda(base);
  assert.equal(r.baseLoan, 275000);
  approx(r.upfrontFee, 2750, 0.01);
  assert.equal(r.feeFinanced, true);
  approx(r.loanAmount, 277750, 0.01);
  // P&I on $277,750 @ 6.25% / 30yr ≈ $1,710.15
  approx(r.monthlyPI, 1710.15, 1);
  // Year-1 annual fee ≈ avg balance (~$275k) × 0.35% / 12 ≈ $80
  assert.ok(r.monthlyAnnualFee > 78 && r.monthlyAnnualFee < 82, `got ${r.monthlyAnnualFee}`);
  approx(
    r.totalMonthly,
    r.monthlyPI + r.monthlyAnnualFee + 3025 / 12 + 1375 / 12,
    0.05,
  );
  assert.equal(r.cashToCloseFee, 0);
});

test("annual fee runs for the life of the loan and declines with the balance", () => {
  const r = computeUsda(base);
  // Fees over 30 years must be well under 30 × year-1 fees (balance falls).
  assert.ok(r.totalAnnualFees < r.monthlyAnnualFee * 360);
  assert.ok(r.totalAnnualFees > r.monthlyAnnualFee * 12 * 15);
  approx(r.totalGuaranteeFees, r.totalAnnualFees + r.upfrontFee, 0.02);
});

test("paying the fee in cash keeps it out of the loan", () => {
  const r = computeUsda({ ...base, financeFee: "no" });
  assert.equal(r.loanAmount, 275000);
  approx(r.cashToCloseFee, 2750, 0.01);
});

test("FHA comparison: FHA needs cash down and pricier insurance", () => {
  const r = computeUsda(base);
  approx(r.fhaDownPayment, 9625, 0.01);
  assert.ok(r.fhaMonthlyMip > r.monthlyAnnualFee, "FHA MIP is pricier");
  // FHA's smaller balance roughly offsets its pricier MIP, so the monthly
  // totals land close together; the difference is reported as-is.
  approx(r.vsFhaMonthlySaving, r.fhaMonthly - r.totalMonthly, 0.02);
  assert.ok(Math.abs(r.vsFhaMonthlySaving) < 50);
});

test("edge: zero price yields zeros, not NaN", () => {
  const r = computeUsda({ ...base, homePrice: 0 });
  assert.equal(r.loanAmount, 0);
  assert.equal(r.monthlyPI, 0);
  assert.equal(r.totalAnnualFees, 0);
  assert.ok(Number.isFinite(r.totalMonthly));
});

test("edge: down payment can't exceed price", () => {
  const r = computeUsda({ ...base, downPayment: 1e9 });
  assert.equal(r.baseLoan, 0);
  assert.equal(r.downPaymentPct, 100);
});
