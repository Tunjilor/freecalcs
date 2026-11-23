import { test } from "node:test";
import assert from "node:assert/strict";
import { computeMacro, type MacroInputs } from "./compute.ts";

const base: MacroInputs = { sex: "male", age: 30, heightIn: 70, weightLb: 180, activity: "moderate", goal: "maintain", diet: "balanced" };
const approx = (a: number, b: number, eps = 2) => assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("maintain: calories = TDEE, split adds back up", () => {
  const r = computeMacro(base);
  assert.equal(r.calories, r.tdee);
  approx(r.proteinG * 4 + r.carbsG * 4 + r.fatG * 9, r.calories, 10);
  approx(r.proteinG, (r.calories * 0.3) / 4);
  assert.equal(r.rows.length, 3);
});

test("lose and gain adjust calories", () => {
  const t = computeMacro(base).tdee;
  assert.equal(computeMacro({ ...base, goal: "lose" }).calories, t - 500);
  assert.equal(computeMacro({ ...base, goal: "gain" }).calories, t + 300);
});

test("high protein raises protein grams", () => {
  assert.ok(computeMacro({ ...base, diet: "high-protein" }).proteinG > computeMacro(base).proteinG);
});

test("calorie floor on lose", () => {
  const r = computeMacro({ sex: "female", age: 70, heightIn: 58, weightLb: 100, activity: "sedentary", goal: "lose", diet: "balanced" });
  assert.equal(r.hitFloor, true);
  assert.ok(r.calories <= 1200);
});

test("edge: zero inputs", () => {
  const r = computeMacro({ ...base, weightLb: 0, heightIn: 0 });
  assert.equal(r.calories, 0);
  assert.equal(r.proteinPerLb, 0);
});
