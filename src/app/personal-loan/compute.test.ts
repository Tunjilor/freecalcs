import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computePersonalLoan,
  solveTrueApr,
  monthlyPayment,
  type PersonalLoanInputs,
} from "./compute.ts";

const base: PersonalLoanInputs = {
  principal: 20000,
  apr: 11,
  termMonths: 48,
  originationFeePct: 5,
  extraPayment: 0,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("origination fee is a percent of principal, deducted from proceeds", () => {
  const r = computePersonalLoan(base);
  approx(r.originationFee, 1000, 0.01); // 5% of 20000
  approx(r.amountReceived, 19000, 0.01);
});

test("monthly payment is computed on the full principal at nominal APR", () => {
  const r = computePersonalLoan(base);
  // 20000 @ 11%/48mo ≈ 517.11
  approx(r.monthlyPayment, 517.11, 0.5);
});

test("true APR exceeds the nominal APR when a fee is charged", () => {
  const r = computePersonalLoan(base);
  assert.ok(r.trueApr > base.apr, `trueApr ${r.trueApr} should exceed nominal ${base.apr}`);
  // A 5% fee on a 48-mo loan lifts effective APR by roughly 2–3 points.
  assert.ok(r.trueApr > 12.5 && r.trueApr < 15, `trueApr ${r.trueApr} in expected band`);
});

test("with no fee, true APR ≈ nominal APR", () => {
  const r = computePersonalLoan({ ...base, originationFeePct: 0 });
  assert.equal(r.originationFee, 0);
  approx(r.trueApr, base.apr, 0.05);
});

test("solveTrueApr recovers the nominal rate when received == principal", () => {
  const n = 48;
  const p = 20000;
  const pmt = monthlyPayment(p, 0.11 / 12, n);
  approx(solveTrueApr(p, pmt, n), 11, 0.05);
});

test("extra payment shortens term and saves interest", () => {
  const r = computePersonalLoan({ ...base, extraPayment: 100 });
  assert.ok(r.payoffMonths < r.scheduledMonths);
  assert.ok(r.monthsSaved > 0 && r.interestSaved > 0);
});

test("$100 lever always reports positive savings", () => {
  const r = computePersonalLoan(base);
  assert.equal(r.leverExtra, 100);
  assert.ok(r.leverMonthsSaved > 0 && r.leverInterestSaved > 0);
});

test("totalCost = interest + fee", () => {
  const r = computePersonalLoan(base);
  approx(r.totalCost, r.totalInterest + r.originationFee, 0.02);
});

test("edge: 0% APR, no fee -> even principal split, trueApr 0", () => {
  const r = computePersonalLoan({ ...base, apr: 0, originationFeePct: 0 });
  assert.equal(r.totalInterest, 0);
  approx(r.monthlyPayment, 20000 / 48, 0.01);
  approx(r.trueApr, 0, 0.05);
});

test("edge: zero principal yields zeros, not NaN", () => {
  const r = computePersonalLoan({ ...base, principal: 0 });
  assert.equal(r.monthlyPayment, 0);
  assert.equal(r.originationFee, 0);
  assert.ok(Number.isFinite(r.trueApr));
});

test("schedule ends at ~0 balance", () => {
  const r = computePersonalLoan(base);
  const last = r.schedule[r.schedule.length - 1];
  assert.ok(last.balance <= 1);
});
