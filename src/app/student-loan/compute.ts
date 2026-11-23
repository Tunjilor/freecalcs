// PURE compute for the Student Loan Calculator. See BUILD-STANDARD §2.
// Fixed-rate amortization with optional extra payments, plus a comparison of the
// federal Standard (10-year) and Extended (25-year) repayment terms on the same
// balance and rate.

import { monthlyPayment, amortizeSchedule, round2 } from "../../lib/calculator/finance.ts";

export type StudentLoanInputs = {
  balance: number;
  rate: number; // annual %
  termYears: number;
  extraMonthly: number;
  annualIncome: number; // gross, for the payment-to-income check
};

export type StudentLoanResults = {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  payoffMonths: number;
  scheduledMonths: number;
  monthsSaved: number;
  interestSaved: number;
  pmt10: number;
  interest10: number;
  pmt25: number;
  interest25: number;
  paymentPctIncome: number; // payment ÷ gross monthly income
  series: { x: string; y: number }[];
};

function run(P: number, r: number, years: number, extra: number) {
  const n = Math.max(1, Math.round(years * 12));
  const pmt = monthlyPayment(P, r, n);
  return { pmt, n, am: amortizeSchedule(P, r, n, pmt, extra) };
}

export function computeStudentLoan(v: StudentLoanInputs): StudentLoanResults {
  const P = Math.max(0, v.balance);
  const r = Math.max(0, v.rate) / 100 / 12;
  const extra = Math.max(0, v.extraMonthly);
  const plan = run(P, r, Math.max(1, v.termYears), extra);
  const base = run(P, r, Math.max(1, v.termYears), 0);
  const s10 = run(P, r, 10, 0);
  const s25 = run(P, r, 25, 0);
  const gross = Math.max(0, v.annualIncome) / 12;

  const series = [{ x: "Yr 0", y: round2(P) }];
  for (let y = 1; y * 12 <= plan.am.schedule.length + 11; y++) {
    const row = plan.am.schedule[Math.min(plan.am.schedule.length, y * 12) - 1];
    if (!row) break;
    series.push({ x: `Yr ${y}`, y: row.balance });
    if (row.balance <= 0) break;
  }

  return {
    monthlyPayment: round2(plan.pmt),
    totalInterest: round2(plan.am.totalInterest),
    totalPaid: round2(P + plan.am.totalInterest),
    payoffMonths: plan.am.payoffMonths,
    scheduledMonths: base.am.payoffMonths,
    monthsSaved: base.am.payoffMonths - plan.am.payoffMonths,
    interestSaved: round2(base.am.totalInterest - plan.am.totalInterest),
    pmt10: round2(s10.pmt),
    interest10: round2(s10.am.totalInterest),
    pmt25: round2(s25.pmt),
    interest25: round2(s25.am.totalInterest),
    paymentPctIncome: gross > 0 ? round2(((plan.pmt + extra) / gross) * 100) : 0,
    series,
  };
}
