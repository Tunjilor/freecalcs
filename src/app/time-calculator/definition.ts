// Time Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { numFlex } from "@/lib/calculator/format";
import { computeTimeCalc, type TimeCalcInputs, type TimeCalcResults } from "./compute";

const defaults: TimeCalcInputs = {
  items: [
    { op: "+", hours: 2, minutes: 45, seconds: 30 },
    { op: "+", hours: 3, minutes: 30, seconds: 0 },
    { op: "-", hours: 0, minutes: 28, seconds: 0 },
  ],
  startClock: "",
};

export const timeCalculatorDef: CalculatorDefinition<TimeCalcInputs, TimeCalcResults> = {
  slug: "time-calculator",
  hub: "everyday",
  h1: "Time Calculator",
  valueProp: "Add or subtract hours, minutes and seconds, or count forward from a clock time.",
  title: "Time Calculator: Add & Subtract Hours, Minutes | freecalcs.io",
  metaDescription:
    "Free time calculator: add and subtract hours, minutes and seconds, get the total in h:mm:ss and decimal hours, and find the clock time after a duration.",
  primaryKeyword: "Time Calculator",
  secondaryKeywords: ["add time calculator", "hours and minutes calculator", "time duration calculator", "subtract time calculator", "time addition calculator"],
  intro:
    "Adding up times is awkward because 60 minutes make an hour, not 100. This time calculator adds and subtracts any number of durations in hours, minutes and seconds, gives the total in h:mm:ss, words and decimal hours, and can add the total to a starting clock time.",
  commercialIntent: 1,

  defaults,
  inputs: [
    {
      name: "items",
      label: "Times to add or subtract",
      type: "rows",
      default: defaults.items,
      columns: [
        { name: "op", label: "Add or subtract", type: "select", options: [{ label: "+", value: "+" }, { label: "−", value: "-" }] },
        { name: "hours", label: "Hours", type: "number", min: 0, step: 1 },
        { name: "minutes", label: "Minutes", type: "number", min: 0, step: 1 },
        { name: "seconds", label: "Seconds", type: "number", min: 0, step: 1 },
      ],
      minRows: 1,
      maxRows: 30,
      addLabel: "Add time",
      newRow: { op: "+", hours: 1, minutes: 0, seconds: 0 },
      helpText: "Values over 60 are fine: 90 minutes counts as 1 hour 30 minutes.",
    },
    { name: "startClock", label: "Start from a clock time (optional)", type: "time", default: "", helpText: "Leave blank, or pick a time to see the clock time after the total." },
  ],

  compute: computeTimeCalc,

  results: [
    { key: "totalLabel", label: "Total time (h:mm:ss)", format: "text", variant: "primary", hint: "Sum of every row." },
    { key: "wordsLabel", label: "In words", format: "text", variant: "secondary" },
    { key: "decimalHours", label: "Decimal hours", format: "number", variant: "secondary" },
    { key: "totalMinutes", label: "Total minutes", format: "number", variant: "secondary" },
    { key: "endClockLabel", label: "Clock time after", format: "text", variant: "secondary" },
    { key: "daysLabel", label: "In days", format: "text", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Running total",
      columns: [
        { key: "item", label: "Row", format: "text", align: "left" },
        { key: "sign", label: "", format: "text", align: "left" },
        { key: "duration", label: "Time", format: "text", align: "right" },
        { key: "running", label: "Running total", format: "text", align: "right" },
      ],
      rows: (r) => r.rows,
    },
  ],

  scenarios: [
    { id: "start", label: "Start at 9:00 AM", patch: { startClock: "09:00" } },
    { id: "night", label: "Start at 10:30 PM", patch: { startClock: "22:30" } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.totalSeconds !== 0,
      say: (r) => `The total is ${r.totalLabel}: ${r.wordsLabel}, or ${numFlex(Math.abs(r.decimalHours), 4)} hours in decimal form.`,
    },
    {
      id: "clock",
      priority: 90,
      when: (r) => r.hasClock && r.totalSeconds !== 0,
      say: (r) =>
        `Starting from your clock time, you'd end at ${r.endClockLabel}${r.dayShift > 0 ? `, ${r.dayShift === 1 ? "the next day" : `${r.dayShift} days later`}` : r.dayShift < 0 ? `, ${r.dayShift === -1 ? "the day before" : `${-r.dayShift} days earlier`}` : ""}.`,
    },
    {
      id: "negative",
      priority: 85,
      tone: "warn",
      when: (r) => r.negative,
      say: () => `You've subtracted more time than you added, so the total is negative.`,
    },
    {
      id: "decimal",
      priority: 70,
      when: (r) => r.totalSeconds !== 0,
      say: () => `Timesheets and payroll often use decimal hours: divide minutes by 60, so 45 minutes is 0.75 hours, not 0.45.`,
    },
    { id: "empty", priority: 95, when: (r) => r.totalSeconds === 0, say: () => `Enter hours, minutes or seconds in at least one row to see the total.` },
  ],

  related: [relatedLink("hours-calculator"), relatedLink("time-card-calculator"), relatedLink("date-calculator"), relatedLink("pace"), relatedLink("hourly-to-salary")],
  relatedArticles: [],

  faqs: [
    { q: "How do you add hours and minutes?", a: "Add the hours and minutes separately, then convert every 60 minutes into an hour. 2:45 + 3:30 = 5 hours 75 minutes = 6 hours 15 minutes." },
    { q: "How do you subtract time?", a: "Subtract minutes from minutes and hours from hours. If the minutes go negative, borrow an hour as 60 minutes: 5:10 − 2:45 = 4:70 − 2:45 = 2:25." },
    { q: "How do I convert minutes to decimal hours?", a: "Divide by 60. 15 minutes = 0.25 h, 30 = 0.5 h, 45 = 0.75 h. So 7 hours 45 minutes is 7.75 hours." },
    { q: "What time will it be after a number of hours?", a: "Enter the duration and pick a starting clock time. The calculator shows the end time and whether it rolls over to the next day." },
    { q: "Can I add more than two times?", a: "Yes. Add as many rows as you need, each one added or subtracted, and the running total shows how the sum builds up." },
  ],

  teach: {
    heading: "How do you add and subtract time?",
    whatIsIt:
      "Time uses base 60: 60 seconds in a minute and 60 minutes in an hour. Adding or subtracting times means carrying or borrowing in 60s rather than 10s, which is why ordinary calculator math gives wrong answers.",
    whyItMatters:
      "Totals for workouts, video edits, travel legs, billable time and recipes all depend on getting the carries right, and payroll needs the result in decimal hours.",
    whatToDoNext:
      "For time worked between a start and end time, use the hours calculator. For a full week of shifts with overtime, use the time card calculator.",
  },

  method: { label: "Total = Σ(±(hours × 3600 + minutes × 60 + seconds)); shown as h:mm:ss and decimal hours (seconds ÷ 3600); clock time = start + total, wrapping at midnight" },

  monetization: [
    { kind: "internal", headline: "Tracking hours worked?", body: "Add up a week of shifts with breaks, overtime and pay.", ctaLabel: "Open the time card calculator", href: "/time-card-calculator" },
  ],
};
