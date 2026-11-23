// Weighted Grade Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { pct } from "@/lib/calculator/format";
import { computeWeightedGrade, type WeightedGradeInputs, type WeightedGradeResults } from "./compute";

const defaults: WeightedGradeInputs = {
  items: [
    { item: "Homework", weight: 20, score: 95 },
    { item: "Quizzes", weight: 20, score: 85 },
    { item: "Midterm", weight: 25, score: 78 },
    { item: "Final exam", weight: 35, score: 88 },
  ],
};

export const weightedGradeDef: CalculatorDefinition<WeightedGradeInputs, WeightedGradeResults> = {
  slug: "weighted-grade",
  hub: "everyday",
  h1: "Weighted Grade Calculator",
  valueProp: "Find your course grade from weighted categories like homework, quizzes and exams.",
  title: "Weighted Grade Calculator | freecalcs.io",
  metaDescription:
    "Free weighted grade calculator: enter each category's weight and your score to get your overall course grade and letter, even before all grades are in.",
  primaryKeyword: "Weighted Grade Calculator",
  secondaryKeywords: ["grade calculator", "weighted average calculator", "class grade calculator", "course grade calculator"],
  intro:
    "Most classes weight categories differently: homework might be 20% and the final 35%. This weighted grade calculator multiplies each score by its weight to find your overall grade and letter, and works mid-semester too, averaging only the categories you've completed so far.",
  commercialIntent: 1,

  defaults,
  inputs: [
    {
      name: "items",
      label: "Categories or assignments",
      type: "rows",
      default: defaults.items,
      columns: [
        { name: "item", label: "Category", type: "text", placeholder: "e.g. Homework", grow: 2 },
        { name: "weight", label: "Weight", type: "percent", min: 0, max: 100, step: 1 },
        { name: "score", label: "Score", type: "percent", min: 0, max: 150, step: 0.5 },
      ],
      minRows: 1,
      maxRows: 20,
      addLabel: "Add category",
      newRow: { item: "", weight: 10, score: 90 },
    },
  ],

  compute: computeWeightedGrade,

  results: [
    { key: "grade", label: "Weighted grade", format: "percent", variant: "primary", hint: "Average weighted by each category's share." },
    { key: "letter", label: "Letter grade", format: "text", variant: "secondary" },
    { key: "totalWeight", label: "Weight entered", format: "percent", variant: "secondary" },
    { key: "remainingWeight", label: "Weight still to come", format: "percent", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "How each category contributes",
      columns: [
        { key: "item", label: "Category", format: "text", align: "left" },
        { key: "weight", label: "Weight", format: "percent", align: "right" },
        { key: "score", label: "Score", format: "percent", align: "right" },
        { key: "contribution", label: "Points", format: "number", align: "right" },
      ],
      rows: (r) => r.rows,
      note: "Points = weight × score ÷ 100. They add up to your grade when the weights total 100%.",
    },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.totalWeight > 0,
      say: (r) => `Your weighted grade is ${pct(r.grade, 1)}, ${/^[AF]/.test(r.letter) ? "an" : "a"} ${r.letter} on a standard scale.`,
    },
    {
      id: "partial",
      priority: 90,
      when: (r) => r.totalWeight > 0 && r.remainingWeight > 0.01,
      say: (r) =>
        `${r.ungradedCount > 0 ? `${r.ungradedCount} categor${r.ungradedCount === 1 ? "y has" : "ies have"} no score yet, so the` : "Your"} graded weights add up to ${pct(r.totalWeight, 0)}. This is your average on the work graded so far; the remaining ${pct(r.remainingWeight, 0)} can still change it.`,
    },
    {
      id: "over",
      priority: 92,
      tone: "warn",
      when: (r) => r.totalWeight > 100.01,
      say: (r) => `Your weights add up to ${pct(r.totalWeight, 0)}, more than 100%. Check your syllabus; the grade shown treats them proportionally.`,
    },
    {
      id: "empty",
      priority: 95,
      tone: "warn",
      when: (r) => r.totalWeight === 0,
      say: () => `Add at least one category with a weight above 0% and a score to see your grade.`,
    },
  ],

  related: [relatedLink("final-grade"), relatedLink("gpa"), relatedLink("percentage"), relatedLink("discount")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate a weighted grade?", a: "Multiply each category's score by its weight, add the results, and divide by the total weight. Homework 95% × 20% + Midterm 78% × 25% + … gives your overall grade." },
    { q: "What if my weights don't add up to 100%?", a: "Mid-semester, that's normal: the calculator divides by the weight entered so far, giving your current average. Once every category is in, the weights should total 100%." },
    { q: "What if a category isn't graded yet?", a: "Leave its score blank. The calculator leaves that weight out of your current grade and shows it as weight still to come. A score of 0 counts as a zero." },
    { q: "Can I enter individual assignments instead of categories?", a: "Yes, as long as each row's weight is that assignment's share of your final grade." },
    { q: "What letter grade scale is used?", a: "A common U.S. scale: 93+ A, 90 A−, 87 B+, 83 B, 80 B−, and so on down to below 60 for an F. Your instructor's scale may differ." },
  ],

  teach: {
    heading: "How are weighted grades calculated?",
    whatIsIt:
      "A weighted grade gives each part of a course a set share of the final grade. A 35% final exam counts more than seven times as much as a 5% quiz category, regardless of how many points each is out of.",
    whyItMatters:
      "Knowing the weights tells you where your effort pays off most. A small improvement in a heavily weighted category can move your grade more than acing a light one.",
    whatToDoNext:
      "Enter the weights from your syllabus and your current scores. To find what you need on the final, use the final grade calculator with your current grade from here.",
  },

  method: { label: "Weighted grade = Σ(score × weight) ÷ Σ weight over categories with weight > 0; letters by a common U.S. 10-point scale with +/−" },

  monetization: [
    { kind: "internal", headline: "What do you need on the final?", body: "Plug in your current grade and the final's weight to see the score you need.", ctaLabel: "Open the final grade calculator", href: "/final-grade" },
  ],
};
