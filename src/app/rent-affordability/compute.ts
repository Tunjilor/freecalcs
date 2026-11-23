// PURE compute for the Rent Affordability Calculator. See BUILD-STANDARD §2.
// Three common yardsticks:
//   30% rule: rent ≤ 30% of gross monthly income (HUD's cost-burden threshold)
//   40x rule: many landlords require annual income ≥ 40 × monthly rent
//   50/30/20: rent + other needs ≤ 50% of take-home pay

import { round2 } from "../../lib/calculator/finance.ts";

export type RentAffordabilityInputs = {
  annualIncome: number; // gross, all earners
  monthlyTakeHome: number;
  monthlyDebts: number; // car, student loans, card minimums
  otherNeeds: number; // groceries, utilities, transport, insurance
  rent: number; // rent you're considering (0 to skip)
};

export type RentAffordabilityResults = {
  rentAt30: number;
  rentAt40x: number;
  rentAt5030: number; // 50% of take-home − debts − other needs
  recommendedRent: number; // the lowest of the three (conservative)
  rentPctGross: number;
  rentPctTakeHome: number;
  incomeNeeded40x: number; // for the rent entered
  costBurdened: boolean; // > 30% of gross
  severelyBurdened: boolean; // > 50% of gross
  passes40x: boolean;
  hasRent: boolean;
};

export function computeRentAffordability(v: RentAffordabilityInputs): RentAffordabilityResults {
  const gross = Math.max(0, v.annualIncome) / 12;
  const take = Math.max(0, v.monthlyTakeHome);
  const rent = Math.max(0, v.rent);

  const at30 = gross * 0.3;
  const at40x = Math.max(0, v.annualIncome) / 40;
  const at5030 = Math.max(0, take * 0.5 - Math.max(0, v.monthlyDebts) - Math.max(0, v.otherNeeds));
  const rec = take > 0 ? Math.min(at30, at40x, at5030) : Math.min(at30, at40x);

  return {
    rentAt30: round2(at30),
    rentAt40x: round2(at40x),
    rentAt5030: round2(at5030),
    recommendedRent: round2(rec),
    rentPctGross: gross > 0 ? round2((rent / gross) * 100) : 0,
    rentPctTakeHome: take > 0 ? round2((rent / take) * 100) : 0,
    incomeNeeded40x: round2(rent * 40),
    costBurdened: gross > 0 && rent > at30 + 0.005,
    severelyBurdened: gross > 0 && rent > gross * 0.5 + 0.005,
    passes40x: rent > 0 && Math.max(0, v.annualIncome) >= rent * 40,
    hasRent: rent > 0,
  };
}
