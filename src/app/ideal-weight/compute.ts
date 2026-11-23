// PURE compute for the Ideal Weight Calculator. See BUILD-STANDARD §2.
// Four published formulas (kg, height in inches over 5 ft):
//   Devine (1974):   men 50 + 2.3/in   women 45.5 + 2.3/in
//   Robinson (1983): men 52 + 1.9/in   women 49 + 1.7/in
//   Miller (1983):   men 56.2 + 1.41/in women 53.1 + 1.36/in
//   Hamwi (1964):    men 48 + 2.7/in   women 45.5 + 2.2/in
// plus the weight range for a healthy BMI (18.5–24.9).

import { round2 } from "../../lib/calculator/finance.ts";

export type IdealWeightInputs = { sex: "male" | "female"; heightIn: number; weightLb: number };

export type IdealWeightResults = {
  devine: number;
  robinson: number;
  miller: number;
  hamwi: number;
  average: number;
  bmiLow: number; // lb at BMI 18.5
  bmiHigh: number; // lb at BMI 24.9
  currentBmi: number;
  inHealthyRange: boolean;
  rows: { formula: string; lb: number }[];
};

const KG_TO_LB = 2.20462262;
const F = {
  male: { devine: [50, 2.3], robinson: [52, 1.9], miller: [56.2, 1.41], hamwi: [48, 2.7] },
  female: { devine: [45.5, 2.3], robinson: [49, 1.7], miller: [53.1, 1.36], hamwi: [45.5, 2.2] },
} as const;

export function computeIdealWeight(v: IdealWeightInputs): IdealWeightResults {
  const h = Math.max(0, v.heightIn);
  const over = h - 60;
  const f = F[v.sex] ?? F.female;
  const calc = ([base, per]: readonly [number, number]) => (h > 0 ? Math.max(0, (base + per * over) * KG_TO_LB) : 0);
  const devine = calc(f.devine), robinson = calc(f.robinson), miller = calc(f.miller), hamwi = calc(f.hamwi);
  const avg = (devine + robinson + miller + hamwi) / 4;
  const lbAt = (bmi: number) => (h > 0 ? (bmi * h * h) / 703 : 0);
  const w = Math.max(0, v.weightLb);
  const bmi = h > 0 ? (703 * w) / (h * h) : 0;
  return {
    devine: round2(devine),
    robinson: round2(robinson),
    miller: round2(miller),
    hamwi: round2(hamwi),
    average: round2(avg),
    bmiLow: round2(lbAt(18.5)),
    bmiHigh: round2(lbAt(24.9)),
    currentBmi: round2(bmi),
    inHealthyRange: w > 0 && bmi >= 18.5 && bmi < 25,
    rows: [
      { formula: "Devine (1974)", lb: round2(devine) },
      { formula: "Robinson (1983)", lb: round2(robinson) },
      { formula: "Miller (1983)", lb: round2(miller) },
      { formula: "Hamwi (1964)", lb: round2(hamwi) },
    ],
  };
}
