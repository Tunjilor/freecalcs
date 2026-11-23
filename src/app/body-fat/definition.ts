// Body Fat Calculator (U.S. Navy method) definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num, pct } from "@/lib/calculator/format";
import { computeBodyFat, type BodyFatInputs, type BodyFatResults } from "./compute";

const defaults: BodyFatInputs = { sex: "male", heightIn: 70, weightLb: 180, neckIn: 15, waistIn: 35, hipIn: 0 };

export const bodyFatDef: CalculatorDefinition<BodyFatInputs, BodyFatResults> = {
  slug: "body-fat",
  hub: "health",
  h1: "Body Fat Calculator",
  valueProp: "Estimate your body fat percentage with a tape measure, using the U.S. Navy method.",
  title: "Body Fat Calculator (U.S. Navy Method) | freecalcs.io",
  metaDescription:
    "Free body fat calculator: estimate your body fat percentage from height, neck, waist and hip measurements using the U.S. Navy method, plus fat and lean mass.",
  primaryKeyword: "Body Fat Calculator",
  secondaryKeywords: ["body fat percentage calculator", "navy body fat calculator", "how to measure body fat", "lean body mass calculator"],
  intro:
    "BMI can't tell muscle from fat; body fat percentage can. This body fat calculator uses the U.S. Navy circumference method, which needs only a tape measure, to estimate your body fat percentage, your fat and lean mass, and where you fall in the American Council on Exercise categories.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "sex", label: "Sex", type: "select", default: "male", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
    { name: "heightIn", label: "Height (inches)", type: "number", default: 70, min: 48, max: 90 },
    { name: "weightLb", label: "Weight (lb)", type: "number", default: 180, min: 70, max: 700 },
    { name: "neckIn", label: "Neck (inches)", type: "number", default: 15, step: 0.25, helpText: "Just below the Adam's apple, tape sloping slightly down to the front." },
    { name: "waistIn", label: "Waist (inches)", type: "number", default: 35, step: 0.25, helpText: "Men: at the navel. Women: at the narrowest point. Relaxed, don't suck in." },
    { name: "hipIn", label: "Hips (inches, women)", type: "number", default: 0, step: 0.25, helpText: "Women only: around the widest part of the hips and buttocks." },
  ],

  compute: computeBodyFat,

  results: [
    { key: "bodyFatPct", label: "Body fat", format: "percent", variant: "primary", hint: "U.S. Navy circumference estimate." },
    { key: "category", label: "Category (ACE)", format: "text", variant: "secondary" },
    { key: "fatMassLb", label: "Fat mass (lb)", format: "number", variant: "secondary" },
    { key: "leanMassLb", label: "Lean mass (lb)", format: "number", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Body fat categories",
      columns: [
        { key: "category", label: "Category", format: "text", align: "left" },
        { key: "range", label: "Body fat", format: "text", align: "right" },
      ],
      rows: (r) => r.rows,
      note: "American Council on Exercise ranges for your sex.",
    },
  ],

  scenarios: [
    { id: "female", label: "Female example", patch: { sex: "female", heightIn: 65, weightLb: 150, neckIn: 13, waistIn: 30, hipIn: 40 } },
    { id: "waist-2", label: "Waist 2 in smaller", patch: { waistIn: 33 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid,
      say: (r) =>
        `Your estimated body fat is ${pct(r.bodyFatPct, 1)}, in the "${r.category}" range. That's about ${num(r.fatMassLb)} lb of fat and ${num(r.leanMassLb)} lb of lean mass.`,
    },
    {
      id: "invalid",
      priority: 95,
      tone: "warn",
      when: (r) => !r.valid,
      say: (r, v) =>
        v.sex === "female" && v.hipIn <= 0
          ? `The Navy formula for women needs a hip measurement. Enter it above to see your result.`
          : `Those measurements don't produce a valid estimate. Check that your waist is larger than your neck and all values are in inches.`,
    },
    {
      id: "accuracy",
      priority: 70,
      when: (r) => r.valid,
      say: () =>
        `The Navy method is typically within a few percentage points of lab methods like DEXA. Measure three times and use the average, at the same time of day, to track changes reliably.`,
    },
    {
      id: "waist",
      priority: 65,
      when: (r, v) => r.valid && ((v.sex === "male" && v.waistIn > 40) || (v.sex === "female" && v.waistIn > 35)),
      say: (r, v) =>
        `A waist over ${v.sex === "male" ? 40 : 35} inches is linked to higher risk of heart disease and type 2 diabetes, according to the CDC, regardless of overall weight.`,
    },
  ],

  related: [relatedLink("bmi"), relatedLink("tdee"), relatedLink("calorie-deficit"), relatedLink("age")],
  relatedArticles: [],

  faqs: [
    { q: "How accurate is the Navy body fat method?", a: "It's usually within about 3 to 4 percentage points of DEXA scans for most people, which makes it one of the best at-home methods. Accuracy depends heavily on careful, consistent measuring." },
    { q: "What is a healthy body fat percentage?", a: "The American Council on Exercise considers about 14–24% average to fit for men and 21–31% for women. Athletes are often lower; essential fat is about 2–5% for men and 10–13% for women." },
    { q: "Why do women need a hip measurement?", a: "Women naturally carry more fat around the hips, so the Navy equation for women includes hip circumference to estimate body fat more accurately." },
    { q: "Is body fat percentage better than BMI?", a: "It tells you more about body composition, because BMI only uses height and weight and can label muscular people as overweight. Both are screening tools rather than diagnoses." },
  ],

  teach: {
    heading: "What is body fat percentage?",
    whatIsIt:
      "Body fat percentage is the share of your total weight that is fat. The rest is lean mass: muscle, bone, organs and water. The U.S. Navy method estimates it from height and a few circumference measurements, using equations developed by researchers at the Naval Health Research Center.",
    whyItMatters:
      "Two people with the same height and weight can have very different health profiles depending on how much of that weight is fat. Body fat, and waist size in particular, track health risks more closely than weight alone.\n\nIt's also a better progress measure when you're exercising. The scale may barely move while you lose fat and gain muscle, but your body fat percentage will show it.",
    whatToDoNext:
      "Remeasure every two to four weeks under the same conditions. If you're working on fat loss, the calorie deficit calculator sets a daily target, and the TDEE calculator shows your maintenance calories.",
  },

  method: { label: "U.S. Navy circumference equations (Hodgdon & Beckett, Naval Health Research Center), inches; categories from the American Council on Exercise" },

  monetization: [
    { kind: "internal", headline: "Set a calorie target for fat loss", body: "Turn your goal into a daily calorie number and a realistic timeline.", ctaLabel: "Open the calorie deficit calculator", href: "/calorie-deficit" },
  ],
};
