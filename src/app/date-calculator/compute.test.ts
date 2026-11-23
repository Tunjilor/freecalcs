import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDateCalc } from "./compute.ts";

test("days between with breakdowns", () => {
  const r = computeDateCalc({ startDate: "2026-01-01", endDate: "2026-03-15", includeEnd: "no", addDaysN: 90 });
  assert.equal(r.days, 73);
  assert.equal(r.weeksLabel, "10 weeks, 3 days");
  assert.equal(r.ymdLabel, "2 months, 14 days");
  assert.equal(r.weekdays + r.weekendDays, 73);
  assert.equal(r.weekdays, 52);
  assert.equal(r.addedDate, "2026-04-01");
  assert.equal(r.startLabel, "Thu, Jan 1, 2026");
});

test("include end date adds one day", () => {
  const r = computeDateCalc({ startDate: "2026-01-01", endDate: "2026-01-01", includeEnd: "yes", addDaysN: 0 });
  assert.equal(r.days, 1);
});

test("end before start is negative", () => {
  const r = computeDateCalc({ startDate: "2026-03-15", endDate: "2026-01-01", includeEnd: "no", addDaysN: -30 });
  assert.equal(r.days, -73);
  assert.equal(r.absDays, 73);
  assert.equal(r.endBeforeStart, true);
  assert.equal(r.addedDate, "2026-02-13");
});

test("invalid date", () => {
  const r = computeDateCalc({ startDate: "bad", endDate: "2026-01-01", includeEnd: "no", addDaysN: 5 });
  assert.equal(r.valid, false);
  assert.equal(r.weeksLabel, "—");
});

test("huge add-days is clamped instead of crashing", () => {
  const r = computeDateCalc({ startDate: "2026-01-01", endDate: "2026-01-02", includeEnd: "no", addDaysN: 99999999 });
  assert.equal(r.addedDate, "2125-12-08");
});

test("cleared end date shows a dash", () => {
  const r = computeDateCalc({ startDate: "2026-11-23", endDate: "", includeEnd: "no", addDaysN: 30 });
  assert.equal(r.valid, false);
  assert.equal(r.absDaysLabel, "—");
});
