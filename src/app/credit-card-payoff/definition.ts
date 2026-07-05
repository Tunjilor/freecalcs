import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, pct } from "@/lib/calculator/format";
import { computeCreditCard, type CreditCardInputs, type CreditCardResults } from "./compute";

const defaults: CreditCardInputs = { balance: 6000, apr: 22, monthlyPayment: 250 };

export const creditCardDef: CalculatorDefinition<CreditCardInputs, CreditCardResults> = {
  slug: "credit-card-payoff",
  hub: "loans",
  h1: "Credit Card Payoff Calculator",
  valueProp: "See how fast a fixed payment clears your card — and how much the minimum-only trap really costs.",
  title: "Credit Card Payoff Calculator | freecalcs.io",
  metaDescription:
    "Free credit card payoff calculator: enter your balance, APR, and monthly payment to see your payoff date, total interest, and how much a fixed payment saves versus paying only the minimum.",
  primaryKeyword: "Credit Card Payoff Calculator",
  secondaryKeywords: ["credit card interest calculator", "minimum payment trap", "pay off credit card", "credit card payoff time"],
  intro:
    "Paying only the minimum on a credit card can keep you in debt for decades, because the minimum shrinks as your balance falls. This calculator shows how long your balance takes to clear — and how much interest it costs — at a fixed monthly payment, versus the minimum-only trap. Commit to a fixed amount and the difference is often years and thousands of dollars.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "balance", label: "Card balance", type: "currency", default: 6000 },
    { name: "apr", label: "APR", type: "percent", default: 22, step: 0.1 },
    { name: "monthlyPayment", label: "Your fixed monthly payment", type: "currency", default: 250 },
  ],

  compute: computeCreditCard,

  results: [
    { key: "fixedLabel", label: "Paid off in (fixed payment)", format: "text", variant: "primary", hint: "At your fixed monthly payment." },
    { key: "fixedInterest", label: "Total interest (fixed)", format: "currency", variant: "secondary" },
    { key: "interestSaved", label: "Interest saved vs minimum", format: "currency", variant: "secondary" },
    { key: "minOnlyLabel", label: "Payoff (minimum only)", format: "text", variant: "secondary" },
    { key: "minOnlyInterest", label: "Total interest (minimum only)", format: "currency", variant: "secondary" },
    { key: "firstMonthInterest", label: "Interest this month", format: "currency2", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Minimum-only vs your fixed payment",
      columns: [
        { key: "approach", label: "Approach", format: "text", align: "left" },
        { key: "time", label: "Time to pay off", format: "text", align: "left" },
        { key: "interest", label: "Total interest", format: "currency" },
      ],
      rows: (r) => [
        { approach: "Paying only the minimum", time: r.minOnlyLabel, interest: r.minOnlyInterest },
        { approach: "Your fixed payment", time: r.fixedLabel, interest: r.fixedInterest },
      ],
      note: "The minimum payment falls as your balance falls, which is what stretches payoff out for years. A fixed payment attacks the principal steadily.",
    },
  ],

  scenarios: [
    { id: "pay400", label: "Pay $400/mo", patch: { monthlyPayment: 400 } },
    { id: "pay150", label: "Pay $150/mo", patch: { monthlyPayment: 150 } },
    { id: "lowapr", label: "APR at 12%", patch: { apr: 12 } },
  ],

  insights: [
    {
      id: "never",
      priority: 96,
      tone: "warn",
      when: (r) => !r.fixedAmortizes,
      say: (r) =>
        `Your payment barely covers the ${money2(
          r.firstMonthInterest,
        )} of interest this month, so the balance won't fall. You need to pay more than the monthly interest just to make progress.`,
    },
    {
      id: "min-trap",
      priority: 92,
      when: (r) => r.minOnlyMonths > r.fixedMonths,
      say: (r) =>
        `Paying only the minimum drags this out to ${r.minOnlyLabel} and about ${money(
          r.minOnlyInterest,
        )} in interest — because the minimum shrinks as the balance falls, most of it just services interest for years.`,
    },
    {
      id: "fixed-wins",
      priority: 88,
      tone: "success",
      when: (r) => r.fixedAmortizes && r.monthsSaved > 0,
      say: (r) =>
        `Your fixed payment clears the card in ${r.fixedLabel} and saves about ${money(
          r.interestSaved,
        )} versus the minimum — committing to a fixed amount instead of the shrinking minimum is the single biggest lever.`,
    },
    {
      id: "apr-cost",
      priority: 78,
      when: (r) => r.firstMonthInterest > 0,
      say: (r, v) =>
        `At ${pct(v.apr)} APR you're paying ${money2(
          r.firstMonthInterest,
        )} in interest this month alone. If you qualify, a 0% balance-transfer card can pause that interest while you attack the principal.`,
    },
    {
      id: "interest-share",
      priority: 74,
      when: (r, v) => r.fixedAmortizes && v.monthlyPayment > 0,
      say: (r, v) =>
        `Of your ${money(v.monthlyPayment)} payment this month, ${money2(
          r.firstMonthInterest,
        )} goes to interest — the rest reduces the balance, and that share grows every month as the balance drops.`,
    },
  ],

  related: [
    relatedLink("debt-payoff"),
    relatedLink("debt-consolidation"),
    relatedLink("loan-payoff"),
    relatedLink("personal-loan"),
  ],
  relatedArticles: [
    { slug: "blog/heloc-to-pay-off-credit-card-debt", label: "Should I use a HELOC to pay off credit card debt?" },
  ],

  faqs: [
    { q: "Why does paying only the minimum take so long?", a: "Because the minimum payment is a percentage of your balance (plus interest), it shrinks as the balance falls. Early on, most of it just covers interest, so the principal barely moves. On a typical card, minimum-only payments can take 15–25+ years and cost more in interest than the original balance. A fixed payment avoids this by attacking the principal steadily." },
    { q: "How is the minimum payment calculated?", a: "It varies by issuer, but a common formula is the greater of about $35 or 1% of your balance plus that month's interest. This calculator uses that formula for the minimum-only comparison. Because it's tied to the balance, the dollar amount drops over time — which is exactly what stretches payoff out." },
    { q: "How much should I pay each month?", a: "As much as your budget allows above the minimum. Even a modest fixed payment dramatically beats the minimum: the calculator shows the exact months and interest you'd save. A good target is a fixed amount you can sustain until the card is gone, rather than whatever the minimum happens to be that month." },
    { q: "Should I use a balance transfer card?", a: "If you qualify, a 0% intro-APR balance-transfer card can pause interest for 12–21 months, so every dollar goes to principal — often saving hundreds or thousands. Watch for the transfer fee (typically 3–5%) and make a plan to clear the balance before the intro rate ends, or the remaining balance reverts to a high APR." },
    { q: "Should I pay off cards or other debt first?", a: "Credit cards usually carry the highest rates, so mathematically they come first (the avalanche method). If you have several debts, the debt payoff calculator compares attacking them by rate versus by balance. Consolidation into a lower-rate loan is another option worth comparing." },
    { q: "Does this include annual fees or late fees?", a: "No — it models interest on your balance at the APR you enter, using a common minimum-payment formula. Annual fees, late fees, and penalty APRs would add to the real cost, which is another reason to clear high-rate cards quickly." },
  ],

  teach: {
    whatIsIt:
      "A credit card payoff calculator shows two futures for the same balance: one where you pay only the minimum, and one where you commit to a fixed monthly payment. It computes how long each takes and how much interest each costs.\n\nThe key mechanic is the minimum payment itself. Because it's calculated as a small percentage of your balance plus interest, it falls as the balance falls — so the closer you get to zero, the slower you go. A fixed payment breaks that trap by keeping your dollars against the principal constant.",
    whyItMatters:
      "The minimum-payment trap is one of the most expensive default behaviors in personal finance. On a $6,000 balance at 22%, minimum-only payments can take well over a decade and cost more in interest than the balance itself. The same balance with a steady fixed payment is often cleared in a couple of years for a fraction of the interest.\n\nSeeing those two numbers side by side reframes the decision. It's not about paying 'a bit more' — it's about escaping a structure designed to keep you paying interest for as long as possible. The fixed payment is the escape.",
    whatToDoNext:
      "Enter your real balance, APR, and a payment you can sustain, and compare it against the minimum-only figures. Try raising the payment to see how quickly the payoff time and interest drop — the early increases help the most.\n\nIf your APR is high, check whether a 0% balance-transfer card fits, and if you have multiple cards, use the debt payoff or consolidation calculators to plan the whole picture. The most important move is simple: pay a fixed amount, not the shrinking minimum.",
  },

  method: {
    label: "Uses the standard amortization formula for the fixed payment; the minimum-only path applies a common card minimum — the greater of $35 or 1% of the balance plus that month's interest",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Juggling several cards?",
      body: "If this is one of several balances, compare rolling them into one lower-rate loan — payment, total interest, and break-even.",
      ctaLabel: "Open the debt consolidation calculator",
      href: "/debt-consolidation",
    },
  ],
};
