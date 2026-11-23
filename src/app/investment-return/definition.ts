// Investment Return (CAGR) Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, num, pct } from "@/lib/calculator/format";
import {
  computeInvestmentReturn,
  type InvestmentReturnInputs,
  type InvestmentReturnResults,
} from "./compute";

const defaults: InvestmentReturnInputs = { startValue: 10000, endValue: 18500, years: 8, monthlyContribution: 0, inflation: 3 };

export const investmentReturnDef: CalculatorDefinition<InvestmentReturnInputs, InvestmentReturnResults> = {
  slug: "investment-return",
  hub: "investing",
  h1: "Investment Return Calculator (CAGR)",
  valueProp: "Find the annualized return on any investment, with or without monthly contributions.",
  title: "Investment Return & CAGR Calculator | freecalcs.io",
  metaDescription:
    "Free investment return calculator: your total return, compound annual growth rate (CAGR) and inflation-adjusted return, including regular monthly contributions.",
  primaryKeyword: "Investment Return Calculator",
  secondaryKeywords: ["CAGR calculator", "annualized return calculator", "compound annual growth rate", "ROI calculator", "rate of return calculator"],
  intro:
    "A 50% gain sounds great until you learn it took 15 years. This investment return calculator turns a starting value, ending value and time period into an annualized return, the compound annual growth rate (CAGR), so you can compare investments fairly. If you added money along the way, it accounts for that too, and it shows your return after inflation.",
  commercialIntent: 3,

  defaults,
  inputs: [
    { name: "startValue", label: "Starting value", type: "currency", default: 10000 },
    { name: "endValue", label: "Ending value", type: "currency", default: 18500 },
    { name: "years", label: "Years held", type: "years", default: 8, min: 0, max: 60, step: 0.5 },
    { name: "monthlyContribution", label: "Monthly contribution", type: "currency", default: 0, helpText: "Money you added each month. Leave at 0 for a simple CAGR." },
    { name: "inflation", label: "Inflation rate", type: "percent", default: 3, step: 0.25 },
  ],

  compute: computeInvestmentReturn,

  results: [
    { key: "annualizedReturn", label: "Annualized return (CAGR)", format: "percent", variant: "primary", hint: "The steady yearly rate that gets you from start to end." },
    { key: "totalReturnPct", label: "Total return", format: "percent", variant: "secondary" },
    { key: "gain", label: "Gain", format: "currency", variant: "secondary" },
    { key: "totalContributed", label: "Total invested", format: "currency", variant: "secondary" },
    { key: "realAnnualizedReturn", label: "Return after inflation", format: "percent", variant: "secondary" },
    { key: "doublingYears", label: "Years to double at this rate", format: "number", variant: "secondary" },
  ],

  scenarios: [
    { id: "sp", label: "Long-run stock average (~10%)", patch: { startValue: 10000, endValue: 25937, years: 10, monthlyContribution: 0 } },
    { id: "contrib", label: "Added $200/mo", patch: { monthlyContribution: 200, endValue: 40000 } },
    { id: "loss", label: "A losing investment", patch: { endValue: 8000 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid,
      say: (r, v) =>
        r.hasContributions
          ? `Counting your ${money(v.monthlyContribution)} monthly contributions, your money earned about ${pct(r.annualizedReturn, 2)} a year. Your ${money(
              r.totalContributed,
            )} invested grew to ${money(v.endValue)}.`
          : `Your investment grew ${pct(r.totalReturnPct, 1)} in total, which is ${pct(r.annualizedReturn, 2)} a year compounded over ${num(v.years, v.years % 1 ? 1 : 0)} years.`,
    },
    {
      id: "simple-vs-cagr",
      priority: 85,
      when: (r, v) => r.valid && !r.hasContributions && v.years >= 2 && r.totalReturnPct > 0,
      say: (r, v) =>
        `Dividing the total return by the years would suggest ${pct(r.totalReturnPct / v.years, 1)} a year, but that overstates it. Compounding means a lower steady rate, ${pct(
          r.annualizedReturn,
          2,
        )}, produces the same result.`,
    },
    {
      id: "real",
      priority: 80,
      when: (r) => r.valid,
      say: (r, v) =>
        r.realAnnualizedReturn > 0
          ? `After ${pct(v.inflation, 1)} inflation, your real return is ${pct(r.realAnnualizedReturn, 2)} a year. That's how fast your buying power grew.`
          : `After ${pct(v.inflation, 1)} inflation, your real return is ${pct(r.realAnnualizedReturn, 2)} a year, so your buying power didn't grow.`,
    },
    {
      id: "benchmark",
      priority: 70,
      when: (r) => r.valid && r.annualizedReturn > 0,
      say: (r) =>
        `For comparison, the U.S. stock market has averaged roughly 10% a year over the long run, before inflation. At ${pct(
          r.annualizedReturn,
          1,
        )}, your money doubles about every ${num(r.doublingYears, 1)} years.`,
    },
    {
      id: "invalid",
      priority: 60,
      tone: "warn",
      when: (r) => !r.valid,
      say: () => `Enter a starting value (or monthly contribution) and a holding period above zero to calculate a return.`,
    },
  ],

  related: [relatedLink("compound-interest"), relatedLink("inflation"), relatedLink("retirement"), relatedLink("401k"), relatedLink("capital-gains-tax")],
  relatedArticles: [{ slug: "blog/compound-interest-explained", label: "Compound interest explained" }],

  faqs: [
    { q: "What is CAGR?", a: "Compound annual growth rate: the constant yearly return that would turn your starting value into your ending value over the period. Formula: (end ÷ start)^(1 ÷ years) − 1." },
    { q: "How is CAGR different from average annual return?", a: "An average of yearly returns ignores compounding and overstates performance when returns swing. For example, +50% then −50% averages 0% but leaves you with 25% less money. CAGR reflects what actually happened to your money." },
    { q: "How do contributions affect the return?", a: "New money isn't growth, so it can't be counted as return. With monthly contributions, this calculator finds the single yearly rate that, applied to each deposit for the time it was invested, produces your ending value." },
    { q: "What is a good annualized return?", a: "Broad U.S. stock index funds have returned roughly 10% a year over long periods before inflation, and bonds less. Compare your result with a benchmark that matches the investment's risk." },
    { q: "Does this include taxes and fees?", a: "Only if they're reflected in your ending value. Use the after-fee value from your statement for the most accurate result." },
  ],

  teach: {
    whatIsIt:
      "An annualized return converts any gain or loss over any length of time into an equivalent yearly rate. It makes a 3-year investment comparable with a 10-year one, or a stock with a savings account.",
    whyItMatters:
      "Total returns are easy to misread. A 60% gain over 12 years is about 4% a year, less than many safe options paid at times. Annualizing also exposes the effect of compounding, which is why dividing a total return by the number of years gives the wrong answer.\n\nComparing against inflation is just as important. A return that doesn't beat inflation leaves you with less buying power, even though the balance went up.",
    whatToDoNext:
      "Check your results against an appropriate benchmark, and look at fees: a 1% annual fee can consume a large share of a 6% return over decades. To project forward instead of looking back, use the compound interest calculator with a realistic rate.",
  },

  method: { label: "CAGR = (end ÷ start)^(1/years) − 1. With monthly contributions, the annual rate is solved numerically so the future value of the start plus each deposit equals the ending value. Real return = (1 + nominal) ÷ (1 + inflation) − 1" },

  monetization: [
    { kind: "internal", headline: "Project your money forward", body: "Plug your annualized return into a compound interest projection to see where you'll be in 10 or 20 years.", ctaLabel: "Open the compound interest calculator", href: "/compound-interest" },
  ],
};
