// PURE compute for the Macro Calculator. See BUILD-STANDARD §2.
// Calories from Mifflin-St Jeor × activity (shared with /calorie-deficit), a
// goal adjustment (−500 lose / 0 maintain / +300 gain, never below the
// 1,200 / 1,500 kcal minimums), then a macro split:
//   protein & carbs = 4 kcal/g, fat = 9 kcal/g.

import { round2 } from "../../lib/calculator/finance.ts";
import { ACTIVITY, mifflinStJeor } from "../calorie-deficit/compute.ts";

export type MacroInputs = {
  sex: "male" | "female";
  age: number;
  heightIn: number;
  weightLb: number;
  activity: "sedentary" | "light" | "moderate" | "active" | "very";
  goal: "lose" | "maintain" | "gain";
  diet: "balanced" | "high-protein" | "low-carb";
};

export const SPLITS: Record<MacroInputs["diet"], { p: number; c: number; f: number; label: string }> = {
  balanced: { p: 30, c: 40, f: 30, label: "Balanced (30/40/30)" },
  "high-protein": { p: 40, c: 30, f: 30, label: "High protein (40/30/30)" },
  "low-carb": { p: 35, c: 25, f: 40, label: "Lower carb (35/25/40)" },
};

export type MacroResults = {
  tdee: number;
  calories: number;
  hitFloor: boolean;
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPerLb: number;
  rows: { macro: string; grams: number; calories: number; pct: number }[];
};

export function computeMacro(v: MacroInputs): MacroResults {
  const lb = Math.max(0, v.weightLb);
  const inch = Math.max(0, v.heightIn);
  const bmr = lb > 0 && inch > 0 ? Math.max(0, mifflinStJeor(v.sex, lb * 0.45359237, inch * 2.54, Math.max(0, v.age))) : 0;
  const tdee = bmr * (ACTIVITY[v.activity] ?? 1.2);
  const adj = v.goal === "lose" ? -500 : v.goal === "gain" ? 300 : 0;
  const floor = v.sex === "male" ? 1500 : 1200;
  let cal = tdee + adj;
  let hitFloor = false;
  if (tdee > 0 && v.goal === "lose" && cal < floor) {
    cal = Math.min(tdee, floor);
    hitFloor = true;
  }
  cal = Math.max(0, cal);
  const s = SPLITS[v.diet] ?? SPLITS.balanced;
  const p = (cal * s.p) / 100 / 4;
  const c = (cal * s.c) / 100 / 4;
  const f = (cal * s.f) / 100 / 9;
  return {
    tdee: Math.round(tdee),
    calories: Math.round(cal),
    hitFloor,
    proteinG: Math.round(p),
    carbsG: Math.round(c),
    fatG: Math.round(f),
    proteinPerLb: lb > 0 ? round2(p / lb) : 0,
    rows: [
      { macro: "Protein", grams: Math.round(p), calories: Math.round(p * 4), pct: s.p },
      { macro: "Carbohydrates", grams: Math.round(c), calories: Math.round(c * 4), pct: s.c },
      { macro: "Fat", grams: Math.round(f), calories: Math.round(f * 9), pct: s.f },
    ],
  };
}
