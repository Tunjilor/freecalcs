// PURE compute for the Credit Card Payoff Calculator. Compares paying only the
// (declining) minimum against a fixed monthly payment. Uses the shared
// amortizeByPayment for the fixed path; the minimum-only path is simulated
// because the minimum shrinks as the balance falls. Real math, unit-tested.

import { amortizeByPayment, round2 } from "../../lib/calculator/finance.ts";

export type CreditCardInputs = {
  balance: number;
  apr: number; // %
  monthlyPayment: number; // the fixed amount you'll pay
};

export type CreditCardResults = {
  firstMonthInterest: number;
  minFirstPayment: number; // the first (largest) minimum payment
  minOnlyMonths: number;
  minOnlyInterest: number;
  minOnlyLabel: string;
  fixedAmortizes: boolean; // false if the fixed payment ≤ monthly interest
  fixedMonths: number;
  fixedInterest: number;
  fixedLabel: string;
  interestSaved: number; // minOnly − fixed
  monthsSaved: number;
};

// Common card minimum: greater of $35 or 1% of the balance plus that month's interest.
const MIN_FLOOR = 35;
const MIN_PERCENT = 0.01;
const CAP = 1200; // 100-year safety cap

function monthsLabel(total: number): string {
  const t = Math.max(0, Math.round(total));
  const y = Math.floor(t / 12);
  const m = t % 12;
  if (t === 0) return "0 mo";
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

function minimumOnly(balance0: number, monthlyRate: number): { months: number; interest: number; firstPayment: number } {
  let balance = balance0;
  let interestTotal = 0;
  let firstPayment = 0;
  let m = 0;
  for (; m < CAP && balance > 0.005; m++) {
    const interest = balance * monthlyRate;
    let pay = Math.max(MIN_FLOOR, MIN_PERCENT * balance + interest);
    if (pay > balance + interest) pay = balance + interest;
    if (m === 0) firstPayment = pay;
    balance = balance + interest - pay;
    interestTotal += interest;
  }
  return { months: m, interest: interestTotal, firstPayment };
}

export function computeCreditCard(v: CreditCardInputs): CreditCardResults {
  const balance = Math.max(0, v.balance);
  const monthlyRate = v.apr / 100 / 12;
  const payment = Math.max(0, v.monthlyPayment);

  const min = minimumOnly(balance, monthlyRate);
  const fixed = amortizeByPayment(balance, monthlyRate, payment);

  const interestSaved = fixed.amortizes ? round2(min.interest - fixed.totalInterest) : 0;
  const monthsSaved = fixed.amortizes ? min.months - fixed.payoffMonths : 0;

  return {
    firstMonthInterest: round2(balance * monthlyRate),
    minFirstPayment: round2(min.firstPayment),
    minOnlyMonths: min.months,
    minOnlyInterest: round2(min.interest),
    minOnlyLabel: min.months >= CAP ? "30+ yrs" : monthsLabel(min.months),
    fixedAmortizes: fixed.amortizes,
    fixedMonths: fixed.payoffMonths,
    fixedInterest: round2(fixed.totalInterest),
    fixedLabel: fixed.amortizes ? monthsLabel(fixed.payoffMonths) : "Never",
    interestSaved,
    monthsSaved,
  };
}
