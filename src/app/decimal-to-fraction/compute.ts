// PURE compute for the Decimal to Fraction Calculator. See BUILD-STANDARD §2.
// Exact: write the decimal over a power of 10 and reduce by the GCD
// (0.375 = 375/1000 = 3/8). Approximate: the best fraction with a small
// denominator (≤ 100) by continued fractions, which recovers repeating
// decimals like 0.3333 → 1/3, and the nearest 1/16 for tape-measure use.

export type DecimalToFractionInputs = { decimal: number };

export type DecimalToFractionResults = {
  valid: boolean;
  fractionLabel: string; // "3/8", "-15/8", "2"
  mixedLabel: string; // "1 7/8"
  numerator: number;
  denominator: number;
  simpleLabel: string; // best approximation with denominator ≤ 100
  simpleError: number;
  sixteenthLabel: string; // nearest 1/16
  percentLabel: string;
  isExactSimple: boolean;
  steps: { step: string; value: string }[];
};

const MAX_PLACES = 10;

export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function decimalPlaces(x: number): number {
  const s = Math.abs(x).toString();
  if (s.includes("e")) {
    const [mant, exp] = s.split("e");
    const mp = (mant.split(".")[1] ?? "").length;
    return Math.min(MAX_PLACES, Math.max(0, mp - Number(exp)));
  }
  return Math.min(MAX_PLACES, (s.split(".")[1] ?? "").length);
}

function mixed(n: number, d: number): string {
  if (d === 1) return `${n}`;
  const sign = n < 0 ? "-" : "";
  const whole = Math.floor(Math.abs(n) / d);
  const rem = Math.abs(n) % d;
  if (whole === 0) return `${sign}${rem}/${d}`;
  return rem === 0 ? `${sign}${whole}` : `${sign}${whole} ${rem}/${d}`;
}

/** Best rational approximation of x with denominator ≤ maxDen (continued fractions). */
export function bestFraction(x: number, maxDen: number): [number, number] {
  const sign = x < 0 ? -1 : 1;
  let v = Math.abs(x);
  let [h0, h1, k0, k1] = [0, 1, 1, 0];
  for (let i = 0; i < 64; i++) {
    const a = Math.floor(v);
    const h2 = a * h1 + h0, k2 = a * k1 + k0;
    if (k2 > maxDen) break;
    [h0, h1, k0, k1] = [h1, h2, k1, k2];
    const frac = v - a;
    if (frac < 1e-12) break;
    v = 1 / frac;
  }
  return [sign * h1, k1];
}

export function computeDecimalToFraction(v: DecimalToFractionInputs): DecimalToFractionResults {
  const x = Number(v.decimal);
  if (!Number.isFinite(x) || Math.abs(x) > 1e9) {
    return { valid: false, fractionLabel: "—", mixedLabel: "—", numerator: 0, denominator: 1, simpleLabel: "—", simpleError: 0,
      sixteenthLabel: "—", percentLabel: "—", isExactSimple: false, steps: [] };
  }
  const places = decimalPlaces(x);
  const den0 = 10 ** places;
  const num0 = Math.round(x * den0);
  const g = gcd(num0, den0);
  const n = num0 / g, d = den0 / g;
  const [sn, sd] = bestFraction(x, 100);
  const s16 = Math.round(x * 16);
  const g16 = gcd(s16, 16);
  return {
    valid: true,
    fractionLabel: d === 1 ? `${n}` : `${n}/${d}`,
    mixedLabel: mixed(n, d),
    numerator: n,
    denominator: d,
    simpleLabel: mixed(sn, sd),
    simpleError: Math.abs(x - sn / sd),
    sixteenthLabel: mixed(s16 / g16, 16 / g16),
    percentLabel: `${(x * 100).toLocaleString("en-US", { maximumFractionDigits: 8 })}%`,
    isExactSimple: sn === n && sd === d,
    steps: [
      { step: `Write over 10^${places}`, value: `${num0}/${den0}` },
      { step: `Greatest common divisor`, value: `${g}` },
      { step: `Divide both by ${g}`, value: d === 1 ? `${n}` : `${n}/${d}` },
      { step: `As a mixed number`, value: mixed(n, d) },
    ],
  };
}
