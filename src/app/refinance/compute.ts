// PURE compute for the Mortgage Refinance Calculator. Uses the shared
// finance.ts helpers — no local amortization math. Compares the current loan to
// a new loan and surfaces the break-even point (headline feature) plus the
// lifetime-interest trade-off that a longer new term can hide.

import {
  monthlyPayment,
  amortizeSchedule,
  round2,
} from "../../lib/calculator/finance.ts";

export type RefinanceInputs = {
  currentBalance: number;
  currentRate: number; // %
  currentRemainingMonths: number;
  newRate: number; // %
  newTermMonths: number;
  closingCosts: number;
  financeClosingCosts: "no" | "yes"; // roll costs into the new loan, or pay cash
};

export type RefinanceResults = {
  currentPayment: number;
  newLoanAmount: number;
  newPayment: number;
  monthlySavings: number; // current − new (positive = cheaper)
  upfrontCost: number; // closing costs paid in cash (0 if financed)
  breakEvenMonths: number; // 0 if never
  breakEvenLabel: string; // "X yr Y mo" or "Never"
  currentTotalInterest: number;
  newTotalInterest: number;
  lifetimeInterestDelta: number; // current − new (positive = new saves interest)
  lifetimeSavings: number; // monthlySavings*newTerm − upfrontCost (net over new term)
  worthItMonths: number; // same as break-even; the "stay past this" number
  payback: { x: string; y: number }[]; // cumulative net savings over time
};

function monthsLabel(total: number): string {
  const t = Math.max(0, Math.round(total));
  const y = Math.floor(t / 12);
  const m = t % 12;
  if (t === 0) return "0 mo";
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

export function computeRefinance(v: RefinanceInputs): RefinanceResults {
  const balance = Math.max(0, v.currentBalance);
  const curRate = v.currentRate / 100 / 12;
  const curN = Math.max(1, Math.round(v.currentRemainingMonths));
  const currentPayment = monthlyPayment(balance, curRate, curN);
  const currentTotalInterest = amortizeSchedule(balance, curRate, curN, currentPayment).totalInterest;

  const closingCosts = Math.max(0, v.closingCosts);
  const financed = v.financeClosingCosts === "yes";
  const newLoanAmount = balance + (financed ? closingCosts : 0);
  const newRate = v.newRate / 100 / 12;
  const newN = Math.max(1, Math.round(v.newTermMonths));
  const newPayment = monthlyPayment(newLoanAmount, newRate, newN);
  const newTotalInterest = amortizeSchedule(newLoanAmount, newRate, newN, newPayment).totalInterest;

  const monthlySavings = currentPayment - newPayment;
  const upfrontCost = financed ? 0 : closingCosts;
  const breakEvenMonths =
    monthlySavings > 0 && upfrontCost > 0 ? Math.ceil(upfrontCost / monthlySavings) : monthlySavings > 0 ? 0 : 0;
  const paysBack = monthlySavings > 0;

  // Payback timeline: cumulative net savings = monthlySavings*m − upfrontCost.
  const horizon = Math.min(newN, 120);
  const step = Math.max(1, Math.round(horizon / 40));
  const payback: { x: string; y: number }[] = [];
  for (let m = 0; m <= horizon; m += step) {
    payback.push({ x: `Mo ${m}`, y: round2(monthlySavings * m - upfrontCost) });
  }

  return {
    currentPayment: round2(currentPayment),
    newLoanAmount: round2(newLoanAmount),
    newPayment: round2(newPayment),
    monthlySavings: round2(monthlySavings),
    upfrontCost: round2(upfrontCost),
    breakEvenMonths,
    breakEvenLabel: !paysBack ? "Never" : upfrontCost === 0 ? "Immediate" : monthsLabel(breakEvenMonths),
    currentTotalInterest: round2(currentTotalInterest),
    newTotalInterest: round2(newTotalInterest),
    lifetimeInterestDelta: round2(currentTotalInterest - newTotalInterest),
    lifetimeSavings: round2(monthlySavings * newN - upfrontCost),
    worthItMonths: breakEvenMonths,
    payback,
  };
}
