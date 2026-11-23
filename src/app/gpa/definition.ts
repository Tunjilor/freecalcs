// GPA Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computeGpa, GRADE_POINTS, type GpaInputs, type GpaResults } from "./compute";

const GRADE_OPTIONS = Object.keys(GRADE_POINTS).map((g) => ({ label: g, value: g }));

const defaults: GpaInputs = {
  courses: [
    { course: "Calculus", credits: 4, grade: "A" },
    { course: "English", credits: 3, grade: "B+" },
    { course: "Chemistry", credits: 4, grade: "B" },
    { course: "History", credits: 3, grade: "A-" },
  ],
  priorGpa: 0,
  priorCredits: 0,
};

export const gpaDef: CalculatorDefinition<GpaInputs, GpaResults> = {
  slug: "gpa",
  hub: "everyday",
  h1: "GPA Calculator",
  valueProp: "Calculate your semester and cumulative GPA on the standard 4.0 scale.",
  title: "GPA Calculator: Semester & Cumulative GPA | freecalcs.io",
  metaDescription:
    "Free GPA calculator: add your courses, credit hours and letter grades to get your semester GPA on a 4.0 scale, plus your cumulative GPA with past credits.",
  primaryKeyword: "GPA Calculator",
  secondaryKeywords: ["college GPA calculator", "cumulative GPA calculator", "semester GPA", "how to calculate GPA"],
  intro:
    "Your GPA is a credit-weighted average of your grades. This GPA calculator lets you add each course with its credit hours and letter grade, calculates your semester GPA on the standard 4.0 scale, and combines it with your previous GPA for an updated cumulative figure.",
  commercialIntent: 1,

  defaults,
  inputs: [
    {
      name: "courses",
      label: "Your courses",
      type: "rows",
      default: defaults.courses,
      columns: [
        { name: "course", label: "Course", type: "text", placeholder: "Course name", grow: 2 },
        { name: "credits", label: "Credits", type: "number", min: 0, max: 10, step: 0.5 },
        { name: "grade", label: "Grade", type: "select", options: GRADE_OPTIONS },
      ],
      minRows: 1,
      maxRows: 15,
      addLabel: "Add course",
      newRow: { course: "", credits: 3, grade: "A" },
    },
    { name: "priorGpa", label: "Previous cumulative GPA (optional)", type: "number", default: 0, min: 0, max: 4, step: 0.01 },
    { name: "priorCredits", label: "Previous credits earned (optional)", type: "number", default: 0, min: 0, step: 1 },
  ],

  compute: computeGpa,

  results: [
    { key: "termGpaLabel", label: "Semester GPA", format: "text", variant: "primary", hint: "4.0 scale, weighted by credits." },
    { key: "cumulativeGpaLabel", label: "Cumulative GPA", format: "text", variant: "secondary" },
    { key: "termCredits", label: "Semester credits", format: "number", variant: "secondary" },
    { key: "qualityPoints", label: "Quality points", format: "number", variant: "secondary" },
    { key: "totalCredits", label: "Total credits", format: "number", variant: "secondary" },
  ],

  reference: {
    heading: "4.0 GPA scale",
    body: "Standard U.S. grade points. Some schools count A+ as 4.3 or don't use minus grades; check your school's scale.",
    tables: [
      {
        title: "Letter grade to grade points",
        columns: [
          { key: "grade", label: "Grade", format: "text", align: "left" },
          { key: "points", label: "Points", format: "number", align: "right" },
        ],
        rows: Object.entries(GRADE_POINTS).map(([grade, points]) => ({ grade, points })),
      },
    ],
  },

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.termCredits > 0,
      say: (r) => `Across ${r.courseCount} course${r.courseCount === 1 ? "" : "s"} and ${num(r.termCredits, 1)} credits, your semester GPA is ${r.termGpa.toFixed(2)}.`,
    },
    {
      id: "cumulative",
      priority: 90,
      when: (r) => r.hasPrior && r.termCredits > 0,
      say: (r) => `Combined with your earlier credits, your cumulative GPA comes to ${r.cumulativeGpa.toFixed(2)} over ${num(r.totalCredits, 1)} credits.`,
    },
    {
      id: "prior-capped",
      priority: 92,
      tone: "warn",
      when: (r) => r.priorCapped,
      say: (_r, v) => `Your previous GPA of ${v.priorGpa} is above 4.0, so it's counted as 4.0. This calculator uses the unweighted 4.0 scale; if your school weights honors or AP classes, use your unweighted GPA here.`,
    },
    {
      id: "weight",
      priority: 70,
      when: (r) => r.courseCount > 1,
      say: () => `Courses with more credits count for more. Raising a grade in a 4-credit class moves your GPA more than the same change in a 1-credit class.`,
    },
    {
      id: "empty",
      priority: 95,
      tone: "warn",
      when: (r) => r.termCredits === 0,
      say: () => `Add at least one course with credits and a grade to see your GPA.`,
    },
  ],

  related: [relatedLink("weighted-grade"), relatedLink("final-grade"), relatedLink("percentage"), relatedLink("student-loan")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate my GPA?", a: "Multiply each course's grade points by its credit hours, add those up, and divide by the total credit hours. A 4-credit A (16 points) and a 3-credit B (9 points) give 25 ÷ 7 = 3.57." },
    { q: "How do I calculate cumulative GPA?", a: "Multiply your previous GPA by your previous credits to get past quality points, add this semester's quality points, and divide by all credits combined. Enter your previous GPA and credits above to do this automatically." },
    { q: "Is an A+ worth more than 4.0?", a: "At most U.S. colleges an A+ is capped at 4.0, which is what this calculator uses. Some schools award 4.3; check your registrar's policy." },
    { q: "Do pass/fail classes count?", a: "Usually not. Pass/fail and withdrawn courses typically earn credits but no grade points, so leave them out." },
  ],

  teach: {
    heading: "How is GPA calculated?",
    whatIsIt:
      "Grade point average converts letter grades into numbers (A = 4.0, B = 3.0 and so on) and averages them, weighting each course by its credit hours. Your semester GPA covers one term; your cumulative GPA covers everything so far.",
    whyItMatters:
      "GPA affects scholarships, honors, academic standing, graduate school applications and some job applications. Knowing exactly where you stand, and which classes move it most, helps you decide where to focus.",
    whatToDoNext:
      "Check your school's grade scale, since some use 4.3 for A+ or skip minus grades. To plan for the final exam in a specific class, use the final grade calculator.",
  },

  method: { label: "GPA = Σ(grade points × credits) ÷ Σ credits on the standard 4.0 scale (A+ = A = 4.0, A− = 3.7 … D− = 0.7, F = 0). Cumulative adds previous GPA × previous credits" },

  monetization: [
    { kind: "internal", headline: "Final exam coming up?", body: "Find the score you need on the final to get the course grade you want.", ctaLabel: "Open the final grade calculator", href: "/final-grade" },
  ],
};
