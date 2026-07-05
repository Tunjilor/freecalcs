// Hub + calculator registry. Powers breadcrumbs and the "Related calculators"
// grid, and keeps internal-linking labels consistent across the site.
// When you add a calculator, register it here so siblings can link to it.

import type { HubId, RelatedLink } from "./types";

export const HUBS: Record<HubId, { label: string; href: string; blurb: string }> = {
  mortgage: {
    label: "Mortgage & Home",
    href: "/mortgage",
    blurb: "Payment, refinance, affordability and loan-program calculators.",
  },
  loans: {
    label: "Loans & Debt",
    href: "/loan",
    blurb: "Auto, personal, student and payoff calculators.",
  },
  tax: { label: "Taxes", href: "/tax", blurb: "Income tax, refunds, paycheck, self-employment and capital gains." },
  investing: {
    label: "Investing & Retirement",
    href: "/compound-interest",
    blurb: "Compound growth, retirement, 401(k), Roth vs Traditional and savings goals.",
  },
  insurance: {
    label: "Insurance",
    href: "/life-insurance",
    blurb: "Life and term coverage-need estimates and a rough auto premium range.",
  },
  health: { label: "Health", href: "/bmi", blurb: "BMI, TDEE and everyday health tools." },
  everyday: { label: "Everyday", href: "/", blurb: "Percentages, tips, age and more." },
};

// Canonical slug -> display label, so related links read consistently.
export const CALC_LABELS: Record<string, string> = {
  mortgage: "Mortgage Calculator",
  qualify: "Mortgage Qualifier",
  "rent-vs-buy": "Rent vs Buy",
  loan: "Loan & EMI Calculator",
  "va-loan": "VA Loan Calculator",
  refinance: "Mortgage Refinance Calculator",
  heloc: "HELOC Calculator",
  "home-affordability": "Home Affordability Calculator",
  "down-payment": "Down Payment Calculator",
  "auto-loan": "Auto Loan Calculator",
  "personal-loan": "Personal Loan Calculator",
  "debt-payoff": "Debt Payoff Calculator",
  "loan-payoff": "Loan Payoff Calculator",
  "credit-card-payoff": "Credit Card Payoff Calculator",
  "debt-consolidation": "Debt Consolidation Calculator",
  salary: "Salary & Take-Home",
  tax: "Income Tax Calculator",
  "tax-refund": "Tax Refund Estimator",
  paycheck: "Paycheck Calculator",
  "self-employment-tax": "Self-Employment Tax Calculator",
  "capital-gains-tax": "Capital Gains Tax Calculator",
  "compound-interest": "Compound Interest",
  retirement: "Retirement Calculator",
  "401k": "401(k) Calculator",
  "roth-vs-traditional": "Roth vs Traditional Calculator",
  "savings-goal": "Savings Goal Calculator",
  "life-insurance": "Life Insurance Calculator",
  "term-life": "Term Life Insurance Calculator",
  "auto-insurance-estimator": "Auto Insurance Estimator",
  percentage: "Percentage Calculator",
  bmi: "BMI Calculator",
  tdee: "TDEE & Calories",
  age: "Age Calculator",
  tip: "Tip Calculator",
  scientific: "Scientific Calculator",
};

export function relatedLink(slug: string): RelatedLink {
  return { slug, label: CALC_LABELS[slug] ?? slug };
}
