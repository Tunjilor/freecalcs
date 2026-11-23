import { test } from "node:test";
import assert from "node:assert/strict";
import { computeWeightedGrade, letterFor } from "./compute.ts";

test("weighted average", () => {
  const r = computeWeightedGrade({ items: [
    { item: "Homework", weight: 20, score: 95 },
    { item: "Quizzes", weight: 20, score: 85 },
    { item: "Midterm", weight: 25, score: 78 },
    { item: "Final", weight: 35, score: 88 },
  ] });
  assert.equal(r.grade, 86.3); // 19 + 17 + 19.5 + 30.8
  assert.equal(r.letter, "B");
  assert.equal(r.totalWeight, 100);
  assert.equal(r.remainingWeight, 0);
});

test("partial weights are normalized", () => {
  const r = computeWeightedGrade({ items: [{ item: "HW", weight: 20, score: 90 }, { item: "Mid", weight: 30, score: 80 }, { item: "", weight: 0, score: 0 }] });
  assert.equal(r.grade, 84);
  assert.equal(r.remainingWeight, 50);
  assert.equal(r.itemCount, 2);
});

test("letters and empty", () => {
  assert.equal(letterFor(93), "A");
  assert.equal(letterFor(59.9), "F");
  assert.equal(computeWeightedGrade({ items: [] }).letter, "—");
});
