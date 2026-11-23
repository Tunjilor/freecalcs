// 15 vs 30 Year Mortgage Calculator definition. Page content derives from this
// object plus the pure compute in ./compute.ts.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months, pct } from "@/lib/calculator/format";
import {
  computeFifteenThirty,
  type FifteenThirtyInputs,
  type FifteenThirtyResults,
} from "./compute";

const defaults: FifteenThirtyInputs = {
  loanAmount: 320000,
  rate15: 5.75,
  rate30: 6.375,
  investReturn: 7,
};

export const fifteenThirtyDef: CalculatorDefinition<FifteenThirtyInputs, FifteenThirtyResults> = {
  slug: "15-vs-30-year-mortgage",
  hub: "mortgage",
  h1: "15 vs 30 Year Mortgage Calculator",
  valueProp: "Compare payments, total interest, and whether investing the difference beats the shorter loan.",
  title: "15 vs 30 Year Mortgage Calculator | freecalcs.io",
  metaDescription:
    "Compare a 15-year and 30-year mortgage: monthly payments, total interest saved, and whether taking the 30-year and investing the difference comes out ahead.",
  primaryKeyword: "15 vs 30 Year Mortgage Calculator",
  secondaryKeywords: [
    "15 year vs 30 year mortgage",
    "15 year mortgage calculator",
    "30 year vs 15 year mortgage",
    "should I get a 15 year mortgage",
  ],
  intro:
    "A 15-year mortgage costs more each month but can save you well over $100,000 in interest compared with a 30-year loan. This 15 vs 30 year mortgage calculator puts both side by side at their own rates, then runs the test most comparisons skip: what happens if you take the 30-year loan and invest the monthly difference instead.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "loanAmount", label: "Loan amount", type: "currency", default: 320000 },
    {
      name: "rate15",
      label: "15-year rate",
      type: "percent",
      default: 5.75,
      step: 0.05,
      helpText: "15-year rates usually run about 0.5–0.75 points below 30-year rates.",
    },
    { name: "rate30", label: "30-year rate", type: "percent", default: 6.375, step: 0.05 },
    {
      name: "investReturn",
      label: "Return if you invest the difference",
      type: "percent",
      default: 7,
      step: 0.5,
      helpText: "Annual return before taxes. Stock returns vary widely year to year.",
    },
  ],

  compute: computeFifteenThirty,

  results: [
    {
      key: "interestSaved",
      label: "Interest saved with the 15-year",
      format: "currency",
      variant: "primary",
      hint: "Total interest over each loan's full term.",
    },
    { key: "payment15", label: "15-year monthly payment", format: "currency2", variant: "secondary" },
    { key: "payment30", label: "30-year monthly payment", format: "currency2", variant: "secondary" },
    { key: "paymentDifference", label: "Extra per month for the 15-year", format: "currency2", variant: "secondary" },
    { key: "interest15", label: "15-year total interest", format: "currency", variant: "secondary" },
    { key: "interest30", label: "30-year total interest", format: "currency", variant: "secondary" },
    { key: "investNetAtYear15", label: "30-year + investing, net at year 15", format: "currency", variant: "secondary" },
    { key: "breakEvenReturn", label: "Return needed to beat the 15-year", format: "percent", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Remaining balance by year",
      columns: [
        { key: "year", label: "Year", format: "text", align: "left" },
        { key: "b15", label: "15-year loan", format: "currency", align: "right" },
        { key: "b30", label: "30-year loan", format: "currency", align: "right" },
      ],
      rows: (r) =>
        [0, 5, 10, 15, 20, 25, 30].map((y) => ({
          year: `Year ${y}`,
          b15: r.series15[y]?.y ?? 0,
          b30: r.series30[y]?.y ?? 0,
        })),
    },
  ],

  scenarios: [
    { id: "same-rate", label: "Same rate for both", patch: { rate15: 6.375 } },
    { id: "big-gap", label: "1-point rate gap", patch: { rate15: 5.375 } },
    { id: "cautious", label: "Investing earns 5%", patch: { investReturn: 5 } },
    { id: "bullish", label: "Investing earns 9%", patch: { investReturn: 9 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.interestSaved > 0,
      say: (r) =>
        `The 15-year loan costs ${money(r.paymentDifference)} more a month but saves ${money(
          r.interestSaved,
        )} in interest — it ends with ${money(r.interest15)} paid in interest versus ${money(r.interest30)}.`,
    },
    {
      id: "rate-advantage",
      priority: 90,
      when: (r) => r.rateAdvantage > 1000,
      say: (r) =>
        `Even if you paid the 30-year loan at the 15-year payment, it would take ${months(
          r.thirtyAtFifteenPaymentMonths,
        )} and cost ${money(r.rateAdvantage)} more interest, because the 15-year's rate is ${r.rateGap.toFixed(2)} percentage points lower. That rate discount is the 15-year's real edge over prepaying.`,
    },
    {
      id: "invest-wins",
      priority: 85,
      when: (r) => !r.fifteenWinsAtYear15 && r.paymentDifference > 0,
      say: (r, v) =>
        `If you took the 30-year and invested the ${money(r.paymentDifference)} difference at ${pct(
          v.investReturn,
          1,
        )}, you'd be about ${money(r.investNetAtYear15)} ahead at year 15, after subtracting what you'd still owe. That only works if you actually invest it every month, and returns aren't guaranteed.`,
    },
    {
      id: "fifteen-wins",
      priority: 85,
      tone: "success",
      when: (r) => r.fifteenWinsAtYear15 && r.paymentDifference > 0,
      say: (r, v) =>
        `At a ${pct(v.investReturn, 1)} return, investing the difference doesn't keep up: at year 15 you'd still be about ${money(
          -r.investNetAtYear15,
        )} behind the 15-year borrower, who owns the home outright. Investing would need to earn about ${pct(
          r.breakEvenReturn,
          1,
        )} a year to tie.`,
    },
    {
      id: "flexibility",
      priority: 70,
      when: (r) => r.paymentDifference > 0,
      say: (r) =>
        `The 30-year keeps your required payment ${money(r.paymentDifference)} lower, which matters if your income dips. Many people take the 30-year and prepay voluntarily, keeping the option to stop if money gets tight.`,
    },
    {
      id: "same-rate-note",
      priority: 65,
      tone: "warn",
      when: (r) => r.rateGap <= 0,
      say: () =>
        `You've set the 15-year rate at or above the 30-year rate, which is unusual. Lenders almost always price 15-year loans lower, so get real quotes for both before deciding.`,
    },
  ],

  related: [
    relatedLink("mortgage"),
    relatedLink("mortgage-payoff"),
    relatedLink("refinance"),
    relatedLink("home-affordability"),
    relatedLink("compound-interest"),
    relatedLink("amortization"),
  ],
  relatedArticles: [
    { slug: "blog/15-year-vs-30-year-mortgage", label: "15-year vs 30-year mortgage: which is right for you?" },
    { slug: "blog/pay-off-mortgage-early", label: "Should you pay off your mortgage early?" },
  ],

  faqs: [
    {
      q: "Is a 15-year or 30-year mortgage better?",
      a: "A 15-year mortgage saves far more interest and builds equity faster, but its payment is much higher. A 30-year keeps the payment low and flexible. If the higher payment fits comfortably alongside retirement savings and an emergency fund, the 15-year usually wins on total cost.",
    },
    {
      q: "How much lower are 15-year mortgage rates?",
      a: "Typically about half a point to three-quarters of a point lower than 30-year rates, though the gap moves with the market. Ask lenders to quote both on the same day.",
    },
    {
      q: "Can I get a 30-year loan and pay it off in 15 years?",
      a: "Yes, by paying extra principal each month. You'll keep the flexibility of a lower required payment, but you'll pay the 30-year rate, so it costs more than an actual 15-year loan. This calculator shows that difference.",
    },
    {
      q: "Is it smarter to invest the difference?",
      a: "It can be, if you invest every month without fail and your investments earn more than the break-even return shown above. Over 15 years, stock returns have usually exceeded mortgage rates, but not always, and the 15-year's savings are guaranteed.",
    },
    {
      q: "Does a 15-year mortgage make it harder to qualify?",
      a: "Yes. The higher payment raises your debt-to-income ratio, so you may qualify for a smaller loan. Check your numbers with the debt-to-income calculator before you apply.",
    },
  ],

  teach: {
    whatIsIt:
      "The term of a mortgage is how long you take to repay it. A 15-year and a 30-year loan for the same amount differ in three ways: the 15-year has a higher monthly payment, a lower interest rate, and far less total interest because the balance shrinks twice as fast.\n\nThis calculator compares both at their own rates and adds a third option: the 30-year loan with the monthly difference invested, measured at the 15-year mark when the shorter loan would be paid off.",
    whyItMatters:
      "The total-interest gap is large. On a $320,000 loan at typical rates, the 30-year costs well over $150,000 more in interest. That's the money most comparisons focus on, and it's real.\n\nBut the 30-year's lower payment frees up cash. If that cash is invested and earns more than the break-even return, the 30-year borrower can come out ahead. If it isn't invested, or the market underperforms, the 15-year wins. The right answer depends on your discipline, your other goals and how much a lower required payment is worth to you.",
    whatToDoNext:
      "Check that the 15-year payment fits your budget with room to spare, after retirement savings and an emergency fund. Run it through the debt-to-income calculator, since lenders will. Then get same-day quotes for both terms from at least three lenders.\n\nIf you choose the 30-year for flexibility, set up an automatic extra principal payment or an automatic investment transfer the day you close, so the difference doesn't get absorbed into spending. The mortgage payoff calculator shows what different extra amounts do.",
  },

  method: {
    label:
      "Uses the standard amortization formula for both loans; the invest-the-difference test compounds the monthly payment gap at your chosen return for 15 years and subtracts the 30-year loan's remaining balance",
  },

  monetization: [
    {
      kind: "internal",
      headline: "Check how much house each term lets you afford",
      body: "A 15-year payment lowers the price you can qualify for. See the numbers for both terms.",
      ctaLabel: "Open the affordability calculator",
      href: "/home-affordability",
    },
  ],
};
