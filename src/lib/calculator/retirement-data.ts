// SINGLE SOURCE OF TRUTH for annual retirement-plan contribution limits — the
// same maintainable, year-labeled pattern as tax-data.ts. The annual update is a
// single-file edit: add next year's block and bump DEFAULT_PLAN_YEAR.
//
// SOURCES (401(k)/403(b)/457 employee elective-deferral limits):
//   2025 — IRS Notice 2024-80: elective deferral $23,500; age-50+ catch-up
//     $7,500; SECURE 2.0 ages 60–63 catch-up $11,250.
//   2026 — IRS Notice 2025-67 (IRB 2025-49): elective deferral $24,500; age-50+
//     catch-up $8,000; SECURE 2.0 ages 60–63 catch-up $11,250.
//     https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
//
// VERIFICATION: every 2026 figure below was verified against IRS Notice 2025-67
// (Nov 2025) — not taken from model memory. The 2025 figures are from the prior
// year's Notice 2024-80.

export type PlanYear = "2025" | "2026";

export type ContributionLimit = {
  electiveDeferral: number; // employee 401(k) elective-deferral limit
  catchUp50: number; // additional, age 50–59 (and 64+)
  catchUp60to63: number; // additional, ages 60–63 (SECURE 2.0 higher catch-up)
};

export const CONTRIBUTION_LIMITS: Record<PlanYear, ContributionLimit> = {
  // IRS Notice 2024-80 (2025 limits)
  "2025": { electiveDeferral: 23500, catchUp50: 7500, catchUp60to63: 11250 },
  // IRS Notice 2025-67 (2026 limits) — VERIFIED
  "2026": { electiveDeferral: 24500, catchUp50: 8000, catchUp60to63: 11250 },
};

export const DEFAULT_PLAN_YEAR: PlanYear = "2026";

export const PLAN_YEAR_OPTIONS: { label: string; value: PlanYear }[] = [
  { label: "2026 limits", value: "2026" },
  { label: "2025 limits", value: "2025" },
];

/**
 * The 401(k) employee elective-deferral limit for a given age, including the
 * correct catch-up. The SECURE 2.0 higher catch-up for ages 60–63 is kept
 * DISTINCT from the standard age-50+ catch-up — they are not additive.
 */
export function contributionLimit(year: PlanYear, age: number): number {
  const l = CONTRIBUTION_LIMITS[year];
  if (age >= 60 && age <= 63) return l.electiveDeferral + l.catchUp60to63;
  if (age >= 50) return l.electiveDeferral + l.catchUp50;
  return l.electiveDeferral;
}

/** Which catch-up tier applies at this age, for labeling. */
export function catchUpTier(age: number): "none" | "standard" | "super" {
  if (age >= 60 && age <= 63) return "super";
  if (age >= 50) return "standard";
  return "none";
}
