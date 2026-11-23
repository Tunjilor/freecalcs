import { test } from "node:test";
import assert from "node:assert/strict";
import { computeBodyFat } from "./compute.ts";

const approx = (a: number, b: number, eps = 0.05) =>
  assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("male Navy formula", () => {
  // 70 in, neck 15, waist 34: 86.01·log10(19) − 70.041·log10(70) + 36.76
  const exp = 86.01 * Math.log10(19) - 70.041 * Math.log10(70) + 36.76;
  const r = computeBodyFat({ sex: "male", heightIn: 70, weightLb: 180, neckIn: 15, waistIn: 34, hipIn: 0 });
  approx(r.bodyFatPct, exp, 0.01);
  assert.ok(r.bodyFatPct > 15 && r.bodyFatPct < 19, `got ${r.bodyFatPct}`);
  assert.equal(r.category, "Fitness");
  approx(r.fatMassLb + r.leanMassLb, 180, 0.02);
});

test("female Navy formula", () => {
  const exp = 163.205 * Math.log10(30 + 40 - 13) - 97.684 * Math.log10(65) - 78.387;
  const r = computeBodyFat({ sex: "female", heightIn: 65, weightLb: 150, neckIn: 13, waistIn: 30, hipIn: 40 });
  approx(r.bodyFatPct, exp, 0.01);
  assert.equal(r.category, "Average");
});

test("invalid measurements", () => {
  const a = computeBodyFat({ sex: "male", heightIn: 70, weightLb: 180, neckIn: 16, waistIn: 15, hipIn: 0 });
  assert.equal(a.valid, false);
  assert.equal(a.bodyFatPct, 0);
  const b = computeBodyFat({ sex: "female", heightIn: 65, weightLb: 150, neckIn: 13, waistIn: 30, hipIn: 0 });
  assert.equal(b.valid, false);
  const c = computeBodyFat({ sex: "male", heightIn: 0, weightLb: 0, neckIn: 0, waistIn: 0, hipIn: 0 });
  assert.equal(c.valid, false);
});
