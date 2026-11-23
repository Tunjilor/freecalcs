// PURE compute for the Pregnancy Due Date Calculator. See BUILD-STANDARD §2.
// Naegele's rule, adjusted for cycle length (ACOG convention):
//   due date = first day of last menstrual period (LMP) + 280 days + (cycle − 28)
// Gestational age is counted from the (cycle-adjusted) LMP. Estimated
// conception ≈ LMP + (cycle − 14) days. Milestones by completed weeks.

import { parseISODate, addDays, daysBetween, formatDate, toISODate } from "../../lib/calculator/dates.ts";

export type PregnancyInputs = { lmpDate: string; cycleLength: number; asOfDate: string };

export type PregnancyResults = {
  valid: boolean;
  dueDate: string;
  dueLabel: string;
  conceptionLabel: string;
  weeks: number;
  days: number;
  gestationLabel: string; // "10 weeks, 3 days"
  trimester: string;
  daysToGo: number;
  pctComplete: number;
  notPregnantYet: boolean; // as-of before LMP
  pastDue: boolean;
  milestones: { milestone: string; week: string; date: string }[];
};

const MILESTONES: [string, number][] = [
  ["End of first trimester", 13 * 7 + 6],
  ["Typical anatomy scan", 20 * 7],
  ["Third trimester begins", 28 * 7],
  ["Early term", 37 * 7],
  ["Due date (40 weeks)", 40 * 7],
  ["Late term", 41 * 7],
  ["Post-term", 42 * 7],
];

export function computePregnancy(v: PregnancyInputs): PregnancyResults {
  const lmp = parseISODate(v.lmpDate);
  const asOf = parseISODate(v.asOfDate);
  const cycle = Math.min(45, Math.max(20, Math.round(Number(v.cycleLength) || 28)));
  const empty = { valid: false, dueDate: "", dueLabel: "—", conceptionLabel: "—", weeks: 0, days: 0, gestationLabel: "—", trimester: "—", daysToGo: 0, pctComplete: 0, notPregnantYet: false, pastDue: false, milestones: [] };
  if (!lmp || !asOf) return empty;
  const adj = cycle - 28;
  const start = addDays(lmp, adj); // adjusted LMP
  const due = addDays(start, 280);
  const ga = daysBetween(start, asOf);
  const w = Math.floor(Math.max(0, ga) / 7);
  const d = Math.max(0, ga) % 7;
  const trimester = ga < 0 ? "—" : ga < 14 * 7 ? "First" : ga < 28 * 7 ? "Second" : "Third";
  return {
    valid: true,
    dueDate: toISODate(due),
    dueLabel: formatDate(due),
    conceptionLabel: formatDate(addDays(lmp, cycle - 14), false),
    weeks: w,
    days: d,
    gestationLabel: ga < 0 ? "—" : `${w} week${w === 1 ? "" : "s"}, ${d} day${d === 1 ? "" : "s"}`,
    trimester,
    daysToGo: daysBetween(asOf, due),
    pctComplete: Math.min(100, Math.max(0, Math.round((ga / 280) * 1000) / 10)),
    notPregnantYet: ga < 0,
    pastDue: ga > 280,
    milestones: MILESTONES.map(([m, n]) => ({ milestone: m, week: `${Math.floor(n / 7)}w ${n % 7}d`, date: formatDate(addDays(start, n), false) })),
  };
}
