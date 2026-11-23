import { test } from "node:test";
import assert from "node:assert/strict";
import { computeHeight, ftIn } from "./compute.ts";

test("mid-parental height", () => {
  // Dad 5'10" (70), Mom 5'4" (64): boy = 67 + 2.5 = 69.5 → 5 ft 10 in (rounded), 177 cm
  const b = computeHeight({ sex: "boy", fatherIn: 70, motherIn: 64, earlyHeightIn: 0 });
  assert.equal(b.predictedIn, 69.5);
  assert.equal(b.predictedLabel, "5 ft 10 in (177 cm)");
  assert.equal(b.rangeLabel, "5 ft 6 in to 6 ft 1 in");
  const g = computeHeight({ sex: "girl", fatherIn: 70, motherIn: 64, earlyHeightIn: 0 });
  assert.equal(g.predictedIn, 64.5);
  assert.equal(g.doublingLabel, "—");
});

test("doubling estimate", () => {
  const b = computeHeight({ sex: "boy", fatherIn: 70, motherIn: 64, earlyHeightIn: 34.5 });
  assert.equal(b.doublingIn, 69);
  assert.equal(b.estimatesAgree, true);
  const off = computeHeight({ sex: "boy", fatherIn: 70, motherIn: 64, earlyHeightIn: 31 });
  assert.equal(off.estimatesAgree, false);
});

test("formatting and edge inputs", () => {
  assert.equal(ftIn(71.6), "6 ft 0 in (182 cm)");
  assert.equal(computeHeight({ sex: "girl", fatherIn: 0, motherIn: 64, earlyHeightIn: 0 }).valid, false);
  const big = computeHeight({ sex: "boy", fatherIn: 99999999, motherIn: 99999999, earlyHeightIn: 99999999 });
  assert.ok(Number.isFinite(big.predictedIn));
  assert.equal(computeHeight({ sex: "boy", fatherIn: -70, motherIn: -64, earlyHeightIn: -3 }).predictedLabel, "—");
});
