// Decimal to Fraction Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { numFlex } from "@/lib/calculator/format";
import { computeDecimalToFraction, type DecimalToFractionInputs, type DecimalToFractionResults } from "./compute";

const defaults: DecimalToFractionInputs = { decimal: 0.375 };

export const decimalToFractionDef: CalculatorDefinition<DecimalToFractionInputs, DecimalToFractionResults> = {
  slug: "decimal-to-fraction",
  hub: "everyday",
  h1: "Decimal to Fraction Calculator",
  valueProp: "Convert any decimal to a simplified fraction or mixed number, with the steps.",
  title: "Decimal to Fraction Calculator (With Steps) | freecalcs.io",
  metaDescription:
    "Free decimal to fraction calculator: convert any decimal to a simplified fraction or mixed number, see each step, and get the nearest 1/16 for measurements.",
  primaryKeyword: "Decimal to Fraction Calculator",
  secondaryKeywords: ["decimal to fraction", "convert decimal to fraction", "decimal as a fraction", "decimal to inches fraction", "repeating decimal to fraction"],
  intro:
    "Any terminating decimal can be written as a fraction over 10, 100, 1,000 and so on, then reduced. This decimal to fraction calculator does that and shows each step, gives the mixed number, spots common repeating decimals like 0.333 → 1/3, and rounds to the nearest 1/16 inch for measuring.",
  commercialIntent: 1,

  defaults,
  inputs: [{ name: "decimal", label: "Decimal", type: "number", default: 0.375, step: 0.001, helpText: "Up to 10 decimal places. Negative numbers work too." }],

  compute: computeDecimalToFraction,

  results: [
    { key: "fractionLabel", label: "As a fraction", format: "text", variant: "primary", hint: "Exact, in lowest terms." },
    { key: "mixedLabel", label: "Mixed number", format: "text", variant: "secondary" },
    { key: "simpleLabel", label: "Closest simple fraction", format: "text", variant: "secondary" },
    { key: "sixteenthLabel", label: "Nearest 1/16 (inches)", format: "text", variant: "secondary" },
    { key: "percentLabel", label: "As a percent", format: "text", variant: "secondary" },
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

  reference: {
    heading: "Common decimals as fractions",
    body: "Handy conversions, including the inch fractions on a tape measure.",
    tables: [
      {
        title: "Decimal to fraction chart",
        columns: [
          { key: "decimal", label: "Decimal", format: "text", align: "left" },
          { key: "fraction", label: "Fraction", format: "text", align: "right" },
        ],
        rows: [
          { decimal: "0.0625", fraction: "1/16" },
          { decimal: "0.125", fraction: "1/8" },
          { decimal: "0.1875", fraction: "3/16" },
          { decimal: "0.2", fraction: "1/5" },
          { decimal: "0.25", fraction: "1/4" },
          { decimal: "0.3125", fraction: "5/16" },
          { decimal: "0.333…", fraction: "1/3" },
          { decimal: "0.375", fraction: "3/8" },
          { decimal: "0.4", fraction: "2/5" },
          { decimal: "0.5", fraction: "1/2" },
          { decimal: "0.625", fraction: "5/8" },
          { decimal: "0.666…", fraction: "2/3" },
          { decimal: "0.75", fraction: "3/4" },
          { decimal: "0.8", fraction: "4/5" },
          { decimal: "0.875", fraction: "7/8" },
          { decimal: "0.9375", fraction: "15/16" },
        ],
      },
    ],
  },

  scenarios: [
    { id: "third", label: "0.3333 (repeating)", patch: { decimal: 0.3333 } },
    { id: "inch", label: "2.6875 inches", patch: { decimal: 2.6875 } },
    { id: "pct", label: "0.45", patch: { decimal: 0.45 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid,
      say: (r, v) => `${numFlex(v.decimal, 10)} as a fraction is ${r.fractionLabel}${r.mixedLabel !== r.fractionLabel ? `, or ${r.mixedLabel} as a mixed number` : ""}.`,
    },
    {
      id: "repeating",
      priority: 90,
      when: (r) => r.valid && !r.isExactSimple && r.simpleError < 0.0006 && r.denominator > 100,
      say: (r) => `This looks like a rounded repeating decimal. If it is, the fraction you probably want is ${r.simpleLabel}.`,
    },
    {
      id: "inches",
      priority: 75,
      when: (r) => r.valid && r.denominator > 16,
      say: (r) => `For a tape measure, round to ${r.sixteenthLabel}, the nearest 1/16 inch.`,
    },
    {
      id: "how",
      priority: 65,
      when: (r) => r.valid && r.denominator > 1,
      say: (r) => `To check: ${r.numerator} ÷ ${r.denominator} = ${numFlex(r.numerator / r.denominator, 10)}.`,
    },
    { id: "invalid", priority: 95, when: (r) => !r.valid, say: () => `Enter a decimal between −1,000,000,000 and 1,000,000,000.` },
  ],

  related: [relatedLink("percentage"), relatedLink("percent-change"), relatedLink("scientific"), relatedLink("fraction-calculator"), relatedLink("discount")],
  relatedArticles: [],

  faqs: [
    { q: "How do you convert a decimal to a fraction?", a: "Count the decimal places, write the number without the point over 1 followed by that many zeros, then reduce. 0.375 has three places: 375/1000, and dividing both by 125 gives 3/8." },
    { q: "How do I convert a repeating decimal to a fraction?", a: "For one repeating digit, put it over 9: 0.333… = 3/9 = 1/3. For two, use 99: 0.272727… = 27/99 = 3/11. If you've rounded it, use the closest simple fraction result." },
    { q: "What is 0.625 as a fraction?", a: "0.625 = 625/1000 = 5/8." },
    { q: "How do I convert a decimal inch measurement to a fraction?", a: "Multiply the decimal part by 16 and round: 0.68 × 16 ≈ 11, so 2.68 in ≈ 2 11/16 in. The calculator's nearest 1/16 result does this for you." },
    { q: "What's a mixed number?", a: "A whole number plus a proper fraction, like 1 7/8. It equals the improper fraction 15/8." },
  ],

  teach: {
    heading: "How do you turn a decimal into a fraction?",
    whatIsIt:
      "A decimal is a fraction with a denominator that's a power of 10: tenths, hundredths, thousandths. Converting means writing that fraction out and reducing it to lowest terms.",
    whyItMatters:
      "Fractions are easier to read for recipes, measurements and homework, and some exact values like 1/3 can only be shown approximately as decimals.",
    whatToDoNext:
      "Reduce by the greatest common divisor so the fraction is in lowest terms. To go the other way, divide the numerator by the denominator.",
  },

  method: { label: "Fraction = decimal × 10^d ⁄ 10^d reduced by the GCD; closest simple fraction by continued fractions (denominator ≤ 100); nearest 1/16 by rounding" },
};
