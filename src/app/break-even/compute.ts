// PURE compute for the Break-Even Calculator. See BUILD-STANDARD §2.
//   contribution margin = price − variable cost per unit
//   break-even units    = fixed costs ÷ contribution margin
//   units for a profit  = (fixed costs + target profit) ÷ contribution margin

import { round2 } from "../../lib/calculator/finance.ts";

export type BreakEvenInputs = {
  fixedCosts: number; // per month
  pricePerUnit: number;
  variableCostPerUnit: number;
  targetProfit: number; // per month
  expectedUnits: number; // per month (0 to skip)
};

export type BreakEvenResults = {
  contributionMargin: number;
  contributionMarginRatio: number;
  breakEvenUnits: number; // rounded up; −1 if never (margin ≤ 0)
  breakEvenRevenue: number;
  unitsForTarget: number;
  revenueForTarget: number;
  profitAtExpected: number;
  marginOfSafetyPct: number;
  viable: boolean;
  breakEvenLabel: string; // "200 units" or "Not reachable"
  targetLabel: string;
};

export function computeBreakEven(v: BreakEvenInputs): BreakEvenResults {
  const F = Math.max(0, v.fixedCosts);
  const p = Math.max(0, v.pricePerUnit);
  const vc = Math.max(0, v.variableCostPerUnit);
  const cm = p - vc;
  const viable = cm > 0;
  const be = viable ? Math.ceil(F / cm - 1e-9) : -1;
  const tgt = viable ? Math.ceil((F + Math.max(0, v.targetProfit)) / cm - 1e-9) : -1;
  const q = Math.max(0, v.expectedUnits);
  return {
    contributionMargin: round2(cm),
    contributionMarginRatio: p > 0 ? round2((cm / p) * 100) : 0,
    breakEvenUnits: be,
    breakEvenRevenue: viable ? round2(be * p) : 0,
    unitsForTarget: tgt,
    revenueForTarget: viable ? round2(tgt * p) : 0,
    profitAtExpected: round2(q * cm - F),
    marginOfSafetyPct: viable && q > 0 ? round2(((q - F / cm) / q) * 100) : 0,
    viable,
    breakEvenLabel: viable ? `${be.toLocaleString("en-US")} units` : "Not reachable",
    targetLabel: viable ? `${tgt.toLocaleString("en-US")} units` : "Not reachable",
  };
}
