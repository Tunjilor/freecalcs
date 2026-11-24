// PURE compute for the Fraction Calculator. See BUILD-STANDARD §2.
// Exact fraction arithmetic on reduced integer pairs; inputs may be fractions,
// mixed numbers, whole numbers or decimals (see lib/calculator/fractions.ts).

import { parseFraction, add, sub, mul, div, gcd, fracLabel, mixedLabel, type Frac } from "../../lib/calculator/fractions.ts";

export type FractionInputs = { a: string; op: "+" | "-" | "*" | "/"; b: string };

export type FractionResults = {
  valid: boolean;
  error: "" | "a" | "b" | "divzero" | "range";
  resultLabel: string; // "17/12"
  mixedLabel: string; // "1 5/12"
  decimalLabel: string;
  percentLabel: string;
  aLabel: string;
  bLabel: string;
  steps: { step: string; value: string }[];
};

const SYM: Record<FractionInputs["op"], string> = { "+": "+", "-": "−", "*": "×", "/": "÷" };
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

function decimal(f: Frac): string {
  const x = f.n / f.d;
  return x.toLocaleString("en-US", { maximumFractionDigits: 8 });
}

export function computeFraction(v: FractionInputs): FractionResults {
  const A = parseFraction(v.a), B = parseFraction(v.b);
  const op = v.op in SYM ? v.op : "+";
  const fail = (error: FractionResults["error"]): FractionResults => ({
    valid: false, error, resultLabel: "—", mixedLabel: "—", decimalLabel: "—", percentLabel: "—",
    aLabel: fracLabel(A), bLabel: fracLabel(B), steps: [],
  });
  if (!A) return fail("a");
  if (!B) return fail("b");
  if (op === "/" && B.n === 0) return fail("divzero");
  const R = op === "+" ? add(A, B) : op === "-" ? sub(A, B) : op === "*" ? mul(A, B) : div(A, B);
  if (!R) return fail("range");
  const steps: FractionResults["steps"] = [];
  if (op === "+" || op === "-") {
    const L = lcm(A.d, B.d);
    const an = A.n * (L / A.d), bn = B.n * (L / B.d);
    steps.push({ step: `Common denominator (LCD of ${A.d} and ${B.d})`, value: `${L}` });
    steps.push({ step: "Rewrite both fractions", value: `${an}/${L} ${SYM[op]} ${bn}/${L}` });
    steps.push({ step: `${op === "+" ? "Add" : "Subtract"} the numerators`, value: `${op === "+" ? an + bn : an - bn}/${L}` });
  } else if (op === "*") {
    steps.push({ step: "Multiply numerators and denominators", value: `(${A.n} × ${B.n}) / (${A.d} × ${B.d}) = ${A.n * B.n}/${A.d * B.d}` });
  } else {
    steps.push({ step: "Flip the second fraction and multiply", value: `${fracLabel(A)} × ${B.d}/${B.n}` });
    steps.push({ step: "Multiply across", value: `${A.n * B.d}/${A.d * B.n}` });
  }
  steps.push({ step: "Simplify", value: fracLabel(R) });
  if (R.d !== 1 && Math.abs(R.n) > R.d) steps.push({ step: "As a mixed number", value: mixedLabel(R) });
  return {
    valid: true,
    error: "",
    resultLabel: fracLabel(R),
    mixedLabel: mixedLabel(R),
    decimalLabel: decimal(R),
    percentLabel: `${((R.n / R.d) * 100).toLocaleString("en-US", { maximumFractionDigits: 6 })}%`,
    aLabel: fracLabel(A),
    bLabel: fracLabel(B),
    steps,
  };
}
