// Fraction helpers for `type: "fraction"` inputs (BUILD-STANDARD §2) and the
// fraction calculator. Values are exact integers {n, d} with d > 0, reduced.

export type Frac = { n: number; d: number };

export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function reduce(n: number, d: number): Frac | null {
  if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  const r = { n: n / g, d: d / g };
  // Beyond ~9e15 integers lose precision; treat as out of range.
  return Math.abs(r.n) > Number.MAX_SAFE_INTEGER || r.d > Number.MAX_SAFE_INTEGER ? null : r;
}

/**
 * Parse "3/4", "-1 1/2", "1-1/2", "2", "0.375", "-.5" into an exact fraction.
 * Returns null for blank or invalid text or a zero denominator.
 */
export function parseFraction(text: string): Frac | null {
  const s = String(text ?? "").trim().replace(/−/g, "-").replace(/\s+/g, " ");
  if (!s) return null;
  let m = /^([+-])?(\d+)(?: |-)(\d+)\/(\d+)$/.exec(s); // mixed: "1 1/2" or "1-1/2"
  if (m) {
    const sign = m[1] === "-" ? -1 : 1;
    const w = +m[2], n = +m[3], d = +m[4];
    return d === 0 ? null : reduce(sign * (w * d + n), d);
  }
  m = /^([+-])?(\d+)\s?\/\s?([+-]?\d+)$/.exec(s); // "3/4", "-3 / 4"
  if (m) {
    const sign = m[1] === "-" ? -1 : 1;
    return reduce(sign * +m[2], +m[3]);
  }
  m = /^([+-])?(\d*)(?:\.(\d+))?$/.exec(s); // whole or decimal
  if (m && (m[2] || m[3])) {
    const sign = m[1] === "-" ? -1 : 1;
    const dec = (m[3] ?? "").slice(0, 12);
    const d = 10 ** dec.length;
    return reduce(sign * (Number(m[2] || "0") * d + Number(dec || "0")), d);
  }
  return null;
}

export const add = (a: Frac, b: Frac) => reduce(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Frac, b: Frac) => reduce(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Frac, b: Frac) => reduce(a.n * b.n, a.d * b.d);
export const div = (a: Frac, b: Frac) => (b.n === 0 ? null : reduce(a.n * b.d, a.d * b.n));

export function fracLabel(f: Frac | null): string {
  if (!f) return "—";
  return f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`;
}

export function mixedLabel(f: Frac | null): string {
  if (!f) return "—";
  if (f.d === 1) return `${f.n}`;
  const sign = f.n < 0 ? "-" : "";
  const whole = Math.floor(Math.abs(f.n) / f.d);
  const rem = Math.abs(f.n) % f.d;
  return whole === 0 ? `${sign}${rem}/${f.d}` : `${sign}${whole} ${rem}/${f.d}`;
}
