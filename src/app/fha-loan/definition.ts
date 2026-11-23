// FHA Loan Calculator definition. Page content derives from this object plus
// the pure compute in ./compute.ts. Shape mirrors the VA reference build.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import {
  computeFha,
  FHA_FLOOR_LIMIT_2026,
  type FhaInputs,
  type FhaResults,
} from "./compute";

const defaults: FhaInputs = {
  homePrice: 350000,
  downPayment: 12250,
  rate: 6.25,
  termYears: 30,
  creditBand: "580",
  propTaxAnnual: 4200,
  insuranceAnnual: 1500,
  hoaMonthly: 0,
};

export const fhaLoanDef: CalculatorDefinition<FhaInputs, FhaResults> = {
  slug: "fha-loan",
  hub: "mortgage",
  h1: "FHA Loan Calculator",
  valueProp: "Estimate your FHA payment with upfront and monthly mortgage insurance (MIP) built in.",
  title: "FHA Loan Calculator with MIP (2026) | freecalcs.io",
  metaDescription:
    "Free FHA loan calculator: monthly payment with 2026 MIP rates, the 1.75% upfront premium, how long MIP lasts, and your minimum down payment.",
  primaryKeyword: "FHA Loan Calculator",
  secondaryKeywords: [
    "FHA mortgage calculator",
    "FHA MIP calculator",
    "FHA mortgage insurance",
    "FHA loan payment",
    "FHA 3.5% down",
  ],
  intro:
    "An FHA loan lets you buy with as little as 3.5% down and a credit score as low as 580, but it comes with mortgage insurance you can't skip. This FHA loan calculator shows your full monthly payment, including the 1.75% upfront premium and the annual MIP at 2026 rates, and tells you whether that MIP drops off after 11 years or stays for the life of the loan.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "homePrice", label: "Home price", type: "currency", default: 350000 },
    {
      name: "downPayment",
      label: "Down payment",
      type: "currency",
      default: 12250,
      helpText: "FHA minimum is 3.5% with a 580+ score. 10% down lets MIP end after 11 years.",
    },
    { name: "rate", label: "Interest rate", type: "percent", default: 6.25, step: 0.05 },
    { name: "termYears", label: "Loan term", type: "years", default: 30, min: 10, max: 30 },
    {
      name: "creditBand",
      label: "Credit score",
      type: "select",
      default: "580",
      options: [
        { label: "580 or higher", value: "580" },
        { label: "500–579", value: "500" },
      ],
      helpText: "Scores of 500–579 need at least 10% down.",
    },
    { name: "propTaxAnnual", label: "Property tax / year", type: "currency", default: 4200 },
    { name: "insuranceAnnual", label: "Home insurance / year", type: "currency", default: 1500 },
    { name: "hoaMonthly", label: "HOA / month", type: "currency", default: 0 },
  ],

  compute: computeFha,

  results: [
    {
      key: "totalMonthly",
      label: "Estimated monthly payment",
      format: "currency2",
      variant: "primary",
      hint: "Principal, interest, MIP, taxes & insurance.",
    },
    { key: "monthlyPI", label: "Principal & interest", format: "currency2", variant: "secondary" },
    { key: "monthlyMIP", label: "Monthly MIP (year 1)", format: "currency2", variant: "secondary" },
    { key: "annualMipRate", label: "Annual MIP rate", format: "percent", variant: "secondary" },
    { key: "ufmip", label: "Upfront MIP (1.75%)", format: "currency", variant: "secondary" },
    { key: "loanAmount", label: "Total loan (with UFMIP)", format: "currency", variant: "secondary" },
    { key: "mipYears", label: "Years of annual MIP", format: "number", variant: "secondary" },
    { key: "totalMipAll", label: "Total MIP paid", format: "currency", variant: "secondary" },
    { key: "totalInterest", label: "Total interest", format: "currency", variant: "secondary" },
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
    { id: "ten", label: "Put 10% down", patch: { downPayment: 35000 }, blurb: "MIP ends after 11 years." },
    { id: "five", label: "Put 5% down", patch: { downPayment: 17500 }, blurb: "Drops MIP to 0.50%." },
    { id: "fifteen", label: "15-year loan", patch: { termYears: 15 } },
    { id: "lower-rate", label: "Rate 0.5% lower", patch: { rate: 5.75 } },
  ],

  insights: [
    {
      id: "below-min-down",
      priority: 99,
      tone: "warn",
      when: (r) => !r.meetsMinDown && r.baseLoan > 0,
      say: (r) =>
        `FHA requires at least ${pct(r.minDownPct, r.minDownPct % 1 === 0 ? 0 : 1)} down for your credit band — ${money(
          r.minDownAmount,
        )} on this home. Your current down payment is ${pct(r.downPaymentPct, 1)}, so a lender won't approve it as entered.`,
    },
    {
      id: "mip-for-life",
      priority: 95,
      tone: "warn",
      when: (r) => r.mipForLife && r.baseLoan > 0,
      say: (r) =>
        `With less than 10% down, FHA mortgage insurance never cancels on its own. You'd pay about ${money(
          r.monthlyMIP,
        )}/month to start and roughly ${money(r.totalMipAll)} in total MIP unless you later refinance into a conventional loan.`,
    },
    {
      id: "mip-11-years",
      priority: 94,
      tone: "success",
      when: (r) => !r.mipForLife && r.totalMip > 0,
      say: (r) =>
        `Because you're putting at least 10% down, your annual MIP ends after ${r.mipYears} years instead of lasting for the life of the loan. Total MIP comes to about ${money(
          r.totalMipAll,
        )}, including the upfront premium.`,
    },
    {
      id: "ten-down-lever",
      priority: 85,
      when: (r) => r.mipForLife && r.tenDownMipSaving > 1000,
      say: (r) =>
        `Putting 10% down would make MIP stop after 11 years and cut your total mortgage insurance by about ${money(
          r.tenDownMipSaving,
        )} — a bigger saving than most people expect from a few extra points of down payment.`,
    },
    {
      id: "ufmip-financed",
      priority: 80,
      when: (r) => r.ufmip > 0,
      say: (r) =>
        `The 1.75% upfront premium (${money(r.ufmip)}) is normally rolled into the loan, so you'll owe ${money(
          r.loanAmount,
        )} rather than ${money(r.baseLoan)}, and you'll pay interest on that premium for the life of the loan.`,
    },
    {
      id: "over-floor-limit",
      priority: 75,
      tone: "warn",
      when: (r) => r.exceedsFloorLimit && !r.exceedsCeilingLimit,
      say: (r) =>
        `Your base loan of ${money(r.baseLoan)} is above the 2026 FHA limit for most counties (${money(
          FHA_FLOOR_LIMIT_2026,
        )}). It may still work in a higher-cost county — check your county's FHA limit before applying.`,
    },
    {
      id: "over-ceiling-limit",
      priority: 76,
      tone: "warn",
      when: (r) => r.exceedsCeilingLimit,
      say: () =>
        `This loan is above the highest 2026 FHA limit anywhere in the continental U.S. ($1,249,125), so it can't be an FHA loan. A conventional or jumbo loan would be the route here.`,
    },
    {
      id: "mip-share",
      priority: 60,
      when: (r) => r.monthlyMIP > 0 && r.totalMonthly > 0,
      say: (r) =>
        `Mortgage insurance is ${pct((r.monthlyMIP / r.totalMonthly) * 100, 1)} of your monthly payment. If your credit is 680 or higher, compare a conventional loan — its PMI cancels once you reach 20% equity.`,
    },
  ],

  related: [
    relatedLink("mortgage"),
    relatedLink("qualify"),
    relatedLink("va-loan"),
    relatedLink("usda-loan"),
    relatedLink("down-payment"),
    relatedLink("home-affordability"),
  ],
  relatedArticles: [
    { slug: "blog/fha-loan-requirements", label: "FHA loan requirements in 2026" },
    { slug: "blog/fha-vs-conventional-which-is-cheaper", label: "FHA vs conventional: which is cheaper?" },
    { slug: "blog/fha-vs-conventional-vs-va-vs-usda", label: "FHA vs Conventional vs VA vs USDA" },
  ],

  faqs: [
    {
      q: "What is the minimum down payment for an FHA loan?",
      a: "3.5% of the purchase price if your credit score is 580 or higher, and 10% if your score is between 500 and 579. The down payment can come from savings or an acceptable gift from a family member.",
    },
    {
      q: "How much is FHA mortgage insurance in 2026?",
      a: "Every FHA loan has a 1.75% upfront premium plus an annual premium. On a 30-year loan of $726,200 or less, the annual rate is 0.55% with less than 5% down and 0.50% with 5% or more down. Fifteen-year loans and larger loans use different rates, which this calculator applies automatically.",
    },
    {
      q: "Does FHA MIP ever go away?",
      a: "Only if you put at least 10% down, in which case annual MIP ends after 11 years. With less than 10% down it lasts for the life of the loan. Many FHA borrowers remove it by refinancing into a conventional loan once they reach about 20% equity.",
    },
    {
      q: "Can I roll the upfront MIP into my loan?",
      a: "Yes, and most borrowers do. The 1.75% premium is added to your loan balance, so you don't pay it at closing, but you do pay interest on it over the loan's life.",
    },
    {
      q: "What is the FHA loan limit for 2026?",
      a: "For a single-family home, FHA limits range from $541,287 in most counties to $1,249,125 in the highest-cost areas, with higher limits in Alaska, Hawaii, Guam and the U.S. Virgin Islands. Check HUD's lookup for your county's exact limit.",
    },
    {
      q: "Is an FHA loan cheaper than a conventional loan?",
      a: "It depends mostly on your credit score and down payment. FHA rates are often lower and it accepts lower scores, but its mortgage insurance usually lasts longer. Borrowers with scores around 680 or above and 5%+ down frequently find conventional cheaper over time.",
    },
  ],

  teach: {
    heading: "What is an FHA loan?",
    whatIsIt:
      "An FHA loan is a mortgage insured by the Federal Housing Administration, part of HUD. The FHA doesn't lend you money; it insures the lender against loss, which lets lenders approve buyers with smaller down payments and lower credit scores than conventional loans usually allow.\n\nThe cost of that insurance is passed to you as a mortgage insurance premium, or MIP, in two parts: a one-time upfront premium of 1.75% of the loan, and an annual premium that's split into monthly payments. The annual rate depends on your loan size, your down payment and your loan term.",
    whyItMatters:
      "MIP is what separates a rough FHA estimate from a real one. On a typical $350,000 purchase with 3.5% down, it adds roughly $150 a month on top of principal and interest, and because the down payment is under 10%, it never cancels on its own. Over 30 years that can add up to tens of thousands of dollars.\n\nThe 10% line matters most. Crossing it doesn't just lower your loan balance; it turns MIP from a lifetime cost into an 11-year cost. For buyers who can stretch to 10%, that one change often saves more than any rate discount they could negotiate.",
    whatToDoNext:
      "Check your county's FHA loan limit to make sure the home you want fits, then get your credit report so you know which down-payment tier applies. If your score is near 680 or higher, ask lenders to quote both FHA and conventional so you can compare total mortgage-insurance cost, not just the rate.\n\nIf you go FHA with less than 10% down, plan for a refinance: once your home's value and your payments push you to about 20% equity, refinancing into a conventional loan is the usual way to drop MIP. The mortgage qualifier can show which programs you fit today.",
  },

  method: {
    label:
      "Uses the standard amortization formula and FHA MIP rates from HUD Mortgagee Letter 2023-05 (current for 2026), with annual MIP recalculated each year on the average loan balance",
    sourceUrl: "https://www.hud.gov/hud-partners/single-family-lender",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Compare FHA with your other options",
      body: "See whether you also qualify for a conventional, VA or USDA loan — any of which could cost less in mortgage insurance than FHA.",
      ctaLabel: "Check if you qualify",
      href: "/qualify",
    },
  ],
};
