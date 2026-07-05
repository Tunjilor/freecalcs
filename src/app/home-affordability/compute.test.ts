import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAffordability, type AffordabilityInputs } from "./compute.ts";
import { monthlyPayment } from "../../lib/calculator/finance.ts";

const base: AffordabilityInputs = {
  annualIncome: 120000,
  monthlyDebts: 600,
  downPayment: 60000,
  rate: 6.5,
  termYears: 30,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("returns three DTI levels in ascending order of price", () => {
  const r = computeAffordability(base);
  assert.equal(r.levels.length, 3);
  assert.deepEqual(r.levels.map((l) => l.label), ["Conservative", "Moderate", "Aggressive"]);
  assert.ok(r.levels[0].maxPrice < r.levels[1].maxPrice);
  assert.ok(r.levels[1].maxPrice < r.levels[2].maxPrice);
});

test("moderate max payment = income/12 × 43% − debts", () => {
  const r = computeAffordability(base);
  approx(r.maxPaymentModerate, (120000 / 12) * 0.43 - 600, 0.5);
});

test("max price = max loan + down payment", () => {
  const r = computeAffordability(base);
  const pd = monthlyPayment(1, 0.065 / 12, 360);
  approx(r.maxLoanModerate, r.maxPaymentModerate / pd, 1);
  approx(r.maxPriceModerate, r.maxLoanModerate + 60000, 0.5);
});

test("down payment below 20% flags PMI", () => {
  const r = computeAffordability(base); // $60k down on a ~$600k+ price is < 20%
  assert.equal(r.needsPmi, true);
  assert.ok(r.pmiMonthly > 0);
  assert.ok(r.downPaymentPct < 20);
});

test("a large down payment clears the PMI flag", () => {
  const r = computeAffordability({ ...base, downPayment: 200000 });
  assert.ok(r.downPaymentPct >= 20 || !r.needsPmi);
  if (!r.needsPmi) assert.equal(r.pmiMonthly, 0);
});

test("more debt reduces affordability", () => {
  const low = computeAffordability({ ...base, monthlyDebts: 200 });
  const high = computeAffordability({ ...base, monthlyDebts: 1500 });
  assert.ok(high.maxPriceModerate < low.maxPriceModerate);
});

test("edge: debts exceeding the DTI cap yield zero affordability", () => {
  const r = computeAffordability({ ...base, monthlyDebts: 99999 });
  assert.equal(r.maxPaymentModerate, 0);
  assert.equal(r.maxLoanModerate, 0);
  assert.equal(r.maxPriceModerate, base.downPayment); // only the down payment
});

test("edge: zero income yields zero payment, not NaN", () => {
  const r = computeAffordability({ ...base, annualIncome: 0 });
  assert.equal(r.maxPaymentModerate, 0);
  assert.ok(Number.isFinite(r.maxPriceModerate));
});
