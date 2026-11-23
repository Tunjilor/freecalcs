// Inflation Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money2, pct } from "@/lib/calculator/format";
import {
  CPI_ANNUAL,
  CPI_FIRST_YEAR,
  CPI_LAST_FULL_YEAR,
  CPI_LATEST_ESTIMATE_YEAR,
  CPI_SOURCE_URL,
} from "@/lib/data/cpi";
import { computeInflation, type InflationInputs, type InflationResults } from "./compute";

const defaults: InflationInputs = { amount: 100, fromYear: 2000, toYear: CPI_LATEST_ESTIMATE_YEAR, futureRate: 3 };

const decadeRows = [];
for (let y = 1920; y <= CPI_LAST_FULL_YEAR; y += 5) {
  decadeRows.push({ year: String(y), cpi: CPI_ANNUAL[y], value: Math.round(((100 * CPI_ANNUAL[CPI_LAST_FULL_YEAR]) / CPI_ANNUAL[y]) * 100) / 100 });
}

export const inflationDef: CalculatorDefinition<InflationInputs, InflationResults> = {
  slug: "inflation",
  hub: "investing",
  h1: "Inflation Calculator",
  valueProp: "See what money from any year since 1913 is worth today, or what today's dollars will be worth later.",
  title: "Inflation Calculator: Value of a Dollar 1913–2026 | freecalcs.io",
  metaDescription:
    "Free inflation calculator using official CPI data: what a dollar from any year since 1913 is worth today, cumulative inflation, and future buying power.",
  primaryKeyword: "Inflation Calculator",
  secondaryKeywords: ["value of a dollar", "dollar value over time", "CPI inflation calculator", "buying power calculator", "how much is $100 from 1990 worth today"],
  intro:
    "Prices rise almost every year, so a dollar buys less over time. This inflation calculator uses the official Consumer Price Index (CPI-U) from the Bureau of Labor Statistics to show what an amount from any year since 1913 is worth in another year, how much prices rose in between, and the average yearly inflation rate. Pick a year after the data ends to project future buying power.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "amount", label: "Amount", type: "currency", default: 100 },
    { name: "fromYear", label: "From year", type: "number", default: 2000, min: CPI_FIRST_YEAR, max: CPI_LATEST_ESTIMATE_YEAR + 50 },
    { name: "toYear", label: "To year", type: "number", default: CPI_LATEST_ESTIMATE_YEAR, min: CPI_FIRST_YEAR, max: CPI_LATEST_ESTIMATE_YEAR + 50 },
    {
      name: "futureRate",
      label: "Future inflation rate",
      type: "percent",
      default: 3,
      step: 0.25,
      helpText: `Only used for years after ${CPI_LATEST_ESTIMATE_YEAR}. The Fed targets 2%; the long-run U.S. average is about 3%.`,
    },
  ],

  compute: computeInflation,

  results: [
    { key: "adjustedAmount", label: "Equivalent value", format: "currency2", variant: "primary", hint: "Same buying power in the 'to' year." },
    { key: "cumulativeChange", label: "Total price change", format: "percent", variant: "secondary" },
    { key: "avgAnnualRate", label: "Average inflation per year", format: "percent", variant: "secondary" },
    { key: "purchasingPower", label: "Buying power of the same amount", format: "currency2", variant: "secondary" },
  ],

  chart: {
    kind: "line",
    title: "Equivalent value by year",
    yFormat: "currency",
    series: (r) => r.series,
  },

  reference: {
    heading: "What $100 is worth today",
    body: `What $100 from each year is worth in ${CPI_LAST_FULL_YEAR} dollars, using CPI-U annual averages.`,
    tables: [
      {
        title: `$100 in past years, in ${CPI_LAST_FULL_YEAR} dollars`,
        columns: [
          { key: "year", label: "Year", format: "text", align: "left" },
          { key: "cpi", label: "CPI-U", format: "number", align: "right" },
          { key: "value", label: `Worth in ${CPI_LAST_FULL_YEAR}`, format: "currency2", align: "right" },
        ],
        rows: decadeRows,
      },
    ],
  },

  scenarios: [
    { id: "1970", label: "$100 in 1970", patch: { amount: 100, fromYear: 1970 } },
    { id: "1990", label: "$100 in 1990", patch: { amount: 100, fromYear: 1990 } },
    { id: "2020", label: "$100 in 2020", patch: { amount: 100, fromYear: 2020 } },
    { id: "future", label: "$100 in 20 years", patch: { amount: 100, fromYear: CPI_LATEST_ESTIMATE_YEAR, toYear: CPI_LATEST_ESTIMATE_YEAR + 20 } },
  ],

  insights: [
    {
      id: "headline-forward",
      priority: 95,
      when: (r) => r.toYear > r.fromYear,
      say: (r, v) =>
        `${money2(v.amount)} in ${r.fromYear} had the same buying power as ${money2(r.adjustedAmount)} in ${r.toYear}. Prices rose ${pct(
          r.cumulativeChange,
          0,
        )} over those ${r.toYear - r.fromYear} years, an average of ${pct(r.avgAnnualRate, 1)} a year.`,
    },
    {
      id: "headline-back",
      priority: 95,
      when: (r) => r.toYear < r.fromYear,
      say: (r, v) =>
        `${money2(v.amount)} in ${r.fromYear} would have bought about as much as ${money2(r.adjustedAmount)} did in ${r.toYear}.`,
    },
    {
      id: "deflation",
      priority: 90,
      when: (r) => r.toYear > r.fromYear && r.cumulativeChange < 0,
      say: () => `Prices actually fell over this period. Deflation was common in the early 1920s and during the Great Depression, but rare since.`,
    },
    {
      id: "projected",
      priority: 88,
      tone: "warn",
      when: (r) => r.projected,
      say: (r, v) =>
        `Years after ${r.dataLastYear} are a projection at ${pct(v.futureRate, 1)} a year, not data. Real inflation will differ.`,
    },
    {
      id: "estimate-year",
      priority: 80,
      when: (r) => (r.toYear === CPI_LATEST_ESTIMATE_YEAR || r.fromYear === CPI_LATEST_ESTIMATE_YEAR) && !r.projected,
      say: () =>
        `The ${CPI_LATEST_ESTIMATE_YEAR} figure is an estimate based on the months published so far. It'll be updated when the full-year average is released.`,
    },
    {
      id: "savings-lesson",
      priority: 70,
      when: (r) => r.toYear > r.fromYear && r.avgAnnualRate > 1.5 && r.toYear - r.fromYear >= 10,
      say: (r) =>
        `Cash that earned nothing over this period lost ${pct(100 - (100 / (1 + r.cumulativeChange / 100)), 0)} of its buying power. That's why long-term savings need to earn more than inflation.`,
    },
  ],

  related: [relatedLink("compound-interest"), relatedLink("retirement"), relatedLink("savings-goal"), relatedLink("investment-return"), relatedLink("salary")],
  relatedArticles: [{ slug: "blog/compound-interest-explained", label: "Compound interest explained" }],

  faqs: [
    { q: "How is inflation calculated?", a: "This calculator uses the Consumer Price Index for All Urban Consumers (CPI-U), published by the Bureau of Labor Statistics. The value in another year equals the amount × (CPI in that year ÷ CPI in the starting year)." },
    { q: "What is the average rate of inflation in the U.S.?", a: "Since 1913, U.S. consumer prices have risen about 3% a year on average, though individual years have ranged from double-digit inflation in the 1970s and early 1980s to deflation during the Great Depression." },
    { q: "Why does this use annual averages instead of monthly CPI?", a: "Annual averages smooth out monthly swings and are the standard way to compare dollars across years. For a specific month, the result could differ slightly." },
    { q: "Does inflation affect everything equally?", a: "No. CPI measures a broad basket of goods and services. Some items, like healthcare, college tuition and housing, have risen faster than overall CPI, while electronics have often gotten cheaper." },
    { q: "How can I protect my money from inflation?", a: "Keep only short-term needs in cash, and invest long-term money in assets that have historically outpaced inflation, such as diversified stock funds. Treasury Inflation-Protected Securities (TIPS) and I bonds are designed to keep up with CPI." },
  ],

  teach: {
    whatIsIt:
      "Inflation is the general rise in prices over time, which means each dollar buys a little less. In the U.S., it's measured mainly by the Consumer Price Index, which tracks the cost of a typical basket of goods and services for urban households.",
    whyItMatters:
      "Inflation quietly erodes savings, fixed incomes and wages that don't rise. At 3% a year, prices roughly double every 24 years, so money kept in cash for decades loses most of its value.\n\nIt also makes historical prices and salaries misleading. A $40,000 salary in 1995 and $40,000 today are very different amounts of money, and this calculator converts between them.",
    whatToDoNext:
      "Use the result to set realistic goals. When planning retirement or long-term savings, assume prices will keep rising and check that your investments are expected to grow faster. The compound interest and retirement calculators let you plan with an inflation-adjusted return.",
  },

  method: {
    label: "Value = amount × CPI(to) ÷ CPI(from) using BLS CPI-U annual averages (1982–84 = 100). Years after the data are projected at your chosen rate",
    sourceUrl: CPI_SOURCE_URL,
    year: CPI_LATEST_ESTIMATE_YEAR,
  },

  monetization: [
    { kind: "internal", headline: "Make your money outpace inflation", body: "See how much your savings could grow with compound interest at a realistic return.", ctaLabel: "Open the compound interest calculator", href: "/compound-interest" },
  ],
};
