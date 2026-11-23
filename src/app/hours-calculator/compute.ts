// PURE compute for the Hours Calculator. See BUILD-STANDARD §2.
// Hours between a start and end clock time, minus an unpaid break. An end
// time earlier than the start is treated as the next day (overnight shift).
// Optional hourly rate for pay.

import { round2 } from "../../lib/calculator/finance.ts";
import { parseTime, formatClock, spanMinutes, hoursMinutesLabel, hmm, decimalHours } from "../../lib/calculator/times.ts";

export type HoursInputs = { start: string; end: string; breakMinutes: number; rate: number };

export type HoursResults = {
  valid: boolean;
  minutes: number; // worked, after break
  hoursLabel: string; // "7 hr 45 min"
  hmmLabel: string; // "7:45"
  decimal: number; // 7.75
  pay: number;
  overnight: boolean;
  sameTime: boolean;
  breakTooLong: boolean;
  spanLabel: string; // "9:00 AM to 5:30 PM"
  rows: { quarter: string; hours: number }[];
};

export function computeHours(v: HoursInputs): HoursResults {
  const s = parseTime(v.start), e = parseTime(v.end);
  const brk = Math.min(1440, Math.max(0, Math.round(Number(v.breakMinutes) || 0)));
  const rate = Math.min(1e6, Math.max(0, Number(v.rate) || 0));
  if (s === null || e === null) {
    return { valid: false, minutes: 0, hoursLabel: "—", hmmLabel: "—", decimal: 0, pay: 0, overnight: false, sameTime: false, breakTooLong: false, spanLabel: "—", rows: [] };
  }
  const same = s === e;
  const span = same ? 0 : spanMinutes(s, e);
  const worked = Math.max(0, span - brk);
  const dec = decimalHours(worked);
  return {
    valid: true,
    minutes: worked,
    hoursLabel: hoursMinutesLabel(worked),
    hmmLabel: hmm(worked),
    decimal: dec,
    pay: round2((worked / 60) * rate),
    overnight: e < s,
    sameTime: same,
    breakTooLong: brk > 0 && brk >= span && !same,
    spanLabel: `${formatClock(s)} to ${formatClock(e)}${e < s ? " (next day)" : ""}`,
    // Common payroll rounding: nearest quarter hour (7-minute rule).
    rows: [
      { quarter: "Exact (decimal hours)", hours: dec },
      { quarter: "Rounded to nearest ¼ hour", hours: Math.round(worked / 15) / 4 },
      { quarter: "Rounded to nearest ⅒ hour (6 min)", hours: Math.round(worked / 6) / 10 },
    ],
  };
}
