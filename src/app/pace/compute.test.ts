import { test } from "node:test";
import assert from "node:assert/strict";
import { computePace, fmtTime } from "./compute.ts";

test("fmtTime", () => {
  assert.equal(fmtTime(605), "10:05");
  assert.equal(fmtTime(3725), "1:02:05");
  assert.equal(fmtTime(0), "—");
});

test("3 miles in 30:00 = 10:00/mi, 6 mph", () => {
  const r = computePace({ distance: 3, unit: "mi", hours: 0, minutes: 30, seconds: 0 });
  assert.equal(r.pacePerMile, "10:00 /mi");
  assert.equal(r.pacePerKm, "6:13 /km");
  assert.equal(r.speedMph, 6);
  assert.equal(r.speedKph, 9.66);
});

test("Riegel prediction: same distance gives same time", () => {
  const r = computePace({ distance: 5, unit: "km", hours: 0, minutes: 25, seconds: 0 });
  assert.equal(r.predictions[0].time, "25:00");
  // 10K ≈ 25:00 × 2^1.06 ≈ 52:07
  assert.equal(r.predictions[1].time, "52:07"); // 25 × 2^1.06 = 52.12 min
});

test("edge: zero time or distance", () => {
  const r = computePace({ distance: 0, unit: "mi", hours: 0, minutes: 30, seconds: 0 });
  assert.equal(r.valid, false);
  assert.equal(r.pacePerMile, "—");
  assert.equal(r.predictions[3].time, "—");
});
