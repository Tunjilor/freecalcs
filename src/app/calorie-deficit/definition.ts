// Calorie Deficit Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { months, num } from "@/lib/calculator/format";
import {
  computeCalorieDeficit,
  type CalorieDeficitInputs,
  type CalorieDeficitResults,
} from "./compute";

const defaults: CalorieDeficitInputs = {
  sex: "female", age: 35, heightIn: 65, weightLb: 180, activity: "light", goalWeightLb: 160, lbsPerWeek: "1",
};

const kcal = (n: number) => `${num(n)} calories`;

export const calorieDeficitDef: CalculatorDefinition<CalorieDeficitInputs, CalorieDeficitResults> = {
  slug: "calorie-deficit",
  hub: "health",
  h1: "Calorie Deficit Calculator",
  valueProp: "Find a daily calorie target to reach your goal weight at a safe, steady pace.",
  title: "Calorie Deficit Calculator for Weight Loss | freecalcs.io",
  metaDescription:
    "Free calorie deficit calculator: your maintenance calories (TDEE), a daily calorie target for steady weight loss, and roughly how many weeks to reach your goal.",
  primaryKeyword: "Calorie Deficit Calculator",
  secondaryKeywords: ["calories to lose weight", "weight loss calculator", "how many calories should I eat to lose weight", "calorie deficit for 1 lb a week"],
  intro:
    "Losing weight comes down to eating somewhat fewer calories than your body uses. This calorie deficit calculator estimates your maintenance calories with the Mifflin-St Jeor equation, sets a daily target for the pace you choose, and estimates how long reaching your goal could take. It keeps the pace and the target within commonly recommended limits.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "sex", label: "Sex", type: "select", default: "female", options: [{ label: "Female", value: "female" }, { label: "Male", value: "male" }] },
    { name: "age", label: "Age", type: "number", default: 35, min: 18, max: 90 },
    { name: "heightIn", label: "Height (inches)", type: "number", default: 65, min: 48, max: 90, helpText: "5 ft = 60 in, 5 ft 6 in = 66 in, 6 ft = 72 in." },
    { name: "weightLb", label: "Current weight (lb)", type: "number", default: 180, min: 70, max: 700 },
    {
      name: "activity",
      label: "Activity level",
      type: "select",
      default: "light",
      options: [
        { label: "Sedentary (desk job, little exercise)", value: "sedentary" },
        { label: "Light (exercise 1–3 days/week)", value: "light" },
        { label: "Moderate (3–5 days/week)", value: "moderate" },
        { label: "Active (6–7 days/week)", value: "active" },
        { label: "Very active (physical job + training)", value: "very" },
      ],
    },
    { name: "goalWeightLb", label: "Goal weight (lb)", type: "number", default: 160, min: 70, max: 700 },
    {
      name: "lbsPerWeek",
      label: "Pace",
      type: "select",
      default: "1",
      options: [
        { label: "Gentle: 0.5 lb/week", value: "0.5" },
        { label: "Steady: 1 lb/week", value: "1" },
        { label: "Faster: 1.5 lb/week", value: "1.5" },
        { label: "Aggressive: 2 lb/week", value: "2" },
      ],
    },
  ],

  compute: computeCalorieDeficit,

  results: [
    { key: "targetCalories", label: "Daily calorie target", format: "number", variant: "primary", hint: "Calories per day to lose weight at your pace." },
    { key: "tdee", label: "Maintenance calories (TDEE)", format: "number", variant: "secondary" },
    { key: "dailyDeficit", label: "Daily deficit", format: "number", variant: "secondary" },
    { key: "effectiveLbsPerWeek", label: "Expected loss (lb/week)", format: "number", variant: "secondary" },
    { key: "weeksToGoal", label: "Weeks to goal (estimate)", format: "number", variant: "secondary" },
    { key: "bmr", label: "Calories at rest (BMR)", format: "number", variant: "secondary" },
  ],

  chart: { kind: "line", title: "Projected weight", yFormat: "number", series: (r) => r.path },

  scenarios: [
    { id: "gentle", label: "0.5 lb/week", patch: { lbsPerWeek: "0.5" } },
    { id: "more-active", label: "Exercise more", patch: { activity: "moderate" } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.dailyDeficit > 0,
      say: (r) =>
        `Your body uses about ${kcal(r.tdee)} a day. Eating around ${kcal(r.targetCalories)} creates a ${num(
          r.dailyDeficit,
        )}-calorie daily deficit, which works out to roughly ${num(r.effectiveLbsPerWeek, 1)} lb a week.`,
    },
    {
      id: "time",
      priority: 90,
      when: (r) => r.weeksToGoal > 0,
      say: (r) =>
        `At that pace, losing ${num(r.lbsToLose)} lb would take about ${r.weeksToGoal} weeks (${months(
          Math.round(r.weeksToGoal / 4.345),
        )}). Real progress is rarely a straight line: water weight and plateaus are normal, and the estimate is a guide rather than a deadline.`,
    },
    {
      id: "floor",
      priority: 92,
      tone: "warn",
      when: (r) => r.hitFloor,
      say: (r) =>
        `Your chosen pace would put you below ${kcal(r.calorieFloor)} a day, a common minimum without medical supervision, so the target is held at that level and the pace slows to about ${num(
          r.effectiveLbsPerWeek,
          1,
        )} lb a week. Adding activity is a safer way to go faster.`,
    },
    {
      id: "capped",
      priority: 91,
      tone: "warn",
      when: (r) => r.rateCapped && !r.hitFloor,
      say: () =>
        `Losing more than about 1% of your body weight a week is generally too fast to sustain and makes muscle loss more likely, so the pace is capped there.`,
    },
    {
      id: "low-goal",
      priority: 93,
      tone: "warn",
      when: (r) => r.goalBelowHealthyBmi,
      say: (r) =>
        `Your goal weight would put your BMI at ${num(r.bmiGoal, 1)}, below the healthy range of 18.5–24.9. It's worth talking with a doctor about a goal that's right for you.`,
    },
    {
      id: "at-goal",
      priority: 94,
      tone: "success",
      when: (r) => r.lbsToLose === 0,
      say: (r) => `You're already at or below your goal weight. To maintain it, aim for around ${kcal(r.tdee)} a day.`,
    },
    {
      id: "protein",
      priority: 60,
      when: (r) => r.dailyDeficit > 0,
      say: () =>
        `Keeping protein up and doing some strength training while in a deficit helps you lose fat rather than muscle.`,
    },
  ],

  related: [relatedLink("tdee"), relatedLink("bmi"), relatedLink("body-fat"), relatedLink("age"), relatedLink("macro")],
  relatedArticles: [],

  faqs: [
    { q: "How big should my calorie deficit be?", a: "A deficit of about 500 calories a day is a common starting point and typically leads to about a pound a week. Larger deficits work faster but are harder to sustain and increase muscle loss." },
    { q: "Is 3,500 calories really one pound?", a: "It's a useful rule of thumb for planning, but real weight loss usually slows over time as your body adapts and your maintenance calories drop. Recalculate every 10 pounds or so." },
    { q: "What's the lowest I should eat?", a: "Common guidance is no fewer than about 1,200 calories a day for women and 1,500 for men without medical supervision. This calculator won't set a target below those levels." },
    { q: "Should I eat back exercise calories?", a: "Your activity level is already built into the target. If you pick a higher activity level, don't add exercise calories on top, or you'll double-count them." },
    { q: "Why isn't the scale moving?", a: "Day-to-day weight swings by several pounds from water, salt and digestion. Look at the weekly average. If it hasn't moved in three or four weeks, your maintenance calories may be lower than estimated." },
  ],

  teach: {
    heading: "What is a calorie deficit?",
    whatIsIt:
      "A calorie deficit means taking in fewer calories than your body burns. Your total daily energy expenditure, or TDEE, is the calories you burn at rest (BMR) plus activity. Eating below it makes your body draw on stored energy.",
    whyItMatters:
      "Knowing your maintenance calories turns weight loss from guesswork into a plan. A moderate deficit is easier to stick with, preserves more muscle and is more likely to keep the weight off than crash dieting.\n\nAll of these numbers are estimates. Formulas like Mifflin-St Jeor are accurate for most people within about 10%, so treat the target as a starting point and adjust based on your results over a few weeks.",
    whatToDoNext:
      "Track what you eat for a couple of weeks to see how close you are to the target. Weigh yourself a few times a week and compare weekly averages. If you have a health condition, are pregnant or have a history of disordered eating, check with a doctor or registered dietitian before starting.",
  },

  method: {
    label:
      "BMR by Mifflin-St Jeor (1990), × activity factor (1.2–1.9) = TDEE. Deficit = pace × 3,500 ÷ 7, with pace capped at 1% of body weight/week and a minimum of 1,200 (women) or 1,500 (men) calories per day",
  },

  monetization: [
    { kind: "internal", headline: "Check your maintenance calories in detail", body: "See your TDEE with macro splits and different formulas.", ctaLabel: "Open the TDEE calculator", href: "/tdee" },
  ],
};
