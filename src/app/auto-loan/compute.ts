// PURE compute for the Auto Loan Calculator. Self-contained (mirrors the
// /va-loan reference): no DOM, no fetch, no Date — deterministic and unit-tested.
//
// Sales tax follows the common trade-in credit rule: tax is charged on
// (price − trade-in), which most US states apply. Down payment and trade-in
// reduce the financed amount; taxes and dealer fees are rolled into the loan.

import {
  monthlyPayment,
  amortizeSchedule,
  round2,
  type AmortRow,
} from "../../lib/calculator/finance.ts";

export { monthlyPayment }; // re-exported so the test suite's import is unchanged

export type AutoLoanInputs = {
  vehiclePrice: number;
  downPayment: number;
  tradeIn: number;
  salesTaxRate: number; // %
  fees: number; // doc/registration/title fees, financed
  termMonths: number;
  apr: number; // %
  extraPayment: number; // extra principal per month
};

export type AutoLoanResults = {
  taxableBase: number;
  salesTax: number;
  amountFinanced: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number; // financed + interest
  totalOutOfPocket: number; // down + trade + all payments
  interestShareOfPrice: number; // totalInterest / vehiclePrice (0–1)
  taxAndFees: number; // salesTax + fees added to the loan
  payoffMonths: number;
  scheduledMonths: number;
  monthsSaved: number;
  interestSaved: number;
  leverExtra: number;
  leverMonthsSaved: number;
  leverInterestSaved: number;
  schedule: AmortRow[];
};

export function computeAutoLoan(v: AutoLoanInputs): AutoLoanResults {
  const price = Math.max(0, v.vehiclePrice);
  const down = Math.max(0, v.downPayment);
  const trade = Math.max(0, v.tradeIn);
  const fees = Math.max(0, v.fees);

  const taxableBase = Math.max(0, price - trade);
  const salesTax = round2(taxableBase * (Math.max(0, v.salesTaxRate) / 100));
  const amountFinanced = Math.max(0, price + salesTax + fees - down - trade);

  const monthlyRate = v.apr / 100 / 12;
  const scheduledN = Math.max(1, Math.round(v.termMonths));
  const pmt = monthlyPayment(amountFinanced, monthlyRate, scheduledN);

  const withExtra = amortizeSchedule(amountFinanced, monthlyRate, scheduledN, pmt, v.extraPayment);
  const noExtra =
    v.extraPayment > 0 ? amortizeSchedule(amountFinanced, monthlyRate, scheduledN, pmt, 0) : withExtra;

  const LEVER = 100;
  const lever = amortizeSchedule(amountFinanced, monthlyRate, scheduledN, pmt, LEVER);
  const leverBaseInterest = amortizeSchedule(amountFinanced, monthlyRate, scheduledN, pmt, 0).totalInterest;

  const totalInterest = withExtra.totalInterest;

  return {
    taxableBase: round2(taxableBase),
    salesTax,
    amountFinanced: round2(amountFinanced),
    monthlyPayment: round2(pmt),
    totalInterest: round2(totalInterest),
    totalCost: round2(amountFinanced + totalInterest),
    totalOutOfPocket: round2(down + trade + pmt * withExtra.payoffMonths),
    interestShareOfPrice: price > 0 ? round2(totalInterest / price * 100) / 100 : 0,
    taxAndFees: round2(salesTax + fees),
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
