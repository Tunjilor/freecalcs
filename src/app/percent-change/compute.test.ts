import { test } from "node:test";
import assert from "node:assert/strict";
import { computePercentChange } from "./compute.ts";

test("increase and decrease", () => {
  const up = computePercentChange({ oldValue: 80, newValue: 100 });
  assert.equal(up.changeLabel, "+25.00%");
  assert.equal(up.direction, "increase");
  assert.equal(up.reverseLabel, "−20.00%");
  assert.equal(up.pctDifferenceLabel, "22.22%");
  assert.equal(up.multiplierLabel, "1.25×");
  const down = computePercentChange({ oldValue: 100, newValue: 80 });
  assert.equal(down.changeLabel, "−20.00%");
  assert.equal(down.difference, -20);
});

test("negative starting value uses |old|", () => {
  // −50 → −25 is an increase of 50%
  const r = computePercentChange({ oldValue: -50, newValue: -25 });
  assert.equal(r.changeLabel, "+50.00%");
});

test("edge inputs", () => {
  assert.equal(computePercentChange({ oldValue: 0, newValue: 10 }).changeLabel, "Not defined");
  assert.equal(computePercentChange({ oldValue: 0, newValue: 0 }).changeLabel, "No change");
  assert.equal(computePercentChange({ oldValue: 5, newValue: 5 }).changeLabel, "No change");
  assert.equal(computePercentChange({ oldValue: 5, newValue: 0 }).reverseLabel, "—");
  const big = computePercentChange({ oldValue: 99999999, newValue: -99999999 });
  assert.equal(big.changeLabel, "−200.00%");
});
