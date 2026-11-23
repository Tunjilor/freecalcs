// PURE compute for the Date Calculator. See BUILD-STANDARD §2.
// Days between two dates (with weekdays and a years/months/days breakdown), and
// the date N days after the start date.

import {
  parseISODate, addDays, daysBetween, weekdaysBetween, monthsAndDays, formatDate, toISODate,
} from "../../lib/calculator/dates.ts";

export type DateCalcInputs = {
  startDate: string;
  endDate: string;
  includeEnd: "no" | "yes";
  addDaysN: number;
};

export type DateCalcResults = {
  valid: boolean;
  days: number; // signed, includes end day if chosen
  absDays: number;
  absDaysLabel: string; // "90" or "—"
  weeksLabel: string; // "12 weeks, 3 days"
  ymdLabel: string; // "1 year, 2 months, 5 days"
  weekdays: number; // Mon–Fri
  weekendDays: number;
  startLabel: string;
  endLabel: string;
  addedDate: string; // ISO
  addedLabel: string;
  daysAdded: number; // after clamping to ±36,500
  endBeforeStart: boolean;
};

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export function computeDateCalc(v: DateCalcInputs): DateCalcResults {
  const a = parseISODate(v.startDate);
  const b = parseISODate(v.endDate);
  // ±100 years keeps results inside the range JavaScript dates can represent.
  const addN = Math.min(36500, Math.max(-36500, Math.round(Number(v.addDaysN) || 0)));
  const add = a ? addDays(a, addN) : null;
  if (!a || !b) {
    return { valid: false, days: 0, absDays: 0, absDaysLabel: "—", weeksLabel: "—", ymdLabel: "—", weekdays: 0, weekendDays: 0,
      startLabel: formatDate(a), endLabel: formatDate(b), addedDate: add ? toISODate(add) : "", addedLabel: formatDate(add), daysAdded: addN, endBeforeStart: false };
  }
  const inc = v.includeEnd === "yes" ? 1 : 0;
  const raw = daysBetween(a, b);
  const sign = raw < 0 ? -1 : 1;
  const absDays = Math.abs(raw) + inc;
  const [lo, hi] = raw < 0 ? [b, a] : [a, b];
  const wd = Math.abs(weekdaysBetween(lo, addDays(hi, inc)));
  const ymd = monthsAndDays(lo, addDays(hi, inc));
  const parts = [ymd.years && plural(ymd.years, "year"), ymd.months && plural(ymd.months, "month"), plural(ymd.days, "day")].filter(Boolean);
  return {
    valid: true,
    days: sign * absDays,
    absDays,
    absDaysLabel: absDays.toLocaleString("en-US"),
    weeksLabel: `${plural(Math.floor(absDays / 7), "week")}, ${plural(absDays % 7, "day")}`,
    ymdLabel: parts.join(", "),
    weekdays: wd,
    weekendDays: absDays - wd,
    startLabel: formatDate(a),
    endLabel: formatDate(b),
    addedDate: toISODate(add!),
    addedLabel: formatDate(add),
    daysAdded: addN,
    endBeforeStart: raw < 0,
  };
}
