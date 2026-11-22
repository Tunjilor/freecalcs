// Pure state machine for the homepage's basic calculator. No DOM, no React:
// the component feeds it keys and renders the returned state, and the tests
// drive it the same way.
//
// Behaviour follows a standard pocket calculator:
// - Operations run left to right as they're entered (2 + 3 × 4 = 20), and the
//   running result shows as soon as the next operator is pressed.
// - Results are rounded to 12 significant digits, so 0.1 + 0.2 shows 0.3.
// - % divides the entry by 100, except after + or −, where it means "percent of
//   the running total": 200 + 10% gives 20, so the result is 220.
// - Dividing by zero shows "Error". The next digit starts a new calculation,
//   and operators do nothing until then.

export type Operator = "+" | "-" | "*" | "/";
export type CalcKey =
  | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "." | Operator | "%" | "=" | "clear" | "backspace";

export type CalcState = {
  display: string; // what the main readout shows
  acc: number | null; // running total, waiting for the next operand
  op: Operator | null; // pending operator
  overwrite: boolean; // next digit replaces the display instead of appending
  error: boolean;
  expression: string; // the small line above the readout, e.g. "12 ×"
};

export const ERROR_TEXT = "Error";
const MAX_DIGITS = 15;

export const OP_SYMBOL: Record<Operator, string> = { "+": "+", "-": "−", "*": "×", "/": "÷" };

export const initialState: CalcState = {
  display: "0",
  acc: null,
  op: null,
  overwrite: true,
  error: false,
  expression: "",
};

/** Round away binary floating-point noise (0.30000000000000004 → 0.3) and print. */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return ERROR_TEXT;
  const rounded = Number(n.toPrecision(12));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function apply(a: number, op: Operator, b: number): number | null {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? null : a / b;
  }
}

const errorState = (): CalcState => ({ ...initialState, display: ERROR_TEXT, error: true });

export function pressKey(s: CalcState, key: CalcKey): CalcState {
  if (key === "clear") return initialState;

  if (s.error) {
    // After an error only a fresh number (or clear) does anything.
    if (/^[0-9.]$/.test(key)) return pressKey(initialState, key);
    return s;
  }

  if (/^[0-9]$/.test(key)) {
    if (s.overwrite) return { ...s, display: key, overwrite: false };
    if (s.display.replace(/[-.]/g, "").length >= MAX_DIGITS) return s;
    return { ...s, display: s.display === "0" ? key : s.display + key };
  }

  if (key === ".") {
    if (s.overwrite) return { ...s, display: "0.", overwrite: false };
    if (s.display.includes(".")) return s;
    return { ...s, display: s.display + "." };
  }

  if (key === "backspace") {
    if (s.overwrite) return s;
    const next = s.display.slice(0, -1);
    return { ...s, display: next === "" || next === "-" ? "0" : next };
  }

  const entry = Number(s.display);

  if (key === "+" || key === "-" || key === "*" || key === "/") {
    // Changing your mind about the operator just swaps it.
    if (s.op !== null && s.overwrite && s.acc !== null) {
      return { ...s, op: key, expression: `${formatNumber(s.acc)} ${OP_SYMBOL[key]}` };
    }
    let acc = entry;
    if (s.op !== null && s.acc !== null) {
      const r = apply(s.acc, s.op, entry);
      if (r === null) return errorState();
      acc = r;
    }
    const shown = formatNumber(acc);
    return { display: shown, acc, op: key, overwrite: true, error: false, expression: `${shown} ${OP_SYMBOL[key]}` };
  }

  if (key === "%") {
    const value = s.acc !== null && (s.op === "+" || s.op === "-") ? (s.acc * entry) / 100 : entry / 100;
    return { ...s, display: formatNumber(value), overwrite: true };
  }

  if (key === "=") {
    if (s.op === null || s.acc === null) return { ...s, display: formatNumber(entry), overwrite: true };
    const r = apply(s.acc, s.op, entry);
    if (r === null) return errorState();
    return {
      display: formatNumber(r),
      acc: null,
      op: null,
      overwrite: true,
      error: false,
      expression: `${formatNumber(s.acc)} ${OP_SYMBOL[s.op]} ${formatNumber(entry)} =`,
    };
  }

  return s;
}

/** Map a KeyboardEvent.key to a calculator key, or null if it isn't one. */
export function keyFromKeyboard(k: string): CalcKey | null {
  if (/^[0-9]$/.test(k)) return k as CalcKey;
  switch (k) {
    case ".":
    case ",":
      return ".";
    case "+":
    case "-":
    case "*":
    case "/":
    case "%":
    case "=":
      return k;
    case "x":
    case "X":
      return "*";
    case "Enter":
      return "=";
    case "Backspace":
      return "backspace";
    case "Escape":
    case "Delete":
    case "c":
    case "C":
      return "clear";
    default:
      return null;
  }
}

/** Run a sequence of keys from the initial state (handy for tests). */
export function run(keys: CalcKey[], from: CalcState = initialState): CalcState {
  return keys.reduce(pressKey, from);
}
