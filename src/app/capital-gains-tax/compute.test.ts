import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCapitalGains, type CapitalGainsInputs } from "./compute.ts";
import { calcLTCGTax, TAX_DATA } from "../../lib/calculator/tax-data.ts";

const base: CapitalGainsInputs = {
  year: "2026",
  filing: "single",
  proceeds: 60000,
  basis: 40000,
  holding: "long",
  otherTaxableIncome: 90000,
};

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("gain is proceeds minus basis", () => {
  const r = computeCapitalGains(base);
  assert.equal(r.gain, 20000);
  assert.equal(r.isLoss, false);
});

test("long-term gain at 15% when stacked into the 15% band", () => {
  const r = computeCapitalGains(base);
  // $90k ordinary is above the single 0% ceiling (49,450), so the whole gain is 15%
  approx(r.longTermTax, 20000 * 0.15, 1);
  assert.equal(r.taxOwed, r.longTermTax);
});

test("short-term gain is taxed as ordinary income (more than long-term here)", () => {
  const r = computeCapitalGains({ ...base, holding: "short" });
  assert.equal(r.taxOwed, r.shortTermTax);
  assert.ok(r.shortTermTax > r.longTermTax, "ordinary rates exceed 15% at this income");
  assert.ok(r.savingsFromLongTerm > 0);
});

test("edge: low income puts the whole long-term gain in the 0% bracket", () => {
  const r = computeCapitalGains({ ...base, otherTaxableIncome: 20000, proceeds: 25000, basis: 20000 });
  // ordinary 20k + gain 5k = 25k, under the 2026 single 0% ceiling (49,450)
  assert.equal(r.longTermTax, 0);
  assert.equal(r.ltcgZeroBracket, true);
});

test("edge: a loss produces no tax and reports the loss amount", () => {
  const r = computeCapitalGains({ ...base, proceeds: 30000, basis: 40000 });
  assert.equal(r.gain, 0);
  assert.equal(r.isLoss, true);
  assert.equal(r.lossAmount, 10000);
  assert.equal(r.taxOwed, 0);
});

test("edge: gain straddling the 0% ceiling is split across 0% and 15%", () => {
  // 2026 single 0% ceiling is 49,450. Ordinary 40k, gain 20k -> 9,450 at 0%, 10,550 at 15%.
  const r = computeCapitalGains({ ...base, otherTaxableIncome: 40000, proceeds: 60000, basis: 40000 });
  const ltcg = TAX_DATA["2026"].ltcg.single;
  approx(r.longTermTax, calcLTCGTax(20000, 40000, ltcg), 0.5);
  assert.ok(r.longTermTax > 0 && r.longTermTax < 20000 * 0.15);
});

test("edge: zero gain yields zero everything, not NaN", () => {
  const r = computeCapitalGains({ ...base, proceeds: 40000, basis: 40000 });
  assert.equal(r.gain, 0);
  assert.equal(r.taxOwed, 0);
  assert.equal(r.rateApplied, 0);
  assert.ok(Number.isFinite(r.afterTaxProceeds));
});

test("married 0% ceiling is higher than single", () => {
  const single = computeCapitalGains({ ...base, filing: "single", otherTaxableIncome: 60000, proceeds: 30000, basis: 20000 });
  const married = computeCapitalGains({ ...base, filing: "married", otherTaxableIncome: 60000, proceeds: 30000, basis: 20000 });
  assert.ok(married.longTermTax <= single.longTermTax, "MFJ keeps more gain in 0%/lower band");
});
