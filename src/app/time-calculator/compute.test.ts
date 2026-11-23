import { test } from "node:test";
import assert from "node:assert/strict";
import { computeTimeCalc, hms } from "./compute.ts";

test("add and subtract durations", () => {
  const r = computeTimeCalc({
    items: [
      { op: "+", hours: 2, minutes: 45, seconds: 30 },
      { op: "+", hours: 3, minutes: 30, seconds: 0 },
      { op: "-", hours: 0, minutes: 28, seconds: 0 },
    ],
    startClock: "",
  });
  assert.equal(r.totalLabel, "5:47:30");
  assert.equal(r.wordsLabel, "5 hours, 47 minutes, 30 seconds");
  assert.equal(r.decimalHours, 5.7917);
  assert.equal(r.totalMinutes, 347.5);
  assert.equal(r.rows[2].running, "5:47:30");
  assert.equal(r.endClockLabel, "—");
});

test("clock time and day rollover", () => {
  const r = computeTimeCalc({ items: [{ op: "+", hours: 26, minutes: 15, seconds: 0 }], startClock: "21:30" });
  assert.equal(r.endClockLabel, "11:45 PM");
  assert.equal(r.dayShift, 1);
  assert.equal(r.daysLabel, "1 day, 2:15:00");
  const back = computeTimeCalc({ items: [{ op: "-", hours: 2, minutes: 0, seconds: 0 }], startClock: "01:00" });
  assert.equal(back.endClockLabel, "11:00 PM");
  assert.equal(back.dayShift, -1);
  assert.equal(back.negative, true);
  assert.equal(back.totalLabel, "−2:00:00");
});

test("decimal and overflowing units, edge inputs", () => {
  const r = computeTimeCalc({ items: [{ op: "+", hours: 1.5, minutes: 90, seconds: 90 }], startClock: "" });
  assert.equal(r.totalLabel, "3:01:30");
  assert.equal(computeTimeCalc({ items: [], startClock: "" }).wordsLabel, "0 seconds");
  assert.equal(computeTimeCalc({ items: [{ op: "+", hours: "", minutes: "", seconds: "" }], startClock: "" }).rows.length, 0);
  const big = computeTimeCalc({ items: [{ op: "+", hours: 99999999, minutes: 99999999, seconds: 99999999 }], startClock: "10:00" });
  assert.ok(Number.isFinite(big.totalSeconds));
  assert.equal(hms(59), "0:00:59");
});
