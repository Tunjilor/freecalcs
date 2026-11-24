import { test } from "node:test";
import assert from "node:assert/strict";
import { computeFraction } from "./compute.ts";

test("four operations", () => {
  const plus = computeFraction({ a: "2/3", op: "+", b: "3/4" });
  assert.equal(plus.resultLabel, "17/12");
  assert.equal(plus.mixedLabel, "1 5/12");
  assert.equal(plus.decimalLabel, "1.41666667");
  assert.equal(plus.steps[1].value, "8/12 + 9/12");
  assert.equal(computeFraction({ a: "1 1/2", op: "-", b: "3/4" }).resultLabel, "3/4");
  assert.equal(computeFraction({ a: "2/3", op: "*", b: "3/4" }).resultLabel, "1/2");
  assert.equal(computeFraction({ a: "1/2", op: "/", b: "1/4" }).resultLabel, "2");
  assert.equal(computeFraction({ a: "0.5", op: "+", b: "1/3" }).resultLabel, "5/6");
  assert.equal(computeFraction({ a: "-1/2", op: "-", b: "1/2" }).resultLabel, "-1");
});

test("errors", () => {
  assert.equal(computeFraction({ a: "", op: "+", b: "1/2" }).error, "a");
  assert.equal(computeFraction({ a: "1/2", op: "+", b: "x" }).error, "b");
  assert.equal(computeFraction({ a: "1/2", op: "/", b: "0" }).error, "divzero");
  assert.equal(computeFraction({ a: "1/0", op: "+", b: "1/2" }).error, "a");
  assert.equal(computeFraction({ a: "9999999/1", op: "*", b: "9999999/1" }).resultLabel, "99999980000001");
  assert.equal(computeFraction({ a: "999999999999/1", op: "*", b: "999999999999/1" }).error, "range");
});
