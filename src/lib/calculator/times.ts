// Clock-time helpers for `type: "time"` inputs (BUILD-STANDARD §2). Times are
// 24-hour "HH:MM" strings; durations are whole minutes.

/** "HH:MM" (or "HH:MM:SS") → minutes after midnight, or null if blank/invalid. */
export function parseTime(s: string): number | null {
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(String(s ?? "").trim());
  if (!m) return null;
  const h = +m[1], min = +m[2];
  return h > 23 || min > 59 ? null : h * 60 + min;
}

/** Minutes after midnight (any integer, wraps) → "9:05 AM". */
export function formatClock(mins: number): string {
  const m = ((Math.round(mins) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60), mm = m % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** Minutes from start to end; an end at or before the start is taken as the next day. */
export function spanMinutes(start: number, end: number): number {
  return end > start ? end - start : end + 1440 - start;
}

/** 465 → "7 hr 45 min"; 0 → "0 hr 0 min". Negative values get a leading "−". */
export function hoursMinutesLabel(mins: number): string {
  const sign = mins < 0 ? "−" : "";
  const a = Math.abs(Math.round(mins));
  return `${sign}${Math.floor(a / 60).toLocaleString("en-US")} hr ${a % 60} min`;
}

/** 465 → "7:45" (h:mm). */
export function hmm(mins: number): string {
  const sign = mins < 0 ? "−" : "";
  const a = Math.abs(Math.round(mins));
  return `${sign}${Math.floor(a / 60).toLocaleString("en-US")}:${String(a % 60).padStart(2, "0")}`;
}

/** Minutes → decimal hours, 2 places (465 → 7.75). */
export const decimalHours = (mins: number) => Math.round((mins / 60) * 100) / 100;
