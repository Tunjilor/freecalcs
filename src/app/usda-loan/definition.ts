// USDA Loan Calculator definition. Page content derives from this object plus
// the pure compute in ./compute.ts. Shape mirrors the VA reference build.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money } from "@/lib/calculator/format";
import { computeUsda, type UsdaInputs, type UsdaResults } from "./compute";

const defaults: UsdaInputs = {
  homePrice: 275000,
  downPayment: 0,
  rate: 6.25,
  termYears: 30,
  financeFee: "yes",
  propTaxAnnual: 3000,
  insuranceAnnual: 1400,
  hoaMonthly: 0,
};

export const usdaLoanDef: CalculatorDefinition<UsdaInputs, UsdaResults> = {
  slug: "usda-loan",
  hub: "mortgage",
  h1: "USDA Loan Calculator",
  valueProp: "Estimate your $0-down USDA payment, including the 1% upfront and 0.35% annual guarantee fees.",
  title: "USDA Loan Calculator: $0-Down Payment & Fees | freecalcs.io",
  metaDescription:
    "Free USDA loan calculator: your $0-down rural home payment with the 1% upfront guarantee fee and 0.35% annual fee, compared with a 3.5%-down FHA loan.",
  primaryKeyword: "USDA Loan Calculator",
  secondaryKeywords: [
    "USDA mortgage calculator",
    "USDA guarantee fee",
    "USDA loan payment",
    "rural home loan calculator",
    "USDA vs FHA",
  ],
  intro:
    "A USDA loan lets eligible buyers in rural and many suburban areas purchase a home with no down payment. This USDA loan calculator estimates your monthly payment, including the 1% upfront guarantee fee and the 0.35% annual fee, and compares it with a 3.5%-down FHA loan on the same home so you can see what the zero-down route really saves.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "homePrice", label: "Home price", type: "currency", default: 275000 },
    {
      name: "downPayment",
      label: "Down payment",
      type: "currency",
      default: 0,
      helpText: "USDA doesn't require a down payment.",
    },
    { name: "rate", label: "Interest rate", type: "percent", default: 6.25, step: 0.05 },
    { name: "termYears", label: "Loan term", type: "years", default: 30, min: 15, max: 30 },
    {
      name: "financeFee",
      label: "1% upfront fee",
      type: "select",
      default: "yes",
      options: [
        { label: "Roll into the loan (standard)", value: "yes" },
        { label: "Pay in cash at closing", value: "no" },
      ],
    },
    { name: "propTaxAnnual", label: "Property tax / year", type: "currency", default: 3000 },
    { name: "insuranceAnnual", label: "Home insurance / year", type: "currency", default: 1400 },
    { name: "hoaMonthly", label: "HOA / month", type: "currency", default: 0 },
  ],

  compute: computeUsda,

  results: [
    {
      key: "totalMonthly",
      label: "Estimated monthly payment",
      format: "currency2",
      variant: "primary",
      hint: "Principal, interest, annual fee, taxes & insurance.",
    },
    { key: "monthlyPI", label: "Principal & interest", format: "currency2", variant: "secondary" },
    { key: "monthlyAnnualFee", label: "Annual fee, monthly (year 1)", format: "currency2", variant: "secondary" },
    { key: "upfrontFee", label: "Upfront guarantee fee (1%)", format: "currency", variant: "secondary" },
    { key: "loanAmount", label: "Total loan amount", format: "currency", variant: "secondary" },
    { key: "totalGuaranteeFees", label: "Total guarantee fees", format: "currency", variant: "secondary" },
    { key: "totalInterest", label: "Total interest", format: "currency", variant: "secondary" },
    { key: "fhaMonthly", label: "Same home with FHA (3.5% down)", format: "currency2", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Loan balance over time",
    yFormat: "currency",
    series: (r) =>
      r.schedule
        .filter((row) => row.month % 12 === 0 || row.month === r.schedule.length)
        .map((row) => ({ x: `Yr ${Math.ceil(row.month / 12)}`, y: row.balance })),
  },

  scenarios: [
    { id: "cash-fee", label: "Pay the 1% fee in cash", patch: { financeFee: "no" } },
    { id: "lower-rate", label: "Rate 0.5% lower", patch: { rate: 5.75 } },
    { id: "cheaper", label: "$225k home", patch: { homePrice: 225000 } },
  ],

  insights: [
    {
      id: "zero-down-cash",
      priority: 95,
      tone: "success",
      when: (r) => r.downPaymentPct < 1 && r.baseLoan > 0,
      say: (r) =>
        `You're buying with nothing down. The same home with a 3.5%-down FHA loan would need ${money(
          r.fhaDownPayment,
        )} in cash at closing, which stays in your savings here.`,
    },
    {
      id: "vs-fha-monthly",
      priority: 90,
      when: (r) => r.baseLoan > 0 && r.fhaMonthly > 0,
      say: (r) => {
        const d = r.vsFhaMonthlySaving;
        const lead =
          Math.abs(d) < 15
            ? `Your monthly payment is about the same as a 3.5%-down FHA loan (${money(r.fhaMonthly)})`
            : d > 0
              ? `Your payment is about ${money(d)}/month lower than a 3.5%-down FHA loan`
              : `Your payment is about ${money(-d)}/month higher than a 3.5%-down FHA loan, because USDA finances the full price`;
        return `${lead}, but USDA's annual fee (${money(r.monthlyAnnualFee)}/month) is far cheaper than FHA mortgage insurance (${money(
          r.fhaMonthlyMip,
        )}/month).`;
      },
    },
    {
      id: "fee-for-life",
      priority: 85,
      when: (r) => r.totalAnnualFees > 0,
      say: (r) =>
        `The 0.35% annual fee lasts for the life of the loan, shrinking as you pay the balance down. Over the full term it adds up to about ${money(
          r.totalAnnualFees,
        )}, or ${money(r.totalGuaranteeFees)} counting the upfront fee.`,
    },
    {
      id: "fee-financed",
      priority: 75,
      when: (r) => r.feeFinanced,
      say: (r) =>
        `Rolling the ${money(r.upfrontFee)} upfront fee into the loan means you don't need it at closing, and it adds only a few dollars to your monthly payment.`,
    },
    {
      id: "fee-cash",
      priority: 75,
      when: (r) => !r.feeFinanced && r.cashToCloseFee > 0,
      say: (r) =>
        `You'll need ${money(r.cashToCloseFee)} at closing for the upfront fee. USDA lets you finance it instead if you'd rather keep that cash.`,
    },
    {
      id: "eligibility-check",
      priority: 60,
      tone: "warn",
      when: (r) => r.baseLoan > 0,
      say: () =>
        `USDA has two eligibility tests this calculator can't check: the home must be in an eligible area, and household income must be at or below 115% of the local median. Both take a minute on USDA's eligibility site.`,
    },
  ],

  related: [
    relatedLink("mortgage"),
    relatedLink("qualify"),
    relatedLink("fha-loan"),
    relatedLink("va-loan"),
    relatedLink("home-affordability"),
    relatedLink("rent-vs-buy"),
  ],
  relatedArticles: [
    { slug: "blog/usda-loan-eligibility", label: "USDA loan eligibility explained" },
    { slug: "blog/fha-vs-conventional-vs-va-vs-usda", label: "FHA vs Conventional vs VA vs USDA" },
  ],

  faqs: [
    {
      q: "Do USDA loans really require no down payment?",
      a: "Yes. USDA guaranteed loans can finance 100% of the purchase price for eligible buyers. You'll still have closing costs, though sellers can contribute toward them and the upfront guarantee fee can be financed.",
    },
    {
      q: "What are the USDA guarantee fees?",
      a: "A 1% upfront guarantee fee, usually rolled into the loan, plus an annual fee of 0.35% of the remaining balance, split into monthly payments. USDA confirmed both rates for fiscal year 2027, which runs from October 1, 2026 to September 30, 2027.",
    },
    {
      q: "Does the USDA annual fee ever go away?",
      a: "No. Unlike conventional PMI, it lasts for the life of the loan. Because it's charged on the remaining balance, it gets smaller every year. Refinancing into another loan type is the only way to remove it.",
    },
    {
      q: "Who qualifies for a USDA loan?",
      a: "The home must be in a USDA-eligible area, which includes many small towns and suburbs, not just farmland. Household income must be no more than 115% of the area median, and the home must be your primary residence. Lenders also look at credit, with most wanting a score around 640.",
    },
    {
      q: "Is a USDA loan better than an FHA loan?",
      a: "If you qualify, usually yes: you skip the 3.5% down payment and pay a much smaller insurance fee than FHA's mortgage insurance. The monthly payments often come out close, because FHA's down payment lowers its balance.",
    },
    {
      q: "Can I use a USDA loan for a second home or investment property?",
      a: "No. USDA guaranteed loans are only for a primary residence you will live in.",
    },
  ],

  teach: {
    whatIsIt:
      "A USDA loan, formally the Section 502 Guaranteed Loan, is a mortgage backed by the U.S. Department of Agriculture's Rural Development program. Private lenders make the loan and USDA guarantees it, which lets them offer 100% financing to moderate-income buyers in eligible areas.\n\nInstead of private mortgage insurance, USDA charges a guarantee fee in two parts: 1% of the loan upfront, and 0.35% of the remaining balance each year, collected monthly.",
    whyItMatters:
      "For buyers who qualify, USDA removes the biggest barrier to owning a home: the down payment. On a $275,000 home, a 3.5%-down FHA loan needs almost $10,000 at closing; USDA needs none of it.\n\nIt's also one of the cheapest forms of mortgage insurance available. USDA's 0.35% annual fee is well under the 0.50% to 0.55% FHA charges on most loans, and lower than conventional PMI for many borrowers with less-than-perfect credit. The catch is that it never cancels, so it's worth knowing the lifetime total, which this calculator shows.",
    whatToDoNext:
      "Check eligibility first. USDA's property map will tell you within a minute whether an address qualifies, and its income tool checks your household against the county limit. Many buyers are surprised to find that suburbs near major cities still qualify.\n\nIf you're eligible, look for a lender that regularly closes USDA loans, since approval runs through both the lender and USDA and can add time. Get quotes from at least three lenders, and run the same home through the FHA calculator so you can compare the two side by side.",
  },

  method: {
    label:
      "Uses the standard amortization formula with the USDA Section 502 guaranteed-loan fees (1% upfront, 0.35% annual on the average balance), confirmed for fiscal years 2026 and 2027",
    sourceUrl: "https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-guaranteed-loan-program",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "See every loan program you qualify for",
      body: "USDA is one option. Our mortgage qualifier checks FHA, VA, USDA and conventional in a couple of minutes, no sign-up required.",
      ctaLabel: "Check if you qualify",
      href: "/qualify",
    },
  ],
};
