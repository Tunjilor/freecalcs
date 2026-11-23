import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCarAffordability, loanFromPayment, type CarAffordabilityInputs } from "./compute.ts";
import { monthlyPayment } from "../../lib/calculator/finance.ts";

const base: CarAffordabilityInputs = {
  annualIncome: 75000, monthlyBudget: 500, downPayment: 5000, rate: 7, termMonths: "60",
  salesTaxPct: 7, fees: 800, insuranceMonthly: 150, fuelMaintMonthly: 200,
};
const approx = (a: number, b: number, eps = 1) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("loanFromPayment inverts the payment formula", () => {
  const r = 0.07 / 12;
  const L = loanFromPayment(500, r, 60);
  approx(monthlyPayment(L, r, 60), 500, 0.01);
  approx(loanFromPayment(500, 0, 60), 30000, 0.01);
});

test("budget → max price, after tax and fees", () => {
  const r = computeCarAffordability(base);
  approx(r.maxLoan, 25250, 30);
  approx(r.maxPrice, (r.maxLoan + 5000 - 800) / 1.07, 0.02);
  approx(r.totalInterest, 500 * 60 - r.maxLoan, 0.02);
});

test("20/4/10 guideline", () => {
  const r = computeCarAffordability(base);
  assert.equal(r.guidelineCarCostCap, 625); // 10% of 6,250
  assert.equal(r.guidelinePayment, 275); // 625 − 150 − 200
  assert.ok(r.guidelinePrice > 0 && r.guidelinePrice < r.maxPrice);
  assert.equal(r.totalMonthlyCarCost, 850);
  approx(r.carCostPctIncome, 13.6, 0.01);
  assert.equal(r.overBudgetVsGuideline, true);
  assert.equal(r.meets2048, false); // 60-month term
});

test("meets 20/4 with a 48-month term and big down payment", () => {
  const r = computeCarAffordability({ ...base, termMonths: "48", downPayment: 10000, monthlyBudget: 300 });
  assert.equal(r.meets2048, r.downPctOfPrice >= 20);
});

test("edge: zero budget, zero income, zero rate", () => {
  const z = computeCarAffordability({ ...base, monthlyBudget: 0, downPayment: 0, fees: 0 });
  assert.equal(z.maxLoan, 0);
  assert.equal(z.maxPrice, 0);
  const i = computeCarAffordability({ ...base, annualIncome: 0 });
  assert.equal(i.carCostPctIncome, 0);
  assert.equal(i.overBudgetVsGuideline, false);
  const r0 = computeCarAffordability({ ...base, rate: 0 });
  approx(r0.maxLoan, 30000, 0.01);
  assert.equal(r0.totalInterest, 0);
});
