// PURE compute for the Final Grade Calculator. See BUILD-STANDARD §2.
// Required final exam score = (desired − current × (1 − w)) ÷ w, w = final's weight.

import { round2 } from "../../lib/calculator/finance.ts";

export type FinalGradeInputs = {
  currentGrade: number; // %
  finalWeight: number; // % of the course grade
  desiredGrade: number; // %
};

export type FinalGradeResults = {
  requiredScore: number; // %
  requiredLabel: string; // "96.0%", "Not reachable", "Already secured" or "—"
  possible: boolean; // required ≤ 100
  alreadySecured: boolean; // required ≤ 0
  gradeIfZero: number;
  gradeIfPerfect: number;
  rows: { target: string; needed: number; neededLabel: string }[];
};

export function requiredFor(current: number, w: number, desired: number) {
  return w > 0 ? (desired - current * (1 - w)) / w : Infinity;
}

/** Required score in words when it's outside 0–100%. */
export function neededLabel(req: number): string {
  if (!Number.isFinite(req)) return "—";
  if (req > 100) return "Not reachable";
  if (req <= 0) return "Already secured";
  return `${round2(req).toFixed(1)}%`;
}

export function computeFinalGrade(v: FinalGradeInputs): FinalGradeResults {
  const c = Math.max(0, v.currentGrade);
  const w = Math.min(100, Math.max(0, v.finalWeight)) / 100;
  const req = requiredFor(c, w, Math.max(0, v.desiredGrade));
  const finite = Number.isFinite(req);
  return {
    requiredScore: finite ? round2(req) : 0,
    requiredLabel: neededLabel(req),
    possible: finite && req <= 100,
    alreadySecured: finite && req <= 0,
    gradeIfZero: round2(c * (1 - w)),
    gradeIfPerfect: round2(c * (1 - w) + 100 * w),
    rows: [
      ["A (90%)", 90],
      ["B (80%)", 80],
      ["C (70%)", 70],
      ["D (60%)", 60],
    ].map(([t, g]) => {
      const n = requiredFor(c, w, g as number);
      return { target: t as string, needed: Number.isFinite(n) ? round2(n) : 0, neededLabel: neededLabel(n) };
    }),
  };
}
