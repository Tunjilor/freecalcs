// PURE compute for the Profit Margin Calculator. See BUILD-STANDARD §2.
//   gross profit = price − cost
//   margin       = profit ÷ price   (share of the selling price that's profit)
//   markup       = profit ÷ cost    (how much was added on top of cost)
// Plus the price needed to hit a target margin: cost ÷ (1 − target margin).

import { round2 } from "../../lib/calculator/finance.ts";

export type ProfitMarginInputs = {
  cost: number;
  price: number;
  targetMargin: number; // %, for the "price to charge" answer
};

export type ProfitMarginResults = {
  profit: number;
  marginPct: number;
  markupPct: number;
  priceForTarget: number; // 0 if target ≥ 100%
  markupForTarget: number;
  isLoss: boolean;
};

export function computeProfitMargin(v: ProfitMarginInputs): ProfitMarginResults {
  const cost = Math.max(0, v.cost);
  const price = Math.max(0, v.price);
  const profit = price - cost;
  const t = Math.max(0, v.targetMargin) / 100;
  const pft = t < 1 ? cost / (1 - t) : 0;
  return {
    profit: round2(profit),
    marginPct: price > 0 ? round2((profit / price) * 100) : 0,
    markupPct: cost > 0 ? round2((profit / cost) * 100) : 0,
    priceForTarget: round2(pft),
    markupForTarget: cost > 0 && t < 1 ? round2(((pft - cost) / cost) * 100) : 0,
    isLoss: profit < 0,
  };
}
