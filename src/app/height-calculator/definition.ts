// Height Calculator (child's predicted adult height) definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { computeHeight, type HeightInputs, type HeightResults } from "./compute";

const defaults: HeightInputs = { sex: "boy", fatherIn: 70, motherIn: 64, earlyHeightIn: 0 };

const heightHelp = "In inches: 5 ft = 60, 5 ft 4 in = 64, 5 ft 10 in = 70, 6 ft = 72.";

export const heightCalculatorDef: CalculatorDefinition<HeightInputs, HeightResults> = {
  slug: "height-calculator",
  hub: "health",
  h1: "Height Calculator",
  valueProp: "Predict how tall your child will be as an adult, from both parents' heights.",
  title: "Height Calculator: How Tall Will My Child Be? | freecalcs.io",
  metaDescription:
    "Free height calculator: predict your child's adult height from both parents' heights using the mid-parental method, with a likely range and a second estimate.",
  primaryKeyword: "Height Calculator",
  secondaryKeywords: ["child height predictor", "how tall will my child be", "adult height calculator", "mid-parental height calculator", "height prediction calculator"],
  intro:
    "Height runs strongly in families. This height calculator predicts a child's adult height with the mid-parental method doctors use: the average of both parents' heights, adjusted for the child's sex. Add your child's height at age 2 (or 18 months for girls) for a second, independent estimate.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "sex", label: "Child", type: "select", default: "boy", options: [{ label: "Boy", value: "boy" }, { label: "Girl", value: "girl" }] },
    { name: "fatherIn", label: "Father's height (inches)", type: "number", default: 70, min: 48, max: 96, step: 0.5, helpText: heightHelp },
    { name: "motherIn", label: "Mother's height (inches)", type: "number", default: 64, min: 48, max: 96, step: 0.5 },
    {
      name: "earlyHeightIn",
      label: "Child's height at age 2 (boys) or 18 months (girls), optional",
      type: "number",
      default: 0,
      min: 0,
      max: 45,
      step: 0.25,
      helpText: "Leave at 0 to skip. Use the measurement from that well-child visit.",
    },
  ],

  compute: computeHeight,

  results: [
    { key: "predictedLabel", label: "Predicted adult height", format: "text", variant: "primary", hint: "Mid-parental height." },
    { key: "rangeLabel", label: "Likely range (about 95% of children)", format: "text", variant: "secondary" },
    { key: "doublingLabel", label: "Estimate from early height", format: "text", variant: "secondary" },
    { key: "averageLabel", label: "Average of both estimates", format: "text", variant: "secondary" },
  ],

  scenarios: [
    { id: "girl", label: "Same parents, a girl", patch: { sex: "girl" } },
    { id: "boy", label: "Same parents, a boy", patch: { sex: "boy" } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid,
      say: (r, v) => `Based on the parents' heights, your ${v.sex} is likely to reach about ${r.predictedLabel} as an adult, most likely between ${r.rangeLabel}.`,
    },
    {
      id: "agree",
      priority: 90,
      tone: "success",
      when: (r) => r.estimatesAgree,
      say: (r) => `The early-height estimate (${r.doublingLabel}) lands in the same range, which makes the prediction more reliable.`,
    },
    {
      id: "disagree",
      priority: 90,
      when: (r) => r.valid && r.doublingIn > 0 && !r.estimatesAgree,
      say: (r) => `The early-height estimate (${r.doublingLabel}) is outside the family range. That's common; the average of both, ${r.averageLabel}, is a reasonable middle guess.`,
    },
    {
      id: "why-range",
      priority: 75,
      when: (r) => r.valid,
      say: () => `Siblings with the same parents can differ by several inches. Nutrition, sleep, health and the timing of puberty all shift where a child ends up in the range.`,
    },
    {
      id: "doctor",
      priority: 65,
      when: (r) => r.valid,
      say: () => `Your pediatrician tracks growth on percentile charts at checkups. A child who drops or jumps across percentile lines is worth asking about, whatever the prediction says.`,
    },
    { id: "invalid", priority: 95, when: (r) => !r.valid, say: () => `Enter both parents' heights in inches (at least 48) to see the prediction.` },
  ],

  related: [relatedLink("bmi"), relatedLink("ideal-weight"), relatedLink("pregnancy-due-date"), relatedLink("age"), relatedLink("water-intake")],
  relatedArticles: [],

  faqs: [
    { q: "How accurate is a child height calculator?", a: "The mid-parental method puts about 95% of children within roughly 3.5 inches (8.5 cm) of the predicted height. It can't account for nutrition, health conditions or when puberty starts." },
    { q: "How do you calculate a child's adult height?", a: "Average the mother's and father's heights, then add 2.5 inches for a boy or subtract 2.5 inches for a girl. This is the mid-parental (target) height used by pediatricians." },
    { q: "Is it true you can double a child's height at age 2?", a: "Roughly. Doubling a boy's height at 24 months, or a girl's at 18 months, gives a quick estimate of adult height. It's less reliable than methods that use the parents' heights, so use it as a second opinion." },
    { q: "Can a child be taller than both parents?", a: "Yes. The prediction is an average; genes mix differently in each child, and better nutrition than the parents had growing up can add height." },
    { q: "When do children stop growing?", a: "Most girls reach adult height around 14–16 and most boys around 16–18, about two years after puberty begins." },
  ],

  teach: {
    heading: "How is a child's adult height predicted?",
    whatIsIt:
      "Predicted adult height estimates how tall a child will be once growth plates close. The mid-parental method uses the parents' heights, because genetics explains most of the variation in adult height.",
    whyItMatters:
      "Doctors compare a child's growth curve with their family target. A child growing well below or above that target may be checked for nutrition, hormone or other growth issues.",
    whatToDoNext:
      "Treat the result as a range, not a promise. Keep regular checkups so growth is tracked over time, and ask your pediatrician if your child's growth curve changes direction.",
  },

  method: { label: "Mid-parental height (Tanner): (father + mother) ÷ 2 ± 2.5 in by sex; range ±3.5 in; doubling estimate at 24 months (boys) / 18 months (girls)", year: 1970 },

  monetization: [
    { kind: "internal", headline: "Checking a healthy weight?", body: "See the healthy weight range for any height.", ctaLabel: "Open the ideal weight calculator", href: "/ideal-weight" },
  ],
};
