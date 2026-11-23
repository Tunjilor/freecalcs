// Date Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computeDateCalc, type DateCalcInputs, type DateCalcResults } from "./compute";

const defaults: DateCalcInputs = { startDate: "today", endDate: "today+90", includeEnd: "no", addDaysN: 30 };

export const dateCalculatorDef: CalculatorDefinition<DateCalcInputs, DateCalcResults> = {
  slug: "date-calculator",
  hub: "everyday",
  h1: "Date Calculator",
  valueProp: "Count the days between two dates, or find the date a number of days from now.",
  title: "Date Calculator: Days Between Dates | freecalcs.io",
  metaDescription:
    "Free date calculator: days between two dates in days, weeks, months and weekdays, plus the date any number of days before or after a start date.",
  primaryKeyword: "Date Calculator",
  secondaryKeywords: ["days between dates", "date duration calculator", "add days to date", "business days calculator", "how many days until"],
  intro:
    "How many days are there between two dates, and how many of them are weekdays? This date calculator counts the days between any two dates and breaks the span into weeks, months and years. It also adds or subtracts days from a date, for deadlines, notice periods and due dates.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "startDate", label: "Start date", type: "date", default: "today" },
    { name: "endDate", label: "End date", type: "date", default: "today+90" },
    { name: "includeEnd", label: "Include the end date?", type: "select", default: "no", options: [{ label: "No (standard)", value: "no" }, { label: "Yes, count both days", value: "yes" }] },
    { name: "addDaysN", label: "Add days to start date", type: "number", default: 30, step: 1, helpText: "Use a negative number to count backward." },
  ],

  compute: computeDateCalc,

  results: [
    { key: "absDaysLabel", label: "Days between", format: "text", variant: "primary", hint: "Calendar days." },
    { key: "weeksLabel", label: "In weeks", format: "text", variant: "secondary" },
    { key: "ymdLabel", label: "In years, months & days", format: "text", variant: "secondary" },
    { key: "weekdays", label: "Weekdays (Mon–Fri)", format: "number", variant: "secondary" },
    { key: "weekendDays", label: "Weekend days", format: "number", variant: "secondary" },
    { key: "addedLabel", label: "Start date + days", format: "text", variant: "secondary" },
  ],

  scenarios: [
    { id: "year", label: "Until New Year", patch: { startDate: "today", endDate: "next:01-01" } },
    { id: "30", label: "30 days from today", patch: { startDate: "today", addDaysN: 30 } },
    { id: "90", label: "90 days from today", patch: { startDate: "today", addDaysN: 90 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid,
      say: (r) =>
        `${r.endBeforeStart ? "Counting backward, there are" : "There are"} ${num(r.absDays)} days between ${r.startLabel} and ${r.endLabel}: ${r.weeksLabel}, or ${r.ymdLabel}.`,
    },
    {
      id: "weekdays",
      priority: 85,
      when: (r) => r.valid && r.absDays > 6,
      say: (r) => `${num(r.weekdays)} of those days fall on weekdays. Public holidays aren't excluded, so subtract any that apply for working days.`,
    },
    { id: "invalid", priority: 95, when: (r) => !r.valid, say: () => `Pick both a start date and an end date to count the days between them.` },
    {
      id: "added",
      priority: 80,
      when: (r) => r.addedLabel !== "—" && r.daysAdded !== 0,
      say: (r) => `${num(Math.abs(r.daysAdded))} days ${r.daysAdded > 0 ? "after" : "before"} ${r.startLabel} is ${r.addedLabel}.`,
    },
  ],

  related: [relatedLink("days-until"), relatedLink("30-days-from-today"), relatedLink("90-days-from-today"), relatedLink("180-days-from-today"), relatedLink("age"), relatedLink("pregnancy-due-date")],
  relatedArticles: [],

  faqs: [
    { q: "How do I count the days between two dates?", a: "Subtract the earlier date from the later one. By convention the start date isn't counted and the end date is, so Monday to Wednesday is 2 days. Choose 'count both days' to include the start date too." },
    { q: "How many weekdays are between two dates?", a: "The calculator counts Monday through Friday in the span. It doesn't know about public holidays, so subtract those yourself for business days." },
    { q: "How do I add days to a date?", a: "Enter a start date and the number of days to add. Use a negative number to find a date in the past, for example 30 days before a deadline." },
    { q: "Does this account for leap years?", a: "Yes. Dates are calculated on the real calendar, so February 29 in leap years is included automatically." },
  ],

  teach: {
    heading: "How are days between dates counted?",
    whatIsIt:
      "A date difference is the number of calendar days from one date to another. The standard count excludes the start date and includes the end date, the same way 'in 3 days' works in everyday speech.",
    whyItMatters:
      "Deadlines, notice periods, contracts, warranties and travel plans all depend on exact day counts, and month lengths and leap years make mental math error-prone. Weekday counts matter for business deadlines and shipping estimates.",
    whatToDoNext:
      "For a countdown to a specific event, use the days until calculator. For working-day deadlines, subtract any public holidays in the range from the weekday count.",
  },

  method: { label: "Calendar arithmetic in UTC (no time-zone or daylight-saving drift); weekdays = Mon–Fri; years/months/days by whole calendar months, clamped at month end" },

  monetization: [
    { kind: "internal", headline: "Counting down to something?", body: "See exactly how many days, weeks and weekdays are left until any date.", ctaLabel: "Open the days until calculator", href: "/days-until" },
  ],
};
