import { test } from "node:test";
import assert from "node:assert/strict";
import { computeSplitExpenses } from "./compute.ts";

test("three people settle in at most two payments", () => {
  const r = computeSplitExpenses({ people: [
    { person: "Ana", paid: 300 }, { person: "Ben", paid: 60 }, { person: "Cy", paid: 0 },
  ] });
  assert.equal(r.total, 360);
  assert.equal(r.share, 120);
  assert.deepEqual(r.settlements, [
    { from: "Cy", to: "Ana", amount: 120 },
    { from: "Ben", to: "Ana", amount: 60 },
  ]);
  assert.ok(r.paymentCount <= 2);
});

test("uneven cents still balance", () => {
  const r = computeSplitExpenses({ people: [{ person: "A", paid: 100 }, { person: "B", paid: 0 }, { person: "C", paid: 0 }] });
  const paid = r.settlements.reduce((a, s) => a + s.amount, 0);
  assert.ok(Math.abs(paid - 66.67) < 0.011, `got ${paid}`);
});

test("even split and blanks", () => {
  const e = computeSplitExpenses({ people: [{ person: "A", paid: 50 }, { person: "B", paid: 50 }] });
  assert.equal(e.allEven, true);
  const b = computeSplitExpenses({ people: [{ person: "", paid: 0 }] });
  assert.equal(b.balances[0].person, "Person 1");
  assert.equal(computeSplitExpenses({ people: [] }).share, 0);
});
