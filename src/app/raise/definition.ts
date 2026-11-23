// Raise (Salary Increase) Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, pct } from "@/lib/calculator/format";
import { computeRaise, type RaiseInputs, type RaiseResults } from "./compute";

const defaults: RaiseInputs = { currentSalary: 60000, raisePct: 4, raiseAmount: 0, inflation: 3, payPeriods: "26" };

export const raiseDef: CalculatorDefinition<RaiseInputs, RaiseResults> = {
  slug: "raise",
  hub: "tax",
  h1: "Raise Calculator",
  valueProp: "See your new salary after a raise, what it adds per paycheck, and whether it beats inflation.",
  title: "Raise Calculator: New Salary After a Raise | freecalcs.io",
  metaDescription:
    "Free raise calculator: your new salary from a percent or dollar raise, the increase per paycheck and per month, and your real raise after inflation.",
  primaryKeyword: "Raise Calculator",
  secondaryKeywords: ["salary increase calculator", "pay raise calculator", "percent raise calculator", "cost of living raise"],
  intro:
    "A 4% raise sounds good until you see it's about $90 a paycheck, and roughly 1% after inflation. This raise calculator shows your new salary from a percent or dollar raise, what it adds to each paycheck and each month, and your real raise after inflation.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "currentSalary", label: "Current salary", type: "currency", default: 60000 },
    { name: "raisePct", label: "Raise (%)", type: "percent", default: 4, step: 0.5 },
    { name: "raiseAmount", label: "Or raise ($ per year)", type: "currency", default: 0, helpText: "Overrides the percentage when above 0." },
    { name: "inflation", label: "Inflation", type: "percent", default: 3, step: 0.25 },
    {
      name: "payPeriods",
      label: "Pay frequency",
      type: "select",
      default: "26",
      options: [
        { label: "Monthly (12)", value: "12" },
        { label: "Twice a month (24)", value: "24" },
        { label: "Every two weeks (26)", value: "26" },
        { label: "Weekly (52)", value: "52" },
      ],
    },
  ],

  compute: computeRaise,

  results: [
    { key: "newSalary", label: "New salary", format: "currency", variant: "primary", hint: "Gross, before taxes." },
    { key: "raiseDollars", label: "Raise per year", format: "currency", variant: "secondary" },
    { key: "perPaycheck", label: "More per paycheck (gross)", format: "currency2", variant: "secondary" },
    { key: "perMonth", label: "More per month (gross)", format: "currency2", variant: "secondary" },
    { key: "realRaisePct", label: "Real raise after inflation", format: "percent", variant: "secondary" },
    { key: "newHourly", label: "New hourly equivalent", format: "currency2", variant: "secondary" },
  ],

  scenarios: [
    { id: "3", label: "3% raise", patch: { raisePct: 3, raiseAmount: 0 } },
    { id: "10", label: "10% raise", patch: { raisePct: 10, raiseAmount: 0 } },
    { id: "5k", label: "$5,000 raise", patch: { raiseAmount: 5000 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.raiseDollars > 0,
      say: (r) => `Your salary rises to ${money(r.newSalary)}, ${money(r.raiseDollars)} more a year: about ${money2(r.perPaycheck)} per paycheck before taxes.`,
    },
    {
      id: "real",
      priority: 90,
      when: (r) => r.raiseDollars > 0,
      say: (r, v) =>
        r.realRaisePct > 0.05
          ? `After ${pct(v.inflation, 1)} inflation, your real raise is ${pct(r.realRaisePct, 2)}: your buying power goes up.`
          : `After ${pct(v.inflation, 1)} inflation, your real raise is ${pct(r.realRaisePct, 2)}. To keep pace, you'd need ${money(r.inflationNeutralSalary)}.`,
    },
    {
      id: "take-home",
      priority: 70,
      when: (r) => r.raiseDollars > 0,
      say: () => `Taxes take a share of the raise: at a 22% federal bracket plus 7.65% for Social Security and Medicare, you keep roughly 70 cents of each extra dollar before state tax.`,
    },
    {
      id: "save-it",
      priority: 60,
      when: (r) => r.raiseDollars > 0,
      say: (r) => `Sending even half of your ${money(r.perMonth)} monthly increase to savings or your 401(k) before you get used to it is one of the easiest ways to build wealth.`,
    },
  ],

  related: [relatedLink("salary"), relatedLink("paycheck"), relatedLink("hourly-to-salary"), relatedLink("inflation"), relatedLink("budget")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate a raise?", a: "Multiply your current salary by the raise percentage and add it on. A 4% raise on $60,000 is $2,400, making your new salary $62,400." },
    { q: "How do I calculate a raise percentage?", a: "Divide the dollar increase by your old salary. Going from $60,000 to $63,000 is a $3,000 raise, and 3,000 ÷ 60,000 = 5%." },
    { q: "What is a real raise?", a: "Your raise after inflation. If you get 4% while prices rise 3%, your buying power grows by only about 1%." },
    { q: "What is a typical raise?", a: "Annual merit raises in the U.S. have commonly been around 3–4% in recent years. Promotions and job changes usually bring larger jumps." },
  ],

  teach: {
    heading: "How much is your raise really worth?",
    whatIsIt:
      "A raise increases your gross pay, either by a percentage or a set dollar amount. This calculator converts it into the figures that matter day to day: per paycheck, per month and after inflation.",
    whyItMatters:
      "Percentages hide the real effect. A raise that doesn't beat inflation is a pay cut in buying power, and the per-paycheck increase is smaller than many people expect once it's split across 26 paychecks and taxed.",
    whatToDoNext:
      "Enter your new salary in the salary calculator to see take-home pay after taxes. If you're negotiating, use the inflation figure as your floor: anything less means you're falling behind.",
  },

  method: { label: "New salary = salary × (1 + raise %) or salary + raise $; per paycheck = raise ÷ pay periods; real raise = (1 + raise) ÷ (1 + inflation) − 1; hourly = salary ÷ 2,080" },

  monetization: [
    { kind: "internal", headline: "See your new take-home pay", body: "Work out your paycheck after federal and state taxes, FICA and 401(k) in all 50 states.", ctaLabel: "Open the salary calculator", href: "/salary" },
  ],
};
