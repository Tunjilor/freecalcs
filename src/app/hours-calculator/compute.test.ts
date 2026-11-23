import { test } from "node:test";
import assert from "node:assert/strict";
import { computeHours } from "./compute.ts";

test("day shift with lunch", () => {
  const r = computeHours({ start: "09:00", end: "17:30", breakMinutes: 45, rate: 20 });
  assert.equal(r.hoursLabel, "7 hr 45 min");
  assert.equal(r.hmmLabel, "7:45");
  assert.equal(r.decimal, 7.75);
  assert.equal(r.pay, 155);
  assert.equal(r.spanLabel, "9:00 AM to 5:30 PM");
  assert.equal(r.rows[1].hours, 7.75);
});

test("overnight shift", () => {
  const r = computeHours({ start: "22:00", end: "06:30", breakMinutes: 30, rate: 0 });
  assert.equal(r.decimal, 8);
  assert.equal(r.overnight, true);
  assert.equal(r.spanLabel, "10:00 PM to 6:30 AM (next day)");
});

test("rounding and edge inputs", () => {
  const r = computeHours({ start: "08:03", end: "16:10", breakMinutes: 0, rate: 0 }); // 487 min
  assert.equal(r.rows[1].hours, 8); // 8 hr 7 min rounds down (7-minute rule)
  assert.equal(computeHours({ start: "08:02", end: "16:10", breakMinutes: 0, rate: 0 }).rows[1].hours, 8.25); // 8 hr 8 min rounds up
  assert.equal(computeHours({ start: "", end: "17:00", breakMinutes: 0, rate: 0 }).valid, false);
  const same = computeHours({ start: "09:00", end: "09:00", breakMinutes: 0, rate: 0 });
  assert.equal(same.minutes, 0);
  assert.equal(same.sameTime, true);
  const long = computeHours({ start: "09:00", end: "10:00", breakMinutes: 90, rate: 0 });
  assert.equal(long.minutes, 0);
  assert.equal(long.breakTooLong, true);
  const big = computeHours({ start: "09:00", end: "17:00", breakMinutes: 99999999, rate: 99999999 });
  assert.equal(big.minutes, 0);
  assert.equal(computeHours({ start: "09:00", end: "17:00", breakMinutes: -30, rate: -5 }).pay, 0);
});
