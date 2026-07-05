import { test } from "node:test";
import assert from "node:assert/strict";
import { computeRetirement, type RetirementInputs } from "./compute.ts";
import { futureValue, futureValueOfSeries } from "../../lib/calculator/finance.ts";

const base: RetirementInputs = {
  currentAge: 35,
  retirementAge: 65,
  currentSavings: 50000,
  monthlyContribution: 500,
  employerMatchMonthly: 200,
  annualReturn: 7,
  inflationRate: 3,
  targetBalance: 0,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("projected balance = FV of savings + FV of total monthly contributions", () => {
  const r = computeRetirement(base);
  const mr = 0.07 / 12;
  const expected = futureValue(50000, mr, 360) + futureValueOfSeries(700, mr, 360);
  approx(r.projectedBalance, expected, 1);
  assert.equal(r.years, 30);
});

test("real balance is lower than nominal and discounts by inflation", () => {
  const r = computeRetirement(base);
  approx(r.realBalance, r.projectedBalance / Math.pow(1.03, 30), 1);
  assert.ok(r.realBalance < r.projectedBalance);
});

test("employer match grows into a meaningful chunk of the balance", () => {
  const r = computeRetirement(base);
  assert.ok(r.employerMatchGrown > 0);
  assert.equal(r.employerContributions, 200 * 360);
});

test("on-track when a target is met, with a gap when it isn't", () => {
  const easy = computeRetirement({ ...base, targetBalance: 500000 });
  assert.equal(easy.onTrack, true);
  const hard = computeRetirement({ ...base, targetBalance: 3000000 });
  assert.equal(hard.onTrack, false);
  assert.ok(hard.gap > 0);
  assert.ok(hard.requiredMonthly > base.monthlyContribution + base.employerMatchMonthly);
});

test("the $100/mo lever adds a positive amount to the balance", () => {
  const r = computeRetirement(base);
  assert.equal(r.leverExtra, 100);
  assert.ok(r.leverAddedBalance > 0);
});

test("edge: retirement age <= current age yields no growth (savings only)", () => {
  const r = computeRetirement({ ...base, retirementAge: 30 });
  assert.equal(r.years, 0);
  assert.equal(r.projectedBalance, base.currentSavings);
  assert.equal(r.realBalance, base.currentSavings); // no years to discount
});

test("edge: zero contribution still grows the starting balance", () => {
  const r = computeRetirement({ ...base, monthlyContribution: 0, employerMatchMonthly: 0 });
  approx(r.projectedBalance, futureValue(50000, 0.07 / 12, 360), 1);
  assert.equal(r.totalContributions, 0);
});

test("edge: 0% return sums contributions without growth", () => {
  const r = computeRetirement({ ...base, annualReturn: 0, currentSavings: 10000 });
  approx(r.projectedBalance, 10000 + 700 * 360, 1);
  assert.equal(r.investmentGrowth, 0);
});

test("chart runs from current age to retirement age", () => {
  const r = computeRetirement(base);
  assert.equal(r.chart[0].x, "Age 35");
  assert.equal(r.chart[r.chart.length - 1].x, "Age 65");
});
