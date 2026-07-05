// PURE compute for the Retirement Savings Calculator. Uses shared finance.ts
// time-value helpers — no local growth math. Projects a balance at retirement,
// its inflation-adjusted ("real") value, and whether it hits a target.

import {
  futureValue,
  futureValueOfSeries,
  round2,
} from "../../lib/calculator/finance.ts";

export type RetirementInputs = {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  employerMatchMonthly: number; // employer's monthly contribution
  annualReturn: number; // %
  inflationRate: number; // %
  targetBalance: number; // 0 = no target
};

export type RetirementResults = {
  years: number;
  projectedBalance: number; // nominal, at retirement
  realBalance: number; // in today's dollars
  totalContributions: number; // your + employer contributions (not grown)
  employerContributions: number; // total employer dollars put in (not grown)
  employerMatchGrown: number; // future value attributable to the match
  investmentGrowth: number; // projectedBalance − all contributions − start
  onTrack: boolean;
  gap: number; // target − projected (positive = short)
  requiredMonthly: number; // total monthly needed to hit target (0 if none/on track)
  leverExtra: number; // +$100/mo lever
  leverAddedBalance: number; // extra balance from +$100/mo
  chart: { x: string; y: number }[]; // nominal balance by year
};

export function computeRetirement(v: RetirementInputs): RetirementResults {
  const years = Math.max(0, Math.round(v.retirementAge) - Math.round(v.currentAge));
  const months = years * 12;
  const monthlyRate = v.annualReturn / 100 / 12;
  const start = Math.max(0, v.currentSavings);
  const personal = Math.max(0, v.monthlyContribution);
  const match = Math.max(0, v.employerMatchMonthly);
  const totalMonthly = personal + match;

  const projectedBalance = futureValue(start, monthlyRate, months) + futureValueOfSeries(totalMonthly, monthlyRate, months);
  // Inflation-adjusted value in today's dollars: (years=0 → unchanged).
  const realBalance = projectedBalance / Math.pow(1 + v.inflationRate / 100, years);

  const totalContributions = totalMonthly * months;
  const employerContributions = match * months;
  const employerMatchGrown = futureValueOfSeries(match, monthlyRate, months);
  const investmentGrowth = projectedBalance - start - totalContributions;

  const target = Math.max(0, v.targetBalance);
  const onTrack = target === 0 ? true : projectedBalance >= target;
  const gap = target > 0 ? round2(target - projectedBalance) : 0;

  // Total monthly contribution required to reach the target.
  const fvOfDollarSeries = futureValueOfSeries(1, monthlyRate, months);
  const neededFromContributions = target > 0 ? target - futureValue(start, monthlyRate, months) : 0;
  const requiredMonthly =
    target > 0 && !onTrack && fvOfDollarSeries > 0 ? round2(neededFromContributions / fvOfDollarSeries) : 0;

  const LEVER = 100;
  const leverAddedBalance = futureValueOfSeries(LEVER, monthlyRate, months);

  const chart: { x: string; y: number }[] = [];
  for (let y = 0; y <= years; y++) {
    const m = y * 12;
    chart.push({
      x: `Age ${Math.round(v.currentAge) + y}`,
      y: round2(futureValue(start, monthlyRate, m) + futureValueOfSeries(totalMonthly, monthlyRate, m)),
    });
  }

  return {
    years,
    projectedBalance: round2(projectedBalance),
    realBalance: round2(realBalance),
    totalContributions: round2(totalContributions),
    employerContributions: round2(employerContributions),
    employerMatchGrown: round2(employerMatchGrown),
    investmentGrowth: round2(investmentGrowth),
    onTrack,
    gap,
    requiredMonthly,
    leverExtra: LEVER,
    leverAddedBalance: round2(leverAddedBalance),
    chart,
  };
}
