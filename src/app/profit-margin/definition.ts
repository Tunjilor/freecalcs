// Profit Margin Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money2, pct } from "@/lib/calculator/format";
import { computeProfitMargin, type ProfitMarginInputs, type ProfitMarginResults } from "./compute";

const defaults: ProfitMarginInputs = { cost: 60, price: 100, targetMargin: 50 };

export const profitMarginDef: CalculatorDefinition<ProfitMarginInputs, ProfitMarginResults> = {
  slug: "profit-margin",
  hub: "everyday",
  h1: "Profit Margin Calculator",
  valueProp: "Find your profit margin and markup, and the price to charge for a target margin.",
  title: "Profit Margin Calculator: Margin vs Markup | freecalcs.io",
  metaDescription:
    "Free profit margin calculator: gross profit, margin and markup from cost and price, plus the selling price you need to hit a target margin.",
  primaryKeyword: "Profit Margin Calculator",
  secondaryKeywords: ["margin calculator", "markup calculator", "margin vs markup", "gross margin calculator", "how to price a product"],
  intro:
    "Margin and markup both describe profit, but they aren't the same number, and mixing them up is one of the most common pricing mistakes. This profit margin calculator shows your gross profit, margin and markup from a cost and a price, and works out the price you need to charge to reach a target margin.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "cost", label: "Cost", type: "currency", default: 60, helpText: "What the item costs you to make or buy." },
    { name: "price", label: "Selling price", type: "currency", default: 100 },
    { name: "targetMargin", label: "Target margin", type: "percent", default: 50, step: 1, helpText: "Used to suggest a price." },
  ],

  compute: computeProfitMargin,

  results: [
    { key: "marginPct", label: "Profit margin", format: "percent", variant: "primary", hint: "Profit as a share of the selling price." },
    { key: "profit", label: "Gross profit", format: "currency2", variant: "secondary" },
    { key: "markupPct", label: "Markup", format: "percent", variant: "secondary" },
    { key: "priceForTarget", label: "Price for your target margin", format: "currency2", variant: "secondary" },
    { key: "markupForTarget", label: "Markup needed for target", format: "percent", variant: "secondary" },
  ],

  reference: {
    heading: "Margin vs markup",
    body: "The markup you need for common margins.",
    tables: [
      {
        title: "Margin to markup",
        columns: [
          { key: "margin", label: "Margin", format: "text", align: "left" },
          { key: "markup", label: "Markup needed", format: "text", align: "right" },
        ],
        rows: [10, 20, 25, 30, 40, 50, 60, 75].map((m) => ({ margin: `${m}%`, markup: `${Math.round((m / (100 - m)) * 1000) / 10}%` })),
      },
    ],
  },

  scenarios: [
    { id: "target40", label: "Target 40% margin", patch: { targetMargin: 40 } },
    { id: "raise", label: "Price $120", patch: { price: 120 } },
    { id: "cheaper", label: "Cost $50", patch: { cost: 50 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r, v) => v.price > 0 && !r.isLoss,
      say: (r, v) =>
        `Selling at ${money2(v.price)} with a ${money2(v.cost)} cost leaves ${money2(r.profit)} of profit: a ${pct(r.marginPct, 1)} margin, or a ${pct(r.markupPct, 1)} markup.`,
    },
    {
      id: "loss",
      priority: 99,
      tone: "warn",
      when: (r) => r.isLoss,
      say: (r) => `You're selling below cost and losing ${money2(-r.profit)} on each sale.`,
    },
    {
      id: "target",
      priority: 90,
      when: (r, v) => r.priceForTarget > 0 && Math.abs(r.marginPct - v.targetMargin) > 0.5,
      say: (r, v) =>
        `To earn a ${pct(v.targetMargin, 0)} margin, charge ${money2(r.priceForTarget)}. That's a ${pct(r.markupForTarget, 1)} markup on cost, not ${pct(v.targetMargin, 0)}.`,
    },
    {
      id: "confusion",
      priority: 75,
      when: (r) => r.markupPct > 0,
      say: () => `Adding a 50% markup gives only a 33% margin. If you set prices by markup but report margins, your profits will look lower than you expected.`,
    },
    {
      id: "gross",
      priority: 60,
      when: () => true,
      say: () => `This is gross margin: it covers the item's direct cost only. Rent, wages, marketing and taxes come out of it, so net margin will be lower.`,
    },
  ],

  related: [relatedLink("discount"), relatedLink("sales-tax"), relatedLink("percentage"), relatedLink("self-employment-tax"), relatedLink("investment-return"), relatedLink("break-even")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate profit margin?", a: "Margin = (price − cost) ÷ price. If an item costs $60 and sells for $100, profit is $40 and the margin is 40 ÷ 100 = 40%." },
    { q: "What's the difference between margin and markup?", a: "Margin is profit as a share of the selling price; markup is profit as a share of the cost. The same $40 profit on a $60 item sold for $100 is a 40% margin but a 66.7% markup." },
    { q: "How do I price for a target margin?", a: "Price = cost ÷ (1 − target margin). For a 50% margin on a $60 cost: 60 ÷ 0.5 = $120." },
    { q: "What is a good profit margin?", a: "It varies widely by industry. Grocery stores often run gross margins around 25–30%, while software and many services exceed 70%. Compare with businesses like yours." },
    { q: "Is this gross or net margin?", a: "Gross margin, based only on the item's direct cost. Net margin subtracts all expenses, including overhead, wages and taxes." },
  ],

  teach: {
    heading: "What is profit margin?",
    whatIsIt:
      "Profit margin is the share of each sale you keep after the direct cost of the item. A 40% margin means 40 cents of every dollar of revenue is gross profit. Markup describes the same profit relative to cost instead of price.",
    whyItMatters:
      "Margin tells you how much room you have to cover overhead, absorb discounts and still make money. Confusing it with markup leads to underpricing: a business aiming for 50% margins that adds a 50% markup will end up with 33%.",
    whatToDoNext:
      "Include every direct cost in the cost figure: materials, shipping, packaging and payment fees. Then check what discounts do to your margin with the discount calculator, and if you're self-employed, set aside money for tax with the self-employment tax calculator.",
  },

  method: { label: "Margin = (price − cost) ÷ price; markup = (price − cost) ÷ cost; price for target margin = cost ÷ (1 − margin)" },

  monetization: [
    { kind: "internal", headline: "Self-employed?", body: "Estimate the self-employment tax on your profit and how much to set aside each quarter.", ctaLabel: "Open the self-employment tax calculator", href: "/self-employment-tax" },
  ],
};
