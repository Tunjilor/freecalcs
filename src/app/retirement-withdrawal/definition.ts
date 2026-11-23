// Retirement Withdrawal Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import {
  computeRetirementWithdrawal,
  type RetirementWithdrawalInputs,
  type RetirementWithdrawalResults,
} from "./compute";

const defaults: RetirementWithdrawalInputs = { savings: 800000, monthlyWithdrawal: 3000, annualReturn: 5, inflation: 3, yearsNeeded: 30 };

export const retirementWithdrawalDef: CalculatorDefinition<RetirementWithdrawalInputs, RetirementWithdrawalResults> = {
  slug: "retirement-withdrawal",
  hub: "investing",
  h1: "Retirement Withdrawal Calculator",
  valueProp: "Find out how long your retirement savings will last, and how much you can safely withdraw.",
  title: "How Long Will My Money Last? Retirement Calculator | freecalcs.io",
  metaDescription:
    "Free retirement withdrawal calculator: how long your savings last with inflation-adjusted withdrawals, your rate vs the 4% rule, and a safe amount.",
  primaryKeyword: "Retirement Withdrawal Calculator",
  secondaryKeywords: ["how long will my money last", "4% rule calculator", "safe withdrawal rate", "retirement drawdown calculator"],
  intro:
    "Saving for retirement is half the plan; the other half is spending it without running out. This retirement withdrawal calculator shows how long your savings will last when withdrawals rise with inflation each year, compares your withdrawal rate with the 4% rule, and finds the starting amount you could withdraw to make the money last your chosen number of years.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "savings", label: "Retirement savings", type: "currency", default: 800000 },
    { name: "monthlyWithdrawal", label: "Monthly withdrawal (first year)", type: "currency", default: 3000 },
    { name: "annualReturn", label: "Expected annual return", type: "percent", default: 5, step: 0.25, helpText: "A balanced portfolio in retirement; lower is more cautious." },
    { name: "inflation", label: "Inflation", type: "percent", default: 3, step: 0.25, helpText: "Withdrawals rise by this much each year." },
    { name: "yearsNeeded", label: "Years the money must last", type: "years", default: 30, min: 5, max: 50 },
  ],

  compute: computeRetirementWithdrawal,

  results: [
    { key: "lastsLabel", label: "Your money lasts", format: "text", variant: "primary", hint: "With withdrawals rising with inflation." },
    { key: "withdrawalRatePct", label: "First-year withdrawal rate", format: "percent", variant: "secondary" },
    { key: "sustainableMonthly", label: "Sustainable monthly withdrawal", format: "currency", variant: "secondary" },
    { key: "balanceAtHorizon", label: "Balance left at your horizon", format: "currency", variant: "secondary" },
    { key: "totalWithdrawn", label: "Total withdrawn", format: "currency", variant: "secondary" },
  ],

  chart: { kind: "area", title: "Savings balance by year", yFormat: "currency", series: (r) => r.path },

  scenarios: [
    { id: "4pct", label: "4% rule withdrawal", patch: { monthlyWithdrawal: 2667 } },
    { id: "cautious", label: "Returns of 4%", patch: { annualReturn: 4 } },
    { id: "35", label: "Need 35 years", patch: { yearsNeeded: 35 } },
  ],

  insights: [
    {
      id: "lasts",
      priority: 95,
      when: (r, v) => v.monthlyWithdrawal > 0,
      say: (r, v) =>
        r.lastsMonths < 0
          ? `At these assumptions your savings never run out: the portfolio grows faster than your withdrawals.`
          : r.lastsMonths >= v.yearsNeeded * 12
            ? `Your savings last ${r.lastsLabel}, beyond the ${v.yearsNeeded} years you need.`
            : `Your savings would run out after ${r.lastsLabel}, short of the ${v.yearsNeeded} years you planned for.`,
    },
    {
      id: "rate",
      priority: 90,
      when: (r) => r.withdrawalRatePct > 0,
      say: (r) =>
        r.withdrawalRatePct > 4.25
          ? `You're withdrawing ${pct(r.withdrawalRatePct, 1)} in year one, above the classic 4% guideline. Higher rates leave less room for a bad market early in retirement.`
          : `Your first-year withdrawal rate is ${pct(r.withdrawalRatePct, 1)}, at or below the commonly cited 4% guideline.`,
    },
    {
      id: "sustainable",
      priority: 88,
      when: (r) => r.sustainableMonthly > 0,
      say: (r, v) => `To make your savings last exactly ${v.yearsNeeded} years, you could start at about ${money(r.sustainableMonthly)} a month and raise it with inflation each year.`,
    },
    {
      id: "sequence",
      priority: 60,
      when: () => true,
      say: () => `Real returns vary year to year. A market drop early in retirement does more damage than the average suggests, so keep a cash cushion and revisit your plan annually.`,
    },
  ],

  related: [relatedLink("retirement"), relatedLink("401k"), relatedLink("roth-vs-traditional"), relatedLink("inflation"), relatedLink("compound-interest")],
  relatedArticles: [{ slug: "blog/starting-retirement-savings-at-42", label: "Starting retirement savings at 42" }],

  faqs: [
    { q: "What is the 4% rule?", a: "A guideline from 1990s research suggesting you can withdraw 4% of your savings in the first year of retirement, then adjust that dollar amount for inflation each year, with a high chance of the money lasting 30 years." },
    { q: "How long will $1 million last in retirement?", a: "Withdrawing $40,000 a year (4%) and raising it with inflation, $1 million has historically lasted 30 years or more in most periods. Withdrawing $60,000 a year shortens that substantially. Enter your numbers above." },
    { q: "Should I count Social Security?", a: "Yes, but outside this calculator: subtract expected Social Security and pension income from your spending needs, and enter only the amount your savings must cover as the withdrawal." },
    { q: "What return should I assume?", a: "Retirees usually hold a mix of stocks and bonds. Many planners assume 4–6% nominal returns for a balanced portfolio. Use a lower number to be cautious." },
    { q: "Does this include taxes?", a: "No. Withdrawals from traditional 401(k)s and IRAs are taxed as income, so plan to withdraw enough to cover the tax, or use after-tax spending as your target." },
  ],

  teach: {
    heading: "How long will your retirement savings last?",
    whatIsIt:
      "This calculator simulates retirement month by month: your savings earn a return, you withdraw your monthly amount, and each year the withdrawal rises with inflation so your spending power stays the same.",
    whyItMatters:
      "The withdrawal rate is the most important number in retirement planning. Small differences compound: withdrawing 5% instead of 4% can shorten how long the money lasts by a decade. Seeing the sustainable amount helps you set spending you can keep up.",
    whatToDoNext:
      "Subtract guaranteed income like Social Security and pensions from your spending to find what your savings must cover. If the money runs short, try working a year or two longer, spending a little less, or delaying Social Security, then rerun the numbers.",
  },

  method: { label: "Monthly simulation: balance grows at (1 + return)^(1/12) − 1, then the withdrawal is taken; withdrawals rise by inflation every 12 months. Sustainable amount solved by bisection" },

  monetization: [
    { kind: "internal", headline: "Not retired yet?", body: "Project how much you'll have at retirement from your savings, contributions and employer match.", ctaLabel: "Open the retirement calculator", href: "/retirement" },
  ],
};
