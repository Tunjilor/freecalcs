import { test } from "node:test";
import assert from "node:assert/strict";
import { computeSquareFootage } from "./compute.ts";

test("rooms, waste and cost", () => {
  const r = computeSquareFootage({
    areas: [
      { area: "Living room", length: 18, width: 15 },
      { area: "Bedroom", length: 12, width: 11.5 },
      { area: "Hall", length: 10, width: 3.5 },
    ],
    wastePct: 10,
    pricePerSqFt: 4,
  });
  assert.equal(r.totalSqFt, 443); // 270 + 138 + 35
  assert.equal(r.sqYd, 49.22);
  assert.equal(r.sqM, 41.16);
  assert.equal(r.withWaste, 488); // 487.3 rounded up
  assert.equal(r.cost, 1949.2);
  assert.equal(r.largest, "Living room");
  assert.equal(r.rows[0].share, "61%");
});

test("an acre", () => {
  const r = computeSquareFootage({ areas: [{ area: "Lot", length: 208.71, width: 208.71 }], wastePct: 0, pricePerSqFt: 0 });
  assert.equal(r.acres, 1);
});

test("edge inputs", () => {
  const e = computeSquareFootage({ areas: [{ area: "", length: "", width: 10 }], wastePct: 0, pricePerSqFt: 0 });
  assert.equal(e.totalSqFt, 0);
  assert.equal(e.areaCount, 0);
  const big = computeSquareFootage({ areas: [{ area: "x", length: 99999999, width: 99999999 }], wastePct: 99999999, pricePerSqFt: 99999999 });
  assert.ok(Number.isFinite(big.cost));
  const neg = computeSquareFootage({ areas: [{ area: "x", length: -5, width: 10 }], wastePct: -5, pricePerSqFt: -1 });
  assert.equal(neg.totalSqFt, 0);
});
