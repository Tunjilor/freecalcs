import { test } from "node:test";
import assert from "node:assert/strict";
import { computeRetirementWithdrawal } from "./compute.ts";

const base = { savings: 1000000, monthlyWithdrawal: 3333.33, annualReturn: 5, inflation: 3, yearsNeeded: 30 };

test("4% rule at 5% return / 3% inflation lasts about 30+ years", () => {
  const r = computeRetirementWithdrawal(base);
  assert.ok(Math.abs(r.withdrawalRatePct - 4) < 0.01);
  assert.ok(r.lastsMonths === -1 || r.lastsMonths > 30 * 12, `got ${r.lastsMonths}`);
});

test("no growth, no inflation: lasts savings ÷ withdrawal", () => {
  const r = computeRetirementWithdrawal({ savings: 120000, monthlyWithdrawal: 1000, annualReturn: 0, inflation: 0, yearsNeeded: 10 });
  assert.equal(r.lastsMonths, 120);
  assert.equal(r.lastsLabel, "10 yr");
  assert.ok(Math.abs(r.sustainableMonthly - 1000) < 0.5);
  assert.equal(r.totalWithdrawn, 120000);
});

test("sustainable withdrawal exhausts savings right at the horizon", () => {
  const r = computeRetirementWithdrawal(base);
  const t = computeRetirementWithdrawal({ ...base, monthlyWithdrawal: r.sustainableMonthly * 1.01 });
  assert.ok(t.lastsMonths > 0 && t.lastsMonths <= 360);
});

test("high withdrawal runs out; zero withdrawal never does", () => {
  const hi = computeRetirementWithdrawal({ ...base, monthlyWithdrawal: 10000 });
  assert.ok(hi.lastsMonths > 0 && hi.lastsMonths < 180);
  assert.equal(hi.path[hi.path.length - 1].y, 0);
  const z = computeRetirementWithdrawal({ ...base, monthlyWithdrawal: 0 });
  assert.equal(z.lastsMonths, -1);
  assert.equal(z.lastsLabel, "—");
});

test("edge: zero savings", () => {
  const r = computeRetirementWithdrawal({ ...base, savings: 0 });
  assert.equal(r.withdrawalRatePct, 0);
  assert.equal(r.sustainableMonthly, 0);
});

test("extreme inputs return quickly instead of hanging", () => {
  const t0 = Date.now();
  const r = computeRetirementWithdrawal({ ...base, yearsNeeded: 99999999, savings: 99999999, monthlyWithdrawal: 0 });
  assert.ok(Date.now() - t0 < 2000, "must finish fast");
  assert.ok(Number.isFinite(r.sustainableMonthly));
});
