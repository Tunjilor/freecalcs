// Budget (50/30/20) Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import { computeBudget, type BudgetInputs, type BudgetResults } from "./compute";

const defaults: BudgetInputs = { monthlyTakeHome: 5200, needs: 2900, wants: 1500, savings: 500 };

export const budgetDef: CalculatorDefinition<BudgetInputs, BudgetResults> = {
  slug: "budget",
  hub: "investing",
  h1: "Budget Calculator (50/30/20 Rule)",
  valueProp: "Split your take-home pay into needs, wants and savings, and see where your budget is off.",
  title: "Budget Calculator: 50/30/20 Rule | freecalcs.io",
  metaDescription:
    "Free 50/30/20 budget calculator: see how much of your take-home pay should go to needs, wants and savings, and how your actual spending compares.",
  primaryKeyword: "Budget Calculator",
  secondaryKeywords: ["50/30/20 budget calculator", "50 30 20 rule", "monthly budget calculator", "budget planner"],
  intro:
    "The 50/30/20 rule is the simplest budget that works: half of your take-home pay for needs, 30% for wants and 20% for savings and extra debt payments. This budget calculator shows those targets for your income, compares them with what you actually spend, and tells you which category to adjust first.",
  commercialIntent: 3,

  defaults,
  inputs: [
    {
      name: "monthlyTakeHome",
      label: "Monthly take-home pay",
      type: "currency",
      default: 5200,
      helpText: "After taxes and payroll deductions. Add back any 401(k) contributions if you want to count them as savings.",
    },
    {
      name: "needs",
      label: "Needs / month",
      type: "currency",
      default: 2900,
      helpText: "Rent or mortgage, utilities, groceries, insurance, transportation, minimum debt payments, childcare.",
    },
    {
      name: "wants",
      label: "Wants / month",
      type: "currency",
      default: 1500,
      helpText: "Dining out, entertainment, subscriptions, travel, shopping, hobbies.",
    },
    {
      name: "savings",
      label: "Savings & extra debt payments / month",
      type: "currency",
      default: 500,
      helpText: "Emergency fund, retirement, investing, and debt payments above the minimum.",
    },
  ],

  compute: computeBudget,

  results: [
    { key: "targetSavings", label: "Savings target (20%)", format: "currency", variant: "primary", hint: "What the 50/30/20 rule says to save each month." },
    { key: "targetNeeds", label: "Needs target (50%)", format: "currency", variant: "secondary" },
    { key: "targetWants", label: "Wants target (30%)", format: "currency", variant: "secondary" },
    { key: "needsPct", label: "Your needs", format: "percent", variant: "secondary" },
    { key: "wantsPct", label: "Your wants", format: "percent", variant: "secondary" },
    { key: "savingsPct", label: "Your savings rate", format: "percent", variant: "secondary" },
    { key: "unallocated", label: "Left over each month", format: "currency", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Your budget vs 50/30/20",
      columns: [
        { key: "category", label: "Category", format: "text", align: "left" },
        { key: "target", label: "Target", format: "currency", align: "right" },
        { key: "actual", label: "You", format: "currency", align: "right" },
        { key: "actualPct", label: "Your %", format: "percent", align: "right" },
      ],
      rows: (r) => r.rows.map((x) => ({ category: x.category, target: x.target, actual: x.actual, actualPct: x.actualPct })),
    },
  ],

  scenarios: [
    { id: "cut-wants", label: "Cut wants $300", patch: { wants: 1200, savings: 800 } },
    { id: "raise", label: "$500 raise", patch: { monthlyTakeHome: 5700 } },
    { id: "cheaper-rent", label: "Rent $400 cheaper", patch: { needs: 2500 } },
  ],

  insights: [
    {
      id: "on-track",
      priority: 99,
      tone: "success",
      when: (r) => r.onTrack,
      say: (r) =>
        `Your budget fits the 50/30/20 rule. You're saving ${pct(r.savingsPct, 0)} of your pay, about ${money(r.annualSavings)} a year.`,
    },
    {
      id: "overspending",
      priority: 98,
      tone: "warn",
      when: (r) => r.unallocated < -0.5,
      say: (r) =>
        `You're spending ${money(-r.unallocated)} a month more than you take home. That gap usually ends up on a credit card, so closing it comes before anything else.`,
    },
    {
      id: "needs-high",
      priority: 90,
      tone: "warn",
      when: (r) => r.overNeeds > 0,
      say: (r) =>
        `Needs take ${pct(r.needsPct, 0)} of your pay, ${money(r.overNeeds)} over the 50% guideline. Housing is usually the cause; it's common in high-cost areas. Make up for it by trimming wants rather than savings.`,
    },
    {
      id: "wants-high",
      priority: 88,
      when: (r) => r.overWants > 0,
      say: (r) =>
        `Wants are ${money(r.overWants)} over 30%. Subscriptions and dining out are the easiest place to cut, and every dollar moved to savings compounds.`,
    },
    {
      id: "savings-gap",
      priority: 86,
      when: (r) => r.savingsGap > 0,
      say: (r) =>
        `You're saving ${pct(r.savingsPct, 0)} of your pay. Reaching 20% means ${money(
          r.savingsGap,
        )} more a month. Automate it on payday so the money moves before you can spend it.`,
    },
    {
      id: "unallocated",
      priority: 80,
      when: (r) => r.unallocated > 50,
      say: (r) =>
        `${money(r.unallocated)} a month isn't assigned to anything. Money without a job tends to get spent; point it at savings or debt.`,
    },
  ],

  related: [
    relatedLink("salary"),
    relatedLink("paycheck"),
    relatedLink("emergency-fund"),
    relatedLink("savings-goal"),
    relatedLink("debt-payoff"),
    relatedLink("net-worth"),
  ],
  relatedArticles: [{ slug: "blog/how-big-should-emergency-fund-be", label: "How big should your emergency fund be?" }],

  faqs: [
    { q: "What is the 50/30/20 rule?", a: "A budgeting guideline that puts 50% of your after-tax income toward needs, 30% toward wants and 20% toward savings and paying down debt beyond the minimums. It was popularized by Senator Elizabeth Warren and Amelia Warren Tyagi in their book All Your Worth." },
    { q: "Is the 50/30/20 rule based on gross or net income?", a: "Net income, your take-home pay after taxes. If you contribute to a 401(k) through payroll, you can add that back to your income and count it toward the 20% savings category." },
    { q: "What counts as a need versus a want?", a: "Needs are what you must pay to live and work: housing, utilities, groceries, insurance, transportation and minimum debt payments. Wants are everything you could cut if you had to, like dining out, streaming services and travel." },
    { q: "What if my needs are more than 50%?", a: "That's common in high-cost cities. Keep the 20% savings goal if you can and shrink wants to make room. Over time, look at your biggest fixed costs, usually housing and car payments." },
    { q: "Are extra debt payments savings?", a: "Yes. Paying more than the minimum on debt improves your finances the same way saving does, so it counts toward the 20%." },
  ],

  teach: {
    whatIsIt:
      "The 50/30/20 budget divides take-home pay into three buckets instead of dozens of categories. Needs get 50%, wants get 30%, and savings and extra debt payments get 20%. You only have to track three numbers.",
    whyItMatters:
      "Most budgets fail because they're too detailed to keep up. The 50/30/20 rule gives you guardrails without daily tracking, and the 20% savings target is enough, over a career, to build an emergency fund, retire on time and stay out of high-interest debt.\n\nComparing your real numbers with the targets shows where the problem is. If needs are high, the fix is a big decision like housing. If wants are high, it's a set of small habits.",
    whatToDoNext:
      "Pull your last two months of bank and card statements and sort each expense into needs, wants or savings. Enter the totals above. Then set up an automatic transfer for your savings amount on payday, and use the emergency fund calculator to decide where that money goes first.",
  },

  method: { label: "Targets are 50%, 30% and 20% of monthly take-home pay; your percentages are each category ÷ take-home pay" },

  monetization: [
    {
      kind: "internal",
      headline: "Know your exact take-home pay",
      body: "Not sure what your monthly take-home is? Work it out after federal and state taxes, FICA and 401(k).",
      ctaLabel: "Open the salary calculator",
      href: "/salary",
    },
  ],
};
