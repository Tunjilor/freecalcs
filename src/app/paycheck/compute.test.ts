import { test } from "node:test";
import assert from "node:assert/strict";
import { computePaycheck, type PaycheckInputs } from "./compute.ts";
import { TAX_DATA } from "../../lib/calculator/tax-data.ts";

const base: PaycheckInputs = {
  year: "2026",
  filing: "single",
  grossPerCheck: 3000,
  frequency: "biweekly",
  preTaxPerCheck: 200,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("frequency sets the number of pay periods", () => {
  assert.equal(computePaycheck(base).periods, 26);
  assert.equal(computePaycheck({ ...base, frequency: "weekly" }).periods, 52);
  assert.equal(computePaycheck({ ...base, frequency: "semimonthly" }).periods, 24);
  assert.equal(computePaycheck({ ...base, frequency: "monthly" }).periods, 12);
});

test("Social Security is 6.2% of gross below the wage base", () => {
  const r = computePaycheck(base);
  approx(r.socialSecurityPerCheck, 3000 * 0.062, 0.02);
});

test("Medicare is 1.45% of gross below the Additional-Medicare threshold", () => {
  const r = computePaycheck(base);
  approx(r.medicarePerCheck, 3000 * 0.0145, 0.02);
});

test("net = gross − pretax − federal − FICA, and take-home rate is sane", () => {
  const r = computePaycheck(base);
  approx(r.netPerCheck, 3000 - 200 - r.federalPerCheck - r.ficaPerCheck, 0.02);
  assert.ok(r.takeHomeRate > 0.5 && r.takeHomeRate < 1);
});

test("pre-tax deductions lower federal withholding", () => {
  const withDed = computePaycheck(base);
  const noDed = computePaycheck({ ...base, preTaxPerCheck: 0 });
  assert.ok(withDed.federalPerCheck < noDed.federalPerCheck, "401k lowers taxable income");
});

test("edge: high earner stops paying Social Security past the wage base", () => {
  const r = computePaycheck({ ...base, grossPerCheck: 20000, frequency: "monthly" }); // 240k/yr
  const wageBase = TAX_DATA["2026"].ssWageBase;
  assert.equal(r.hitSsCap, true);
  // annual SS capped at wageBase × 6.2%, spread over 12 checks
  approx(r.socialSecurityPerCheck, (wageBase * 0.062) / 12, 1);
});

test("edge: Additional Medicare applies above the threshold", () => {
  const high = computePaycheck({ ...base, grossPerCheck: 25000, frequency: "monthly" }); // 300k/yr
  const monthlyBase = 25000 * 0.0145;
  assert.ok(high.medicarePerCheck > monthlyBase, "extra 0.9% above 200k");
});

test("edge: zero gross yields zero net, not NaN", () => {
  const r = computePaycheck({ ...base, grossPerCheck: 0, preTaxPerCheck: 0 });
  assert.equal(r.netPerCheck, 0);
  assert.equal(r.takeHomeRate, 0);
  assert.ok(Number.isFinite(r.federalPerCheck));
});

test("2025 vs 2026 differ (standard deduction / brackets)", () => {
  const r25 = computePaycheck({ ...base, year: "2025" });
  const r26 = computePaycheck({ ...base, year: "2026" });
  assert.ok(r26.federalPerCheck <= r25.federalPerCheck, "2026's larger deduction/brackets lower tax");
});
