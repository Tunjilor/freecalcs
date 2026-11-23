// PURE compute for the Present & Future Value Calculator. See BUILD-STANDARD §2.
//   FV = PV(1+i)^n + PMT × ((1+i)^n − 1) / i     (payments at period end)
//   PV of a future amount = FV / (1+i)^n
// with i the rate per compounding period and n the number of periods.

import { round2 } from "../../lib/calculator/finance.ts";

export type FutureValueInputs = {
  presentValue: number;
  periodicDeposit: number; // per compounding period
  rate: number; // annual %
  years: number;
  periodsPerYear: "1" | "4" | "12" | "365";
  targetFutureValue: number; // for the PV-of-a-goal answer (0 to skip)
};

export type FutureValueResults = {
  futureValue: number;
  totalDeposits: number;
  interestEarned: number;
  fvOfLumpSum: number;
  fvOfDeposits: number;
  presentValueOfTarget: number;
  effectiveAnnualRate: number;
  growthMultiple: number;
};

export function computeFutureValue(v: FutureValueInputs): FutureValueResults {
  const m = Number(v.periodsPerYear) || 12;
  const i = Math.max(0, v.rate) / 100 / m;
  const n = Math.max(0, Math.round(Math.max(0, v.years) * m));
  const pv = Math.max(0, v.presentValue);
  const pmt = Math.max(0, v.periodicDeposit);
  const g = Math.pow(1 + i, n);
  const fvLump = pv * g;
  const fvDep = i === 0 ? pmt * n : pmt * ((g - 1) / i);
  const fv = fvLump + fvDep;
  const deposits = pv + pmt * n;
  return {
    futureValue: round2(fv),
    totalDeposits: round2(deposits),
    interestEarned: round2(fv - deposits),
    fvOfLumpSum: round2(fvLump),
    fvOfDeposits: round2(fvDep),
    presentValueOfTarget: round2(Math.max(0, v.targetFutureValue) / g),
    effectiveAnnualRate: round2((Math.pow(1 + i, m) - 1) * 100),
    growthMultiple: pv > 0 ? round2(g) : 0,
  };
}
