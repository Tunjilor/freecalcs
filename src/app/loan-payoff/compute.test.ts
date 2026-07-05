import { test } from "node:test";
import assert from "node:assert/strict";
import { computeLoanPayoff, type LoanPayoffInputs } from "./compute.ts";

const base: LoanPayoffInputs = {
  balance: 18000,
  apr: 7,
  currentPayment: 400,
  extraPayment: 150,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("extra payment shortens payoff and saves interest", () => {
  const r = computeLoanPayoff(base);
  assert.ok(r.newPayoffMonths < r.basePayoffMonths);
  assert.ok(r.monthsSaved > 0);
  assert.ok(r.interestSaved > 0);
});

test("first-month interest is balance × monthly rate", () => {
  const r = computeLoanPayoff(base);
  approx(r.monthlyInterestAtStart, 18000 * (0.07 / 12), 0.01);
  assert.equal(r.paymentCoversInterest, true);
});

test("with no extra, base and new payoff match", () => {
  const r = computeLoanPayoff({ ...base, extraPayment: 0 });
  assert.equal(r.monthsSaved, 0);
  assert.equal(r.interestSaved, 0);
  assert.equal(r.basePayoffMonths, r.newPayoffMonths);
});

test("extraTotalPaid = extra × new payoff months", () => {
  const r = computeLoanPayoff(base);
  approx(r.extraTotalPaid, 150 * r.newPayoffMonths, 0.02);
});

test("edge: payment below monthly interest never amortizes", () => {
  // 18000 @ 24% => ~360/mo interest; a $300 payment can't cover it.
  const r = computeLoanPayoff({ balance: 18000, apr: 24, currentPayment: 300, extraPayment: 0 });
  assert.equal(r.paymentCoversInterest, false);
  assert.equal(r.basePayoffLabel, "Never");
  assert.equal(r.monthsSaved, 0, "no savings claimed when it never amortizes");
});

test("edge: an extra payment can rescue an otherwise-never loan", () => {
  const r = computeLoanPayoff({ balance: 18000, apr: 24, currentPayment: 300, extraPayment: 200 });
  assert.equal(r.paymentCoversInterest, false); // current payment alone doesn't
  assert.equal(r.newPayoffLabel !== "Never", true); // but +extra does amortize
});

test("edge: zero balance is already paid off", () => {
  const r = computeLoanPayoff({ ...base, balance: 0 });
  assert.equal(r.basePayoffMonths, 0);
  assert.equal(r.newPayoffMonths, 0);
  assert.equal(r.newPayoffLabel, "0 mo");
});

test("edge: 0% APR pays off by pure division", () => {
  const r = computeLoanPayoff({ balance: 12000, apr: 0, currentPayment: 400, extraPayment: 0 });
  assert.equal(r.basePayoffMonths, 30); // 12000 / 400
  assert.equal(r.baseTotalInterest, 0);
});

test("payoff labels format as years/months", () => {
  const r = computeLoanPayoff(base);
  assert.match(r.newPayoffLabel, /\d+ (yr|mo)/);
});

test("schedule ends at ~0 balance", () => {
  const r = computeLoanPayoff(base);
  const last = r.schedule[r.schedule.length - 1];
  assert.ok(last.balance <= 1);
});
