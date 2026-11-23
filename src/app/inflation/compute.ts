// PURE compute for the Inflation Calculator. See BUILD-STANDARD §2.
// Historical: converts dollars between any two years 1913–latest using CPI-U
// annual averages. Future years beyond the data are projected at an assumed
// annual rate from the latest CPI year.

import { round2 } from "../../lib/calculator/finance.ts";
import {
  CPI_ANNUAL,
  CPI_FIRST_YEAR,
  CPI_LAST_YEAR,
} from "../../lib/data/cpi.ts";

export type InflationInputs = {
  amount: number;
  fromYear: number;
  toYear: number;
  futureRate: number; // annual % used for years after the latest CPI data
};

export type InflationResults = {
  fromYear: number; // clamped
  toYear: number;
  adjustedAmount: number;
  cumulativeChange: number; // %, from → to
  avgAnnualRate: number; // %, compound
  purchasingPower: number; // what `amount` in toYear buys in fromYear dollars
  projected: boolean; // toYear or fromYear beyond the data
  dataLastYear: number;
  series: { x: string; y: number }[]; // value of `amount` by year
};

function clampYear(y: number, max: number) {
  const n = Math.round(Number.isFinite(y) ? y : CPI_LAST_YEAR);
  return Math.min(max, Math.max(CPI_FIRST_YEAR, n));
}

/** CPI for any year; years after the data are extrapolated at `rate`. */
export function cpiFor(year: number, rate: number): number {
  if (year <= CPI_LAST_YEAR) return CPI_ANNUAL[year];
  return CPI_ANNUAL[CPI_LAST_YEAR] * Math.pow(1 + rate / 100, year - CPI_LAST_YEAR);
}

export function computeInflation(v: InflationInputs): InflationResults {
  const maxYear = CPI_LAST_YEAR + 50;
  const from = clampYear(v.fromYear, maxYear);
  const to = clampYear(v.toYear, maxYear);
  const rate = Math.max(-5, Math.min(50, v.futureRate));
  const amount = Math.max(0, v.amount);

  const c0 = cpiFor(from, rate);
  const c1 = cpiFor(to, rate);
  const ratio = c1 / c0;
  const years = Math.abs(to - from);
  const avg = years > 0 ? (Math.pow(c1 > c0 ? ratio : 1 / ratio, 1 / years) - 1) * 100 : 0;

  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  const step = Math.max(1, Math.ceil((hi - lo) / 40));
  const series: { x: string; y: number }[] = [];
  for (let y = lo; y <= hi; y += step) series.push({ x: String(y), y: round2((amount * cpiFor(y, rate)) / c0) });
  if (series.length && series[series.length - 1].x !== String(hi))
    series.push({ x: String(hi), y: round2((amount * cpiFor(hi, rate)) / c0) });

  return {
    fromYear: from,
    toYear: to,
    adjustedAmount: round2(amount * ratio),
    cumulativeChange: round2((ratio - 1) * 100),
    avgAnnualRate: round2(avg),
    purchasingPower: round2(amount / ratio),
    projected: from > CPI_LAST_YEAR || to > CPI_LAST_YEAR,
    dataLastYear: CPI_LAST_YEAR,
    series,
  };
}
