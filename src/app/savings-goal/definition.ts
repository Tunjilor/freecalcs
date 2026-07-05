import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2 } from "@/lib/calculator/format";
import { computeSavingsGoal, type SavingsGoalInputs, type SavingsGoalResults } from "./compute";

const defaults: SavingsGoalInputs = {
  targetAmount: 50000,
  currentSavings: 10000,
  monthsToGoal: 36,
  annualReturn: 5,
};

export const savingsGoalDef: CalculatorDefinition<SavingsGoalInputs, SavingsGoalResults> = {
  slug: "savings-goal",
  hub: "investing",
  h1: "Savings Goal Calculator",
  valueProp: "Find the monthly amount to save to hit a target by your deadline — with growth doing part of the work.",
  title: "Savings Goal Calculator | freecalcs.io",
  metaDescription:
    "Free savings goal calculator: enter a target, timeframe, current savings, and return to find the monthly contribution needed to get there — or see your projected surplus if you're already on track.",
  primaryKeyword: "Savings Goal Calculator",
  secondaryKeywords: ["how much to save per month", "savings target calculator", "save for a goal", "monthly savings needed"],
  intro:
    "Working toward a specific number — a house down payment, a wedding, an emergency fund? This savings goal calculator turns your target, deadline, and current savings into the exact monthly amount you need to set aside, accounting for the growth your money earns along the way. Automate that number and the goal takes care of itself.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "targetAmount", label: "Savings goal", type: "currency", default: 50000 },
    { name: "currentSavings", label: "Saved so far", type: "currency", default: 10000 },
    { name: "monthsToGoal", label: "Months to reach it", type: "months", default: 36, min: 1, max: 480 },
    { name: "annualReturn", label: "Expected annual return", type: "percent", default: 5, step: 0.1, helpText: "A high-yield savings account is ~4–5%; investments carry more risk and reward." },
  ],

  compute: computeSavingsGoal,

  results: [
    { key: "requiredMonthly", label: "Save per month", format: "currency2", variant: "primary", hint: "The monthly contribution to hit your goal on time." },
    { key: "neededFromContributions", label: "Needed from contributions", format: "currency", variant: "secondary" },
    { key: "totalContributed", label: "Your total contributions", format: "currency", variant: "secondary" },
    { key: "growthEarned", label: "Growth earned", format: "currency", variant: "secondary" },
    { key: "projectedFromCurrent", label: "Current savings grows to", format: "currency", variant: "secondary" },
    { key: "surplus", label: "Projected surplus", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Savings path to your goal",
    yFormat: "currency",
    series: (r) => r.chart,
  },

  scenarios: [
    { id: "moretime", label: "Give it 12 more months", patch: { monthsToGoal: 48 } },
    { id: "invest", label: "Invest at 8%", patch: { annualReturn: 8 } },
    { id: "bighead", label: "Bigger head start", patch: { currentSavings: 25000 } },
  ],

  insights: [
    {
      id: "already-there",
      priority: 94,
      tone: "success",
      when: (r) => r.onTrack,
      say: (r, v) =>
        `Your ${money(v.currentSavings)} already grows to ${money(
          r.projectedFromCurrent,
        )} by your deadline — past your ${money(
          v.targetAmount,
        )} goal, with about ${money(r.surplus)} to spare. No new contributions required.`,
    },
    {
      id: "required-monthly",
      priority: 90,
      when: (r) => !r.onTrack,
      say: (r, v) =>
        `To reach ${money(v.targetAmount)} in ${v.monthsToGoal} months, save ${money2(
          r.requiredMonthly,
        )}/month. Automate it like a bill and the goal takes care of itself.`,
    },
    {
      id: "current-savings-role",
      priority: 82,
      when: (r, v) => !r.onTrack && v.currentSavings > 0,
      say: (r, v) =>
        `Your ${money(v.currentSavings)} head start grows to ${money(
          r.projectedFromCurrent,
        )} on its own, covering part of the goal — your monthly saving fills the remaining ${money(
          r.neededFromContributions,
        )}.`,
    },
    {
      id: "growth-share",
      priority: 78,
      tone: "success",
      when: (r) => !r.onTrack && r.growthEarned > 0,
      say: (r) =>
        `About ${money(
          r.growthEarned,
        )} of your goal comes from investment growth rather than your own pocket — the earlier you start, the more the market chips in.`,
    },
    {
      id: "timeframe-lever",
      priority: 74,
      when: (r) => !r.onTrack && r.requiredMonthlyExtended > 0,
      say: (r) =>
        `Time is your biggest lever: giving yourself ${r.leverMonths} more months drops the required monthly from ${money2(
          r.requiredMonthly,
        )} to ${money2(r.requiredMonthlyExtended)}.`,
    },
  ],

  related: [
    relatedLink("compound-interest"),
    relatedLink("retirement"),
    relatedLink("down-payment"),
    relatedLink("401k"),
  ],
  relatedArticles: [
    { slug: "blog/compound-interest-explained", label: "Compound interest explained" },
    { slug: "blog/how-big-should-emergency-fund-be", label: "How big should my emergency fund be?" },
  ],

  faqs: [
    { q: "How much should I save each month to reach my goal?", a: "It depends on your target, your deadline, what you've already saved, and the return your money earns. This calculator solves for the exact monthly amount: it grows your current savings, subtracts that from the goal, and divides the rest by the future value of a monthly contribution. Automating that figure is the key to actually hitting the goal." },
    { q: "What return should I assume for a savings goal?", a: "For short-term goals (1–3 years) where you can't risk a loss, a high-yield savings account or money-market fund at roughly 4–5% is appropriate. For longer horizons you might invest for a higher expected return, but with more volatility. Match the risk to the timeline — money you'll need soon shouldn't be in the stock market." },
    { q: "Does investment growth really reduce how much I need to save?", a: "Yes. Every dollar of growth is a dollar you don't have to contribute yourself. On a multi-year goal, growth can cover a meaningful share of the target — the calculator shows exactly how much. The longer the timeframe and the higher the return, the more the market does the heavy lifting." },
    { q: "What if I'm already on track?", a: "If your current savings, left to grow, already reaches the target by your deadline, the calculator shows a surplus and a required monthly contribution of zero. You could stop contributing, pull the deadline in, or aim for a larger goal — you've got margin to work with." },
    { q: "Is it better to extend my deadline or save more each month?", a: "Both work; it's a trade-off. Extending the deadline lowers the monthly amount (the calculator shows how much 12 extra months helps) but delays the goal. Saving more reaches it sooner but strains your budget. Pick whichever fits your priorities — the tool quantifies both." },
    { q: "Should I use one account for multiple goals?", a: "It's usually clearer to separate them — a dedicated account per goal (or clearly labeled sub-accounts) prevents you from raiding one goal's money for another and makes progress easy to track. Automate a transfer to each on payday so the saving is invisible and consistent." },
  ],

  teach: {
    whatIsIt:
      "A savings goal calculator works backward from a target to a monthly habit. Instead of asking 'how much will I have,' it asks 'how much must I save each month to end up with exactly this amount by this date' — accounting for both your existing savings and the growth your money earns along the way.\n\nThat reframing turns a vague intention ('save for a house') into a single, automatable number you can set and forget.",
    whyItMatters:
      "Goals without a monthly number rarely happen. 'Save $50,000 for a down payment' is a wish; 'save $1,050 a month for 36 months' is a plan you can put on autopilot. Making the target concrete is most of the battle.\n\nIt also reveals your two real levers — time and rate of return — and their limits. More time lowers the monthly burden significantly; a higher return helps but can't be relied on for short-term money. Seeing how much of the goal growth can cover, versus how much must come from your own contributions, keeps expectations realistic.",
    whatToDoNext:
      "Enter your target, deadline, and current savings, and choose a return that matches your timeframe — conservative for money you'll need within a few years. Take the monthly number and automate a transfer to a dedicated account on payday so it happens without willpower.\n\nIf the monthly amount is a stretch, use the scenarios to see whether extending the deadline a few months makes it comfortable. For long-term goals, the compound-interest and retirement calculators show how the same discipline plays out over decades — where growth does far more of the work.",
  },

  method: {
    label: "Solves the required contribution from standard future-value and annuity formulas",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Saving for a home?",
      body: "If this goal is a down payment, the down-payment planner adds the 20%-to-avoid-PMI math and ties it to a target home price.",
      ctaLabel: "Open the down payment calculator",
      href: "/down-payment",
    },
  ],
};
