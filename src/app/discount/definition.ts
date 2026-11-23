// Discount Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money2, pct } from "@/lib/calculator/format";
import { computeDiscount, type DiscountInputs, type DiscountResults } from "./compute";

const defaults: DiscountInputs = { price: 80, percentOff: 30, extraPercentOff: 0, salesTaxPct: 0 };

export const discountDef: CalculatorDefinition<DiscountInputs, DiscountResults> = {
  slug: "discount",
  hub: "everyday",
  h1: "Discount Calculator",
  valueProp: "Find the sale price and savings for any percent off, including stacked discounts and tax.",
  title: "Discount Calculator: Percent Off & Sale Price | freecalcs.io",
  metaDescription:
    "Free discount calculator: sale price and savings for any percent off, stacked discounts like an extra 20% off, and the final price after sales tax.",
  primaryKeyword: "Discount Calculator",
  secondaryKeywords: ["percent off calculator", "sale price calculator", "30% off calculator", "stacked discount calculator"],
  intro:
    "Is 30% off plus an extra 20% really half off? It isn't: it's 44% off. This discount calculator shows the sale price and how much you save for any percent off, handles stacked discounts the way stores actually apply them, and adds sales tax for the real checkout price.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "price", label: "Original price", type: "currency", default: 80 },
    { name: "percentOff", label: "Discount", type: "percent", default: 30, step: 5 },
    { name: "extraPercentOff", label: "Extra discount (optional)", type: "percent", default: 0, step: 5, helpText: "For deals like 'take an extra 20% off sale prices'." },
    { name: "salesTaxPct", label: "Sales tax (optional)", type: "percent", default: 0, step: 0.25 },
  ],

  compute: computeDiscount,

  results: [
    { key: "salePrice", label: "Sale price", format: "currency2", variant: "primary", hint: "After all discounts, before tax." },
    { key: "savings", label: "You save", format: "currency2", variant: "secondary" },
    { key: "effectiveDiscountPct", label: "Total discount", format: "percent", variant: "secondary" },
    { key: "tax", label: "Sales tax", format: "currency2", variant: "secondary" },
    { key: "finalPrice", label: "Final price", format: "currency2", variant: "secondary" },
  ],

  reference: {
    heading: "Quick percent-off table",
    body: "Sale price for common discounts on a $100 item.",
    tables: [
      {
        title: "Percent off $100",
        columns: [
          { key: "off", label: "Discount", format: "text", align: "left" },
          { key: "sale", label: "Sale price", format: "currency2", align: "right" },
          { key: "save", label: "You save", format: "currency2", align: "right" },
        ],
        rows: [10, 15, 20, 25, 30, 33, 40, 50, 60, 70, 75].map((d) => ({ off: `${d}% off`, sale: 100 - d, save: d })),
      },
    ],
  },

  scenarios: [
    { id: "stack", label: "30% + extra 20%", patch: { percentOff: 30, extraPercentOff: 20 } },
    { id: "bogo", label: "Buy one get one 50%", patch: { percentOff: 25, extraPercentOff: 0 } },
    { id: "tax", label: "Add 8% tax", patch: { salesTaxPct: 8 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.savings > 0,
      say: (r, v) => `${pct(r.effectiveDiscountPct, 0)} off ${money2(v.price)} brings it to ${money2(r.salePrice)}, saving you ${money2(r.savings)}.`,
    },
    {
      id: "stacked",
      priority: 92,
      when: (r, v) => v.percentOff > 0 && v.extraPercentOff > 0,
      say: (r, v) =>
        `Stacked discounts multiply rather than add: ${pct(v.percentOff, 0)} then ${pct(v.extraPercentOff, 0)} comes to ${pct(
          r.effectiveDiscountPct,
          0,
        )} off, not ${pct(r.naiveStackPct, 0)}, because the second discount applies to the already-reduced price.`,
    },
    {
      id: "bogo",
      priority: 70,
      when: () => true,
      say: () => `"Buy one, get one 50% off" works out to 25% off each item, and only if you wanted two. "Buy one, get one free" is 50% off each.`,
    },
    {
      id: "with-tax",
      priority: 80,
      when: (r) => r.tax > 0,
      say: (r) => `With tax, you'll pay ${money2(r.finalPrice)} at checkout.`,
    },
  ],

  related: [relatedLink("percentage"), relatedLink("sales-tax"), relatedLink("tip"), relatedLink("profit-margin"), relatedLink("budget")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate a discount?", a: "Multiply the price by the discount as a decimal, then subtract. 30% off $80: 80 × 0.30 = $24 off, so the sale price is $56. Or multiply by (1 − discount): 80 × 0.70 = $56." },
    { q: "How do stacked discounts work?", a: "The second discount applies to the already-discounted price. 30% off and then an extra 20% off is 0.70 × 0.80 = 0.56 of the original price, or 44% off in total." },
    { q: "Is sales tax charged before or after a discount?", a: "Generally after. Sales tax applies to the price you actually pay, so store discounts reduce the tax too. Manufacturer coupons can be treated differently in some states." },
    { q: "How do I find the original price from a sale price?", a: "Divide the sale price by (1 − discount). If something is $56 after 30% off, the original price was 56 ÷ 0.70 = $80." },
  ],

  teach: {
    heading: "How do percent-off discounts work?",
    whatIsIt:
      "A percent-off discount reduces the price by a share of the original. 25% off means you pay 75% of the price. When stores offer a second discount, it's taken from the already-reduced price, not the original.",
    whyItMatters:
      "Retailers rely on the fact that stacked discounts and bundle deals are hard to compare in your head. Working out the real percentage helps you spot which deal is actually better and whether a 'sale' price is a bargain at all.",
    whatToDoNext:
      "Compare the final price, including tax and shipping, across stores. Before buying something just because it's on sale, check it fits your budget; the budget calculator can help you decide where it belongs.",
  },

  method: { label: "Sale price = price × (1 − discount₁) × (1 − discount₂); tax = sale price × tax rate" },

  monetization: [
    { kind: "internal", headline: "Add your state's sales tax", body: "Look up your state's 2026 rate and see the exact tax on your purchase.", ctaLabel: "Open the sales tax calculator", href: "/sales-tax" },
  ],
};
