import { test } from "node:test";
import assert from "node:assert/strict";
import { computeFuelCost } from "./compute.ts";

test("round trip cost", () => {
  const r = computeFuelCost({ distance: 150, roundTrip: "yes", mpg: 30, pricePerGallon: 3.2, people: 2, tripsPerMonth: 2 });
  assert.equal(r.totalMiles, 300);
  assert.equal(r.gallons, 10);
  assert.equal(r.tripCost, 32);
  assert.equal(r.costPerPerson, 16);
  assert.equal(r.costPerMile, 0.11);
  assert.equal(r.monthlyCost, 64);
  assert.equal(r.yearlyCost, 768);
  assert.equal(r.costAt10mpgBetter, 24);
});

test("edge: zero mpg and people", () => {
  const r = computeFuelCost({ distance: 100, roundTrip: "no", mpg: 0, pricePerGallon: 3, people: 0, tripsPerMonth: 0 });
  assert.equal(r.tripCost, 0);
  assert.equal(r.costPerMile, 0);
  assert.equal(r.costPerPerson, 0);
});
