import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDiscount } from "./compute.ts";

test("single discount", () => {
  const r = computeDiscount({ price: 80, percentOff: 25, extraPercentOff: 0, salesTaxPct: 0 });
  assert.equal(r.salePrice, 60);
  assert.equal(r.savings, 20);
  assert.equal(r.effectiveDiscountPct, 25);
});

test("stacked discounts multiply, not add", () => {
  const r = computeDiscount({ price: 100, percentOff: 30, extraPercentOff: 20, salesTaxPct: 0 });
  assert.equal(r.salePrice, 56);
  assert.equal(r.effectiveDiscountPct, 44);
  assert.equal(r.naiveStackPct, 50);
});

test("tax applies to the discounted price", () => {
  const r = computeDiscount({ price: 100, percentOff: 30, extraPercentOff: 20, salesTaxPct: 8 });
  assert.equal(r.tax, 4.48);
  assert.equal(r.finalPrice, 60.48);
});

test("edge: clamps and zero price", () => {
  const r = computeDiscount({ price: 50, percentOff: 150, extraPercentOff: -10, salesTaxPct: 0 });
  assert.equal(r.salePrice, 0);
  const z = computeDiscount({ price: 0, percentOff: 20, extraPercentOff: 0, salesTaxPct: 7 });
  assert.equal(z.effectiveDiscountPct, 0);
  assert.equal(z.finalPrice, 0);
});
