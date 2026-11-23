import { test } from "node:test";
import assert from "node:assert/strict";
import { computeGpa } from "./compute.ts";

const courses = [
  { course: "Calculus", credits: 4, grade: "A" },
  { course: "English", credits: 3, grade: "B+" },
  { course: "Chemistry", credits: 4, grade: "B" },
  { course: "History", credits: 3, grade: "A-" },
];

test("term GPA", () => {
  const r = computeGpa({ courses, priorGpa: 0, priorCredits: 0 });
  // (16 + 9.9 + 12 + 11.1) / 14 = 49 / 14 = 3.5
  assert.equal(r.qualityPoints, 49);
  assert.equal(r.termGpa, 3.5);
  assert.equal(r.termGpaLabel, "3.50");
  assert.equal(r.termCredits, 14);
  assert.equal(r.hasPrior, false);
  assert.equal(r.cumulativeGpa, 3.5);
});

test("cumulative with prior GPA", () => {
  const r = computeGpa({ courses, priorGpa: 3.2, priorCredits: 30 });
  assert.equal(r.cumulativeGpa, 3.3); // (49 + 96) / 44 = 3.295…
  assert.equal(r.totalCredits, 44);
});

test("blank and zero-credit rows are skipped", () => {
  const r = computeGpa({ courses: [...courses, { course: "", credits: 0, grade: "A" }, { course: "Lab", credits: 1, grade: "" }], priorGpa: 0, priorCredits: 0 });
  assert.equal(r.courseCount, 4);
  assert.equal(r.termGpa, 3.5);
  const e = computeGpa({ courses: [], priorGpa: 0, priorCredits: 0 });
  assert.equal(e.termGpa, 0);
  assert.equal(e.termGpaLabel, "—");
});
