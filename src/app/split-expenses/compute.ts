// PURE compute for the Split Expenses ("settle up") Calculator. BUILD-STANDARD §2.
// Everyone owes an equal share of the total. Each person's balance = paid − share.
// Settlements: repeatedly match the largest debtor with the largest creditor,
// which settles everyone in at most (people − 1) payments.

import { round2 } from "../../lib/calculator/finance.ts";
import type { RowValue } from "../../lib/calculator/types.ts";

export type SplitExpensesInputs = { people: RowValue[] };

export type SplitExpensesResults = {
  total: number;
  share: number;
  personCount: number;
  paymentCount: number;
  balances: { person: string; paid: number; balance: number }[];
  settlements: { from: string; to: string; amount: number }[];
  allEven: boolean;
};

export function computeSplitExpenses(v: SplitExpensesInputs): SplitExpensesResults {
  const people = (v.people ?? [])
    .map((r, i) => ({ person: String(r.person ?? "").trim() || `Person ${i + 1}`, paid: Math.max(0, Number(r.paid) || 0) }));
  const n = people.length;
  const total = people.reduce((a, p) => a + p.paid, 0);
  const share = n > 0 ? total / n : 0;
  // Work in cents to avoid rounding drift.
  const cents = people.map((p) => ({ person: p.person, bal: Math.round(p.paid * 100) - Math.round(share * 100) }));
  // Fix any rounding remainder on the largest payer so balances sum to zero.
  const drift = cents.reduce((a, c) => a + c.bal, 0);
  if (drift !== 0 && cents.length) cents.reduce((m, c) => (c.bal > m.bal ? c : m)).bal -= drift;

  const debtors = cents.filter((c) => c.bal < 0).map((c) => ({ ...c, bal: -c.bal })).sort((a, b) => b.bal - a.bal);
  const creditors = cents.filter((c) => c.bal > 0).map((c) => ({ ...c })).sort((a, b) => b.bal - a.bal);
  const settlements: { from: string; to: string; amount: number }[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].bal, creditors[j].bal);
    if (amt > 0) settlements.push({ from: debtors[i].person, to: creditors[j].person, amount: amt / 100 });
    debtors[i].bal -= amt;
    creditors[j].bal -= amt;
    if (debtors[i].bal === 0) i++;
    if (creditors[j].bal === 0) j++;
  }
  return {
    total: round2(total),
    share: round2(share),
    personCount: n,
    paymentCount: settlements.length,
    // Balances use the same cent figures as the settlements, so they always agree.
    balances: people.map((p, k) => ({ person: p.person, paid: round2(p.paid), balance: cents[k].bal / 100 })),
    settlements,
    allEven: settlements.length === 0,
  };
}
