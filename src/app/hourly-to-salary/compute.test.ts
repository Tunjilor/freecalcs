import { test } from "node:test";
import assert from "node:assert/strict";
import { computeHourly } from "./compute.ts";

test("$25/hr full time, 52 weeks = $52,000", () => {
  const r = computeHourly({ hourlyRate: 25, hoursPerWeek: 40, overtimeHours: 0, weeksPerYear: 52 });
  assert.equal(r.annual, 52000);
  assert.equal(r.monthly, 4333.33);
  assert.equal(r.biweekly, 2000);
  assert.equal(r.weekly, 1000);
  assert.equal(r.daily, 200);
  assert.equal(r.annualAt2080, 52000);
  assert.equal(r.effectiveHourly, 25);
});

test("overtime at 1.5x", () => {
  const r = computeHourly({ hourlyRate: 20, hoursPerWeek: 40, overtimeHours: 5, weeksPerYear: 52 });
  assert.equal(r.overtimeAnnual, 7800); // 20 × 1.5 × 5 × 52
  assert.equal(r.annual, 41600 + 7800);
});

test("unpaid weeks reduce annual pay", () => {
  const r = computeHourly({ hourlyRate: 25, hoursPerWeek: 40, overtimeHours: 0, weeksPerYear: 50 });
  assert.equal(r.annual, 50000);
  assert.ok(r.effectiveHourly < 25);
});

test("edge: zero inputs and clamped weeks", () => {
  const z = computeHourly({ hourlyRate: 0, hoursPerWeek: 0, overtimeHours: 0, weeksPerYear: 52 });
  assert.equal(z.annual, 0);
  assert.equal(z.effectiveHourly, 0);
  const c = computeHourly({ hourlyRate: 10, hoursPerWeek: 40, overtimeHours: 0, weeksPerYear: 60 });
  assert.equal(c.annual, 20800);
});
