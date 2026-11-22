// PURE compute for the FHA Loan Calculator. See docs/BUILD-STANDARD.md §2.
//
// Domain reference — FHA mortgage insurance (HUD Mortgagee Letter 2023-05,
// effective 2023-03-20 and current for 2026):
//   Upfront MIP (UFMIP): 1.75% of the base loan, usually financed.
//   Annual MIP, term > 15 years:
//     base loan ≤ $726,200: LTV ≤ 95% = 0.50% | LTV > 95% = 0.55%
//     base loan > $726,200: LTV ≤ 95% = 0.70% | LTV > 95% = 0.75%
//   Annual MIP, term ≤ 15 years:
//     base loan ≤ $726,200: LTV ≤ 90% = 0.15% | LTV > 90% = 0.40%
//     base loan > $726,200: LTV ≤ 78% = 0.15% | 78–90% = 0.40% | > 90% = 0.65%
//   Duration: original LTV ≤ 90% → 11 years; LTV > 90% → life of the loan.
//   Minimum down: 3.5% with a 580+ credit score, 10% with 500–579.
//   2026 one-unit FHA loan limit: $541,287 floor, $1,249,125 ceiling (HUD).

import {
  monthlyPayment,
  amortizeSchedule,
  round2,
  type AmortRow,
} from "../../lib/calculator/finance.ts";

export const UFMIP_RATE = 0.0175;
export const MIP_TIER_BREAK = 726200;
export const FHA_FLOOR_LIMIT_2026 = 541287;
export const FHA_CEILING_LIMIT_2026 = 1249125;

export type FhaInputs = {
  homePrice: number;
  downPayment: number; // dollars
  rate: number; // annual %
  termYears: number;
  creditBand: "580" | "500"; // 580+ or 500–579
  propTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly: number;
};

export type FhaResults = {
  baseLoan: number;
  downPaymentPct: number;
  ltv: number; // base loan / price, 0–100
  minDownPct: number; // 3.5 or 10
  minDownAmount: number;
  meetsMinDown: boolean;
  ufmip: number;
  loanAmount: number; // base + financed UFMIP
  annualMipRate: number; // % e.g. 0.55
  mipYears: number; // 11, or the full term
  mipForLife: boolean;
  monthlyPI: number;
  monthlyMIP: number; // first-year monthly MIP
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthly: number;
  totalInterest: number;
  totalMip: number; // annual MIP paid over its duration
  totalMipAll: number; // UFMIP + annual MIP
  totalCost: number; // loan + interest + annual MIP
  exceedsFloorLimit: boolean; // base loan above the 2026 floor
  exceedsCeilingLimit: boolean;
  // What putting 10% down would change (the "drop MIP after 11 years" lever).
  tenDownMonthlyMIP: number;
  tenDownTotalMip: number;
  tenDownMipSaving: number;
  schedule: AmortRow[];
};

/** Annual MIP rate as a fraction for a base loan, LTV (0–100) and term. */
export function annualMipRate(baseLoan: number, ltv: number, termYears: number): number {
  const big = baseLoan > MIP_TIER_BREAK;
  if (termYears > 15) {
    if (big) return ltv > 95 ? 0.0075 : 0.007;
    return ltv > 95 ? 0.0055 : 0.005;
  }
  if (big) {
    if (ltv > 90) return 0.0065;
    if (ltv > 78) return 0.004;
    return 0.0015;
  }
  return ltv > 90 ? 0.004 : 0.0015;
}

/** Years annual MIP is charged: 11 if original LTV ≤ 90%, otherwise the full term. */
export function mipDurationYears(ltv: number, termYears: number): number {
  return ltv <= 90 ? Math.min(11, termYears) : termYears;
}

/**
 * Annual MIP total, recalculated each year on the average scheduled balance
 * of that year (how HUD computes it), for `years` years.
 */
function annualMipTotal(schedule: AmortRow[], loanAmount: number, rate: number, years: number) {
  let total = 0;
  let firstMonthly = 0;
  for (let y = 0; y < years; y++) {
    const rows = schedule.slice(y * 12, y * 12 + 12);
    if (rows.length === 0) break;
    // Balance at the start of each month of the year.
    let sum = 0;
    for (let i = 0; i < rows.length; i++) {
      const start = i === 0 ? (y === 0 ? loanAmount : schedule[y * 12 - 1].balance) : rows[i - 1].balance;
      sum += start;
    }
    const avg = sum / rows.length;
    const monthly = (avg * rate) / 12;
    if (y === 0) firstMonthly = monthly;
    total += monthly * rows.length;
  }
  return { total, firstMonthly };
}

function mipFor(baseLoan: number, homePrice: number, rate: number, termYears: number) {
  const ltv = homePrice > 0 ? (baseLoan / homePrice) * 100 : 0;
  const ufmip = baseLoan * UFMIP_RATE;
  const loanAmount = baseLoan + ufmip;
  const r = rate / 100 / 12;
  const n = Math.max(1, Math.round(termYears * 12));
  const pi = monthlyPayment(loanAmount, r, n);
  const am = amortizeSchedule(loanAmount, r, n, pi, 0);
  const mipRate = baseLoan > 0 ? annualMipRate(baseLoan, ltv, termYears) : 0;
  const years = mipDurationYears(ltv, termYears);
  const mip = annualMipTotal(am.schedule, loanAmount, mipRate, years);
  return { ltv, ufmip, loanAmount, pi, am, mipRate, years, mip };
}

export function computeFha(v: FhaInputs): FhaResults {
  const homePrice = Math.max(0, v.homePrice);
  const down = Math.min(Math.max(0, v.downPayment), homePrice);
  const baseLoan = Math.max(0, homePrice - down);
  const downPaymentPct = homePrice > 0 ? (down / homePrice) * 100 : 0;
  const termYears = Math.max(1, v.termYears);

  const m = mipFor(baseLoan, homePrice, v.rate, termYears);

  const minDownPct = v.creditBand === "500" ? 10 : 3.5;
  const minDownAmount = homePrice * (minDownPct / 100);

  const monthlyTax = Math.max(0, v.propTaxAnnual) / 12;
  const monthlyInsurance = Math.max(0, v.insuranceAnnual) / 12;
  const monthlyHOA = Math.max(0, v.hoaMonthly);
  const totalMonthly = m.pi + m.mip.firstMonthly + monthlyTax + monthlyInsurance + monthlyHOA;

  // 10%-down comparison (same price/rate/term).
  const ten = mipFor(homePrice * 0.9, homePrice, v.rate, termYears);

  return {
    baseLoan: round2(baseLoan),
    downPaymentPct: round2(downPaymentPct),
    ltv: round2(m.ltv),
    minDownPct,
    minDownAmount: round2(minDownAmount),
    meetsMinDown: downPaymentPct + 1e-9 >= minDownPct,
    ufmip: round2(m.ufmip),
    loanAmount: round2(m.loanAmount),
    annualMipRate: round2(m.mipRate * 100),
    mipYears: m.years,
    mipForLife: m.years >= termYears && m.ltv > 90,
    monthlyPI: round2(m.pi),
    monthlyMIP: round2(m.mip.firstMonthly),
    monthlyTax: round2(monthlyTax),
    monthlyInsurance: round2(monthlyInsurance),
    monthlyHOA: round2(monthlyHOA),
    totalMonthly: round2(totalMonthly),
    totalInterest: round2(m.am.totalInterest),
    totalMip: round2(m.mip.total),
    totalMipAll: round2(m.mip.total + m.ufmip),
    totalCost: round2(m.loanAmount + m.am.totalInterest + m.mip.total),
    exceedsFloorLimit: baseLoan > FHA_FLOOR_LIMIT_2026,
    exceedsCeilingLimit: baseLoan > FHA_CEILING_LIMIT_2026,
    tenDownMonthlyMIP: round2(ten.mip.firstMonthly),
    tenDownTotalMip: round2(ten.mip.total + ten.ufmip),
    tenDownMipSaving: round2(m.mip.total + m.ufmip - (ten.mip.total + ten.ufmip)),
    schedule: m.am.schedule,
  };
}
