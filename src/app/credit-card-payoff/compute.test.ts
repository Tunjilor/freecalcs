import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCreditCard, type CreditCardInputs } from "./compute.ts";

const base: CreditCardInputs = { balance: 6000, apr: 22, monthlyPayment: 250 };

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("first-month interest = balance × monthly rate", () => {
  const r = computeCreditCard(base);
  approx(r.firstMonthInterest, 6000 * (0.22 / 12), 0.02);
});

test("a fixed payment beats minimum-only on both time and interest", () => {
  const r = computeCreditCard(base);
  assert.equal(r.fixedAmortizes, true);
  assert.ok(r.fixedMonths < r.minOnlyMonths, "fixed pays off sooner");
  assert.ok(r.fixedInterest < r.minOnlyInterest, "fixed costs less interest");
  assert.ok(r.interestSaved > 0 && r.monthsSaved > 0);
});

test("minimum-only drags out for years (the minimum trap)", () => {
  const r = computeCreditCard(base);
  assert.ok(r.minOnlyMonths > 120, "minimum-only should take 10+ years");
  assert.ok(r.minOnlyInterest > base.balance * 0.5, "huge interest on minimum-only");
});

test("the first minimum payment exceeds the first month's interest", () => {
  const r = computeCreditCard(base);
  assert.ok(r.minFirstPayment > r.firstMonthInterest);
});

test("edge: fixed payment below monthly interest never amortizes", () => {
  // 10000 @ 30% ≈ $250/mo interest; a $200 payment can't cover it.
  const r = computeCreditCard({ balance: 10000, apr: 30, monthlyPayment: 200 });
  assert.equal(r.fixedAmortizes, false);
  assert.equal(r.fixedLabel, "Never");
  assert.equal(r.interestSaved, 0, "no savings claimed when fixed never amortizes");
});

test("edge: a large fixed payment clears the balance fast", () => {
  const r = computeCreditCard({ ...base, monthlyPayment: 3000 });
  assert.ok(r.fixedMonths <= 3);
});

test("edge: 0% APR pays off by division, no interest", () => {
  const r = computeCreditCard({ balance: 1200, apr: 0, monthlyPayment: 100 });
  assert.equal(r.fixedInterest, 0);
  assert.equal(r.fixedMonths, 12);
});

test("edge: zero balance is already paid off", () => {
  const r = computeCreditCard({ ...base, balance: 0 });
  assert.equal(r.minOnlyMonths, 0);
  assert.equal(r.fixedMonths, 0);
});
