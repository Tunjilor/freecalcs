// Break-Even Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, num, pct } from "@/lib/calculator/format";
import { computeBreakEven, type BreakEvenInputs, type BreakEvenResults } from "./compute";

const defaults: BreakEvenInputs = { fixedCosts: 6000, pricePerUnit: 50, variableCostPerUnit: 20, targetProfit: 3000, expectedUnits: 300 };

export const breakEvenDef: CalculatorDefinition<BreakEvenInputs, BreakEvenResults> = {
  slug: "break-even",
  hub: "everyday",
  h1: "Break-Even Calculator",
  valueProp: "Find how many units you need to sell to cover your costs and hit a profit target.",
  title: "Break-Even Calculator: Units & Revenue | freecalcs.io",
  metaDescription:
    "Free break-even calculator: units and revenue needed to cover fixed costs, sales needed for a profit target, contribution margin and margin of safety.",
  primaryKeyword: "Break-Even Calculator",
  secondaryKeywords: ["break-even point", "break even analysis", "contribution margin", "how many units to break even"],
  intro:
    "Every sale contributes a little toward your fixed costs, and the break-even point is where those contributions cover them. This break-even calculator finds how many units and how much revenue you need each month to break even and to hit a profit target, and how much cushion your expected sales give you.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "fixedCosts", label: "Fixed costs / month", type: "currency", default: 6000, helpText: "Rent, salaries, software, insurance: costs that don't change with sales." },
    { name: "pricePerUnit", label: "Price per unit", type: "currency", default: 50 },
    { name: "variableCostPerUnit", label: "Variable cost per unit", type: "currency", default: 20, helpText: "Materials, shipping, payment fees per sale." },
    { name: "targetProfit", label: "Target profit / month", type: "currency", default: 3000 },
    { name: "expectedUnits", label: "Expected sales / month (units)", type: "number", default: 300 },
  ],

  compute: computeBreakEven,

  results: [
    { key: "breakEvenLabel", label: "Break-even sales / month", format: "text", variant: "primary", hint: "Sales needed to cover fixed costs." },
    { key: "breakEvenRevenue", label: "Break-even revenue", format: "currency", variant: "secondary" },
    { key: "contributionMargin", label: "Contribution margin per unit", format: "currency2", variant: "secondary" },
    { key: "targetLabel", label: "Sales for your profit target", format: "text", variant: "secondary" },
    { key: "profitAtExpected", label: "Profit at expected sales", format: "currency", variant: "secondary" },
    { key: "marginOfSafetyPct", label: "Margin of safety", format: "percent", variant: "secondary" },
  ],

  scenarios: [
    { id: "price", label: "Raise price to $55", patch: { pricePerUnit: 55 } },
    { id: "rent", label: "Cut fixed costs $1,000", patch: { fixedCosts: 5000 } },
  ],

  insights: [
    {
      id: "not-viable",
      priority: 99,
      tone: "warn",
      when: (r) => !r.viable,
      say: () => `Your price doesn't cover the variable cost of each unit, so selling more only loses more. Raise the price or cut per-unit costs first.`,
    },
    {
      id: "headline",
      priority: 95,
      when: (r) => r.viable,
      say: (r) =>
        `Each sale contributes ${money2(r.contributionMargin)} (${pct(r.contributionMarginRatio, 0)} of the price) toward fixed costs. You break even at ${num(r.breakEvenUnits)} units, or ${money(
          r.breakEvenRevenue,
        )} in sales, a month.`,
    },
    {
      id: "target",
      priority: 90,
      when: (r, v) => r.viable && v.targetProfit > 0,
      say: (r, v) => `To earn ${money(v.targetProfit)} a month, you need ${num(r.unitsForTarget)} units (${money(r.revenueForTarget)} in sales).`,
    },
    {
      id: "safety",
      priority: 85,
      when: (r, v) => r.viable && v.expectedUnits > 0,
      say: (r) =>
        r.marginOfSafetyPct > 0
          ? `At your expected sales, profit is ${money(r.profitAtExpected)} a month, and sales could fall ${pct(r.marginOfSafetyPct, 0)} before you'd lose money.`
          : `Your expected sales fall short of break-even, for a monthly loss of ${money(-r.profitAtExpected)}.`,
    },
  ],

  related: [relatedLink("profit-margin"), relatedLink("discount"), relatedLink("self-employment-tax"), relatedLink("sales-tax"), relatedLink("percentage")],
  relatedArticles: [],

  faqs: [
    { q: "How do you calculate the break-even point?", a: "Break-even units = fixed costs ÷ (price − variable cost per unit). With $6,000 of fixed costs and a $30 contribution per unit, you break even at 200 units." },
    { q: "What is contribution margin?", a: "The amount each sale contributes toward fixed costs and profit: price minus variable cost per unit. Its ratio to price tells you what share of each sales dollar is available to cover overhead." },
    { q: "What is the margin of safety?", a: "How far sales can drop before you reach break-even, as a percentage of expected sales. A larger margin of safety means a business is less vulnerable to a slow month." },
    { q: "What counts as a fixed cost?", a: "Costs that stay the same regardless of how much you sell in the short run: rent, salaries, insurance, software subscriptions and loan payments." },
  ],

  teach: {
    heading: "What is a break-even point?",
    whatIsIt:
      "The break-even point is the level of sales where total revenue equals total costs, so profit is zero. Below it you lose money; above it every sale adds profit equal to its contribution margin.",
    whyItMatters:
      "It turns a pricing or business idea into a concrete sales target. Knowing you need 200 sales a month is something you can test against your marketing and capacity. It also shows which lever matters most: price, variable costs or overhead.",
    whatToDoNext:
      "Try small changes to each input to see which moves break-even most. Then check your pricing with the profit margin calculator, and set aside money for taxes on profit with the self-employment tax calculator.",
  },

  method: { label: "Contribution margin = price − variable cost; break-even units = fixed costs ÷ contribution margin (rounded up); units for profit = (fixed costs + target) ÷ contribution margin" },

  monetization: [
    { kind: "internal", headline: "Check your pricing", body: "See your margin and markup, and the price you need for a target margin.", ctaLabel: "Open the profit margin calculator", href: "/profit-margin" },
  ],
};
