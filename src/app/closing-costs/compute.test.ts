import { test } from "node:test";
import assert from "node:assert/strict";
import { computeClosingCosts, type ClosingCostsInputs } from "./compute.ts";

const base: ClosingCostsInputs = {
  homePrice: 400000,
  downPayment: 40000,
  rate: 6.5,
  originationPct: 1,
  points: 0,
  appraisalInspection: 1100,
  titlePct: 0.5,
  transferTaxPct: 0.2,
  propTaxAnnual: 4800,
  insuranceAnnual: 1800,
  escrowMonths: 3,
  sellerCredit: 0,
};
const approx = (a: number, b: number, eps = 0.01) =>
  assert.ok(Math.abs(a - b) <= eps, `expected ~${b}, got ${a}`);

test("itemized totals", () => {
  const r = computeClosingCosts(base);
  assert.equal(r.loanAmount, 360000);
  approx(r.lenderFees, 3600 + 450);
  approx(r.thirdPartyFees, 1100 + 2000);
  approx(r.governmentFees, 125 + 800);
  // prepaid interest 360,000 × 6.5% / 365 × 15 = 961.64; + 1,800 + (6,600/12 × 3 = 1,650)
  approx(r.prepaids, 961.64 + 1800 + 1650);
  approx(r.totalClosingCosts, r.lenderFees + r.thirdPartyFees + r.governmentFees + r.prepaids);
  assert.ok(r.pctOfLoan > 2 && r.pctOfLoan < 5, `got ${r.pctOfLoan}`);
  approx(r.cashToClose, 40000 + r.totalClosingCosts);
});

test("points and seller credit", () => {
  const r = computeClosingCosts({ ...base, points: 1, sellerCredit: 5000 });
  approx(r.lenderFees, 3600 + 3600 + 450);
  assert.equal(r.sellerCredit, 5000);
  approx(r.netClosingCosts, r.totalClosingCosts - 5000);
});

test("seller credit can't exceed costs", () => {
  const r = computeClosingCosts({ ...base, sellerCredit: 1e9 });
  assert.equal(r.netClosingCosts, 0);
  assert.equal(r.cashToClose, 40000);
});

test("zero lines are dropped from the itemized list", () => {
  const r = computeClosingCosts(base);
  assert.ok(!r.lines.some((l) => l.item === "Discount points"));
});

test("edge: zero price", () => {
  const r = computeClosingCosts({ ...base, homePrice: 0, downPayment: 0, appraisalInspection: 0, insuranceAnnual: 0, propTaxAnnual: 0 });
  assert.equal(r.totalClosingCosts, 0);
  assert.equal(r.pctOfLoan, 0);
  assert.equal(r.lines.length, 0);
});
