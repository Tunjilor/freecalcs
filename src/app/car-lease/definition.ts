// Car Lease Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, pct } from "@/lib/calculator/format";
import { computeCarLease, type CarLeaseInputs, type CarLeaseResults } from "./compute";

const defaults: CarLeaseInputs = {
  msrp: 40000, negotiatedPrice: 38000, downPayment: 2000, tradeIn: 0, fees: 1000,
  termMonths: 36, residualPct: 58, apr: 6, salesTaxPct: 7,
};

export const carLeaseDef: CalculatorDefinition<CarLeaseInputs, CarLeaseResults> = {
  slug: "car-lease",
  hub: "loans",
  h1: "Car Lease Calculator",
  valueProp: "Estimate a lease payment from MSRP, price, residual and money factor, and see the full cost.",
  title: "Car Lease Calculator: Monthly Payment | freecalcs.io",
  metaDescription:
    "Free car lease calculator: monthly payment from MSRP, negotiated price, residual value and money factor, with depreciation, finance charges and total cost.",
  primaryKeyword: "Car Lease Calculator",
  secondaryKeywords: ["lease payment calculator", "money factor calculator", "auto lease calculator", "residual value"],
  intro:
    "A lease payment is mostly the car's expected loss in value plus a finance charge, and both are negotiable. This car lease calculator uses the standard lease formula to estimate your monthly payment from the MSRP, your negotiated price, the residual value and the money factor, then shows how much the lease costs in total.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "msrp", label: "MSRP (sticker price)", type: "currency", default: 40000 },
    { name: "negotiatedPrice", label: "Negotiated price", type: "currency", default: 38000, helpText: "The capitalized cost you agree on. Negotiate this like a purchase price." },
    { name: "downPayment", label: "Down payment (cap cost reduction)", type: "currency", default: 2000 },
    { name: "tradeIn", label: "Trade-in equity", type: "currency", default: 0 },
    { name: "fees", label: "Fees rolled into the lease", type: "currency", default: 1000, helpText: "Acquisition and documentation fees." },
    { name: "termMonths", label: "Lease term (months)", type: "number", default: 36, min: 12, max: 60, step: 12 },
    { name: "residualPct", label: "Residual value (% of MSRP)", type: "percent", default: 58, step: 1, helpText: "Set by the leasing company; often 50–60% for 36 months." },
    { name: "apr", label: "Interest rate (APR)", type: "percent", default: 6, step: 0.1, helpText: "Money factor × 2,400. A money factor of 0.0025 equals 6%." },
    { name: "salesTaxPct", label: "Sales tax", type: "percent", default: 7, step: 0.05 },
  ],

  compute: computeCarLease,

  results: [
    { key: "monthlyPayment", label: "Monthly lease payment", format: "currency2", variant: "primary", hint: "Including sales tax." },
    { key: "depreciationFee", label: "Depreciation / month", format: "currency2", variant: "secondary" },
    { key: "financeFee", label: "Finance charge / month", format: "currency2", variant: "secondary" },
    { key: "monthlyTax", label: "Sales tax / month", format: "currency2", variant: "secondary" },
    { key: "residualValue", label: "Residual value", format: "currency", variant: "secondary" },
    { key: "totalLeaseCost", label: "Total cost of the lease", format: "currency", variant: "secondary" },
    { key: "moneyFactor", label: "Money factor", format: "text", variant: "secondary" },
  ],

  scenarios: [
    { id: "zero-down", label: "$0 down", patch: { downPayment: 0 } },
    { id: "discount", label: "Negotiate $2k more off", patch: { negotiatedPrice: 36000 } },
    { id: "low-rate", label: "Promo rate 2.4%", patch: { apr: 2.4 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.monthlyPayment > 0,
      say: (r, v) =>
        `Your payment of ${money2(r.monthlyPayment)} is ${money2(r.depreciationFee)} of depreciation, ${money2(r.financeFee)} of finance charge and ${money2(
          r.monthlyTax,
        )} of tax. Over ${v.termMonths} months the lease costs ${money(r.totalLeaseCost)} in total.`,
    },
    {
      id: "negotiate",
      priority: 88,
      when: (r) => r.discountPct < 3,
      say: (r) =>
        `You're getting ${pct(r.discountPct, 1)} off MSRP. The price is negotiable on a lease just as on a purchase, and every $1,000 off lowers the payment by roughly ${money(
          1000 / 36,
        )} a month on a 36-month lease.`,
    },
    {
      id: "down-risk",
      priority: 85,
      tone: "warn",
      when: (r, v) => v.downPayment >= 2000,
      say: (r, v) =>
        `If the car is stolen or totaled early, gap insurance pays off the lease but your ${money(v.downPayment)} down payment is usually gone. Many experts suggest putting little or nothing down on a lease.`,
    },
    {
      id: "money-factor",
      priority: 75,
      when: (r) => r.moneyFactor > 0,
      say: (r, v) =>
        `A money factor of ${r.moneyFactor} is the same as a ${pct(v.apr, 1)} interest rate. Dealers can mark it up; ask for the "buy rate" the lender approved you for.`,
    },
    {
      id: "mileage",
      priority: 60,
      when: () => true,
      say: () => `Leases typically allow 10,000–12,000 miles a year and charge 15–30 cents per extra mile. If you drive more, buy extra miles upfront, which is cheaper than paying at turn-in.`,
    },
  ],

  related: [relatedLink("auto-loan"), relatedLink("car-affordability"), relatedLink("auto-insurance-estimator"), relatedLink("personal-loan")],
  relatedArticles: [],

  faqs: [
    { q: "How is a car lease payment calculated?", a: "Payment = depreciation fee + finance charge + tax. Depreciation fee = (adjusted cap cost − residual value) ÷ months. Finance charge = (adjusted cap cost + residual value) × money factor." },
    { q: "What is a money factor?", a: "The lease equivalent of an interest rate, written as a small decimal. Multiply it by 2,400 to get an approximate APR: a money factor of 0.0025 is about 6%." },
    { q: "What is residual value?", a: "The leasing company's estimate of what the car will be worth at the end of the lease, as a percentage of MSRP. A higher residual means less depreciation to pay for, so a lower payment." },
    { q: "Is it better to lease or buy?", a: "Leasing usually means lower payments and a new car every few years, but you never own it and mileage is limited. Buying costs more monthly at first but is usually cheaper over the long run if you keep the car several years." },
    { q: "How is sales tax charged on a lease?", a: "Most states tax each monthly payment, which is how this calculator works. A few tax the full price or the total of all payments upfront instead, so check your state's rules before signing." },
  ],

  teach: {
    heading: "How does a car lease payment work?",
    whatIsIt:
      "A car lease is a long-term rental. Instead of paying for the whole car, you pay for the value it loses while you drive it (the difference between the price and the residual value), plus a finance charge and tax.",
    whyItMatters:
      "Because you only pay for depreciation, lease payments are usually lower than loan payments on the same car. But the numbers are easy to obscure: dealers can raise the price, mark up the money factor or add fees while keeping the payment looking reasonable.\n\nKnowing the formula lets you check each piece and see exactly where the money goes.",
    whatToDoNext:
      "Ask the dealer for the four numbers that drive the payment: capitalized cost, residual percentage, money factor and fees. Negotiate the price first. Then compare the total lease cost with buying the same car using the auto loan calculator.",
  },

  method: { label: "Payment = ((cap cost − residual) ÷ months + (cap cost + residual) × money factor) × (1 + sales tax); money factor = APR ÷ 2,400" },

  monetization: [
    { kind: "internal", headline: "Compare leasing with buying", body: "See the payment and total interest if you financed the same car instead.", ctaLabel: "Open the auto loan calculator", href: "/auto-loan" },
  ],
};
