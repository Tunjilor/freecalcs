// Date helpers for calculators with `type: "date"` inputs (BUILD-STANDARD §2).
// Dates travel as ISO strings ("YYYY-MM-DD") and are handled in UTC, so day
// counts never shift with the visitor's time zone or daylight saving.
//
// Defaults can be relative tokens, resolved against "today":
//   "today", "today+30", "today-56"   → today ± N days
//   "next:12-25"                      → the next Dec 25 on or after today
// A plain "YYYY-MM-DD" is used as-is.

const MS_PER_DAY = 86_400_000;

/** "YYYY-MM-DD" → UTC midnight Date, or null if invalid. */
export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s ?? "").trim());
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? d : null;
}

/** UTC Date → "YYYY-MM-DD". */
export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** A local calendar date (e.g. `new Date()` in the browser) → "YYYY-MM-DD". */
export function localISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + Math.round(n) * MS_PER_DAY);
}

/** Whole days from a to b (negative if b is earlier). */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/** Monday–Friday days in [start, end) (end exclusive), sign follows direction. */
export function weekdaysBetween(a: Date, b: Date): number {
  const sign = b < a ? -1 : 1;
  const [s, e] = b < a ? [b, a] : [a, b];
  const total = daysBetween(s, e);
  const fullWeeks = Math.floor(total / 7);
  let count = fullWeeks * 5;
  const startDow = s.getUTCDay();
  for (let i = 0; i < total % 7; i++) {
    const dow = (startDow + i) % 7;
    if (dow !== 0 && dow !== 6) count++;
  }
  return sign * count;
}

/** Add calendar months, clamping to the month's last day (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(d: Date, n: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + n;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m, Math.min(d.getUTCDate(), last)));
}

/** Whole years, months and leftover days from a to b (order-independent). */
export function monthsAndDays(a: Date, b: Date): { years: number; months: number; days: number } {
  if (b < a) [a, b] = [b, a];
  let total = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
  if (addMonths(a, total) > b) total -= 1;
  const days = daysBetween(addMonths(a, total), b);
  return { years: Math.floor(total / 12), months: total % 12, days };
}

/** Resolve a default token against today's ISO date. Unknown tokens pass through. */
export function resolveDateToken(token: string, todayISO: string): string {
  const today = parseISODate(todayISO);
  if (!today) return token;
  const rel = /^today(?:([+-])(\d+))?$/.exec(token);
  if (rel) return toISODate(addDays(today, rel[1] ? (rel[1] === "-" ? -1 : 1) * +rel[2] : 0));
  const next = /^next:(\d{2})-(\d{2})$/.exec(token);
  if (next) {
    const y = today.getUTCFullYear();
    let cand = parseISODate(`${y}-${next[1]}-${next[2]}`);
    if (cand && cand < today) cand = parseISODate(`${y + 1}-${next[1]}-${next[2]}`);
    return cand ? toISODate(cand) : token;
  }
  return token;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Tue, Mar 3, 2026"-style label for a UTC date. */
export function formatDate(d: Date | null, withWeekday = true): string {
  if (!d) return "—";
  const base = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  return withWeekday ? `${DAYS[d.getUTCDay()].slice(0, 3)}, ${base}` : base;
}

export function weekdayName(d: Date | null): string {
  return d ? DAYS[d.getUTCDay()] : "—";
}

/** Add N business days (Mon–Fri), skipping weekends. N may be negative. */
export function addBusinessDays(d: Date, n: number): Date {
  const step = n < 0 ? -1 : 1;
  let left = Math.abs(Math.round(n));
  let cur = d;
  while (left > 0) {
    cur = addDays(cur, step);
    const wd = cur.getUTCDay();
    if (wd !== 0 && wd !== 6) left--;
  }
  return cur;
}
