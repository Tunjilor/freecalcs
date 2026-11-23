import { test } from "node:test";
import assert from "node:assert/strict";
import { computeRentAffordability, type RentAffordabilityInputs } from "./compute.ts";

const base: RentAffordabilityInputs = { annualIncome: 60000, monthlyTakeHome: 3900, monthlyDebts: 300, otherNeeds: 600, rent: 1600 };

test("three yardsticks", () => {
  const r = computeRentAffordability(base);
  assert.equal(r.rentAt30, 1500);
  assert.equal(r.rentAt40x, 1500);
  assert.equal(r.rentAt5030, 1050); // 1,950 − 300 − 600
  assert.equal(r.recommendedRent, 1050);
});

test("rent checks", () => {
  const r = computeRentAffordability(base);
  assert.equal(r.rentPctGross, 32);
  assert.equal(r.rentPctTakeHome, 41.03);
  assert.equal(r.costBurdened, true);
  assert.equal(r.severelyBurdened, false);
  assert.equal(r.incomeNeeded40x, 64000);
  assert.equal(r.passes40x, false);
});

test("affordable rent passes", () => {
  const r = computeRentAffordability({ ...base, rent: 1400 });
  assert.equal(r.costBurdened, false);
  assert.equal(r.passes40x, true);
});

test("edge: no take-home, no rent, no income", () => {
  const a = computeRentAffordability({ ...base, monthlyTakeHome: 0 });
  assert.equal(a.recommendedRent, 1500);
  assert.equal(a.rentPctTakeHome, 0);
  const b = computeRentAffordability({ ...base, rent: 0 });
  assert.equal(b.hasRent, false);
  assert.equal(b.passes40x, false);
  const c = computeRentAffordability({ ...base, annualIncome: 0 });
  assert.equal(c.rentPctGross, 0);
  assert.equal(c.costBurdened, false);
});
