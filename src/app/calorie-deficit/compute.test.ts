import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCalorieDeficit, mifflinStJeor, type CalorieDeficitInputs } from "./compute.ts";

const base: CalorieDeficitInputs = {
  sex: "female", age: 35, heightIn: 65, weightLb: 180, activity: "light", goalWeightLb: 150, lbsPerWeek: "1",
};

test("Mifflin-St Jeor matches the published formula", () => {
  // 80 kg, 180 cm, 30 y male: 800 + 1125 − 150 + 5 = 1780
  assert.equal(mifflinStJeor("male", 80, 180, 30), 1780);
  assert.equal(mifflinStJeor("female", 80, 180, 30), 1614);
});

test("1 lb/week = 500 kcal/day below TDEE", () => {
  const r = computeCalorieDeficit(base);
  assert.ok(r.tdee > 2000 && r.tdee < 2300, `tdee ${r.tdee}`);
  assert.equal(r.dailyDeficit, 500);
  assert.equal(r.targetCalories, r.tdee - 500);
  assert.equal(r.weeksToGoal, 30);
  assert.equal(r.lbsToLose, 30);
  assert.equal(r.path[r.path.length - 1].y, 150);
});

test("rate capped at 1% of body weight per week", () => {
  const r = computeCalorieDeficit({ ...base, weightLb: 150, goalWeightLb: 130, lbsPerWeek: "2" });
  assert.equal(r.rateCapped, true);
  assert.ok(r.effectiveLbsPerWeek <= 1.5 + 1e-9);
});

test("target never drops below the minimum", () => {
  const r = computeCalorieDeficit({ ...base, weightLb: 140, heightIn: 60, age: 60, activity: "sedentary", goalWeightLb: 120, lbsPerWeek: "1.5" });
  assert.equal(r.hitFloor, true);
  assert.equal(r.targetCalories, 1200);
  assert.ok(r.effectiveLbsPerWeek < 1.4);
});

test("goal BMI flag", () => {
  const r = computeCalorieDeficit({ ...base, goalWeightLb: 100 });
  assert.equal(r.goalBelowHealthyBmi, true);
  assert.equal(computeCalorieDeficit(base).goalBelowHealthyBmi, false);
});

test("edge: already at goal / zero inputs", () => {
  const a = computeCalorieDeficit({ ...base, goalWeightLb: 200 });
  assert.equal(a.dailyDeficit, 0);
  assert.equal(a.weeksToGoal, 0);
  assert.equal(a.targetCalories, a.tdee);
  const z = computeCalorieDeficit({ ...base, weightLb: 0, heightIn: 0 });
  assert.equal(z.tdee, 0);
  assert.equal(z.bmiNow, 0);
});
