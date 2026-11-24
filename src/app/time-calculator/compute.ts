// PURE compute for the Time Calculator. See BUILD-STANDARD §2.
// Adds and subtracts durations (hours, minutes, seconds) row by row, and
// optionally applies the total to a starting clock time.

import type { RowValue } from "../../lib/calculator/types.ts";
import { parseTime, formatClock } from "../../lib/calculator/times.ts";

export type TimeCalcInputs = { items: RowValue[]; startClock: string };

export type TimeCalcResults = {
  totalSeconds: number;
  totalLabel: string; // "5:47:30" (h:mm:ss)
  wordsLabel: string; // "5 hours, 47 minutes, 30 seconds"
  decimalHours: number;
  totalMinutes: number;
  daysLabel: string; // "1 day, 2:15:00" when ≥ 24h
  negative: boolean;
  endClockLabel: string;
  dayShift: number; // days the end clock time moves past the start date
  hasClock: boolean;
  rows: { item: string; sign: string; duration: string; running: string }[];
};

const LIMIT = 1e12; // seconds; keeps results finite and readable
const pad = (n: number) => String(n).padStart(2, "0");
const pl = (n: number, w: string) => `${n.toLocaleString("en-US")} ${w}${n === 1 ? "" : "s"}`;

export function hms(sec: number): string {
  const sign = sec < 0 ? "−" : "";
  const a = Math.abs(Math.round(sec));
  return `${sign}${Math.floor(a / 3600).toLocaleString("en-US")}:${pad(Math.floor((a % 3600) / 60))}:${pad(a % 60)}`;
}

export function computeTimeCalc(v: TimeCalcInputs): TimeCalcResults {
  let total = 0;
  const rows: TimeCalcResults["rows"] = [];
  (v.items ?? []).forEach((r, i) => {
    const h = Number(r.hours) || 0, m = Number(r.minutes) || 0, s = Number(r.seconds) || 0;
    const sec = Math.min(LIMIT, Math.max(-LIMIT, h * 3600 + m * 60 + s));
    if (sec === 0) return;
    const sign = r.op === "-" ? -1 : 1;
    total = Math.min(LIMIT, Math.max(-LIMIT, total + sign * sec));
    rows.push({ item: `${i + 1}`, sign: sign < 0 ? "−" : "+", duration: hms(Math.abs(sec)), running: hms(total) });
  });
  const a = Math.abs(Math.round(total));
  const H = Math.floor(a / 3600), M = Math.floor((a % 3600) / 60), S = a % 60;
  const words = [H && pl(H, "hour"), M && pl(M, "minute"), S && pl(S, "second")].filter(Boolean).join(", ") || "0 seconds";
  const start = parseTime(v.startClock);
  const endMin = start === null ? 0 : start + total / 60;
  return {
    totalSeconds: Math.round(total),
    totalLabel: hms(total),
    wordsLabel: `${total < 0 ? "minus " : ""}${words}`,
    decimalHours: Math.round((total / 3600) * 10000) / 10000,
    totalMinutes: Math.round((total / 60) * 100) / 100,
    daysLabel: a >= 86400 ? `${pl(Math.floor(a / 86400), "day")}, ${hms(a % 86400)}` : "—",
    negative: total < 0,
    endClockLabel: start === null ? "—" : formatClock(Math.floor(endMin)),
    dayShift: start === null ? 0 : Math.floor(endMin / 1440),
    hasClock: start !== null,
    rows,
  };
}
