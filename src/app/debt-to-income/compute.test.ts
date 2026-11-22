// Unit tests for the DTI compute — run with `npm test` (node --test).

import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDti, type DtiInputs } from "./compute.ts";

const base: DtiInputs = {
  annualIncome: 84000, // $7,000/mo
  housingPayment: 1900,
  carPayments: 450,
  studentLoans: 250,
  creditCardMinimums: 100,
  otherDebts: 0,
};

const approx = (a: number, b: number, eps = 0.01, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("front-end and back-end ratios", () => {
  const r = computeDti(base);
  assert.equal(r.grossMonthly, 7000);
  assert.equal(r.otherDebtTotal, 800);
  assert.equal(r.totalDebt, 2700);
  approx(r.frontEnd, 27.14);
  approx(r.backEnd, 38.57);
  assert.equal(r.band, "good");
});

test("28/36 rule housing limits", () => {
  const r = computeDti(base);
  assert.equal(r.maxHousingAt28, 1960);
  assert.equal(r.maxHousingAt36, 1720); // 2,520 − 800
  assert.equal(r.maxHousingRule, 1720);
});

test("debt cut needed to reach 36% and 43%", () => {
  const r = computeDti(base);
  assert.equal(r.debtCutTo36, 180); // 2,700 − 2,520
  assert.equal(r.debtCutTo43, 0);
});

test("program checks", () => {
  const r = computeDti(base);
  const by = Object.fromEntries(r.programs.map((p) => [p.program, p.passes]));
  assert.equal(by["Conventional (28/36 rule)"], false);
  assert.equal(by["Conventional (DU, max)"], true);
  assert.equal(by["FHA (standard)"], true);
  assert.equal(by["VA (guideline)"], true);
  assert.equal(by["USDA"], true); // 27.1 ≤ 29 and 38.6 ≤ 41
  assert.equal(r.programsPassing, 4);
});

test("bands at each threshold", () => {
  assert.equal(computeDti({ ...base, housingPayment: 1720 }).band, "excellent"); // exactly 36%
  assert.equal(computeDti({ ...base, housingPayment: 2700 }).band, "stretch"); // 50%
  assert.equal(computeDti({ ...base, housingPayment: 3500 }).band, "high");
});

test("edge: zero income does not divide by zero", () => {
  const r = computeDti({ ...base, annualIncome: 0 });
  assert.equal(r.frontEnd, 0);
  assert.equal(r.backEnd, 0);
  assert.equal(r.band, "na");
  assert.equal(r.programsPassing, 0);
});

test("edge: no debts at all", () => {
  const r = computeDti({ annualIncome: 60000, housingPayment: 0, carPayments: 0, studentLoans: 0, creditCardMinimums: 0, otherDebts: 0 });
  assert.equal(r.backEnd, 0);
  assert.equal(r.band, "excellent");
  assert.equal(r.programsPassing, 5);
});

test("edge: negative inputs are treated as zero", () => {
  const r = computeDti({ ...base, carPayments: -500 });
  assert.equal(r.otherDebtTotal, 350);
});
