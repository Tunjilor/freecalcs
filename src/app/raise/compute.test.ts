import { test } from "node:test";
import assert from "node:assert/strict";
import { computeRaise } from "./compute.ts";

test("percent raise", () => {
  const r = computeRaise({ currentSalary: 60000, raisePct: 4, raiseAmount: 0, inflation: 3, payPeriods: "26" });
  assert.equal(r.newSalary, 62400);
  assert.equal(r.raiseDollars, 2400);
  assert.equal(r.perPaycheck, 92.31);
  assert.equal(r.perMonth, 200);
  assert.equal(r.realRaisePct, 0.97);
  assert.equal(r.inflationNeutralSalary, 61800);
  assert.equal(r.newHourly, 30);
});

test("dollar raise overrides percent", () => {
  const r = computeRaise({ currentSalary: 50000, raisePct: 10, raiseAmount: 1500, inflation: 3, payPeriods: "12" });
  assert.equal(r.raisePctActual, 3);
  assert.ok(r.realRaisePct < 0.01 && r.realRaisePct > -0.01);
});

test("edge: zero salary", () => {
  const r = computeRaise({ currentSalary: 0, raisePct: 5, raiseAmount: 0, inflation: 3, payPeriods: "26" });
  assert.equal(r.raiseDollars, 0);
  assert.equal(r.raisePctActual, 0);
});
