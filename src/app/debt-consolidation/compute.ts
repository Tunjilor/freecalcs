// PURE compute for the Debt Consolidation Calculator. Compares keeping your
// current debts (paid at their minimums) against rolling them into one
// consolidation loan (rate, term, fee). Uses the shared finance.ts helpers.
// Debts use fixed slots d1..d5 (same pattern as /debt-payoff) to stay within the
// InputField schema. Real math, unit-tested.

import { monthlyPayment, amortizeByPayment, round2 } from "../../lib/calculator/finance.ts";

export type DebtConsolidationInputs = {
  d1Balance: number; d1Apr: number; d1Min: number;
  d2Balance: number; d2Apr: number; d2Min: number;
  d3Balance: number; d3Apr: number; d3Min: number;
  d4Balance: number; d4Apr: number; d4Min: number;
  d5Balance: number; d5Apr: number; d5Min: number;
  newRate: number; // % consolidation loan APR
  newTermMonths: number;
  fee: number; // origination fee (financed into the loan)
};

export type DebtConsolidationResults = {
  debtCount: number;
  totalBalance: number;
  weightedAvgApr: number; // blended current APR (%)
  currentTotalMinPayment: number;
  currentTotalInterest: number;
  newLoanAmount: number; // balance + fee (financed)
  newPayment: number;
  newTotalInterest: number;
  fee: number;
  consolidationTotalCost: number; // newTotalInterest + fee
  monthlySavings: number; // current min total − new payment
  interestSaved: number; // currentTotalInterest − consolidationTotalCost (signed)
  saves: boolean;
  breakEvenLabel: string; // to recoup the fee via monthly savings
};

const CAP = 1200;
type Debt = { balance: number; monthlyRate: number; min: number; apr: number };

function collect(v: DebtConsolidationInputs): Debt[] {
  const raw = [
    { b: v.d1Balance, a: v.d1Apr, m: v.d1Min },
    { b: v.d2Balance, a: v.d2Apr, m: v.d2Min },
    { b: v.d3Balance, a: v.d3Apr, m: v.d3Min },
    { b: v.d4Balance, a: v.d4Apr, m: v.d4Min },
    { b: v.d5Balance, a: v.d5Apr, m: v.d5Min },
  ];
  return raw
    .filter((d) => d.b > 0)
    .map((d) => ({ balance: Math.max(0, d.b), monthlyRate: Math.max(0, d.a) / 100 / 12, min: Math.max(0, d.m), apr: Math.max(0, d.a) }));
}

function monthsLabel(total: number): string {
  const t = Math.max(0, Math.round(total));
  const y = Math.floor(t / 12);
  const m = t % 12;
  if (t === 0) return "0 mo";
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

export function computeDebtConsolidation(v: DebtConsolidationInputs): DebtConsolidationResults {
  const debts = collect(v);
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const currentTotalMinPayment = debts.reduce((s, d) => s + d.min, 0);
  const weightedAvgApr = totalBalance > 0 ? debts.reduce((s, d) => s + d.apr * d.balance, 0) / totalBalance : 0;

  // Current path: pay each debt at its own minimum (capped for non-amortizing).
  const currentTotalInterest = debts.reduce(
    (s, d) => s + amortizeByPayment(d.balance, d.monthlyRate, d.min, CAP).totalInterest,
    0,
  );

  // Consolidation loan (fee financed into the balance).
  const fee = Math.max(0, v.fee);
  const newLoanAmount = totalBalance + fee;
  const newRate = v.newRate / 100 / 12;
  const n = Math.max(1, Math.round(v.newTermMonths));
  const newPayment = monthlyPayment(newLoanAmount, newRate, n);
  const newTotalInterest = newPayment * n - newLoanAmount;
  const consolidationTotalCost = newTotalInterest + fee;

  const monthlySavings = currentTotalMinPayment - newPayment;
  const interestSaved = currentTotalInterest - consolidationTotalCost;
  const breakEven =
    monthlySavings > 0 && fee > 0 ? monthsLabel(Math.ceil(fee / monthlySavings)) : monthlySavings > 0 ? "Immediate" : "Never";

  return {
    debtCount: debts.length,
    totalBalance: round2(totalBalance),
    weightedAvgApr: round2(weightedAvgApr),
    currentTotalMinPayment: round2(currentTotalMinPayment),
    currentTotalInterest: round2(currentTotalInterest),
    newLoanAmount: round2(newLoanAmount),
    newPayment: round2(newPayment),
    newTotalInterest: round2(newTotalInterest),
    fee: round2(fee),
    consolidationTotalCost: round2(consolidationTotalCost),
    monthlySavings: round2(monthlySavings),
    interestSaved: round2(interestSaved),
    saves: interestSaved > 0,
    breakEvenLabel: breakEven,
  };
}
