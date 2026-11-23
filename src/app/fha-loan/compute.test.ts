// Unit tests for the FHA loan compute — run with `npm test` (node --test).

import { test } from "node:test";
import assert from "node:assert/strict";
import { annualMipRate, computeFha, mipDurationYears, type FhaInputs } from "./compute.ts";

const base: FhaInputs = {
  homePrice: 350000,
  downPayment: 12250, // 3.5%
  rate: 6.25,
  termYears: 30,
  creditBand: "580",
  propTaxAnnual: 4200,
  insuranceAnnual: 1500,
  hoaMonthly: 0,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

// ---- MIP rate table (HUD ML 2023-05) --------------------------------------

test("annual MIP: 30yr, standard loan, 3.5% down = 0.55%", () => {
  assert.equal(annualMipRate(337750, 96.5, 30), 0.0055);
});
test("annual MIP: 30yr, standard loan, 5%+ down = 0.50%", () => {
  assert.equal(annualMipRate(332500, 95, 30), 0.005);
});
test("annual MIP: 30yr, loan above $726,200 = 0.70% / 0.75%", () => {
  assert.equal(annualMipRate(800000, 95, 30), 0.007);
  assert.equal(annualMipRate(800000, 96.5, 30), 0.0075);
});
test("annual MIP: 15yr, standard loan = 0.15% at ≤90% LTV, 0.40% above", () => {
  assert.equal(annualMipRate(300000, 90, 15), 0.0015);
  assert.equal(annualMipRate(300000, 96.5, 15), 0.004);
});
test("annual MIP: 15yr, large loan has three tiers", () => {
  assert.equal(annualMipRate(800000, 78, 15), 0.0015);
  assert.equal(annualMipRate(800000, 85, 15), 0.004);
  assert.equal(annualMipRate(800000, 95, 15), 0.0065);
});
test("MIP duration: 11 years at ≤90% LTV, full term above", () => {
  assert.equal(mipDurationYears(90, 30), 11);
  assert.equal(mipDurationYears(96.5, 30), 30);
  assert.equal(mipDurationYears(85, 10), 10);
});

// ---- typical scenario ------------------------------------------------------

test("typical 3.5%-down FHA loan: UFMIP financed, 0.55% MIP for life", () => {
  const r = computeFha(base);
  assert.equal(r.baseLoan, 337750);
  approx(r.downPaymentPct, 3.5, 0.001);
  approx(r.ufmip, 5910.63, 0.01); // 337,750 × 1.75%
  approx(r.loanAmount, 343660.63, 0.01);
  assert.equal(r.annualMipRate, 0.55);
  assert.equal(r.mipForLife, true);
  assert.equal(r.mipYears, 30);
  // P&I on $343,660.63 @ 6.25% / 30yr ≈ $2,115.98
  approx(r.monthlyPI, 2115.98, 1);
  // First-year MIP ≈ avg balance (~$340k) × 0.55% / 12 ≈ $156
  assert.ok(r.monthlyMIP > 150 && r.monthlyMIP < 160, `got ${r.monthlyMIP}`);
  approx(r.totalMonthly, r.monthlyPI + r.monthlyMIP + 350 + 125, 0.05);
  assert.equal(r.meetsMinDown, true);
});

test("10% down: MIP drops off after 11 years and saves money", () => {
  const r = computeFha({ ...base, downPayment: 35000 });
  assert.equal(r.annualMipRate, 0.5);
  assert.equal(r.mipYears, 11);
  assert.equal(r.mipForLife, false);
  const low = computeFha(base);
  assert.ok(low.tenDownMipSaving > 0);
  assert.ok(r.totalMip < low.totalMip);
});

test("credit 500–579 requires 10% down", () => {
  const r = computeFha({ ...base, creditBand: "500" });
  assert.equal(r.minDownPct, 10);
  assert.equal(r.meetsMinDown, false);
  approx(r.minDownAmount, 35000, 0.01);
});

test("loan-limit flags", () => {
  assert.equal(computeFha(base).exceedsFloorLimit, false);
  const r = computeFha({ ...base, homePrice: 700000, downPayment: 24500 });
  assert.equal(r.exceedsFloorLimit, true);
  assert.equal(r.exceedsCeilingLimit, false);
});

// ---- edges -----------------------------------------------------------------

test("edge: zero price yields zeros, not NaN", () => {
  const r = computeFha({ ...base, homePrice: 0, downPayment: 0 });
  assert.equal(r.loanAmount, 0);
  assert.equal(r.monthlyPI, 0);
  assert.equal(r.monthlyMIP, 0);
  assert.ok(Number.isFinite(r.totalCost));
});

test("edge: down payment can't exceed price", () => {
  const r = computeFha({ ...base, downPayment: 9e9 });
  assert.equal(r.baseLoan, 0);
  assert.equal(r.downPaymentPct, 100);
});

test("edge: zero rate amortizes by straight division", () => {
  const r = computeFha({ ...base, rate: 0 });
  approx(r.monthlyPI, r.loanAmount / 360, 0.01);
  assert.equal(r.totalInterest, 0);
});
