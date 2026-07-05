import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAutoInsurance, type AutoInsuranceInputs } from "./compute.ts";

const base: AutoInsuranceInputs = { ageBand: "25to64", coverageLevel: "standard", vehicleTier: "mid" };

test("returns a low–high band, never a single number", () => {
  const r = computeAutoInsurance(base);
  assert.ok(r.lowAnnual < r.highAnnual, "low must be below high");
  assert.ok(r.lowMonthly < r.highMonthly);
  assert.match(r.rangeLabel, /\$[\d,]+–\$[\d,]+\/mo/);
});

test("monthly figures are the annual band divided by 12", () => {
  const r = computeAutoInsurance(base);
  assert.ok(Math.abs(r.lowMonthly - r.lowAnnual / 12) < 0.01);
  assert.ok(Math.abs(r.highMonthly - r.highAnnual / 12) < 0.01);
});

test("under-25 drivers land higher than 25–64", () => {
  const young = computeAutoInsurance({ ...base, ageBand: "under25" });
  const mid = computeAutoInsurance({ ...base, ageBand: "25to64" });
  assert.ok(young.highAnnual > mid.highAnnual);
});

test("full coverage costs more than minimum", () => {
  const full = computeAutoInsurance({ ...base, coverageLevel: "full" });
  const minimum = computeAutoInsurance({ ...base, coverageLevel: "minimum" });
  assert.ok(full.lowAnnual > minimum.lowAnnual);
});

test("luxury vehicles cost more than economy", () => {
  const lux = computeAutoInsurance({ ...base, vehicleTier: "luxury" });
  const eco = computeAutoInsurance({ ...base, vehicleTier: "economy" });
  assert.ok(lux.highAnnual > eco.highAnnual);
});

test("byCoverage exposes all three coverage levels' bands (for the range table)", () => {
  const r = computeAutoInsurance(base);
  assert.equal(r.byCoverage.length, 3);
  assert.deepEqual(r.byCoverage.map((c) => c.level), ["minimum", "standard", "full"]);
  for (const c of r.byCoverage) assert.ok(c.lowAnnual < c.highAnnual);
  // and they're ordered by cost
  assert.ok(r.byCoverage[0].lowAnnual < r.byCoverage[2].lowAnnual);
});

test("the band is intentionally wide (high is well above low)", () => {
  const r = computeAutoInsurance(base);
  assert.ok(r.highAnnual / r.lowAnnual > 1.5, "band should be wide to signal uncertainty");
});

test("deterministic — same inputs give the same range", () => {
  assert.deepEqual(computeAutoInsurance(base), computeAutoInsurance(base));
});
