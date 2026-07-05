// PURE compute for the HELOC Calculator. Uses shared finance.ts helpers.
// Estimates the available credit line from the CLTV limit, and the interest-only
// (draw period) vs principal-and-interest (repayment period) payments.

import { monthlyPayment, amortizeSchedule, round2 } from "../../lib/calculator/finance.ts";

export type HelocInputs = {
  homeValue: number;
  mortgageBalance: number;
  cltvLimit: number; // % max combined loan-to-value
  drawAmount: number; // how much you plan to draw
  rate: number; // % HELOC rate
  drawPeriodYears: number; // interest-only period
  repayPeriodYears: number; // amortizing repayment period
};

export type HelocResults = {
  totalEquity: number; // homeValue − mortgageBalance
  maxBorrow: number; // homeValue × CLTV
  availableCreditLine: number; // maxBorrow − mortgageBalance (≥0)
  currentCltv: number; // % mortgageBalance / homeValue
  overLimit: boolean; // already above the CLTV limit
  draw: number; // capped at the available line
  interestOnlyPayment: number; // during the draw period
  repaymentPayment: number; // P&I during the repayment period
  paymentJump: number; // repayment − interest-only
  balancePath: { x: string; y: number }[]; // balance over draw + repay
};

export function computeHeloc(v: HelocInputs): HelocResults {
  const homeValue = Math.max(0, v.homeValue);
  const mortgageBalance = Math.max(0, v.mortgageBalance);
  const totalEquity = Math.max(0, homeValue - mortgageBalance);
  const maxBorrow = homeValue * (Math.max(0, v.cltvLimit) / 100);
  const availableCreditLine = Math.max(0, maxBorrow - mortgageBalance);
  const overLimit = mortgageBalance > maxBorrow;

  const draw = Math.min(Math.max(0, v.drawAmount), availableCreditLine);
  const monthlyRate = v.rate / 100 / 12;
  const interestOnlyPayment = draw * monthlyRate;
  const repayMonths = Math.max(1, Math.round(v.repayPeriodYears * 12));
  const repaymentPayment = monthlyPayment(draw, monthlyRate, repayMonths);

  // Balance path: flat during the interest-only draw period, then amortizes.
  const drawMonths = Math.max(0, Math.round(v.drawPeriodYears * 12));
  const balancePath: { x: string; y: number }[] = [];
  const totalMonths = drawMonths + repayMonths;
  const step = Math.max(1, Math.round(totalMonths / 48));
  const repaySchedule = amortizeSchedule(draw, monthlyRate, repayMonths, repaymentPayment);
  for (let m = 0; m <= totalMonths; m += step) {
    let bal: number;
    if (m <= drawMonths) bal = draw;
    else {
      const into = m - drawMonths;
      bal = repaySchedule.schedule[Math.min(into, repaySchedule.schedule.length) - 1]?.balance ?? 0;
    }
    balancePath.push({ x: `Yr ${Math.round((m / 12) * 10) / 10}`, y: round2(bal) });
  }

  return {
    totalEquity: round2(totalEquity),
    maxBorrow: round2(maxBorrow),
    availableCreditLine: round2(availableCreditLine),
    currentCltv: homeValue > 0 ? round2((mortgageBalance / homeValue) * 100) : 0,
    overLimit,
    draw: round2(draw),
    interestOnlyPayment: round2(interestOnlyPayment),
    repaymentPayment: round2(repaymentPayment),
    paymentJump: round2(repaymentPayment - interestOnlyPayment),
    balancePath,
  };
}
