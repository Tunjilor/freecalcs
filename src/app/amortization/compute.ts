// PURE compute for the Amortization Calculator. See BUILD-STANDARD §2.
// Full schedule for any fixed-rate loan, with optional extra monthly principal,
// rolled up by year for the table and the chart.

import {
  monthlyPayment,
  amortizeSchedule,
  round2,
  type AmortRow,
} from "../../lib/calculator/finance.ts";

export type AmortizationInputs = {
  loanAmount: number;
  rate: number; // annual %
  termYears: number;
  extraMonthly: number;
};

export type YearRow = {
  year: number;
  principal: number;
  interest: number;
  extra: number;
  endBalance: number;
  cumulativeInterest: number;
};

export type AmortizationResults = {
  monthlyPayment: number; // scheduled P&I
  totalPayment: number; // payment + extra
  totalInterest: number;
  totalPaid: number;
  payoffMonths: number;
  scheduledMonths: number;
  monthsSaved: number;
  interestSaved: number; // vs no extra
  firstPaymentInterestPct: number; // share of payment 1 that is interest, 0–100
  crossoverMonth: number; // first month where principal ≥ interest (0 if none)
  halfPaidMonth: number; // first month where balance ≤ half the loan
  interestToPrincipalRatio: number; // total interest ÷ loan, 0–100
  years: YearRow[];
  firstYear: AmortRow[];
  schedule: AmortRow[];
};

export function computeAmortization(v: AmortizationInputs): AmortizationResults {
  const P = Math.max(0, v.loanAmount);
  const r = Math.max(0, v.rate) / 100 / 12;
  const n = Math.max(1, Math.round(Math.max(1, v.termYears) * 12));
  const extra = Math.max(0, v.extraMonthly);
  const pmt = monthlyPayment(P, r, n);

  const base = amortizeSchedule(P, r, n, pmt, 0);
  const plan = amortizeSchedule(P, r, n, pmt, extra);
  const s = plan.schedule;

  const years: YearRow[] = [];
  for (let i = 0; i < s.length; i += 12) {
    const rows = s.slice(i, i + 12);
    const principal = rows.reduce((a, x) => a + x.principal, 0);
    const interest = rows.reduce((a, x) => a + x.interest, 0);
    // Extra = principal beyond what the scheduled payment alone would cover.
    const extraPaid = rows.reduce((a, x) => a + Math.max(0, Math.min(extra, x.principal + x.interest - pmt)), 0);
    years.push({
      year: i / 12 + 1,
      principal: round2(principal),
      interest: round2(interest),
      extra: round2(extraPaid),
      endBalance: rows[rows.length - 1].balance,
      cumulativeInterest: rows[rows.length - 1].cumulativeInterest,
    });
  }

  const crossover = s.find((x) => x.principal >= x.interest && x.principal > 0);
  const half = s.find((x) => x.balance <= P / 2);
  const first = s[0];

  return {
    monthlyPayment: round2(pmt),
    totalPayment: round2(pmt + extra),
    totalInterest: round2(plan.totalInterest),
    totalPaid: round2(P + plan.totalInterest),
    payoffMonths: plan.payoffMonths,
    scheduledMonths: base.payoffMonths,
    monthsSaved: base.payoffMonths - plan.payoffMonths,
    interestSaved: round2(base.totalInterest - plan.totalInterest),
    firstPaymentInterestPct: first && pmt + extra > 0 ? round2((first.interest / (first.principal + first.interest)) * 100) : 0,
    crossoverMonth: crossover ? crossover.month : 0,
    halfPaidMonth: half ? half.month : 0,
    interestToPrincipalRatio: P > 0 ? round2((plan.totalInterest / P) * 100) : 0,
    years,
    firstYear: s.slice(0, 12),
    schedule: s,
  };
}
