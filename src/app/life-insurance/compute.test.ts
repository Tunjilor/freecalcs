import { test } from "node:test";
import assert from "node:assert/strict";
import { computeLifeInsurance, type LifeInsuranceInputs } from "./compute.ts";

const base: LifeInsuranceInputs = {
  annualIncome: 90000,
  yearsToReplace: 10,
  totalDebt: 20000,
  mortgageBalance: 300000,
  childrenCount: 2,
  educationPerChild: 100000,
  existingCoverage: 100000,
  liquidSavings: 50000,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("DIME components compute correctly", () => {
  const r = computeLifeInsurance(base);
  assert.equal(r.debtComponent, 20000);
  assert.equal(r.incomeComponent, 900000); // 90k × 10
  assert.equal(r.mortgageComponent, 300000);
  assert.equal(r.educationComponent, 200000); // 2 × 100k
});

test("gross need is the sum of the four DIME components", () => {
  const r = computeLifeInsurance(base);
  assert.equal(r.grossNeed, 20000 + 900000 + 300000 + 200000); // 1,420,000
});

test("recommended coverage nets out existing coverage and savings", () => {
  const r = computeLifeInsurance(base);
  assert.equal(r.offsets, 150000); // 100k coverage + 50k savings
  assert.equal(r.recommendedCoverage, 1420000 - 150000); // 1,270,000
});

test("10x income rule is computed for comparison", () => {
  const r = computeLifeInsurance(base);
  assert.equal(r.tenXIncome, 900000);
  assert.equal(r.vsTenXDelta, 1270000 - 900000); // DIME is higher here
});

test("income share reflects the biggest DIME piece", () => {
  const r = computeLifeInsurance(base);
  approx(r.incomeSharePct, (900000 / 1420000) * 100, 0.1); // ~63%
});

test("edge: offsets exceeding gross need floor coverage at zero (never negative)", () => {
  const r = computeLifeInsurance({ ...base, existingCoverage: 2000000 });
  assert.equal(r.recommendedCoverage, 0);
});

test("edge: no kids -> zero education component", () => {
  const r = computeLifeInsurance({ ...base, childrenCount: 0 });
  assert.equal(r.educationComponent, 0);
});

test("edge: zero income -> income & 10x are zero, still finite", () => {
  const r = computeLifeInsurance({ ...base, annualIncome: 0 });
  assert.equal(r.incomeComponent, 0);
  assert.equal(r.tenXIncome, 0);
  assert.ok(Number.isFinite(r.recommendedCoverage));
});

test("more replacement years raises the income component linearly", () => {
  const y10 = computeLifeInsurance({ ...base, yearsToReplace: 10 });
  const y15 = computeLifeInsurance({ ...base, yearsToReplace: 15 });
  assert.equal(y15.incomeComponent - y10.incomeComponent, base.annualIncome * 5);
});
