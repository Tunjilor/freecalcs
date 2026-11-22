// PURE compute for the Emergency Fund Calculator. See BUILD-STANDARD §2.
// Sizes the fund from essential monthly expenses and income stability, then
// projects how long it takes to fill at a monthly contribution plus savings
// interest (compounded monthly).

import { round2 } from "../../lib/calculator/finance.ts";
import { months as fmtMonths } from "../../lib/calculator/format.ts";

export type EmergencyFundInputs = {
  housing: number; // rent/mortgage
  utilities: number;
  food: number; // groceries, not dining out
  transportation: number;
  insurance: number; // health, auto, etc. not deducted from pay
  debtMinimums: number;
  otherEssentials: number; // childcare, medication, phone
  incomeType: "dual" | "single" | "variable";
  currentSavings: number;
  monthlyContribution: number;
  apy: number; // savings account APY %
};

export type EmergencyFundResults = {
  monthlyEssentials: number;
  targetMonths: number;
  targetFund: number;
  starterFund: number; // one month of essentials, minimum $1,000
  monthsCovered: number; // current savings ÷ essentials
  gap: number;
  progressPct: number;
  monthsToGoal: number; // −1 if never reached within 50 years
  coverageLabel: string; // e.g. "1.5 months"
  goalLabel: string; // e.g. "2 yr 4 mo", "Already there"
  starterReached: boolean;
  monthsToStarter: number;
  interestEarned: number; // interest earned while saving to the goal
  minTargetFund: number; // 3 months
  maxTargetFund: number; // 6 months
  path: { x: string; y: number }[];
};

export function targetMonthsFor(type: EmergencyFundInputs["incomeType"]): number {
  if (type === "dual") return 3;
  if (type === "variable") return 9;
  return 6;
}

function monthsToReach(start: number, goal: number, add: number, r: number, cap = 600) {
  let bal = start;
  let interest = 0;
  if (bal >= goal) return { months: 0, interest: 0 };
  for (let m = 1; m <= cap; m++) {
    const i = bal * r;
    interest += i;
    bal += i + add;
    if (bal >= goal) return { months: m, interest };
  }
  return { months: -1, interest };
}

export function computeEmergencyFund(v: EmergencyFundInputs): EmergencyFundResults {
  const essentials = [
    v.housing,
    v.utilities,
    v.food,
    v.transportation,
    v.insurance,
    v.debtMinimums,
    v.otherEssentials,
  ].reduce((s, x) => s + Math.max(0, x), 0);

  const targetMonths = targetMonthsFor(v.incomeType);
  const targetFund = essentials * targetMonths;
  const starterFund = Math.max(1000, essentials);
  const saved = Math.max(0, v.currentSavings);
  const add = Math.max(0, v.monthlyContribution);
  const r = Math.max(0, v.apy) / 100 / 12;

  const goal = monthsToReach(saved, targetFund, add, r);
  const starter = monthsToReach(saved, starterFund, add, r);

  // Path to goal (or 5 years if never reached), roughly 36 points.
  const horizon = goal.months > 0 ? goal.months : goal.months === 0 ? 0 : 60;
  const step = Math.max(1, Math.ceil(horizon / 36));
  const path: { x: string; y: number }[] = [{ x: "Mo 0", y: round2(saved) }];
  let bal = saved;
  for (let m = 1; m <= horizon; m++) {
    bal += bal * r + add;
    if (m % step === 0 || m === horizon) path.push({ x: `Mo ${m}`, y: round2(Math.min(bal, targetFund || bal)) });
  }

  return {
    monthlyEssentials: round2(essentials),
    targetMonths,
    targetFund: round2(targetFund),
    starterFund: round2(starterFund),
    monthsCovered: essentials > 0 ? round2(saved / essentials) : 0,
    gap: round2(Math.max(0, targetFund - saved)),
    progressPct: targetFund > 0 ? round2(Math.min(100, (saved / targetFund) * 100)) : 0,
    monthsToGoal: goal.months,
    coverageLabel: essentials > 0 ? `${(saved / essentials).toFixed(1)} months` : "—",
    goalLabel:
      goal.months === 0 ? "Already there" : goal.months < 0 ? "Not at this pace" : fmtMonths(goal.months),
    starterReached: saved >= starterFund,
    monthsToStarter: starter.months,
    interestEarned: round2(goal.interest),
    minTargetFund: round2(essentials * 3),
    maxTargetFund: round2(essentials * 6),
    path,
  };
}
