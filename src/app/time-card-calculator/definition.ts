// Time Card Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money2, numFlex } from "@/lib/calculator/format";
import { computeTimeCard, type TimeCardInputs, type TimeCardResults } from "./compute";

const defaults: TimeCardInputs = {
  shifts: [
    { day: "Mon", in: "08:00", out: "17:00", break: 30 },
    { day: "Tue", in: "08:00", out: "17:30", break: 30 },
    { day: "Wed", in: "08:00", out: "17:00", break: 30 },
    { day: "Thu", in: "08:00", out: "18:00", break: 30 },
    { day: "Fri", in: "08:00", out: "16:00", break: 30 },
  ],
  rate: 20,
  otAfter: 40,
  otMultiplier: "1.5",
};

export const timeCardCalculatorDef: CalculatorDefinition<TimeCardInputs, TimeCardResults> = {
  slug: "time-card-calculator",
  hub: "tax",
  h1: "Time Card Calculator",
  valueProp: "Add up a week of shifts with breaks, overtime and gross pay.",
  title: "Time Card Calculator: Weekly Hours & Overtime | freecalcs.io",
  metaDescription:
    "Free time card calculator: enter clock-in and clock-out times and breaks for each day to total your weekly hours, overtime after 40 hours and gross pay.",
  primaryKeyword: "Time Card Calculator",
  secondaryKeywords: ["timesheet calculator", "weekly hours calculator", "time clock calculator", "overtime calculator", "work hours calculator"],
  intro:
    "A time card adds up every shift in a pay period. This time card calculator totals your hours from clock-in and clock-out times, subtracts unpaid breaks, handles overnight shifts, splits regular hours from overtime after 40 a week, and works out gross pay at your hourly rate.",
  commercialIntent: 3,

  defaults,
  inputs: [
    {
      name: "shifts",
      label: "Shifts",
      type: "rows",
      default: defaults.shifts,
      columns: [
        { name: "day", label: "Day", type: "text", placeholder: "Day", grow: 1.3 },
        { name: "in", label: "Clock in", type: "time", grow: 2.2 },
        { name: "out", label: "Clock out", type: "time", grow: 2.2 },
        { name: "break", label: "Break", type: "number", min: 0, step: 5, placeholder: "min", grow: 1.1 },
      ],
      minRows: 1,
      maxRows: 14,
      addLabel: "Add shift",
      newRow: { day: "", in: "08:00", out: "17:00", break: 30 },
      helpText: "Break is unpaid minutes. A clock-out earlier than clock-in counts as the next day.",
    },
    { name: "rate", label: "Hourly rate", type: "currency", default: 20 },
    { name: "otAfter", label: "Overtime after (hours per week)", type: "number", default: 40, min: 0, max: 168, helpText: "40 under federal law. Set 0 for no overtime." },
    { name: "otMultiplier", label: "Overtime rate", type: "select", default: "1.5", options: [{ label: "Time and a half (1.5×)", value: "1.5" }, { label: "Double time (2×)", value: "2" }] },
  ],

  compute: computeTimeCard,

  results: [
    { key: "totalLabel", label: "Total hours", format: "text", variant: "primary", hint: "All shifts, after breaks." },
    { key: "totalPay", label: "Gross pay", format: "currency2", variant: "secondary" },
    { key: "totalDecimal", label: "Decimal hours", format: "number", variant: "secondary" },
    { key: "regularHours", label: "Regular hours", format: "number", variant: "secondary" },
    { key: "overtimeHours", label: "Overtime hours", format: "number", variant: "secondary" },
    { key: "overtimePay", label: "Overtime pay", format: "currency2", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Hours by shift",
      columns: [
        { key: "day", label: "Day", format: "text", align: "left" },
        { key: "span", label: "Shift", format: "text", align: "right" },
        { key: "worked", label: "Worked", format: "text", align: "right" },
        { key: "decimal", label: "Decimal", format: "number", align: "right" },
      ],
      rows: (r) => r.rows,
    },
  ],

  scenarios: [
    { id: "double", label: "Double-time overtime", patch: { otMultiplier: "2" } },
    { id: "none", label: "No overtime (salaried)", patch: { otAfter: 0 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.totalMinutes > 0,
      say: (r) => `Your ${r.shiftCount} shift${r.shiftCount === 1 ? "" : "s"} add up to ${r.totalLabel} (${numFlex(r.totalDecimal)} decimal hours).`,
    },
    {
      id: "overtime",
      priority: 92,
      when: (r) => r.overtimeHours > 0,
      say: (r, v) =>
        `${numFlex(r.overtimeHours)} of those hours are overtime past ${v.otAfter}, paid at ${v.otMultiplier}× for ${money2(r.overtimePay)}, bringing gross pay to ${money2(r.totalPay)}.`,
    },
    {
      id: "pay",
      priority: 90,
      when: (r) => r.totalPay > 0 && r.overtimeHours === 0,
      say: (r, v) => `At ${money2(v.rate)} an hour, gross pay is ${money2(r.totalPay)} before taxes and deductions.`,
    },
    {
      id: "incomplete",
      priority: 93,
      tone: "warn",
      when: (r) => r.incomplete > 0,
      say: (r) => `${r.incomplete} shift${r.incomplete === 1 ? " is" : "s are"} missing a clock-in or clock-out time and ${r.incomplete === 1 ? "isn't" : "aren't"} counted.`,
    },
    {
      id: "flsa",
      priority: 65,
      when: (r) => r.totalMinutes > 0,
      say: () => `Federal overtime is based on hours per workweek, not per day; a few states (like California) also require daily overtime after 8 hours.`,
    },
    { id: "empty", priority: 95, when: (r) => r.totalMinutes === 0 && r.incomplete === 0, say: () => `Enter a clock-in and clock-out time for at least one shift.` },
  ],

  related: [relatedLink("hours-calculator"), relatedLink("paycheck"), relatedLink("hourly-to-salary"), relatedLink("time-calculator"), relatedLink("salary"), relatedLink("tax")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate my time card?", a: "For each day, subtract clock-in from clock-out and take off unpaid breaks. Add the days together, then multiply regular hours by your rate and overtime hours by 1.5× your rate." },
    { q: "When does overtime start?", a: "Under the federal Fair Labor Standards Act, non-exempt employees earn at least 1.5× their regular rate for hours over 40 in a workweek. Some states add daily overtime." },
    { q: "How do I convert minutes to decimal for a time card?", a: "Divide by 60. 15 minutes = 0.25, 30 = 0.5, 45 = 0.75. So 38 hours 45 minutes is 38.75 hours." },
    { q: "Does the calculator handle night shifts?", a: "Yes. If the clock-out time is earlier than the clock-in time, it's treated as the next morning, so 10 PM to 6 AM is 8 hours." },
    { q: "Is this my take-home pay?", a: "No, it's gross pay before taxes and deductions. Use the paycheck calculator to estimate take-home pay." },
  ],

  teach: {
    heading: "How do you calculate hours on a time card?",
    whatIsIt:
      "A time card records when you start and stop work each day. Total hours are the sum of each shift's time minus unpaid breaks, and pay is hours times your rate, with overtime paid at a higher rate.",
    whyItMatters:
      "Payroll mistakes are common, especially with overtime and overnight shifts. Adding up your own time card lets you confirm you were paid for every hour.",
    whatToDoNext:
      "Keep your own record of clock times and compare it with each pay stub. To see what you'll take home after taxes, run your gross pay through the paycheck calculator.",
  },

  method: { label: "Shift hours = (out − in, +24 h if out < in) − break; weekly overtime = hours over the threshold (FLSA: 40) × rate × multiplier" },

  monetization: [
    { kind: "internal", headline: "What will you take home?", body: "Estimate your paycheck after federal, state and FICA taxes.", ctaLabel: "Open the paycheck calculator", href: "/paycheck" },
  ],
};
