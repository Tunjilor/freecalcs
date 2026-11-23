// Water Intake Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computeWaterIntake, type WaterIntakeInputs, type WaterIntakeResults } from "./compute";

const defaults: WaterIntakeInputs = { sex: "female", weightLb: 150, exerciseMin: 30, hotClimate: "no" };

export const waterIntakeDef: CalculatorDefinition<WaterIntakeInputs, WaterIntakeResults> = {
  slug: "water-intake",
  hub: "health",
  h1: "Water Intake Calculator",
  valueProp: "Estimate how much water to drink each day, adjusted for exercise and hot weather.",
  title: "Water Intake Calculator: How Much Water a Day? | freecalcs.io",
  metaDescription:
    "Free water intake calculator: how much to drink each day based on National Academies guidance, adjusted for exercise and heat, in ounces, liters and cups.",
  primaryKeyword: "Water Intake Calculator",
  secondaryKeywords: ["how much water should I drink", "daily water intake", "hydration calculator", "water per day"],
  intro:
    "How much water you need depends on your body, activity and climate, but there are solid starting points. This water intake calculator begins with the National Academies' daily recommendations, adds water for exercise and hot weather, and shows the result in ounces, liters and cups.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "sex", label: "Sex", type: "select", default: "female", options: [{ label: "Female", value: "female" }, { label: "Male", value: "male" }] },
    { name: "weightLb", label: "Weight (lb)", type: "number", default: 150, min: 50, max: 700 },
    { name: "exerciseMin", label: "Exercise (minutes/day)", type: "number", default: 30, min: 0, max: 600 },
    { name: "hotClimate", label: "Hot or humid weather?", type: "select", default: "no", options: [{ label: "No", value: "no" }, { label: "Yes", value: "yes" }] },
  ],

  compute: computeWaterIntake,

  results: [
    { key: "drinkOz", label: "Water to drink per day (oz)", format: "number", variant: "primary", hint: "From drinks; food supplies the rest." },
    { key: "drinkLiters", label: "Liters per day", format: "number", variant: "secondary" },
    { key: "cups", label: "8-oz cups per day", format: "number", variant: "secondary" },
    { key: "exerciseOz", label: "Extra for exercise (oz)", format: "number", variant: "secondary" },
    { key: "halfWeightOz", label: "'Half your weight' rule (oz)", format: "number", variant: "secondary" },
  ],

  scenarios: [
    { id: "male", label: "Male", patch: { sex: "male", weightLb: 180 } },
    { id: "workout", label: "1-hour workout", patch: { exerciseMin: 60 } },
    { id: "hot", label: "Hot day", patch: { hotClimate: "yes" } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.drinkOz > 0,
      say: (r) => `Aim for about ${num(r.drinkOz)} ounces (${num(r.drinkLiters, 1)} liters, or ${num(r.cups, 1)} cups) from drinks a day.`,
    },
    {
      id: "total",
      priority: 85,
      when: () => true,
      say: (r) => `The National Academies' total daily water recommendation is about ${num(r.totalWaterLiters, 1)} liters, which includes the 20% or so that comes from food.`,
    },
    {
      id: "rule",
      priority: 70,
      when: (r) => r.halfWeightOz > 0,
      say: (r) => `The popular "half your body weight in ounces" rule would suggest ${num(r.halfWeightOz)} oz. It's a rough guide rather than an official standard.`,
    },
    {
      id: "safety",
      priority: 80,
      tone: "warn",
      when: () => true,
      say: () => `More isn't always better: drinking large amounts very quickly can be dangerous. If you have kidney, heart or liver conditions, or are pregnant or breastfeeding, ask your doctor what's right for you.`,
    },
  ],

  related: [relatedLink("calorie-deficit"), relatedLink("tdee"), relatedLink("macro"), relatedLink("pace"), relatedLink("bmi")],
  relatedArticles: [],

  faqs: [
    { q: "How much water should I drink a day?", a: "The National Academies of Sciences suggests about 3.7 liters of total water a day for men and 2.7 liters for women, from all drinks and food. Since food provides about 20%, that's roughly 3 liters (100 oz) and 2.2 liters (74 oz) from drinks." },
    { q: "Do other drinks count?", a: "Yes. Milk, juice, tea and coffee all count toward your fluid intake, as do water-rich foods like fruit, vegetables and soup." },
    { q: "How much extra water do I need when exercising?", a: "A common guideline is about 12 ounces for every 30 minutes of exercise, more in heat or if you sweat heavily." },
    { q: "How can I tell if I'm drinking enough?", a: "Thirst and urine color are good guides. Pale yellow urine generally means you're well hydrated." },
  ],

  teach: {
    heading: "How much water do you need each day?",
    whatIsIt:
      "Daily water needs are the total fluid your body loses through breathing, sweat and urine, which has to be replaced through drinks and food. Needs rise with exercise, heat, illness, pregnancy and breastfeeding.",
    whyItMatters:
      "Even mild dehydration can cause headaches, tiredness and reduced concentration. For most healthy people, drinking when thirsty and with meals is enough, but a target helps if you're active, in a hot climate or tend to forget.",
    whatToDoNext:
      "Spread your water through the day rather than drinking it all at once. Keep a refillable bottle with you and drink a glass with each meal. During long, hard exercise, an electrolyte drink can help.",
  },

  method: {
    label: "Baseline drinks ≈ 80% of the National Academies' adequate intake of total water (3.7 L men, 2.7 L women); +12 oz per 30 min exercise; +16 oz in hot weather",
  },

  monetization: [
    { kind: "internal", headline: "Planning your nutrition?", body: "Get daily protein, carb and fat targets for your goal.", ctaLabel: "Open the macro calculator", href: "/macro" },
  ],
};
