import { test } from "node:test";
import assert from "node:assert/strict";
import { computeSalesTax } from "./compute.ts";
import { SALES_TAX } from "../../lib/data/sales-tax.ts";

const approx = (a: number, b: number, eps = 0.01) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("data: 50 states + DC, combined ≈ state + local", () => {
  assert.equal(SALES_TAX.length, 51);
  for (const s of SALES_TAX) approx(s.combined, s.state + s.avgLocal, 0.011);
  assert.equal(new Set(SALES_TAX.map((s) => s.code)).size, 51);
});

test("add tax with a state's average combined rate", () => {
  const r = computeSalesTax({ amount: 100, state: "CA", customRate: 0, mode: "add" });
  assert.equal(r.rateUsed, 9.03);
  approx(r.tax, 9.03);
  approx(r.total, 109.03);
  assert.equal(r.stateRate, 7.25);
});

test("custom rate overrides the state average", () => {
  const r = computeSalesTax({ amount: 250, state: "TX", customRate: 8.25, mode: "add" });
  assert.equal(r.usingCustom, true);
  approx(r.tax, 20.63);
});

test("remove tax from a total", () => {
  const r = computeSalesTax({ amount: 108.25, state: "TX", customRate: 8.25, mode: "remove" });
  approx(r.preTax, 100);
  approx(r.tax, 8.25);
});

test("no-sales-tax state and unknown code fallback", () => {
  const r = computeSalesTax({ amount: 500, state: "OR", customRate: 0, mode: "add" });
  assert.equal(r.tax, 0);
  const u = computeSalesTax({ amount: 100, state: "ZZ", customRate: 0, mode: "add" });
  assert.equal(u.stateName, "Texas");
});
