import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTime, formatClock, spanMinutes, hoursMinutesLabel, hmm, decimalHours } from "./times.ts";

test("times", () => {
  assert.equal(parseTime("09:05"), 545);
  assert.equal(parseTime("23:59:00"), 1439);
  assert.equal(parseTime(""), null);
  assert.equal(parseTime("24:00"), null);
  assert.equal(formatClock(0), "12:00 AM");
  assert.equal(formatClock(12 * 60), "12:00 PM");
  assert.equal(formatClock(17 * 60 + 30), "5:30 PM");
  assert.equal(formatClock(1440 + 60), "1:00 AM");
  assert.equal(formatClock(-30), "11:30 PM");
  assert.equal(spanMinutes(22 * 60, 6 * 60), 480); // overnight
  assert.equal(spanMinutes(540, 540), 1440);
  assert.equal(hoursMinutesLabel(465), "7 hr 45 min");
  assert.equal(hmm(465), "7:45");
  assert.equal(decimalHours(465), 7.75);
});
