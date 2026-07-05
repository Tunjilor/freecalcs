import { test } from "node:test";
import assert from "node:assert/strict";
import { computeSelfEmployment, type SelfEmploymentInputs } from "./compute.ts";
import { TAX_DATA } from "../../lib/calculator/tax-data.ts";

const base: SelfEmploymentInputs = { year: "2026", filing: "single", netIncome: 80000 };

const approx = (a: number, b: number, eps = 1, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ""} expected ~${b}, got ${a}`);

test("net earnings apply the 92.35% factor", () => {
  const r = computeSelfEmployment(base);
  approx(r.netEarnings, 80000 * 0.9235, 0.01);
});

test("typical: SE tax is 15.3% of net earnings below the wage base", () => {
  const r = computeSelfEmployment(base);
  // 73,880 × 15.3% ≈ 11,303.64
  approx(r.seTax, 80000 * 0.9235 * 0.153, 0.5);
  assert.equal(r.additionalMedicare, 0);
  assert.equal(r.hitSsCap, false);
});

test("deductible half is 50% of the SS+Medicare portion", () => {
  const r = computeSelfEmployment(base);
  approx(r.deductibleHalf, r.seTax / 2, 0.5);
});

test("edge: high earner caps Social Security at the wage base", () => {
  const r = computeSelfEmployment({ ...base, netIncome: 400000 });
  const wageBase = TAX_DATA["2026"].ssWageBase;
  assert.equal(r.hitSsCap, true);
  approx(r.socialSecurity, wageBase * 0.124, 0.5);
  // Medicare has no cap: 2.9% on all net earnings
  approx(r.medicare, 400000 * 0.9235 * 0.029, 0.5);
});

test("edge: Additional Medicare 0.9% kicks in above the threshold", () => {
  // Single threshold is $200k on net earnings; use a big income to exceed it.
  const r = computeSelfEmployment({ ...base, netIncome: 300000 });
  assert.ok(r.additionalMedicare > 0);
  const netEarnings = 300000 * 0.9235;
  approx(r.additionalMedicare, (netEarnings - 200000) * 0.009, 0.5);
});

test("edge: married threshold for Additional Medicare is higher", () => {
  const single = computeSelfEmployment({ ...base, filing: "single", netIncome: 240000 });
  const married = computeSelfEmployment({ ...base, filing: "married", netIncome: 240000 });
  // net earnings ~221,640: over $200k (single) but under $250k (married)
  assert.ok(single.additionalMedicare > 0);
  assert.equal(married.additionalMedicare, 0);
});

test("edge: zero income yields zero tax, not NaN", () => {
  const r = computeSelfEmployment({ ...base, netIncome: 0 });
  assert.equal(r.seTax, 0);
  assert.equal(r.effectiveRate, 0);
  assert.ok(Number.isFinite(r.deductibleHalf));
});

test("2025 uses the lower wage base than 2026", () => {
  const r25 = computeSelfEmployment({ ...base, year: "2025", netIncome: 400000 });
  const r26 = computeSelfEmployment({ ...base, year: "2026", netIncome: 400000 });
  assert.ok(r25.socialSecurity < r26.socialSecurity, "2025 caps SS lower");
});

test("quarterly estimate is a quarter of the SE tax", () => {
  const r = computeSelfEmployment(base);
  approx(r.quarterlyEstimate, r.seTax / 4, 0.02);
});
