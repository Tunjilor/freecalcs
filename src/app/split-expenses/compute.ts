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
  leftoverCents: number; // cents the person owed the most covers
  roundingCoveredBy: string;
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
  // Work in cents to avoid rounding drift.
  // Shares round DOWN to the cent; whoever is owed the most covers the leftover
  // cent or two, so nobody who owes money pays more than an exact split.
  const totalCents = people.reduce((a, p) => a + Math.round(p.paid * 100), 0);
  const shareCents = n > 0 ? Math.floor(totalCents / n) : 0;
  const cents = people.map((p) => ({ person: p.person, bal: Math.round(p.paid * 100) - shareCents }));
  // Balances now sum to the leftover cents; take them off the largest creditor.
  const drift = cents.reduce((a, c) => a + c.bal, 0);
  let roundingCoveredBy = "";
  if (drift !== 0 && cents.length) {
    const top = cents.reduce((m, c) => (c.bal > m.bal ? c : m));
    top.bal -= drift;
    roundingCoveredBy = top.person;
  }

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
    share: shareCents / 100,
    leftoverCents: totalCents - shareCents * n,
    roundingCoveredBy,
    personCount: n,
    paymentCount: settlements.length,
    // Balances use the same cent figures as the settlements, so they always agree.
    balances: people.map((p, k) => ({ person: p.person, paid: round2(p.paid), balance: cents[k].bal / 100 })),
    settlements,
    allEven: settlements.length === 0,
  };
}
