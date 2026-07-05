// PURE compute for the Life Insurance Needs Calculator. Uses the DIME method
// (Debt + Income + Mortgage + Education) — a widely used planning RULE OF THUMB,
// not a formula with a single correct answer. The result is an ESTIMATE for
// planning; actual coverage and premiums require a licensed agent and a quote.
//
// Also computes the simpler "10× income" rule for comparison, since reasonable
// methods disagree and users should see that these are approximations.

import { round2 } from "../../lib/calculator/finance.ts";

export type LifeInsuranceInputs = {
  annualIncome: number;
  yearsToReplace: number; // income-replacement horizon (the "I" in DIME)
  totalDebt: number; // non-mortgage debt (cards, auto, student, etc.)
  mortgageBalance: number;
  childrenCount: number;
  educationPerChild: number; // estimated cost to educate each child
  existingCoverage: number; // life insurance you already have
  liquidSavings: number; // savings/assets that offset the need
};

export type LifeInsuranceResults = {
  debtComponent: number;
  incomeComponent: number;
  mortgageComponent: number;
  educationComponent: number;
  grossNeed: number; // sum of the four DIME components
  offsets: number; // existing coverage + liquid savings
  recommendedCoverage: number; // grossNeed − offsets (floored at 0)
  tenXIncome: number; // 10 × income, the alternative rule of thumb
  incomeSharePct: number; // income component as a share of gross need (0–100)
  vsTenXDelta: number; // recommended − 10×income (signed)
};

export function computeLifeInsurance(v: LifeInsuranceInputs): LifeInsuranceResults {
  const income = Math.max(0, v.annualIncome);
  const years = Math.max(0, v.yearsToReplace);

  const debtComponent = Math.max(0, v.totalDebt);
  const incomeComponent = income * years;
  const mortgageComponent = Math.max(0, v.mortgageBalance);
  const educationComponent = Math.max(0, v.childrenCount) * Math.max(0, v.educationPerChild);

  const grossNeed = debtComponent + incomeComponent + mortgageComponent + educationComponent;
  const offsets = Math.max(0, v.existingCoverage) + Math.max(0, v.liquidSavings);
  const recommendedCoverage = Math.max(0, grossNeed - offsets);
  const tenXIncome = income * 10;

  return {
    debtComponent: round2(debtComponent),
    incomeComponent: round2(incomeComponent),
    mortgageComponent: round2(mortgageComponent),
    educationComponent: round2(educationComponent),
    grossNeed: round2(grossNeed),
    offsets: round2(offsets),
    recommendedCoverage: round2(recommendedCoverage),
    tenXIncome: round2(tenXIncome),
    incomeSharePct: grossNeed > 0 ? round2((incomeComponent / grossNeed) * 100) : 0,
    vsTenXDelta: round2(recommendedCoverage - tenXIncome),
  };
}
