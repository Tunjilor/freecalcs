import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money } from "@/lib/calculator/format";
import { computeRetirement, type RetirementInputs, type RetirementResults } from "./compute";

const defaults: RetirementInputs = {
  currentAge: 35,
  retirementAge: 65,
  currentSavings: 50000,
  monthlyContribution: 500,
  employerMatchMonthly: 200,
  annualReturn: 7,
  inflationRate: 3,
  targetBalance: 1500000,
};

export const retirementDef: CalculatorDefinition<RetirementInputs, RetirementResults> = {
  slug: "retirement",
  hub: "investing",
  h1: "Retirement Calculator",
  valueProp: "Project your retirement balance, its real value after inflation, and whether you're on track.",
  title: "Retirement Calculator | freecalcs.io",
  metaDescription:
    "Free retirement calculator: project your savings balance at retirement from your contributions, employer match, and expected return — plus its inflation-adjusted value and whether you're on track for your goal.",
  primaryKeyword: "Retirement Calculator",
  secondaryKeywords: ["retirement savings calculator", "retirement projection", "am I on track for retirement", "nest egg calculator"],
  intro:
    "Will your savings last? This retirement calculator projects the balance you'll have at retirement from your current savings, monthly contributions, and employer match, growing at your expected return. It also shows that balance in today's dollars after inflation, and whether you're on track for your target — so you can adjust now, while small changes still compound for decades.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "currentAge", label: "Current age", type: "number", default: 35, min: 16, max: 90 },
    { name: "retirementAge", label: "Retirement age", type: "number", default: 65, min: 40, max: 90 },
    { name: "currentSavings", label: "Current retirement savings", type: "currency", default: 50000 },
    { name: "monthlyContribution", label: "Your monthly contribution", type: "currency", default: 500 },
    { name: "employerMatchMonthly", label: "Employer match / month", type: "currency", default: 200, helpText: "The employer's own monthly contribution, if any." },
    { name: "annualReturn", label: "Expected annual return", type: "percent", default: 7, step: 0.1 },
    { name: "inflationRate", label: "Inflation rate", type: "percent", default: 3, step: 0.1 },
    { name: "targetBalance", label: "Retirement target (optional)", type: "currency", default: 1500000, helpText: "The nest egg you're aiming for. Leave 0 to skip the on-track check." },
  ],

  compute: computeRetirement,

  results: [
    { key: "projectedBalance", label: "Projected balance at retirement", format: "currency", variant: "primary", hint: "Nominal dollars, at your expected return." },
    { key: "realBalance", label: "In today's dollars", format: "currency", variant: "secondary" },
    { key: "investmentGrowth", label: "Investment growth", format: "currency", variant: "secondary" },
    { key: "totalContributions", label: "Total contributions", format: "currency", variant: "secondary" },
    { key: "employerMatchGrown", label: "Employer match (grown)", format: "currency", variant: "secondary" },
    { key: "requiredMonthly", label: "Monthly needed for target", format: "currency2", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Balance growth to retirement",
    yFormat: "currency",
    series: (r) => r.chart,
  },

  scenarios: [
    { id: "later", label: "Retire at 67", patch: { retirementAge: 67 } },
    { id: "more", label: "+$300/mo", patch: { monthlyContribution: 800 } },
    { id: "return6", label: "Return at 6%", patch: { annualReturn: 6 } },
  ],

  insights: [
    {
      id: "on-track",
      priority: 94,
      tone: "success",
      when: (r, v) => v.targetBalance > 0 && r.onTrack,
      say: (r, v) =>
        `You're on track — your projected ${money(
          r.projectedBalance,
        )} clears your ${money(v.targetBalance)} target with room to spare.`,
    },
    {
      id: "gap",
      priority: 94,
      tone: "warn",
      when: (r, v) => v.targetBalance > 0 && !r.onTrack,
      say: (r, v) =>
        `You're projected to fall about ${money(
          Math.abs(r.gap),
        )} short of your ${money(v.targetBalance)} target. Contributing ${money(
          r.requiredMonthly,
        )}/month total would close the gap.`,
    },
    {
      id: "contribution-lever",
      priority: 84,
      tone: "success",
      when: (r) => r.years > 0,
      say: (r) =>
        `Adding just ${money(r.leverExtra)}/month more would grow to an extra ${money(
          r.leverAddedBalance,
        )} by retirement — small increases compound enormously over ${r.years} years.`,
    },
    {
      id: "employer-match",
      priority: 80,
      tone: "success",
      when: (r) => r.employerContributions > 0,
      say: (r) =>
        `Your employer's contributions grow into ${money(
          r.employerMatchGrown,
        )} of that balance — free money you'd forfeit by not contributing enough to earn the full match.`,
    },
    {
      id: "real-vs-nominal",
      priority: 72,
      when: (r) => r.years > 0,
      say: (r) =>
        `In today's dollars, that ${money(r.projectedBalance)} is worth about ${money(
          r.realBalance,
        )} after inflation — the number that reflects real buying power in retirement.`,
    },
  ],

  related: [
    relatedLink("401k"),
    relatedLink("roth-vs-traditional"),
    relatedLink("savings-goal"),
    relatedLink("compound-interest"),
  ],

  faqs: [
    { q: "How much do I need to retire?", a: "A common rule of thumb is 25× your annual expenses (the flip side of the 4% withdrawal rule), so $60,000/year of spending suggests a $1.5 million target. Your real number depends on your lifestyle, other income like Social Security or a pension, and how long you expect retirement to last. Use the target field to test different goals." },
    { q: "What return should I assume?", a: "Historically a diversified stock-heavy portfolio has returned roughly 7% per year after inflation, or about 10% before it. Many planners use 6–7% as a conservative long-run nominal figure and pair it with a 2–3% inflation assumption. Lower your assumption as you approach retirement and shift toward bonds." },
    { q: "Why does inflation matter so much?", a: "Because a dollar in 30 years buys far less than a dollar today. At 3% inflation, prices roughly double every 24 years, so a $1.5 million balance might have the buying power of about $600,000 in today's money. The 'in today's dollars' figure strips inflation out so you can judge real purchasing power." },
    { q: "Is the employer match really free money?", a: "Yes — it's part of your compensation you only receive if you contribute. If your employer matches 50% up to 6% of salary and you contribute less than 6%, you're leaving guaranteed money on the table. Capturing the full match is usually the highest-return move in personal finance." },
    { q: "How much should I be saving for retirement?", a: "A frequently cited guideline is 15% of gross income (including any employer match) throughout your career. If you started late, you may need more; the catch-up contribution rules let those 50+ save extra. The contribution-lever insight shows how much even a small monthly increase adds over time." },
    { q: "Does this include Social Security?", a: "No. This projects your personal retirement savings only. Social Security, pensions, or other income would reduce the nest egg you need to fund from savings. Estimate those separately and subtract the income they provide from your target." },
  ],

  teach: {
    whatIsIt:
      "A retirement calculator projects how your savings grow between now and the day you stop working. It compounds your current balance and ongoing contributions — yours and any employer match — at an assumed rate of return, then shows the result both in future dollars and, crucially, in today's dollars after inflation.\n\nThe gap between those two numbers is why retirement planning trips people up: a seven-figure future balance can have far less buying power than it appears once decades of inflation are accounted for.",
    whyItMatters:
      "Time is the most powerful variable in retirement saving, and it's the one you can't get back. A contribution made in your 30s has decades to compound; the same dollar added in your 50s has only a fraction of that runway. Seeing the projection makes the cost of waiting concrete.\n\nIt also reframes the two biggest levers you control: your contribution rate and capturing the full employer match. Small, early increases to either can mean hundreds of thousands of dollars more at retirement — far more impact than chasing a slightly higher return.",
    whatToDoNext:
      "Enter your real numbers and a target based on your expected spending (25× annual expenses is a starting point). If you're short, use the scenarios to see what an extra $100–$300 a month, a couple more working years, or a higher savings rate does to the gap.\n\nFirst priority: contribute at least enough to capture your full employer match — it's an immediate, guaranteed return. Then work toward saving around 15% of income. Revisit annually and as your salary grows, and use the linked 401(k) and Roth-vs-Traditional tools to optimize where those dollars go.",
  },

  method: {
    label: "Standard future-value and annuity formulas; real value discounts the projection by your inflation assumption",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Optimize your 401(k) match",
      body: "Most retirement savings runs through a 401(k). See exactly how your contribution percentage and employer match shape your balance — and whether you're leaving match dollars on the table.",
      ctaLabel: "Open the 401(k) calculator",
      href: "/401k",
    },
  ],
};
