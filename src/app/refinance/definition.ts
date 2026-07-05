import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2 } from "@/lib/calculator/format";
import { computeRefinance, type RefinanceInputs, type RefinanceResults } from "./compute";

const defaults: RefinanceInputs = {
  currentBalance: 320000,
  currentRate: 7.5,
  currentRemainingMonths: 336,
  newRate: 6.0,
  newTermMonths: 360,
  closingCosts: 6000,
  financeClosingCosts: "no",
};

export const refinanceDef: CalculatorDefinition<RefinanceInputs, RefinanceResults> = {
  slug: "refinance",
  hub: "mortgage",
  h1: "Mortgage Refinance Calculator",
  valueProp: "Compare your current loan to a new one — monthly savings, break-even, and lifetime cost.",
  title: "Mortgage Refinance Calculator (Break-Even) | freecalcs.io",
  metaDescription:
    "Free mortgage refinance calculator: compare your current loan to a new rate and term. See your new payment, monthly savings, break-even point, and whether it saves interest over the life of the loan.",
  primaryKeyword: "Mortgage Refinance Calculator",
  secondaryKeywords: ["refinance break even calculator", "refinance savings", "should I refinance", "mortgage refinance"],
  intro:
    "Refinancing can lower your monthly payment — but the closing costs mean it only pays off if you stay long enough to earn them back. This calculator compares your current mortgage to a new one, showing your new payment, monthly savings, the break-even point in months, and whether the new loan actually saves interest over its life or just stretches it out.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "currentBalance", label: "Current loan balance", type: "currency", default: 320000 },
    { name: "currentRate", label: "Current interest rate", type: "percent", default: 7.5, step: 0.05 },
    { name: "currentRemainingMonths", label: "Months left on current loan", type: "months", default: 336, min: 1, max: 480 },
    { name: "newRate", label: "New interest rate", type: "percent", default: 6.0, step: 0.05 },
    { name: "newTermMonths", label: "New loan term (months)", type: "months", default: 360, min: 60, max: 480 },
    { name: "closingCosts", label: "Closing costs", type: "currency", default: 6000, helpText: "Lender fees, appraisal, title, etc. — typically 2–5% of the balance." },
    {
      name: "financeClosingCosts",
      label: "Closing costs",
      type: "select",
      default: "no",
      options: [
        { label: "Pay in cash at closing", value: "no" },
        { label: "Roll into the new loan", value: "yes" },
      ],
    },
  ],

  compute: computeRefinance,

  results: [
    { key: "newPayment", label: "New monthly payment", format: "currency2", variant: "primary", hint: "Principal & interest on the new loan." },
    { key: "monthlySavings", label: "Monthly savings", format: "currency2", variant: "secondary" },
    { key: "breakEvenLabel", label: "Break-even", format: "text", variant: "secondary" },
    { key: "currentPayment", label: "Current payment", format: "currency2", variant: "secondary" },
    { key: "lifetimeInterestDelta", label: "Lifetime interest saved", format: "currency", variant: "secondary" },
    { key: "newTotalInterest", label: "New loan total interest", format: "currency", variant: "secondary" },
    { key: "currentTotalInterest", label: "Current loan total interest", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "line",
    title: "Payback timeline — cumulative net savings",
    yFormat: "currency",
    series: (r) => r.payback,
  },

  scenarios: [
    { id: "bigdrop", label: "New rate 5.5%", patch: { newRate: 5.5 } },
    { id: "finance", label: "Roll in the costs", patch: { financeClosingCosts: "yes" } },
    { id: "fifteen", label: "New 15-year term", patch: { newTermMonths: 180 } },
  ],

  insights: [
    {
      id: "never",
      priority: 96,
      tone: "warn",
      when: (r) => r.monthlySavings <= 0,
      say: (r) =>
        `At the new rate your payment doesn't drop (it changes by ${money2(
          r.monthlySavings,
        )}/mo), so there's nothing to recoup — this refinance would cost more than it saves.`,
    },
    {
      id: "break-even",
      priority: 92,
      tone: "success",
      when: (r) => r.monthlySavings > 0 && r.upfrontCost > 0,
      say: (r) =>
        `You'd recoup the ${money(
          r.upfrontCost,
        )} in closing costs after ${r.breakEvenLabel} of ${money2(r.monthlySavings)}/month savings — that's your break-even point.`,
    },
    {
      id: "worth-it-if-stay",
      priority: 86,
      when: (r) => r.monthlySavings > 0 && r.breakEvenMonths > 0,
      say: (r) =>
        `This only pays off if you keep the loan past ${r.breakEvenLabel}. Sell or refinance again before then and you lose money on the closing costs.`,
    },
    {
      id: "lifetime-interest-worse",
      priority: 84,
      tone: "warn",
      when: (r) => r.monthlySavings > 0 && r.lifetimeInterestDelta < 0,
      say: (r) =>
        `Watch the long game: the lower payment comes partly from resetting to a longer term, so you'd actually pay about ${money(
          Math.abs(r.lifetimeInterestDelta),
        )} MORE in total interest over the life of the loan.`,
    },
    {
      id: "lifetime-interest-better",
      priority: 82,
      tone: "success",
      when: (r) => r.monthlySavings > 0 && r.lifetimeInterestDelta > 0,
      say: (r) =>
        `Beyond the monthly savings, the new loan cuts about ${money(
          r.lifetimeInterestDelta,
        )} of total interest over its life — you win on both the payment and the long run.`,
    },
    {
      id: "monthly-freed",
      priority: 70,
      when: (r) => r.monthlySavings > 0,
      say: (r) =>
        `Refinancing drops your payment from ${money2(r.currentPayment)} to ${money2(
          r.newPayment,
        )}, freeing up ${money2(r.monthlySavings)} every month.`,
    },
  ],

  related: [
    relatedLink("mortgage"),
    relatedLink("va-loan"),
    relatedLink("heloc"),
    relatedLink("loan-payoff"),
    relatedLink("qualify"),
  ],
  relatedArticles: [
    { slug: "blog/mortgage-refinance-requirements", label: "Refinance requirements 2026" },
    { slug: "blog/pay-off-mortgage-early", label: "How to pay off your mortgage early" },
    { slug: "blog/pay-off-low-rate-mortgage-early", label: "Should I pay off my 3% mortgage early?" },
    { slug: "blog/should-i-refinance-to-save-200-a-month", label: "Should I refinance to save $200 a month?" },
  ],

  faqs: [
    { q: "What is the break-even point on a refinance?", a: "It's how long it takes for your monthly savings to add up to the closing costs you paid. If refinancing costs $6,000 and saves $250 a month, you break even in 24 months. Stay past that and the refinance is net positive; leave before and you lost money on the costs." },
    { q: "When is refinancing worth it?", a: "Generally when the new rate is meaningfully lower (a common rule of thumb is 0.5–1%+), your break-even is well within how long you'll keep the home, and you're not resetting to a much longer term that raises lifetime interest. This calculator shows all three so you can judge for your situation." },
    { q: "Does a lower payment always mean I'm saving money?", a: "Not necessarily. Refinancing into a fresh 30-year term can lower the payment but stretch interest over more years, so you can pay more overall even at a lower rate. Check the 'lifetime interest' figures here, not just the monthly payment." },
    { q: "Should I roll the closing costs into the loan?", a: "You can, which avoids paying cash upfront, but you then finance those costs and pay interest on them for the life of the loan. Paying cash gives a cleaner break-even; rolling them in preserves cash now at a higher long-term cost. Toggle the option to compare." },
    { q: "What are typical refinance closing costs?", a: "Usually 2–5% of the loan balance — lender origination fees, appraisal, title insurance, and recording fees. On a $320,000 balance that's roughly $6,000–$16,000. Some lenders offer 'no-closing-cost' refinances, but those bundle the cost into a higher rate." },
    { q: "How is my current payment calculated here?", a: "From your current balance, rate, and the months remaining — the payment needed to retire the loan on its existing schedule. Enter your real remaining term for an accurate comparison; using the original 30-year term when you're 5 years in would understate your current payment." },
  ],

  teach: {
    whatIsIt:
      "Refinancing replaces your existing mortgage with a new one, ideally at a lower rate. You pay closing costs to do it, so the core question isn't just 'is the new rate lower' but 'do the monthly savings earn back those costs before I move or refinance again.'\n\nThat's the break-even point, and it's the number that decides whether a refinance is smart. Alongside it sits a subtler trade-off: a new loan resets the clock, so a lower payment can still mean more total interest if the term stretches out.",
    whyItMatters:
      "Lenders advertise the lower payment because it's the most visible benefit — but it can hide two costs. First, the closing costs: if you sell in three years but break even in four, the refinance lost you money. Second, the reset term: dropping from a 24-years-left loan into a fresh 30 can add years of interest even at a lower rate.\n\nSeeing the break-even in months and the lifetime-interest difference side by side turns 'the payment is lower, so it's good' into an actual financial decision you can defend.",
    whatToDoNext:
      "Enter your real current balance, rate, and months remaining, then the new rate, term, and quoted closing costs. Check the break-even against how long you realistically expect to keep the home, and look at whether lifetime interest goes up or down.\n\nIf the break-even is short and lifetime interest falls, it's a strong refinance. If you're chasing a lower payment by extending the term, consider a shorter new term (like 15 or 20 years) to keep the interest savings. Then shop at least three lenders — closing costs and rates vary more than borrowers expect.",
  },

  method: {
    label: "Uses the standard amortization formula; break-even = closing costs ÷ monthly savings",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Thinking about tapping equity instead?",
      body: "If you want cash from your home without resetting your whole mortgage, a HELOC may fit better. Estimate your available credit line and payments.",
      ctaLabel: "Open the HELOC calculator",
      href: "/heloc",
    },
  ],
};
