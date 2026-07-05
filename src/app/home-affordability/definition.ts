import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import {
  computeAffordability,
  type AffordabilityInputs,
  type AffordabilityResults,
} from "./compute";

const defaults: AffordabilityInputs = {
  annualIncome: 120000,
  monthlyDebts: 600,
  downPayment: 60000,
  rate: 6.5,
  termYears: 30,
};

export const affordabilityDef: CalculatorDefinition<AffordabilityInputs, AffordabilityResults> = {
  slug: "home-affordability",
  hub: "mortgage",
  h1: "Home Affordability Calculator",
  valueProp: "See the max home price you can afford across conservative, moderate, and aggressive DTI.",
  title: "Home Affordability Calculator (How Much House) | freecalcs.io",
  metaDescription:
    "Free home affordability calculator: from your income, debts, and down payment, see the maximum home price you can afford at conservative, moderate, and aggressive debt-to-income levels.",
  primaryKeyword: "Home Affordability Calculator",
  secondaryKeywords: ["how much house can I afford", "mortgage affordability", "DTI calculator", "max home price"],
  intro:
    "How much house you can afford comes down to your income, your existing debts, and how much of your budget you're comfortable committing to housing. This calculator shows your maximum home price at three debt-to-income (DTI) comfort levels — conservative, moderate, and aggressive — so you get a realistic range instead of a single optimistic number.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "annualIncome", label: "Annual household income", type: "currency", default: 120000 },
    { name: "monthlyDebts", label: "Monthly debt payments", type: "currency", default: 600, helpText: "Car, student loans, credit-card minimums, etc." },
    { name: "downPayment", label: "Down payment", type: "currency", default: 60000 },
    { name: "rate", label: "Interest rate", type: "percent", default: 6.5, step: 0.1 },
    { name: "termYears", label: "Loan term", type: "years", default: 30, min: 8, max: 30 },
  ],

  compute: computeAffordability,

  results: [
    { key: "maxPriceModerate", label: "Home price you can afford", format: "currency", variant: "primary", hint: "At a moderate 43% debt-to-income level." },
    { key: "maxPaymentModerate", label: "Max monthly payment", format: "currency", variant: "secondary" },
    { key: "maxLoanModerate", label: "Max loan amount", format: "currency", variant: "secondary" },
    { key: "downPaymentPct", label: "Down payment %", format: "percent", variant: "secondary" },
    { key: "twentyPercentDown", label: "20% down would be", format: "currency", variant: "secondary" },
    { key: "pmiMonthly", label: "Est. PMI at this down %", format: "currency2", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Affordability by comfort level",
      columns: [
        { key: "label", label: "Approach", format: "text", align: "left" },
        { key: "dti", label: "DTI", format: "percent" },
        { key: "maxPayment", label: "Max payment", format: "currency" },
        { key: "maxPrice", label: "Max home price", format: "currency" },
      ],
      rows: (r) =>
        r.levels.map((l) => ({
          label: l.label,
          dti: l.dti,
          maxPayment: l.maxPayment,
          maxPrice: l.maxPrice,
        })),
      note: "DTI is your total monthly debt (including the new housing payment) as a share of gross monthly income. Conservative keeps a comfortable cushion; aggressive is near the upper limit lenders allow.",
    },
  ],

  scenarios: [
    { id: "moredown", label: "Add $40k down", patch: { downPayment: 100000 } },
    { id: "nodebt", label: "No other debts", patch: { monthlyDebts: 0 } },
    { id: "higherrate", label: "Rate at 7.5%", patch: { rate: 7.5 } },
  ],

  insights: [
    {
      id: "range",
      priority: 92,
      when: (r, v) => v.annualIncome > 0,
      say: (r) =>
        `At a moderate DTI you can afford about ${money(
          r.maxPriceModerate,
        )}. Conservatively that's around ${money(
          r.levels[0].maxPrice,
        )}; stretching to aggressive, up to ${money(r.levels[2].maxPrice)}.`,
    },
    {
      id: "down-lever",
      priority: 85,
      when: (r, v) => v.annualIncome > 0,
      say: (r, v) =>
        `Your ${money(v.downPayment)} down is ${pct(
          r.downPaymentPct,
        )} of that price. Down payment adds directly to your budget — another ${money(
          50000,
        )} down would raise your max price to about ${money(r.maxPriceModerate + 50000)}.`,
    },
    {
      id: "pmi-threshold",
      priority: 80,
      tone: "warn",
      when: (r) => r.needsPmi,
      say: (r) =>
        `At ${pct(
          r.downPaymentPct,
        )} down you'd pay PMI — roughly ${money(r.pmiMonthly)}/month. Reaching 20% (${money(
          r.twentyPercentDown,
        )}) on this price would remove it.`,
    },
    {
      id: "debt-impact",
      priority: 74,
      when: (r, v) => v.monthlyDebts > 0 && r.maxPaymentModerate > 0,
      say: (r, v) =>
        `Your ${money(
          v.monthlyDebts,
        )}/month of existing debt payments cut your buying power by roughly ${money(
          v.monthlyDebts * (r.maxLoanModerate / r.maxPaymentModerate),
        )} of home price — paying them down before you buy stretches your budget.`,
    },
  ],

  related: [
    relatedLink("qualify"),
    relatedLink("mortgage"),
    relatedLink("down-payment"),
    relatedLink("rent-vs-buy"),
    relatedLink("va-loan"),
  ],
  relatedArticles: [
    { slug: "blog/28-36-rule-mortgage", label: "The 28/36 rule: how much house you can afford" },
    { slug: "blog/how-to-calculate-mortgage-payment", label: "How to calculate your mortgage payment" },
    { slug: "blog/can-i-buy-a-house-with-640-credit-score", label: "Can I buy a house with a 640 credit score?" },
  ],

  faqs: [
    { q: "How much house can I afford on my income?", a: "A common guideline is that total housing costs stay under 28% of gross income (the 'front-end' ratio) and all debt payments under 36–43% (the 'back-end' ratio). This calculator works backward from those limits, given your income, debts, and down payment, to show a maximum price at three comfort levels." },
    { q: "What is debt-to-income (DTI) ratio?", a: "DTI is your total monthly debt payments — including the new mortgage — divided by your gross monthly income. Lenders use it to gauge how much you can handle. A back-end DTI at or below 36% is comfortable; many loans allow up to 43%, and some stretch to about 50% with strong credit and reserves." },
    { q: "Why show a range instead of one number?", a: "Because 'affordable' is a comfort choice, not a single fact. The conservative figure leaves breathing room for savings, emergencies, and lifestyle; the aggressive figure is near the lender's ceiling and leaves little slack. Seeing the range helps you buy where you're comfortable, not just where you qualify." },
    { q: "How does my down payment affect what I can afford?", a: "Your maximum price is the biggest loan your income supports plus your down payment. So every dollar of down payment adds a dollar to your price ceiling — and crossing 20% down removes PMI, lowering your monthly cost and letting the same payment support a slightly larger loan." },
    { q: "Does this include property taxes and insurance?", a: "This estimate is based on the payment your DTI supports and treats it as principal and interest. Real housing payments also include property tax, insurance, and any HOA — so leave a cushion, or reduce your target price, to keep the all-in payment within your comfort zone." },
    { q: "Should I borrow the maximum I qualify for?", a: "Usually not. Qualifying for a number and comfortably affording it are different. Lenders don't see your daycare, travel, or savings goals. Many buyers aim at the conservative end of this range so an unexpected expense or income dip doesn't put the home at risk." },
  ],

  teach: {
    whatIsIt:
      "A home affordability calculator works backward from your finances to a price. It takes your income and existing debts, applies debt-to-income limits, and figures out the largest monthly payment — and therefore the largest loan and price — those limits allow, then adds your down payment.\n\nBecause lenders allow a range of DTI (from a comfortable 36% up to about 50% in some cases), there isn't one 'affordable' price. This tool shows three, so you can see the spread between cautious and stretched.",
    whyItMatters:
      "Shopping without a real number leads to two bad outcomes: falling in love with homes you can't afford, or lowballing and missing what you could comfortably buy. A grounded range fixes both.\n\nIt also reframes the levers you actually control. Paying down a car loan or credit card before you buy can add tens of thousands to your price ceiling. A larger down payment does the same and can eliminate PMI. Seeing those effects in dollars turns vague advice into a plan you can act on before you ever tour a house.",
    whatToDoNext:
      "Enter your income, monthly debts, down payment, and a realistic rate, then read the affordability table. Decide where in the range you're comfortable — most people are happiest below the aggressive figure.\n\nIf the number is lower than you hoped, target your highest monthly debt payment to pay off first, or build a bigger down payment. Then confirm eligibility and loan-program fit with the mortgage qualifier, and plan the down payment itself with the down-payment calculator. Remember to leave room for taxes, insurance, and maintenance in your final budget.",
  },

  method: {
    label: "Back-end DTI method (36% / 43% / 50%) with the standard amortization formula; PMI estimated at 0.5%/yr below 20% down",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Plan the down payment for that price",
      body: "Found your number? Map out how much down payment you'll need — and how to reach 20% to skip PMI — with a savings timeline.",
      ctaLabel: "Open the down payment calculator",
      href: "/down-payment",
    },
  ],
};
