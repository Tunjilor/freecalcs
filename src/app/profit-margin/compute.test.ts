import { test } from "node:test";
import assert from "node:assert/strict";
import { computeProfitMargin } from "./compute.ts";

test("margin vs markup", () => {
  const r = computeProfitMargin({ cost: 60, price: 100, targetMargin: 50 });
  assert.equal(r.profit, 40);
  assert.equal(r.marginPct, 40);
  assert.equal(r.markupPct, 66.67);
});

test("price for a target margin", () => {
  const r = computeProfitMargin({ cost: 60, price: 100, targetMargin: 50 });
  assert.equal(r.priceForTarget, 120);
  assert.equal(r.markupForTarget, 100);
});

test("loss and edges", () => {
  const l = computeProfitMargin({ cost: 120, price: 100, targetMargin: 30 });
  assert.equal(l.isLoss, true);
  assert.equal(l.marginPct, -20);
  const t = computeProfitMargin({ cost: 50, price: 80, targetMargin: 100 });
  assert.equal(t.priceForTarget, 0);
  const z = computeProfitMargin({ cost: 0, price: 0, targetMargin: 40 });
  assert.equal(z.marginPct, 0);
  assert.equal(z.markupPct, 0);
});
