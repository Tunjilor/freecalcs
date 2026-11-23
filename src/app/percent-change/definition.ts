// Percent Change Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { numFlex } from "@/lib/calculator/format";
import { computePercentChange, type PercentChangeInputs, type PercentChangeResults } from "./compute";

const defaults: PercentChangeInputs = { oldValue: 80, newValue: 100 };

export const percentChangeDef: CalculatorDefinition<PercentChangeInputs, PercentChangeResults> = {
  slug: "percent-change",
  hub: "everyday",
  h1: "Percent Change Calculator",
  valueProp: "The percentage increase or decrease from one number to another.",
  title: "Percent Change Calculator: Increase & Decrease | freecalcs.io",
  metaDescription:
    "Free percent change calculator: find the percentage increase or decrease between two numbers, plus percent difference and the change needed to get back.",
  primaryKeyword: "Percent Change Calculator",
  secondaryKeywords: ["percentage increase calculator", "percent increase calculator", "percent decrease calculator", "percentage change formula", "percent difference calculator"],
  intro:
    "Prices, salaries, test scores and stock values all change, and percent change puts the move in proportion. Enter a starting value and an ending value and this percent change calculator gives the percentage increase or decrease, the raw difference, and the percent difference between the two.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "oldValue", label: "Starting value (old)", type: "number", default: 80, step: 0.01 },
    { name: "newValue", label: "Ending value (new)", type: "number", default: 100, step: 0.01 },
  ],

  compute: computePercentChange,

  results: [
    { key: "changeLabel", label: "Percent change", format: "text", variant: "primary", hint: "(new − old) ÷ old × 100" },
    { key: "difference", label: "Difference (new − old)", format: "number", variant: "secondary" },
    { key: "multiplierLabel", label: "New value is", format: "text", variant: "secondary" },
    { key: "reverseLabel", label: "Change to get back", format: "text", variant: "secondary" },
    { key: "pctDifferenceLabel", label: "Percent difference", format: "text", variant: "secondary" },
  ],

  scenarios: [
    { id: "price", label: "Price $4.00 → $4.60", patch: { oldValue: 4, newValue: 4.6 } },
    { id: "salary", label: "Salary $60,000 → $64,500", patch: { oldValue: 60000, newValue: 64500 } },
    { id: "drop", label: "Stock $250 → $200", patch: { oldValue: 250, newValue: 200 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid && r.direction !== "none",
      say: (r, v) =>
        `Going from ${numFlex(v.oldValue)} to ${numFlex(v.newValue)} is a ${r.changeLabel.replace(/^[+−]/, "")} ${r.direction}, a difference of ${numFlex(Math.abs(r.difference))}.`,
    },
    {
      id: "asymmetry",
      priority: 85,
      when: (r) => r.valid && r.direction !== "none" && r.reverseLabel !== "—",
      say: (r) => `Percent changes aren't symmetric: getting back to the starting value takes a ${r.reverseLabel} change, because it's measured from the new, different base.`,
    },
    {
      id: "points",
      priority: 70,
      when: (r, v) => r.valid && Math.abs(v.oldValue) <= 100 && Math.abs(v.newValue) <= 100 && r.direction !== "none",
      say: (r, v) =>
        `If these are percentages themselves, like interest rates, the change is ${numFlex(Math.abs(v.newValue - v.oldValue))} percentage points, which is different from a ${r.changeLabel.replace(/^[+−]/, "")} change.`,
    },
    {
      id: "difference",
      priority: 60,
      when: (r) => r.valid && r.direction !== "none",
      say: (r) => `To compare two values without one being the "before", use percent difference: ${r.pctDifferenceLabel}, measured against their average.`,
    },
    { id: "none", priority: 95, when: (r) => r.direction === "none", say: () => `The two values are the same, so there's no change.` },
    { id: "zero", priority: 95, tone: "warn", when: (r) => r.direction === "undefined", say: () => `Percent change from 0 is not defined: any change from zero would be an infinitely large percentage. Use the raw difference instead.` },
  ],

  related: [relatedLink("percentage"), relatedLink("discount"), relatedLink("raise"), relatedLink("inflation"), relatedLink("profit-margin"), relatedLink("investment-return")],
  relatedArticles: [],

  faqs: [
    { q: "How do you calculate percent change?", a: "Subtract the old value from the new value, divide by the old value, and multiply by 100. From 80 to 100: (100 − 80) ÷ 80 × 100 = 25% increase." },
    { q: "How do I calculate a percentage decrease?", a: "Use the same formula; the result is negative. From 100 to 80: (80 − 100) ÷ 100 × 100 = −20%, a 20% decrease." },
    { q: "Why isn't a 20% drop undone by a 20% gain?", a: "Because the base changes. $100 down 20% is $80, and 20% of $80 is only $16, giving $96. You'd need a 25% gain to get back to $100." },
    { q: "What's the difference between percent change and percent difference?", a: "Percent change measures from a starting value. Percent difference compares two values symmetrically by dividing the gap by their average, so the order doesn't matter." },
    { q: "What's the difference between percent and percentage points?", a: "If a rate moves from 4% to 5%, it rose 1 percentage point, but that's a 25% increase in the rate itself." },
  ],

  teach: {
    heading: "How do you calculate percentage change?",
    whatIsIt:
      "Percent change expresses how much a value grew or shrank relative to where it started. A positive result is an increase and a negative result is a decrease.",
    whyItMatters:
      "Raw differences can mislead: a $5 rise matters far more on a $10 item than a $1,000 one. Percent change makes changes comparable across prices, pay, investments and statistics.",
    whatToDoNext:
      "Always state which value is the starting point. For a markup or a discount on a price, the percentage and discount calculators handle those directly.",
  },

  method: { label: "Percent change = (new − old) ÷ |old| × 100; percent difference = |a − b| ÷ ((|a| + |b|) ÷ 2) × 100" },
};
