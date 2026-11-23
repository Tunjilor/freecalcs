import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDecimalToFraction, bestFraction, decimalPlaces } from "./compute.ts";

test("exact fractions", () => {
  assert.equal(computeDecimalToFraction({ decimal: 0.375 }).fractionLabel, "3/8");
  assert.equal(computeDecimalToFraction({ decimal: 0.1 }).fractionLabel, "1/10");
  assert.equal(computeDecimalToFraction({ decimal: 1.875 }).fractionLabel, "15/8");
  assert.equal(computeDecimalToFraction({ decimal: 1.875 }).mixedLabel, "1 7/8");
  assert.equal(computeDecimalToFraction({ decimal: -2.25 }).mixedLabel, "-2 1/4");
  assert.equal(computeDecimalToFraction({ decimal: 3 }).fractionLabel, "3");
  assert.equal(computeDecimalToFraction({ decimal: 0.125 }).percentLabel, "12.5%");
});

test("repeating decimals and approximations", () => {
  const r = computeDecimalToFraction({ decimal: 0.3333 });
  assert.equal(r.fractionLabel, "3333/10000");
  assert.equal(r.simpleLabel, "1/3");
  assert.deepEqual(bestFraction(0.6667, 100), [2, 3]);
  assert.deepEqual(bestFraction(3.14159, 100), [22, 7]);
  assert.equal(computeDecimalToFraction({ decimal: 0.33 }).sixteenthLabel, "5/16");
  assert.equal(computeDecimalToFraction({ decimal: 0.5 }).isExactSimple, true);
});

test("edge inputs", () => {
  assert.equal(decimalPlaces(1e-7), 7);
  assert.equal(computeDecimalToFraction({ decimal: 0 }).fractionLabel, "0");
  assert.equal(computeDecimalToFraction({ decimal: 0 }).mixedLabel, "0");
  assert.equal(computeDecimalToFraction({ decimal: 99999999 }).fractionLabel, "99999999");
  assert.equal(computeDecimalToFraction({ decimal: 1e12 }).valid, false);
  const tiny = computeDecimalToFraction({ decimal: 0.123456789012345 });
  assert.equal(tiny.denominator <= 1e10, true);
});
