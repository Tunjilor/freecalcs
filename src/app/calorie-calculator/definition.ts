// Calorie Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computeCalories, type CalorieInputs, type CalorieResults } from "./compute";

const defaults: CalorieInputs = { sex: "female", age: 35, heightIn: 65, weightLb: 160, activity: "light" };

export const calorieCalculatorDef: CalculatorDefinition<CalorieInputs, CalorieResults> = {
  slug: "calorie-calculator",
  hub: "health",
  h1: "Calorie Calculator",
  valueProp: "How many calories you need a day to maintain, lose or gain weight.",
  title: "Calorie Calculator: Daily Calorie Needs | freecalcs.io",
  metaDescription:
    "Free calorie calculator: your daily maintenance calories plus targets to lose ½, 1 or 2 lb a week or gain weight, using the Mifflin-St Jeor equation.",
  primaryKeyword: "Calorie Calculator",
  secondaryKeywords: ["maintenance calorie calculator", "how many calories should I eat", "daily calorie calculator", "calories to lose weight", "calorie intake calculator"],
  intro:
    "How many calories you need depends on your body size, age, sex and how active you are. This calorie calculator estimates your maintenance calories with the Mifflin-St Jeor equation, then shows daily targets for losing or gaining weight at a steady pace.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "sex", label: "Sex", type: "select", default: "female", options: [{ label: "Female", value: "female" }, { label: "Male", value: "male" }] },
    { name: "age", label: "Age", type: "number", default: 35, min: 15, max: 100 },
    { name: "heightIn", label: "Height (inches)", type: "number", default: 65, min: 48, max: 90, helpText: "5 ft = 60 in, 5 ft 6 in = 66 in, 6 ft = 72 in." },
    { name: "weightLb", label: "Weight (lb)", type: "number", default: 160, min: 60, max: 700 },
    {
      name: "activity",
      label: "Activity level",
      type: "select",
      default: "light",
      options: [
        { label: "Sedentary (little or no exercise)", value: "sedentary" },
        { label: "Light (exercise 1–3 days/week)", value: "light" },
        { label: "Moderate (exercise 3–5 days/week)", value: "moderate" },
        { label: "Active (hard exercise 6–7 days/week)", value: "active" },
        { label: "Very active (physical job + training)", value: "very" },
      ],
    },
  ],

  compute: computeCalories,

  results: [
    { key: "maintenance", label: "Calories to maintain weight", format: "number", variant: "primary", hint: "Per day, rounded to the nearest 10." },
    { key: "loss", label: "To lose 1 lb a week", format: "number", variant: "secondary" },
    { key: "mildLoss", label: "To lose ½ lb a week", format: "number", variant: "secondary" },
    { key: "gain", label: "To gain 1 lb a week", format: "number", variant: "secondary" },
    { key: "bmr", label: "Calories at complete rest (BMR)", format: "number", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Daily calories for each goal",
      columns: [
        { key: "goal", label: "Goal", format: "text", align: "left" },
        { key: "perWeek", label: "Per week", format: "text", align: "right" },
        { key: "calories", label: "Calories/day", format: "number", align: "right" },
        { key: "pctOfMaintenance", label: "Of maintenance", format: "text", align: "right" },
      ],
      rows: (r) => r.rows,
      note: "Loss targets never go below 1,200 calories a day for women or 1,500 for men without medical supervision.",
    },
  ],

  scenarios: [
    { id: "sed", label: "Desk job, no exercise", patch: { activity: "sedentary" } },
    { id: "mod", label: "Exercise 3–5 days a week", patch: { activity: "moderate" } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid,
      say: (r) => `You burn about ${num(r.maintenance)} calories a day. Eating about ${num(r.loss)} a day would lose roughly 1 lb a week; ${num(r.mildLoss)} would lose about ½ lb.`,
    },
    {
      id: "floor",
      priority: 90,
      tone: "warn",
      when: (r) => r.extremeBelowFloor,
      say: (r) => `A 2-lb-a-week loss would take you below ${num(r.floor)} calories a day, so it's capped there. For you, ½ to 1 lb a week is the safer pace.`,
    },
    {
      id: "bmr",
      priority: 75,
      when: (r) => r.valid,
      say: (r) => `About ${num(r.bmr)} of those calories just keep your body running at rest (your BMR); the rest comes from movement and digestion.`,
    },
    {
      id: "adjust",
      priority: 70,
      when: (r) => r.valid,
      say: () => `Formulas are usually within about 10% for most people. Track your weight for 2–3 weeks at a target, then adjust by 100–200 calories if it isn't moving as expected.`,
    },
    { id: "invalid", priority: 95, when: (r) => !r.valid, say: () => `Enter your age, height and weight to see your daily calories.` },
  ],

  related: [relatedLink("calorie-deficit"), relatedLink("tdee"), relatedLink("macro"), relatedLink("ideal-weight"), relatedLink("bmi"), relatedLink("body-fat")],
  relatedArticles: [{ slug: "blog/what-is-tdee", label: "What is TDEE and how many calories should you eat?" }],

  faqs: [
    { q: "How many calories should I eat a day?", a: "Your maintenance calories, shown above, keep your weight steady. Eat about 500 fewer a day to lose roughly 1 lb a week, or 250 fewer for ½ lb. U.S. dietary guidelines put most adults between about 1,600 and 3,000 calories a day." },
    { q: "How is this calculated?", a: "It uses the Mifflin-St Jeor equation for your resting metabolic rate (BMR), multiplied by an activity factor from 1.2 (sedentary) to 1.9 (very active). It's considered the most accurate everyday formula for healthy adults." },
    { q: "What are maintenance calories?", a: "The calories you burn in a typical day, including rest, movement and digestion. Eating that amount keeps your weight about the same; it's the same idea as TDEE (total daily energy expenditure)." },
    { q: "Is it safe to eat 1,200 calories a day?", a: "1,200 for women and 1,500 for men are commonly cited minimums for unsupervised diets. Going lower makes it hard to get enough nutrients; talk to a doctor or dietitian first." },
    { q: "Which activity level should I pick?", a: "Most people overestimate. If you sit most of the day and work out a few times a week, choose Light. Pick Active only if you train hard almost every day or have a physical job." },
  ],

  teach: {
    heading: "How many calories do you need a day?",
    whatIsIt:
      "Your daily calorie needs are the energy your body uses at rest (basal metabolic rate) plus what you burn moving and digesting food. Together they're your maintenance calories.",
    whyItMatters:
      "Weight change comes down to the gap between what you eat and what you burn. Knowing your maintenance number lets you choose a deficit or surplus that changes your weight at a steady, sustainable pace.",
    whatToDoNext:
      "Pick a target from the table, track your intake for a few weeks and weigh yourself at the same time each week. To plan a goal weight and date, use the calorie deficit calculator.",
  },

  method: { label: "Mifflin-St Jeor BMR × activity factor (1.2–1.9); goal targets use ≈3,500 calories per pound; floors 1,200 (women) / 1,500 (men)", year: 1990 },

  monetization: [
    { kind: "internal", headline: "Have a goal weight in mind?", body: "See your daily calories and the date you'd reach your goal.", ctaLabel: "Open the calorie deficit calculator", href: "/calorie-deficit" },
  ],
};
