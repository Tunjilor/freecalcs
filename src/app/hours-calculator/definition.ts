// Hours Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money2, numFlex } from "@/lib/calculator/format";
import { computeHours, type HoursInputs, type HoursResults } from "./compute";

const defaults: HoursInputs = { start: "09:00", end: "17:30", breakMinutes: 30, rate: 0 };

export const hoursCalculatorDef: CalculatorDefinition<HoursInputs, HoursResults> = {
  slug: "hours-calculator",
  hub: "everyday",
  h1: "Hours Calculator",
  valueProp: "How many hours between two times, minus breaks, in hours and decimal.",
  title: "Hours Calculator: Time Between Two Times | freecalcs.io",
  metaDescription:
    "Free hours calculator: find the hours and minutes between a start and end time, minus breaks, including overnight shifts, in decimal hours with optional pay.",
  primaryKeyword: "Hours Calculator",
  secondaryKeywords: ["hour calculator", "work hours calculator", "how many hours between two times", "hours worked calculator", "time between times"],
  intro:
    "Counting hours across noon or midnight is where mental math goes wrong. This hours calculator finds the time between a start and end time, subtracts an unpaid break, handles overnight shifts, and gives the result in hours and minutes and in decimal hours for timesheets, with pay at your hourly rate.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "start", label: "Start time", type: "time", default: "09:00" },
    { name: "end", label: "End time", type: "time", default: "17:30", helpText: "An end time earlier than the start counts as the next day." },
    { name: "breakMinutes", label: "Unpaid break (minutes)", type: "number", default: 30, min: 0, max: 600, step: 5 },
    { name: "rate", label: "Hourly rate (optional)", type: "currency", default: 0 },
  ],

  compute: computeHours,

  results: [
    { key: "hoursLabel", label: "Hours worked", format: "text", variant: "primary", hint: "After the unpaid break." },
    { key: "decimal", label: "Decimal hours", format: "number", variant: "secondary" },
    { key: "hmmLabel", label: "As h:mm", format: "text", variant: "secondary" },
    { key: "pay", label: "Pay", format: "currency2", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Hours for a timesheet",
      columns: [
        { key: "quarter", label: "Method", format: "text", align: "left" },
        { key: "hours", label: "Hours", format: "number", align: "right" },
      ],
      rows: (r) => r.rows,
      note: "Many employers round to the nearest quarter hour: 1–7 minutes round down, 8–14 round up. Check your employer's policy.",
    },
  ],

  scenarios: [
    { id: "night", label: "Night shift 10 PM – 6:30 AM", patch: { start: "22:00", end: "06:30", breakMinutes: 30 } },
    { id: "twelve", label: "12-hour shift", patch: { start: "07:00", end: "19:00", breakMinutes: 60 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid && r.minutes > 0,
      say: (r, v) => `From ${r.spanLabel}${v.breakMinutes > 0 ? `, minus a ${v.breakMinutes}-minute break,` : ""} is ${r.hoursLabel}: ${numFlex(r.decimal)} hours in decimal.`,
    },
    {
      id: "pay",
      priority: 90,
      when: (r) => r.pay > 0,
      say: (r, v) => `At ${money2(v.rate)} an hour, that's ${money2(r.pay)} before taxes.`,
    },
    {
      id: "overnight",
      priority: 85,
      when: (r) => r.overnight,
      say: () => `The end time is earlier than the start, so it's counted as an overnight shift ending the next day.`,
    },
    {
      id: "long",
      priority: 80,
      tone: "warn",
      when: (r) => r.minutes > 10 * 60,
      say: () => `That's a long shift. Some states require meal breaks after 5 or 6 hours and daily overtime after 8 (California, for example).`,
    },
    {
      id: "decimal",
      priority: 65,
      when: (r) => r.valid && r.minutes > 0,
      say: () => `Decimal hours divide minutes by 60: 30 minutes = 0.5 h, 45 minutes = 0.75 h. Payroll multiplies decimal hours by your rate.`,
    },
    { id: "same", priority: 95, when: (r) => r.sameTime, say: () => `The start and end times are the same, so no time has passed. If this was a full 24-hour shift, that's 24 hours minus any break.` },
    { id: "break", priority: 95, tone: "warn", when: (r) => r.breakTooLong, say: () => `The break is as long as the whole shift, so no hours are left. Check the break length.` },
    { id: "invalid", priority: 95, when: (r) => !r.valid, say: () => `Pick a start time and an end time to see the hours.` },
  ],

  related: [relatedLink("time-card-calculator"), relatedLink("time-calculator"), relatedLink("hourly-to-salary"), relatedLink("paycheck"), relatedLink("salary")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate hours worked?", a: "Subtract the start time from the end time, then subtract unpaid breaks. 9:00 AM to 5:30 PM is 8 hours 30 minutes; minus a 30-minute lunch, that's 8 hours." },
    { q: "How do I calculate hours for an overnight shift?", a: "Count to midnight, then from midnight to the end time. 10:00 PM to 6:30 AM is 2 hours + 6.5 hours = 8.5 hours. The calculator does this automatically when the end is earlier than the start." },
    { q: "How do I convert hours and minutes to decimal?", a: "Divide the minutes by 60 and add to the hours. 7 hours 45 minutes = 7 + 45/60 = 7.75 hours." },
    { q: "Are breaks paid?", a: "Under U.S. federal law, short breaks (5–20 minutes) are paid, while meal breaks of 30 minutes or more can be unpaid if you're fully relieved of duty. Some states have stricter rules." },
    { q: "How many hours is 9 to 5?", a: "8 hours. With a 30-minute unpaid lunch, it's 7.5 hours of paid time." },
  ],

  teach: {
    heading: "How do you calculate hours between two times?",
    whatIsIt:
      "Hours worked is the time from clock-in to clock-out, less unpaid breaks. Because clocks reset at noon and midnight, it's easiest to convert both times to a 24-hour clock before subtracting.",
    whyItMatters:
      "Small errors add up across a pay period. Knowing your exact hours, and how your employer rounds them, lets you check your paycheck and spot missed time or overtime.",
    whatToDoNext:
      "Record start and end times each day. For a whole week with overtime, use the time card calculator, and see your take-home pay with the paycheck calculator.",
  },

  method: { label: "Hours = (end − start, +24 h if end < start) − unpaid break; decimal = minutes ÷ 60; quarter-hour rounding to nearest 15 minutes" },

  monetization: [
    { kind: "internal", headline: "Adding up a whole week?", body: "Total every shift, with overtime after 40 hours and your pay.", ctaLabel: "Open the time card calculator", href: "/time-card-calculator" },
  ],
};
