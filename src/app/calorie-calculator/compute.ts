// PURE compute for the Calorie Calculator. See BUILD-STANDARD §2.
// Maintenance calories = Mifflin-St Jeor BMR × activity factor (same formula
// and factors as /calorie-deficit and /tdee). Goal targets use the common
// 3,500 kcal ≈ 1 lb rule: ±250/day ≈ ½ lb a week, ±500 ≈ 1 lb, −1,000 ≈ 2 lb.
// Targets never go below a safety floor (1,200 women / 1,500 men).

import { ACTIVITY, mifflinStJeor } from "../calorie-deficit/compute.ts";

export type CalorieInputs = {
  sex: "female" | "male";
  age: number;
  heightIn: number;
  weightLb: number;
  activity: "sedentary" | "light" | "moderate" | "active" | "very";
};

export type CalorieResults = {
  valid: boolean;
  bmr: number;
  maintenance: number;
  mildLoss: number;
  loss: number;
  extremeLoss: number;
  mildGain: number;
  gain: number;
  floor: number;
  extremeBelowFloor: boolean;
  rows: { goal: string; perWeek: string; calories: number; pctOfMaintenance: string }[];
};

const r10 = (n: number) => Math.round(n / 10) * 10;

export function computeCalories(v: CalorieInputs): CalorieResults {
  const lb = Math.min(1000, Math.max(0, Number(v.weightLb) || 0));
  const inch = Math.min(108, Math.max(0, Number(v.heightIn) || 0));
  const age = Math.min(120, Math.max(0, Number(v.age) || 0));
  const valid = lb > 0 && inch > 0 && age > 0;
  const bmr = valid ? Math.max(0, mifflinStJeor(v.sex, lb * 0.45359237, inch * 2.54, age)) : 0;
  const m = bmr * (ACTIVITY[v.activity] ?? 1.2);
  const floor = v.sex === "male" ? 1500 : 1200;
  const target = (delta: number) => (valid ? r10(Math.max(delta < 0 ? floor : 0, m + delta)) : 0);
  const goals: [string, string, number][] = [
    ["Maintain weight", "0 lb", 0],
    ["Mild weight loss", "−½ lb", -250],
    ["Weight loss", "−1 lb", -500],
    ["Extreme weight loss", "−2 lb", -1000],
    ["Mild weight gain", "+½ lb", 250],
    ["Weight gain", "+1 lb", 500],
  ];
  return {
    valid,
    bmr: valid ? r10(bmr) : 0,
    maintenance: valid ? r10(m) : 0,
    mildLoss: target(-250),
    loss: target(-500),
    extremeLoss: target(-1000),
    mildGain: target(250),
    gain: target(500),
    floor,
    extremeBelowFloor: valid && m - 1000 < floor,
    rows: goals.map(([goal, perWeek, d]) => {
      const c = target(d);
      return { goal, perWeek, calories: c, pctOfMaintenance: valid && m > 0 ? `${Math.round((c / m) * 100)}%` : "—" };
    }),
  };
}
