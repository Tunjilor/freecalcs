import { test } from "node:test";
import assert from "node:assert/strict";
import { computeSimpleInterest } from "./compute.ts";

const approx = (a: number, b: number, eps = 0.01) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("I = P × r × t", () => {
  const r = computeSimpleInterest({ principal: 10000, rate: 5, years: 3 });
  assert.equal(r.interest, 1500);
  assert.equal(r.total, 11500);
  assert.equal(r.interestPerYear, 500);
  approx(r.compoundAnnualTotal, 11576.25);
  approx(r.compoundMonthlyTotal, 10000 * Math.pow(1 + 0.05 / 12, 36));
  assert.ok(r.compoundingExtra > 0);
  assert.equal(r.rows.length, 3);
});

test("fractional years", () => {
  const r = computeSimpleInterest({ principal: 2000, rate: 6, years: 0.5 });
  assert.equal(r.interest, 60);
  assert.equal(r.rows.length, 1);
  assert.equal(r.rows[0].year, "Year 0.5");
});

test("edge: zeros", () => {
  const z = computeSimpleInterest({ principal: 0, rate: 5, years: 3 });
  assert.equal(z.total, 0);
  const t = computeSimpleInterest({ principal: 1000, rate: 5, years: 0 });
  assert.equal(t.interest, 0);
  assert.equal(t.rows.length, 0);
});
