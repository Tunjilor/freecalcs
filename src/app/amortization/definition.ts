// Amortization Calculator definition. Page content derives from this object
// plus the pure compute in ./compute.ts.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months, pct } from "@/lib/calculator/format";
import {
  computeAmortization,
  type AmortizationInputs,
  type AmortizationResults,
} from "./compute";

const defaults: AmortizationInputs = {
  loanAmount: 300000,
  rate: 6.5,
  termYears: 30,
  extraMonthly: 0,
};

export const amortizationDef: CalculatorDefinition<AmortizationInputs, AmortizationResults> = {
  slug: "amortization",
  hub: "loans",
  h1: "Amortization Calculator",
  valueProp: "See your full amortization schedule: how every payment splits between principal and interest.",
  title: "Amortization Calculator & Schedule | freecalcs.io",
  metaDescription:
    "Free amortization calculator: your monthly payment and a full year-by-year amortization schedule showing principal, interest and balance, with extra payments.",
  primaryKeyword: "Amortization Calculator",
  secondaryKeywords: [
    "amortization schedule",
    "loan amortization calculator",
    "mortgage amortization schedule",
    "amortization table",
    "principal and interest breakdown",
  ],
  intro:
    "An amortization schedule shows exactly where each loan payment goes: how much pays interest, how much reduces the balance, and what you'll owe after every year. This amortization calculator builds the full schedule for any fixed-rate loan, a mortgage, auto loan or personal loan, and shows what extra monthly payments would change.",
  commercialIntent: 3,

  defaults,
  inputs: [
    { name: "loanAmount", label: "Loan amount", type: "currency", default: 300000 },
    { name: "rate", label: "Interest rate", type: "percent", default: 6.5, step: 0.05 },
    { name: "termYears", label: "Loan term", type: "years", default: 30, min: 1, max: 40 },
    {
      name: "extraMonthly",
      label: "Extra principal / month",
      type: "currency",
      default: 0,
      helpText: "Optional. Leave at 0 to see the standard schedule.",
    },
  ],

  compute: computeAmortization,

  results: [
    {
      key: "monthlyPayment",
      label: "Monthly payment",
      format: "currency2",
      variant: "primary",
      hint: "Principal and interest only.",
    },
    { key: "totalInterest", label: "Total interest", format: "currency", variant: "secondary" },
    { key: "totalPaid", label: "Total of all payments", format: "currency", variant: "secondary" },
    { key: "payoffMonths", label: "Number of payments", format: "number", variant: "secondary" },
    { key: "firstPaymentInterestPct", label: "Interest share of payment 1", format: "percent", variant: "secondary" },
    { key: "interestSaved", label: "Interest saved by extra payments", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Remaining balance by year",
    yFormat: "currency",
    series: (r) => r.years.map((y) => ({ x: `Yr ${y.year}`, y: y.endBalance })),
  },

  breakdowns: [
    {
      title: "Yearly amortization schedule",
      columns: [
        { key: "year", label: "Year", format: "number", align: "left" },
        { key: "principal", label: "Principal", format: "currency", align: "right" },
        { key: "interest", label: "Interest", format: "currency", align: "right" },
        { key: "endBalance", label: "Ending balance", format: "currency", align: "right" },
      ],
      rows: (r) =>
        r.years.map((y) => ({ year: y.year, principal: y.principal, interest: y.interest, endBalance: y.endBalance })),
      note: "Principal includes any extra payments.",
    },
    {
      title: "Monthly schedule: first 12 payments",
      columns: [
        { key: "month", label: "Payment", format: "number", align: "left" },
        { key: "principal", label: "Principal", format: "currency2", align: "right" },
        { key: "interest", label: "Interest", format: "currency2", align: "right" },
        { key: "balance", label: "Balance", format: "currency2", align: "right" },
      ],
      rows: (r) =>
        r.firstYear.map((m) => ({ month: m.month, principal: m.principal, interest: m.interest, balance: m.balance })),
    },
  ],

  scenarios: [
    { id: "15", label: "15-year term", patch: { termYears: 15 } },
    { id: "extra100", label: "+$100/mo", patch: { extraMonthly: 100 } },
    { id: "extra500", label: "+$500/mo", patch: { extraMonthly: 500 } },
    { id: "car", label: "$35k car loan, 5 yrs", patch: { loanAmount: 35000, termYears: 5, rate: 7.5 } },
  ],

  insights: [
    {
      id: "front-loaded",
      priority: 95,
      when: (r) => r.firstPaymentInterestPct > 50,
      say: (r) =>
        `Your first payment is ${pct(r.firstPaymentInterestPct, 0)} interest. That's how amortization works: interest is charged on the balance, so early payments mostly go to the lender and the split slowly shifts toward principal.`,
    },
    {
      id: "crossover",
      priority: 90,
      when: (r) => r.crossoverMonth > 12,
      say: (r) =>
        `Not until payment ${r.crossoverMonth} (${months(r.crossoverMonth)} in) does more of each payment go to principal than interest${
          r.halfPaidMonth > 0 ? `, and you'll owe half the original balance only after ${months(r.halfPaidMonth)}` : ""
        }.`,
    },
    {
      id: "interest-total",
      priority: 85,
      when: (r) => r.interestToPrincipalRatio > 30,
      say: (r) =>
        `Over the life of the loan you'll pay ${money(r.totalInterest)} in interest, ${pct(
          r.interestToPrincipalRatio,
          0,
        )} of the amount you borrowed.`,
    },
    {
      id: "extra-result",
      priority: 92,
      tone: "success",
      when: (r) => r.monthsSaved > 0,
      say: (r, v) =>
        `Adding ${money(v.extraMonthly)} a month pays the loan off ${months(r.monthsSaved)} early and saves ${money(
          r.interestSaved,
        )} in interest.`,
    },
    {
      id: "try-extra",
      priority: 70,
      when: (r, v) => v.extraMonthly === 0 && r.payoffMonths > 60,
      say: () =>
        `Try an extra monthly amount above. Because extra money goes straight to principal, even a small amount early in the loan removes interest from every remaining payment.`,
    },
  ],

  related: [
    relatedLink("mortgage"),
    relatedLink("mortgage-payoff"),
    relatedLink("loan"),
    relatedLink("15-vs-30-year-mortgage"),
    relatedLink("auto-loan"),
    relatedLink("refinance"),
  ],
  relatedArticles: [
    { slug: "blog/pay-off-mortgage-early", label: "How to pay off your mortgage early" },
    { slug: "blog/15-year-vs-30-year-mortgage", label: "15-year vs 30-year mortgage" },
  ],

  faqs: [
    {
      q: "What is an amortization schedule?",
      a: "A table of every payment on a loan showing how much goes to interest, how much goes to principal, and the balance left afterward. It's how lenders spread a fixed payment over the loan's term.",
    },
    {
      q: "Why do early payments go mostly to interest?",
      a: "Interest is charged on the remaining balance, which is largest at the start. As the balance falls, each month's interest shrinks and more of the same fixed payment goes to principal.",
    },
    {
      q: "How do extra payments change the amortization schedule?",
      a: "Extra principal lowers the balance immediately, so every later payment carries less interest and more principal. Your required payment stays the same, but the loan ends sooner.",
    },
    {
      q: "Does this work for car loans and personal loans?",
      a: "Yes. Any fixed-rate loan with equal monthly payments amortizes the same way. Enter the loan amount, rate and term in years.",
    },
    {
      q: "Does the payment include taxes and insurance?",
      a: "No. This shows principal and interest only. For a full mortgage payment with property tax, insurance and PMI, use the mortgage calculator.",
    },
  ],

  teach: {
    heading: "What is amortization?",
    whatIsIt:
      "Amortization is the process of paying off a loan with equal, regular payments. Each payment first covers the interest that built up since the last one, and the rest reduces the principal.\n\nThe schedule above lays that out year by year and, for the first year, payment by payment.",
    whyItMatters:
      "The schedule shows how slowly equity builds early in a long loan. On a 30-year mortgage at 6.5%, it's around year 19 before principal overtakes interest in each payment. That matters if you might sell or refinance in a few years: you'll have paid a lot of interest without reducing the balance much.\n\nIt also shows why extra payments work so well early. A dollar of principal paid in year one avoids interest for the rest of the loan.",
    whatToDoNext:
      "If the total interest surprises you, compare a shorter term with the 15 vs 30 year mortgage calculator, or test extra payments with the mortgage payoff calculator. If rates have dropped since you borrowed, the refinance calculator shows whether a new loan would reset your schedule in your favor.",
  },

  method: {
    label:
      "Standard fixed-rate amortization: payment = P × r(1+r)^n ÷ ((1+r)^n − 1); each month's interest is the balance × monthly rate, the remainder of the payment reduces principal",
  },

  monetization: [
    {
      kind: "internal",
      headline: "See your full mortgage payment",
      body: "Add property tax, insurance, PMI and HOA dues to see what you'd actually pay each month.",
      ctaLabel: "Open the mortgage calculator",
      href: "/mortgage",
    },
  ],
};
