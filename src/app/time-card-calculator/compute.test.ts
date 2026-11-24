import { test } from "node:test";
import assert from "node:assert/strict";
import { computeTimeCard } from "./compute.ts";

const week = [
  { day: "Mon", in: "08:00", out: "17:00", break: 30 },
  { day: "Tue", in: "08:00", out: "17:30", break: 30 },
  { day: "Wed", in: "08:00", out: "17:00", break: 30 },
  { day: "Thu", in: "08:00", out: "18:00", break: 30 },
  { day: "Fri", in: "08:00", out: "16:00", break: 30 },
];

test("week with overtime", () => {
  // 8.5 + 9 + 8.5 + 9.5 + 7.5 = 43 h → 40 regular + 3 OT
  const r = computeTimeCard({ shifts: week, rate: 20, otAfter: 40, otMultiplier: "1.5" });
  assert.equal(r.totalDecimal, 43);
  assert.equal(r.totalLabel, "43 hr 0 min");
  assert.equal(r.regularHours, 40);
  assert.equal(r.overtimeHours, 3);
  assert.equal(r.regularPay, 800);
  assert.equal(r.overtimePay, 90);
  assert.equal(r.totalPay, 890);
  assert.equal(r.rows[0].decimal, 8.5);
});

test("overnight shift, double time, no OT threshold", () => {
  const r = computeTimeCard({ shifts: [{ day: "Sat", in: "22:00", out: "06:00", break: 0 }], rate: 10, otAfter: 4, otMultiplier: "2" });
  assert.equal(r.totalDecimal, 8);
  assert.equal(r.totalPay, 40 + 80);
  assert.equal(r.rows[0].span, "10:00 PM – 6:00 AM (+1 day)");
  const none = computeTimeCard({ shifts: week, rate: 10, otAfter: 0, otMultiplier: "1.5" });
  assert.equal(none.overtimeHours, 0);
});

test("edge inputs", () => {
  const r = computeTimeCard({ shifts: [{ day: "", in: "09:00", out: "", break: 0 }, { day: "", in: "", out: "", break: 0 }], rate: 15, otAfter: 40, otMultiplier: "1.5" });
  assert.equal(r.shiftCount, 0);
  assert.equal(r.incomplete, 1);
  assert.equal(r.totalPay, 0);
  const big = computeTimeCard({ shifts: [{ day: "x", in: "09:00", out: "17:00", break: 99999999 }], rate: 99999999, otAfter: 99999999, otMultiplier: "1.5" });
  assert.equal(big.totalMinutes, 0);
  assert.ok(Number.isFinite(big.totalPay));
});
