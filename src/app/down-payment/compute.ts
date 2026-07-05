// PURE compute for the Down Payment Calculator. Uses shared finance.ts round2.
// Plans a down payment toward a target percent, the PMI-avoiding 20% threshold,
// and the monthly savings needed to reach the goal by a target date.

import { round2 } from "../../lib/calculator/finance.ts";

export type DownPaymentInputs = {
  homePrice: number;
  targetPercent: number; // % of home price
  currentSavings: number; // saved so far toward the down payment
  monthsToGoal: number; // timeframe to save the rest
};

export type DownPaymentResults = {
  targetDownPayment: number;
  twentyPercentDown: number;
  avoidsPmi: boolean; // target ≥ 20%
  loanAmount: number; // price − target down
  pmiMonthly: number; // estimated PMI if target < 20%
  gapToTarget: number; // target − current savings (≥0)
  monthlySavingsNeeded: number; // gap / months
  gapTo20: number; // 20% − current savings (≥0)
  monthlyToReach20: number;
  progressPct: number; // current / target (0–100)
  savingsPath: { x: string; y: number }[]; // savings growth to the goal
};

export function computeDownPayment(v: DownPaymentInputs): DownPaymentResults {
  const homePrice = Math.max(0, v.homePrice);
  const targetPct = Math.max(0, v.targetPercent);
  const currentSavings = Math.max(0, v.currentSavings);
  const months = Math.max(1, Math.round(v.monthsToGoal));

  const targetDownPayment = homePrice * (targetPct / 100);
  const twentyPercentDown = homePrice * 0.2;
  const avoidsPmi = targetPct >= 20;
  const loanAmount = Math.max(0, homePrice - targetDownPayment);
  const pmiMonthly = avoidsPmi ? 0 : round2((loanAmount * 0.005) / 12);

  const gapToTarget = Math.max(0, targetDownPayment - currentSavings);
  const gapTo20 = Math.max(0, twentyPercentDown - currentSavings);
  const monthlySavingsNeeded = round2(gapToTarget / months);

  // Savings path toward the target down payment.
  const savingsPath: { x: string; y: number }[] = [];
  const step = Math.max(1, Math.round(months / 36));
  for (let m = 0; m <= months; m += step) {
    savingsPath.push({
      x: `Mo ${m}`,
      y: round2(Math.min(currentSavings + monthlySavingsNeeded * m, targetDownPayment)),
    });
  }

  return {
    targetDownPayment: round2(targetDownPayment),
    twentyPercentDown: round2(twentyPercentDown),
    avoidsPmi,
    loanAmount: round2(loanAmount),
    pmiMonthly,
    gapToTarget: round2(gapToTarget),
    monthlySavingsNeeded,
    gapTo20: round2(gapTo20),
    monthlyToReach20: round2(gapTo20 / months),
    progressPct: targetDownPayment > 0 ? round2((currentSavings / targetDownPayment) * 100) : 0,
    savingsPath,
  };
}
