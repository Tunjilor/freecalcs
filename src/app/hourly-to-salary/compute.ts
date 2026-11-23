// PURE compute for the Hourly to Salary Calculator. See BUILD-STANDARD §2.
// Converts an hourly wage to annual, monthly, biweekly, weekly and daily gross
// pay, with paid/unpaid time off and overtime at 1.5×.

import { round2 } from "../../lib/calculator/finance.ts";

export type HourlyInputs = {
  hourlyRate: number;
  hoursPerWeek: number; // regular hours
  overtimeHours: number; // per week, paid at 1.5×
  weeksPerYear: number; // weeks paid (52 minus unpaid time off)
};

export type HourlyResults = {
  annual: number;
  monthly: number;
  biweekly: number;
  weekly: number;
  daily: number; // weekly ÷ 5
  regularAnnual: number;
  overtimeAnnual: number;
  effectiveHourly: number; // annual ÷ (52 × total hours)
  annualAt2080: number; // the classic 40 × 52 shortcut
  rows: { period: string; amount: number }[];
};

export function computeHourly(v: HourlyInputs): HourlyResults {
  const rate = Math.max(0, v.hourlyRate);
  const hrs = Math.max(0, v.hoursPerWeek);
  const ot = Math.max(0, v.overtimeHours);
  const weeks = Math.min(52, Math.max(0, v.weeksPerYear));

  const weekly = rate * hrs + rate * 1.5 * ot;
  const regularAnnual = rate * hrs * weeks;
  const overtimeAnnual = rate * 1.5 * ot * weeks;
  const annual = regularAnnual + overtimeAnnual;
  const totalHours = (hrs + ot) * 52;

  const out = {
    annual: round2(annual),
    monthly: round2(annual / 12),
    biweekly: round2(annual / 26),
    weekly: round2(annual / 52),
    daily: round2(weekly / 5),
    regularAnnual: round2(regularAnnual),
    overtimeAnnual: round2(overtimeAnnual),
    effectiveHourly: totalHours > 0 ? round2(annual / totalHours) : 0,
    annualAt2080: round2(rate * 2080),
  };
  return {
    ...out,
    rows: [
      { period: "Year", amount: out.annual },
      { period: "Month", amount: out.monthly },
      { period: "Every 2 weeks", amount: out.biweekly },
      { period: "Week (averaged)", amount: out.weekly },
      { period: "Day (5-day week)", amount: out.daily },
    ],
  };
}
