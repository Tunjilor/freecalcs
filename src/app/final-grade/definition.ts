// Final Grade Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { pct } from "@/lib/calculator/format";
import { computeFinalGrade, type FinalGradeInputs, type FinalGradeResults } from "./compute";

const defaults: FinalGradeInputs = { currentGrade: 88, finalWeight: 25, desiredGrade: 90 };

export const finalGradeDef: CalculatorDefinition<FinalGradeInputs, FinalGradeResults> = {
  slug: "final-grade",
  hub: "everyday",
  h1: "Final Grade Calculator",
  valueProp: "Find the score you need on your final exam to get the grade you want.",
  title: "Final Grade Calculator: What Do I Need? | freecalcs.io",
  metaDescription:
    "Free final grade calculator: the score you need on your final exam to reach your target course grade, plus what you need for an A, B, C or D.",
  primaryKeyword: "Final Grade Calculator",
  secondaryKeywords: ["final exam calculator", "what do I need on my final", "grade calculator", "final exam grade needed"],
  intro:
    "Going into a final, the question is simple: what do I need to get? This final grade calculator takes your current grade and how much the final counts, and tells you the score you need for your target grade, plus what it takes to earn an A, B, C or D.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "currentGrade", label: "Current grade (%)", type: "percent", default: 88, step: 0.1 },
    { name: "finalWeight", label: "Final exam weight (%)", type: "percent", default: 25, step: 1, helpText: "How much the final counts toward your course grade; see your syllabus." },
    { name: "desiredGrade", label: "Grade you want (%)", type: "percent", default: 90, step: 0.5 },
  ],

  compute: computeFinalGrade,

  results: [
    { key: "requiredScore", label: "Score needed on the final", format: "percent", variant: "primary", hint: "Out of 100%." },
    { key: "gradeIfPerfect", label: "Course grade with 100% on the final", format: "percent", variant: "secondary" },
    { key: "gradeIfZero", label: "Course grade if you skip the final", format: "percent", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Score needed for each letter grade",
      columns: [
        { key: "target", label: "Course grade", format: "text", align: "left" },
        { key: "needed", label: "Final exam score needed", format: "percent", align: "right" },
      ],
      rows: (r) => r.rows,
      note: "Scores above 100% mean that grade is out of reach; 0% or below means you've already secured it.",
    },
  ],

  scenarios: [
    { id: "b", label: "Aim for a B (80%)", patch: { desiredGrade: 80 } },
    { id: "heavy", label: "Final worth 40%", patch: { finalWeight: 40 } },
  ],

  insights: [
    {
      id: "possible",
      priority: 95,
      when: (r) => r.possible && !r.alreadySecured,
      say: (r, v) => `You need ${pct(r.requiredScore, 1)} on the final to finish with ${pct(v.desiredGrade, 0)}.`,
    },
    {
      id: "impossible",
      priority: 95,
      tone: "warn",
      when: (r, v) => !r.possible && v.finalWeight > 0,
      say: (r, v) =>
        `Even 100% on the final would bring you to ${pct(r.gradeIfPerfect, 1)}, short of ${pct(v.desiredGrade, 0)}. Ask your instructor about extra credit or regrade options.`,
    },
    {
      id: "secured",
      priority: 95,
      tone: "success",
      when: (r) => r.alreadySecured,
      say: (r, v) => `You've already secured ${pct(v.desiredGrade, 0)}: even a 0 on the final leaves you at ${pct(r.gradeIfZero, 1)}.`,
    },
    {
      id: "no-weight",
      priority: 90,
      when: (r, v) => v.finalWeight <= 0,
      say: () => `Enter how much the final counts toward your grade to see what you need.`,
    },
  ],

  related: [relatedLink("percentage"), relatedLink("age"), relatedLink("student-loan"), relatedLink("discount"), relatedLink("gpa"), relatedLink("weighted-grade")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate what I need on my final?", a: "Required score = (desired grade − current grade × (1 − final weight)) ÷ final weight. With 85% now, a final worth 25% and a 90% goal: (90 − 85 × 0.75) ÷ 0.25 = 105%, so a 90 isn't reachable." },
    { q: "What if my class uses points instead of percentages?", a: "Convert to percentages first: your current grade is points earned ÷ points possible so far, and the final's weight is its points ÷ total course points." },
    { q: "What if the result is over 100%?", a: "That target isn't reachable with the final alone. Check whether extra credit, dropped scores or curves apply in your class." },
    { q: "Does this work for weighted categories?", a: "Yes, as long as your current grade already reflects the category weights. Use your course portal's current percentage." },
  ],

  teach: {
    heading: "How is a final exam grade calculated?",
    whatIsIt:
      "Your course grade is a weighted average. If the final counts for 25%, everything else counts for 75%. The score you need on the final is whatever brings that weighted average up (or down) to your target.",
    whyItMatters:
      "Knowing the exact score you need helps you plan study time and set realistic expectations. Sometimes the target is comfortably in reach; sometimes the math says to focus on a different class.",
    whatToDoNext:
      "Double-check the final's weight in your syllabus and your current grade in the course portal. If the score you need is high, talk with your instructor early about review sessions or extra credit.",
  },

  method: { label: "Needed = (target − current × (1 − w)) ÷ w, where w is the final exam's weight as a fraction of the course grade" },

  monetization: [
    { kind: "internal", headline: "Planning for college costs?", body: "See your student loan payment and how extra payments speed up payoff.", ctaLabel: "Open the student loan calculator", href: "/student-loan" },
  ],
};
