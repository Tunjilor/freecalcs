// PURE compute for the Capital Gains Tax Calculator. All brackets/thresholds
// come from tax-data.ts — no tax number is hardcoded here.
//
// Short-term gains are taxed as ordinary income (at your marginal rates, stacked
// on top of your other taxable income). Long-term gains use the preferential
// 0/15/20% brackets, also stacked on top of ordinary income. We compute both so
// the calculator can show what holding for a year saves.

import {
  TAX_DATA,
  calcFederalTax,
  calcLTCGTax,
  type FilingStatus,
  type TaxYear,
} from "../../lib/calculator/tax-data.ts";

export type CapitalGainsInputs = {
  year: TaxYear;
  filing: FilingStatus;
  proceeds: number; // sale price
  basis: number; // what you paid (cost basis)
  holding: "short" | "long";
  otherTaxableIncome: number; // ordinary taxable income (after deductions)
};

export type CapitalGainsResults = {
  gain: number; // 0 if a loss
  isLoss: boolean;
  lossAmount: number;
  shortTermTax: number; // taxed as ordinary (incremental)
  longTermTax: number; // 0/15/20% stacked
  taxOwed: number; // for the selected holding period
  rateApplied: number; // taxOwed / gain (0–1)
  afterTaxProceeds: number; // proceeds − taxOwed
  savingsFromLongTerm: number; // shortTermTax − longTermTax
  ltcgZeroBracket: boolean; // whole long-term gain fell in the 0% band
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeCapitalGains(v: CapitalGainsInputs): CapitalGainsResults {
  const proceeds = Math.max(0, v.proceeds);
  const basis = Math.max(0, v.basis);
  const rawGain = proceeds - basis;
  const isLoss = rawGain < 0;
  const gain = Math.max(0, rawGain);

  const yd = TAX_DATA[v.year];
  const brackets = yd.brackets[v.filing];
  const ltcg = yd.ltcg[v.filing];
  const ordinary = Math.max(0, v.otherTaxableIncome);

  // Short-term: incremental ordinary tax the gain adds on top of other income.
  const shortTermTax = gain > 0 ? calcFederalTax(ordinary + gain, brackets) - calcFederalTax(ordinary, brackets) : 0;
  // Long-term: preferential rates, stacked on ordinary income.
  const longTermTax = gain > 0 ? calcLTCGTax(gain, ordinary, ltcg) : 0;

  const taxOwed = v.holding === "short" ? shortTermTax : longTermTax;

  return {
    gain: round2(gain),
    isLoss,
    lossAmount: round2(isLoss ? -rawGain : 0),
    shortTermTax: round2(shortTermTax),
    longTermTax: round2(longTermTax),
    taxOwed: round2(taxOwed),
    rateApplied: gain > 0 ? round2((taxOwed / gain) * 10000) / 10000 : 0,
    afterTaxProceeds: round2(proceeds - taxOwed),
    savingsFromLongTerm: round2(shortTermTax - longTermTax),
    ltcgZeroBracket: gain > 0 && longTermTax === 0,
  };
}
