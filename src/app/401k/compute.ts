// PURE compute for the 401(k) Calculator. Uses shared finance.ts growth helpers
// and retirement-data.ts for the year-labeled, IRS-sourced contribution limits.
// Models the employer match formula, the annual elective-deferral limit
// (age-aware, including the distinct SECURE 2.0 ages-60–63 catch-up), and the
// match dollars left on the table by under-contributing.

import { futureValue, futureValueOfSeries, round2 } from "../../lib/calculator/finance.ts";
import {
  contributionLimit,
  catchUpTier,
  type PlanYear,
} from "../../lib/calculator/retirement-data.ts";

export type FourOhOneKInputs = {
  year: PlanYear;
  currentAge: number;
  retirementAge: number;
  salary: number;
  contributionPercent: number; // % of salary the employee defers
  employerMatchRate: number; // % of employee contribution the employer matches (e.g. 50)
  employerMatchLimitPercent: number; // matched up to this % of salary (e.g. 6)
  annualReturn: number; // %
  currentBalance: number;
};

export type FourOhOneKResults = {
  years: number;
  limit: number; // age-aware elective-deferral limit for the year
  catchUp: "none" | "standard" | "super";
  requestedEmployeeAnnual: number; // salary × contribution%
  employeeAnnual: number; // capped at the limit
  overLimit: boolean;
  roomToLimit: number; // limit − requested (0 if at/over)
  employerAnnual: number; // employer match captured
  fullEmployerAnnual: number; // match if you contributed up to the match cap
  matchLeftOnTable: number; // annual employer dollars missed
  totalAnnual: number; // employee + employer
  balanceAtRetirement: number;
  employerMatchGrown: number; // FV attributable to the employer match
  chart: { x: string; y: number }[];
};

export function computeFourOhOneK(v: FourOhOneKInputs): FourOhOneKResults {
  const years = Math.max(0, Math.round(v.retirementAge) - Math.round(v.currentAge));
  const months = years * 12;
  const monthlyRate = v.annualReturn / 100 / 12;
  const salary = Math.max(0, v.salary);
  const contribPct = Math.max(0, v.contributionPercent);

  const limit = contributionLimit(v.year, Math.round(v.currentAge));
  const requestedEmployeeAnnual = salary * (contribPct / 100);
  const employeeAnnual = Math.min(requestedEmployeeAnnual, limit);
  const overLimit = requestedEmployeeAnnual > limit;
  const roomToLimit = Math.max(0, limit - requestedEmployeeAnnual);

  // Employer match: matchRate% of contributions, but only up to matchLimit% of salary.
  const matchRate = Math.max(0, v.employerMatchRate) / 100;
  const matchCapPct = Math.max(0, v.employerMatchLimitPercent) / 100;
  const matchedContribPct = Math.min(contribPct / 100, matchCapPct);
  const employerAnnual = salary * matchedContribPct * matchRate;
  const fullEmployerAnnual = salary * matchCapPct * matchRate;
  const matchLeftOnTable = Math.max(0, fullEmployerAnnual - employerAnnual);

  const totalAnnual = employeeAnnual + employerAnnual;
  const totalMonthly = totalAnnual / 12;
  const employerMonthly = employerAnnual / 12;

  const balanceAtRetirement =
    futureValue(Math.max(0, v.currentBalance), monthlyRate, months) +
    futureValueOfSeries(totalMonthly, monthlyRate, months);
  const employerMatchGrown = futureValueOfSeries(employerMonthly, monthlyRate, months);

  const chart: { x: string; y: number }[] = [];
  for (let y = 0; y <= years; y++) {
    const m = y * 12;
    chart.push({
      x: `Age ${Math.round(v.currentAge) + y}`,
      y: round2(
        futureValue(Math.max(0, v.currentBalance), monthlyRate, m) +
          futureValueOfSeries(totalMonthly, monthlyRate, m),
      ),
    });
  }

  return {
    years,
    limit,
    catchUp: catchUpTier(Math.round(v.currentAge)),
    requestedEmployeeAnnual: round2(requestedEmployeeAnnual),
    employeeAnnual: round2(employeeAnnual),
    overLimit,
    roomToLimit: round2(roomToLimit),
    employerAnnual: round2(employerAnnual),
    fullEmployerAnnual: round2(fullEmployerAnnual),
    matchLeftOnTable: round2(matchLeftOnTable),
    totalAnnual: round2(totalAnnual),
    balanceAtRetirement: round2(balanceAtRetirement),
    employerMatchGrown: round2(employerMatchGrown),
    chart,
  };
}
