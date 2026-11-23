import { test } from "node:test";
import assert from "node:assert/strict";
import { computeMortgagePoints, type MortgagePointsInputs } from "./compute.ts";

const base: MortgagePointsInputs = {
  loanAmount: 350000,
  baseRate: 6.75,
  points: 1,
  reductionPerPoint: 0.25,
  termYears: 30,
  yearsKeep: 7,
};
const approx = (a: number, b: number, eps = 1) =>
  assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("1 point on $350k lowers the rate 0.25 and costs $3,500", () => {
  const r = computeMortgagePoints(base);
  assert.equal(r.pointsCost, 3500);
  assert.equal(r.newRate, 6.5);
  // $350k @ 6.75% ≈ $2,270.09 ; @ 6.5% ≈ $2,212.24
  approx(r.paymentNoPoints, 2270.09, 0.5);
  approx(r.paymentWithPoints, 2212.24, 0.5);
  approx(r.monthlySaving, 57.85, 0.5);
  assert.equal(r.breakEvenMonths, Math.ceil(3500 / r.monthlySaving));
});

test("net over the stay includes the lower balance", () => {
  const r = computeMortgagePoints(base);
  assert.ok(r.balanceAdvantageAtExit > 0);
  approx(r.netSavingsOverStay, r.paymentSavingsOverStay + r.balanceAdvantageAtExit - 3500, 0.02);
  assert.equal(r.worthIt, true);
});

test("selling after 3 years loses money", () => {
  const r = computeMortgagePoints({ ...base, yearsKeep: 3 });
  assert.equal(r.worthIt, false);
  assert.ok(r.netSavingsOverStay < 0);
});

test("full-term net is large and rows climb", () => {
  const r = computeMortgagePoints(base);
  assert.ok(r.netSavingsFullTerm > 15000);
  assert.equal(r.rows.length, 30);
  assert.ok(r.rows[29].net > r.rows[0].net);
});

test("edge: zero points / zero loan", () => {
  const z = computeMortgagePoints({ ...base, points: 0 });
  assert.equal(z.pointsCost, 0);
  assert.equal(z.monthlySaving, 0);
  assert.equal(z.breakEvenMonths, 0);
  const e = computeMortgagePoints({ ...base, loanAmount: 0 });
  assert.equal(e.netSavingsOverStay, 0);
});

test("edge: rate can't go below zero", () => {
  const r = computeMortgagePoints({ ...base, points: 40 });
  assert.equal(r.newRate, 0);
});
