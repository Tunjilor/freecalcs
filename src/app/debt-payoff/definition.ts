import type { CalculatorDefinition, InputField } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months, pct } from "@/lib/calculator/format";
import {
  computeDebtPayoff,
  type DebtPayoffInputs,
  type DebtPayoffResults,
} from "./compute";

const defaults: DebtPayoffInputs = {
  // Chosen so the two methods genuinely differ: the smaller balance is the
  // cheaper debt, so snowball and avalanche disagree on the first target.
  d1Balance: 6000, d1Apr: 7, d1Min: 150,
  d2Balance: 12000, d2Apr: 22, d2Min: 300,
  d3Balance: 0, d3Apr: 0, d3Min: 0,
  d4Balance: 0, d4Apr: 0, d4Min: 0,
  d5Balance: 0, d5Apr: 0, d5Min: 0,
  extra: 200,
  method: "avalanche",
};

// Progressive disclosure: each debt slot appears only once the previous slot has
// a balance, so the form feels like "add a debt" while staying within the shared
// InputField schema (no dynamic-list input type exists).
const debtSlot = (n: 1 | 2 | 3 | 4 | 5, prevBalanceKey?: keyof DebtPayoffInputs) => {
  const show = prevBalanceKey
    ? (v: DebtPayoffInputs) => (v[prevBalanceKey] as number) > 0
    : undefined;
  return [
    { name: `d${n}Balance`, label: `Debt ${n} — balance`, type: "currency", default: 0, showWhen: show },
    { name: `d${n}Apr`, label: `Debt ${n} — APR`, type: "percent", default: 0, step: 0.1, showWhen: show },
    { name: `d${n}Min`, label: `Debt ${n} — minimum payment`, type: "currency", default: 0, showWhen: show },
  ] as InputField<DebtPayoffInputs>[];
};

export const debtPayoffDef: CalculatorDefinition<DebtPayoffInputs, DebtPayoffResults> = {
  slug: "debt-payoff",
  hub: "loans",
  h1: "Debt Payoff Calculator",
  valueProp: "Snowball vs avalanche: see which method clears your debts fastest and cheapest.",
  title: "Debt Payoff Calculator (Snowball vs Avalanche) | freecalcs.io",
  metaDescription:
    "Free debt payoff calculator: compare the snowball and avalanche methods across all your debts. See your debt-free date, total interest, payoff order, and how an extra payment helps.",
  primaryKeyword: "Debt Payoff Calculator",
  secondaryKeywords: ["debt snowball calculator", "debt avalanche", "debt free date", "credit card payoff"],
  intro:
    "When you're juggling several balances, the order you attack them in changes how much interest you pay and how fast you're free. This debt payoff calculator runs both proven strategies — the avalanche (highest rate first) and the snowball (smallest balance first) — across all your debts, then shows your debt-free date, total interest, and exactly which method wins for your numbers.",
  commercialIntent: 4,

  defaults,
  inputs: [
    ...debtSlot(1),
    ...debtSlot(2, "d1Balance"),
    ...debtSlot(3, "d2Balance"),
    ...debtSlot(4, "d3Balance"),
    ...debtSlot(5, "d4Balance"),
    { name: "extra", label: "Extra payment / month", type: "currency", default: 200, helpText: "Above the minimums — this is what powers the payoff." },
    {
      name: "method",
      label: "Strategy to follow",
      type: "select",
      default: "avalanche",
      options: [
        { label: "Avalanche — highest APR first (cheapest)", value: "avalanche" },
        { label: "Snowball — smallest balance first (fastest wins)", value: "snowball" },
      ],
    },
  ],

  compute: computeDebtPayoff,

  results: [
    { key: "debtFreeLabel", label: "Debt-free in", format: "text", variant: "primary", hint: "How long until every balance hits zero on your plan." },
    { key: "totalStartingBalance", label: "Total debt", format: "currency", variant: "secondary" },
    { key: "selTotalInterest", label: "Total interest (your plan)", format: "currency", variant: "secondary" },
    { key: "monthlyOutlay", label: "Monthly payment (all debts)", format: "currency", variant: "secondary" },
    { key: "selTotalPaid", label: "Total paid", format: "currency", variant: "secondary" },
    { key: "avalancheInterest", label: "Interest — avalanche", format: "currency", variant: "secondary" },
    { key: "snowballInterest", label: "Interest — snowball", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Total balance over time",
    yFormat: "currency",
    series: (r) => r.schedule.map((row) => ({ x: `Mo ${row.month}`, y: row.balance })),
  },

  scenarios: [
    { id: "aval", label: "Avalanche method", patch: { method: "avalanche" }, blurb: "Cheapest — highest APR first." },
    { id: "snow", label: "Snowball method", patch: { method: "snowball" }, blurb: "Fastest wins — smallest balance first." },
    { id: "more", label: "Add $200/mo more", patch: { extra: 400 } },
  ],

  insights: [
    {
      id: "not-paying-off",
      priority: 99,
      tone: "warn",
      when: (r) => r.debtCount > 0 && !r.paysOff,
      say: (r) =>
        `At ${money(r.monthlyOutlay)}/month your payments barely cover the interest on ${money(
          r.totalStartingBalance,
        )} of debt, so the balance won't fall. Increase the extra payment to actually make progress.`,
    },
    {
      id: "which-method",
      priority: 92,
      tone: "success",
      when: (r) => r.paysOff && r.debtCount >= 2 && r.betterMethod !== "tie",
      say: (r) =>
        r.betterMethod === "avalanche"
          ? `The avalanche method saves about ${money(
              r.interestSavedByAvalanche,
            )} in interest versus the snowball here — it targets your highest-rate debt first, so less interest accrues.`
          : `Here the two methods land close, and the snowball actually comes out slightly ahead — following it clears your smallest balance first for an early win at no real extra cost.`,
    },
    {
      id: "highest-cost",
      priority: 85,
      when: (r) => r.debtCount >= 2 && r.highestApr > 0,
      say: (r) =>
        `Your most expensive balance is ${r.highestAprLabel} at ${pct(
          r.highestApr,
        )} APR — the avalanche method attacks it first, which is why it usually costs the least overall.`,
    },
    {
      id: "extra-impact",
      priority: 80,
      tone: "success",
      when: (r) => r.paysOff && r.monthsSavedByExtra > 0,
      say: (r, v) =>
        `Your extra ${money(v.extra)}/month gets you debt-free about ${months(
          r.monthsSavedByExtra,
        )} sooner and saves roughly ${money(r.interestSavedByExtra)} in interest versus minimums alone.`,
    },
    {
      id: "total-interest",
      priority: 70,
      when: (r) => r.paysOff && r.selTotalInterest > 0,
      say: (r) =>
        `Across these debts you'll pay about ${money(
          r.selTotalInterest,
        )} in interest before you're free — every extra dollar toward the target debt shrinks that number.`,
    },
  ],

  related: [
    relatedLink("loan-payoff"),
    relatedLink("personal-loan"),
    relatedLink("loan"),
    relatedLink("auto-loan"),
  ],

  faqs: [
    { q: "What's the difference between the debt snowball and debt avalanche?", a: "Both pay minimums on every debt and throw all extra money at one target. The avalanche targets the highest-APR debt first, minimizing total interest. The snowball targets the smallest balance first, giving you a quick, motivating win. Avalanche is usually cheaper; snowball is often easier to stick with." },
    { q: "Which method saves the most money?", a: "The avalanche almost always costs less interest, because it kills your highest-rate debt fastest. The gap can be small when your balances and rates are similar, and larger when a big balance also carries the highest rate. This calculator shows the exact interest for both so you can see the trade-off for your debts." },
    { q: "How does the extra payment work?", a: "Your total monthly payment stays constant — the sum of every minimum plus your extra. Each month, minimums go to all debts and everything left over hits the target debt. When a debt is cleared, its payment rolls onto the next target, which is what accelerates payoff over time (the 'snowball' effect)." },
    { q: "What if my minimum payments barely cover the interest?", a: "Then the balance won't fall and the debt never pays off — the calculator flags this. It usually happens with high-APR credit cards and low minimums. The fix is to add extra payment, lower your rate (a balance transfer or consolidation loan), or both." },
    { q: "Should I save an emergency fund or pay off debt first?", a: "A common approach is a small starter emergency fund (say $1,000) first, then aggressive debt payoff, then a full 3–6 month fund. Without any cushion, one surprise expense can push you back onto the cards you're trying to clear. Balance the two to your comfort with risk." },
    { q: "Does this account for new charges on my cards?", a: "No — it assumes you stop adding new debt to these balances. New charges reset the math and are the most common reason payoff plans stall. Pause the cards you're paying down and route spending through cash or debit while you execute the plan." },
  ],

  teach: {
    whatIsIt:
      "A debt payoff plan is simply an ordering rule plus a fixed monthly budget. You pay the minimum on every debt so nothing goes delinquent, then direct every spare dollar at one target debt until it's gone — and when it is, you roll its payment onto the next target.\n\nThe two famous orderings are the avalanche (highest interest rate first) and the snowball (smallest balance first). Everything else — which debt clears when, how much interest you pay, your debt-free date — falls out of that one choice plus how much extra you can add.",
    whyItMatters:
      "Interest is the enemy, and it compounds hardest on your highest-rate balances. The avalanche method minimizes it mathematically, which is why it usually finishes cheapest. But personal finance is behavioral: the snowball's quick first win keeps many people going when a spreadsheet-optimal plan would have them quit.\n\nThe right answer is the plan you'll actually finish. Seeing both — the dollars the avalanche saves and the timeline the snowball delivers — lets you make that trade-off with eyes open instead of guessing.",
    whatToDoNext:
      "List every debt with its balance, APR, and minimum, and decide the largest extra payment you can commit to each month. Enter them above and compare the two methods side by side.\n\nThen pick the method you'll stick with, automate the payments, and — critically — stop adding new charges to the balances you're clearing. Revisit the plan whenever your budget changes; even a small bump to the extra payment can pull your debt-free date in by months.",
  },

  method: {
    label: "Simulates both strategies month by month using standard monthly-compounding interest and a constant total monthly payment",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Focusing on one loan instead?",
      body: "If a single balance is your priority, the loan payoff calculator shows exactly how an extra monthly payment moves its payoff date and interest.",
      ctaLabel: "Open the loan payoff calculator",
      href: "/loan-payoff",
    },
  ],
};
