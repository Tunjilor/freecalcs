// PURE compute for the Raise (Salary Increase) Calculator. See BUILD-STANDARD §2.
// New pay from a percent or dollar raise, the per-paycheck difference, and the
// real raise after inflation.

import { round2 } from "../../lib/calculator/finance.ts";

export type RaiseInputs = {
  currentSalary: number;
  raisePct: number; // used when raiseAmount is 0
  raiseAmount: number; // annual $; overrides percent when > 0
  inflation: number; // %
  payPeriods: "12" | "24" | "26" | "52";
};

export type RaiseResults = {
  newSalary: number;
  raiseDollars: number;
  raisePctActual: number;
  realRaisePct: number;
  perPaycheck: number; // gross increase per paycheck
  perMonth: number;
  newHourly: number; // ÷ 2,080
  oldHourly: number;
  inflationNeutralSalary: number; // salary that just keeps pace
};

export function computeRaise(v: RaiseInputs): RaiseResults {
  const s = Math.max(0, v.currentSalary);
  const dollars = v.raiseAmount > 0 ? v.raiseAmount : s * (Math.max(0, v.raisePct) / 100);
  const pct = s > 0 ? (dollars / s) * 100 : 0;
  const ns = s + dollars;
  const periods = Number(v.payPeriods) || 26;
  return {
    newSalary: round2(ns),
    raiseDollars: round2(dollars),
    raisePctActual: round2(pct),
    realRaisePct: round2(((1 + pct / 100) / (1 + v.inflation / 100) - 1) * 100),
    perPaycheck: round2(dollars / periods),
    perMonth: round2(dollars / 12),
    newHourly: round2(ns / 2080),
    oldHourly: round2(s / 2080),
    inflationNeutralSalary: round2(s * (1 + v.inflation / 100)),
  };
}
