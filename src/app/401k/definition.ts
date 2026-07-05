import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import { PLAN_YEAR_OPTIONS } from "@/lib/calculator/retirement-data";
import { computeFourOhOneK, type FourOhOneKInputs, type FourOhOneKResults } from "./compute";

const defaults: FourOhOneKInputs = {
  year: "2026",
  currentAge: 40,
  retirementAge: 65,
  salary: 100000,
  contributionPercent: 4,
  employerMatchRate: 50,
  employerMatchLimitPercent: 6,
  annualReturn: 7,
  currentBalance: 50000,
};

export const fourOhOneKDef: CalculatorDefinition<FourOhOneKInputs, FourOhOneKResults> = {
  slug: "401k",
  hub: "investing",
  h1: "401(k) Calculator",
  valueProp: "Project your 401(k) balance, capture the full employer match, and stay within the annual limit.",
  title: "401(k) Calculator (Employer Match & Growth) | freecalcs.io",
  metaDescription:
    "Free 401(k) calculator: project your balance at retirement, see how much employer match you're capturing (or leaving on the table), and check your contribution against the 2025/2026 IRS limit.",
  primaryKeyword: "401(k) Calculator",
  secondaryKeywords: ["401k employer match calculator", "401k contribution limit 2026", "401k growth", "employer match"],
  intro:
    "Your 401(k) has two engines: your own contributions and your employer's match — plus decades of tax-advantaged compounding. This calculator projects your balance at retirement, shows exactly how much employer match you're capturing (or leaving unclaimed), and checks your contribution against the IRS annual limit, including the catch-up you qualify for.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "year", label: "Contribution-limit year", type: "select", default: "2026", options: PLAN_YEAR_OPTIONS },
    { name: "currentAge", label: "Current age", type: "number", default: 40, min: 16, max: 90 },
    { name: "retirementAge", label: "Retirement age", type: "number", default: 65, min: 40, max: 90 },
    { name: "salary", label: "Annual salary", type: "currency", default: 100000 },
    { name: "contributionPercent", label: "Your contribution", type: "percent", default: 4, step: 0.5 },
    { name: "employerMatchRate", label: "Employer match rate", type: "percent", default: 50, step: 5, helpText: "Cents matched per dollar you contribute (50 = 50%)." },
    { name: "employerMatchLimitPercent", label: "Match up to (% of salary)", type: "percent", default: 6, step: 0.5 },
    { name: "annualReturn", label: "Expected annual return", type: "percent", default: 7, step: 0.1 },
    { name: "currentBalance", label: "Current 401(k) balance", type: "currency", default: 50000 },
  ],

  compute: computeFourOhOneK,

  results: [
    { key: "balanceAtRetirement", label: "Projected 401(k) at retirement", format: "currency", variant: "primary", hint: "Your contributions + employer match, grown at your expected return." },
    { key: "employerAnnual", label: "Employer match / year", format: "currency", variant: "secondary" },
    { key: "matchLeftOnTable", label: "Match left on the table / year", format: "currency", variant: "secondary" },
    { key: "employeeAnnual", label: "Your contribution / year", format: "currency", variant: "secondary" },
    { key: "employerMatchGrown", label: "Match grown by retirement", format: "currency", variant: "secondary" },
    { key: "limit", label: "Your annual IRS limit", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "401(k) balance growth to retirement",
    yFormat: "currency",
    series: (r) => r.chart,
  },

  scenarios: [
    { id: "maxmatch", label: "Contribute to the match (6%)", patch: { contributionPercent: 6 } },
    { id: "ten", label: "Contribute 10%", patch: { contributionPercent: 10 } },
    { id: "sixty", label: "I'm age 61 (super catch-up)", patch: { currentAge: 61 } },
  ],

  insights: [
    {
      id: "match-left",
      priority: 94,
      tone: "warn",
      when: (r) => r.matchLeftOnTable > 0,
      say: (r, v) =>
        `You're leaving ${money(
          r.matchLeftOnTable,
        )}/year of employer match unclaimed. Contributing up to ${pct(
          v.employerMatchLimitPercent,
          0,
        )} of salary would capture it — an instant, guaranteed return on that money.`,
    },
    {
      id: "full-match",
      priority: 90,
      tone: "success",
      when: (r) => r.matchLeftOnTable === 0 && r.employerAnnual > 0,
      say: (r) =>
        `You're capturing the full employer match — ${money(
          r.employerAnnual,
        )}/year of free money, the best guaranteed return in investing.`,
    },
    {
      id: "over-limit",
      priority: 88,
      tone: "warn",
      when: (r) => r.overLimit,
      say: (r) =>
        `Your contribution exceeds the ${money(
          r.limit,
        )} annual elective-deferral limit for your age, so only ${money(
          r.employeeAnnual,
        )} can go into the 401(k) — the rest needs another account like an IRA or taxable brokerage.`,
    },
    {
      id: "catch-up",
      priority: 84,
      tone: "info",
      when: (r) => r.catchUp !== "none" && !r.overLimit,
      say: (r) =>
        r.catchUp === "super"
          ? `At ages 60–63 you get the higher SECURE 2.0 catch-up, so your limit is ${money(
              r.limit,
            )} this year — a rare window to supercharge savings before retirement.`
          : `Being 50+ adds a catch-up contribution, raising your limit to ${money(
              r.limit,
            )} this year. Use the extra room if your budget allows.`,
    },
    {
      id: "room-to-limit",
      priority: 76,
      when: (r) => r.roomToLimit > 0 && !r.overLimit,
      say: (r) =>
        `You have ${money(
          r.roomToLimit,
        )} of unused room below your ${money(r.limit)} annual limit — every extra dollar is tax-advantaged and compounds for decades.`,
    },
    {
      id: "match-grown",
      priority: 72,
      tone: "success",
      when: (r) => r.employerMatchGrown > 0,
      say: (r) =>
        `The employer match alone grows into ${money(
          r.employerMatchGrown,
        )} by retirement — compensation you'd forfeit entirely by not contributing.`,
    },
    {
      id: "total-projection",
      priority: 70,
      when: (r) => r.years > 0,
      say: (r, v) =>
        `Combined, you and your employer add ${money(
          r.totalAnnual,
        )}/year; grown at ${pct(v.annualReturn)} that reaches ${money(
          r.balanceAtRetirement,
        )} by age ${v.retirementAge}.`,
    },
  ],

  related: [
    relatedLink("retirement"),
    relatedLink("roth-vs-traditional"),
    relatedLink("savings-goal"),
    relatedLink("compound-interest"),
  ],

  faqs: [
    { q: "What is the 401(k) contribution limit for 2026?", a: "For 2026 the employee elective-deferral limit is $24,500 (up from $23,500 in 2025). If you're 50 or older you can add an $8,000 catch-up, and under SECURE 2.0, those who turn 60–63 during the year get a higher $11,250 catch-up instead. These are IRS figures from Notice 2025-67; the employer match is separate and doesn't count toward this limit." },
    { q: "What is an employer match and how does it work?", a: "Many employers contribute to your 401(k) based on what you put in — a common formula is 50% of your contributions up to 6% of salary. Contribute 6% and they add 3%; contribute less and you get proportionally less. It's part of your pay you only receive by participating, so capturing the full match is a top priority." },
    { q: "What does 'leaving money on the table' mean?", a: "If your employer matches up to 6% of salary but you only contribute 4%, you miss the match on that last 2% — free money you simply don't receive. This calculator shows that unclaimed amount per year, and grown over your career it can total tens of thousands of dollars." },
    { q: "What is the SECURE 2.0 catch-up for ages 60-63?", a: "Starting in 2025, SECURE 2.0 created a higher catch-up contribution for employees who turn 60, 61, 62, or 63 during the year — $11,250 for 2026, versus the standard $8,000 age-50 catch-up. It's a separate, larger amount (not added on top of the $8,000), and it reverts to the standard catch-up at age 64." },
    { q: "How much should I contribute to my 401(k)?", a: "At minimum, enough to capture your full employer match — that's free money. Beyond that, a common target is 15% of salary including the match. If you can max the annual limit, the tax-advantaged compounding is hard to beat. Increase your rate by 1% whenever you get a raise so it's painless." },
    { q: "Does the employer match count toward the contribution limit?", a: "No. The $24,500 (2026) elective-deferral limit applies only to your own contributions. Employer match is on top of it, up to a separate, much higher overall limit ($72,000 in 2026, or more with catch-up). So the match never reduces how much you can personally defer." },
  ],

  teach: {
    whatIsIt:
      "A 401(k) is an employer-sponsored retirement account that lets you invest a slice of each paycheck before (traditional) or after (Roth) tax, where it grows tax-advantaged until retirement. Two features make it powerful: the employer match, which is extra compensation, and the high annual contribution limit set by the IRS.\n\nThis calculator ties those together — projecting your balance from your contribution rate, the match formula, and your expected return, while checking your deferral against the age-appropriate IRS limit.",
    whyItMatters:
      "The employer match is the closest thing to free money in personal finance: a 50% match is an instant 50% return before the market does anything. Missing it by under-contributing is one of the most common and costly retirement mistakes, and its impact compounds silently for decades.\n\nThe contribution limit matters too, especially as you age. The catch-up rules — and the newer, larger SECURE 2.0 catch-up for ages 60–63 — open extra tax-advantaged room precisely when many people are trying to close a savings gap before retirement. Knowing your exact limit helps you use every dollar of it.",
    whatToDoNext:
      "First, set your contribution at least high enough to capture the entire employer match — the calculator flags any match you're leaving unclaimed. That's step one, non-negotiable.\n\nNext, push toward 15% of salary or the annual limit if you can, and automate a 1% increase with every raise. If you're 50 or older — especially 60–63 — check the catch-up room shown here. Finally, use the Roth-vs-Traditional tool to decide whether your contributions should be pre-tax or Roth, and the retirement calculator to see whether your total savings are on track.",
  },

  method: {
    label: "2025 & 2026 elective-deferral limits per IRS Notice 2024-80 and Notice 2025-67; standard future-value growth math",
    sourceUrl: "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Pre-tax or Roth?",
      body: "Once you're capturing the match, the next question is whether your contributions should be traditional (pre-tax) or Roth. See which wins for your tax situation.",
      ctaLabel: "Open Roth vs Traditional",
      href: "/roth-vs-traditional",
    },
  ],
};
