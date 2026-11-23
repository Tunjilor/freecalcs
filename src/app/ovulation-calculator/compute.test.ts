import { test } from "node:test";
import assert from "node:assert/strict";
import { computeOvulation } from "./compute.ts";

test("28-day cycle from Nov 10, 2026", () => {
  const r = computeOvulation({ lmpDate: "2026-11-10", cycleLength: 28 });
  assert.equal(r.ovulationISO, "2026-11-24"); // LMP + 14
  assert.equal(r.ovulationDay, 15);
  assert.equal(r.windowLabel, "Nov 19 – Nov 25");
  assert.equal(r.peakLabel, "Nov 22 – Nov 24");
  assert.equal(r.nextPeriodLabel, "Tue, Dec 8, 2026");
  assert.equal(r.dueLabel, "Tue, Aug 17, 2027"); // LMP + 280
  assert.equal(r.cycles.length, 6);
  assert.equal(r.cycles[1].period, "Dec 8, 2026");
});

test("32-day cycle shifts ovulation later", () => {
  const r = computeOvulation({ lmpDate: "2026-11-10", cycleLength: 32 });
  assert.equal(r.ovulationISO, "2026-11-28");
  assert.equal(r.dueLabel, "Sat, Aug 21, 2027");
  assert.equal(r.irregular, false);
});

test("edge inputs", () => {
  assert.equal(computeOvulation({ lmpDate: "", cycleLength: 28 }).valid, false);
  const short = computeOvulation({ lmpDate: "2026-11-10", cycleLength: 5 });
  assert.equal(short.cycle, 20);
  assert.equal(short.irregular, true);
  assert.equal(computeOvulation({ lmpDate: "2026-11-10", cycleLength: 99999999 }).cycle, 45);
  assert.equal(computeOvulation({ lmpDate: "2026-11-10", cycleLength: 0 }).cycle, 28);
});
