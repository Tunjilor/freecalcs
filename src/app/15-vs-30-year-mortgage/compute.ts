// PURE compute for the 15 vs 30 Year Mortgage Calculator. See BUILD-STANDARD §2.
// Compares the two terms on payment and total interest, and runs the classic
// "take the 30 and invest the difference" test at the 15-year mark.

import {
  monthlyPayment,
  amortizeSchedule,
  remainingBalance,
  futureValueOfSeries,
  round2,
} from "../../lib/calculator/finance.ts";

export type FifteenThirtyInputs = {
  loanAmount: number;
  rate15: number; // annual %
  rate30: number; // annual %
  investReturn: number; // annual % expected on invested difference
};

export type FifteenThirtyResults = {
  payment15: number;
  payment30: number;
  paymentDifference: number; // 15yr − 30yr (monthly)
  interest15: number;
  interest30: number;
  interestSaved: number; // 30yr interest − 15yr interest
  rateGap: number; // percentage points
  // 30-year loan paid with the 15-year payment amount (same cash flow, higher rate).
  thirtyAtFifteenPaymentMonths: number;
  thirtyAtFifteenPaymentInterest: number;
  rateAdvantage: number; // extra interest the 30yr costs at the same cash flow
  // Invest-the-difference test at year 15.
  balance30AtYear15: number;
  investedAtYear15: number;
  investNetAtYear15: number; // invested − remaining 30yr balance (15yr side = 0 owed)
  fifteenWinsAtYear15: boolean;
  breakEvenReturn: number; // annual % at which investing ties, approximately
  series15: { x: string; y: number }[];
  series30: { x: string; y: number }[];
};

function investNet(diff: number, annual: number, balance30: number) {
  return futureValueOfSeries(diff, annual / 100 / 12, 180) - balance30;
}

export function computeFifteenThirty(v: FifteenThirtyInputs): FifteenThirtyResults {
  const P = Math.max(0, v.loanAmount);
  const r15 = Math.max(0, v.rate15) / 100 / 12;
  const r30 = Math.max(0, v.rate30) / 100 / 12;

  const pmt15 = monthlyPayment(P, r15, 180);
  const pmt30 = monthlyPayment(P, r30, 360);
  const a15 = amortizeSchedule(P, r15, 180, pmt15, 0);
  const a30 = amortizeSchedule(P, r30, 360, pmt30, 0);

  const diff = Math.max(0, pmt15 - pmt30);
  const fast30 = amortizeSchedule(P, r30, 360, pmt30, diff);

  const bal30at15 = remainingBalance(P, r30, pmt30, 180);
  const invested = futureValueOfSeries(diff, Math.max(0, v.investReturn) / 100 / 12, 180);
  const net = invested - bal30at15;

  // Break-even return by bisection on [0%, 30%].
  let lo = 0;
  let hi = 30;
  if (P > 0 && diff > 0) {
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (investNet(diff, mid, bal30at15) < 0) lo = mid;
      else hi = mid;
    }
  }
  const breakEven = P > 0 && diff > 0 ? (lo + hi) / 2 : 0;

  const yearly = (rows: { month: number; balance: number }[], years: number) => {
    const out: { x: string; y: number }[] = [{ x: "Yr 0", y: round2(P) }];
    for (let y = 1; y <= years; y++) {
      const row = rows[y * 12 - 1];
      out.push({ x: `Yr ${y}`, y: row ? row.balance : 0 });
    }
    return out;
  };

  return {
    payment15: round2(pmt15),
    payment30: round2(pmt30),
    paymentDifference: round2(pmt15 - pmt30),
    interest15: round2(a15.totalInterest),
    interest30: round2(a30.totalInterest),
    interestSaved: round2(a30.totalInterest - a15.totalInterest),
    rateGap: round2(v.rate30 - v.rate15),
    thirtyAtFifteenPaymentMonths: fast30.payoffMonths,
    thirtyAtFifteenPaymentInterest: round2(fast30.totalInterest),
    rateAdvantage: round2(fast30.totalInterest - a15.totalInterest),
    balance30AtYear15: bal30at15,
    investedAtYear15: round2(invested),
    investNetAtYear15: round2(net),
    fifteenWinsAtYear15: net < 0,
    breakEvenReturn: round2(breakEven),
    series15: yearly(a15.schedule, 30),
    series30: yearly(a30.schedule, 30),
  };
}
