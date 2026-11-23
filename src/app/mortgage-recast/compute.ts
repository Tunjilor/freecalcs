// PURE compute for the Mortgage Recast Calculator. See BUILD-STANDARD §2.
// A recast re-amortizes the remaining balance (after a lump-sum principal
// payment) over the SAME remaining term at the SAME rate, lowering the payment.
// Compared with putting the same lump sum toward principal without recasting
// (payment unchanged, loan ends sooner).

import { monthlyPayment, amortizeSchedule, round2 } from "../../lib/calculator/finance.ts";

export type MortgageRecastInputs = {
  balance: number; // current principal balance
  rate: number; // annual %
  monthsLeft: number;
  lumpSum: number;
  recastFee: number;
};

export type MortgageRecastResults = {
  currentPayment: number;
  newPayment: number;
  monthlySaving: number;
  interestNoAction: number;
  interestRecast: number;
  interestPrepayOnly: number;
  recastInterestSaved: number;
  prepayInterestSaved: number;
  prepayMonthsSaved: number;
  feeBreakEvenMonths: number;
  newBalance: number;
};

export function computeMortgageRecast(v: MortgageRecastInputs): MortgageRecastResults {
  const B = Math.max(0, v.balance);
  const r = Math.max(0, v.rate) / 100 / 12;
  const n = Math.max(1, Math.round(v.monthsLeft));
  const lump = Math.min(Math.max(0, v.lumpSum), B);
  const fee = Math.max(0, v.recastFee);
  const nb = B - lump;

  const p0 = monthlyPayment(B, r, n);
  const p1 = monthlyPayment(nb, r, n);
  const none = amortizeSchedule(B, r, n, p0, 0);
  const recast = amortizeSchedule(nb, r, n, p1, 0);
  const prepay = amortizeSchedule(nb, r, n, p0, 0);
  const saving = p0 - p1;

  return {
    currentPayment: round2(p0),
    newPayment: round2(p1),
    monthlySaving: round2(saving),
    interestNoAction: round2(none.totalInterest),
    interestRecast: round2(recast.totalInterest),
    interestPrepayOnly: round2(prepay.totalInterest),
    recastInterestSaved: round2(none.totalInterest - recast.totalInterest),
    prepayInterestSaved: round2(none.totalInterest - prepay.totalInterest),
    prepayMonthsSaved: none.payoffMonths - prepay.payoffMonths,
    feeBreakEvenMonths: saving > 0 && fee > 0 ? Math.ceil(fee / saving) : 0,
    newBalance: round2(nb),
  };
}
