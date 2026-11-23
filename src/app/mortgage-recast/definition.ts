// Mortgage Recast Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months } from "@/lib/calculator/format";
import { computeMortgageRecast, type MortgageRecastInputs, type MortgageRecastResults } from "./compute";

const defaults: MortgageRecastInputs = { balance: 300000, rate: 6.5, monthsLeft: 300, lumpSum: 50000, recastFee: 250 };

export const mortgageRecastDef: CalculatorDefinition<MortgageRecastInputs, MortgageRecastResults> = {
  slug: "mortgage-recast",
  hub: "mortgage",
  h1: "Mortgage Recast Calculator",
  valueProp: "See how much a lump-sum recast lowers your payment, compared with simply prepaying.",
  title: "Mortgage Recast Calculator: New Payment | freecalcs.io",
  metaDescription:
    "Free mortgage recast calculator: your new payment after a lump-sum recast, the interest saved, and how it compares with prepaying principal without recasting.",
  primaryKeyword: "Mortgage Recast Calculator",
  secondaryKeywords: ["mortgage recasting", "recast vs refinance", "lower mortgage payment lump sum", "loan recast calculator"],
  intro:
    "A mortgage recast lets you pay down a lump sum and have your lender recalculate the payment, keeping the same rate and end date. This mortgage recast calculator shows your new monthly payment and interest savings, and compares recasting with putting the same money toward principal without changing the payment.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "balance", label: "Current loan balance", type: "currency", default: 300000 },
    { name: "rate", label: "Interest rate", type: "percent", default: 6.5, step: 0.05 },
    { name: "monthsLeft", label: "Months remaining", type: "number", default: 300, min: 12, max: 480, helpText: "Check your statement; 25 years = 300 months." },
    { name: "lumpSum", label: "Lump-sum payment", type: "currency", default: 50000, helpText: "Many lenders require at least $5,000–$10,000." },
    { name: "recastFee", label: "Recast fee", type: "currency", default: 250, helpText: "Often $150–$500." },
  ],

  compute: computeMortgageRecast,

  results: [
    { key: "newPayment", label: "New monthly payment", format: "currency2", variant: "primary", hint: "Principal and interest after the recast." },
    { key: "monthlySaving", label: "Monthly savings", format: "currency2", variant: "secondary" },
    { key: "currentPayment", label: "Current payment", format: "currency2", variant: "secondary" },
    { key: "recastInterestSaved", label: "Interest saved (recast)", format: "currency", variant: "secondary" },
    { key: "prepayInterestSaved", label: "Interest saved (prepay, no recast)", format: "currency", variant: "secondary" },
    { key: "feeBreakEvenMonths", label: "Months to recoup the fee", format: "number", variant: "secondary" },
  ],

  scenarios: [
    { id: "25k", label: "$25k lump sum", patch: { lumpSum: 25000 } },
    { id: "100k", label: "$100k lump sum", patch: { lumpSum: 100000 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.monthlySaving > 0,
      say: (r, v) =>
        `Recasting after a ${money(v.lumpSum)} payment drops your payment from ${money(r.currentPayment)} to ${money(r.newPayment)}, saving ${money(
          r.monthlySaving,
        )} a month and ${money(r.recastInterestSaved)} in interest. Your rate and payoff date stay the same.`,
    },
    {
      id: "vs-prepay",
      priority: 90,
      when: (r) => r.prepayInterestSaved > r.recastInterestSaved,
      say: (r) =>
        `If you prepaid the same amount but kept your current payment, you'd save ${money(r.prepayInterestSaved)} and finish ${months(
          r.prepayMonthsSaved,
        )} early. A recast trades some of that saving for a lower required payment and more monthly flexibility.`,
    },
    {
      id: "fee",
      priority: 80,
      when: (r) => r.feeBreakEvenMonths > 0,
      say: (r, v) => `The ${money(v.recastFee)} fee is recovered in ${r.feeBreakEvenMonths} month${r.feeBreakEvenMonths === 1 ? "" : "s"} of lower payments.`,
    },
    {
      id: "eligibility",
      priority: 60,
      when: () => true,
      say: () => `Most conventional loans can be recast, but FHA, VA and USDA loans generally can't. Ask your servicer about minimum lump sums and fees.`,
    },
  ],

  related: [relatedLink("mortgage-payoff"), relatedLink("refinance"), relatedLink("amortization"), relatedLink("mortgage"), relatedLink("heloc")],
  relatedArticles: [{ slug: "blog/pay-off-mortgage-early", label: "Should you pay off your mortgage early?" }],

  faqs: [
    { q: "What is a mortgage recast?", a: "Your lender re-amortizes the remaining balance after you make a large principal payment. The rate and remaining term stay the same, so the monthly payment drops." },
    { q: "Is recasting better than refinancing?", a: "A recast costs a small fee and doesn't change your rate, so it's useful when you have a lump sum and already have a good rate. Refinancing changes the rate and term but costs thousands in closing costs." },
    { q: "Should I recast or just pay extra?", a: "Prepaying without a recast saves more interest and ends the loan sooner. Recasting lowers your required payment, which gives more breathing room each month. Some people recast after selling a previous home." },
    { q: "Which loans can be recast?", a: "Most conventional loans held by servicers that offer recasting. Government-backed FHA, VA and USDA loans generally aren't eligible." },
  ],

  teach: {
    heading: "What is a mortgage recast?",
    whatIsIt:
      "A mortgage recast, also called re-amortization, recalculates your monthly payment after you pay down a large chunk of principal. Your interest rate and payoff date don't change; the smaller balance is simply spread over the same remaining months.",
    whyItMatters:
      "A recast is a cheap way to lower your payment without refinancing, especially if you already have a low rate you don't want to give up. It's common after buying a new home before selling the old one: you use the sale proceeds to recast the new mortgage.",
    whatToDoNext:
      "Call your servicer to confirm your loan is eligible, the minimum lump sum and the fee. If you'd rather save the most interest, compare with the mortgage payoff calculator, which shows prepaying without a recast.",
  },

  method: { label: "Recast payment = standard amortization payment on (balance − lump sum) over the same remaining months at the same rate; compared with prepaying at the original payment" },

  monetization: [
    { kind: "internal", headline: "Would a refinance beat a recast?", body: "If rates have fallen since you borrowed, compare a refinance's new payment and break-even.", ctaLabel: "Open the refinance calculator", href: "/refinance" },
  ],
};
