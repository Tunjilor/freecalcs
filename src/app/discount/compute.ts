// PURE compute for the Discount Calculator. See BUILD-STANDARD §2.
// Percent-off price with an optional stacked second discount (applied to the
// already-reduced price, as stores do) and sales tax on the final price.

import { round2 } from "../../lib/calculator/finance.ts";

export type DiscountInputs = {
  price: number;
  percentOff: number;
  extraPercentOff: number; // e.g. "extra 20% off sale price"
  salesTaxPct: number;
};

export type DiscountResults = {
  salePrice: number; // after both discounts, before tax
  savings: number;
  effectiveDiscountPct: number; // combined discount
  tax: number;
  finalPrice: number;
  naiveStackPct: number; // what people often assume (30% + 20% = 50%)
};

export function computeDiscount(v: DiscountInputs): DiscountResults {
  const p = Math.max(0, v.price);
  const d1 = Math.min(100, Math.max(0, v.percentOff)) / 100;
  const d2 = Math.min(100, Math.max(0, v.extraPercentOff)) / 100;
  const sale = p * (1 - d1) * (1 - d2);
  const tax = sale * (Math.max(0, v.salesTaxPct) / 100);
  return {
    salePrice: round2(sale),
    savings: round2(p - sale),
    effectiveDiscountPct: p > 0 ? round2((1 - (1 - d1) * (1 - d2)) * 100) : 0,
    tax: round2(tax),
    finalPrice: round2(sale + tax),
    naiveStackPct: round2(Math.min(100, (d1 + d2) * 100)),
  };
}
