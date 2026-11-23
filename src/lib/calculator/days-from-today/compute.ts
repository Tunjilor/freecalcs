// PURE compute shared by the "N days from today" pages (/30-days-from-today,
// /90-days-from-today, …). See BUILD-STANDARD §2. Each page is its own
// CalculatorDefinition built by ./definition.ts with a different default N.
// Convention: today is day 0, so "30 days from today" lands 30 calendar days
// later (the same convention Google and most date sites use).

import { parseISODate, addDays, addBusinessDays, formatDate, weekdayName, toISODate } from "../dates.ts";

export type DaysFromTodayInputs = { fromDate: string; days: number; direction: "from" | "before" };

export type DaysFromTodayResults = {
  valid: boolean;
  days: number; // clamped, ≥ 0
  dateLabel: string; // "Sun, Feb 21, 2027"
  dateISO: string;
  weekday: string;
  isWeekend: boolean;
  businessDateLabel: string; // N business days instead of calendar days
  weeksLabel: string;
  monthsApprox: number;
  fromLabel: string;
  rows: { offset: string; date: string; weekday: string }[];
};

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
export const COMMON_OFFSETS = [7, 14, 28, 30, 45, 60, 90, 120, 180, 365];

export function computeDaysFromToday(v: DaysFromTodayInputs): DaysFromTodayResults {
  const from = parseISODate(v.fromDate);
  // ±100 years keeps results inside the range JavaScript dates can represent.
  const n = Math.min(36500, Math.max(0, Math.round(Number(v.days) || 0)));
  const sign = v.direction === "before" ? -1 : 1;
  if (!from) {
    return { valid: false, days: n, dateLabel: "—", dateISO: "", weekday: "—", isWeekend: false, businessDateLabel: "—",
      weeksLabel: `${plural(Math.floor(n / 7), "week")}, ${plural(n % 7, "day")}`, monthsApprox: Math.round((n / 30.4375) * 10) / 10, fromLabel: "—", rows: [] };
  }
  const target = addDays(from, sign * n);
  const wd = target.getUTCDay();
  return {
    valid: true,
    days: n,
    dateLabel: formatDate(target),
    dateISO: toISODate(target),
    weekday: weekdayName(target),
    isWeekend: wd === 0 || wd === 6,
    // Business-day counting gets slow for huge N; cap it at ~100 years of weekdays.
    businessDateLabel: n <= 26000 ? formatDate(addBusinessDays(from, sign * n)) : "—",
    weeksLabel: `${plural(Math.floor(n / 7), "week")}, ${plural(n % 7, "day")}`,
    monthsApprox: Math.round((n / 30.4375) * 10) / 10,
    fromLabel: formatDate(from),
    rows: COMMON_OFFSETS.map((k) => {
      const d = addDays(from, sign * k);
      return { offset: `${k} days ${sign > 0 ? "from" : "before"}`, date: formatDate(d, false), weekday: weekdayName(d) };
    }),
  };
}
