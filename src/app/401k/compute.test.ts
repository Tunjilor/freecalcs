import { test } from "node:test";
import assert from "node:assert/strict";
import { computeFourOhOneK, type FourOhOneKInputs } from "./compute.ts";
import { contributionLimit } from "../../lib/calculator/retirement-data.ts";

const base: FourOhOneKInputs = {
  year: "2026",
  currentAge: 40,
  retirementAge: 65,
  salary: 100000,
  contributionPercent: 6,
  employerMatchRate: 50, // 50% match
  employerMatchLimitPercent: 6, // up to 6% of salary
  annualReturn: 7,
  currentBalance: 50000,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("employee annual = salary × contribution %", () => {
  const r = computeFourOhOneK(base);
  approx(r.employeeAnnual, 6000, 0.5); // 6% of 100k
  assert.equal(r.overLimit, false);
});

test("employer match = matchRate × matched contribution (capped at match limit)", () => {
  const r = computeFourOhOneK(base);
  // 50% of 6% of 100k = 3000
  approx(r.employerAnnual, 3000, 0.5);
  assert.equal(r.matchLeftOnTable, 0, "contributing to the cap captures the full match");
});

test("under-contributing leaves employer match on the table", () => {
  const r = computeFourOhOneK({ ...base, contributionPercent: 3 });
  // matched on 3%: 50% × 3% × 100k = 1500; full would be 3000 -> 1500 left
  approx(r.employerAnnual, 1500, 0.5);
  approx(r.matchLeftOnTable, 1500, 0.5);
});

test("2026 base limit for under-50 is $24,500", () => {
  const r = computeFourOhOneK({ ...base, currentAge: 40, salary: 1000000, contributionPercent: 100 });
  assert.equal(r.limit, 24500);
  assert.equal(r.employeeAnnual, 24500); // capped at the limit
  assert.equal(r.overLimit, true);
});

test("age 50+ adds the standard catch-up ($8,000 in 2026)", () => {
  const r = computeFourOhOneK({ ...base, currentAge: 55 });
  assert.equal(r.catchUp, "standard");
  assert.equal(r.limit, 24500 + 8000);
  assert.equal(r.limit, contributionLimit("2026", 55));
});

test("ages 60-63 get the higher SECURE 2.0 catch-up ($11,250), not the standard one", () => {
  const r = computeFourOhOneK({ ...base, currentAge: 61 });
  assert.equal(r.catchUp, "super");
  assert.equal(r.limit, 24500 + 11250);
  // and it's distinct from the age-55 (standard) limit
  assert.ok(r.limit > computeFourOhOneK({ ...base, currentAge: 55 }).limit);
});

test("age 64 reverts to the standard catch-up (not the 60-63 super)", () => {
  const r = computeFourOhOneK({ ...base, currentAge: 64 });
  assert.equal(r.catchUp, "standard");
  assert.equal(r.limit, 24500 + 8000);
});

test("2025 uses the lower base limit ($23,500)", () => {
  const r = computeFourOhOneK({ ...base, year: "2025", currentAge: 40 });
  assert.equal(r.limit, 23500);
});

test("balance at retirement grows the current balance plus all contributions", () => {
  const r = computeFourOhOneK(base);
  assert.ok(r.balanceAtRetirement > base.currentBalance);
  assert.ok(r.employerMatchGrown > 0);
  assert.equal(r.years, 25);
});

test("edge: retirement age <= current age is just the current balance", () => {
  const r = computeFourOhOneK({ ...base, retirementAge: 40 });
  assert.equal(r.years, 0);
  approx(r.balanceAtRetirement, base.currentBalance, 0.5);
});

test("edge: zero contribution still captures no match and grows the balance", () => {
  const r = computeFourOhOneK({ ...base, contributionPercent: 0 });
  assert.equal(r.employeeAnnual, 0);
  assert.equal(r.employerAnnual, 0);
  assert.ok(r.matchLeftOnTable > 0);
});
