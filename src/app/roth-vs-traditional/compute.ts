// PURE compute for the Roth vs Traditional Calculator. Uses shared finance.ts.
//
// Both accounts are compared from the SAME pre-tax contribution:
//   Traditional — contribute pre-tax, grow, pay tax at RETIREMENT rate on
//     withdrawal:  afterTax = pretaxBalance × (1 − retirementRate).
//   Roth — pay tax NOW at your CURRENT rate, contribute the rest, withdraw
//     tax-free:    afterTax = pretaxBalance × (1 − currentRate).
// So the winner depends entirely on how your tax rate changes:
//   Traditional wins if retirementRate < currentRate;
//   Roth wins if retirementRate > currentRate;
//   they tie when the rates are equal (that's the break-even).

import { futureValueOfSeries, round2 } from "../../lib/calculator/finance.ts";

export type RothInputs = {
  annualContribution: number; // pre-tax dollars contributed per year
  currentTaxRate: number; // % marginal rate today
  retirementTaxRate: number; // % expected marginal rate in retirement
  years: number;
  annualReturn: number; // %
};

export type RothResults = {
  pretaxBalance: number; // FV of the contributions before any withdrawal tax
  rothAfterTax: number;
  traditionalAfterTax: number;
  winner: "Roth" | "Traditional" | "Tie";
  difference: number; // |roth − traditional|
  breakEvenRate: number; // retirement rate at which they tie (= current rate)
  totalContributed: number;
  currentTaxRate: number; // echoed for the comparison table
  retirementTaxRate: number;
};

export function computeRoth(v: RothInputs): RothResults {
  const contribution = Math.max(0, v.annualContribution);
  const years = Math.max(0, Math.round(v.years));
  const annualRate = v.annualReturn / 100;
  const curRate = Math.max(0, v.currentTaxRate) / 100;
  const retRate = Math.max(0, v.retirementTaxRate) / 100;

  const pretaxBalance = futureValueOfSeries(contribution, annualRate, years);
  const rothAfterTax = pretaxBalance * (1 - curRate);
  const traditionalAfterTax = pretaxBalance * (1 - retRate);

  const diff = rothAfterTax - traditionalAfterTax;
  const winner: RothResults["winner"] =
    Math.abs(diff) < 0.5 ? "Tie" : diff > 0 ? "Roth" : "Traditional";

  return {
    pretaxBalance: round2(pretaxBalance),
    rothAfterTax: round2(rothAfterTax),
    traditionalAfterTax: round2(traditionalAfterTax),
    winner,
    difference: round2(Math.abs(diff)),
    breakEvenRate: round2(v.currentTaxRate), // they tie when retirement rate = current rate
    totalContributed: round2(contribution * years),
    currentTaxRate: round2(v.currentTaxRate),
    retirementTaxRate: round2(v.retirementTaxRate),
  };
}
