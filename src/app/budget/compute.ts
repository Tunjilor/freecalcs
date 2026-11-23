// PURE compute for the Budget (50/30/20) Calculator. See BUILD-STANDARD §2.
// Splits take-home pay into needs / wants / savings and compares the user's
// actual spending against the 50/30/20 guideline.

import { round2 } from "../../lib/calculator/finance.ts";

export type BudgetInputs = {
  monthlyTakeHome: number; // after-tax pay
  needs: number; // housing, utilities, groceries, insurance, minimum debt payments, transport
  wants: number; // dining, entertainment, subscriptions, travel, shopping
  savings: number; // savings, investing, extra debt payments
};

export type BudgetResults = {
  targetNeeds: number;
  targetWants: number;
  targetSavings: number;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
  allocated: number;
  unallocated: number; // take-home − (needs + wants + savings); negative = overspending
  overNeeds: number; // above 50%
  overWants: number; // above 30%
  savingsGap: number; // below 20%
  onTrack: boolean;
  annualSavings: number;
  rows: { category: string; target: number; actual: number; targetPct: number; actualPct: number }[];
};

export function computeBudget(v: BudgetInputs): BudgetResults {
  const pay = Math.max(0, v.monthlyTakeHome);
  const needs = Math.max(0, v.needs);
  const wants = Math.max(0, v.wants);
  const savings = Math.max(0, v.savings);
  const p = (x: number) => (pay > 0 ? (x / pay) * 100 : 0);

  const tN = pay * 0.5;
  const tW = pay * 0.3;
  const tS = pay * 0.2;
  const allocated = needs + wants + savings;

  const overNeeds = Math.max(0, needs - tN);
  const overWants = Math.max(0, wants - tW);
  const savingsGap = Math.max(0, tS - savings);

  return {
    targetNeeds: round2(tN),
    targetWants: round2(tW),
    targetSavings: round2(tS),
    needsPct: round2(p(needs)),
    wantsPct: round2(p(wants)),
    savingsPct: round2(p(savings)),
    allocated: round2(allocated),
    unallocated: round2(pay - allocated),
    overNeeds: round2(overNeeds),
    overWants: round2(overWants),
    savingsGap: round2(savingsGap),
    onTrack: pay > 0 && overNeeds === 0 && overWants === 0 && savingsGap === 0 && allocated <= pay + 0.005,
    annualSavings: round2(savings * 12),
    rows: [
      { category: "Needs", target: round2(tN), actual: needs, targetPct: 50, actualPct: round2(p(needs)) },
      { category: "Wants", target: round2(tW), actual: wants, targetPct: 30, actualPct: round2(p(wants)) },
      { category: "Savings & debt payoff", target: round2(tS), actual: savings, targetPct: 20, actualPct: round2(p(savings)) },
    ],
  };
}
