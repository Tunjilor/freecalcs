// PURE compute for the Investment Return (CAGR) Calculator. See BUILD-STANDARD §2.
// Total and annualized return from a start value, end value, holding period and
// optional regular contributions (money-weighted rate solved by bisection).

import { round2 } from "../../lib/calculator/finance.ts";

export type InvestmentReturnInputs = {
  startValue: number;
  endValue: number;
  years: number;
  monthlyContribution: number; // added each month (0 for a simple CAGR)
  inflation: number; // annual %, for the real return
};

export type InvestmentReturnResults = {
  totalContributed: number; // start + contributions
  gain: number;
  totalReturnPct: number; // gain ÷ total contributed
  annualizedReturn: number; // % per year (CAGR, or money-weighted with contributions)
  realAnnualizedReturn: number;
  doublingYears: number; // rule-of-72 style, exact: ln2 / ln(1+r)
  hasContributions: boolean;
  valid: boolean;
};

function fv(start: number, monthly: number, annualPct: number, months: number) {
  const r = Math.pow(1 + annualPct / 100, 1 / 12) - 1;
  if (Math.abs(r) < 1e-12) return start + monthly * months;
  const g = Math.pow(1 + r, months);
  return start * g + monthly * ((g - 1) / r);
}

export function computeInvestmentReturn(v: InvestmentReturnInputs): InvestmentReturnResults {
  const start = Math.max(0, v.startValue);
  const end = Math.max(0, v.endValue);
  const years = Math.max(0, v.years);
  const monthly = Math.max(0, v.monthlyContribution);
  const months = Math.round(years * 12);
  const contributed = start + monthly * months;
  const valid = years > 0 && contributed > 0;

  let annual = 0;
  if (valid) {
    if (monthly === 0) {
      annual = start > 0 ? (Math.pow(end / start, 1 / years) - 1) * 100 : 0;
    } else {
      let lo = -99;
      let hi = 1000;
      for (let i = 0; i < 200; i++) {
        const mid = (lo + hi) / 2;
        if (fv(start, monthly, mid, months) < end) lo = mid;
        else hi = mid;
      }
      annual = (lo + hi) / 2;
    }
  }
  const inf = v.inflation / 100;
  const real = valid ? ((1 + annual / 100) / (1 + inf) - 1) * 100 : 0;

  return {
    totalContributed: round2(contributed),
    gain: round2(end - contributed),
    totalReturnPct: contributed > 0 ? round2(((end - contributed) / contributed) * 100) : 0,
    annualizedReturn: round2(annual),
    realAnnualizedReturn: round2(real),
    doublingYears: annual > 0 ? round2(Math.log(2) / Math.log(1 + annual / 100)) : 0,
    hasContributions: monthly > 0,
    valid,
  };
}
