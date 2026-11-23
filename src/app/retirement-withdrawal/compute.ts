// PURE compute for the Retirement Withdrawal ("How long will my money last?")
// Calculator. See BUILD-STANDARD §2. Monthly simulation: the balance earns the
// return, then the withdrawal is taken; withdrawals rise with inflation each
// year. Also reports the first-year withdrawal rate (vs the 4% rule) and the
// sustainable starting withdrawal for the chosen horizon (bisection).

import { round2 } from "../../lib/calculator/finance.ts";

export type RetirementWithdrawalInputs = {
  savings: number;
  monthlyWithdrawal: number; // first-year, today's dollars
  annualReturn: number; // %
  inflation: number; // % (withdrawals grow by this each year)
  yearsNeeded: number; // horizon for the "sustainable withdrawal" answer
};

export type RetirementWithdrawalResults = {
  lastsMonths: number; // −1 = lasts beyond 100 years
  lastsLabel: string;
  withdrawalRatePct: number;
  sustainableMonthly: number; // starting withdrawal that lasts exactly yearsNeeded
  balanceAtHorizon: number; // with the chosen withdrawal, after yearsNeeded
  totalWithdrawn: number; // over the life of the money (capped at 100 yrs)
  path: { x: string; y: number }[];
};

function simulate(start: number, w0: number, ret: number, inf: number, maxMonths: number) {
  const r = Math.pow(1 + ret / 100, 1 / 12) - 1;
  let bal = start;
  let w = w0;
  let withdrawn = 0;
  const yearly: number[] = [start];
  for (let m = 1; m <= maxMonths; m++) {
    bal *= 1 + r;
    const take = Math.min(w, bal);
    bal -= take;
    withdrawn += take;
    if (m % 12 === 0) {
      yearly.push(bal);
      w *= 1 + inf / 100;
    }
    if (bal <= 0.005) return { months: m, bal: 0, withdrawn, yearly };
  }
  return { months: -1, bal, withdrawn, yearly };
}

export function computeRetirementWithdrawal(v: RetirementWithdrawalInputs): RetirementWithdrawalResults {
  const S = Math.max(0, v.savings);
  const w = Math.max(0, v.monthlyWithdrawal);
  const horizon = Math.max(1, Math.round(v.yearsNeeded * 12));
  const sim = w > 0 ? simulate(S, w, v.annualReturn, v.inflation, 1200) : { months: -1, bal: S, withdrawn: 0, yearly: [S] };
  const atH = simulate(S, w, v.annualReturn, v.inflation, horizon);

  let lo = 0;
  let hi = S;
  if (S > 0) {
    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      const s = simulate(S, mid, v.annualReturn, v.inflation, horizon);
      if (s.months === -1) lo = mid;
      else hi = mid;
    }
  }

  const label =
    sim.months < 0
      ? "100+ years"
      : `${Math.floor(sim.months / 12)} yr${sim.months % 12 ? ` ${sim.months % 12} mo` : ""}`;

  const path = sim.yearly.slice(0, 61).map((y, i) => ({ x: `Yr ${i}`, y: round2(Math.max(0, y)) }));
  if (sim.months > 0 && sim.months % 12 !== 0 && path.length <= 60) path.push({ x: `Yr ${Math.ceil(sim.months / 12)}`, y: 0 });

  return {
    lastsMonths: sim.months,
    lastsLabel: w > 0 ? label : "—",
    withdrawalRatePct: S > 0 ? round2(((w * 12) / S) * 100) : 0,
    sustainableMonthly: round2(lo),
    balanceAtHorizon: round2(atH.months === -1 ? atH.bal : 0),
    totalWithdrawn: round2(sim.withdrawn),
    path,
  };
}
