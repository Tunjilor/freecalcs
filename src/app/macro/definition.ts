// Macro Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computeMacro, type MacroInputs, type MacroResults } from "./compute";

const defaults: MacroInputs = { sex: "female", age: 35, heightIn: 65, weightLb: 160, activity: "light", goal: "maintain", diet: "balanced" };

export const macroDef: CalculatorDefinition<MacroInputs, MacroResults> = {
  slug: "macro",
  hub: "health",
  h1: "Macro Calculator",
  valueProp: "Get daily protein, carb and fat targets in grams for your calories and goal.",
  title: "Macro Calculator: Protein, Carbs & Fat | freecalcs.io",
  metaDescription:
    "Free macro calculator: daily calories plus protein, carb and fat targets in grams for weight loss, maintenance or muscle gain, with three common splits.",
  primaryKeyword: "Macro Calculator",
  secondaryKeywords: ["macronutrient calculator", "how many macros should I eat", "protein carbs fat calculator", "IIFYM calculator"],
  intro:
    "Counting macros means hitting daily targets for protein, carbohydrates and fat rather than calories alone. This macro calculator estimates your calories with the Mifflin-St Jeor equation, adjusts them for your goal, and splits them into grams of each macronutrient using one of three common ratios.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "sex", label: "Sex", type: "select", default: "female", options: [{ label: "Female", value: "female" }, { label: "Male", value: "male" }] },
    { name: "age", label: "Age", type: "number", default: 35, min: 18, max: 90 },
    { name: "heightIn", label: "Height (inches)", type: "number", default: 65, min: 48, max: 90 },
    { name: "weightLb", label: "Weight (lb)", type: "number", default: 160, min: 70, max: 700 },
    {
      name: "activity",
      label: "Activity level",
      type: "select",
      default: "light",
      options: [
        { label: "Sedentary", value: "sedentary" },
        { label: "Light (1–3 days/week)", value: "light" },
        { label: "Moderate (3–5 days/week)", value: "moderate" },
        { label: "Active (6–7 days/week)", value: "active" },
        { label: "Very active", value: "very" },
      ],
    },
    {
      name: "goal",
      label: "Goal",
      type: "select",
      default: "maintain",
      options: [
        { label: "Lose weight (−500 cal)", value: "lose" },
        { label: "Maintain", value: "maintain" },
        { label: "Build muscle (+300 cal)", value: "gain" },
      ],
    },
    {
      name: "diet",
      label: "Macro split",
      type: "select",
      default: "balanced",
      options: [
        { label: "Balanced (30/40/30)", value: "balanced" },
        { label: "High protein (40/30/30)", value: "high-protein" },
        { label: "Lower carb (35/25/40)", value: "low-carb" },
      ],
    },
  ],

  compute: computeMacro,

  results: [
    { key: "calories", label: "Daily calories", format: "number", variant: "primary", hint: "Adjusted for your goal." },
    { key: "proteinG", label: "Protein (g)", format: "number", variant: "secondary" },
    { key: "carbsG", label: "Carbs (g)", format: "number", variant: "secondary" },
    { key: "fatG", label: "Fat (g)", format: "number", variant: "secondary" },
    { key: "tdee", label: "Maintenance calories", format: "number", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Your daily macros",
      columns: [
        { key: "macro", label: "Macro", format: "text", align: "left" },
        { key: "grams", label: "Grams", format: "number", align: "right" },
        { key: "calories", label: "Calories", format: "number", align: "right" },
        { key: "pct", label: "% of calories", format: "percent", align: "right" },
      ],
      rows: (r) => r.rows,
      note: "Protein and carbs have 4 calories per gram; fat has 9.",
    },
  ],

  scenarios: [
    { id: "lose", label: "Lose weight", patch: { goal: "lose" } },
    { id: "gain", label: "Build muscle", patch: { goal: "gain", diet: "high-protein" } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.calories > 0,
      say: (r) =>
        `Aim for about ${num(r.calories)} calories a day: ${num(r.proteinG)} g protein, ${num(r.carbsG)} g carbs and ${num(r.fatG)} g fat.`,
    },
    {
      id: "protein",
      priority: 88,
      when: (r) => r.proteinPerLb > 0,
      say: (r, v) =>
        `That's ${num(r.proteinPerLb, 2)} g of protein per pound of body weight.${
          v.goal !== "maintain" && r.proteinPerLb < 0.7
            ? " When losing fat or building muscle, many people aim for 0.7–1 g per pound; the high-protein split gets you closer."
            : ""
        }`,
    },
    {
      id: "floor",
      priority: 92,
      tone: "warn",
      when: (r) => r.hitFloor,
      say: () => `Your target is held at a common minimum calorie level. Eating less without medical supervision isn't recommended; adding activity is a safer way to lose weight faster.`,
    },
    {
      id: "adjust",
      priority: 60,
      when: () => true,
      say: () => `Treat these as starting points. Track your weight and energy for two to three weeks and adjust calories by about 100–200 a day if progress stalls.`,
    },
  ],

  related: [relatedLink("tdee"), relatedLink("calorie-deficit"), relatedLink("bmi"), relatedLink("body-fat")],
  relatedArticles: [{ slug: "blog/what-is-tdee", label: "What is TDEE and how many calories should you eat?" }],

  faqs: [
    { q: "How do I calculate my macros?", a: "Estimate your daily calories, choose a ratio of protein, carbs and fat, then convert each share to grams: divide protein and carb calories by 4 and fat calories by 9." },
    { q: "What is a good macro split?", a: "There's no single best split. A balanced 30% protein, 40% carbs and 30% fat works for most people. Higher protein helps preserve muscle while losing fat; lower carb suits people who feel better with more fat." },
    { q: "How much protein do I need?", a: "The RDA is 0.8 g per kilogram (about 0.36 g per pound) for sedentary adults. Active people and those losing fat or building muscle often aim for 0.7–1 g per pound." },
    { q: "Do I have to hit my macros exactly?", a: "No. Getting within about 5–10 grams of each target most days is plenty. Consistency over weeks matters far more than precision on any one day." },
    { q: "Should I count macros or calories?", a: "Calories determine weight change; macros affect body composition, fullness and energy. Counting macros includes calories automatically." },
  ],

  teach: {
    heading: "What are macros?",
    whatIsIt:
      "Macros, short for macronutrients, are the three nutrients that supply calories: protein, carbohydrates and fat. Counting macros means setting a daily gram target for each, which adds up to your calorie target.",
    whyItMatters:
      "Two diets with the same calories can feel very different. Enough protein helps you keep muscle while losing fat and keeps you full; carbs fuel exercise; fat supports hormones and nutrient absorption. Setting all three gives you more control than calories alone.",
    whatToDoNext:
      "Log your food in an app for a week to see where you are compared with these targets. Adjust gradually, prioritizing protein first. If you have a medical condition, are pregnant or have a history of disordered eating, talk with a doctor or registered dietitian before changing your diet.",
  },

  method: { label: "Calories = Mifflin-St Jeor BMR × activity factor ± goal adjustment (−500 / 0 / +300), minimum 1,200 (women) or 1,500 (men) when losing. Grams = calories × share ÷ 4 (protein, carbs) or ÷ 9 (fat)" },

  monetization: [
    { kind: "internal", headline: "Planning to lose weight?", body: "See a daily calorie target and a realistic timeline to your goal weight.", ctaLabel: "Open the calorie deficit calculator", href: "/calorie-deficit" },
  ],
};
