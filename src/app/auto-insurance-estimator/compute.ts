// PURE compute for the Auto Insurance Estimator. This deliberately returns a
// RANGE, never a single number: it multiplies rough national-average base
// premiums by coarse factors (age band, coverage level, vehicle value) and then
// widens the result into a low–high band. It is a BALLPARK for orientation, not
// a quote — real premiums depend on driving record, ZIP, credit, claims history,
// mileage, and the specific insurer, none of which this tool collects.

import { round2 } from "../../lib/calculator/finance.ts";

export type AgeBand = "under25" | "25to64" | "65plus";
export type CoverageLevel = "minimum" | "standard" | "full";
export type VehicleTier = "economy" | "mid" | "luxury";

export type AutoInsuranceInputs = {
  ageBand: AgeBand;
  coverageLevel: CoverageLevel;
  vehicleTier: VehicleTier;
};

export type CoverageRange = { level: CoverageLevel; label: string; lowAnnual: number; highAnnual: number };

export type AutoInsuranceResults = {
  lowAnnual: number;
  highAnnual: number;
  lowMonthly: number;
  highMonthly: number;
  rangeLabel: string; // "$X–$Y / month" — the headline, framed as a range
  byCoverage: CoverageRange[]; // the low–high band for all three coverage levels
};

// Rough national-average annual base premiums by coverage level (ballpark).
const BASE_ANNUAL: Record<CoverageLevel, number> = { minimum: 650, standard: 1450, full: 2250 };
const COVERAGE_LABEL: Record<CoverageLevel, string> = {
  minimum: "State-minimum liability",
  standard: "Standard (liability + some coverage)",
  full: "Full coverage (comp + collision)",
};
const AGE_MULT: Record<AgeBand, number> = { under25: 1.8, "25to64": 1.0, "65plus": 1.15 };
const VEHICLE_MULT: Record<VehicleTier, number> = { economy: 0.85, mid: 1.0, luxury: 1.4 };
// Intentionally WIDE, asymmetric band to signal how much the un-modeled factors
// (record, location, credit, claims) can move the real price.
const LOW_FACTOR = 0.7;
const HIGH_FACTOR = 1.35;

function bandFor(level: CoverageLevel, v: AutoInsuranceInputs): { low: number; high: number } {
  const mid = BASE_ANNUAL[level] * AGE_MULT[v.ageBand] * VEHICLE_MULT[v.vehicleTier];
  return { low: round2(mid * LOW_FACTOR), high: round2(mid * HIGH_FACTOR) };
}

const money0 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function computeAutoInsurance(v: AutoInsuranceInputs): AutoInsuranceResults {
  const selected = bandFor(v.coverageLevel, v);
  const lowMonthly = round2(selected.low / 12);
  const highMonthly = round2(selected.high / 12);

  const byCoverage: CoverageRange[] = (["minimum", "standard", "full"] as CoverageLevel[]).map((lvl) => {
    const b = bandFor(lvl, v);
    return { level: lvl, label: COVERAGE_LABEL[lvl], lowAnnual: b.low, highAnnual: b.high };
  });

  return {
    lowAnnual: selected.low,
    highAnnual: selected.high,
    lowMonthly,
    highMonthly,
    rangeLabel: `${money0(lowMonthly)}–${money0(highMonthly)}/mo`,
    byCoverage,
  };
}
