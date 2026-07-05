import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months } from "@/lib/calculator/format";
import {
  computeLoanPayoff,
  type LoanPayoffInputs,
  type LoanPayoffResults,
} from "./compute";

const defaults: LoanPayoffInputs = {
  balance: 18000,
  apr: 7,
  currentPayment: 400,
  extraPayment: 150,
};

export const loanPayoffDef: CalculatorDefinition<LoanPayoffInputs, LoanPayoffResults> = {
  slug: "loan-payoff",
  hub: "loans",
  h1: "Loan Payoff Calculator",
  valueProp: "See how an extra monthly payment moves your payoff date and cuts total interest.",
  title: "Loan Payoff Calculator | freecalcs.io",
  metaDescription:
    "Free loan payoff calculator: enter your balance, APR, and payment, then see how an extra monthly amount shortens the payoff and how much interest you save.",
  primaryKeyword: "Loan Payoff Calculator",
  secondaryKeywords: ["extra payment calculator", "early loan payoff", "interest saved calculator", "pay off loan early"],
  intro:
    "Every extra dollar you put toward a loan's principal skips all the future interest that dollar would have accrued — which is why paying a little more each month is so powerful. Enter your current balance, rate, and payment, add an extra amount, and see exactly how much sooner you'll be free and how much interest you'll keep.",
  commercialIntent: 3,

  defaults,
  inputs: [
    { name: "balance", label: "Current balance", type: "currency", default: 18000 },
    { name: "apr", label: "Interest rate (APR)", type: "percent", default: 7, step: 0.1 },
    { name: "currentPayment", label: "Current monthly payment", type: "currency", default: 400 },
    { name: "extraPayment", label: "Extra payment / month", type: "currency", default: 150 },
  ],

  compute: computeLoanPayoff,

  results: [
    { key: "newPayoffLabel", label: "Paid off in", format: "text", variant: "primary", hint: "Time to zero with your extra payment applied." },
    { key: "interestSaved", label: "Interest saved", format: "currency", variant: "secondary" },
    { key: "monthsSaved", label: "Months saved", format: "number", variant: "secondary" },
    { key: "newTotalInterest", label: "Total interest (with extra)", format: "currency", variant: "secondary" },
    { key: "baseTotalInterest", label: "Total interest (current payment)", format: "currency", variant: "secondary" },
    { key: "basePayoffLabel", label: "Payoff without extra", format: "text", variant: "secondary" },
    { key: "extraTotalPaid", label: "Extra principal contributed", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Balance over time (with extra payment)",
    yFormat: "currency",
    series: (r) => r.schedule.map((row) => ({ x: `Mo ${row.month}`, y: row.balance })),
  },

  scenarios: [
    { id: "more", label: "$100 more extra", patch: { extraPayment: 250 } },
    { id: "big", label: "$300/mo extra", patch: { extraPayment: 300 } },
    { id: "none", label: "No extra payment", patch: { extraPayment: 0 } },
  ],

  insights: [
    {
      id: "never-warning",
      priority: 99,
      tone: "warn",
      when: (r) => !r.paymentCoversInterest && r.newPayoffLabel === "Never",
      say: (r) =>
        `Your current payment doesn't cover the ${money(
          r.monthlyInterestAtStart,
        )} of interest this balance accrues each month, so it's actually growing. You need to pay more than that just to start making progress.`,
    },
    {
      id: "extra-saved",
      priority: 90,
      tone: "success",
      when: (r, v) => v.extraPayment > 0 && r.monthsSaved > 0,
      say: (r, v) =>
        `Adding ${money(v.extraPayment)}/month pays this off about ${months(
          r.monthsSaved,
        )} sooner and saves roughly ${money(r.interestSaved)} in interest.`,
    },
    {
      id: "interest-cut",
      priority: 82,
      when: (r, v) => v.extraPayment > 0 && r.newPayoffLabel !== "Never",
      say: (r) =>
        `Your total interest drops from ${money(r.baseTotalInterest)} at the current payment to ${money(
          r.newTotalInterest,
        )} with the extra — the extra principal never gets a chance to compound.`,
    },
    {
      id: "timeline",
      priority: 78,
      tone: "success",
      when: (r, v) => v.extraPayment > 0 && r.newPayoffLabel !== "Never" && r.monthsSaved > 0,
      say: (r) =>
        `Without the extra you'd carry this loan for ${r.basePayoffLabel}; the extra payment brings your payoff down to ${r.newPayoffLabel}.`,
    },
    {
      id: "first-payment-interest",
      priority: 75,
      when: (r) => r.paymentCoversInterest && r.monthlyInterestAtStart > 0,
      say: (r) =>
        `About ${money(
          r.monthlyInterestAtStart,
        )} of your payment this month is pure interest. Every extra dollar of principal permanently removes the future interest that dollar would have generated.`,
    },
    {
      id: "extra-lever",
      priority: 68,
      when: (r, v) => v.extraPayment === 0 && r.paymentCoversInterest && r.baseTotalInterest > 0,
      say: (r) =>
        `On your current payment you'll pay ${money(
          r.baseTotalInterest,
        )} in interest before this is gone. Try adding an extra amount above to see how quickly that shrinks.`,
    },
  ],

  related: [
    relatedLink("debt-payoff"),
    relatedLink("loan"),
    relatedLink("auto-loan"),
    relatedLink("personal-loan"),
  ],

  faqs: [
    { q: "How do extra payments save me money?", a: "Interest is charged on your remaining balance, so any extra you pay toward principal permanently removes all the future interest that balance would have generated. Because loans are front-loaded with interest, extra payments made earlier save far more than the same payments made near the end." },
    { q: "Is it better to pay extra early or late in the loan?", a: "Early. In the first years, most of each scheduled payment goes to interest and little to principal, so an extra principal payment then avoids years of compounding. The same extra dollar late in the loan saves much less because there's little interest left to avoid." },
    { q: "Will paying extra reduce my monthly payment?", a: "No — on most loans, extra payments shorten the term rather than lower the required monthly payment. You keep paying the same amount but for fewer months. If you want a lower payment instead, that requires a refinance or a formal loan recast." },
    { q: "Are there prepayment penalties?", a: "Mortgages and auto loans usually allow extra payments freely, but some loans (and older mortgages) charge a prepayment penalty. Check your loan agreement before making large extra payments, and make sure the servicer applies the extra to principal, not to next month's payment." },
    { q: "Should I pay off my loan early or invest the money?", a: "Compare your loan's rate to what you'd reasonably earn investing. Paying off a 7% loan is a guaranteed 7% return; beating that in the market isn't guaranteed. Higher-rate debt (credit cards) almost always wins the comparison; very low-rate debt is a closer call and depends on your risk tolerance." },
    { q: "How do I make sure the extra goes to principal?", a: "Many servicers apply overpayments to the next scheduled payment by default. Look for a 'principal-only' or 'apply to principal' option when you pay, or note it with the payment, so the extra actually reduces your balance and interest." },
  ],

  teach: {
    whatIsIt:
      "A loan payoff calculator answers one focused question: if I pay a bit more than required each month, how much sooner am I free and how much interest do I keep? It takes your current balance, rate, and payment, then re-amortizes the loan with the extra principal added.\n\nThe key idea is that your scheduled payment is split between interest (the lender's fee for the balance you still owe) and principal (which actually reduces the debt). Extra money bypasses the interest split entirely and goes straight to principal.",
    whyItMatters:
      "Loans are front-loaded: early on, most of your payment is interest and only a sliver touches the balance. That's why a modest extra payment in year one can erase years of future interest, while the same amount in the final year barely moves anything.\n\nSeeing the two numbers side by side — months saved and interest saved — turns a vague 'I should pay extra' into a concrete decision. It also lets you weigh paying the loan down against other uses of the money, like investing or clearing a higher-rate debt first.",
    whatToDoNext:
      "Decide the largest extra payment you can sustain without straining your budget, and check that your loan has no prepayment penalty. When you pay, mark the extra as principal-only so the servicer doesn't just credit next month's bill.\n\nIf you have several debts, don't optimize this one in isolation — put your extra dollars against your highest-rate balance first. Use the scenarios above to test different extra amounts, then automate the one you choose so it happens every month without a decision.",
  },

  method: {
    label: "Uses the standard amortization formula, re-amortizing the balance with the extra principal applied each month",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Juggling more than one debt?",
      body: "When you have several balances, the order you pay them in matters. Compare the snowball and avalanche methods to get debt-free faster.",
      ctaLabel: "Open the debt payoff calculator",
      href: "/debt-payoff",
    },
  ],
};
