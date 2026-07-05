import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAutoLoan, monthlyPayment, type AutoLoanInputs } from "./compute.ts";

const base: AutoLoanInputs = {
  vehiclePrice: 35000,
  downPayment: 3000,
  tradeIn: 5000,
  salesTaxRate: 7,
  fees: 500,
  termMonths: 60,
  apr: 6.5,
  extraPayment: 0,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("sales tax uses the trade-in credit (price − trade-in)", () => {
  const r = computeAutoLoan(base);
  // (35000 - 5000) * 7% = 2100
  approx(r.salesTax, 2100, 0.01);
  assert.equal(r.taxableBase, 30000);
});

test("amount financed nets down payment, trade-in; adds tax + fees", () => {
  const r = computeAutoLoan(base);
  // 35000 + 2100 tax + 500 fees - 3000 down - 5000 trade = 29600
  approx(r.amountFinanced, 29600, 0.01);
  assert.equal(r.taxAndFees, 2600);
});

test("monthly payment matches amortization on the financed amount", () => {
  const r = computeAutoLoan(base);
  // 29600 @ 6.5%/60mo ≈ 579.24
  approx(r.monthlyPayment, 579.24, 0.5);
  assert.ok(r.totalInterest > 0);
  approx(r.totalCost, r.amountFinanced + r.totalInterest, 0.02);
});

test("interest share of price is reported as a 0–1 ratio", () => {
  const r = computeAutoLoan(base);
  assert.ok(r.interestShareOfPrice > 0 && r.interestShareOfPrice < 0.3);
});

test("extra payment shortens term and saves interest", () => {
  const r = computeAutoLoan({ ...base, extraPayment: 150 });
  assert.ok(r.payoffMonths < r.scheduledMonths);
  assert.ok(r.monthsSaved > 0);
  assert.ok(r.interestSaved > 0);
});

test("$100 lever always reports positive savings", () => {
  const r = computeAutoLoan(base);
  assert.equal(r.leverExtra, 100);
  assert.ok(r.leverMonthsSaved > 0);
  assert.ok(r.leverInterestSaved > 0);
});

test("edge: 0% APR splits principal evenly, no interest", () => {
  const r = computeAutoLoan({ ...base, apr: 0 });
  assert.equal(r.totalInterest, 0);
  approx(r.monthlyPayment, r.amountFinanced / 60, 0.01);
});

test("edge: trade-in ≥ price yields zero taxable base and no financing", () => {
  const r = computeAutoLoan({ ...base, tradeIn: 40000, downPayment: 0, fees: 0 });
  assert.equal(r.taxableBase, 0);
  assert.equal(r.salesTax, 0);
  assert.equal(r.amountFinanced, 0);
  assert.equal(r.monthlyPayment, 0);
});

test("edge: zero price yields all-zero result, not NaN", () => {
  const r = computeAutoLoan({ ...base, vehiclePrice: 0, tradeIn: 0, downPayment: 0, fees: 0 });
  assert.equal(r.amountFinanced, 0);
  assert.ok(Number.isFinite(r.totalInterest));
  assert.equal(r.interestShareOfPrice, 0);
});

test("standalone monthlyPayment helper matches a known figure", () => {
  approx(monthlyPayment(20000, 0.06 / 12, 60), 386.66, 0.5);
});

test("schedule ends at ~0 balance", () => {
  const r = computeAutoLoan(base);
  const last = r.schedule[r.schedule.length - 1];
  assert.ok(last.balance <= 1, `final balance ~0, got ${last.balance}`);
});
