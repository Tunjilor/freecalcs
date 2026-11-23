import { test } from "node:test";
import assert from "node:assert/strict";
import { computeFutureValue } from "./compute.ts";

const approx = (a: number, b: number, eps = 0.02) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("lump sum, annual compounding", () => {
  const r = computeFutureValue({ presentValue: 10000, periodicDeposit: 0, rate: 6, years: 10, periodsPerYear: "1", targetFutureValue: 0 });
  approx(r.futureValue, 10000 * Math.pow(1.06, 10));
  approx(r.growthMultiple, 1.79, 0.01);
});

test("deposits, monthly compounding (ordinary annuity)", () => {
  const r = computeFutureValue({ presentValue: 0, periodicDeposit: 200, rate: 6, years: 10, periodsPerYear: "12", targetFutureValue: 0 });
  const i = 0.005;
  approx(r.futureValue, 200 * ((Math.pow(1 + i, 120) - 1) / i));
  assert.equal(r.totalDeposits, 24000);
  approx(r.effectiveAnnualRate, 6.17, 0.01);
});

test("present value of a goal", () => {
  const r = computeFutureValue({ presentValue: 0, periodicDeposit: 0, rate: 5, years: 10, periodsPerYear: "1", targetFutureValue: 100000 });
  approx(r.presentValueOfTarget, 100000 / Math.pow(1.05, 10));
});

test("edge: zero rate", () => {
  const r = computeFutureValue({ presentValue: 1000, periodicDeposit: 100, rate: 0, years: 2, periodsPerYear: "12", targetFutureValue: 500 });
  assert.equal(r.futureValue, 3400);
  assert.equal(r.interestEarned, 0);
  assert.equal(r.presentValueOfTarget, 500);
});
