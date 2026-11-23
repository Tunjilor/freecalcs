// PURE compute for the Mortgage Points Calculator. See BUILD-STANDARD §2.
// Is buying discount points worth it? Cost vs monthly saving, break-even, and
// net result over how long you expect to keep the loan.

import { monthlyPayment, remainingBalance, round2 } from "../../lib/calculator/finance.ts";

export type MortgagePointsInputs = {
  loanAmount: number;
  baseRate: number; // rate with no points, annual %
  points: number; // 1 point = 1% of loan
  reductionPerPoint: number; // rate cut per point, percentage points
  termYears: number;
  yearsKeep: number; // years until you sell or refinance
};

export type MortgagePointsResults = {
  pointsCost: number;
  newRate: number;
  paymentNoPoints: number;
  paymentWithPoints: number;
  monthlySaving: number;
  breakEvenMonths: number; // simple: cost ÷ monthly saving (0 if no saving)
  // Over the time you keep the loan: payment savings + lower balance − cost.
  paymentSavingsOverStay: number;
  balanceAdvantageAtExit: number;
  netSavingsOverStay: number;
  netSavingsFullTerm: number;
  worthIt: boolean;
  rows: { year: number; net: number }[]; // cumulative net by year kept
};

export function computeMortgagePoints(v: MortgagePointsInputs): MortgagePointsResults {
  const P = Math.max(0, v.loanAmount);
  const points = Math.max(0, v.points);
  const n = Math.max(1, Math.round(Math.max(1, v.termYears) * 12));
  const newRate = Math.max(0, v.baseRate - points * Math.max(0, v.reductionPerPoint));
  const r0 = Math.max(0, v.baseRate) / 100 / 12;
  const r1 = newRate / 100 / 12;

  const p0 = monthlyPayment(P, r0, n);
  const p1 = monthlyPayment(P, r1, n);
  const saving = p0 - p1;
  const cost = P * (points / 100);

  const netAt = (months: number) => {
    const m = Math.min(n, Math.max(0, months));
    const bal0 = remainingBalance(P, r0, p0, m);
    const bal1 = remainingBalance(P, r1, p1, m);
    return { pay: saving * m, bal: bal0 - bal1, net: saving * m + (bal0 - bal1) - cost };
  };

  const keepM = Math.round(Math.max(0, v.yearsKeep) * 12);
  const stay = netAt(keepM);
  const full = netAt(n);
  const rows = [];
  for (let y = 1; y <= Math.min(30, Math.ceil(n / 12)); y++) rows.push({ year: y, net: round2(netAt(y * 12).net) });

  return {
    pointsCost: round2(cost),
    newRate: Math.round(newRate * 1000) / 1000,
    paymentNoPoints: round2(p0),
    paymentWithPoints: round2(p1),
    monthlySaving: round2(saving),
    breakEvenMonths: saving > 0 && cost > 0 ? Math.ceil(cost / saving) : 0,
    paymentSavingsOverStay: round2(stay.pay),
    balanceAdvantageAtExit: round2(stay.bal),
    netSavingsOverStay: round2(stay.net),
    netSavingsFullTerm: round2(full.net),
    worthIt: stay.net > 0,
    rows,
  };
}
