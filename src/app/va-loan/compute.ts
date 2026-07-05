// PURE compute for the VA Loan Calculator.
//
// No DOM, no fetch, no Date.now() — every output is a deterministic function of
// the inputs, so it can be unit-tested in isolation (compute.test.ts) and reused
// by articles that pre-fill the calculator. See docs/BUILD-STANDARD.md §2.
//
// Domain reference — VA funding fee schedule (purchase/construction loans),
// effective 2023-04-07 and current for 2026. Source: U.S. Department of
// Veterans Affairs, "VA funding fee and loan closing costs" (va.gov).
//   First use:      < 5% down = 2.15% | 5–9.99% = 1.50% | ≥10% = 1.25%
//   Subsequent use: < 5% down = 3.30% | 5–9.99% = 1.50% | ≥10% = 1.25%
//   Exempt (service-connected disability comp, Purple Heart, eligible
//   surviving spouse) = 0%.

import {
  monthlyPayment,
  amortizeSchedule,
  round2,
  type AmortRow,
} from "../../lib/calculator/finance.ts";

// Re-exported so existing imports (and the test suite) keep working unchanged.
export { monthlyPayment };
export type { AmortRow };

export type VaLoanInputs = {
  homePrice: number;
  downPayment: number; // dollars; VA allows $0
  rate: number; // annual %, e.g. 6.5
  termYears: number;
  usage: "first" | "subsequent";
  exempt: "no" | "yes"; // funding-fee exempt (disabled veteran, etc.)
  financeFee: "yes" | "no"; // roll the funding fee into the loan (standard) or pay cash
  extraPayment: number; // extra principal per month
  propTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly: number;
};

export type VaLoanResults = {
  baseLoan: number; // price - down
  downPaymentPct: number; // 0–100
  fundingFeeRate: number; // % applied (0 if exempt)
  fundingFeeAmount: number;
  fundingFeeFinanced: boolean;
  loanAmount: number; // amount actually amortized
  monthlyPI: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  monthlyPMI: number; // always 0 for VA — surfaced deliberately
  totalMonthly: number; // PITI (no extra)
  totalMonthlyWithExtra: number;
  totalInterest: number; // over life, with extra payment applied
  totalCost: number; // loanAmount + totalInterest
  payoffMonths: number; // with extra
  scheduledMonths: number; // term without extra
  monthsSaved: number; // extra vs none
  interestSaved: number; // extra vs none
  // Standard "extra payment lever" for the insight engine — what adding a flat
  // $250/mo of principal (on top of the scheduled payment) would save vs none.
  leverExtra: number;
  leverMonthsSaved: number;
  leverInterestSaved: number;
  // Comparison vs a conventional loan with PMI (same price/down/rate/term):
  conventionalPmiMonthly: number;
  conventionalPmiTotal: number; // PMI paid until 80% LTV reached
  vaVsConventionalUpfrontSaving: number; // conventional PMI total - VA funding fee
  schedule: AmortRow[];
};

/** VA purchase funding-fee rate as a fraction (e.g. 0.0215). */
export function fundingFeeRate(
  usage: VaLoanInputs["usage"],
  exempt: VaLoanInputs["exempt"],
  downPaymentPct: number,
): number {
  if (exempt === "yes") return 0;
  if (downPaymentPct >= 10) return 0.0125;
  if (downPaymentPct >= 5) return 0.015;
  return usage === "subsequent" ? 0.033 : 0.0215;
}

/**
 * Estimate PMI a comparable CONVENTIONAL loan would carry, for the "VA saves you
 * PMI" comparison. Conventional PMI (~0.5%/yr of the loan balance) is charged
 * until the balance amortizes to 80% of the original home price, then drops off.
 */
function conventionalPmi(
  baseLoan: number,
  homePrice: number,
  monthlyRate: number,
  scheduledN: number,
): { monthly: number; total: number } {
  if (baseLoan <= homePrice * 0.8) return { monthly: 0, total: 0 };
  const annualRate = 0.005; // 0.5% typical conventional PMI
  const monthly = (baseLoan * annualRate) / 12;
  const basePayment = monthlyPayment(baseLoan, monthlyRate, scheduledN);
  let balance = baseLoan;
  let total = 0;
  const cutoff = homePrice * 0.8;
  for (let m = 1; m <= scheduledN && balance > cutoff; m++) {
    total += monthly;
    const interest = balance * monthlyRate;
    balance -= basePayment - interest;
  }
  return { monthly, total };
}

export function computeVaLoan(v: VaLoanInputs): VaLoanResults {
  const homePrice = Math.max(0, v.homePrice);
  const down = Math.min(Math.max(0, v.downPayment), homePrice);
  const baseLoan = Math.max(0, homePrice - down);
  const downPaymentPct = homePrice > 0 ? (down / homePrice) * 100 : 0;

  const feeRate = fundingFeeRate(v.usage, v.exempt, downPaymentPct);
  const fundingFeeAmount = round2(baseLoan * feeRate);
  const financed = v.financeFee === "yes" && fundingFeeAmount > 0;
  const loanAmount = financed ? baseLoan + fundingFeeAmount : baseLoan;

  const monthlyRate = v.rate / 100 / 12;
  const scheduledN = Math.max(1, Math.round(v.termYears * 12));
  const monthlyPI = monthlyPayment(loanAmount, monthlyRate, scheduledN);

  // With extra payment (actual payoff).
  const withExtra = amortizeSchedule(loanAmount, monthlyRate, scheduledN, monthlyPI, v.extraPayment);
  // Baseline without extra (for savings comparison).
  const noExtra =
    v.extraPayment > 0
      ? amortizeSchedule(loanAmount, monthlyRate, scheduledN, monthlyPI, 0)
      : withExtra;

  const monthlyTax = Math.max(0, v.propTaxAnnual) / 12;
  const monthlyInsurance = Math.max(0, v.insuranceAnnual) / 12;
  const monthlyHOA = Math.max(0, v.hoaMonthly);
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA;
  const totalMonthlyWithExtra = totalMonthly + Math.max(0, v.extraPayment);

  const conv = conventionalPmi(baseLoan, homePrice, monthlyRate, scheduledN);

  // Extra-payment lever ($250/mo) computed from the scheduled payment, so the
  // "adding $X would save…" insight always has real numbers to show.
  const LEVER = 250;
  const lever = amortizeSchedule(loanAmount, monthlyRate, scheduledN, monthlyPI, LEVER);

  return {
    baseLoan: round2(baseLoan),
    downPaymentPct: round2(downPaymentPct),
    fundingFeeRate: round2(feeRate * 100),
    fundingFeeAmount,
    fundingFeeFinanced: financed,
    loanAmount: round2(loanAmount),
    monthlyPI: round2(monthlyPI),
    monthlyTax: round2(monthlyTax),
    monthlyInsurance: round2(monthlyInsurance),
    monthlyHOA: round2(monthlyHOA),
    monthlyPMI: 0,
    totalMonthly: round2(totalMonthly),
    totalMonthlyWithExtra: round2(totalMonthlyWithExtra),
    totalInterest: round2(withExtra.totalInterest),
    totalCost: round2(loanAmount + withExtra.totalInterest),
    payoffMonths: withExtra.payoffMonths,
    scheduledMonths: noExtra.payoffMonths,
    monthsSaved: noExtra.payoffMonths - withExtra.payoffMonths,
    interestSaved: round2(noExtra.totalInterest - withExtra.totalInterest),
    leverExtra: LEVER,
    leverMonthsSaved: scheduledN - lever.payoffMonths,
    leverInterestSaved: round2(
      amortizeSchedule(loanAmount, monthlyRate, scheduledN, monthlyPI, 0).totalInterest -
        lever.totalInterest,
    ),
    conventionalPmiMonthly: round2(conv.monthly),
    conventionalPmiTotal: round2(conv.total),
    vaVsConventionalUpfrontSaving: round2(conv.total - fundingFeeAmount),
    schedule: withExtra.schedule,
  };
}
