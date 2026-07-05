// PURE compute for the Personal Loan Calculator. Self-contained, deterministic,
// unit-tested. Handles a general amortizing loan plus an optional origination
// fee, and derives the TRUE APR (the rate implied once the fee is counted, since
// the fee is deducted from what you actually receive but you still repay the
// full principal).

export type PersonalLoanInputs = {
  principal: number;
  apr: number; // % nominal
  termMonths: number;
  originationFeePct: number; // % of principal, deducted from proceeds
  extraPayment: number;
};

export type AmortRow = {
  month: number;
  interest: number;
  principal: number;
  balance: number;
  cumulativeInterest: number;
};

export type PersonalLoanResults = {
  monthlyPayment: number;
  originationFee: number;
  amountReceived: number; // principal − fee
  trueApr: number; // % including the fee
  totalInterest: number;
  totalCost: number; // interest + fee
  totalRepaid: number; // payment × months
  payoffMonths: number;
  scheduledMonths: number;
  monthsSaved: number;
  interestSaved: number;
  leverExtra: number;
  leverMonthsSaved: number;
  leverInterestSaved: number;
  schedule: AmortRow[];
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function monthlyPayment(principal: number, monthlyRate: number, n: number): number {
  if (n <= 0) return 0;
  if (monthlyRate <= 0) return principal / n;
  const f = Math.pow(1 + monthlyRate, n);
  return (principal * (monthlyRate * f)) / (f - 1);
}

/** Present value of a level payment stream at a monthly rate. */
function pv(payment: number, monthlyRate: number, n: number): number {
  if (monthlyRate <= 0) return payment * n;
  return (payment * (1 - Math.pow(1 + monthlyRate, -n))) / monthlyRate;
}

/**
 * True APR: the annual rate whose payment stream has present value equal to the
 * amount actually received (principal − fee). Solved by bisection on the monthly
 * rate. When the fee is 0, this converges to the nominal APR.
 */
export function solveTrueApr(amountReceived: number, payment: number, n: number): number {
  if (amountReceived <= 0 || payment <= 0 || n <= 0) return 0;
  let lo = 0;
  let hi = 5; // 500%/month upper bound — far beyond any real loan
  // f(r) = pv(r) − received is monotonically decreasing in r.
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const diff = pv(payment, mid, n) - amountReceived;
    if (diff > 0) lo = mid;
    else hi = mid;
  }
  return ((lo + hi) / 2) * 12 * 100;
}

function amortize(
  principal: number,
  monthlyRate: number,
  scheduledN: number,
  basePayment: number,
  extra: number,
): { schedule: AmortRow[]; totalInterest: number; payoffMonths: number } {
  const schedule: AmortRow[] = [];
  let balance = principal;
  let cumulativeInterest = 0;
  const pay = basePayment + Math.max(0, extra);
  for (let m = 1; m <= scheduledN && balance > 0.005; m++) {
    const interest = balance * monthlyRate;
    let principalPaid = pay - interest;
    if (principalPaid > balance) principalPaid = balance;
    if (principalPaid < 0) principalPaid = 0;
    balance -= principalPaid;
    cumulativeInterest += interest;
    schedule.push({
      month: m,
      interest: round2(interest),
      principal: round2(principalPaid),
      balance: round2(Math.max(0, balance)),
      cumulativeInterest: round2(cumulativeInterest),
    });
    if (principalPaid === 0) break;
  }
  return { schedule, totalInterest: cumulativeInterest, payoffMonths: schedule.length };
}

export function computePersonalLoan(v: PersonalLoanInputs): PersonalLoanResults {
  const principal = Math.max(0, v.principal);
  const feePct = Math.min(Math.max(0, v.originationFeePct), 99);
  const originationFee = round2(principal * (feePct / 100));
  const amountReceived = Math.max(0, principal - originationFee);

  const monthlyRate = v.apr / 100 / 12;
  const scheduledN = Math.max(1, Math.round(v.termMonths));
  const pmt = monthlyPayment(principal, monthlyRate, scheduledN);

  const withExtra = amortize(principal, monthlyRate, scheduledN, pmt, v.extraPayment);
  const noExtra =
    v.extraPayment > 0 ? amortize(principal, monthlyRate, scheduledN, pmt, 0) : withExtra;

  const LEVER = 100;
  const lever = amortize(principal, monthlyRate, scheduledN, pmt, LEVER);
  const leverBaseInterest = amortize(principal, monthlyRate, scheduledN, pmt, 0).totalInterest;

  const trueApr = solveTrueApr(amountReceived, pmt, scheduledN);
  const totalInterest = withExtra.totalInterest;

  return {
    monthlyPayment: round2(pmt),
    originationFee,
    amountReceived: round2(amountReceived),
    trueApr: round2(trueApr),
    totalInterest: round2(totalInterest),
    totalCost: round2(totalInterest + originationFee),
    totalRepaid: round2(pmt * withExtra.payoffMonths),
    payoffMonths: withExtra.payoffMonths,
    scheduledMonths: noExtra.payoffMonths,
    monthsSaved: noExtra.payoffMonths - withExtra.payoffMonths,
    interestSaved: round2(noExtra.totalInterest - withExtra.totalInterest),
    leverExtra: LEVER,
    leverMonthsSaved: scheduledN - lever.payoffMonths,
    leverInterestSaved: round2(leverBaseInterest - lever.totalInterest),
    schedule: withExtra.schedule,
  };
}
