// PURE compute for the Rule of 72 Calculator. See BUILD-STANDARD §2.
// Years to double ≈ 72 ÷ rate; exact = ln 2 ÷ ln(1 + r). Also solves the rate
// needed to double in a given number of years, and growth over a horizon.

import { round2 } from "../../lib/calculator/finance.ts";

export type RuleOf72Inputs = {
  rate: number; // annual %
  targetYears: number; // for "rate needed to double in N years"
  amount: number;
  horizonYears: number;
};

export type RuleOf72Results = {
  yearsRule72: number;
  yearsExact: number;
  error: number; // rule − exact, years
  rateToDoubleRule: number;
  rateToDoubleExact: number;
  doublingsInHorizon: number;
  valueAtHorizon: number;
  rows: { rate: string; rule72: number; exact: number }[];
};

export const exactDoubling = (ratePct: number) => (ratePct > 0 ? Math.log(2) / Math.log(1 + ratePct / 100) : 0);

export function computeRuleOf72(v: RuleOf72Inputs): RuleOf72Results {
  const rate = Math.max(0, v.rate);
  const ty = Math.max(0, v.targetYears);
  const rule = rate > 0 ? 72 / rate : 0;
  const exact = exactDoubling(rate);
  const h = Math.max(0, v.horizonYears);
  return {
    yearsRule72: round2(rule),
    yearsExact: round2(exact),
    error: round2(rule - exact),
    rateToDoubleRule: ty > 0 ? round2(72 / ty) : 0,
    rateToDoubleExact: ty > 0 ? round2((Math.pow(2, 1 / ty) - 1) * 100) : 0,
    doublingsInHorizon: exact > 0 ? round2(h / exact) : 0,
    valueAtHorizon: round2(Math.max(0, v.amount) * Math.pow(1 + rate / 100, h)),
    rows: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((r) => ({ rate: `${r}%`, rule72: round2(72 / r), exact: round2(exactDoubling(r)) })),
  };
}
