// PURE compute for the Closing Costs Calculator. See BUILD-STANDARD §2.
// Itemized buyer closing-cost estimate. Typical U.S. totals run 2–5% of the
// loan amount (Freddie Mac / CFPB guidance); every line is user-adjustable.

import { round2 } from "../../lib/calculator/finance.ts";

export type ClosingCostsInputs = {
  homePrice: number;
  downPayment: number;
  rate: number; // annual %, for prepaid interest
  originationPct: number; // lender origination fee, % of loan
  points: number; // discount points (1 point = 1% of loan)
  appraisalInspection: number; // appraisal + home inspection
  titlePct: number; // title insurance + settlement, % of price
  transferTaxPct: number; // transfer / recording taxes, % of price
  propTaxAnnual: number;
  insuranceAnnual: number;
  escrowMonths: number; // months of tax + insurance reserves collected
  sellerCredit: number;
};

export type CostLine = { item: string; amount: number; group: string };

export type ClosingCostsResults = {
  loanAmount: number;
  lenderFees: number;
  thirdPartyFees: number;
  governmentFees: number;
  prepaids: number;
  totalClosingCosts: number; // before seller credit
  sellerCredit: number;
  netClosingCosts: number;
  pctOfLoan: number;
  pctOfPrice: number;
  cashToClose: number; // down payment + net closing costs
  lines: CostLine[];
};

export function computeClosingCosts(v: ClosingCostsInputs): ClosingCostsResults {
  const price = Math.max(0, v.homePrice);
  const down = Math.min(Math.max(0, v.downPayment), price);
  const loan = price - down;
  const nn = (x: number) => Math.max(0, x);

  const origination = loan * (nn(v.originationPct) / 100);
  const points = loan * (nn(v.points) / 100);
  const lenderMisc = loan > 0 ? 450 : 0; // credit report, flood cert, underwriting/processing
  const appraisal = nn(v.appraisalInspection);
  const title = price * (nn(v.titlePct) / 100);
  const recording = price > 0 ? 125 : 0;
  const transfer = price * (nn(v.transferTaxPct) / 100);
  // Prepaid interest: ~15 days on average from closing to month-end.
  const prepaidInterest = (loan * (nn(v.rate) / 100) / 365) * 15;
  const firstYearInsurance = nn(v.insuranceAnnual);
  const escrowReserve = ((nn(v.propTaxAnnual) + nn(v.insuranceAnnual)) / 12) * nn(v.escrowMonths);

  const lines: CostLine[] = [
    { item: "Origination fee", amount: origination, group: "Lender" },
    { item: "Discount points", amount: points, group: "Lender" },
    { item: "Credit report, underwriting & processing", amount: lenderMisc, group: "Lender" },
    { item: "Appraisal & inspection", amount: appraisal, group: "Third party" },
    { item: "Title insurance & settlement", amount: title, group: "Third party" },
    { item: "Recording fees", amount: recording, group: "Government" },
    { item: "Transfer taxes", amount: transfer, group: "Government" },
    { item: "Prepaid interest (~15 days)", amount: prepaidInterest, group: "Prepaid" },
    { item: "First-year homeowners insurance", amount: firstYearInsurance, group: "Prepaid" },
    { item: "Escrow reserves (tax & insurance)", amount: escrowReserve, group: "Prepaid" },
  ].map((l) => ({ ...l, amount: round2(l.amount) }));

  const sum = (g: string) => lines.filter((l) => l.group === g).reduce((a, l) => a + l.amount, 0);
  const total = lines.reduce((a, l) => a + l.amount, 0);
  const credit = Math.min(nn(v.sellerCredit), total);
  const net = total - credit;

  return {
    loanAmount: round2(loan),
    lenderFees: round2(sum("Lender")),
    thirdPartyFees: round2(sum("Third party")),
    governmentFees: round2(sum("Government")),
    prepaids: round2(sum("Prepaid")),
    totalClosingCosts: round2(total),
    sellerCredit: round2(credit),
    netClosingCosts: round2(net),
    pctOfLoan: loan > 0 ? round2((total / loan) * 100) : 0,
    pctOfPrice: price > 0 ? round2((total / price) * 100) : 0,
    cashToClose: round2(down + net),
    lines: lines.filter((l) => l.amount > 0),
  };
}
