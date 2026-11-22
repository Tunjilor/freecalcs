// PURE compute for the Mortgage Payoff Calculator. See docs/BUILD-STANDARD.md §2.
// Starts from the original loan and how long you've been paying, works out
// today's balance, then shows what extra monthly principal and/or a one-time
// lump sum does — and what extra it would take to be mortgage-free by a goal.

import {
  monthlyPayment,
  amortizeSchedule,
  remainingBalance,
  round2,
  type AmortRow,
} from "../../lib/calculator/finance.ts";

export type MortgagePayoffInputs = {
  originalLoan: number;
  rate: number; // annual %
  termYears: number;
  yearsPaid: number; // years of payments already made
  extraMonthly: number;
  lumpSum: number; // one-time principal payment today
  targetYears: number; // goal: mortgage-free in N years from now (0 = no goal)
};

export type MortgagePayoffResults = {
  monthlyPI: number; // scheduled principal & interest
  currentBalance: number;
  remainingMonths: number; // on schedule
  newPayoffMonths: number; // with extra + lump
  monthsSaved: number;
  interestRemaining: number; // on schedule
  interestWithPlan: number;
  interestSaved: number;
  totalExtraPaid: number; // extra monthly × months + lump
  savedPerDollar: number; // interest saved per $1 of extra paid
  // Goal: extra per month needed to finish in targetYears.
  hasTarget: boolean;
  targetReachable: boolean; // target shorter than remaining schedule
  extraForTarget: number;
  // Lever: one extra payment per year (the "biweekly" effect), i.e. +P&I/12 a month.
  oneExtraPerYear: number;
  oneExtraMonthsSaved: number;
  oneExtraInterestSaved: number;
  schedule: AmortRow[]; // with plan
  baselineSchedule: AmortRow[];
};

export function computeMortgagePayoff(v: MortgagePayoffInputs): MortgagePayoffResults {
  const loan = Math.max(0, v.originalLoan);
  const r = Math.max(0, v.rate) / 100 / 12;
  const n = Math.max(1, Math.round(Math.max(1, v.termYears) * 12));
  const elapsed = Math.min(n, Math.max(0, Math.round(v.yearsPaid * 12)));
  const pmt = monthlyPayment(loan, r, n);

  const balance = remainingBalance(loan, r, pmt, elapsed);
  const remaining = Math.max(0, n - elapsed);
  const extra = Math.max(0, v.extraMonthly);
  const lump = Math.min(Math.max(0, v.lumpSum), balance);

  const baseline = amortizeSchedule(balance, r, remaining, pmt, 0);
  const plan = amortizeSchedule(balance - lump, r, remaining, pmt, extra);

  // Extra actually paid: anything above the scheduled P&I in each month (the
  // final month may be a partial payment, which contributes nothing), plus the lump.
  const extraPaid =
    lump +
    plan.schedule.reduce((s, row) => {
      // Rows are rounded to cents, so ignore sub-dime noise above the P&I.
      const over = row.principal + row.interest - pmt;
      return s + (over > 0.1 ? Math.min(extra, over) : 0);
    }, 0);

  const interestSaved = baseline.totalInterest - plan.totalInterest;

  const target = Math.max(0, Math.round(v.targetYears * 12));
  const hasTarget = target > 0 && balance > 0;
  const targetReachable = hasTarget && target < baseline.payoffMonths;
  const extraForTarget = targetReachable
    ? Math.max(0, monthlyPayment(Math.max(0, balance - lump), r, target) - pmt)
    : 0;

  const oneExtra = pmt / 12;
  const lever = amortizeSchedule(balance, r, remaining, pmt, oneExtra);

  return {
    monthlyPI: round2(pmt),
    currentBalance: round2(balance),
    remainingMonths: baseline.payoffMonths,
    newPayoffMonths: plan.payoffMonths,
    monthsSaved: baseline.payoffMonths - plan.payoffMonths,
    interestRemaining: round2(baseline.totalInterest),
    interestWithPlan: round2(plan.totalInterest),
    interestSaved: round2(interestSaved),
    totalExtraPaid: round2(extraPaid),
    savedPerDollar: extraPaid > 0 ? round2(interestSaved / extraPaid) : 0,
    hasTarget,
    targetReachable,
    extraForTarget: round2(extraForTarget),
    oneExtraPerYear: round2(pmt),
    oneExtraMonthsSaved: baseline.payoffMonths - lever.payoffMonths,
    oneExtraInterestSaved: round2(baseline.totalInterest - lever.totalInterest),
    schedule: plan.schedule,
    baselineSchedule: baseline.schedule,
  };
}
