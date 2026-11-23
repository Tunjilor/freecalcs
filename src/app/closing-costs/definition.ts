// Closing Costs Calculator definition. Page content derives from this object
// plus the pure compute in ./compute.ts.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import {
  computeClosingCosts,
  type ClosingCostsInputs,
  type ClosingCostsResults,
} from "./compute";

const defaults: ClosingCostsInputs = {
  homePrice: 400000,
  downPayment: 40000,
  rate: 6.5,
  originationPct: 1,
  points: 0,
  appraisalInspection: 1100,
  titlePct: 0.5,
  transferTaxPct: 0.2,
  propTaxAnnual: 4800,
  insuranceAnnual: 1800,
  escrowMonths: 3,
  sellerCredit: 0,
};

export const closingCostsDef: CalculatorDefinition<ClosingCostsInputs, ClosingCostsResults> = {
  slug: "closing-costs",
  hub: "mortgage",
  h1: "Closing Costs Calculator",
  valueProp: "Estimate your buyer closing costs, line by line, and the total cash you'll need to close.",
  title: "Closing Costs Calculator for Buyers | freecalcs.io",
  metaDescription:
    "Free closing costs calculator: itemized buyer costs (lender fees, title, taxes, prepaids and escrow) plus your total cash to close, down payment included.",
  primaryKeyword: "Closing Costs Calculator",
  secondaryKeywords: [
    "how much are closing costs",
    "buyer closing costs",
    "cash to close calculator",
    "mortgage closing costs estimate",
  ],
  intro:
    "Closing costs typically add 2% to 5% of the loan amount on top of your down payment, and they surprise many first-time buyers. This closing costs calculator itemizes what a buyer usually pays: lender fees, appraisal and title, government taxes, and the prepaid interest, insurance and escrow reserves collected at closing. It then adds your down payment for the total cash you'll need on closing day.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "homePrice", label: "Home price", type: "currency", default: 400000 },
    { name: "downPayment", label: "Down payment", type: "currency", default: 40000 },
    { name: "rate", label: "Interest rate", type: "percent", default: 6.5, step: 0.05 },
    {
      name: "originationPct",
      label: "Origination fee (% of loan)",
      type: "percent",
      default: 1,
      step: 0.125,
      helpText: "Often 0.5%–1%. Some lenders charge flat fees instead.",
    },
    { name: "points", label: "Discount points", type: "number", default: 0, step: 0.25, helpText: "1 point = 1% of the loan, paid to lower your rate." },
    { name: "appraisalInspection", label: "Appraisal + inspection", type: "currency", default: 1100 },
    {
      name: "titlePct",
      label: "Title & settlement (% of price)",
      type: "percent",
      default: 0.5,
      step: 0.05,
    },
    {
      name: "transferTaxPct",
      label: "Transfer/recording taxes (% of price)",
      type: "percent",
      default: 0.2,
      step: 0.05,
      helpText: "Varies a lot by state, from 0% to over 1%. Check your state and county.",
    },
    { name: "propTaxAnnual", label: "Property tax / year", type: "currency", default: 4800 },
    { name: "insuranceAnnual", label: "Home insurance / year", type: "currency", default: 1800 },
    { name: "escrowMonths", label: "Escrow reserve months", type: "number", default: 3, min: 0, max: 12 },
    { name: "sellerCredit", label: "Seller credit", type: "currency", default: 0, helpText: "Closing costs the seller agreed to pay." },
  ],

  compute: computeClosingCosts,

  results: [
    {
      key: "cashToClose",
      label: "Estimated cash to close",
      format: "currency",
      variant: "primary",
      hint: "Down payment + closing costs − seller credit.",
    },
    { key: "netClosingCosts", label: "Closing costs (after credits)", format: "currency", variant: "secondary" },
    { key: "pctOfLoan", label: "Closing costs as % of loan", format: "percent", variant: "secondary" },
    { key: "lenderFees", label: "Lender fees", format: "currency", variant: "secondary" },
    { key: "thirdPartyFees", label: "Title, appraisal & inspection", format: "currency", variant: "secondary" },
    { key: "governmentFees", label: "Government taxes & fees", format: "currency", variant: "secondary" },
    { key: "prepaids", label: "Prepaids & escrow", format: "currency", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Itemized closing costs",
      columns: [
        { key: "item", label: "Item", format: "text", align: "left" },
        { key: "group", label: "Type", format: "text", align: "left" },
        { key: "amount", label: "Estimate", format: "currency", align: "right" },
      ],
      rows: (r) => r.lines.map((l) => ({ item: l.item, group: l.group, amount: l.amount })),
      note: "Estimates. Your lender must send an official Loan Estimate within 3 business days of your application.",
    },
  ],

  scenarios: [
    { id: "credit", label: "Seller pays $6,000", patch: { sellerCredit: 6000 } },
    { id: "point", label: "Buy 1 point", patch: { points: 1 } },
    { id: "high-tax-state", label: "High transfer-tax state", patch: { transferTaxPct: 1 } },
    { id: "no-orig", label: "No origination fee", patch: { originationPct: 0 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.totalClosingCosts > 0,
      say: (r, v) =>
        `Expect about ${money(r.netClosingCosts)} in closing costs, ${pct(r.pctOfLoan, 1)} of your loan. Add your ${money(
          v.downPayment,
        )} down payment and you'll need roughly ${money(r.cashToClose)} available on closing day.`,
    },
    {
      id: "prepaids-not-fees",
      priority: 85,
      when: (r) => r.prepaids > r.totalClosingCosts * 0.3,
      say: (r) =>
        `${money(r.prepaids)} of that is prepaids and escrow: interest, insurance and tax money you'd owe anyway, collected upfront. They're not lender fees, so they won't shrink by shopping lenders, but the rest can.`,
    },
    {
      id: "lender-shop",
      priority: 80,
      when: (r) => r.lenderFees > 2000,
      say: (r) =>
        `Lender fees come to ${money(r.lenderFees)}. Compare Section A ("Origination Charges") on Loan Estimates from at least three lenders; it's the most negotiable part of closing costs.`,
    },
    {
      id: "seller-credit",
      priority: 75,
      tone: "success",
      when: (r) => r.sellerCredit > 0,
      say: (r) =>
        `The seller's ${money(r.sellerCredit)} credit cuts your cash to close. Loan programs cap credits (often 3%–6% of the price for conventional and FHA), so confirm the limit with your lender.`,
    },
    {
      id: "ask-for-credit",
      priority: 60,
      when: (r) => r.sellerCredit === 0 && r.netClosingCosts > 5000,
      say: () =>
        `In a slower market, ask the seller to cover part of your closing costs. It's common, and many buyers prefer a credit to an equal price cut because it reduces the cash they need now.`,
    },
  ],

  related: [
    relatedLink("down-payment"),
    relatedLink("mortgage"),
    relatedLink("mortgage-points"),
    relatedLink("home-affordability"),
    relatedLink("fha-loan"),
    relatedLink("rent-vs-buy"),
  ],
  relatedArticles: [
    { slug: "blog/fha-loan-requirements", label: "FHA loan requirements in 2026" },
    { slug: "blog/28-36-rule-mortgage", label: "The 28/36 rule" },
  ],

  faqs: [
    {
      q: "How much are closing costs for a buyer?",
      a: "Usually 2% to 5% of the loan amount. On a $360,000 loan that's roughly $7,000 to $18,000, depending mostly on your state's transfer taxes, your lender's fees and how much escrow is collected upfront.",
    },
    {
      q: "What's included in closing costs?",
      a: "Lender fees (origination, points, underwriting), third-party services (appraisal, inspection, title insurance, settlement), government recording and transfer taxes, and prepaids: interest until your first payment, a year of homeowners insurance and escrow reserves for tax and insurance.",
    },
    {
      q: "Can closing costs be rolled into the mortgage?",
      a: "On a purchase, usually not directly. But you can ask the seller for a credit, choose a slightly higher rate in exchange for a lender credit, or look for down payment assistance programs that cover closing costs.",
    },
    {
      q: "What is cash to close?",
      a: "The total you bring to closing: your down payment plus closing costs, minus any earnest money already paid and any seller or lender credits. Your Closing Disclosure shows the exact figure at least three business days before closing.",
    },
    {
      q: "Who pays transfer taxes, the buyer or the seller?",
      a: "It depends on the state and local custom, and it's negotiable. In some states the seller usually pays, in others it's split, and a few states have no transfer tax. Set the field to match what you expect to pay.",
    },
  ],

  teach: {
    heading: "What are closing costs?",
    whatIsIt:
      "Closing costs are the fees and upfront payments due when a home purchase is finalized, on top of the down payment. They fall into four groups: lender charges for making the loan, third-party services like the appraisal and title insurance, government recording and transfer taxes, and prepaids, which are future costs like insurance and interest collected in advance.",
    whyItMatters:
      "Buyers often budget for the down payment and forget closing costs, then scramble in the final weeks. Knowing the full cash-to-close figure early tells you whether you can afford a price, whether to ask for a seller credit, and how much to keep in reserve.\n\nIt also shows where to negotiate. Prepaids and taxes are mostly fixed, but lender fees vary from lender to lender, and title and settlement services can often be shopped.",
    whatToDoNext:
      "Apply with at least three lenders in the same week and compare their official Loan Estimates line by line. Look up your state's transfer tax and who customarily pays it. If your cash is tight, ask for a seller credit in your offer, or ask lenders what rate they'd charge with a lender credit toward closing costs.\n\nFinally, check whether your state or city has down payment assistance. Many programs cover closing costs as well.",
  },

  method: {
    label:
      "Itemized estimate: percentage-based lines use the loan or price; prepaid interest assumes 15 days; escrow reserves are months × (annual tax + insurance) ÷ 12. Typical totals of 2–5% of the loan reflect CFPB and Freddie Mac guidance",
  },

  monetization: [
    {
      kind: "internal",
      headline: "Short on cash to close?",
      body: "See how a lower down payment program like FHA changes your upfront cash and your monthly payment.",
      ctaLabel: "Open the FHA loan calculator",
      href: "/fha-loan",
    },
  ],
};
