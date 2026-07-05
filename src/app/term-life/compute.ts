// PURE compute for the Term Life Insurance Calculator. Estimates a coverage
// amount (income-multiple rule) AND how long a term should run to outlast your
// biggest obligations. Like all insurance tools here, the result is a planning
// ESTIMATE — premiums require a quote from a licensed agent.

import { round2 } from "../../lib/calculator/finance.ts";

export type TermLifeInputs = {
  annualIncome: number;
  incomeMultiple: number; // coverage = income × this (common: 10)
  mortgageBalance: number; // added to the coverage estimate
  yourAge: number;
  retirementAge: number;
  youngestChildAge: number; // years until independence drives term length
  mortgageYearsLeft: number;
};

export type TermLifeResults = {
  coverageNeed: number;
  yearsUntilChildIndependent: number; // until youngest turns 22
  yearsUntilRetirement: number;
  mortgageYearsLeft: number;
  longestObligationYears: number;
  longestObligationLabel: string;
  recommendedTermYears: number; // rounded up to a standard 10/15/20/25/30
};

const STANDARD_TERMS = [10, 15, 20, 25, 30];
const INDEPENDENCE_AGE = 22;

function nextStandardTerm(years: number): number {
  for (const t of STANDARD_TERMS) if (years <= t) return t;
  return STANDARD_TERMS[STANDARD_TERMS.length - 1];
}

export function computeTermLife(v: TermLifeInputs): TermLifeResults {
  const income = Math.max(0, v.annualIncome);
  const coverageNeed = income * Math.max(0, v.incomeMultiple) + Math.max(0, v.mortgageBalance);

  const yearsUntilChildIndependent = Math.max(0, INDEPENDENCE_AGE - Math.max(0, v.youngestChildAge));
  const yearsUntilRetirement = Math.max(0, Math.round(v.retirementAge) - Math.round(v.yourAge));
  const mortgageYearsLeft = Math.max(0, Math.round(v.mortgageYearsLeft));

  const drivers: { years: number; label: string }[] = [
    { years: yearsUntilChildIndependent, label: "your youngest child becomes independent" },
    { years: yearsUntilRetirement, label: "you reach retirement age" },
    { years: mortgageYearsLeft, label: "your mortgage is paid off" },
  ];
  const longest = drivers.reduce((a, b) => (b.years > a.years ? b : a), drivers[0]);
  const recommendedTermYears = nextStandardTerm(longest.years);

  return {
    coverageNeed: round2(coverageNeed),
    yearsUntilChildIndependent,
    yearsUntilRetirement,
    mortgageYearsLeft,
    longestObligationYears: longest.years,
    longestObligationLabel: longest.label,
    recommendedTermYears,
  };
}
