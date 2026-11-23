// PURE compute for the Time Card Calculator. See BUILD-STANDARD §2.
// Each row is a shift: clock in, clock out (overnight if out < in) and an
// unpaid break. Weekly hours over the overtime threshold (FLSA default: 40)
// are paid at the overtime multiplier.

import { round2 } from "../../lib/calculator/finance.ts";
import type { RowValue } from "../../lib/calculator/types.ts";
import { parseTime, spanMinutes, hoursMinutesLabel, formatClock, decimalHours } from "../../lib/calculator/times.ts";

export type TimeCardInputs = { shifts: RowValue[]; rate: number; otAfter: number; otMultiplier: "1.5" | "2" };

export type TimeCardResults = {
  totalMinutes: number;
  totalLabel: string;
  totalDecimal: number;
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  shiftCount: number;
  incomplete: number; // rows with a time missing
  rows: { day: string; span: string; worked: string; decimal: number }[];
};

export function computeTimeCard(v: TimeCardInputs): TimeCardResults {
  const rate = Math.min(1e6, Math.max(0, Number(v.rate) || 0));
  const otAfter = Math.min(168, Math.max(0, Number(v.otAfter) || 0));
  const mult = v.otMultiplier === "2" ? 2 : 1.5;
  let total = 0, incomplete = 0;
  const rows: TimeCardResults["rows"] = [];
  (v.shifts ?? []).forEach((r, i) => {
    const day = String(r.day ?? "").trim() || `Day ${i + 1}`;
    const a = parseTime(String(r.in ?? "")), b = parseTime(String(r.out ?? ""));
    if (a === null || b === null) {
      if (a !== null || b !== null) incomplete++;
      return;
    }
    const brk = Math.min(1440, Math.max(0, Math.round(Number(r.break) || 0)));
    const worked = a === b ? 0 : Math.max(0, spanMinutes(a, b) - brk);
    total += worked;
    rows.push({ day, span: `${formatClock(a)} – ${formatClock(b)}${b < a ? " (+1 day)" : ""}`, worked: hoursMinutesLabel(worked), decimal: decimalHours(worked) });
  });
  const hours = total / 60;
  const reg = otAfter > 0 ? Math.min(hours, otAfter) : hours;
  const ot = Math.max(0, hours - reg);
  return {
    totalMinutes: total,
    totalLabel: hoursMinutesLabel(total),
    totalDecimal: decimalHours(total),
    regularHours: round2(reg),
    overtimeHours: round2(ot),
    regularPay: round2(reg * rate),
    overtimePay: round2(ot * rate * mult),
    totalPay: round2(reg * rate + ot * rate * mult),
    shiftCount: rows.length,
    incomplete,
    rows,
  };
}
