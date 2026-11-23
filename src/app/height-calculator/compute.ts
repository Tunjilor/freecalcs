// PURE compute for the (child's adult) Height Calculator. See BUILD-STANDARD §2.
// Mid-parental height (Tanner, 1970): average the parents' heights, then add
// 2.5 in (6.5 cm) for a boy or subtract 2.5 in for a girl. About 95% of
// children end up within ±3.5 in (≈ ±8.5 cm) of that target. Optional second
// estimate: double a boy's height at age 2, or a girl's at 18 months.

export type HeightInputs = {
  sex: "boy" | "girl";
  fatherIn: number;
  motherIn: number;
  earlyHeightIn: number; // height at 2 (boys) / 18 months (girls); 0 = skip
};

export type HeightResults = {
  valid: boolean;
  predictedIn: number;
  predictedLabel: string; // "5 ft 10 in (178 cm)"
  rangeLabel: string;
  lowIn: number;
  highIn: number;
  doublingIn: number;
  doublingLabel: string;
  estimatesAgree: boolean;
  averageLabel: string; // average of both estimates
};

export const RANGE_IN = 3.5;
const CM = 2.54;

export function ftIn(inches: number, withCm = true): string {
  if (!(inches > 0)) return "—";
  const total = Math.round(inches);
  const ft = Math.floor(total / 12), inch = total % 12;
  return `${ft} ft ${inch} in${withCm ? ` (${Math.round(inches * CM)} cm)` : ""}`;
}

export function computeHeight(v: HeightInputs): HeightResults {
  const f = Math.min(100, Math.max(0, Number(v.fatherIn) || 0));
  const m = Math.min(100, Math.max(0, Number(v.motherIn) || 0));
  const early = Math.min(60, Math.max(0, Number(v.earlyHeightIn) || 0));
  const valid = f >= 48 && m >= 48;
  const mid = valid ? (f + m) / 2 + (v.sex === "boy" ? 2.5 : -2.5) : 0;
  const doubling = early > 0 ? early * 2 : 0;
  const both = valid && doubling > 0;
  return {
    valid,
    predictedIn: Math.round(mid * 10) / 10,
    predictedLabel: valid ? ftIn(mid) : "—",
    rangeLabel: valid ? `${ftIn(mid - RANGE_IN, false)} to ${ftIn(mid + RANGE_IN, false)}` : "—",
    lowIn: valid ? Math.round((mid - RANGE_IN) * 10) / 10 : 0,
    highIn: valid ? Math.round((mid + RANGE_IN) * 10) / 10 : 0,
    doublingIn: Math.round(doubling * 10) / 10,
    doublingLabel: doubling > 0 ? ftIn(doubling) : "—",
    estimatesAgree: both && Math.abs(doubling - mid) <= RANGE_IN,
    averageLabel: both ? ftIn((mid + doubling) / 2) : "—",
  };
}
