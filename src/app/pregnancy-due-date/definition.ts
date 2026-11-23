// Pregnancy Due Date Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computePregnancy, type PregnancyInputs, type PregnancyResults } from "./compute";

const defaults: PregnancyInputs = { lmpDate: "today-70", cycleLength: 28, asOfDate: "today" };

export const pregnancyDueDateDef: CalculatorDefinition<PregnancyInputs, PregnancyResults> = {
  slug: "pregnancy-due-date",
  hub: "health",
  h1: "Pregnancy Due Date Calculator",
  valueProp: "Estimate your due date, how far along you are and key pregnancy milestones.",
  title: "Pregnancy Due Date Calculator | freecalcs.io",
  metaDescription:
    "Free pregnancy due date calculator: your estimated due date from your last period and cycle length, how many weeks along you are, your trimester and key dates.",
  primaryKeyword: "Pregnancy Due Date Calculator",
  secondaryKeywords: ["due date calculator", "how far along am I", "pregnancy week calculator", "conception date calculator"],
  intro:
    "Most due dates are estimated from the first day of your last menstrual period. This pregnancy due date calculator uses that date and your usual cycle length to estimate your due date, how many weeks pregnant you are, your trimester and the dates of key milestones. Your provider may adjust the date after an early ultrasound.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "lmpDate", label: "First day of your last period", type: "date", default: "today-70" },
    { name: "cycleLength", label: "Usual cycle length (days)", type: "number", default: 28, min: 20, max: 45, helpText: "From the first day of one period to the first day of the next. 28 is average." },
    { name: "asOfDate", label: "As of", type: "date", default: "today", helpText: "Defaults to today." },
  ],

  compute: computePregnancy,

  results: [
    { key: "dueLabel", label: "Estimated due date", format: "text", variant: "primary", hint: "40 weeks from your cycle-adjusted last period." },
    { key: "gestationLabel", label: "How far along", format: "text", variant: "secondary" },
    { key: "trimester", label: "Trimester", format: "text", variant: "secondary" },
    { key: "daysToGo", label: "Days to go", format: "number", variant: "secondary" },
    { key: "conceptionLabel", label: "Estimated conception", format: "text", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Pregnancy milestones",
      columns: [
        { key: "milestone", label: "Milestone", format: "text", align: "left" },
        { key: "week", label: "Week", format: "text", align: "right" },
        { key: "date", label: "Date", format: "text", align: "right" },
      ],
      rows: (r) => r.milestones,
      note: "Anatomy scans are usually scheduled between 18 and 22 weeks; your provider will set exact appointments.",
    },
  ],

  scenarios: [
    { id: "6w", label: "Period 6 weeks ago", patch: { lmpDate: "today-42", asOfDate: "today" } },
    { id: "20w", label: "Period 20 weeks ago", patch: { lmpDate: "today-140", asOfDate: "today" } },
    { id: "long", label: "35-day cycle", patch: { cycleLength: 35 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid && !r.notPregnantYet && !r.pastDue,
      say: (r) => `Your estimated due date is ${r.dueLabel}. You're ${r.gestationLabel} along, in the ${r.trimester.toLowerCase()} trimester, with about ${num(r.daysToGo)} days to go.`,
    },
    {
      id: "range",
      priority: 85,
      when: (r) => r.valid && !r.notPregnantYet && !r.implausible,
      say: () => `Only about 1 in 20 babies arrives on the due date itself. Most births happen within two weeks either side of it.`,
    },
    {
      id: "past-due",
      priority: 95,
      tone: "warn",
      when: (r) => r.valid && r.pastDue && !r.implausible,
      say: (r) => `By these dates you're ${r.gestationLabel} along, past the estimated due date of ${r.dueLabel}. Stay in close touch with your provider about next steps.`,
    },
    {
      id: "check-date",
      priority: 96,
      tone: "warn",
      when: (r) => r.valid && r.implausible,
      say: () => `That date is more than 43 weeks before the 'as of' date, longer than a pregnancy lasts. Check the first day of your last period, which should be within the past 10 months.`,
    },
    { id: "invalid", priority: 95, when: (r) => !r.valid, say: () => `Enter the first day of your last period to see your due date.` },
    {
      id: "before",
      priority: 95,
      when: (r) => r.valid && r.notPregnantYet,
      say: (r) => `The 'as of' date is before your cycle-adjusted last period, so there's no gestational age yet. If you conceive this cycle, the estimated due date would be ${r.dueLabel}.`,
    },
    {
      id: "provider",
      priority: 60,
      when: () => true,
      say: () => `This is an estimate. If an early ultrasound measures differently, your provider may change your due date, and that date takes priority.`,
    },
  ],

  related: [relatedLink("days-until"), relatedLink("date-calculator"), relatedLink("water-intake"), relatedLink("budget")],
  relatedArticles: [],

  faqs: [
    { q: "How is a due date calculated?", a: "The standard method (Naegele's rule) adds 280 days, or 40 weeks, to the first day of your last menstrual period. If your cycle is longer or shorter than 28 days, the date is shifted by the difference." },
    { q: "Why does pregnancy count from my last period?", a: "Because the date of ovulation and conception usually isn't known exactly, while the start of the last period is. That's why at conception you're already considered about two weeks pregnant." },
    { q: "How accurate is the due date?", a: "It's an estimate. Only about 5% of babies are born on their due date; most arrive between 38 and 42 weeks. A first-trimester ultrasound is the most accurate way to date a pregnancy." },
    { q: "What if I don't know my last period date?", a: "Your provider can estimate your due date from an ultrasound, which measures the baby's size. Use that date if you have one." },
    { q: "What do the trimesters mean?", a: "The first trimester runs through 13 weeks and 6 days, the second from 14 weeks through 27 weeks and 6 days, and the third from 28 weeks until birth." },
  ],

  teach: {
    heading: "How is a pregnancy due date estimated?",
    whatIsIt:
      "A due date is an estimate of when you'll reach 40 weeks of pregnancy, counted from the first day of your last period. It's adjusted for cycles longer or shorter than 28 days, because ovulation happens later in longer cycles.",
    whyItMatters:
      "Your due date shapes the timing of prenatal tests, screenings and appointments, and helps you plan leave and preparations. Knowing how far along you are also helps you follow what's happening each week.",
    whatToDoNext:
      "Schedule a prenatal visit if you haven't already. Your provider will confirm your dates, often with an early ultrasound, and set the screening schedule. Use the milestone dates above as a rough guide until then.",
  },

  method: { label: "Naegele's rule with cycle adjustment: due date = LMP + 280 days + (cycle length − 28). Gestational age from the adjusted LMP; trimesters at 14w0d and 28w0d" },

  monetization: [
    { kind: "internal", headline: "Planning for a new arrival?", body: "Rework your monthly budget for the year ahead with the 50/30/20 rule.", ctaLabel: "Open the budget calculator", href: "/budget" },
  ],
};
