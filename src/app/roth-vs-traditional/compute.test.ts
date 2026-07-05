import { test } from "node:test";
import assert from "node:assert/strict";
import { computeRoth, type RothInputs } from "./compute.ts";
import { futureValueOfSeries } from "../../lib/calculator/finance.ts";

const base: RothInputs = {
  annualContribution: 7000,
  currentTaxRate: 24,
  retirementTaxRate: 22,
  years: 30,
  annualReturn: 7,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("pretax balance = FV of the annual contributions", () => {
  const r = computeRoth(base);
  approx(r.pretaxBalance, futureValueOfSeries(7000, 0.07, 30), 1);
});

test("after-tax values apply the right rate to each account", () => {
  const r = computeRoth(base);
  approx(r.rothAfterTax, r.pretaxBalance * (1 - 0.24), 1); // Roth taxed at current rate
  approx(r.traditionalAfterTax, r.pretaxBalance * (1 - 0.22), 1); // Traditional at retirement rate
});

test("Traditional wins when the retirement rate is LOWER than today's", () => {
  const r = computeRoth({ ...base, currentTaxRate: 24, retirementTaxRate: 22 });
  assert.equal(r.winner, "Traditional");
  assert.ok(r.traditionalAfterTax > r.rothAfterTax);
});

test("Roth wins when the retirement rate is HIGHER than today's", () => {
  const r = computeRoth({ ...base, currentTaxRate: 22, retirementTaxRate: 32 });
  assert.equal(r.winner, "Roth");
  assert.ok(r.rothAfterTax > r.traditionalAfterTax);
});

test("they tie when the tax rates are equal (break-even)", () => {
  const r = computeRoth({ ...base, currentTaxRate: 24, retirementTaxRate: 24 });
  assert.equal(r.winner, "Tie");
  approx(r.rothAfterTax, r.traditionalAfterTax, 0.5);
  assert.equal(r.breakEvenRate, 24);
});

test("break-even rate equals the current tax rate", () => {
  const r = computeRoth({ ...base, currentTaxRate: 30 });
  assert.equal(r.breakEvenRate, 30);
});

test("edge: zero contribution yields zero everything, not NaN", () => {
  const r = computeRoth({ ...base, annualContribution: 0 });
  assert.equal(r.pretaxBalance, 0);
  assert.equal(r.rothAfterTax, 0);
  assert.equal(r.traditionalAfterTax, 0);
  assert.equal(r.winner, "Tie");
});

test("edge: 0% return still compares correctly on contributions alone", () => {
  const r = computeRoth({ ...base, annualReturn: 0, retirementTaxRate: 10 });
  approx(r.pretaxBalance, 7000 * 30, 1);
  assert.equal(r.winner, "Traditional"); // 10% < 24%
});
