// PURE compute for the USDA Loan Calculator. See docs/BUILD-STANDARD.md §2.
//
// Domain reference — USDA Section 502 Single Family Housing Guaranteed Loan
// fees (USDA Rural Development; unchanged for FY2026 and FY2027):
//   Upfront guarantee fee: 1.00% of the loan, may be financed.
//   Annual fee: 0.35% of the average unpaid principal balance, paid monthly,
//   for the life of the loan. Based on the total loan including any financed
//   upfront fee.
//   No down payment required; standard term is a 30-year fixed.

import {
  monthlyPayment,
  amortizeSchedule,
  round2,
  type AmortRow,
} from "../../lib/calculator/finance.ts";
import { computeFha } from "../fha-loan/compute.ts";

export const USDA_UPFRONT_RATE = 0.01;
export const USDA_ANNUAL_RATE = 0.0035;

export type UsdaInputs = {
  homePrice: number;
  downPayment: number;
  rate: number; // annual %
  termYears: number;
  financeFee: "yes" | "no";
  propTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly: number;
};

export type UsdaResults = {
  baseLoan: number;
  downPaymentPct: number;
  upfrontFee: number;
  feeFinanced: boolean;
  loanAmount: number;
  monthlyPI: number;
  monthlyAnnualFee: number; // year-1 monthly portion of the annual fee
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthly: number;
  totalInterest: number;
  totalAnnualFees: number; // over the life of the loan
  totalGuaranteeFees: number; // upfront + annual
  cashToCloseFee: number; // upfront fee owed at closing if not financed
  // Comparison: same home as an FHA loan with 3.5% down.
  fhaMonthly: number;
  fhaMonthlyMip: number;
  fhaDownPayment: number;
  vsFhaMonthlySaving: number;
  schedule: AmortRow[];
};

export function computeUsda(v: UsdaInputs): UsdaResults {
  const homePrice = Math.max(0, v.homePrice);
  const down = Math.min(Math.max(0, v.downPayment), homePrice);
  const baseLoan = Math.max(0, homePrice - down);
  const downPaymentPct = homePrice > 0 ? (down / homePrice) * 100 : 0;

  const upfrontFee = baseLoan * USDA_UPFRONT_RATE;
  const financed = v.financeFee === "yes" && upfrontFee > 0;
  const loanAmount = financed ? baseLoan + upfrontFee : baseLoan;

  const termYears = Math.max(1, v.termYears);
  const r = v.rate / 100 / 12;
  const n = Math.max(1, Math.round(termYears * 12));
  const pi = monthlyPayment(loanAmount, r, n);
  const am = amortizeSchedule(loanAmount, r, n, pi, 0);

  // Annual fee: 0.35% of each year's average balance, for the whole loan.
  let totalAnnualFees = 0;
  let firstMonthlyFee = 0;
  for (let y = 0; y * 12 < am.schedule.length; y++) {
    const rows = am.schedule.slice(y * 12, y * 12 + 12);
    let sum = 0;
    for (let i = 0; i < rows.length; i++) {
      const idx = y * 12 + i;
      sum += idx === 0 ? loanAmount : am.schedule[idx - 1].balance;
    }
    const monthly = ((sum / rows.length) * USDA_ANNUAL_RATE) / 12;
    if (y === 0) firstMonthlyFee = monthly;
    totalAnnualFees += monthly * rows.length;
  }

  const monthlyTax = Math.max(0, v.propTaxAnnual) / 12;
  const monthlyInsurance = Math.max(0, v.insuranceAnnual) / 12;
  const monthlyHOA = Math.max(0, v.hoaMonthly);
  const totalMonthly = pi + firstMonthlyFee + monthlyTax + monthlyInsurance + monthlyHOA;

  const fha = computeFha({
    homePrice,
    downPayment: homePrice * 0.035,
    rate: v.rate,
    termYears,
    creditBand: "580",
    propTaxAnnual: v.propTaxAnnual,
    insuranceAnnual: v.insuranceAnnual,
    hoaMonthly: v.hoaMonthly,
  });

  return {
    baseLoan: round2(baseLoan),
    downPaymentPct: round2(downPaymentPct),
    upfrontFee: round2(upfrontFee),
    feeFinanced: financed,
    loanAmount: round2(loanAmount),
    monthlyPI: round2(pi),
    monthlyAnnualFee: round2(firstMonthlyFee),
    monthlyTax: round2(monthlyTax),
    monthlyInsurance: round2(monthlyInsurance),
    monthlyHOA: round2(monthlyHOA),
    totalMonthly: round2(totalMonthly),
    totalInterest: round2(am.totalInterest),
    totalAnnualFees: round2(totalAnnualFees),
    totalGuaranteeFees: round2(totalAnnualFees + upfrontFee),
    cashToCloseFee: financed ? 0 : round2(upfrontFee),
    fhaMonthly: fha.totalMonthly,
    fhaMonthlyMip: fha.monthlyMIP,
    fhaDownPayment: round2(homePrice * 0.035),
    vsFhaMonthlySaving: round2(fha.totalMonthly - totalMonthly),
    schedule: am.schedule,
  };
}
