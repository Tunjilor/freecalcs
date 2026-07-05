// Shared amortization / loan math. Extracted from the per-calculator computes
// (VA, auto, personal, loan-payoff) that each re-declared it. These are the
// canonical, unit-tested implementations; calculators import them instead of
// keeping local copies. Behavior is intentionally identical to the prior local
// versions so no calculator's numbers change (proven by the existing suites).
//
// Imported by computes via a relative path WITH the `.ts` extension so that
// `node --test` resolves it (Node won't resolve the `@/` alias or an
// extensionless TS import); Next builds this fine.

export type AmortRow = {
  month: number;
  interest: number;
  principal: number;
  balance: number;
  cumulativeInterest: number;
};

export const round2 = (n: number) => Math.round(n * 100) / 100;

/** Standard amortization payment for a principal at a monthly rate over n months. */
export function monthlyPayment(principal: number, monthlyRate: number, n: number): number {
  if (n <= 0) return 0;
  if (monthlyRate <= 0) return principal / n;
  const f = Math.pow(1 + monthlyRate, n);
  return (principal * (monthlyRate * f)) / (f - 1);
}

/**
 * Amortize a loan over a scheduled term, optionally with a fixed extra principal
 * payment each month. Term-capped: extra payment only shortens it. This is the
 * shared version of the VA / auto / personal `amortize()` helper.
 */
export function amortizeSchedule(
  principal: number,
  monthlyRate: number,
  months: number,
  payment: number,
  extra = 0,
): { schedule: AmortRow[]; totalInterest: number; payoffMonths: number } {
  const schedule: AmortRow[] = [];
  let balance = principal;
  let cumulativeInterest = 0;
  const pay = payment + Math.max(0, extra);
  for (let m = 1; m <= months && balance > 0.005; m++) {
    const interest = balance * monthlyRate;
    let principalPaid = pay - interest;
    if (principalPaid > balance) principalPaid = balance;
    if (principalPaid < 0) principalPaid = 0; // guard: payment below interest
    balance -= principalPaid;
    cumulativeInterest += interest;
    schedule.push({
      month: m,
      interest: round2(interest),
      principal: round2(principalPaid),
      balance: round2(Math.max(0, balance)),
      cumulativeInterest: round2(cumulativeInterest),
    });
    if (principalPaid === 0) break; // never amortizes
  }
  return { schedule, totalInterest: cumulativeInterest, payoffMonths: schedule.length };
}

/**
 * Amortize a balance driven by a fixed payment (no scheduled term). Detects a
 * non-amortizing loan (payment ≤ monthly interest) and reports it. This is the
 * shared version of the loan-payoff `amortize()` helper.
 */
export function amortizeByPayment(
  balance0: number,
  monthlyRate: number,
  payment: number,
  cap = 1200,
): { schedule: AmortRow[]; totalInterest: number; payoffMonths: number; amortizes: boolean } {
  const schedule: AmortRow[] = [];
  let balance = balance0;
  let cumulativeInterest = 0;
  for (let m = 1; m <= cap && balance > 0.005; m++) {
    const interest = balance * monthlyRate;
    let principalPaid = payment - interest;
    if (principalPaid <= 0) {
      return { schedule, totalInterest: cumulativeInterest, payoffMonths: 0, amortizes: false };
    }
    if (principalPaid > balance) principalPaid = balance;
    balance -= principalPaid;
    cumulativeInterest += interest;
    schedule.push({
      month: m,
      interest: round2(interest),
      principal: round2(principalPaid),
      balance: round2(Math.max(0, balance)),
      cumulativeInterest: round2(cumulativeInterest),
    });
  }
  return { schedule, totalInterest: cumulativeInterest, payoffMonths: schedule.length, amortizes: true };
}

/**
 * Remaining balance after `monthsElapsed` payments on a loan. Useful for
 * refinance / HELOC math where you need how much principal is left. Pure.
 */
export function remainingBalance(
  principal: number,
  monthlyRate: number,
  payment: number,
  monthsElapsed: number,
): number {
  let balance = principal;
  for (let m = 0; m < monthsElapsed && balance > 0.005; m++) {
    const interest = balance * monthlyRate;
    let principalPaid = payment - interest;
    if (principalPaid > balance) principalPaid = balance;
    if (principalPaid < 0) principalPaid = 0;
    balance -= principalPaid;
  }
  return round2(Math.max(0, balance));
}

/** Total interest paid over a fully amortized loan (convenience). */
export function totalInterest(
  principal: number,
  monthlyRate: number,
  months: number,
  payment: number,
): number {
  return round2(amortizeSchedule(principal, monthlyRate, months, payment).totalInterest);
}

// ---- Investment / time-value-of-money helpers ------------------------------
// Additive: these don't touch the amortization helpers above. Rates are per
// period as a fraction (e.g. 0.005 monthly), consistent with the loan helpers.

/** Future value of a lump sum: pv × (1 + r)^n. */
export function futureValue(presentValue: number, ratePerPeriod: number, periods: number): number {
  if (periods <= 0) return presentValue;
  return presentValue * Math.pow(1 + ratePerPeriod, periods);
}

/**
 * Future value of a level series of payments (an annuity). Ordinary (end-of-
 * period) by default; pass `due = true` for beginning-of-period contributions.
 * Handles a zero rate as pmt × periods.
 */
export function futureValueOfSeries(
  payment: number,
  ratePerPeriod: number,
  periods: number,
  due = false,
): number {
  if (periods <= 0) return 0;
  const fv =
    ratePerPeriod === 0
      ? payment * periods
      : payment * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod);
  return due ? fv * (1 + ratePerPeriod) : fv;
}

/**
 * Inflation-adjusted ("real") return from a nominal return and inflation rate,
 * via the Fisher relation: (1 + nominal) / (1 + inflation) − 1. All fractions.
 */
export function realReturn(nominalRate: number, inflationRate: number): number {
  return (1 + nominalRate) / (1 + inflationRate) - 1;
}
