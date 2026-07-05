// PURE compute for the Debt Payoff Calculator (snowball vs avalanche).
//
// Simulates paying off up to five debts month by month under both strategies:
//   • Snowball  — target the smallest balance first (motivational quick wins).
//   • Avalanche — target the highest APR first (mathematically cheapest).
// In both, the total monthly outlay stays constant (sum of all minimums + your
// extra); when a debt is cleared, its payment rolls to the next target.
//
// Self-contained, deterministic, unit-tested. Debts are entered as fixed slots
// (d1..d5); a slot with a zero balance is ignored. This keeps the calculator
// within the shared InputField schema (no dynamic-list input type exists).

export type DebtPayoffInputs = {
  d1Balance: number; d1Apr: number; d1Min: number;
  d2Balance: number; d2Apr: number; d2Min: number;
  d3Balance: number; d3Apr: number; d3Min: number;
  d4Balance: number; d4Apr: number; d4Min: number;
  d5Balance: number; d5Apr: number; d5Min: number;
  extra: number;
  method: "avalanche" | "snowball";
};

type Debt = { idx: number; label: string; balance: number; monthlyRate: number; min: number; apr: number };

export type PayoffStep = { label: string; month: number };
export type BalancePoint = { month: number; balance: number };

type Sim = {
  months: number;
  totalInterest: number;
  totalPaid: number;
  payoffOrder: PayoffStep[];
  series: BalancePoint[];
  paysOff: boolean;
};

export type DebtPayoffResults = {
  debtCount: number;
  totalStartingBalance: number;
  totalMinimum: number;
  monthlyOutlay: number; // minimums + extra
  method: "avalanche" | "snowball";
  paysOff: boolean;

  selMonths: number;
  debtFreeLabel: string; // "X yr Y mo" or "Not on this plan"
  selTotalInterest: number;
  selTotalPaid: number;
  payoffOrder: PayoffStep[];

  avalancheMonths: number;
  snowballMonths: number;
  avalancheInterest: number;
  snowballInterest: number;
  betterMethod: "avalanche" | "snowball" | "tie";
  interestSavedByAvalanche: number; // snowball − avalanche (≥0 typically)
  monthsSavedByAvalanche: number;

  monthsSavedByExtra: number;
  interestSavedByExtra: number;

  highestAprLabel: string;
  highestApr: number;

  schedule: BalancePoint[]; // selected method, total balance over time
};

const round2 = (n: number) => Math.round(n * 100) / 100;

function monthsLabel(total: number): string {
  const t = Math.max(0, Math.round(total));
  const y = Math.floor(t / 12);
  const m = t % 12;
  if (t === 0) return "0 mo";
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

function collectDebts(v: DebtPayoffInputs): Debt[] {
  const raw = [
    { b: v.d1Balance, a: v.d1Apr, m: v.d1Min },
    { b: v.d2Balance, a: v.d2Apr, m: v.d2Min },
    { b: v.d3Balance, a: v.d3Apr, m: v.d3Min },
    { b: v.d4Balance, a: v.d4Apr, m: v.d4Min },
    { b: v.d5Balance, a: v.d5Apr, m: v.d5Min },
  ];
  const debts: Debt[] = [];
  raw.forEach((d, i) => {
    if (d.b > 0) {
      debts.push({
        idx: debts.length,
        label: `Debt ${i + 1}`,
        balance: Math.max(0, d.b),
        monthlyRate: Math.max(0, d.a) / 100 / 12,
        min: Math.max(0, d.m),
        apr: Math.max(0, d.a),
      });
    }
  });
  return debts;
}

/** Order (indices into `debts`) the targets are attacked in for a strategy. */
function orderFor(debts: Debt[], method: "avalanche" | "snowball"): number[] {
  const idx = debts.map((d) => d.idx);
  if (method === "avalanche") {
    // highest APR first; tie → larger balance first
    return idx.sort((a, b) => debts[b].apr - debts[a].apr || debts[b].balance - debts[a].balance);
  }
  // snowball: smallest balance first; tie → higher APR first
  return idx.sort((a, b) => debts[a].balance - debts[b].balance || debts[b].apr - debts[a].apr);
}

function simulate(debts: Debt[], extra: number, order: number[]): Sim {
  const bal = debts.map((d) => d.balance);
  const totalMin = debts.reduce((s, d) => s + d.min, 0);
  const pool0 = totalMin + Math.max(0, extra);
  const payoffOrder: PayoffStep[] = [];
  const series: BalancePoint[] = [];
  const done = new Set<number>();
  let totalInterest = 0;
  let totalPaid = 0;
  const CAP = 1200; // 100-year safety cap for non-amortizing inputs
  const active = () => bal.some((b) => b > 0.005);

  let month = 0;
  for (month = 1; month <= CAP && active(); month++) {
    // 1. accrue interest
    for (let i = 0; i < debts.length; i++) {
      if (bal[i] > 0.005) {
        const it = bal[i] * debts[i].monthlyRate;
        bal[i] += it;
        totalInterest += it;
      }
    }
    // 2. pay minimums on active debts
    let pool = pool0;
    for (let i = 0; i < debts.length; i++) {
      if (bal[i] > 0.005) {
        const pay = Math.min(debts[i].min, bal[i], pool);
        bal[i] -= pay;
        pool -= pay;
        totalPaid += pay;
      }
    }
    // 3. throw everything left at the target(s) in order
    for (const i of order) {
      if (pool <= 0.005) break;
      if (bal[i] > 0.005) {
        const pay = Math.min(pool, bal[i]);
        bal[i] -= pay;
        pool -= pay;
        totalPaid += pay;
      }
    }
    // 4. record any debt cleared this month
    for (let i = 0; i < debts.length; i++) {
      if (bal[i] <= 0.005 && !done.has(i)) {
        bal[i] = 0;
        done.add(i);
        payoffOrder.push({ label: debts[i].label, month });
      }
    }
    series.push({ month, balance: round2(bal.reduce((s, b) => s + Math.max(0, b), 0)) });
  }

  return {
    months: series.length,
    totalInterest,
    totalPaid,
    payoffOrder,
    series,
    paysOff: !active(),
  };
}

export function computeDebtPayoff(v: DebtPayoffInputs): DebtPayoffResults {
  const debts = collectDebts(v);
  const extra = Math.max(0, v.extra);
  const totalStartingBalance = debts.reduce((s, d) => s + d.balance, 0);
  const totalMinimum = debts.reduce((s, d) => s + d.min, 0);

  // Empty state: nothing entered yet.
  if (debts.length === 0) {
    return {
      debtCount: 0, totalStartingBalance: 0, totalMinimum: 0, monthlyOutlay: round2(extra),
      method: v.method, paysOff: true, selMonths: 0, debtFreeLabel: "0 mo",
      selTotalInterest: 0, selTotalPaid: 0, payoffOrder: [],
      avalancheMonths: 0, snowballMonths: 0, avalancheInterest: 0, snowballInterest: 0,
      betterMethod: "tie", interestSavedByAvalanche: 0, monthsSavedByAvalanche: 0,
      monthsSavedByExtra: 0, interestSavedByExtra: 0,
      highestAprLabel: "", highestApr: 0, schedule: [],
    };
  }

  const aval = simulate(debts, extra, orderFor(debts, "avalanche"));
  const snow = simulate(debts, extra, orderFor(debts, "snowball"));
  const sel = v.method === "snowball" ? snow : aval;

  // Extra-payment impact: same method, no extra.
  const selNoExtra = simulate(debts, 0, orderFor(debts, v.method));

  const interestSavedByAvalanche = round2(snow.totalInterest - aval.totalInterest);
  const monthsSavedByAvalanche = snow.months - aval.months;
  const betterMethod: "avalanche" | "snowball" | "tie" =
    Math.abs(aval.totalInterest - snow.totalInterest) < 0.5
      ? "tie"
      : aval.totalInterest < snow.totalInterest
        ? "avalanche"
        : "snowball";

  const highest = debts.reduce((a, b) => (b.apr > a.apr ? b : a), debts[0]);

  return {
    debtCount: debts.length,
    totalStartingBalance: round2(totalStartingBalance),
    totalMinimum: round2(totalMinimum),
    monthlyOutlay: round2(totalMinimum + extra),
    method: v.method,
    paysOff: sel.paysOff,

    selMonths: sel.months,
    debtFreeLabel: sel.paysOff ? monthsLabel(sel.months) : "Not on this plan",
    selTotalInterest: round2(sel.totalInterest),
    selTotalPaid: round2(sel.totalPaid),
    payoffOrder: sel.payoffOrder,

    avalancheMonths: aval.months,
    snowballMonths: snow.months,
    avalancheInterest: round2(aval.totalInterest),
    snowballInterest: round2(snow.totalInterest),
    betterMethod,
    interestSavedByAvalanche,
    monthsSavedByAvalanche,

    monthsSavedByExtra: sel.paysOff && selNoExtra.paysOff ? selNoExtra.months - sel.months : 0,
    interestSavedByExtra:
      sel.paysOff && selNoExtra.paysOff ? round2(selNoExtra.totalInterest - sel.totalInterest) : 0,

    highestAprLabel: highest.label,
    highestApr: highest.apr,

    schedule: sel.series,
  };
}
