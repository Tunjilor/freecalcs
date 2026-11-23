// PURE compute for the APY Calculator. See BUILD-STANDARD §2.
// APY = (1 + r/n)^n − 1 for n compounding periods a year; continuous
// compounding uses e^r − 1. Balances grow at the APY; monthly deposits are
// added at the end of each month and grow at the equivalent monthly rate.

import { round2 } from "../../lib/calculator/finance.ts";

export type Compounding = "daily" | "monthly" | "quarterly" | "semiannual" | "annual" | "continuous";

export type ApyInputs = {
  rate: number; // stated annual rate (APR / nominal), %
  compounding: Compounding;
  deposit: number;
  monthly: number;
  years: number;
};

export type ApyResults = {
  apy: number; // %
  apyLabel: string; // "5.127%"
  boost: number; // apy − rate, percentage points
  endBalance: number;
  interest: number;
  totalDeposits: number;
  firstYearInterest: number;
  byCompounding: { compounding: string; apy: string; interest: number }[];
  path: { x: string; y: number }[];
};

export const PERIODS: Record<Compounding, number> = { daily: 365, monthly: 12, quarterly: 4, semiannual: 2, annual: 1, continuous: Infinity };
const LABEL: Record<Compounding, string> = { daily: "Daily", monthly: "Monthly", quarterly: "Quarterly", semiannual: "Semiannually", annual: "Annually", continuous: "Continuously" };

export function apyFrom(ratePct: number, c: Compounding): number {
  const r = ratePct / 100;
  const n = PERIODS[c];
  return (n === Infinity ? Math.exp(r) - 1 : Math.pow(1 + r / n, n) - 1) * 100;
}

function grow(deposit: number, monthly: number, apyPct: number, years: number) {
  const g = Math.pow(1 + apyPct / 100, 1 / 12); // monthly growth factor
  let bal = deposit;
  const path = [{ x: "Now", y: round2(bal) }];
  const months = Math.round(years * 12);
  for (let m = 1; m <= months; m++) {
    bal = bal * g + monthly;
    if (m % 12 === 0 || m === months) path.push({ x: m % 12 === 0 ? `Yr ${m / 12}` : `Mo ${m}`, y: round2(bal) });
  }
  return { bal, path };
}

export function computeApy(v: ApyInputs): ApyResults {
  const rate = Math.min(100, Math.max(0, Number(v.rate) || 0));
  const deposit = Math.max(0, Number(v.deposit) || 0);
  const monthly = Math.max(0, Number(v.monthly) || 0);
  const years = Math.min(100, Math.max(0, Number(v.years) || 0));
  const c: Compounding = v.compounding in PERIODS ? v.compounding : "daily";
  const apy = apyFrom(rate, c);
  const { bal, path } = grow(deposit, monthly, apy, years);
  const totalDeposits = deposit + monthly * Math.round(years * 12);
  return {
    apy: Math.round(apy * 1000) / 1000,
    apyLabel: `${apy.toFixed(3)}%`,
    boost: Math.round((apy - rate) * 1000) / 1000,
    endBalance: round2(bal),
    interest: round2(bal - totalDeposits),
    totalDeposits: round2(totalDeposits),
    firstYearInterest: round2(deposit * (apy / 100)),
    byCompounding: (Object.keys(PERIODS) as Compounding[]).map((k) => {
      const a = apyFrom(rate, k);
      const g = grow(deposit, monthly, a, years);
      return { compounding: LABEL[k], apy: `${a.toFixed(3)}%`, interest: round2(g.bal - totalDeposits) };
    }),
    path,
  };
}
