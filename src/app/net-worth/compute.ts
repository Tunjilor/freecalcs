// PURE compute for the Net Worth Calculator. See BUILD-STANDARD §2.
// Assets − liabilities, with a liquid net worth and a simple age-based
// benchmark (the "age × income ÷ 10" rule of thumb from The Millionaire Next Door).

import { round2 } from "../../lib/calculator/finance.ts";

export type NetWorthInputs = {
  cash: number;
  retirement: number; // 401(k), IRA
  investments: number; // brokerage, crypto, etc.
  homeValue: number;
  vehicles: number;
  otherAssets: number;
  mortgage: number;
  carLoans: number;
  studentLoans: number;
  creditCards: number;
  otherDebts: number;
  age: number;
  annualIncome: number;
};

export type NetWorthResults = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidNetWorth: number; // cash + investments − non-mortgage debts
  homeEquity: number;
  debtToAssetPct: number;
  benchmark: number; // age × income ÷ 10
  vsBenchmarkPct: number; // net worth ÷ benchmark × 100
  rows: { item: string; side: string; amount: number }[];
};

export function computeNetWorth(v: NetWorthInputs): NetWorthResults {
  const n = (x: number) => Math.max(0, x);
  const assets = [
    ["Cash & savings", v.cash],
    ["Retirement accounts", v.retirement],
    ["Investments", v.investments],
    ["Home value", v.homeValue],
    ["Vehicles", v.vehicles],
    ["Other assets", v.otherAssets],
  ] as const;
  const debts = [
    ["Mortgage", v.mortgage],
    ["Car loans", v.carLoans],
    ["Student loans", v.studentLoans],
    ["Credit cards", v.creditCards],
    ["Other debts", v.otherDebts],
  ] as const;

  const totalAssets = assets.reduce((a, [, x]) => a + n(x), 0);
  const totalLiabilities = debts.reduce((a, [, x]) => a + n(x), 0);
  const nonMortgageDebt = totalLiabilities - n(v.mortgage);
  const netWorth = totalAssets - totalLiabilities;
  const benchmark = (n(v.age) * n(v.annualIncome)) / 10;

  return {
    totalAssets: round2(totalAssets),
    totalLiabilities: round2(totalLiabilities),
    netWorth: round2(netWorth),
    liquidNetWorth: round2(n(v.cash) + n(v.investments) - nonMortgageDebt),
    homeEquity: round2(n(v.homeValue) - n(v.mortgage)),
    debtToAssetPct: totalAssets > 0 ? round2((totalLiabilities / totalAssets) * 100) : 0,
    benchmark: round2(benchmark),
    vsBenchmarkPct: benchmark > 0 ? round2((netWorth / benchmark) * 100) : 0,
    rows: [
      ...assets.filter(([, x]) => n(x) > 0).map(([item, x]) => ({ item, side: "Asset", amount: n(x) })),
      ...debts.filter(([, x]) => n(x) > 0).map(([item, x]) => ({ item, side: "Debt", amount: -n(x) })),
    ],
  };
}
