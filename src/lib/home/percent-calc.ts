// Pure math for the homepage's three quick percentage forms. Each returns null
// when the answer is undefined (blank input, or dividing by zero), and the
// component shows a dash.

/** Parse what someone typed: allows commas, spaces, a leading +, and a trailing %. */
export function parseInput(raw: string): number | null {
  const cleaned = raw.replace(/[,\s%]/g, "").replace(/^\+/, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** What is X% of Y? */
export function percentOf(x: number | null, y: number | null): number | null {
  if (x === null || y === null) return null;
  return (x / 100) * y;
}

/** X is what % of Y? */
export function whatPercent(x: number | null, y: number | null): number | null {
  if (x === null || y === null || y === 0) return null;
  return (x / y) * 100;
}

/** % change from X to Y. Measured against |X|, so a rise is always positive. */
export function percentChange(x: number | null, y: number | null): number | null {
  if (x === null || y === null || x === 0) return null;
  return ((y - x) / Math.abs(x)) * 100;
}

/** Up to 4 decimals, thousands separators, binary noise rounded away. */
export function formatResult(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  const rounded = Number(n.toPrecision(12));
  return (Object.is(rounded, -0) ? 0 : rounded).toLocaleString("en-US", { maximumFractionDigits: 4 });
}

/** Signed percentage for the change form: "+50%", "−20%", "0%". */
export function formatChange(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  const body = formatResult(Math.abs(n));
  if (body === "0") return "0%";
  return `${n > 0 ? "+" : "−"}${body}%`;
}
