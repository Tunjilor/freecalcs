// PURE compute for the Tax Refund Estimator. All tax figures come from
// tax-data.ts — nothing hardcoded here. Estimates your federal refund or balance
// due from income, withholding, and credits, using the standard deduction.

import {
  TAX_DATA,
  calcFederalTax,
  type FilingStatus,
  type TaxYear,
} from "../../lib/calculator/tax-data.ts";

export type TaxRefundInputs = {
  year: TaxYear;
  filing: FilingStatus;
  income: number; // total wages / gross income
  preTaxDeductions: number; // 401(k)/HSA/etc. above-the-line
  withheld: number; // federal income tax withheld this year
  children: number; // qualifying children for the Child Tax Credit
  otherCredits: number; // other nonrefundable credits
};

export type TaxRefundResults = {
  taxableIncome: number;
  taxBeforeCredits: number;
  childTaxCredit: number;
  creditsApplied: number;
  taxAfterCredits: number;
  withheld: number;
  refundOrOwed: number; // positive = refund, negative = owed
  isRefund: boolean;
  outcomeLabel: string; // "$2,340 refund" / "$540 owed" / "$0 — even"
  effectiveWithholdingRate: number; // withheld / income (0–1)
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function computeTaxRefund(v: TaxRefundInputs): TaxRefundResults {
  const income = Math.max(0, v.income);
  const preTax = Math.max(0, v.preTaxDeductions);
  const withheld = Math.max(0, v.withheld);
  const children = Math.max(0, Math.floor(v.children));

  const yd = TAX_DATA[v.year];
  const brackets = yd.brackets[v.filing];
  const stdDed = yd.stdDed[v.filing];

  const taxableIncome = Math.max(0, income - preTax - stdDed);
  const taxBeforeCredits = calcFederalTax(taxableIncome, brackets);

  const childTaxCredit = children * yd.childTaxCredit;
  const otherCredits = Math.max(0, v.otherCredits);
  // Nonrefundable treatment: credits can't reduce tax below zero here.
  const creditsApplied = Math.min(childTaxCredit + otherCredits, taxBeforeCredits);
  const taxAfterCredits = Math.max(0, taxBeforeCredits - creditsApplied);

  const refundOrOwed = withheld - taxAfterCredits;
  const isRefund = refundOrOwed >= 0;
  const outcomeLabel =
    Math.abs(refundOrOwed) < 1
      ? "$0 — even"
      : `${money(Math.abs(refundOrOwed))} ${isRefund ? "refund" : "owed"}`;

  return {
    taxableIncome: round2(taxableIncome),
    taxBeforeCredits: round2(taxBeforeCredits),
    childTaxCredit: round2(childTaxCredit),
    creditsApplied: round2(creditsApplied),
    taxAfterCredits: round2(taxAfterCredits),
    withheld: round2(withheld),
    refundOrOwed: round2(refundOrOwed),
    isRefund,
    outcomeLabel,
    effectiveWithholdingRate: income > 0 ? round2((withheld / income) * 10000) / 10000 : 0,
  };
}
