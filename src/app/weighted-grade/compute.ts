// PURE compute for the Weighted Grade Calculator. See BUILD-STANDARD §2.
// Grade = Σ(score × weight) ÷ Σ weight, over rows with a weight > 0. If the
// weights entered don't add to 100%, the result is the average so far
// (normalized), and the remaining weight is reported.

import { round2 } from "../../lib/calculator/finance.ts";
import type { RowValue } from "../../lib/calculator/types.ts";

export type WeightedGradeInputs = { items: RowValue[] };

export type WeightedGradeResults = {
  grade: number;
  letter: string;
  totalWeight: number;
  remainingWeight: number;
  itemCount: number;
  rows: { item: string; weight: number; score: number; contribution: number }[];
};

export function letterFor(pct: number): string {
  const cut: [number, string][] = [[97, "A+"], [93, "A"], [90, "A-"], [87, "B+"], [83, "B"], [80, "B-"], [77, "C+"], [73, "C"], [70, "C-"], [67, "D+"], [63, "D"], [60, "D-"]];
  for (const [c, l] of cut) if (pct >= c) return l;
  return "F";
}

export function computeWeightedGrade(v: WeightedGradeInputs): WeightedGradeResults {
  const rows = (v.items ?? [])
    .map((r, i) => ({
      item: String(r.item ?? "").trim() || `Item ${i + 1}`,
      weight: Math.max(0, Number(r.weight) || 0),
      score: Math.max(0, Number(r.score) || 0),
    }))
    .filter((r) => r.weight > 0);
  const tw = rows.reduce((a, r) => a + r.weight, 0);
  const sum = rows.reduce((a, r) => a + r.weight * r.score, 0);
  const grade = tw > 0 ? sum / tw : 0;
  return {
    grade: round2(grade),
    letter: tw > 0 ? letterFor(grade) : "—",
    totalWeight: round2(tw),
    remainingWeight: round2(Math.max(0, 100 - tw)),
    itemCount: rows.length,
    rows: rows.map((r) => ({ ...r, contribution: round2((r.weight * r.score) / 100) })),
  };
}
