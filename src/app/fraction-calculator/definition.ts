// Fraction Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { computeFraction, type FractionInputs, type FractionResults } from "./compute";

const defaults: FractionInputs = { a: "2/3", op: "+", b: "3/4" };

const OP_WORD: Record<FractionInputs["op"], string> = { "+": "plus", "-": "minus", "*": "times", "/": "divided by" };

export const fractionCalculatorDef: CalculatorDefinition<FractionInputs, FractionResults> = {
  slug: "fraction-calculator",
  hub: "everyday",
  h1: "Fraction Calculator",
  valueProp: "Add, subtract, multiply and divide fractions and mixed numbers, with steps.",
  title: "Fraction Calculator: Add, Subtract & Simplify | freecalcs.io",
  metaDescription:
    "Free fraction calculator: add, subtract, multiply or divide fractions and mixed numbers, get the simplified answer, mixed number and decimal, with every step.",
  primaryKeyword: "Fraction Calculator",
  secondaryKeywords: ["adding fractions calculator", "mixed number calculator", "simplify fractions calculator", "dividing fractions calculator", "fractions calculator with steps"],
  intro:
    "Fractions need a common denominator to add or subtract, and a flip to divide. This fraction calculator handles all four operations with fractions, mixed numbers like 1 1/2, whole numbers and decimals, and shows the simplified answer, the mixed number, the decimal and each step of the work.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "a", label: "First fraction", type: "fraction", default: "2/3", helpText: "Fractions (3/4), mixed numbers (1 1/2), whole numbers or decimals." },
    {
      name: "op",
      label: "Operation",
      type: "select",
      default: "+",
      options: [
        { label: "+ Add", value: "+" },
        { label: "− Subtract", value: "-" },
        { label: "× Multiply", value: "*" },
        { label: "÷ Divide", value: "/" },
      ],
    },
    { name: "b", label: "Second fraction", type: "fraction", default: "3/4" },
  ],

  compute: computeFraction,

  results: [
    { key: "resultLabel", label: "Answer (simplified)", format: "text", variant: "primary", hint: "In lowest terms." },
    { key: "mixedLabel", label: "Mixed number", format: "text", variant: "secondary" },
    { key: "decimalLabel", label: "Decimal", format: "text", variant: "secondary" },
    { key: "percentLabel", label: "Percent", format: "text", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Step by step",
      columns: [
        { key: "step", label: "Step", format: "text", align: "left" },
        { key: "value", label: "Result", format: "text", align: "right" },
      ],
      rows: (r) => r.steps,
    },
  ],

  scenarios: [
    { id: "mixed", label: "1 1/2 − 3/4", patch: { a: "1 1/2", op: "-", b: "3/4" } },
    { id: "mul", label: "2/3 × 3/5", patch: { a: "2/3", op: "*", b: "3/5" } },
    { id: "div", label: "3/4 ÷ 1/8", patch: { a: "3/4", op: "/", b: "1/8" } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid,
      say: (r, v) =>
        `${r.aLabel} ${OP_WORD[v.op]} ${r.bLabel} equals ${r.resultLabel}${r.mixedLabel !== r.resultLabel ? ` (${r.mixedLabel} as a mixed number)` : ""}, or ${r.decimalLabel} as a decimal.`,
    },
    {
      id: "addsub",
      priority: 80,
      when: (r, v) => r.valid && (v.op === "+" || v.op === "-"),
      say: () => `To add or subtract fractions, rewrite them over the least common denominator first, then combine the numerators and keep the denominator.`,
    },
    {
      id: "div",
      priority: 80,
      when: (r, v) => r.valid && v.op === "/",
      say: () => `Dividing by a fraction is the same as multiplying by its reciprocal: keep, change, flip.`,
    },
    {
      id: "mul",
      priority: 80,
      when: (r, v) => r.valid && v.op === "*",
      say: () => `To multiply fractions, multiply straight across: numerator times numerator and denominator times denominator, then simplify.`,
    },
    { id: "bad-a", priority: 95, tone: "warn", when: (r) => r.error === "a", say: () => `Enter the first value as a fraction like 3/4, a mixed number like 1 1/2, or a whole number or decimal. Denominators can't be 0.` },
    { id: "bad-b", priority: 95, tone: "warn", when: (r) => r.error === "b", say: () => `Enter the second value as a fraction like 3/4, a mixed number like 1 1/2, or a whole number or decimal. Denominators can't be 0.` },
    { id: "divzero", priority: 95, tone: "warn", when: (r) => r.error === "divzero", say: () => `You can't divide by zero. Change the second value.` },
    { id: "range", priority: 95, tone: "warn", when: (r) => r.error === "range", say: () => `The answer is too large to show exactly. Try smaller numbers.` },
  ],

  related: [relatedLink("decimal-to-fraction"), relatedLink("percentage"), relatedLink("percent-change"), relatedLink("scientific"), relatedLink("gpa")],
  relatedArticles: [],

  faqs: [
    { q: "How do you add fractions with different denominators?", a: "Find the least common denominator, convert each fraction to it, then add the numerators. 2/3 + 3/4 = 8/12 + 9/12 = 17/12 = 1 5/12." },
    { q: "How do you divide fractions?", a: "Flip the second fraction and multiply. 3/4 ÷ 1/8 = 3/4 × 8/1 = 24/4 = 6." },
    { q: "How do I enter a mixed number?", a: "Type the whole number, a space, then the fraction: 1 1/2 or 2 3/4. A hyphen also works: 1-1/2. Negative numbers start with a minus sign." },
    { q: "How do you simplify a fraction?", a: "Divide the numerator and denominator by their greatest common divisor. 18/24: both divide by 6, giving 3/4." },
    { q: "How do I turn an improper fraction into a mixed number?", a: "Divide the numerator by the denominator. The quotient is the whole number and the remainder goes over the denominator: 17/12 = 1 remainder 5 = 1 5/12." },
  ],

  teach: {
    heading: "How do you add, subtract, multiply and divide fractions?",
    whatIsIt:
      "A fraction is a part of a whole: the numerator counts the parts and the denominator says how many make a whole. Adding and subtracting need matching denominators; multiplying and dividing don't.",
    whyItMatters:
      "Fractions show up in recipes, measurements, construction and homework. Exact fraction answers avoid the rounding errors you get by converting to decimals first.",
    whatToDoNext:
      "Check your work by converting the answer to a decimal and comparing it with the decimals of the original fractions. To convert a decimal back to a fraction, use the decimal to fraction calculator.",
  },

  method: { label: "Exact rational arithmetic on reduced integer fractions; + and − over the least common denominator; ÷ multiplies by the reciprocal; results reduced by the GCD" },
};
