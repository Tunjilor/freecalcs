// PURE compute for the Days Until Calculator. See BUILD-STANDARD §2.
// Countdown from a "from" date (default today) to a target date.

import { parseISODate, daysBetween, weekdaysBetween, monthsAndDays, formatDate, weekdayName } from "../../lib/calculator/dates.ts";

export type DaysUntilInputs = { targetDate: string; fromDate: string };

export type DaysUntilResults = {
  valid: boolean;
  days: number; // negative if the date has passed
  weeksLabel: string;
  monthsLabel: string;
  weekdays: number;
  hours: number;
  targetLabel: string;
  targetWeekday: string;
  isPast: boolean;
  isToday: boolean;
};

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export function computeDaysUntil(v: DaysUntilInputs): DaysUntilResults {
  const t = parseISODate(v.targetDate);
  const f = parseISODate(v.fromDate);
  if (!t || !f)
    return { valid: false, days: 0, weeksLabel: "—", monthsLabel: "—", weekdays: 0, hours: 0, targetLabel: formatDate(t), targetWeekday: weekdayName(t), isPast: false, isToday: false };
  const days = daysBetween(f, t);
  const abs = Math.abs(days);
  const md = monthsAndDays(f, t);
  const mParts = [md.years && plural(md.years, "year"), md.months && plural(md.months, "month"), plural(md.days, "day")].filter(Boolean);
  return {
    valid: true,
    days,
    weeksLabel: `${plural(Math.floor(abs / 7), "week")}, ${plural(abs % 7, "day")}`,
    monthsLabel: mParts.join(", "),
    weekdays: Math.abs(weekdaysBetween(f, t)),
    hours: abs * 24,
    targetLabel: formatDate(t),
    targetWeekday: weekdayName(t),
    isPast: days < 0,
    isToday: days === 0,
  };
}
