// Days Until Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computeDaysUntil, type DaysUntilInputs, type DaysUntilResults } from "./compute";

const defaults: DaysUntilInputs = { targetDate: "next:12-25", fromDate: "today" };

export const daysUntilDef: CalculatorDefinition<DaysUntilInputs, DaysUntilResults> = {
  slug: "days-until",
  hub: "everyday",
  h1: "Days Until Calculator",
  valueProp: "Count down the days, weeks and weekdays until any date.",
  title: "Days Until Calculator: Countdown to Any Date | freecalcs.io",
  metaDescription:
    "Free days until calculator: a countdown to any date in days, weeks, months and weekdays, from Christmas and New Year to birthdays, trips and deadlines.",
  primaryKeyword: "Days Until Calculator",
  secondaryKeywords: ["how many days until", "countdown calculator", "days until Christmas", "days left until"],
  intro:
    "How many days until Christmas, your vacation or a deadline? This days until calculator counts down from today to any date, showing the days left along with weeks, months and weekdays, and the day of the week your date falls on.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "targetDate", label: "Count down to", type: "date", default: "next:12-25" },
    { name: "fromDate", label: "Starting from", type: "date", default: "today", helpText: "Defaults to today." },
  ],

  compute: computeDaysUntil,

  results: [
    { key: "daysLabel", label: "Days to go", format: "text", variant: "primary", hint: "Calendar days, not counting today." },
    { key: "weeksLabel", label: "In weeks", format: "text", variant: "secondary" },
    { key: "monthsLabel", label: "In months", format: "text", variant: "secondary" },
    { key: "weekdays", label: "Weekdays left", format: "number", variant: "secondary" },
    { key: "targetWeekday", label: "Day of the week", format: "text", variant: "secondary" },
    { key: "hours", label: "Hours (approx.)", format: "number", variant: "secondary" },
  ],

  scenarios: [
    { id: "xmas", label: "Christmas", patch: { targetDate: "next:12-25" } },
    { id: "ny", label: "New Year's Day", patch: { targetDate: "next:01-01" } },
    { id: "j4", label: "July 4th", patch: { targetDate: "next:07-04" } },
    { id: "hw", label: "Halloween", patch: { targetDate: "next:10-31" } },
  ],

  insights: [
    {
      id: "future",
      priority: 95,
      when: (r) => r.valid && r.days > 0,
      say: (r) => `${r.targetLabel} is ${num(r.days)} day${r.days === 1 ? "" : "s"} away: ${r.weeksLabel}, falling on a ${r.targetWeekday}.`,
    },
    { id: "invalid", priority: 95, when: (r) => !r.valid, say: () => `Pick a date to count down to, and a starting date, to see the countdown.` },
    { id: "today", priority: 95, tone: "success", when: (r) => r.valid && r.isToday, say: () => `That's today!` },
    {
      id: "past",
      priority: 95,
      when: (r) => r.valid && r.isPast,
      say: (r) => `${r.targetLabel} was ${num(-r.days)} day${r.days === -1 ? "" : "s"} ago.`,
    },
    {
      id: "weekdays",
      priority: 80,
      when: (r) => r.valid && r.days > 6,
      say: (r) => `That includes ${num(r.weekdays)} weekdays, before subtracting any holidays.`,
    },
  ],

  related: [relatedLink("date-calculator"), relatedLink("age"), relatedLink("pregnancy-due-date"), relatedLink("savings-goal")],
  relatedArticles: [],

  faqs: [
    { q: "How many days until Christmas?", a: "Pick the Christmas button above: the calculator counts from today's date to the next December 25, so it's always up to date." },
    { q: "Does the count include today?", a: "No. Like most countdowns, it counts full days from today to the target date. If the event is tomorrow, it shows 1 day." },
    { q: "Can I count from a date other than today?", a: "Yes. Change 'Starting from' to any date to see the gap between two dates, or use the date calculator for more options." },
    { q: "How many weekdays are left?", a: "The weekday figure counts Monday through Friday. Public holidays aren't removed, so subtract them for working days." },
  ],

  teach: {
    heading: "How does a days-until countdown work?",
    whatIsIt:
      "A countdown is the number of calendar days between today and a future date. This calculator also converts it into weeks, months and weekdays, and tells you which day of the week the date falls on.",
    whyItMatters:
      "Seeing the exact number of days helps with planning: how many paychecks before a trip, how many weekends before a deadline, or how much to save each week for a holiday.",
    whatToDoNext:
      "Saving for the event? Divide the cost by the weeks left, or use the savings goal calculator to plan contributions.",
  },

  method: { label: "Days = target date − start date in UTC calendar days; recurring dates like Dec 25 roll to the next occurrence on or after today" },

  monetization: [
    { kind: "internal", headline: "Saving for the big day?", body: "Work out how much to put aside each month to hit your target in time.", ctaLabel: "Open the savings goal calculator", href: "/savings-goal" },
  ],
};
