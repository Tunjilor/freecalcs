import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, pct } from "@/lib/calculator/format";
import { computeDownPayment, type DownPaymentInputs, type DownPaymentResults } from "./compute";

const defaults: DownPaymentInputs = {
  homePrice: 400000,
  targetPercent: 10,
  currentSavings: 30000,
  monthsToGoal: 24,
};

export const downPaymentDef: CalculatorDefinition<DownPaymentInputs, DownPaymentResults> = {
  slug: "down-payment",
  hub: "mortgage",
  h1: "Down Payment Calculator",
  valueProp: "Plan your down payment, avoid PMI at 20%, and find the monthly savings to reach your goal.",
  title: "Down Payment Calculator | freecalcs.io",
  metaDescription:
    "Free down payment calculator: see the down payment needed for your target percent, how 20% down avoids PMI, and the monthly savings required to reach your goal by a target date.",
  primaryKeyword: "Down Payment Calculator",
  secondaryKeywords: ["down payment on a house", "how much down payment", "avoid PMI 20 percent", "down payment savings goal"],
  intro:
    "Saving for a down payment is the biggest hurdle most buyers face — and the target matters. This calculator shows the down payment for your chosen percentage, how much more it takes to reach the 20% that eliminates PMI, and exactly how much to set aside each month to hit your goal by a target date.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "homePrice", label: "Target home price", type: "currency", default: 400000 },
    { name: "targetPercent", label: "Down payment target", type: "percent", default: 10, step: 1, helpText: "20% avoids PMI; many buyers put down 3–10%." },
    { name: "currentSavings", label: "Saved so far", type: "currency", default: 30000 },
    { name: "monthsToGoal", label: "Months to your goal", type: "months", default: 24, min: 1, max: 120 },
  ],

  compute: computeDownPayment,

  results: [
    { key: "targetDownPayment", label: "Down payment needed", format: "currency", variant: "primary", hint: "At your target percentage of the home price." },
    { key: "monthlySavingsNeeded", label: "Save per month", format: "currency2", variant: "secondary" },
    { key: "gapToTarget", label: "Still to save", format: "currency", variant: "secondary" },
    { key: "twentyPercentDown", label: "20% (avoids PMI)", format: "currency", variant: "secondary" },
    { key: "monthlyToReach20", label: "Per month to hit 20%", format: "currency2", variant: "secondary" },
    { key: "pmiMonthly", label: "Est. PMI at this %", format: "currency2", variant: "secondary" },
    { key: "progressPct", label: "Progress to goal", format: "percent", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Savings path to your goal",
    yFormat: "currency",
    series: (r) => r.savingsPath,
  },

  scenarios: [
    { id: "twenty", label: "Target 20% (no PMI)", patch: { targetPercent: 20 } },
    { id: "three", label: "Low 3% down", patch: { targetPercent: 3 } },
    { id: "faster", label: "Reach it in 12 months", patch: { monthsToGoal: 12 } },
  ],

  insights: [
    {
      id: "savings-goal",
      priority: 92,
      tone: "success",
      when: (r) => r.gapToTarget > 0,
      say: (r, v) =>
        `To reach ${pct(v.targetPercent, 0)} (${money(
          r.targetDownPayment,
        )}) in ${v.monthsToGoal} months, save ${money2(
          r.monthlySavingsNeeded,
        )}/month — you've put away ${money(v.currentSavings)} so far.`,
    },
    {
      id: "already-there",
      priority: 90,
      tone: "success",
      when: (r) => r.gapToTarget <= 0,
      say: (r, v) =>
        `You've already saved your ${money(
          r.targetDownPayment,
        )} target for ${pct(v.targetPercent, 0)} down — you're ready to make an offer.`,
    },
    {
      id: "twenty-threshold",
      priority: 84,
      when: (r, v) => v.targetPercent < 20,
      say: (r) =>
        `You're targeting under 20%, so you'd carry PMI. Reaching 20% (${money(
          r.twentyPercentDown,
        )}) needs ${money(r.gapTo20)} more — about ${money2(r.monthlyToReach20)}/month over your timeline.`,
    },
    {
      id: "no-pmi",
      priority: 82,
      tone: "success",
      when: (r, v) => v.targetPercent >= 20,
      say: () =>
        `At 20% or more down you skip PMI entirely — a smart target that lowers your monthly cost and often earns a better rate.`,
    },
    {
      id: "pmi-cost",
      priority: 78,
      tone: "warn",
      when: (r, v) => v.targetPercent < 20 && r.pmiMonthly > 0,
      say: (r) =>
        `At this down payment you'd pay about ${money2(
          r.pmiMonthly,
        )}/month in PMI (${money(r.pmiMonthly * 12)}/year) until you reach 20% equity — money that doesn't build your ownership.`,
    },
    {
      id: "progress",
      priority: 68,
      when: (r) => r.targetDownPayment > 0 && r.gapToTarget > 0,
      say: (r) => `You're ${pct(r.progressPct)} of the way to your down-payment goal — keep the momentum.`,
    },
  ],

  related: [
    relatedLink("home-affordability"),
    relatedLink("mortgage"),
    relatedLink("qualify"),
    relatedLink("rent-vs-buy"),
    relatedLink("va-loan"),
  ],
  relatedArticles: [
    { slug: "blog/fha-loan-requirements", label: "FHA loan requirements 2026" },
    { slug: "blog/fha-vs-conventional-which-is-cheaper", label: "FHA vs conventional: which is cheaper?" },
  ],

  faqs: [
    { q: "How much down payment do I need to buy a house?", a: "It depends on the loan. Conventional loans can go as low as 3% down, FHA 3.5%, and VA and USDA loans allow 0% for eligible buyers. But putting down less than 20% on a conventional loan means paying PMI. There's no single required number — it's a trade-off between cash upfront and monthly cost." },
    { q: "Why is 20% down the magic number?", a: "At 20% down (an 80% loan-to-value), conventional lenders drop the private mortgage insurance requirement. PMI typically costs 0.3–1.5% of the loan per year and protects the lender, not you — so reaching 20% removes a monthly cost that builds you nothing." },
    { q: "What is PMI and how much does it cost?", a: "Private mortgage insurance is required on conventional loans with less than 20% down. It usually runs about 0.5% of the loan balance per year, added to your monthly payment — roughly $150/month on a $360,000 loan. It automatically drops off once you reach 20–22% equity." },
    { q: "Should I put down less and buy sooner, or wait for 20%?", a: "Both are valid. Putting down less lets you buy (and start building equity) sooner but adds PMI and a bigger loan. Waiting for 20% lowers your payment and skips PMI but means more time renting and exposure to rising prices. Compare the monthly difference here against your local market." },
    { q: "How do I save for a down payment faster?", a: "Set the goal and timeline, automate a monthly transfer to a separate high-yield savings account, and keep it out of everyday spending. Windfalls — tax refunds, bonuses — accelerate it. This calculator's monthly figure is the number to automate; treat it like a fixed bill." },
    { q: "Does the down payment include closing costs?", a: "No — they're separate. Closing costs (typically 2–5% of the price) cover lender fees, title, and escrow, and are due at closing on top of your down payment. Budget for both so you're not caught short; some buyers negotiate seller credits to help with closing costs." },
  ],

  teach: {
    whatIsIt:
      "Your down payment is the cash you pay upfront, with the mortgage covering the rest. It's expressed as a percentage of the price: 20% down on a $400,000 home is $80,000. The percentage you choose drives two things — the size of your loan and whether you'll pay private mortgage insurance.\n\nThis calculator turns a target percentage and timeline into a concrete monthly savings number, and shows the gap between your target and the 20% that removes PMI.",
    whyItMatters:
      "The down payment is where most of the tension in buying a home lives. Put down more and your loan, payment, and total interest all shrink — and at 20% you drop PMI. Put down less and you buy sooner but pay more every month.\n\nKnowing the exact monthly savings needed makes the goal real. 'Save for a house' is vague; 'save $2,083 a month for 24 months' is a plan you can automate. And seeing the PMI cost of a sub-20% target lets you decide, in dollars, whether reaching 20% is worth the extra wait.",
    whatToDoNext:
      "Pick a realistic target price and down-payment percentage, enter what you've saved, and set your timeline. Automate the monthly figure into a separate high-yield savings account so it happens without willpower.\n\nIf you're below 20%, weigh the PMI cost shown here against buying sooner — sometimes starting to build equity outweighs the wait. Pair this with the affordability calculator to confirm the price fits your income, and the mortgage qualifier to check loan-program options like FHA, VA, or USDA that allow lower down payments.",
  },

  method: {
    label: "Down payment = price × target %; PMI estimated at 0.5%/yr of the loan below 20% down",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Not sure what price to target?",
      body: "Work out how much house your income comfortably supports first, then come back to plan the down payment for that price.",
      ctaLabel: "Open the home affordability calculator",
      href: "/home-affordability",
    },
  ],
};
