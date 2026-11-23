import { test } from "node:test";
import assert from "node:assert/strict";
import { computePregnancy } from "./compute.ts";

test("28-day cycle: LMP + 280 days", () => {
  const r = computePregnancy({ lmpDate: "2026-09-14", cycleLength: 28, asOfDate: "2026-11-23" });
  assert.equal(r.dueDate, "2027-06-21");
  assert.equal(r.gestationLabel, "10 weeks, 0 days");
  assert.equal(r.trimester, "First");
  assert.equal(r.daysToGo, 210);
  assert.equal(r.conceptionLabel, "Sep 28, 2026");
  assert.equal(r.milestones[4].date, "Jun 21, 2027");
});

test("35-day cycle shifts the due date by 7 days", () => {
  const r = computePregnancy({ lmpDate: "2026-09-14", cycleLength: 35, asOfDate: "2026-11-23" });
  assert.equal(r.dueDate, "2027-06-28");
  assert.equal(r.gestationLabel, "9 weeks, 0 days");
});

test("trimester boundaries and past due", () => {
  assert.equal(computePregnancy({ lmpDate: "2026-01-01", cycleLength: 28, asOfDate: "2026-04-09" }).trimester, "Second"); // day 98 = 14w0d
  assert.equal(computePregnancy({ lmpDate: "2026-01-01", cycleLength: 28, asOfDate: "2026-07-16" }).trimester, "Third"); // day 196 = 28w0d
  assert.equal(computePregnancy({ lmpDate: "2026-01-01", cycleLength: 28, asOfDate: "2026-10-20" }).pastDue, true);
});

test("as-of before LMP, invalid input", () => {
  assert.equal(computePregnancy({ lmpDate: "2026-12-01", cycleLength: 28, asOfDate: "2026-11-23" }).notPregnantYet, true);
  assert.equal(computePregnancy({ lmpDate: "x", cycleLength: 28, asOfDate: "2026-11-23" }).valid, false);
});

test("a period over a year ago is flagged, not reported as 64 weeks", () => {
  const r = computePregnancy({ lmpDate: "2025-08-25", cycleLength: 28, asOfDate: "2026-11-23" });
  assert.equal(r.implausible, true);
  assert.equal(r.gestationLabel, "—");
  assert.equal(r.daysToGo, 0);
  const late = computePregnancy({ lmpDate: "2026-02-10", cycleLength: 28, asOfDate: "2026-11-23" }); // 41w6d
  assert.equal(late.pastDue, true);
  assert.equal(late.implausible, false);
  assert.equal(computePregnancy({ lmpDate: "", cycleLength: 28, asOfDate: "2026-11-23" }).valid, false);
});
