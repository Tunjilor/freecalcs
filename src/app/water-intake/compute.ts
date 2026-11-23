// PURE compute for the Water Intake Calculator. See BUILD-STANDARD §2.
// Reference: National Academies adequate intake of TOTAL water (food + drinks)
// is about 3.7 L/day for men and 2.7 L/day for women; roughly 80% comes from
// drinks (≈3.0 L and ≈2.2 L). Adds ~12 oz (355 ml) per 30 min of exercise and
// ~16 oz in hot weather. Also shows the popular "half your body weight in
// ounces" rule of thumb for comparison.

import { round2 } from "../../lib/calculator/finance.ts";

export type WaterIntakeInputs = {
  sex: "male" | "female";
  weightLb: number;
  exerciseMin: number; // per day
  hotClimate: "yes" | "no";
};

export type WaterIntakeResults = {
  drinkOz: number;
  drinkLiters: number;
  cups: number; // 8-oz cups
  totalWaterLiters: number; // NAM total (food + drinks) baseline
  halfWeightOz: number;
  exerciseOz: number;
};

const OZ_PER_L = 33.814;

export function computeWaterIntake(v: WaterIntakeInputs): WaterIntakeResults {
  const baseL = v.sex === "male" ? 3.0 : 2.2;
  const exOz = (Math.max(0, v.exerciseMin) / 30) * 12;
  const hotOz = v.hotClimate === "yes" ? 16 : 0;
  const oz = baseL * OZ_PER_L + exOz + hotOz;
  return {
    drinkOz: Math.round(oz),
    drinkLiters: round2(oz / OZ_PER_L),
    cups: round2(oz / 8),
    totalWaterLiters: v.sex === "male" ? 3.7 : 2.7,
    halfWeightOz: Math.round(Math.max(0, v.weightLb) / 2),
    exerciseOz: Math.round(exOz),
  };
}
