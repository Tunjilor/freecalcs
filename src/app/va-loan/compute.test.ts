// Unit tests for the VA loan compute — run with `npm test` (node --test).
// Node 24 strips the TypeScript types natively; no test framework needed.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeVaLoan,
  fundingFeeRate,
  monthlyPayment,
  type VaLoanInputs,
} from "./compute.ts";

const base: VaLoanInputs = {
  homePrice: 400000,
  downPayment: 0,
  rate: 6.5,
  termYears: 30,
  usage: "first",
  exempt: "no",
  financeFee: "yes",
  extraPayment: 0,
  propTaxAnnual: 4800,
  insuranceAnnual: 1500,
  hoaMonthly: 0,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

// ---- funding-fee table ----------------------------------------------------

test("funding-fee rate: first use, $0 down = 2.15%", () => {
  assert.equal(fundingFeeRate("first", "no", 0), 0.0215);
});

test("funding-fee rate: subsequent use, $0 down = 3.30%", () => {
  assert.equal(fundingFeeRate("subsequent", "no", 0), 0.033);
});

test("funding-fee rate: 5–9.99% down = 1.50% regardless of usage", () => {
  assert.equal(fundingFeeRate("first", "no", 5), 0.015);
  assert.equal(fundingFeeRate("subsequent", "no", 7.5), 0.015);
});

test("funding-fee rate: 10%+ down = 1.25% regardless of usage", () => {
  assert.equal(fundingFeeRate("first", "no", 10), 0.0125);
  assert.equal(fundingFeeRate("subsequent", "no", 25), 0.0125);
});

test("funding-fee rate: exempt overrides everything = 0%", () => {
  assert.equal(fundingFeeRate("first", "yes", 0), 0);
  assert.equal(fundingFeeRate("subsequent", "yes", 0), 0);
});

// ---- amortization primitive ----------------------------------------------

test("monthlyPayment matches the standard amortization formula", () => {
  // $200k @ 6% / 30yr is a well-known ~$1,199.10
  approx(monthlyPayment(200000, 0.06 / 12, 360), 1199.1, 0.5);
});

test("monthlyPayment handles a zero interest rate (straight division)", () => {
  assert.equal(monthlyPayment(120000, 0, 360), 120000 / 360);
});

// ---- typical scenario: $0 down, first use, financed fee -------------------

test("typical: $0-down first-use loan finances a 2.15% funding fee", () => {
  const r = computeVaLoan(base);
  assert.equal(r.baseLoan, 400000);
  assert.equal(r.downPaymentPct, 0);
  assert.equal(r.fundingFeeRate, 2.15);
  approx(r.fundingFeeAmount, 8600, 0.01); // 400000 * 0.0215
  assert.equal(r.fundingFeeFinanced, true);
  approx(r.loanAmount, 408600, 0.01);
  // P&I on 408,600 @ 6.5% / 30yr ≈ 2,582
  approx(r.monthlyPI, 2582.4, 2);
  assert.equal(r.monthlyPMI, 0, "VA loans never carry PMI");
  assert.equal(r.scheduledMonths, 360);
  assert.ok(r.totalInterest > 0);
  approx(r.totalCost, r.loanAmount + r.totalInterest, 0.01);
});

test("PITI adds taxes/insurance/HOA on top of P&I", () => {
  const r = computeVaLoan({ ...base, hoaMonthly: 120 });
  approx(
    r.totalMonthly,
    r.monthlyPI + 4800 / 12 + 1500 / 12 + 120,
    0.02,
  );
});

// ---- edge: exempt disabled veteran ---------------------------------------

test("edge: exempt veteran pays no funding fee and finances nothing extra", () => {
  const r = computeVaLoan({ ...base, exempt: "yes" });
  assert.equal(r.fundingFeeRate, 0);
  assert.equal(r.fundingFeeAmount, 0);
  assert.equal(r.fundingFeeFinanced, false);
  assert.equal(r.loanAmount, 400000);
});

// ---- edge: 10%+ down gets the lowest fee ---------------------------------

test("edge: 10%+ down uses the 1.25% tier and reduces the base loan", () => {
  const r = computeVaLoan({ ...base, downPayment: 40000 });
  assert.equal(r.downPaymentPct, 10);
  assert.equal(r.fundingFeeRate, 1.25);
  assert.equal(r.baseLoan, 360000);
  approx(r.fundingFeeAmount, 4500, 0.01); // 360000 * 0.0125
});

// ---- edge: pay funding fee in cash instead of financing ------------------

test("edge: paying the fee in cash keeps it out of the amortized loan", () => {
  const r = computeVaLoan({ ...base, financeFee: "no" });
  assert.equal(r.fundingFeeFinanced, false);
  assert.equal(r.loanAmount, 400000);
  assert.ok(r.fundingFeeAmount > 0, "fee still owed, just not financed");
});

// ---- edge: extra payment shortens the loan and saves interest ------------

test("edge: extra monthly principal cuts months and interest", () => {
  const r = computeVaLoan({ ...base, extraPayment: 300 });
  assert.ok(r.payoffMonths < r.scheduledMonths, "pays off early");
  assert.ok(r.monthsSaved > 0);
  assert.ok(r.interestSaved > 0);
});

// ---- edge: zero / degenerate inputs don't blow up ------------------------

test("edge: zero home price yields zeros, not NaN", () => {
  const r = computeVaLoan({ ...base, homePrice: 0, downPayment: 0 });
  assert.equal(r.baseLoan, 0);
  assert.equal(r.loanAmount, 0);
  assert.equal(r.monthlyPI, 0);
  assert.ok(Number.isFinite(r.totalInterest));
});

test("edge: down payment cannot exceed home price", () => {
  const r = computeVaLoan({ ...base, downPayment: 999999 });
  assert.equal(r.baseLoan, 0);
  assert.equal(r.downPaymentPct, 100);
});

// ---- comparison vs conventional PMI --------------------------------------

test("conventional PMI comparison favors VA at $0 down", () => {
  const r = computeVaLoan(base);
  assert.ok(r.conventionalPmiMonthly > 0, "conventional would carry PMI");
  assert.ok(r.conventionalPmiTotal > 0);
  // VA's one-time fee is typically far less than years of PMI.
  assert.ok(r.vaVsConventionalUpfrontSaving > 0);
});

test("extra-payment lever ($250/mo) always reports positive savings", () => {
  const r = computeVaLoan(base);
  assert.equal(r.leverExtra, 250);
  assert.ok(r.leverMonthsSaved > 0, "adding $250/mo shortens the term");
  assert.ok(r.leverInterestSaved > 0, "adding $250/mo saves interest");
});

test("schedule ends at a (near) zero balance", () => {
  const r = computeVaLoan(base);
  const last = r.schedule[r.schedule.length - 1];
  assert.ok(last.balance <= 1, `final balance ~0, got ${last.balance}`);
});
