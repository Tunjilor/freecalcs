// PURE compute for the Savings Goal Calculator. Uses shared finance.ts helpers.
// Solves the inverse of a growth projection: given a target, timeframe, current
// savings, and return, find the monthly contribution required to get there.

import { futureValue, futureValueOfSeries, round2 } from "../../lib/calculator/finance.ts";

export type SavingsGoalInputs = {
  targetAmount: number;
  currentSavings: number;
  monthsToGoal: number;
  annualReturn: number; // %
};

export type SavingsGoalResults = {
  months: number;
  projectedFromCurrent: number; // FV of current savings alone
  neededFromContributions: number; // target − projectedFromCurrent (≥0)
  requiredMonthly: number; // monthly contribution to reach the target
  totalContributed: number; // requiredMonthly × months
  growthEarned: number; // target − currentSavings − totalContributed
  onTrack: boolean; // current savings alone already reaches the target
  surplus: number; // projectedFromCurrent − target (if on track)
  leverMonths: number; // +12-month lever
  requiredMonthlyExtended: number; // required monthly with 12 more months
  chart: { x: string; y: number }[];
};

export function computeSavingsGoal(v: SavingsGoalInputs): SavingsGoalResults {
  const target = Math.max(0, v.targetAmount);
  const current = Math.max(0, v.currentSavings);
  const months = Math.max(1, Math.round(v.monthsToGoal));
  const monthlyRate = v.annualReturn / 100 / 12;

  const projectedFromCurrent = futureValue(current, monthlyRate, months);
  const neededFromContributions = Math.max(0, target - projectedFromCurrent);
  const fvOfDollarSeries = futureValueOfSeries(1, monthlyRate, months);
  const onTrack = projectedFromCurrent >= target;
  const requiredMonthly =
    !onTrack && fvOfDollarSeries > 0 ? neededFromContributions / fvOfDollarSeries : 0;

  const totalContributed = requiredMonthly * months;
  const growthEarned = target - current - totalContributed;

  // +12-month lever: how much the required monthly falls with more time.
  const nExt = months + 12;
  const neededExt = Math.max(0, target - futureValue(current, monthlyRate, nExt));
  const fvExt = futureValueOfSeries(1, monthlyRate, nExt);
  const requiredMonthlyExtended = neededExt > 0 && fvExt > 0 ? neededExt / fvExt : 0;

  const chart: { x: string; y: number }[] = [];
  const step = Math.max(1, Math.round(months / 40));
  for (let m = 0; m <= months; m += step) {
    chart.push({
      x: `Mo ${m}`,
      y: round2(futureValue(current, monthlyRate, m) + futureValueOfSeries(requiredMonthly, monthlyRate, m)),
    });
  }

  return {
    months,
    projectedFromCurrent: round2(projectedFromCurrent),
    neededFromContributions: round2(neededFromContributions),
    requiredMonthly: round2(requiredMonthly),
    totalContributed: round2(totalContributed),
    growthEarned: round2(growthEarned),
    onTrack,
    surplus: round2(Math.max(0, projectedFromCurrent - target)),
    leverMonths: 12,
    requiredMonthlyExtended: round2(requiredMonthlyExtended),
    chart,
  };
}
