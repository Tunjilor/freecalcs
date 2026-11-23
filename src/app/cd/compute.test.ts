import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCd } from "./compute.ts";

const approx = (a: number, b: number, eps = 0.01) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("12-month CD at 4% APY earns exactly 4%", () => {
  const r = computeCd({ deposit: 10000, apy: 4, termMonths: 12, taxRate: 0, inflation: 0 });
  approx(r.endingBalance, 10400);
  approx(r.interestEarned, 400);
  assert.equal(r.rows.length, 4); // months 3, 6, 9, 12
});

test("multi-year CD compounds by APY", () => {
  const r = computeCd({ deposit: 10000, apy: 4, termMonths: 60, taxRate: 22, inflation: 3 });
  approx(r.endingBalance, 10000 * Math.pow(1.04, 5));
  approx(r.taxOnInterest, r.interestEarned * 0.22);
  approx(r.afterTaxApy, 3.12);
  approx(r.realApy, (1.0312 / 1.03 - 1) * 100);
  assert.equal(r.rows[r.rows.length - 1].month, "Month 60");
});

test("6-month CD earns half a year of APY", () => {
  const r = computeCd({ deposit: 5000, apy: 4.5, termMonths: 6, taxRate: 0, inflation: 0 });
  approx(r.endingBalance, 5000 * Math.sqrt(1.045));
});

test("edge: zero deposit / zero APY", () => {
  assert.equal(computeCd({ deposit: 0, apy: 4, termMonths: 12, taxRate: 22, inflation: 3 }).interestEarned, 0);
  const z = computeCd({ deposit: 1000, apy: 0, termMonths: 12, taxRate: 22, inflation: 3 });
  assert.equal(z.interestEarned, 0);
  assert.ok(z.realApy < 0);
});

test("extreme term is capped", () => {
  const r = computeCd({ deposit: 1000, apy: 4, termMonths: 99999999, taxRate: 0, inflation: 0 });
  assert.equal(r.rows[r.rows.length - 1].month, "Month 600");
});
