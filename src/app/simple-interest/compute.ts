// PURE compute for the Simple Interest Calculator. See BUILD-STANDARD §2.
// I = P × r × t, with a side-by-side against annual and monthly compounding.

import { round2 } from "../../lib/calculator/finance.ts";

export type SimpleInterestInputs = {
  principal: number;
  rate: number; // annual %
  years: number;
};

export type SimpleInterestResults = {
  interest: number;
  total: number;
  interestPerYear: number;
  compoundAnnualTotal: number;
  compoundMonthlyTotal: number;
  compoundingExtra: number; // monthly compound − simple
  rows: { year: string; simple: number; compound: number }[];
};

export function computeSimpleInterest(v: SimpleInterestInputs): SimpleInterestResults {
  const P = Math.max(0, v.principal);
  const r = Math.max(0, v.rate) / 100;
  const t = Math.max(0, v.years);
  const interest = P * r * t;
  const ca = P * Math.pow(1 + r, t);
  const cm = P * Math.pow(1 + r / 12, 12 * t);

  const rows: { year: string; simple: number; compound: number }[] = [];
  const whole = Math.floor(t);
  const step = Math.max(1, Math.ceil(whole / 15));
  for (let y = step; y <= whole; y += step) rows.push({ year: `Year ${y}`, simple: round2(P * (1 + r * y)), compound: round2(P * Math.pow(1 + r / 12, 12 * y)) });
  if (t > 0 && (rows.length === 0 || t !== whole || whole % step !== 0))
    rows.push({ year: `Year ${round2(t)}`, simple: round2(P + interest), compound: round2(cm) });

  return {
    interest: round2(interest),
    total: round2(P + interest),
    interestPerYear: round2(P * r),
    compoundAnnualTotal: round2(ca),
    compoundMonthlyTotal: round2(cm),
    compoundingExtra: round2(cm - (P + interest)),
    rows,
  };
}
