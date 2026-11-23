import { test } from "node:test";
import assert from "node:assert/strict";
import { computeNetWorth, type NetWorthInputs } from "./compute.ts";

const base: NetWorthInputs = {
  cash: 15000, retirement: 85000, investments: 20000, homeValue: 350000, vehicles: 18000, otherAssets: 0,
  mortgage: 260000, carLoans: 12000, studentLoans: 20000, creditCards: 3000, otherDebts: 0,
  age: 38, annualIncome: 90000,
};

test("net worth and components", () => {
  const r = computeNetWorth(base);
  assert.equal(r.totalAssets, 488000);
  assert.equal(r.totalLiabilities, 295000);
  assert.equal(r.netWorth, 193000);
  assert.equal(r.homeEquity, 90000);
  assert.equal(r.liquidNetWorth, 15000 + 20000 - 35000);
  assert.equal(r.debtToAssetPct, 60.45);
});

test("age × income ÷ 10 benchmark", () => {
  const r = computeNetWorth(base);
  assert.equal(r.benchmark, 342000);
  assert.equal(r.vsBenchmarkPct, 56.43);
});

test("rows list only non-zero items, debts negative", () => {
  const r = computeNetWorth(base);
  assert.ok(!r.rows.some((x) => x.item === "Other assets"));
  assert.equal(r.rows.find((x) => x.item === "Mortgage")?.amount, -260000);
});

test("negative net worth and zero edges", () => {
  const r = computeNetWorth({ ...base, homeValue: 0, mortgage: 0, retirement: 0, investments: 0, cash: 1000, studentLoans: 60000 });
  assert.ok(r.netWorth < 0);
  const z = computeNetWorth({ ...base, cash: 0, retirement: 0, investments: 0, homeValue: 0, vehicles: 0, mortgage: 0, carLoans: 0, studentLoans: 0, creditCards: 0, age: 0 });
  assert.equal(z.debtToAssetPct, 0);
  assert.equal(z.vsBenchmarkPct, 0);
});
