import { test } from "node:test";
import assert from "node:assert/strict";
import { computeStudentLoan, type StudentLoanInputs } from "./compute.ts";

const base: StudentLoanInputs = { balance: 35000, rate: 6.5, termYears: 10, extraMonthly: 0, annualIncome: 55000 };
const approx = (a: number, b: number, eps = 0.5) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("10-year standard payment", () => {
  const r = computeStudentLoan(base);
  approx(r.monthlyPayment, 397.42); // $35k @ 6.5% / 120
  assert.equal(r.payoffMonths, 120);
  approx(r.totalInterest, 397.42 * 120 - 35000, 2);
  approx(r.pmt10, r.monthlyPayment, 0.01);
  approx(r.paymentPctIncome, (397.42 / (55000 / 12)) * 100, 0.05);
});

test("extended 25-year lowers payment but costs more interest", () => {
  const r = computeStudentLoan(base);
  assert.ok(r.pmt25 < r.pmt10);
  assert.ok(r.interest25 > 2 * r.interest10);
});

test("extra payments save time and interest", () => {
  const r = computeStudentLoan({ ...base, extraMonthly: 100 });
  assert.ok(r.monthsSaved > 20, `got ${r.monthsSaved}`);
  assert.ok(r.interestSaved > 2000);
  assert.equal(r.series[r.series.length - 1].y, 0);
});

test("edge: zero balance, zero rate, zero income", () => {
  const z = computeStudentLoan({ ...base, balance: 0 });
  assert.equal(z.monthlyPayment, 0);
  assert.equal(z.totalInterest, 0);
  const r0 = computeStudentLoan({ ...base, rate: 0 });
  approx(r0.monthlyPayment, 35000 / 120, 0.01);
  const i = computeStudentLoan({ ...base, annualIncome: 0 });
  assert.equal(i.paymentPctIncome, 0);
});
