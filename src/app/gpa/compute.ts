// PURE compute for the GPA Calculator. See BUILD-STANDARD §2.
// Standard U.S. 4.0 scale with +/− grades. GPA = Σ(points × credits) ÷ Σ credits.
// Rows with zero credits are ignored. Optional prior GPA + credits for a
// cumulative figure.

import { round2 } from "../../lib/calculator/finance.ts";
import type { RowValue } from "../../lib/calculator/types.ts";

export const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, "D-": 0.7, F: 0,
};

export type GpaInputs = { courses: RowValue[]; priorGpa: number; priorCredits: number };

export type GpaResults = {
  termGpa: number;
  termGpaLabel: string; // "3.50"
  cumulativeGpaLabel: string;
  termCredits: number;
  qualityPoints: number;
  cumulativeGpa: number;
  totalCredits: number;
  hasPrior: boolean;
  priorCapped: boolean; // previous GPA entered above 4.0 and treated as 4.0
  courseCount: number;
  rows: { course: string; credits: number; grade: string; points: number }[];
};

export function computeGpa(v: GpaInputs): GpaResults {
  const rows = (v.courses ?? [])
    .map((r, i) => ({
      course: String(r.course ?? "").trim() || `Course ${i + 1}`,
      credits: Math.max(0, Number(r.credits) || 0),
      grade: String(r.grade ?? ""),
    }))
    .filter((r) => r.credits > 0 && r.grade in GRADE_POINTS)
    .map((r) => ({ ...r, points: round2(GRADE_POINTS[r.grade] * r.credits) }));
  const credits = rows.reduce((a, r) => a + r.credits, 0);
  const qp = rows.reduce((a, r) => a + GRADE_POINTS[r.grade] * r.credits, 0);
  const pc = Math.max(0, v.priorCredits);
  const pg = Math.min(4.0, Math.max(0, v.priorGpa));
  const hasPrior = pc > 0;
  const total = credits + pc;
  const term = credits > 0 ? round2(qp / credits) : 0;
  const cum = total > 0 ? round2((qp + pg * pc) / total) : 0;
  return {
    termGpa: term,
    termGpaLabel: credits > 0 ? term.toFixed(2) : "—",
    cumulativeGpaLabel: total > 0 ? cum.toFixed(2) : "—",
    termCredits: credits,
    qualityPoints: round2(qp),
    cumulativeGpa: cum,
    totalCredits: total,
    hasPrior,
    priorCapped: hasPrior && v.priorGpa > 4.0,
    courseCount: rows.length,
    rows,
  };
}
