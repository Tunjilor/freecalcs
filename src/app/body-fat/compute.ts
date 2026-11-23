// PURE compute for the Body Fat Calculator (U.S. Navy method). BUILD-STANDARD §2.
// Hodgdon & Beckett (Naval Health Research Center) circumference equations,
// inches:
//   men:   %BF = 86.010·log10(waist − neck) − 70.041·log10(height) + 36.76
//   women: %BF = 163.205·log10(waist + hip − neck) − 97.684·log10(height) − 78.387
// Categories: American Council on Exercise (ACE).

import { round2 } from "../../lib/calculator/finance.ts";

export type BodyFatInputs = {
  sex: "male" | "female";
  heightIn: number;
  weightLb: number;
  neckIn: number;
  waistIn: number; // men: at navel; women: at narrowest point
  hipIn: number; // women only
};

export type BodyFatResults = {
  bodyFatPct: number;
  category: string;
  fatMassLb: number;
  leanMassLb: number;
  valid: boolean;
  rows: { category: string; range: string }[];
};

const ACE = {
  male: [
    { max: 6, label: "Essential fat", range: "2–5%" },
    { max: 14, label: "Athletes", range: "6–13%" },
    { max: 18, label: "Fitness", range: "14–17%" },
    { max: 25, label: "Average", range: "18–24%" },
    { max: Infinity, label: "Obese", range: "25%+" },
  ],
  female: [
    { max: 14, label: "Essential fat", range: "10–13%" },
    { max: 21, label: "Athletes", range: "14–20%" },
    { max: 25, label: "Fitness", range: "21–24%" },
    { max: 32, label: "Average", range: "25–31%" },
    { max: Infinity, label: "Obese", range: "32%+" },
  ],
};

export function navyBodyFat(v: BodyFatInputs): number | null {
  const h = v.heightIn;
  if (h <= 0 || v.neckIn <= 0 || v.waistIn <= 0) return null;
  if (v.sex === "male") {
    const d = v.waistIn - v.neckIn;
    if (d <= 0) return null;
    return 86.01 * Math.log10(d) - 70.041 * Math.log10(h) + 36.76;
  }
  const d = v.waistIn + v.hipIn - v.neckIn;
  if (v.hipIn <= 0 || d <= 0) return null;
  return 163.205 * Math.log10(d) - 97.684 * Math.log10(h) - 78.387;
}

export function computeBodyFat(v: BodyFatInputs): BodyFatResults {
  const raw = navyBodyFat(v);
  const valid = raw !== null && Number.isFinite(raw) && raw > 0 && raw < 75;
  const pct = valid ? (raw as number) : 0;
  const table = ACE[v.sex];
  const category = valid ? table.find((c) => pct < c.max)!.label : "—";
  const w = Math.max(0, v.weightLb);
  return {
    bodyFatPct: round2(pct),
    category,
    fatMassLb: round2((w * pct) / 100),
    leanMassLb: round2(w - (w * pct) / 100),
    valid,
    rows: table.map((c) => ({ category: c.label, range: c.range })),
  };
}
