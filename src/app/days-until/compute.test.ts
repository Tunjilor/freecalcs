import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDaysUntil } from "./compute.ts";

test("countdown to Christmas from Nov 23", () => {
  const r = computeDaysUntil({ targetDate: "2026-12-25", fromDate: "2026-11-23" });
  assert.equal(r.days, 32);
  assert.equal(r.weeksLabel, "4 weeks, 4 days");
  assert.equal(r.monthsLabel, "1 month, 2 days");
  assert.equal(r.targetWeekday, "Friday");
  assert.equal(r.hours, 768);
  assert.equal(r.weekdays, 24);
});

test("past and today", () => {
  assert.equal(computeDaysUntil({ targetDate: "2026-11-01", fromDate: "2026-11-23" }).isPast, true);
  const t = computeDaysUntil({ targetDate: "2026-11-23", fromDate: "2026-11-23" });
  assert.equal(t.isToday, true);
  assert.equal(t.days, 0);
});

test("invalid", () => {
  assert.equal(computeDaysUntil({ targetDate: "", fromDate: "2026-11-23" }).valid, false);
});
