import { test } from "node:test";
import assert from "node:assert/strict";
import { computeWaterIntake } from "./compute.ts";

test("baseline by sex", () => {
  const w = computeWaterIntake({ sex: "female", weightLb: 150, exerciseMin: 0, hotClimate: "no" });
  assert.equal(w.drinkOz, 74);
  assert.equal(w.drinkLiters, 2.2);
  assert.equal(w.halfWeightOz, 75);
  const m = computeWaterIntake({ sex: "male", weightLb: 180, exerciseMin: 0, hotClimate: "no" });
  assert.equal(m.drinkOz, 101);
  assert.equal(m.totalWaterLiters, 3.7);
});

test("exercise and heat add water", () => {
  const r = computeWaterIntake({ sex: "female", weightLb: 150, exerciseMin: 60, hotClimate: "yes" });
  assert.equal(r.exerciseOz, 24);
  assert.equal(r.drinkOz, 74 + 24 + 16);
});
