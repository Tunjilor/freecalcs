// PURE compute for the Home Affordability Calculator. Uses shared finance.ts.
// Derives the maximum home price at three back-end DTI comfort levels
// (conservative / moderate / aggressive) so buyers see a realistic range.

import { monthlyPayment, round2 } from "../../lib/calculator/finance.ts";

export type AffordabilityInputs = {
  annualIncome: number;
  monthlyDebts: number; // existing monthly debt payments (car, cards, etc.)
  downPayment: number;
  rate: number; // %
  termYears: number;
};

export type AffordabilityLevel = {
  label: string; // "Conservative" | "Moderate" | "Aggressive"
  dti: number; // back-end DTI %, e.g. 36
  maxPayment: number; // max monthly housing payment
  maxLoan: number;
  maxPrice: number;
};

export type AffordabilityResults = {
  monthlyIncome: number;
  levels: AffordabilityLevel[]; // [conservative, moderate, aggressive]
  maxPriceModerate: number; // headline (the moderate level)
  maxLoanModerate: number;
  maxPaymentModerate: number;
  downPaymentPct: number; // % at the moderate price
  needsPmi: boolean; // < 20% down at the moderate price
  twentyPercentDown: number; // 20% of the moderate price
  pmiMonthly: number; // estimated PMI at the moderate price if < 20% down
};

const DTI_LEVELS: { label: string; dti: number }[] = [
  { label: "Conservative", dti: 36 },
  { label: "Moderate", dti: 43 },
  { label: "Aggressive", dti: 50 },
];

export function computeAffordability(v: AffordabilityInputs): AffordabilityResults {
  const monthlyIncome = Math.max(0, v.annualIncome) / 12;
  const debts = Math.max(0, v.monthlyDebts);
  const down = Math.max(0, v.downPayment);
  const monthlyRate = v.rate / 100 / 12;
  const n = Math.max(1, Math.round(v.termYears * 12));
  const paymentPerDollar = monthlyPayment(1, monthlyRate, n); // payment on a $1 loan

  const levels: AffordabilityLevel[] = DTI_LEVELS.map(({ label, dti }) => {
    const maxPayment = Math.max(0, monthlyIncome * (dti / 100) - debts);
    const maxLoan = paymentPerDollar > 0 ? maxPayment / paymentPerDollar : 0;
    const maxPrice = maxLoan + down;
    return {
      label,
      dti,
      maxPayment: round2(maxPayment),
      maxLoan: round2(maxLoan),
      maxPrice: round2(maxPrice),
    };
  });

  const moderate = levels[1];
  const downPaymentPct = moderate.maxPrice > 0 ? (down / moderate.maxPrice) * 100 : 0;
  const needsPmi = downPaymentPct < 20 && moderate.maxPrice > 0;
  const loanAtModerate = Math.max(0, moderate.maxPrice - down);

  return {
    monthlyIncome: round2(monthlyIncome),
    levels,
    maxPriceModerate: moderate.maxPrice,
    maxLoanModerate: moderate.maxLoan,
    maxPaymentModerate: moderate.maxPayment,
    downPaymentPct: round2(downPaymentPct),
    needsPmi,
    twentyPercentDown: round2(moderate.maxPrice * 0.2),
    pmiMonthly: needsPmi ? round2((loanAtModerate * 0.005) / 12) : 0,
  };
}
