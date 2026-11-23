// Ideal Weight Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computeIdealWeight, type IdealWeightInputs, type IdealWeightResults } from "./compute";

const defaults: IdealWeightInputs = { sex: "female", heightIn: 65, weightLb: 150 };

export const idealWeightDef: CalculatorDefinition<IdealWeightInputs, IdealWeightResults> = {
  slug: "ideal-weight",
  hub: "health",
  h1: "Ideal Weight Calculator",
  valueProp: "See your ideal body weight by four medical formulas and the healthy BMI range for your height.",
  title: "Ideal Weight Calculator: By Height | freecalcs.io",
  metaDescription:
    "Free ideal weight calculator: ideal body weight for your height and sex by the Devine, Robinson, Miller and Hamwi formulas, plus your healthy BMI weight range.",
  primaryKeyword: "Ideal Weight Calculator",
  secondaryKeywords: ["ideal body weight", "healthy weight for my height", "IBW calculator", "how much should I weigh"],
  intro:
    "There isn't one perfect weight for any height, but there are well-established estimates. This ideal weight calculator shows your ideal body weight by four formulas used in medicine, plus the weight range that corresponds to a healthy BMI for your height.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "sex", label: "Sex", type: "select", default: "female", options: [{ label: "Female", value: "female" }, { label: "Male", value: "male" }] },
    { name: "heightIn", label: "Height (inches)", type: "number", default: 65, min: 48, max: 90, helpText: "5 ft = 60 in, 5 ft 6 in = 66 in, 6 ft = 72 in." },
    { name: "weightLb", label: "Current weight (lb, optional)", type: "number", default: 150, min: 0, max: 700 },
  ],

  compute: computeIdealWeight,

  results: [
    { key: "average", label: "Ideal weight (average of formulas)", format: "number", variant: "primary", hint: "Pounds." },
    { key: "bmiLow", label: "Healthy BMI range: low (lb)", format: "number", variant: "secondary" },
    { key: "bmiHigh", label: "Healthy BMI range: high (lb)", format: "number", variant: "secondary" },
    { key: "currentBmi", label: "Your current BMI", format: "number", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Ideal weight by formula",
      columns: [
        { key: "formula", label: "Formula", format: "text", align: "left" },
        { key: "lb", label: "Pounds", format: "number", align: "right" },
      ],
      rows: (r) => r.rows,
    },
  ],

  scenarios: [
    { id: "male", label: "Male, 5'10\"", patch: { sex: "male", heightIn: 70, weightLb: 175 } },
    { id: "short", label: "Female, 5'2\"", patch: { sex: "female", heightIn: 62 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.average > 0,
      say: (r) =>
        `The four formulas put your ideal weight between ${num(Math.min(r.devine, r.robinson, r.miller, r.hamwi))} and ${num(
          Math.max(r.devine, r.robinson, r.miller, r.hamwi),
        )} lb. A healthy BMI for your height covers ${num(r.bmiLow)}–${num(r.bmiHigh)} lb.`,
    },
    {
      id: "in-range",
      priority: 90,
      tone: "success",
      when: (r) => r.inHealthyRange,
      say: (r) => `Your current weight puts your BMI at ${num(r.currentBmi, 1)}, inside the healthy range.`,
    },
    {
      id: "range-note",
      priority: 70,
      when: () => true,
      say: () => `These formulas don't account for muscle, frame size or age. A healthy weight is a range, and waist size and body fat percentage often say more about health risk.`,
    },
  ],

  related: [relatedLink("bmi"), relatedLink("body-fat"), relatedLink("calorie-deficit"), relatedLink("tdee"), relatedLink("macro")],
  relatedArticles: [{ slug: "blog/bmi-what-your-number-means", label: "BMI: what your number means" }],

  faqs: [
    { q: "What is ideal body weight?", a: "An estimate of a healthy weight for your height and sex. Formulas like Devine's were developed for medication dosing and are now widely used as general reference points." },
    { q: "Which ideal weight formula is most accurate?", a: "None is definitive. They give similar results for average heights and diverge at the extremes, which is why this calculator shows all four and the healthy BMI range." },
    { q: "What is a healthy weight range for my height?", a: "One common definition is the range that gives a BMI of 18.5 to 24.9. For someone 5 ft 5 in, that's roughly 111 to 149 pounds." },
    { q: "Should I aim for my ideal weight?", a: "Use it as one reference among several. Body composition, fitness, waist size and how you feel matter too. Talk with a doctor before setting a weight goal, especially if it's far from your current weight." },
  ],

  teach: {
    heading: "What is ideal body weight?",
    whatIsIt:
      "Ideal body weight (IBW) is a formula-based estimate of a healthy weight for a given height and sex. The Devine, Robinson, Miller and Hamwi formulas each start from a base weight at 5 feet and add a set amount per inch.",
    whyItMatters:
      "IBW gives a quick, consistent reference point, and clinicians still use it for some medication doses. But it ignores muscle and frame size, so two healthy people of the same height can sit well above and below it.",
    whatToDoNext:
      "Compare the results with your BMI and body fat percentage for a fuller picture. If you want to change your weight, the calorie deficit calculator can set a gradual, sustainable target.",
  },

  method: { label: "Devine (1974), Robinson (1983), Miller (1983) and Hamwi (1964) formulas in kg per inch over 5 ft, converted to lb; healthy range = BMI 18.5–24.9 × height² ÷ 703" },

  monetization: [
    { kind: "internal", headline: "Know your body fat percentage", body: "Estimate body fat with a tape measure using the U.S. Navy method.", ctaLabel: "Open the body fat calculator", href: "/body-fat" },
  ],
};
