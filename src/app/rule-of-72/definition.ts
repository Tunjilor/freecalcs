// Rule of 72 Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, num, pct } from "@/lib/calculator/format";
import { computeRuleOf72, type RuleOf72Inputs, type RuleOf72Results } from "./compute";

const defaults: RuleOf72Inputs = { rate: 7, targetYears: 10, amount: 10000, horizonYears: 30 };

export const ruleOf72Def: CalculatorDefinition<RuleOf72Inputs, RuleOf72Results> = {
  slug: "rule-of-72",
  hub: "investing",
  h1: "Rule of 72 Calculator",
  valueProp: "Find how many years it takes money to double, and the rate needed to double by a deadline.",
  title: "Rule of 72 Calculator: Years to Double Money | freecalcs.io",
  metaDescription:
    "Free Rule of 72 calculator: how long it takes your money to double at any rate, the exact answer for comparison, and the return needed to double in a set time.",
  primaryKeyword: "Rule of 72 Calculator",
  secondaryKeywords: ["rule of 72", "how long to double money", "doubling time calculator", "rule of 72 formula"],
  intro:
    "The Rule of 72 is a mental shortcut: divide 72 by your annual return to estimate how many years it takes to double your money. This Rule of 72 calculator gives the shortcut answer and the exact one, finds the rate you'd need to double in a set number of years, and shows how many times your money doubles over a longer horizon.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "rate", label: "Annual return", type: "percent", default: 7, step: 0.25 },
    { name: "targetYears", label: "Want to double in (years)", type: "years", default: 10, min: 1, max: 50 },
    { name: "amount", label: "Amount invested", type: "currency", default: 10000 },
    { name: "horizonYears", label: "Over how many years", type: "years", default: 30, min: 1, max: 60 },
  ],

  compute: computeRuleOf72,

  results: [
    { key: "yearsRule72", label: "Years to double (Rule of 72)", format: "number", variant: "primary", hint: "72 ÷ annual return." },
    { key: "yearsExact", label: "Exact years to double", format: "number", variant: "secondary" },
    { key: "rateToDoubleExact", label: "Return needed to double in your time", format: "percent", variant: "secondary" },
    { key: "doublingsInHorizon", label: "Doublings over your horizon", format: "number", variant: "secondary" },
    { key: "valueAtHorizon", label: "Value at the end", format: "currency", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Rule of 72 vs exact doubling time",
      columns: [
        { key: "rate", label: "Return", format: "text", align: "left" },
        { key: "rule72", label: "Rule of 72 (years)", format: "number", align: "right" },
        { key: "exact", label: "Exact (years)", format: "number", align: "right" },
      ],
      rows: (r) => r.rows,
    },
  ],

  scenarios: [
    { id: "10", label: "10% return", patch: { rate: 10 } },
    { id: "4", label: "4% return", patch: { rate: 4 } },
    { id: "card", label: "22% credit card APR", patch: { rate: 22 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.yearsRule72 > 0,
      say: (r, v) =>
        `At ${pct(v.rate, 2)}, money doubles in about ${num(r.yearsRule72, 1)} years by the Rule of 72 (exactly ${num(r.yearsExact, 1)}). Over ${v.horizonYears} years that's ${num(
          r.doublingsInHorizon,
          1,
        )} doublings, turning ${money(v.amount)} into about ${money(r.valueAtHorizon)}.`,
    },
    {
      id: "needed",
      priority: 85,
      when: (r) => r.rateToDoubleExact > 0,
      say: (r, v) => `To double your money in ${v.targetYears} years, you need about ${pct(r.rateToDoubleExact, 2)} a year (the shortcut says ${pct(r.rateToDoubleRule, 1)}).`,
    },
    {
      id: "debt",
      priority: 75,
      when: (r, v) => v.rate >= 15,
      say: (r) => `The rule works for debt too: an unpaid balance at this rate doubles in about ${num(r.yearsRule72, 1)} years.`,
    },
    {
      id: "accuracy",
      priority: 60,
      when: (r, v) => v.rate > 20 || (v.rate > 0 && v.rate < 2),
      say: () => `The Rule of 72 is most accurate between about 6% and 10%. At very low or very high rates, use the exact figure.`,
    },
  ],

  related: [relatedLink("compound-interest"), relatedLink("future-value"), relatedLink("investment-return"), relatedLink("inflation"), relatedLink("retirement")],
  relatedArticles: [{ slug: "blog/compound-interest-explained", label: "Compound interest explained" }],

  faqs: [
    { q: "What is the Rule of 72?", a: "A shortcut for estimating how long an investment takes to double: divide 72 by the annual percentage return. At 8%, 72 ÷ 8 = 9 years." },
    { q: "How accurate is the Rule of 72?", a: "Very close for rates between about 6% and 10%. The exact formula is ln(2) ÷ ln(1 + r). At 8%, the rule says 9 years and the exact answer is 9.01." },
    { q: "Can I use the Rule of 72 for inflation?", a: "Yes. At 3% inflation, prices double in about 24 years, which means a dollar loses half its buying power in that time." },
    { q: "What about the Rule of 70 or 69?", a: "They're variants. 69.3 is the most precise for continuous compounding; 70 is common for low rates like inflation or GDP growth; 72 is popular because it divides evenly by many numbers." },
  ],

  teach: {
    heading: "What is the Rule of 72?",
    whatIsIt:
      "The Rule of 72 estimates doubling time: years to double ≈ 72 ÷ annual rate. It works because of how compound growth behaves, and it's accurate enough for quick decisions without a calculator.",
    whyItMatters:
      "It makes compounding intuitive. At 7%, money doubles roughly every 10 years, so $10,000 invested at 25 grows to about $150,000 by 65, nearly four doublings. It also shows how quickly high-interest debt can grow if left alone.",
    whatToDoNext:
      "Use the rule to compare investments and set expectations, then get exact projections with the compound interest or future value calculators.",
  },

  method: { label: "Rule of 72: years ≈ 72 ÷ rate. Exact doubling time = ln 2 ÷ ln(1 + r). Rate to double in t years = 2^(1/t) − 1" },

  monetization: [
    { kind: "internal", headline: "Project your money precisely", body: "See exactly what your savings grow to with regular contributions.", ctaLabel: "Open the compound interest calculator", href: "/compound-interest" },
  ],
};
