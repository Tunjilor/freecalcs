// PURE compute for the Loan Payoff Calculator. Takes an existing loan (balance,
// APR, current monthly payment) and an extra monthly principal amount, and shows
// how much sooner it's paid off and how much interest is saved. Self-contained,
// deterministic, unit-tested.

export type LoanPayoffInputs = {
  balance: number;
  apr: number; // %
  currentPayment: number; // current monthly payment
  extraPayment: number; // additional principal per month
};

export type AmortRow = {
  month: number;
  interest: number;
  principal: number;
  balance: number;
  cumulativeInterest: number;
};

export type LoanPayoffResults = {
  monthlyInterestAtStart: number; // first-month interest at current balance
  paymentCoversInterest: boolean; // false => never amortizes
  basePayoffMonths: number; // at current payment
  newPayoffMonths: number; // at current + extra
  monthsSaved: number;
  baseTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  extraTotalPaid: number; // extra × new payoff months
  newPayoffLabel: string; // "X yr Y mo"
  basePayoffLabel: string;
  schedule: AmortRow[]; // with the extra payment
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** "X yr Y mo" without any date dependency. */
function monthsLabel(total: number): string {
  const t = Math.max(0, Math.round(total));
  const y = Math.floor(t / 12);
  const m = t % 12;
  if (t === 0) return "0 mo";
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

function amortize(
  balance0: number,
  monthlyRate: number,
  payment: number,
): { schedule: AmortRow[]; totalInterest: number; payoffMonths: number; amortizes: boolean } {
  const schedule: AmortRow[] = [];
  let balance = balance0;
  let cumulativeInterest = 0;
  const CAP = 1200; // 100 years — safety cap for non-amortizing inputs
  for (let m = 1; m <= CAP && balance > 0.005; m++) {
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

export function computeLoanPayoff(v: LoanPayoffInputs): LoanPayoffResults {
  const balance = Math.max(0, v.balance);
  const monthlyRate = v.apr / 100 / 12;
  const currentPayment = Math.max(0, v.currentPayment);
  const extra = Math.max(0, v.extraPayment);

  const startInterest = balance * monthlyRate;
  const coversInterest = currentPayment > startInterest;

  const baseline = amortize(balance, monthlyRate, currentPayment);
  const withExtra = amortize(balance, monthlyRate, currentPayment + extra);

  const monthsSaved =
    baseline.amortizes && withExtra.amortizes ? baseline.payoffMonths - withExtra.payoffMonths : 0;
  const interestSaved =
    baseline.amortizes && withExtra.amortizes
      ? round2(baseline.totalInterest - withExtra.totalInterest)
      : 0;

  return {
    monthlyInterestAtStart: round2(startInterest),
    paymentCoversInterest: coversInterest,
    basePayoffMonths: baseline.payoffMonths,
    newPayoffMonths: withExtra.payoffMonths,
    monthsSaved,
    baseTotalInterest: round2(baseline.totalInterest),
    newTotalInterest: round2(withExtra.totalInterest),
    interestSaved,
    extraTotalPaid: round2(extra * withExtra.payoffMonths),
    newPayoffLabel: withExtra.amortizes ? monthsLabel(withExtra.payoffMonths) : "Never",
    basePayoffLabel: baseline.amortizes ? monthsLabel(baseline.payoffMonths) : "Never",
    schedule: withExtra.schedule,
  };
}
