// PURE compute for the Calorie Deficit Calculator. See BUILD-STANDARD §2.
// TDEE from Mifflin-St Jeor × activity factor (same formula as /tdee), then a
// daily target for a chosen weekly loss rate (≈3,500 kcal per lb). Targets are
// never set below common minimums (1,200 kcal women / 1,500 kcal men), and the
// weekly rate is capped at 1% of body weight.

import { round2 } from "../../lib/calculator/finance.ts";

export type CalorieDeficitInputs = {
  sex: "male" | "female";
  age: number;
  heightIn: number; // total inches
  weightLb: number;
  activity: "sedentary" | "light" | "moderate" | "active" | "very";
  goalWeightLb: number;
  lbsPerWeek: "0.5" | "1" | "1.5" | "2"; // desired loss rate (select value)
};

export type CalorieDeficitResults = {
  bmr: number;
  tdee: number;
  dailyDeficit: number; // actual deficit after floors/caps
  targetCalories: number;
  effectiveLbsPerWeek: number;
  rateCapped: boolean; // requested rate above 1% of body weight per week
  hitFloor: boolean; // target raised to the minimum
  calorieFloor: number;
  lbsToLose: number;
  weeksToGoal: number; // 0 if already at/below goal
  bmiNow: number;
  bmiGoal: number;
  goalBelowHealthyBmi: boolean;
  path: { x: string; y: number }[];
};

export const ACTIVITY: Record<CalorieDeficitInputs["activity"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
};

export function mifflinStJeor(sex: "male" | "female", kg: number, cm: number, age: number) {
  return 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
}

const bmi = (lb: number, inch: number) => (inch > 0 ? (703 * lb) / (inch * inch) : 0);

export function computeCalorieDeficit(v: CalorieDeficitInputs): CalorieDeficitResults {
  const lb = Math.max(0, v.weightLb);
  const inch = Math.max(0, v.heightIn);
  const kg = lb * 0.45359237;
  const cm = inch * 2.54;
  const age = Math.max(0, v.age);

  const bmr = lb > 0 && inch > 0 ? Math.max(0, mifflinStJeor(v.sex, kg, cm, age)) : 0;
  const tdee = bmr * (ACTIVITY[v.activity] ?? 1.2);

  const goal = Math.max(0, v.goalWeightLb);
  const lbsToLose = Math.max(0, lb - goal);
  const wantRate = lbsToLose > 0 ? Math.max(0, Number(v.lbsPerWeek) || 0) : 0;
  const maxRate = lb * 0.01;
  const rate = Math.min(wantRate, maxRate);

  const floor = v.sex === "male" ? 1500 : 1200;
  let deficit = (rate * 3500) / 7;
  let target = tdee - deficit;
  let hitFloor = false;
  if (tdee > 0 && target < floor && deficit > 0) {
    target = Math.min(tdee, floor);
    deficit = tdee - target;
    hitFloor = true;
  }
  const effRate = (deficit * 7) / 3500;
  const weeks = lbsToLose > 0 && effRate > 0 ? Math.ceil(lbsToLose / effRate) : 0;

  const path: { x: string; y: number }[] = [];
  if (weeks > 0) {
    const step = Math.max(1, Math.ceil(weeks / 30));
    for (let w = 0; w <= weeks; w += step) path.push({ x: `Wk ${w}`, y: round2(Math.max(goal, lb - effRate * w)) });
    if (path[path.length - 1].x !== `Wk ${weeks}`) path.push({ x: `Wk ${weeks}`, y: round2(goal) });
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyDeficit: Math.round(deficit),
    targetCalories: Math.round(target),
    effectiveLbsPerWeek: round2(effRate),
    rateCapped: wantRate > maxRate + 1e-9,
    hitFloor,
    calorieFloor: floor,
    lbsToLose: round2(lbsToLose),
    weeksToGoal: weeks,
    bmiNow: round2(bmi(lb, inch)),
    bmiGoal: round2(bmi(goal, inch)),
    goalBelowHealthyBmi: goal > 0 && inch > 0 && bmi(goal, inch) < 18.5,
    path,
  };
}
