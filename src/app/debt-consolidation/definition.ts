import type { CalculatorDefinition, InputField } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, pct } from "@/lib/calculator/format";
import {
  computeDebtConsolidation,
  type DebtConsolidationInputs,
  type DebtConsolidationResults,
} from "./compute";

const defaults: DebtConsolidationInputs = {
  d1Balance: 8000, d1Apr: 22, d1Min: 200,
  d2Balance: 5000, d2Apr: 18, d2Min: 120,
  d3Balance: 3000, d3Apr: 25, d3Min: 90,
  d4Balance: 0, d4Apr: 0, d4Min: 0,
  d5Balance: 0, d5Apr: 0, d5Min: 0,
  newRate: 11, newTermMonths: 60, fee: 300,
};

// Fixed debt slots with progressive disclosure (same pattern as /debt-payoff) —
// keeps a variable debt list within the InputField schema.
const debtSlot = (n: 1 | 2 | 3 | 4 | 5, prevBalanceKey?: keyof DebtConsolidationInputs) => {
  const show = prevBalanceKey
    ? (v: DebtConsolidationInputs) => (v[prevBalanceKey] as number) > 0
    : undefined;
  return [
    { name: `d${n}Balance`, label: `Debt ${n} — balance`, type: "currency", default: 0, showWhen: show },
    { name: `d${n}Apr`, label: `Debt ${n} — APR`, type: "percent", default: 0, step: 0.1, showWhen: show },
    { name: `d${n}Min`, label: `Debt ${n} — minimum payment`, type: "currency", default: 0, showWhen: show },
  ] as InputField<DebtConsolidationInputs>[];
};

export const debtConsolidationDef: CalculatorDefinition<DebtConsolidationInputs, DebtConsolidationResults> = {
  slug: "debt-consolidation",
  hub: "loans",
  h1: "Debt Consolidation Calculator",
  valueProp: "Compare keeping your current debts against one consolidation loan — payment, total interest, and break-even.",
  title: "Debt Consolidation Calculator | freecalcs.io",
  metaDescription:
    "Free debt consolidation calculator: compare your current debts against a single consolidation loan. See the new payment, total interest saved or added, and whether the fee is worth it.",
  primaryKeyword: "Debt Consolidation Calculator",
  secondaryKeywords: ["consolidate debt calculator", "debt consolidation loan", "should I consolidate my debt", "consolidation vs minimum payments"],
  intro:
    "Would rolling your debts into one loan actually save money? This calculator compares your current balances — paid at their minimums — against a single consolidation loan at a new rate, term, and fee. It shows the new monthly payment, whether you'd save or add total interest, and how long it takes to recoup the fee, so you can tell if consolidating is worth it.",
  commercialIntent: 5,

  defaults,
  inputs: [
    ...debtSlot(1),
    ...debtSlot(2, "d1Balance"),
    ...debtSlot(3, "d2Balance"),
    ...debtSlot(4, "d3Balance"),
    ...debtSlot(5, "d4Balance"),
    { name: "newRate", label: "Consolidation loan APR", type: "percent", default: 11, step: 0.1 },
    { name: "newTermMonths", label: "Loan term (months)", type: "months", default: 60, min: 12, max: 120 },
    { name: "fee", label: "Origination fee", type: "currency", default: 300, helpText: "Rolled into the loan balance." },
  ],

  compute: computeDebtConsolidation,

  results: [
    { key: "newPayment", label: "New consolidated payment", format: "currency2", variant: "primary", hint: "One monthly payment on the consolidation loan." },
    { key: "monthlySavings", label: "Monthly payment change", format: "currency2", variant: "secondary" },
    { key: "interestSaved", label: "Total interest saved", format: "currency", variant: "secondary" },
    { key: "weightedAvgApr", label: "Your blended current APR", format: "percent", variant: "secondary" },
    { key: "currentTotalInterest", label: "Interest — current debts", format: "currency", variant: "secondary" },
    { key: "consolidationTotalCost", label: "Interest + fee — consolidation", format: "currency", variant: "secondary" },
    { key: "breakEvenLabel", label: "Fee break-even", format: "text", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Keep current debts vs consolidate",
      columns: [
        { key: "plan", label: "Plan", format: "text", align: "left" },
        { key: "payment", label: "Monthly payment", format: "currency" },
        { key: "cost", label: "Interest + fees", format: "currency" },
      ],
      rows: (r) => [
        { plan: "Keep current debts (minimums)", payment: r.currentTotalMinPayment, cost: r.currentTotalInterest },
        { plan: "Consolidation loan", payment: r.newPayment, cost: r.consolidationTotalCost },
      ],
      note: "Current debts are modeled paid at their minimums. Consolidation lumps them into one loan; the fee is financed and counts toward its total cost.",
    },
  ],

  scenarios: [
    { id: "lowrate", label: "Loan at 8%", patch: { newRate: 8 } },
    { id: "longer", label: "72-month term", patch: { newTermMonths: 72 } },
    { id: "nofee", label: "No origination fee", patch: { fee: 0 } },
  ],

  insights: [
    {
      id: "saves-or-costs",
      priority: 92,
      tone: "info",
      when: (r) => r.debtCount > 0,
      say: (r, v) =>
        r.saves
          ? `Consolidating your ${money(
              r.totalBalance,
            )} into a ${pct(v.newRate)} loan saves about ${money(
              r.interestSaved,
            )} in total interest${
              r.monthlySavings > 0 ? ` and drops your payment by ${money2(r.monthlySavings)}/mo` : ""
            } — mainly because it beats your ${pct(r.weightedAvgApr)} blended rate.`
          : `Consolidating would cost about ${money(
              Math.abs(r.interestSaved),
            )} MORE overall — the new rate, the longer term, or the ${money(
              r.fee,
            )} fee outweighs the benefit. Compare carefully before committing.`,
    },
    {
      id: "rate-comparison",
      priority: 84,
      when: (r) => r.debtCount > 0,
      say: (r, v) =>
        `Your debts blend to about ${pct(
          r.weightedAvgApr,
        )} APR; this loan is ${pct(v.newRate)}. Consolidation pays off only when the new rate — after the fee — is clearly lower than what you're paying now.`,
    },
    {
      id: "break-even",
      priority: 78,
      tone: "success",
      when: (r) => r.monthlySavings > 0 && r.fee > 0,
      say: (r) =>
        `You'd recoup the ${money(r.fee)} origination fee in ${r.breakEvenLabel} of lower payments — after that, the savings are yours.`,
    },
    {
      id: "discipline",
      priority: 70,
      tone: "warn",
      when: (r) => r.debtCount > 0,
      say: () =>
        `Consolidation restructures debt, it doesn't erase it. The plan only works if you stop adding to the old cards while paying off the new loan — otherwise you end up with both.`,
    },
    {
      id: "term-tradeoff",
      priority: 74,
      when: (r) => r.monthlySavings > 0 && r.interestSaved < 0,
      say: (r) =>
        `Careful: the lower payment here comes from a longer term, so you'd actually pay more total interest even at a lower rate. A lower payment isn't the same as a cheaper debt.`,
    },
  ],

  related: [
    relatedLink("debt-payoff"),
    relatedLink("credit-card-payoff"),
    relatedLink("personal-loan"),
    relatedLink("loan-payoff"),
  ],

  faqs: [
    { q: "Does debt consolidation actually save money?", a: "Only if the new loan's rate — after its fee — is meaningfully lower than the blended rate of your current debts, and you don't stretch the term so far that the lower payment costs more total interest. This calculator shows both the interest and the payment change so you can tell. Sometimes consolidation lowers the payment but raises total cost." },
    { q: "What's the difference between consolidating and the snowball/avalanche method?", a: "Consolidation replaces multiple debts with one new loan, ideally at a lower rate. The snowball/avalanche methods keep your existing debts and just change the order you attack them with extra payments. Consolidation can lower your rate; the payoff methods cost nothing to start. Compare both — the debt payoff calculator handles the second approach." },
    { q: "Should I consolidate credit card debt into a personal loan?", a: "It can help if the personal loan's APR is well below your cards' rates and you qualify. Personal loans have fixed payments and payoff dates, which adds discipline. Watch the origination fee and avoid running the cards back up. Run your real numbers here and compare against the personal loan calculator." },
    { q: "Does the origination fee make consolidation not worth it?", a: "It depends on the size of the fee versus the interest you'd save. A small fee on a big rate reduction is easily worth it; a large fee on a modest reduction may not be. This calculator finances the fee into the loan and shows how many months of savings it takes to recoup — the break-even." },
    { q: "Will consolidating hurt my credit score?", a: "Opening a new loan causes a small temporary dip from the hard inquiry, but consolidation can help over time by lowering your credit utilization (if you pay off cards and keep them open) and by building a record of on-time payments. The bigger risk to your credit is running the old cards back up." },
    { q: "How is my current interest calculated here?", a: "The calculator models each current debt being paid at the minimum you enter, held constant, until it's cleared, then sums the interest. Real minimums decline over time, so your actual current-path interest could differ — but the comparison against a fixed consolidation loan still shows the direction and rough magnitude of the trade-off." },
  ],

  teach: {
    whatIsIt:
      "Debt consolidation replaces several debts with a single new loan — ideally at a lower interest rate — so you make one payment instead of many. This calculator compares two paths: keeping your current debts (paid at their minimums) versus rolling the total into one consolidation loan at a rate, term, and fee you specify.\n\nIt reports the new monthly payment, whether you'd save or add total interest once the fee is counted, and how long it takes for the monthly savings to recoup that fee.",
    whyItMatters:
      "Consolidation is marketed as a cure-all, but it's really just a rate-and-term trade. It helps when the new rate (after fees) is clearly lower than your blended current rate — then you genuinely pay less. It hurts when a lower monthly payment is achieved by stretching the term, which can raise total interest even at a lower rate.\n\nThe distinction that trips people up is payment versus cost. A smaller monthly payment feels like progress, but if it comes from a longer term, the debt can cost more overall. Seeing the total interest for both paths — not just the payment — is what makes this an honest decision.",
    whatToDoNext:
      "Enter each debt with its balance, rate, and minimum, then the consolidation loan's rate, term, and fee. Look at both numbers: the payment change and the total interest change. If consolidation both lowers the payment and saves interest, and the fee recoups quickly, it's a strong move.\n\nCrucially, only consolidate if you'll stop adding to the old balances — otherwise you end up owing on both. If a lower rate isn't available to you, compare the no-new-loan approach in the debt payoff calculator, or the balance-transfer route in the credit card payoff calculator.",
  },

  method: {
    label: "Uses the standard amortization formula; compares current debts paid at their minimums against a single consolidation loan, with the fee financed and counted in its total cost",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Prefer not to take a new loan?",
      body: "You can get debt-free without consolidating. Compare the snowball and avalanche methods on your existing debts — no new loan, no fee.",
      ctaLabel: "Open the debt payoff calculator",
      href: "/debt-payoff",
    },
  ],
};
