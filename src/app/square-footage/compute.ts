// PURE compute for the Square Footage Calculator. See BUILD-STANDARD §2.
// Each row is a rectangular area: length × width in feet. Irregular rooms are
// entered as several rectangles. Optional waste allowance for materials and an
// optional price per square foot for a cost estimate.

import { round2 } from "../../lib/calculator/finance.ts";
import type { RowValue } from "../../lib/calculator/types.ts";

export type SquareFootageInputs = { areas: RowValue[]; wastePct: number; pricePerSqFt: number };

export type SquareFootageResults = {
  totalSqFt: number;
  sqYd: number;
  sqM: number;
  acres: number;
  withWaste: number;
  cost: number;
  areaCount: number;
  largest: string;
  rows: { area: string; dims: string; sqft: number; share: string }[];
};

const MAX_FT = 100000; // keeps totals finite and meaningful

export function computeSquareFootage(v: SquareFootageInputs): SquareFootageResults {
  const rows = (v.areas ?? [])
    .map((r, i) => {
      const L = Math.min(MAX_FT, Math.max(0, Number(r.length) || 0));
      const W = Math.min(MAX_FT, Math.max(0, Number(r.width) || 0));
      return { area: String(r.area ?? "").trim() || `Area ${i + 1}`, L, W, sqft: L * W };
    })
    .filter((r) => r.sqft > 0);
  const total = rows.reduce((a, r) => a + r.sqft, 0);
  const waste = Math.min(100, Math.max(0, Number(v.wastePct) || 0));
  const price = Math.max(0, Number(v.pricePerSqFt) || 0);
  const withWaste = total * (1 + waste / 100);
  const largest = rows.reduce<{ area: string; sqft: number } | null>((m, r) => (!m || r.sqft > m.sqft ? r : m), null);
  return {
    totalSqFt: round2(total),
    sqYd: round2(total / 9),
    sqM: round2(total * 0.09290304),
    acres: Math.round((total / 43560) * 10000) / 10000,
    withWaste: Math.ceil(round2(withWaste)),
    cost: round2(withWaste * price),
    areaCount: rows.length,
    largest: largest?.area ?? "",
    rows: rows.map((r) => ({
      area: r.area,
      dims: `${r.L} × ${r.W} ft`,
      sqft: round2(r.sqft),
      share: total > 0 ? `${Math.round((r.sqft / total) * 100)}%` : "—",
    })),
  };
}
