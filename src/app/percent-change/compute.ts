// PURE compute for the Percent Change Calculator. See BUILD-STANDARD §2.
// Percent change = (new − old) ÷ |old| × 100. Undefined when old = 0.
// Also reports percent difference = |a − b| ÷ ((a + b) ÷ 2) × 100, which
// compares two values without treating either as the starting point.

export type PercentChangeInputs = { oldValue: number; newValue: number };

export type PercentChangeResults = {
  valid: boolean;
  change: number; // %
  changeLabel: string; // "+25.00%" / "−20.00%" / "No change" / "Not defined"
  direction: "increase" | "decrease" | "none" | "undefined";
  difference: number; // new − old
  pctDifferenceLabel: string;
  multiplierLabel: string; // "1.25×"
  reverseLabel: string; // % change needed to get back
};

const fmt = (n: number) => `${n < 0 ? "−" : n > 0 ? "+" : ""}${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
const LIMIT = 1e15;

export function computePercentChange(v: PercentChangeInputs): PercentChangeResults {
  const a = Math.min(LIMIT, Math.max(-LIMIT, Number(v.oldValue) || 0));
  const b = Math.min(LIMIT, Math.max(-LIMIT, Number(v.newValue) || 0));
  const diff = b - a;
  const avg = (Math.abs(a) + Math.abs(b)) / 2;
  const pctDiff = avg > 0 ? (Math.abs(diff) / avg) * 100 : 0;
  if (a === 0) {
    return { valid: false, change: 0, changeLabel: b === 0 ? "No change" : "Not defined", direction: b === 0 ? "none" : "undefined",
      difference: diff, pctDifferenceLabel: avg > 0 ? `${pctDiff.toFixed(2)}%` : "0.00%", multiplierLabel: "—", reverseLabel: "—" };
  }
  const change = (diff / Math.abs(a)) * 100;
  const reverse = b !== 0 ? ((a - b) / Math.abs(b)) * 100 : NaN;
  return {
    valid: true,
    change: Math.round(change * 100) / 100,
    changeLabel: diff === 0 ? "No change" : fmt(change),
    direction: diff > 0 ? "increase" : diff < 0 ? "decrease" : "none",
    difference: Math.round(diff * 10000) / 10000,
    pctDifferenceLabel: `${pctDiff.toFixed(2)}%`,
    multiplierLabel: `${(b / a).toLocaleString("en-US", { maximumFractionDigits: 4 })}×`,
    reverseLabel: Number.isFinite(reverse) ? fmt(reverse) : "—",
  };
}
