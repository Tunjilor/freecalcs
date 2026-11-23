// Car Affordability Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import {
  computeCarAffordability,
  type CarAffordabilityInputs,
  type CarAffordabilityResults,
} from "./compute";

const defaults: CarAffordabilityInputs = {
  annualIncome: 75000, monthlyBudget: 500, downPayment: 5000, rate: 7, termMonths: "60",
  salesTaxPct: 7, fees: 800, insuranceMonthly: 150, fuelMaintMonthly: 200,
};

export const carAffordabilityDef: CalculatorDefinition<CarAffordabilityInputs, CarAffordabilityResults> = {
  slug: "car-affordability",
  hub: "loans",
  h1: "Car Affordability Calculator",
  valueProp: "Find the car price your monthly budget really buys, and check it against the 20/4/10 rule.",
  title: "Car Affordability Calculator: How Much Car? | freecalcs.io",
  metaDescription:
    "Free car affordability calculator: turn a monthly budget into a car price after tax and fees, and check it against the 20/4/10 rule for your income.",
  primaryKeyword: "Car Affordability Calculator",
  secondaryKeywords: ["how much car can I afford", "20/4/10 rule", "car budget calculator", "car payment by income"],
  intro:
    "A monthly payment that looks comfortable can hide a car you can't really afford once insurance, fuel and a long loan are counted. This car affordability calculator turns your budget into a realistic price after sales tax and fees, then checks the result against the 20/4/10 rule: 20% down, a loan of four years or less, and total car costs under 10% of your income.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "annualIncome", label: "Gross annual income", type: "currency", default: 75000 },
    { name: "monthlyBudget", label: "Max car payment / month", type: "currency", default: 500 },
    { name: "downPayment", label: "Down payment + trade-in", type: "currency", default: 5000 },
    { name: "rate", label: "Loan APR", type: "percent", default: 7, step: 0.1 },
    {
      name: "termMonths",
      label: "Loan term",
      type: "select",
      default: "60",
      options: [
        { label: "36 months", value: "36" },
        { label: "48 months", value: "48" },
        { label: "60 months", value: "60" },
        { label: "72 months", value: "72" },
        { label: "84 months", value: "84" },
      ],
    },
    { name: "salesTaxPct", label: "Sales tax", type: "percent", default: 7, step: 0.05 },
    { name: "fees", label: "Title, registration & dealer fees", type: "currency", default: 800 },
    { name: "insuranceMonthly", label: "Insurance / month", type: "currency", default: 150 },
    { name: "fuelMaintMonthly", label: "Fuel & maintenance / month", type: "currency", default: 200 },
  ],

  compute: computeCarAffordability,

  results: [
    { key: "maxPrice", label: "Car price you can afford", format: "currency", variant: "primary", hint: "Sticker price before tax and fees." },
    { key: "maxLoan", label: "Loan amount", format: "currency", variant: "secondary" },
    { key: "totalInterest", label: "Total interest", format: "currency", variant: "secondary" },
    { key: "totalMonthlyCarCost", label: "Total car cost / month", format: "currency", variant: "secondary" },
    { key: "carCostPctIncome", label: "Car costs as % of income", format: "percent", variant: "secondary" },
    { key: "guidelinePrice", label: "Price under the 20/4/10 rule", format: "currency", variant: "secondary" },
  ],

  scenarios: [
    { id: "48", label: "48-month loan", patch: { termMonths: "48" } },
    { id: "72", label: "72-month loan", patch: { termMonths: "72" } },
    { id: "down", label: "$10k down", patch: { downPayment: 10000 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.maxPrice > 0,
      say: (r, v) =>
        `A ${money(v.monthlyBudget)} payment over ${v.termMonths} months supports a loan of about ${money(r.maxLoan)}. With your down payment, taxes and fees, that's a car priced around ${money(r.maxPrice)}.`,
    },
    {
      id: "over-10",
      priority: 92,
      tone: "warn",
      when: (r) => r.overBudgetVsGuideline,
      say: (r) =>
        `All-in, this car would cost ${money(r.totalMonthlyCarCost)} a month, ${pct(r.carCostPctIncome, 1)} of your gross income. The 20/4/10 rule caps that at 10% (${money(
          r.guidelineCarCostCap,
        )}), which points to a car around ${money(r.guidelinePrice)}.`,
    },
    {
      id: "within-10",
      priority: 92,
      tone: "success",
      when: (r) => !r.overBudgetVsGuideline && r.guidelineCarCostCap > 0 && r.maxPrice > 0,
      say: (r) => `Your total car costs come to ${pct(r.carCostPctIncome, 1)} of gross income, inside the 10% guideline.`,
    },
    {
      id: "long-term",
      priority: 88,
      tone: "warn",
      when: (r, v) => Number(v.termMonths) > 60,
      say: (r) =>
        `Loans longer than 60 months keep the payment low but cost ${money(r.totalInterest)} in interest here, and you'll likely owe more than the car is worth for years. A shorter loan on a cheaper car is usually the better deal.`,
    },
    {
      id: "down-low",
      priority: 80,
      when: (r) => r.maxPrice > 0 && r.downPctOfPrice < 20,
      say: (r) =>
        `Your down payment is ${pct(r.downPctOfPrice, 0)} of the price. Putting 20% down protects you from owing more than the car is worth as it depreciates in the first couple of years.`,
    },
  ],

  related: [relatedLink("auto-loan"), relatedLink("car-lease"), relatedLink("auto-insurance-estimator"), relatedLink("debt-to-income"), relatedLink("budget")],
  relatedArticles: [],

  faqs: [
    { q: "How much car can I afford?", a: "A common guideline is the 20/4/10 rule: put at least 20% down, finance for no more than four years, and keep total car costs (payment, insurance and fuel) under 10% of your gross monthly income. Many people stretch to 15%, but less is safer." },
    { q: "What is the 20/4/10 rule?", a: "20% down payment, a loan term of four years (48 months) or less, and total transportation costs under 10% of gross income. It keeps you from owing more than the car is worth and leaves room in your budget." },
    { q: "Should I count insurance and fuel?", a: "Yes. A car's monthly cost is much more than the loan payment. Insurance, fuel and maintenance often add $300 to $500 a month, which is why this calculator includes them." },
    { q: "Is a 72- or 84-month car loan a bad idea?", a: "Usually. Longer loans lower the payment but raise total interest, and cars lose value faster than you pay them down, leaving you 'upside down' if you need to sell or the car is totaled." },
    { q: "How does sales tax affect what I can afford?", a: "Sales tax and fees are usually financed or paid upfront along with the car, so they reduce the sticker price your budget covers. At 7% tax, a $30,000 car costs $32,100 before fees." },
  ],

  teach: {
    heading: "How much car can you afford?",
    whatIsIt:
      "Car affordability is the price of car your budget can support once everything is counted: the loan payment, sales tax and fees, insurance, fuel and maintenance. This calculator starts from the payment you're comfortable with and works back to a sticker price.",
    whyItMatters:
      "Dealers sell monthly payments, not prices. Stretching a loan to 72 or 84 months can make almost any car look affordable while adding thousands in interest and leaving you owing more than the car is worth for years.\n\nThe 20/4/10 rule is a simple check against that. If your total car costs stay under 10% of your income, there's room left for savings, housing and everything else.",
    whatToDoNext:
      "Get preapproved by a credit union or bank before you shop, so you know your real rate and can compare it with dealer financing. Negotiate the out-the-door price, not the payment. Then plug the final numbers into the auto loan calculator to see the exact payment and total interest.",
  },

  method: { label: "Loan = payment × (1 − (1 + r)^−n) ÷ r; price = (loan + down − fees) ÷ (1 + sales tax). 20/4/10 guideline: 20% down, ≤48 months, total car costs ≤10% of gross income" },

  monetization: [
    { kind: "internal", headline: "See your exact payment", body: "Found a car? Enter the price, trade-in and tax for the exact monthly payment and total interest.", ctaLabel: "Open the auto loan calculator", href: "/auto-loan" },
  ],
};
