import { test } from "node:test";
import assert from "node:assert/strict";
import {
  monthlyPayment,
  amortizeSchedule,
  amortizeByPayment,
  remainingBalance,
  totalInterest,
  futureValue,
  futureValueOfSeries,
  realReturn,
} from "./finance.ts";

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("monthlyPayment matches known amortization figures", () => {
  approx(monthlyPayment(200000, 0.06 / 12, 360), 1199.1, 0.5);
  approx(monthlyPayment(20000, 0.06 / 12, 60), 386.66, 0.5);
});

test("monthlyPayment handles zero rate as straight division", () => {
  assert.equal(monthlyPayment(120000, 0, 360), 120000 / 360);
});

test("monthlyPayment returns 0 for non-positive term", () => {
  assert.equal(monthlyPayment(1000, 0.05, 0), 0);
});

test("amortizeSchedule pays a loan to ~0 over its term", () => {
  const pmt = monthlyPayment(300000, 0.065 / 12, 360);
  const r = amortizeSchedule(300000, 0.065 / 12, 360, pmt);
  assert.equal(r.payoffMonths, 360);
  assert.ok(r.schedule[r.schedule.length - 1].balance <= 1);
  assert.ok(r.totalInterest > 0);
});

test("amortizeSchedule with extra payment shortens the term and cuts interest", () => {
  const pmt = monthlyPayment(300000, 0.065 / 12, 360);
  const base = amortizeSchedule(300000, 0.065 / 12, 360, pmt, 0);
  const extra = amortizeSchedule(300000, 0.065 / 12, 360, pmt, 300);
  assert.ok(extra.payoffMonths < base.payoffMonths);
  assert.ok(extra.totalInterest < base.totalInterest);
});

test("amortizeSchedule with zero rate splits principal evenly", () => {
  const r = amortizeSchedule(12000, 0, 12, 1000, 0);
  assert.equal(r.totalInterest, 0);
  assert.equal(r.payoffMonths, 12);
});

test("amortizeByPayment reports amortizes=true for a covering payment", () => {
  const r = amortizeByPayment(18000, 0.07 / 12, 400);
  assert.equal(r.amortizes, true);
  assert.ok(r.payoffMonths > 0 && r.payoffMonths < 60);
});

test("amortizeByPayment reports amortizes=false when payment <= interest", () => {
  // 18000 @ 24% ≈ 360/mo interest; a 300 payment can't cover it.
  const r = amortizeByPayment(18000, 0.24 / 12, 300);
  assert.equal(r.amortizes, false);
  assert.equal(r.payoffMonths, 0);
});

test("remainingBalance decreases over time and hits 0 at payoff", () => {
  const pmt = monthlyPayment(300000, 0.065 / 12, 360);
  const after0 = remainingBalance(300000, 0.065 / 12, pmt, 0);
  const after60 = remainingBalance(300000, 0.065 / 12, pmt, 60);
  const after360 = remainingBalance(300000, 0.065 / 12, pmt, 360);
  assert.equal(after0, 300000);
  assert.ok(after60 < 300000 && after60 > after360);
  assert.ok(after360 <= 1);
});

test("totalInterest matches the schedule's cumulative interest", () => {
  const pmt = monthlyPayment(300000, 0.065 / 12, 360);
  const ti = totalInterest(300000, 0.065 / 12, 360, pmt);
  const sched = amortizeSchedule(300000, 0.065 / 12, 360, pmt);
  approx(ti, sched.totalInterest, 0.02);
});

test("futureValue compounds a lump sum", () => {
  approx(futureValue(10000, 0.07, 10), 19671.51, 0.5); // 10000 × 1.07^10
  assert.equal(futureValue(5000, 0.05, 0), 5000); // no periods = unchanged
});

test("futureValueOfSeries: $100/mo at 0.5%/mo for 12 mo (ordinary annuity)", () => {
  // FV = 100 × ((1.005^12 − 1)/0.005) ≈ 1233.56
  approx(futureValueOfSeries(100, 0.005, 12), 1233.56, 0.5);
});

test("futureValueOfSeries: due (beginning-of-period) exceeds ordinary by (1+r)", () => {
  const ordinary = futureValueOfSeries(100, 0.005, 12, false);
  const due = futureValueOfSeries(100, 0.005, 12, true);
  approx(due, ordinary * 1.005, 0.01);
});

test("futureValueOfSeries: zero rate is payment × periods", () => {
  assert.equal(futureValueOfSeries(200, 0, 24), 4800);
  assert.equal(futureValueOfSeries(200, 0, 0), 0);
});

test("realReturn applies the Fisher relation", () => {
  // 7% nominal, 3% inflation -> ~3.88% real
  approx(realReturn(0.07, 0.03), 0.038835, 0.0005);
  approx(realReturn(0.05, 0.05), 0, 0.0001); // equal -> zero real return
});
