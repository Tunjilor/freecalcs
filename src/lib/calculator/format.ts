// Pure formatting helpers shared by every calculator + its insight rules.
// No DOM, no dates — safe to import from compute code and unit tests.

/** Whole-dollar currency, e.g. $329,000. Guards NaN/Infinity. */
export function money(v: number): string {
  if (!isFinite(v) || isNaN(v)) return "$0";
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Cents-precision currency, e.g. $2,101.34. */
export function money2(v: number): string {
  if (!isFinite(v) || isNaN(v)) return "$0.00";
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Percent from a 0–100 value, e.g. pct(6.27) -> "6.27%". */
export function pct(v: number, digits = 2): string {
  if (!isFinite(v) || isNaN(v)) return "0%";
  return `${v.toFixed(digits)}%`;
}

/** Percent from a 0–1 ratio, e.g. ratioPct(0.215) -> "21.5%". */
export function ratioPct(v: number, digits = 1): string {
  if (!isFinite(v) || isNaN(v)) return "0%";
  return `${(v * 100).toFixed(digits)}%`;
}

/** Plain number with thousands separators, e.g. 1,234. */
export function num(v: number, digits = 0): string {
  if (!isFinite(v) || isNaN(v)) return "0";
  return v.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Convert a month count to a human "X years Y months" string. */
export function months(total: number): string {
  const t = Math.max(0, Math.round(total));
  const y = Math.floor(t / 12);
  const m = t % 12;
  if (y === 0) return `${m} month${m === 1 ? "" : "s"}`;
  if (m === 0) return `${y} year${y === 1 ? "" : "s"}`;
  return `${y} yr ${m} mo`;
}
