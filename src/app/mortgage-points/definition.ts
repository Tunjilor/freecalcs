// Mortgage Points Calculator definition. Page content derives from this object
// plus the pure compute in ./compute.ts.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months } from "@/lib/calculator/format";
import {
  computeMortgagePoints,
  type MortgagePointsInputs,
  type MortgagePointsResults,
} from "./compute";

const defaults: MortgagePointsInputs = {
  loanAmount: 350000,
  baseRate: 6.75,
  points: 1,
  reductionPerPoint: 0.25,
  termYears: 30,
  yearsKeep: 7,
};

export const mortgagePointsDef: CalculatorDefinition<MortgagePointsInputs, MortgagePointsResults> = {
  slug: "mortgage-points",
  hub: "mortgage",
  h1: "Mortgage Points Calculator",
  valueProp: "Find out if buying discount points pays off before you sell or refinance.",
  title: "Mortgage Points Calculator: Are Points Worth It? | freecalcs.io",
  metaDescription:
    "Free mortgage points calculator: what discount points cost, how much they lower your payment, your break-even point, and whether they pay off before you move.",
  primaryKeyword: "Mortgage Points Calculator",
  secondaryKeywords: [
    "discount points calculator",
    "are mortgage points worth it",
    "buy down rate calculator",
    "points break even",
  ],
  intro:
    "Discount points let you pay cash at closing for a lower interest rate. Whether that's a good deal depends almost entirely on how long you keep the loan. This mortgage points calculator shows what the points cost, how much they cut your payment, how many months it takes to break even, and your net gain or loss if you sell or refinance when you expect to.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "loanAmount", label: "Loan amount", type: "currency", default: 350000 },
    { name: "baseRate", label: "Rate with no points", type: "percent", default: 6.75, step: 0.05 },
    { name: "points", label: "Points to buy", type: "number", default: 1, step: 0.25, min: 0, max: 4 },
    {
      name: "reductionPerPoint",
      label: "Rate cut per point",
      type: "percent",
      default: 0.25,
      step: 0.025,
      helpText: "Commonly 0.25%, but it varies by lender. Use your Loan Estimate.",
    },
    { name: "termYears", label: "Loan term", type: "years", default: 30, min: 10, max: 30 },
    {
      name: "yearsKeep",
      label: "Years you'll keep the loan",
      type: "years",
      default: 7,
      min: 1,
      max: 30,
      helpText: "Until you expect to sell or refinance.",
    },
  ],

  compute: computeMortgagePoints,

  results: [
    {
      key: "netSavingsOverStay",
      label: "Net gain from points",
      format: "currency",
      variant: "primary",
      hint: "Over the years you keep the loan, after the cost of the points.",
    },
    { key: "pointsCost", label: "Cost of points", format: "currency", variant: "secondary" },
    { key: "newRate", label: "Rate with points", format: "percent", variant: "secondary" },
    { key: "monthlySaving", label: "Monthly saving", format: "currency2", variant: "secondary" },
    { key: "breakEvenMonths", label: "Break-even (months)", format: "number", variant: "secondary" },
    { key: "paymentWithPoints", label: "Payment with points", format: "currency2", variant: "secondary" },
    { key: "paymentNoPoints", label: "Payment without points", format: "currency2", variant: "secondary" },
    { key: "netSavingsFullTerm", label: "Net gain if you keep it to term", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "line",
    title: "Net gain by years you keep the loan",
    yFormat: "currency",
    series: (r) => r.rows.map((x) => ({ x: `Yr ${x.year}`, y: x.net })),
  },

  scenarios: [
    { id: "move3", label: "Move in 3 years", patch: { yearsKeep: 3 } },
    { id: "forever", label: "Keep 20 years", patch: { yearsKeep: 20 } },
    { id: "two", label: "Buy 2 points", patch: { points: 2 } },
    { id: "weak", label: "Only 0.125% per point", patch: { reductionPerPoint: 0.125 } },
  ],

  insights: [
    {
      id: "verdict-yes",
      priority: 95,
      tone: "success",
      when: (r) => r.worthIt && r.pointsCost > 0,
      say: (r, v) =>
        `Points pay off for you. They cost ${money(r.pointsCost)} and save ${money(
          r.monthlySaving,
        )} a month, so you break even after ${months(r.breakEvenMonths)}. Keeping the loan ${v.yearsKeep} years leaves you about ${money(
          r.netSavingsOverStay,
        )} ahead.`,
    },
    {
      id: "verdict-no",
      priority: 95,
      tone: "warn",
      when: (r) => !r.worthIt && r.pointsCost > 0 && r.monthlySaving > 0,
      say: (r, v) =>
        `Points don't pay off on your timeline. They take ${months(r.breakEvenMonths)} to earn back, and if you move or refinance after ${v.yearsKeep} years you'd be about ${money(
          -r.netSavingsOverStay,
        )} behind. Keep the cash instead.`,
    },
    {
      id: "refi-risk",
      priority: 85,
      when: (r) => r.breakEvenMonths > 48,
      say: () =>
        `A break-even beyond four years is a bet that rates won't fall enough for you to refinance. If they do, the points you paid are lost when the old loan is paid off.`,
    },
    {
      id: "cash-elsewhere",
      priority: 75,
      when: (r) => r.pointsCost > 0,
      say: (r) =>
        `Before buying points, make sure the ${money(
          r.pointsCost,
        )} isn't better used for a bigger down payment (which can remove PMI) or your emergency fund.`,
    },
    {
      id: "taxes",
      priority: 60,
      when: (r) => r.pointsCost > 0,
      say: () =>
        `Points paid on a purchase loan for your main home are generally tax-deductible in the year you pay them if you itemize. Ask a tax professional how that applies to you.`,
    },
  ],

  related: [
    relatedLink("mortgage"),
    relatedLink("closing-costs"),
    relatedLink("refinance"),
    relatedLink("amortization"),
    relatedLink("down-payment"),
  ],
  relatedArticles: [
    { slug: "blog/mortgage-refinance-requirements", label: "Refinance requirements in 2026" },
  ],

  faqs: [
    {
      q: "What are mortgage points?",
      a: "Discount points are an upfront fee paid to your lender at closing in exchange for a lower interest rate. One point costs 1% of the loan amount and typically lowers the rate by about 0.25%, though it varies by lender and market.",
    },
    {
      q: "Are mortgage points worth it?",
      a: "They're worth it if you keep the loan longer than the break-even period, usually five to seven years. If you're likely to sell or refinance sooner, you'll lose money on them.",
    },
    {
      q: "How do I calculate the break-even point?",
      a: "Divide the cost of the points by the monthly payment saving. For example, $3,500 of points saving $58 a month breaks even in about 61 months. This calculator also counts the slightly faster paydown from the lower rate.",
    },
    {
      q: "What's the difference between discount points and origination points?",
      a: "Discount points buy a lower rate. Origination points are a fee for processing the loan and don't lower your rate. Your Loan Estimate lists them separately.",
    },
    {
      q: "Can I buy points when I refinance?",
      a: "Yes. The same break-even logic applies, but points on a refinance are usually deducted over the life of the loan rather than all at once for tax purposes.",
    },
  ],

  teach: {
    heading: "What are mortgage points?",
    whatIsIt:
      "Mortgage points, or discount points, are prepaid interest. You pay a percentage of the loan at closing, and the lender gives you a lower rate for the life of the loan. One point equals 1% of the loan amount.",
    whyItMatters:
      "Points trade money now for savings later, so the question is always time. The monthly saving per point is modest, often $50 to $60 on a $350,000 loan, which is why break-even periods of five or more years are common.\n\nThe biggest risk is refinancing. If rates fall and you refinance in two years, the points are gone. That's why points tend to make the most sense when rates are already low and you plan to stay put.",
    whatToDoNext:
      "Ask each lender for quotes at zero points and with one point, so you can see their actual rate cut per point. Be realistic about how long you'll keep the loan, not just the house. Then compare the cost of points with putting the same cash toward your down payment.",
  },

  method: {
    label:
      "Net gain = monthly payment saving × months kept + difference in remaining balance at exit − cost of points. Break-even = cost ÷ monthly saving",
  },

  monetization: [
    {
      kind: "internal",
      headline: "See every cost due at closing",
      body: "Points are one line of your closing costs. Estimate the full cash you'll need to close.",
      ctaLabel: "Open the closing costs calculator",
      href: "/closing-costs",
    },
  ],
};
