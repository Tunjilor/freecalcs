import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCalories } from "./compute.ts";

test("35-year-old woman, 5'5\", 160 lb, light activity", () => {
  // BMR = 10×72.57 + 6.25×165.1 − 5×35 − 161 = 1421.6 → ×1.375 = 1954.7
  const r = computeCalories({ sex: "female", age: 35, heightIn: 65, weightLb: 160, activity: "light" });
  assert.equal(r.bmr, 1420);
  assert.equal(r.maintenance, 1950);
  assert.equal(r.loss, 1450);
  assert.equal(r.extremeLoss, 1200); // floored at 1,200
  assert.equal(r.extremeBelowFloor, true);
  assert.equal(r.gain, 2450);
  assert.equal(r.rows.length, 6);
});

test("male floor is 1,500", () => {
  const r = computeCalories({ sex: "male", age: 70, heightIn: 64, weightLb: 130, activity: "sedentary" });
  assert.equal(r.extremeLoss, 1500);
});

test("edge inputs", () => {
  const z = computeCalories({ sex: "male", age: 0, heightIn: 0, weightLb: 0, activity: "light" });
  assert.equal(z.valid, false);
  assert.equal(z.maintenance, 0);
  const big = computeCalories({ sex: "male", age: 99999999, heightIn: 99999999, weightLb: 99999999, activity: "very" });
  assert.ok(Number.isFinite(big.maintenance));
  const neg = computeCalories({ sex: "female", age: -5, heightIn: 65, weightLb: 150, activity: "light" });
  assert.equal(neg.valid, false);
});
