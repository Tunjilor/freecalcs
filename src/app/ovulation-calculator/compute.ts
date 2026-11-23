// PURE compute for the Ovulation Calculator. See BUILD-STANDARD §2.
// Calendar method: ovulation ≈ 14 days before the next period
// (next period = last period + cycle length). The fertile window is the
// 5 days before ovulation through the day after it (6 days). Due date if
// conceived uses the same cycle-adjusted Naegele rule as /pregnancy-due-date.

import { parseISODate, addDays, formatDate, toISODate } from "../../lib/calculator/dates.ts";

export type OvulationInputs = { lmpDate: string; cycleLength: number };

export type OvulationResults = {
  valid: boolean;
  ovulationLabel: string;
  ovulationISO: string;
  windowLabel: string; // "Dec 5 – Dec 11"
  peakLabel: string; // 2 most fertile days
  nextPeriodLabel: string;
  testLabel: string;
  dueLabel: string;
  cycle: number;
  ovulationDay: number; // cycle day
  irregular: boolean;
  cycles: { cycle: string; period: string; fertile: string; ovulation: string; due: string }[];
};

const short = (d: Date) => formatDate(d, false).replace(/, \d{4}$/, "");

export function computeOvulation(v: OvulationInputs): OvulationResults {
  const lmp = parseISODate(v.lmpDate);
  const raw = Math.round(Number(v.cycleLength) || 28);
  const cycle = Math.min(45, Math.max(20, raw));
  const empty: OvulationResults = { valid: false, ovulationLabel: "—", ovulationISO: "", windowLabel: "—", peakLabel: "—", nextPeriodLabel: "—",
    testLabel: "—", dueLabel: "—", cycle, ovulationDay: cycle - 14 + 1, irregular: false, cycles: [] };
  if (!lmp) return empty;
  const at = (start: Date) => {
    const ov = addDays(start, cycle - 14);
    return { ov, from: addDays(ov, -5), to: addDays(ov, 1), next: addDays(start, cycle), due: addDays(start, 280 + (cycle - 28)) };
  };
  const c0 = at(lmp);
  return {
    valid: true,
    ovulationLabel: formatDate(c0.ov),
    ovulationISO: toISODate(c0.ov),
    windowLabel: `${short(c0.from)} – ${short(c0.to)}`,
    peakLabel: `${short(addDays(c0.ov, -2))} – ${short(c0.ov)}`,
    nextPeriodLabel: formatDate(c0.next),
    testLabel: formatDate(c0.next),
    dueLabel: formatDate(c0.due),
    cycle,
    ovulationDay: cycle - 14 + 1,
    irregular: raw < 21 || raw > 35,
    cycles: Array.from({ length: 6 }, (_, i) => {
      const start = addDays(lmp, i * cycle);
      const c = at(start);
      return { cycle: `${i + 1}`, period: formatDate(start, false), fertile: `${short(c.from)} – ${short(c.to)}`, ovulation: short(c.ov), due: formatDate(c.due, false) };
    }),
  };
}
