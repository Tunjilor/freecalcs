// PURE compute for the Car Affordability Calculator. See BUILD-STANDARD §2.
// Works backward from a monthly budget to a car price, and checks it against the
// common 20/4/10 guideline (20% down, ≤4-year loan, total car costs ≤10% of
// gross income) and a 15%-of-take-home looser cap.

import { round2 } from "../../lib/calculator/finance.ts";

export type CarAffordabilityInputs = {
  annualIncome: number; // gross
  monthlyBudget: number; // max car payment you want
  downPayment: number; // cash + trade-in equity
  rate: number; // APR %
  termMonths: "36" | "48" | "60" | "72" | "84"; // select value
  salesTaxPct: number;
  fees: number; // title, registration, dealer doc fees
  insuranceMonthly: number;
  fuelMaintMonthly: number;
};

export type CarAffordabilityResults = {
  maxLoan: number; // loan the budget supports
  maxPrice: number; // car price (before tax/fees) you can afford
  totalInterest: number;
  // 20/4/10 guideline
  guidelineCarCostCap: number; // 10% of gross monthly
  guidelinePayment: number; // what's left for the payment after insurance + fuel
  guidelinePrice: number; // price under 20/4/10 (20% down of price, 48 months)
  totalMonthlyCarCost: number; // payment + insurance + fuel/maintenance
  carCostPctIncome: number; // of gross monthly
  meets2048: boolean; // term ≤ 48 and down ≥ 20% of price
  downPctOfPrice: number;
  overBudgetVsGuideline: boolean;
};

/** Loan amount a monthly payment supports. */
export function loanFromPayment(payment: number, r: number, n: number): number {
  if (payment <= 0 || n <= 0) return 0;
  if (r === 0) return payment * n;
  return (payment * (1 - Math.pow(1 + r, -n))) / r;
}

/** Car price given a loan, down payment, tax rate and fees: loan + down = price × (1 + tax) + fees. */
function priceFrom(loan: number, down: number, taxPct: number, fees: number) {
  return Math.max(0, (loan + down - fees) / (1 + taxPct / 100));
}

export function computeCarAffordability(v: CarAffordabilityInputs): CarAffordabilityResults {
  const r = Math.max(0, v.rate) / 100 / 12;
  const n = Math.max(1, Math.round(Number(v.termMonths) || 60));
  const budget = Math.max(0, v.monthlyBudget);
  const down = Math.max(0, v.downPayment);
  const tax = Math.max(0, v.salesTaxPct);
  const fees = Math.max(0, v.fees);
  const ins = Math.max(0, v.insuranceMonthly);
  const fuel = Math.max(0, v.fuelMaintMonthly);

  const maxLoan = loanFromPayment(budget, r, n);
  const maxPrice = priceFrom(maxLoan, down, tax, fees);
  const totalInterest = budget * n - maxLoan;

  const grossMonthly = Math.max(0, v.annualIncome) / 12;
  const cap = grossMonthly * 0.1;
  const gPay = Math.max(0, cap - ins - fuel);
  // 20/4/10 price: loan = 80% of out-the-door cost over 48 months.
  const gLoan = loanFromPayment(gPay, r, 48);
  // price × (1+tax) + fees = gLoan / 0.8  →  price = (gLoan/0.8 − fees)/(1+tax)
  const gPrice = Math.max(0, (gLoan / 0.8 - fees) / (1 + tax / 100));

  const totalCar = budget + ins + fuel;
  const downPct = maxPrice > 0 ? (down / maxPrice) * 100 : 0;

  return {
    maxLoan: round2(maxLoan),
    maxPrice: round2(maxPrice),
    totalInterest: round2(Math.max(0, totalInterest)),
    guidelineCarCostCap: round2(cap),
    guidelinePayment: round2(gPay),
    guidelinePrice: round2(gPrice),
    totalMonthlyCarCost: round2(totalCar),
    carCostPctIncome: grossMonthly > 0 ? round2((totalCar / grossMonthly) * 100) : 0,
    meets2048: n <= 48 && downPct >= 20 - 1e-9,
    downPctOfPrice: round2(downPct),
    overBudgetVsGuideline: grossMonthly > 0 && totalCar > cap + 0.005,
  };
}
