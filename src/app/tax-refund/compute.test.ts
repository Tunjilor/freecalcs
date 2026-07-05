import { test } from "node:test";
import assert from "node:assert/strict";
import { computeTaxRefund, type TaxRefundInputs } from "./compute.ts";
import { TAX_DATA, calcFederalTax } from "../../lib/calculator/tax-data.ts";

const base: TaxRefundInputs = {
  year: "2026",
  filing: "single",
  income: 75000,
  preTaxDeductions: 5000,
  withheld: 9000,
  children: 0,
  otherCredits: 0,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("taxable income subtracts pre-tax deductions and the standard deduction", () => {
  const r = computeTaxRefund(base);
  const std = TAX_DATA["2026"].stdDed.single;
  approx(r.taxableIncome, 75000 - 5000 - std, 0.5);
});

test("tax before credits matches the bracket math", () => {
  const r = computeTaxRefund(base);
  const std = TAX_DATA["2026"].stdDed.single;
  approx(r.taxBeforeCredits, calcFederalTax(75000 - 5000 - std, TAX_DATA["2026"].brackets.single), 0.5);
});

test("refund = withholding − tax after credits", () => {
  const r = computeTaxRefund(base);
  approx(r.refundOrOwed, r.withheld - r.taxAfterCredits, 0.02);
  assert.equal(r.isRefund, r.refundOrOwed >= 0);
  assert.match(r.outcomeLabel, /refund|owed|even/);
});

test("under-withholding produces a balance owed (negative)", () => {
  const r = computeTaxRefund({ ...base, withheld: 3000 });
  assert.ok(r.refundOrOwed < 0);
  assert.equal(r.isRefund, false);
  assert.match(r.outcomeLabel, /owed/);
});

test("child tax credit reduces tax and increases the refund", () => {
  const noKids = computeTaxRefund(base);
  const twoKids = computeTaxRefund({ ...base, children: 2 });
  assert.equal(twoKids.childTaxCredit, 2 * TAX_DATA["2026"].childTaxCredit);
  assert.ok(twoKids.refundOrOwed > noKids.refundOrOwed);
});

test("credits are nonrefundable — they can't push tax below zero", () => {
  const r = computeTaxRefund({ ...base, income: 20000, children: 5 });
  assert.ok(r.taxAfterCredits >= 0);
  assert.ok(r.creditsApplied <= r.taxBeforeCredits + 0.01);
});

test("edge: zero income, some withholding -> full refund", () => {
  const r = computeTaxRefund({ ...base, income: 0, preTaxDeductions: 0, withheld: 1200 });
  assert.equal(r.taxableIncome, 0);
  assert.equal(r.taxAfterCredits, 0);
  approx(r.refundOrOwed, 1200, 0.01);
  assert.equal(r.isRefund, true);
});

test("edge: exactly even shows the even label", () => {
  const r = computeTaxRefund(base);
  const even = computeTaxRefund({ ...base, withheld: r.taxAfterCredits });
  assert.match(even.outcomeLabel, /even/);
});

test("married standard deduction lowers taxable income vs single", () => {
  const single = computeTaxRefund({ ...base, filing: "single" });
  const married = computeTaxRefund({ ...base, filing: "married" });
  assert.ok(married.taxableIncome < single.taxableIncome);
});
