// Simple Interest Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, pct } from "@/lib/calculator/format";
import { computeSimpleInterest, type SimpleInterestInputs, type SimpleInterestResults } from "./compute";

const defaults: SimpleInterestInputs = { principal: 10000, rate: 5, years: 3 };

export const simpleInterestDef: CalculatorDefinition<SimpleInterestInputs, SimpleInterestResults> = {
  slug: "simple-interest",
  hub: "investing",
  h1: "Simple Interest Calculator",
  valueProp: "Calculate simple interest (I = P × r × t) and compare it with compound interest.",
  title: "Simple Interest Calculator (I = Prt) | freecalcs.io",
  metaDescription:
    "Free simple interest calculator: interest and total from principal, rate and time using I = P × r × t, compared side by side with compound interest.",
  primaryKeyword: "Simple Interest Calculator",
  secondaryKeywords: ["simple interest formula", "I = Prt", "simple vs compound interest", "interest calculator"],
  intro:
    "Simple interest is charged only on the original amount, never on interest already earned. This simple interest calculator applies the formula I = P × r × t to your principal, rate and time, and puts the result next to compound interest so you can see how much compounding adds.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "principal", label: "Principal", type: "currency", default: 10000 },
    { name: "rate", label: "Annual interest rate", type: "percent", default: 5, step: 0.05 },
    { name: "years", label: "Time (years)", type: "years", default: 3, min: 0, max: 50, step: 0.25, helpText: "Use decimals for partial years: 6 months = 0.5." },
  ],

  compute: computeSimpleInterest,

  results: [
    { key: "interest", label: "Simple interest", format: "currency2", variant: "primary", hint: "I = P × r × t" },
    { key: "total", label: "Total (principal + interest)", format: "currency2", variant: "secondary" },
    { key: "interestPerYear", label: "Interest per year", format: "currency2", variant: "secondary" },
    { key: "compoundAnnualTotal", label: "Total with annual compounding", format: "currency2", variant: "secondary" },
    { key: "compoundMonthlyTotal", label: "Total with monthly compounding", format: "currency2", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Simple vs compound (monthly) by year",
      columns: [
        { key: "year", label: "Year", format: "text", align: "left" },
        { key: "simple", label: "Simple", format: "currency2", align: "right" },
        { key: "compound", label: "Compound", format: "currency2", align: "right" },
      ],
      rows: (r) => r.rows,
    },
  ],

  scenarios: [
    { id: "6mo", label: "6 months", patch: { years: 0.5 } },
    { id: "10y", label: "10 years", patch: { years: 10 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.interest > 0,
      say: (r, v) =>
        `${money2(v.principal)} at ${pct(v.rate, 2)} simple interest earns ${money2(r.interestPerYear)} a year, ${money2(r.interest)} over ${v.years} year${v.years === 1 ? "" : "s"}, for a total of ${money2(r.total)}.`,
    },
    {
      id: "compound-gap",
      priority: 85,
      when: (r) => r.compoundingExtra > 1,
      say: (r) =>
        `With monthly compounding, the same money would grow to ${money2(r.compoundMonthlyTotal)}, ${money(r.compoundingExtra)} more. The gap widens the longer the money is left alone.`,
    },
    {
      id: "where",
      priority: 60,
      when: () => true,
      say: () => `Simple interest is common on short-term loans, some auto loans and Treasury bills. Savings accounts, CDs and credit cards almost always compound.`,
    },
  ],

  related: [relatedLink("compound-interest"), relatedLink("cd"), relatedLink("loan"), relatedLink("investment-return"), relatedLink("percentage")],
  relatedArticles: [{ slug: "blog/compound-interest-explained", label: "Compound interest explained" }],

  faqs: [
    { q: "What is the simple interest formula?", a: "I = P × r × t, where P is the principal, r is the annual interest rate as a decimal, and t is the time in years. $10,000 at 5% for 3 years earns 10,000 × 0.05 × 3 = $1,500." },
    { q: "What's the difference between simple and compound interest?", a: "Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus interest already earned, so it grows faster over time." },
    { q: "How do I calculate simple interest for months?", a: "Convert months to years by dividing by 12. Six months is 0.5 years, so $10,000 at 5% for 6 months earns 10,000 × 0.05 × 0.5 = $250." },
    { q: "Do car loans use simple interest?", a: "Many auto loans are 'simple interest loans', meaning interest accrues daily on the current balance. Payments are still amortized, so paying early or extra reduces the interest you owe." },
  ],

  teach: {
    heading: "What is simple interest?",
    whatIsIt:
      "Simple interest is interest paid only on the original amount borrowed or saved. It doesn't compound: the interest earned in year one doesn't earn any interest of its own in year two.",
    whyItMatters:
      "Simple interest is easy to calculate and predict, which is why it's used for short-term loans and some bonds. Over longer periods, though, compounding makes a real difference, and comparing the two shows how much.",
    whatToDoNext:
      "If you're saving, look for accounts that compound and compare them by APY. If you're borrowing, check whether the loan charges simple or compound interest, and use the compound interest calculator to plan longer-term savings.",
  },

  method: { label: "Simple interest I = P × r × t. Compound totals = P(1 + r)^t (annual) and P(1 + r/12)^(12t) (monthly)" },

  monetization: [
    { kind: "internal", headline: "See the power of compounding", body: "Add monthly contributions and watch your savings grow with compound interest.", ctaLabel: "Open the compound interest calculator", href: "/compound-interest" },
  ],
};
