import { test } from "node:test";
import assert from "node:assert/strict";
import { computeElectricityCost } from "./compute.ts";

test("1,500 W heater, 8 h/day, 30 days at 17¢", () => {
  const r = computeElectricityCost({ watts: 1500, hoursPerDay: 8, daysPerMonth: 30, centsPerKwh: 17 });
  assert.equal(r.kwhPerDay, 12);
  assert.equal(r.kwhPerMonth, 360);
  assert.equal(r.costPerDay, 2.04);
  assert.equal(r.costPerMonth, 61.2);
  assert.equal(r.costPerYear, 734.4);
  assert.equal(r.costPerHour, 0.255);
});

test("edge: clamps hours and days", () => {
  const r = computeElectricityCost({ watts: 100, hoursPerDay: 30, daysPerMonth: 40, centsPerKwh: 10 });
  assert.equal(r.kwhPerDay, 2.4);
  assert.equal(r.kwhPerMonth, 74.4);
  assert.equal(computeElectricityCost({ watts: 0, hoursPerDay: 5, daysPerMonth: 30, centsPerKwh: 15 }).costPerYear, 0);
});

test("cost per hour label has a dollar sign", () => {
  const r = computeElectricityCost({ watts: 1500, hoursPerDay: 1, daysPerMonth: 30, centsPerKwh: 17 });
  assert.equal(r.costPerHourLabel, "$0.255");
});
