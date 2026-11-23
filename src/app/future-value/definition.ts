// Present & Future Value Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import { computeFutureValue, type FutureValueInputs, type FutureValueResults } from "./compute";

const defaults: FutureValueInputs = { presentValue: 10000, periodicDeposit: 200, rate: 6, years: 10, periodsPerYear: "12", targetFutureValue: 50000 };

export const futureValueDef: CalculatorDefinition<FutureValueInputs, FutureValueResults> = {
  slug: "future-value",
  hub: "investing",
  h1: "Future Value Calculator",
  valueProp: "Find the future value of a lump sum and regular deposits, and the present value of a goal.",
  title: "Future Value & Present Value Calculator | freecalcs.io",
  metaDescription:
    "Free future value calculator: what a lump sum and regular deposits grow to at any rate and compounding, plus the present value of a future amount.",
  primaryKeyword: "Future Value Calculator",
  secondaryKeywords: ["present value calculator", "time value of money", "FV calculator", "annuity future value"],
  intro:
    "Future value answers 'what will this be worth later?' and present value answers 'what is a future amount worth today?'. This future value calculator handles both: it grows a starting amount and regular deposits at your rate and compounding frequency, and discounts a future goal back to today.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "presentValue", label: "Starting amount (PV)", type: "currency", default: 10000 },
    { name: "periodicDeposit", label: "Deposit each period", type: "currency", default: 200, helpText: "Made at the end of each compounding period." },
    { name: "rate", label: "Annual interest rate", type: "percent", default: 6, step: 0.05 },
    { name: "years", label: "Years", type: "years", default: 10, min: 0, max: 60 },
    {
      name: "periodsPerYear",
      label: "Compounding",
      type: "select",
      default: "12",
      options: [
        { label: "Annually", value: "1" },
        { label: "Quarterly", value: "4" },
        { label: "Monthly", value: "12" },
        { label: "Daily", value: "365" },
      ],
    },
    { name: "targetFutureValue", label: "Future goal (for present value)", type: "currency", default: 50000 },
  ],

  compute: computeFutureValue,

  results: [
    { key: "futureValue", label: "Future value", format: "currency2", variant: "primary", hint: "Starting amount plus deposits, with interest." },
    { key: "interestEarned", label: "Interest earned", format: "currency2", variant: "secondary" },
    { key: "totalDeposits", label: "Total put in", format: "currency2", variant: "secondary" },
    { key: "fvOfLumpSum", label: "From the starting amount", format: "currency2", variant: "secondary" },
    { key: "fvOfDeposits", label: "From the deposits", format: "currency2", variant: "secondary" },
    { key: "presentValueOfTarget", label: "Present value of your goal", format: "currency2", variant: "secondary" },
    { key: "effectiveAnnualRate", label: "Effective annual rate", format: "percent", variant: "secondary" },
  ],

  scenarios: [
    { id: "20", label: "20 years", patch: { years: 20 } },
    { id: "no-dep", label: "Lump sum only", patch: { periodicDeposit: 0 } },
    { id: "annual", label: "Annual compounding", patch: { periodsPerYear: "1" } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.futureValue > 0,
      say: (r, v) =>
        `In ${v.years} years, your ${money(r.totalDeposits)} grows to ${money(r.futureValue)}, with ${money(r.interestEarned)} of that from interest.`,
    },
    {
      id: "pv",
      priority: 90,
      when: (r, v) => v.targetFutureValue > 0,
      say: (r, v) =>
        `Having ${money(v.targetFutureValue)} in ${v.years} years is worth ${money(r.presentValueOfTarget)} today at ${pct(v.rate, 2)}. That's what you'd need to invest now, as a lump sum, to reach it.`,
    },
    {
      id: "ear",
      priority: 70,
      when: (r, v) => r.effectiveAnnualRate > v.rate + 0.01,
      say: (r, v) => `Compounding more often than once a year turns ${pct(v.rate, 2)} into an effective ${pct(r.effectiveAnnualRate, 2)} a year.`,
    },
  ],

  related: [relatedLink("compound-interest"), relatedLink("investment-return"), relatedLink("savings-goal"), relatedLink("rule-of-72"), relatedLink("inflation")],
  relatedArticles: [{ slug: "blog/compound-interest-explained", label: "Compound interest explained" }],

  faqs: [
    { q: "What is the future value formula?", a: "For a lump sum, FV = PV × (1 + i)^n, where i is the rate per period and n the number of periods. Regular deposits add PMT × ((1 + i)^n − 1) ÷ i." },
    { q: "What is present value?", a: "The amount a future sum is worth today, given a rate of return. PV = FV ÷ (1 + i)^n. $50,000 in 10 years at 6% a year is worth about $27,920 today." },
    { q: "Are deposits at the start or end of each period?", a: "This calculator assumes the end of each period (an ordinary annuity), the standard convention. Deposits at the start of each period would earn one extra period of interest." },
    { q: "How does compounding frequency matter?", a: "More frequent compounding earns slightly more, because interest starts earning interest sooner. The difference between monthly and daily is small; between annual and monthly it's more noticeable." },
  ],

  teach: {
    heading: "What are future value and present value?",
    whatIsIt:
      "Future value is what money invested today, plus any regular deposits, will be worth at a later date. Present value runs the math backward: it tells you what a future amount is worth in today's money.",
    whyItMatters:
      "These two ideas, often called the time value of money, sit underneath almost every financial decision: comparing a lump sum with payments over time, deciding how much to save for a goal, or valuing an investment.",
    whatToDoNext:
      "Use future value to check whether your savings plan reaches your goal, and present value to compare offers that pay at different times. The savings goal calculator works out the monthly deposit you'd need for a target.",
  },

  method: { label: "FV = PV(1 + i)^n + PMT × ((1 + i)^n − 1) ÷ i, payments at period end; PV = FV ÷ (1 + i)^n; i = annual rate ÷ periods per year" },

  monetization: [
    { kind: "internal", headline: "Have a savings target?", body: "Work out the monthly deposit you need to reach it by a date.", ctaLabel: "Open the savings goal calculator", href: "/savings-goal" },
  ],
};
