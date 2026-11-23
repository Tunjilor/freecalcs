import { test } from "node:test";
import assert from "node:assert/strict";
import { computeInflation, cpiFor } from "./compute.ts";
import { CPI_ANNUAL, CPI_LAST_YEAR } from "../../lib/data/cpi.ts";

const approx = (a: number, b: number, eps = 0.01) =>
  assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("data covers every year 1913..latest", () => {
  for (let y = 1913; y <= CPI_LAST_YEAR; y++) assert.ok(CPI_ANNUAL[y] > 0, `missing ${y}`);
});

test("$100 in 1990 → 2024 uses the CPI ratio", () => {
  const r = computeInflation({ amount: 100, fromYear: 1990, toYear: 2024, futureRate: 3 });
  approx(r.adjustedAmount, (100 * 313.7) / 130.7);
  approx(r.cumulativeChange, (313.7 / 130.7 - 1) * 100);
  assert.ok(r.avgAnnualRate > 2.5 && r.avgAnnualRate < 2.7, `got ${r.avgAnnualRate}`);
  assert.equal(r.projected, false);
});

test("going backward gives a smaller amount", () => {
  const r = computeInflation({ amount: 100, fromYear: 2024, toYear: 1990, futureRate: 3 });
  approx(r.adjustedAmount, (100 * 130.7) / 313.7);
  assert.ok(r.avgAnnualRate > 2.5);
});

test("future years are projected at the assumed rate", () => {
  const r = computeInflation({ amount: 100, fromYear: CPI_LAST_YEAR, toYear: CPI_LAST_YEAR + 10, futureRate: 3 });
  approx(r.adjustedAmount, 100 * Math.pow(1.03, 10));
  approx(r.avgAnnualRate, 3);
  assert.equal(r.projected, true);
  approx(cpiFor(CPI_LAST_YEAR + 1, 3), CPI_ANNUAL[CPI_LAST_YEAR] * 1.03, 1e-9);
});

test("deflation years work (1929 → 1933)", () => {
  const r = computeInflation({ amount: 100, fromYear: 1929, toYear: 1933, futureRate: 3 });
  assert.ok(r.adjustedAmount < 100);
  assert.ok(r.cumulativeChange < 0);
});

test("edge: years are clamped and same-year is identity", () => {
  const r = computeInflation({ amount: 50, fromYear: 1800, toYear: 1913, futureRate: 3 });
  assert.equal(r.fromYear, 1913);
  assert.equal(r.adjustedAmount, 50);
  assert.equal(r.avgAnnualRate, 0);
  const s = computeInflation({ amount: 100, fromYear: 2000, toYear: 2020, futureRate: 3 });
  assert.equal(s.series[0].x, "2000");
  assert.equal(s.series[s.series.length - 1].x, "2020");
});
