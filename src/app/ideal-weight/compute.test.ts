import { test } from "node:test";
import assert from "node:assert/strict";
import { computeIdealWeight } from "./compute.ts";

const approx = (a: number, b: number, eps = 0.1) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("male 5'10\" (70 in)", () => {
  const r = computeIdealWeight({ sex: "male", heightIn: 70, weightLb: 165 });
  approx(r.devine, (50 + 23) * 2.20462262);
  approx(r.hamwi, (48 + 27) * 2.20462262);
  approx(r.bmiLow, (18.5 * 4900) / 703);
  approx(r.bmiHigh, (24.9 * 4900) / 703);
  assert.equal(r.inHealthyRange, true);
  approx(r.average, (r.devine + r.robinson + r.miller + r.hamwi) / 4, 0.02);
});

test("female 5'4\" (64 in)", () => {
  const r = computeIdealWeight({ sex: "female", heightIn: 64, weightLb: 180 });
  approx(r.devine, (45.5 + 9.2) * 2.20462262);
  assert.equal(r.inHealthyRange, false);
});

test("edge: zero height", () => {
  const r = computeIdealWeight({ sex: "male", heightIn: 0, weightLb: 150 });
  assert.equal(r.devine, 0);
  assert.equal(r.currentBmi, 0);
});
