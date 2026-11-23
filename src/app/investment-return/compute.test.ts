import { test } from "node:test";
import assert from "node:assert/strict";
import { computeInvestmentReturn } from "./compute.ts";

const approx = (a: number, b: number, eps = 0.02) =>
  assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("simple CAGR: $10k → $20k in 10 years ≈ 7.18%", () => {
  const r = computeInvestmentReturn({ startValue: 10000, endValue: 20000, years: 10, monthlyContribution: 0, inflation: 3 });
  approx(r.annualizedReturn, 7.18);
  assert.equal(r.totalReturnPct, 100);
  assert.equal(r.gain, 10000);
  approx(r.doublingYears, 10, 0.02);
  approx(r.realAnnualizedReturn, (1.0718 / 1.03 - 1) * 100, 0.05);
});

test("with contributions, solves the money-weighted rate", () => {
  // $0 start + $500/mo for 10 yrs at 7%/yr (monthly-equivalent) → known FV
  const r0 = Math.pow(1.07, 1 / 12) - 1;
  const end = 500 * ((Math.pow(1 + r0, 120) - 1) / r0);
  const r = computeInvestmentReturn({ startValue: 0, endValue: end, years: 10, monthlyContribution: 500, inflation: 3 });
  approx(r.annualizedReturn, 7, 0.01);
  assert.equal(r.totalContributed, 60000);
  assert.equal(r.hasContributions, true);
});

test("losses produce negative returns", () => {
  const r = computeInvestmentReturn({ startValue: 10000, endValue: 8000, years: 2, monthlyContribution: 0, inflation: 3 });
  assert.ok(r.annualizedReturn < 0);
  assert.equal(r.doublingYears, 0);
  assert.equal(r.totalReturnPct, -20);
});

test("edge: zero years or nothing invested", () => {
  const a = computeInvestmentReturn({ startValue: 10000, endValue: 20000, years: 0, monthlyContribution: 0, inflation: 3 });
  assert.equal(a.valid, false);
  assert.equal(a.annualizedReturn, 0);
  const b = computeInvestmentReturn({ startValue: 0, endValue: 500, years: 5, monthlyContribution: 0, inflation: 3 });
  assert.equal(b.valid, false);
});
