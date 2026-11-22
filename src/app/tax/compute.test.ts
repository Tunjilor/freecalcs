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

// Upper bound of each bracket below 37%, copied from the IRS tables: Rev. Proc.
// 2024-40 §3.01 (2025) and Rev. Proc. 2025-32 §4.01 (2026). If tax-data.ts
// drifts from the published figures, this fails.
const IRS_BREAKPOINTS = {
  "2025": {
    single: [11925, 48475, 103350, 197300, 250525, 626350],
    married: [23850, 96950, 206700, 394600, 501050, 751600],
    married_sep: [11925, 48475, 103350, 197300, 250525, 375800],
    hoh: [17000, 64850, 103350, 197300, 250500, 626350],
  },
  "2026": {
    single: [12400, 50400, 105700, 201775, 256225, 640600],
    married: [24800, 100800, 211400, 403550, 512450, 768700],
    married_sep: [12400, 50400, 105700, 201775, 256225, 384350],
    hoh: [17700, 67450, 105700, 201750, 256200, 640600],
  },
} as const;

test("bracket tables match the IRS Rev. Proc. breakpoints and rates", () => {
  for (const year of ["2025", "2026"] as const) {
    for (const status of ["single", "married", "married_sep", "hoh"] as const) {
      const b = TAX_DATA[year].brackets[status];
      assert.deepEqual(b.map((x) => x[2]), [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37], `${year} ${status} rates`);
      assert.deepEqual(b.slice(0, -1).map((x) => x[1]), [...IRS_BREAKPOINTS[year][status]], `${year} ${status}`);
      assert.equal(b[b.length - 1][1], Infinity);
      b.slice(1).forEach((x, i) => assert.equal(x[0], b[i][1], `${year} ${status} brackets are contiguous`));
    }
  }
});

test("2026 head-of-household tax matches the IRS table's running totals", () => {
  // "The Tax Is" column of Rev. Proc. 2025-32 Table 2.
  const hoh = TAX_DATA["2026"].brackets.hoh;
  approx(calcFederalTax(105700, hoh), 16155, 0.01);
  approx(calcFederalTax(201750, hoh), 39207, 0.01);
  approx(calcFederalTax(256200, hoh), 56631, 0.01);
  approx(calcFederalTax(640600, hoh), 191171, 0.01);
});
