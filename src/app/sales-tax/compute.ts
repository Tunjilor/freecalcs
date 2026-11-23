// PURE compute for the Sales Tax Calculator. See BUILD-STANDARD §2.
// Adds tax to a pre-tax price, or backs it out of a tax-inclusive total, using
// either a state's average combined rate (Tax Foundation) or a custom rate.

import { round2 } from "../../lib/calculator/finance.ts";
import { SALES_TAX_BY_CODE } from "../../lib/data/sales-tax.ts";

export type SalesTaxInputs = {
  amount: number;
  state: string; // two-letter code
  customRate: number; // %; 0 = use the state's average combined rate
  mode: "add" | "remove"; // add tax to a price, or remove it from a total
};

export type SalesTaxResults = {
  rateUsed: number;
  usingCustom: boolean;
  stateName: string;
  stateRate: number;
  avgLocalRate: number;
  combinedRate: number;
  preTax: number;
  tax: number;
  total: number;
};

export function computeSalesTax(v: SalesTaxInputs): SalesTaxResults {
  const st = SALES_TAX_BY_CODE[v.state] ?? SALES_TAX_BY_CODE.TX;
  const usingCustom = v.customRate > 0;
  const rate = usingCustom ? v.customRate : st.combined;
  const amt = Math.max(0, v.amount);
  const preTax = v.mode === "remove" ? amt / (1 + rate / 100) : amt;
  const tax = preTax * (rate / 100);
  return {
    rateUsed: Math.round(rate * 1000) / 1000,
    usingCustom,
    stateName: st.name,
    stateRate: st.state,
    avgLocalRate: st.avgLocal,
    combinedRate: st.combined,
    preTax: round2(preTax),
    tax: round2(tax),
    total: round2(preTax + tax),
  };
}
