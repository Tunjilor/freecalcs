import { test } from "node:test";
import assert from "node:assert/strict";
import { computeTermLife, type TermLifeInputs } from "./compute.ts";

const base: TermLifeInputs = {
  annualIncome: 90000,
  incomeMultiple: 10,
  mortgageBalance: 250000,
  yourAge: 35,
  retirementAge: 65,
  youngestChildAge: 4,
  mortgageYearsLeft: 26,
};

test("coverage need = income × multiple + mortgage", () => {
  const r = computeTermLife(base);
  assert.equal(r.coverageNeed, 90000 * 10 + 250000); // 1,150,000
});

test("term drivers compute from age/child/mortgage", () => {
  const r = computeTermLife(base);
  assert.equal(r.yearsUntilChildIndependent, 18); // 22 − 4
  assert.equal(r.yearsUntilRetirement, 30); // 65 − 35
  assert.equal(r.mortgageYearsLeft, 26);
});

test("recommended term rounds the longest obligation up to a standard term", () => {
  const r = computeTermLife(base);
  assert.equal(r.longestObligationYears, 30); // retirement is longest
  assert.equal(r.recommendedTermYears, 30);
  assert.match(r.longestObligationLabel, /retirement/);
});

test("a shorter longest obligation rounds up to the next standard term", () => {
  // longest = 18 (child) -> next standard term is 20
  const r = computeTermLife({ ...base, retirementAge: 50, mortgageYearsLeft: 10 });
  assert.equal(r.longestObligationYears, 18);
  assert.equal(r.recommendedTermYears, 20);
});

test("edge: no children (age past independence) drops that driver to 0", () => {
  const r = computeTermLife({ ...base, youngestChildAge: 25 });
  assert.equal(r.yearsUntilChildIndependent, 0);
});

test("edge: retirement age <= current age yields 0 for that driver", () => {
  const r = computeTermLife({ ...base, retirementAge: 30 });
  assert.equal(r.yearsUntilRetirement, 0);
});

test("edge: zero income, no mortgage -> zero coverage, still finite", () => {
  const r = computeTermLife({ ...base, annualIncome: 0, mortgageBalance: 0 });
  assert.equal(r.coverageNeed, 0);
  assert.ok(Number.isFinite(r.recommendedTermYears));
});

test("term never exceeds the 30-year cap", () => {
  const r = computeTermLife({ ...base, yourAge: 20, retirementAge: 70 });
  assert.equal(r.longestObligationYears, 50);
  assert.equal(r.recommendedTermYears, 30);
});
