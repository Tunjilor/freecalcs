// PURE compute for the Personal Loan Calculator. Self-contained, deterministic,
// unit-tested. Handles a general amortizing loan plus an optional origination
// fee, and derives the TRUE APR (the rate implied once the fee is counted, since
// the fee is deducted from what you actually receive but you still repay the
// full principal).

import {
  monthlyPayment,
  amortizeSchedule,
  round2,
  type AmortRow,
} from "../../lib/calculator/finance.ts";

export { monthlyPayment }; // re-exported so the test suite's import is unchanged

export type PersonalLoanInputs = {
  principal: number;
  apr: number; // % nominal
  termMonths: number;
  originationFeePct: number; // % of principal, deducted from proceeds
  extraPayment: number;
};

export type PersonalLoanResults = {
  monthlyPayment: number;
  originationFee: number;
  amountReceived: number; // principal − fee
  trueApr: number; // % including the fee
  totalInterest: number;
  totalCost: number; // interest + fee
  totalRepaid: number; // payment × months
  payoffMonths: number;
  scheduledMonths: number;
  monthsSaved: number;
  interestSaved: number;
  leverExtra: number;
  leverMonthsSaved: number;
  leverInterestSaved: number;
  schedule: AmortRow[];
};

/** Present value of a level payment stream at a monthly rate. */
function pv(payment: number, monthlyRate: number, n: number): number {
  if (monthlyRate <= 0) return payment * n;
  return (payment * (1 - Math.pow(1 + monthlyRate, -n))) / monthlyRate;
}

/**
 * True APR: the annual rate whose payment stream has present value equal to the
 * amount actually received (principal − fee). Solved by bisection on the monthly
 * rate. When the fee is 0, this converges to the nominal APR.
 */
export function solveTrueApr(amountReceived: number, payment: number, n: number): number {
  if (amountReceived <= 0 || payment <= 0 || n <= 0) return 0;
  let lo = 0;
  let hi = 5; // 500%/month upper bound — far beyond any real loan
  // f(r) = pv(r) − received is monotonically decreasing in r.
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const diff = pv(payment, mid, n) - amountReceived;
    if (diff > 0) lo = mid;
    else hi = mid;
  }
  return ((lo + hi) / 2) * 12 * 100;
}

export function computePersonalLoan(v: PersonalLoanInputs): PersonalLoanResults {
  const principal = Math.max(0, v.principal);
  const feePct = Math.min(Math.max(0, v.originationFeePct), 99);
  const originationFee = round2(principal * (feePct / 100));
  const amountReceived = Math.max(0, principal - originationFee);

  const monthlyRate = v.apr / 100 / 12;
  const scheduledN = Math.max(1, Math.round(v.termMonths));
  const pmt = monthlyPayment(principal, monthlyRate, scheduledN);

  const withExtra = amortizeSchedule(principal, monthlyRate, scheduledN, pmt, v.extraPayment);
  const noExtra =
    v.extraPayment > 0 ? amortizeSchedule(principal, monthlyRate, scheduledN, pmt, 0) : withExtra;

  const LEVER = 100;
  const lever = amortizeSchedule(principal, monthlyRate, scheduledN, pmt, LEVER);
  const leverBaseInterest = amortizeSchedule(principal, monthlyRate, scheduledN, pmt, 0).totalInterest;

  const trueApr = solveTrueApr(amountReceived, pmt, scheduledN);
  const totalInterest = withExtra.totalInterest;

  return {
    monthlyPayment: round2(pmt),
    originationFee,
    amountReceived: round2(amountReceived),
    trueApr: round2(trueApr),
    totalInterest: round2(totalInterest),
    totalCost: round2(totalInterest + originationFee),
    totalRepaid: round2(pmt * withExtra.payoffMonths),
    payoffMonths: withExtra.payoffMonths,
    scheduledMonths: noExtra.payoffMonths,
    monthsSaved: noExtra.payoffMonths - withExtra.payoffMonths,
    interestSaved: round2(noExtra.totalInterest - withExtra.totalInterest),
    leverExtra: LEVER,
    leverMonthsSaved: scheduledN - lever.payoffMonths,
    leverInterestSaved: round2(leverBaseInterest - lever.totalInterest),
    schedule: withExtra.schedule,
  };
}
