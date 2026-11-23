// Running Pace Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computePace, type PaceInputs, type PaceResults } from "./compute";

const defaults: PaceInputs = { distance: 5, unit: "km", hours: 0, minutes: 28, seconds: 0 };

export const paceDef: CalculatorDefinition<PaceInputs, PaceResults> = {
  slug: "pace",
  hub: "health",
  h1: "Running Pace Calculator",
  valueProp: "Find your pace per mile and per kilometer, and predict your race times.",
  title: "Running Pace Calculator: Pace & Race Times | freecalcs.io",
  metaDescription:
    "Free running pace calculator: your pace per mile and per km and your speed from distance and time, plus predicted 5K, 10K, half marathon and marathon times.",
  primaryKeyword: "Running Pace Calculator",
  secondaryKeywords: ["pace calculator", "minutes per mile calculator", "race time predictor", "marathon pace calculator"],
  intro:
    "Enter a distance and the time it took, and this running pace calculator gives your pace per mile and per kilometer and your average speed. It also predicts your times at the 5K, 10K, half marathon and marathon distances using Riegel's formula, a long-standing race-prediction method.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "distance", label: "Distance", type: "number", default: 5, min: 0, step: 0.1 },
    { name: "unit", label: "Unit", type: "select", default: "km", options: [{ label: "Kilometers", value: "km" }, { label: "Miles", value: "mi" }] },
    { name: "hours", label: "Hours", type: "number", default: 0, min: 0, max: 24 },
    { name: "minutes", label: "Minutes", type: "number", default: 28, min: 0, max: 59 },
    { name: "seconds", label: "Seconds", type: "number", default: 0, min: 0, max: 59 },
  ],

  compute: computePace,

  results: [
    { key: "pacePerMile", label: "Pace per mile", format: "text", variant: "primary", hint: "Minutes:seconds per mile." },
    { key: "pacePerKm", label: "Pace per kilometer", format: "text", variant: "secondary" },
    { key: "speedMph", label: "Speed (mph)", format: "number", variant: "secondary" },
    { key: "speedKph", label: "Speed (km/h)", format: "number", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Predicted race times",
      columns: [
        { key: "race", label: "Race", format: "text", align: "left" },
        { key: "time", label: "Predicted time", format: "text", align: "right" },
      ],
      rows: (r) => r.predictions,
      note: "Riegel's formula assumes training suited to each distance; marathon predictions from short races are often optimistic.",
    },
  ],

  scenarios: [
    { id: "10k", label: "10K in 55:00", patch: { distance: 10, unit: "km", hours: 0, minutes: 55, seconds: 0 } },
    { id: "mile", label: "1 mile in 8:00", patch: { distance: 1, unit: "mi", hours: 0, minutes: 8, seconds: 0 } },
    { id: "half", label: "Half in 2:00:00", patch: { distance: 13.1, unit: "mi", hours: 2, minutes: 0, seconds: 0 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid,
      say: (r) => `You're running ${r.pacePerMile} (${r.pacePerKm}), an average speed of ${num(r.speedMph, 1)} mph.`,
    },
    {
      id: "predict",
      priority: 85,
      when: (r) => r.valid,
      say: (r) => `At an equivalent effort, you could expect about ${r.predictions[3].time} for a marathon and ${r.predictions[2].time} for a half, with training for those distances.`,
    },
    {
      id: "invalid",
      priority: 90,
      tone: "warn",
      when: (r) => !r.valid,
      say: () => `Enter a distance and a time above zero to see your pace.`,
    },
  ],

  related: [relatedLink("calorie-deficit"), relatedLink("tdee"), relatedLink("bmi"), relatedLink("macro")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate running pace?", a: "Divide your time by your distance. 30 minutes for 3 miles is 10 minutes per mile. To convert to per kilometer, multiply the per-mile pace by 0.621." },
    { q: "How accurate are race time predictions?", a: "Riegel's formula (T2 = T1 × (D2 ÷ D1)^1.06) works well between similar distances. Predicting a marathon from a 5K tends to be optimistic unless you've done marathon-specific training." },
    { q: "What is a good running pace?", a: "It depends on age, experience and distance. Many recreational runners run easy miles at 10–12 minutes per mile; easy runs should feel conversational." },
    { q: "How do I convert pace to speed?", a: "Divide 60 by your pace in minutes per mile to get miles per hour. A 10:00 mile is 6 mph." },
  ],

  teach: {
    heading: "What is running pace?",
    whatIsIt:
      "Pace is how long it takes you to cover a set distance, usually minutes per mile or per kilometer. It's the inverse of speed and the standard way runners measure effort and plan races.",
    whyItMatters:
      "Knowing your pace lets you train at the right intensity, set realistic race goals and spread your effort evenly. Starting a race too fast is one of the most common mistakes, and a target pace guards against it.",
    whatToDoNext:
      "Use a recent race or time trial for the most useful predictions. Pick a goal race, note the predicted time, and build up your training distance gradually before racing it.",
  },

  method: { label: "Pace = time ÷ distance; 1 km = 0.621371 mi. Race predictions by Riegel (1977): T2 = T1 × (D2 ÷ D1)^1.06" },

  monetization: [
    { kind: "internal", headline: "Fuel your training", body: "Find your daily calories and macros for training or weight loss.", ctaLabel: "Open the macro calculator", href: "/macro" },
  ],
};
