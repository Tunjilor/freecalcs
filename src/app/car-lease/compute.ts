// PURE compute for the Car Lease Calculator. See BUILD-STANDARD §2.
// Standard U.S. lease math:
//   adjusted cap cost = negotiated price + fees − down payment − trade-in − rebates
//   residual          = MSRP × residual %
//   depreciation fee  = (adjusted cap cost − residual) ÷ months
//   finance (rent)    = (adjusted cap cost + residual) × money factor
//   money factor      = APR ÷ 2400
//   monthly payment   = (depreciation + finance) × (1 + sales tax)
// Sales tax on the monthly payment is how most states tax leases; a few tax the
// full price upfront, noted in the FAQ.

import { round2 } from "../../lib/calculator/finance.ts";

export type CarLeaseInputs = {
  msrp: number;
  negotiatedPrice: number;
  downPayment: number;
  tradeIn: number;
  fees: number; // acquisition + doc fees rolled into the lease
  termMonths: number;
  residualPct: number; // % of MSRP
  apr: number; // equivalent APR %; money factor = APR / 2400
  salesTaxPct: number;
};

export type CarLeaseResults = {
  moneyFactor: number;
  adjustedCapCost: number;
  residualValue: number;
  depreciationFee: number;
  financeFee: number;
  basePayment: number;
  monthlyTax: number;
  monthlyPayment: number;
  totalLeaseCost: number; // payments + down + trade-in
  totalFinanceCharges: number;
  discountFromMsrp: number;
  discountPct: number;
  effectiveMonthlyCost: number; // total lease cost ÷ months
};

export function computeCarLease(v: CarLeaseInputs): CarLeaseResults {
  const n = Math.max(1, Math.round(v.termMonths));
  const msrp = Math.max(0, v.msrp);
  const price = Math.max(0, v.negotiatedPrice);
  const down = Math.max(0, v.downPayment);
  const trade = Math.max(0, v.tradeIn);
  const mf = Math.max(0, v.apr) / 2400;

  const cap = Math.max(0, price + Math.max(0, v.fees) - down - trade);
  const residual = msrp * (Math.max(0, v.residualPct) / 100);
  const dep = Math.max(0, (cap - residual) / n);
  const fin = (cap + residual) * mf;
  const base = dep + fin;
  const tax = base * (Math.max(0, v.salesTaxPct) / 100);
  const pay = base + tax;
  const total = pay * n + down + trade;

  return {
    moneyFactor: Math.round(mf * 1e6) / 1e6,
    adjustedCapCost: round2(cap),
    residualValue: round2(residual),
    depreciationFee: round2(dep),
    financeFee: round2(fin),
    basePayment: round2(base),
    monthlyTax: round2(tax),
    monthlyPayment: round2(pay),
    totalLeaseCost: round2(total),
    totalFinanceCharges: round2(fin * n),
    discountFromMsrp: round2(msrp - price),
    discountPct: msrp > 0 ? round2(((msrp - price) / msrp) * 100) : 0,
    effectiveMonthlyCost: round2(total / n),
  };
}
