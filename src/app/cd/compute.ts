// PURE compute for the CD Calculator. See BUILD-STANDARD §2.
// Banks quote CDs by APY, which already includes compounding, so the balance
// after t years is deposit × (1 + APY)^t regardless of compounding frequency.
// Also shows interest after federal income tax and versus inflation.

import { round2 } from "../../lib/calculator/finance.ts";

export type CdInputs = {
  deposit: number;
  apy: number; // %
  termMonths: number;
  taxRate: number; // marginal income tax %, CD interest is taxed as ordinary income
  inflation: number; // %
};

export type CdResults = {
  endingBalance: number;
  interestEarned: number;
  taxOnInterest: number;
  afterTaxInterest: number;
  afterTaxApy: number;
  realApy: number; // after tax and inflation
  monthlyEquivalent: number; // average interest per month
  rows: { month: string; balance: number }[];
};

export function computeCd(v: CdInputs): CdResults {
  const P = Math.max(0, v.deposit);
  const apy = Math.max(0, v.apy) / 100;
  const months = Math.min(600, Math.max(1, Math.round(Number(v.termMonths) || 0))); // ≤ 50 years
  const t = months / 12;
  const end = P * Math.pow(1 + apy, t);
  const interest = end - P;
  const tax = interest * (Math.max(0, v.taxRate) / 100);
  const afterTaxApy = apy * (1 - Math.max(0, v.taxRate) / 100);
  const real = ((1 + afterTaxApy) / (1 + v.inflation / 100) - 1) * 100;

  const rows: { month: string; balance: number }[] = [];
  const step = months <= 12 ? 3 : 12;
  for (let m = step; m < months; m += step) rows.push({ month: `Month ${m}`, balance: round2(P * Math.pow(1 + apy, m / 12)) });
  rows.push({ month: `Month ${months}`, balance: round2(end) });

  return {
    endingBalance: round2(end),
    interestEarned: round2(interest),
    taxOnInterest: round2(tax),
    afterTaxInterest: round2(interest - tax),
    afterTaxApy: round2(afterTaxApy * 100),
    realApy: round2(real),
    monthlyEquivalent: round2(interest / months),
    rows,
  };
}
