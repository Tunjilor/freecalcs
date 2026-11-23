import { test } from "node:test";
import assert from "node:assert/strict";
import { computeMortgageRecast } from "./compute.ts";

const base = { balance: 300000, rate: 6.5, monthsLeft: 300, lumpSum: 50000, recastFee: 250 };
const approx = (a: number, b: number, eps = 0.5) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("recast lowers the payment proportionally", () => {
  const r = computeMortgageRecast(base);
  approx(r.newPayment, r.currentPayment * (250000 / 300000), 0.05);
  approx(r.monthlySaving, r.currentPayment - r.newPayment, 0.02);
  assert.equal(r.newBalance, 250000);
  assert.equal(r.feeBreakEvenMonths, Math.ceil(250 / r.monthlySaving));
});

test("prepaying without a recast saves more interest and time", () => {
  const r = computeMortgageRecast(base);
  assert.ok(r.prepayInterestSaved > r.recastInterestSaved);
  assert.ok(r.prepayMonthsSaved > 0);
  assert.ok(r.recastInterestSaved > 0);
});

test("edge: zero lump, lump > balance, zero rate", () => {
  const z = computeMortgageRecast({ ...base, lumpSum: 0 });
  assert.equal(z.monthlySaving, 0);
  assert.equal(z.feeBreakEvenMonths, 0);
  const all = computeMortgageRecast({ ...base, lumpSum: 1e9 });
  assert.equal(all.newPayment, 0);
  const r0 = computeMortgageRecast({ ...base, rate: 0 });
  approx(r0.currentPayment, 1000, 0.01);
});
