import { test } from "node:test";
import assert from "node:assert/strict";
import { computeIncomeTax, type IncomeTaxInputs } from "./compute.ts";
import { TAX_DATA, calcFederalTax } from "../../lib/calculator/tax-data.ts";

const base: IncomeTaxInputs = {
  year: "2026",
  filing: "single",
  wages: 85000,
  interest: 0,
  dividends: 0,
  otherIncome: 0,
  deductionType: "standard",
  itemizedAmount: 0,
  contribution401k: 5000,
  hsa: 0,
  studentLoanInterest: 0,
  children: 0,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("taxable income = income − above-line − standard deduction", () => {
  const r = computeIncomeTax(base);
  const std = TAX_DATA["2026"].stdDed.single;
  approx(r.taxableIncome, 85000 - 5000 - std, 0.5);
  approx(r.taxBeforeCredits, calcFederalTax(85000 - 5000 - std, TAX_DATA["2026"].brackets.single), 0.5);
});

test("effective rate is below the marginal rate (progressive system)", () => {
  const r = computeIncomeTax(base);
  assert.ok(r.effectiveRate < r.marginalRate);
  assert.equal(r.marginalRate, 22); // 2026 single at ~64k taxable
});

test("bracket breakdown sums to the tax before credits", () => {
  const r = computeIncomeTax(base);
  const sumTax = r.brackets.reduce((s, b) => s + b.taxInBracket, 0);
  approx(sumTax, r.taxBeforeCredits, 1);
  // amounts in each active bracket sum to taxable income
  const sumAmt = r.brackets.reduce((s, b) => s + b.amountInBracket, 0);
  approx(sumAmt, r.taxableIncome, 1);
});

test("child tax credit reduces tax dollar-for-dollar", () => {
  const noKids = computeIncomeTax(base);
  const twoKids = computeIncomeTax({ ...base, children: 2 });
  approx(twoKids.childTaxCredit, 2 * TAX_DATA["2026"].childTaxCredit, 0.5);
  approx(twoKids.federalTax, noKids.federalTax - twoKids.childTaxCredit, 1);
});

test("itemizing above the standard deduction lowers taxable income", () => {
  const std = computeIncomeTax(base);
  const itemized = computeIncomeTax({ ...base, deductionType: "itemized", itemizedAmount: 30000 });
  assert.equal(itemized.deductionKind, "itemized");
  assert.ok(itemized.taxableIncome < std.taxableIncome);
});

test("itemizing below the standard deduction still floors at standard", () => {
  const r = computeIncomeTax({ ...base, deductionType: "itemized", itemizedAmount: 1000 });
  assert.equal(r.deductionKind, "standard");
  assert.equal(r.deduction, TAX_DATA["2026"].stdDed.single);
});

test("married filing jointly owes less than single on the same income", () => {
  const single = computeIncomeTax({ ...base, filing: "single" });
  const married = computeIncomeTax({ ...base, filing: "married" });
  assert.ok(married.federalTax < single.federalTax);
});

test("edge: zero income yields zero tax, not NaN", () => {
  const r = computeIncomeTax({ ...base, wages: 0, contribution401k: 0 });
  assert.equal(r.taxableIncome, 0);
  assert.equal(r.federalTax, 0);
  assert.equal(r.effectiveRate, 0);
  assert.ok(Number.isFinite(r.marginalRate));
  assert.equal(r.brackets.length, 0);
});

test("edge: top bracket income reaches the 37% marginal rate", () => {
  const r = computeIncomeTax({ ...base, wages: 2000000, contribution401k: 0 });
  assert.equal(r.marginalRate, 37);
  assert.ok(r.effectiveRate > 30 && r.effectiveRate < 37);
});

test("edge: income exactly at the 22%/24% threshold", () => {
  // 2026 single: 24% starts at taxable 105,700. Back into it via wages.
  const std = TAX_DATA["2026"].stdDed.single;
  const r = computeIncomeTax({ ...base, wages: 105700 + std, contribution401k: 0 });
  approx(r.taxableIncome, 105700, 0.5);
  assert.equal(r.marginalRate, 22, "at the boundary the last dollar is still 22%");
});

test("2025 and 2026 differ due to inflation adjustments", () => {
  const r25 = computeIncomeTax({ ...base, year: "2025" });
  const r26 = computeIncomeTax({ ...base, year: "2026" });
  assert.ok(r26.taxableIncome < r25.taxableIncome, "2026 has a larger standard deduction");
});

test("total income aggregates all income lines", () => {
  const r = computeIncomeTax({ ...base, interest: 1000, dividends: 2000, otherIncome: 500 });
  approx(r.totalIncome, 85000 + 1000 + 2000 + 500, 0.5);
});
