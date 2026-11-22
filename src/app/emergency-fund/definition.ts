// Emergency Fund Calculator definition. Page content derives from this object
// plus the pure compute in ./compute.ts.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months, num } from "@/lib/calculator/format";
import {
  computeEmergencyFund,
  type EmergencyFundInputs,
  type EmergencyFundResults,
} from "./compute";

const defaults: EmergencyFundInputs = {
  housing: 1600,
  utilities: 250,
  food: 600,
  transportation: 400,
  insurance: 200,
  debtMinimums: 150,
  otherEssentials: 200,
  incomeType: "single",
  currentSavings: 5000,
  monthlyContribution: 500,
  apy: 3.5,
};

export const emergencyFundDef: CalculatorDefinition<EmergencyFundInputs, EmergencyFundResults> = {
  slug: "emergency-fund",
  hub: "investing",
  h1: "Emergency Fund Calculator",
  valueProp: "Find how big your emergency fund should be and how long it'll take to build.",
  title: "Emergency Fund Calculator: How Much Do You Need? | freecalcs.io",
  metaDescription:
    "Free emergency fund calculator: size your fund from essential expenses and income stability, see how many months you're covered, and when you'll hit your goal.",
  primaryKeyword: "Emergency Fund Calculator",
  secondaryKeywords: [
    "how much emergency fund do I need",
    "emergency savings calculator",
    "3 to 6 months of expenses",
    "rainy day fund",
  ],
  intro:
    "The usual advice of three to six months of expenses is a wide range. This emergency fund calculator narrows it to a number for you: it adds up only the essential bills you'd still have to pay without a paycheck, sets a target based on how stable your income is, and shows how long it will take to get there with your monthly savings and interest.",
  commercialIntent: 3,

  defaults,
  inputs: [
    { name: "housing", label: "Rent or mortgage", type: "currency", default: 1600 },
    { name: "utilities", label: "Utilities", type: "currency", default: 250 },
    {
      name: "food",
      label: "Groceries",
      type: "currency",
      default: 600,
      helpText: "Essentials only, not dining out.",
    },
    { name: "transportation", label: "Transportation", type: "currency", default: 400 },
    {
      name: "insurance",
      label: "Insurance",
      type: "currency",
      default: 200,
      helpText: "Health, auto and other premiums you pay yourself. If you lost your job, include what health coverage would cost.",
    },
    { name: "debtMinimums", label: "Minimum debt payments", type: "currency", default: 150 },
    {
      name: "otherEssentials",
      label: "Other essentials",
      type: "currency",
      default: 200,
      helpText: "Childcare, medication, phone.",
    },
    {
      name: "incomeType",
      label: "Your income",
      type: "select",
      default: "single",
      options: [
        { label: "Two stable incomes (3 months)", value: "dual" },
        { label: "One stable income (6 months)", value: "single" },
        { label: "Self-employed or variable (9 months)", value: "variable" },
      ],
    },
    { name: "currentSavings", label: "Emergency savings now", type: "currency", default: 5000 },
    { name: "monthlyContribution", label: "You can save / month", type: "currency", default: 500 },
    {
      name: "apy",
      label: "Savings account APY",
      type: "percent",
      default: 3.5,
      step: 0.05,
      helpText: "High-yield savings rates change often. Use your bank's current rate.",
    },
  ],

  compute: computeEmergencyFund,

  results: [
    {
      key: "targetFund",
      label: "Your emergency fund target",
      format: "currency",
      variant: "primary",
      hint: "Essential expenses × months for your income type.",
    },
    { key: "monthlyEssentials", label: "Essential expenses / month", format: "currency", variant: "secondary" },
    { key: "targetMonths", label: "Months of expenses", format: "number", variant: "secondary" },
    { key: "coverageLabel", label: "Months covered now", format: "text", variant: "secondary" },
    { key: "gap", label: "Still to save", format: "currency", variant: "secondary" },
    { key: "progressPct", label: "Progress", format: "percent", variant: "secondary" },
    { key: "goalLabel", label: "Time to reach your goal", format: "text", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Your emergency fund over time",
    yFormat: "currency",
    series: (r) => r.path,
  },

  scenarios: [
    { id: "more", label: "Save $250 more / mo", patch: { monthlyContribution: 750 } },
    { id: "dual", label: "Two incomes", patch: { incomeType: "dual" } },
    { id: "variable", label: "Self-employed", patch: { incomeType: "variable" } },
  ],

  insights: [
    {
      id: "coverage",
      priority: 95,
      when: (r) => r.monthlyEssentials > 0,
      say: (r) =>
        r.monthsCovered >= r.targetMonths
          ? `You're fully funded: your savings would cover about ${num(r.monthsCovered, 1)} months of essential bills, above your ${r.targetMonths}-month target.`
          : `Your savings would cover about ${num(r.monthsCovered, 1)} months of essential bills. Your target is ${r.targetMonths} months, or ${money(
              r.targetFund,
            )}.`,
    },
    {
      id: "time-to-goal",
      priority: 90,
      when: (r) => r.monthsToGoal > 0,
      say: (r, v) =>
        `Saving ${money(v.monthlyContribution)} a month, you'll reach ${money(r.targetFund)} in about ${months(
          r.monthsToGoal,
        )}${r.interestEarned >= 50 ? `, with roughly ${money(r.interestEarned)} of that coming from interest` : ""}.`,
    },
    {
      id: "never",
      priority: 90,
      tone: "warn",
      when: (r) => r.monthsToGoal < 0,
      say: (r) =>
        `At your current savings rate you won't reach ${money(
          r.targetFund,
        )}. Even $50 a week puts you on a path; automate it on payday so it happens before you can spend it.`,
    },
    {
      id: "starter-first",
      priority: 88,
      tone: "warn",
      when: (r) => !r.starterReached && r.monthsToStarter > 0,
      say: (r) =>
        `Start with a starter fund of ${money(r.starterFund)}, one month of essentials. At your pace that takes about ${months(
          r.monthsToStarter,
        )} and covers most surprise car or medical bills.`,
    },
    {
      id: "starter-then-debt",
      priority: 80,
      when: (r, v) => r.starterReached && r.monthsCovered < r.targetMonths && v.debtMinimums > 0,
      say: () =>
        `With a starter fund in place, it's reasonable to split extra money between this fund and any high-interest debt. Credit-card interest usually costs far more than savings earn.`,
    },
    {
      id: "range",
      priority: 70,
      when: (r, v) => r.monthlyEssentials > 0 && v.incomeType !== "dual",
      say: (r) =>
        `For context, three months of your essentials is ${money(r.minTargetFund)} and six months is ${money(
          r.maxTargetFund,
        )}. Single earners and anyone with variable income should aim for the upper end or beyond.`,
    },
    {
      id: "where-to-keep",
      priority: 60,
      when: (r, v) => v.apy < 1 && r.targetFund > 0,
      say: (r) =>
        `At under 1% APY, your fund is losing ground to inflation. Moving ${money(
          r.targetFund,
        )} to a federally insured high-yield savings account could earn hundreds of dollars a year with the same access.`,
    },
  ],

  related: [
    relatedLink("savings-goal"),
    relatedLink("compound-interest"),
    relatedLink("debt-payoff"),
    relatedLink("credit-card-payoff"),
    relatedLink("retirement"),
    relatedLink("mortgage-payoff"),
  ],
  relatedArticles: [
    { slug: "blog/how-big-should-emergency-fund-be", label: "How big should your emergency fund be?" },
  ],

  faqs: [
    {
      q: "How much should I have in my emergency fund?",
      a: "Three to six months of essential expenses is the standard range. Aim for three months if your household has two stable incomes, six if you rely on one, and more if you're self-employed or your income varies.",
    },
    {
      q: "What expenses should an emergency fund cover?",
      a: "Only what you'd still have to pay without a paycheck: housing, utilities, groceries, transportation, insurance, minimum debt payments and other true necessities. Leave out dining out, subscriptions and savings contributions, since you'd cut those in an emergency.",
    },
    {
      q: "Where should I keep my emergency fund?",
      a: "In a federally insured high-yield savings or money market account that you can reach within a day or two. Don't invest it in stocks, which can be down exactly when you need the money.",
    },
    {
      q: "Should I build an emergency fund or pay off debt first?",
      a: "Build a small starter fund first, about one month of expenses or at least $1,000, so a surprise bill doesn't go on a credit card. Then put most extra money toward high-interest debt while continuing to grow the fund.",
    },
    {
      q: "Is an emergency fund the same as savings?",
      a: "No. An emergency fund is reserved for job loss, medical bills and urgent repairs. Savings for a vacation, a car or a down payment should be kept separately so you don't drain your safety net for planned spending.",
    },
  ],

  teach: {
    whatIsIt:
      "An emergency fund is cash set aside for expenses you can't plan for: losing your job, a medical bill, a major car or home repair. It's sized in months of essential expenses because its main job is to keep the bills paid while your income is interrupted.\n\nThis calculator counts only essential spending, because in a real emergency you'd cut back on everything else. That's why your target is usually smaller than three to six months of your full budget.",
    whyItMatters:
      "Without an emergency fund, the money for a surprise expense usually comes from a credit card at 20% or more, or from a retirement account with taxes and penalties. A few thousand dollars in savings turns those emergencies into inconveniences.\n\nThe right size depends on how quickly you could replace your income. A household with two steady paychecks can absorb one job loss for a while, so three months is often enough. A single earner, or someone whose income varies, faces bigger risk and should keep more.",
    whatToDoNext:
      "Open a separate high-yield savings account just for this fund, so it's out of sight in your everyday checking. Set up an automatic transfer on payday for the monthly amount you entered above.\n\nWork toward a one-month starter fund first, then split extra money between this fund and any high-interest debt. Once you've reached your target, redirect that monthly transfer to retirement or other goals; the savings goal and compound interest calculators can help plan what's next.",
  },

  method: {
    label:
      "Target = essential monthly expenses × 3, 6 or 9 months by income type; time to goal compounds your savings monthly at the APY you enter",
  },

  monetization: [
    {
      kind: "internal",
      headline: "Fully funded? Put the next dollar to work",
      body: "Once your safety net is in place, see what the same monthly amount could grow to over time.",
      ctaLabel: "Open the compound interest calculator",
      href: "/compound-interest",
    },
  ],
};
