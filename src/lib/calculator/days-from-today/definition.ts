// Definition factory for the "N days from today" pages. Each page
// (/30-days-from-today, /90-days-from-today, …) is a full CalculatorDefinition
// with its own H1, metadata, FAQ and defaults; only N changes. The pages share
// one compute so the date math is tested once.

import type { CalculatorDefinition, RelatedLink } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num } from "@/lib/calculator/format";
import { computeDaysFromToday, type DaysFromTodayInputs, type DaysFromTodayResults } from "./compute";

/** The N values that get their own page. Keep in sync with the src/app/<n>-days-from-today folders. */
export const DAYS_FROM_TODAY_PAGES = [28, 30, 45, 60, 90, 180] as const;
export const daysSlug = (n: number) => `${n}-days-from-today`;

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

function weeksText(n: number) {
  const w = Math.floor(n / 7), d = n % 7;
  return d === 0 ? plural(w, "week") : `${plural(w, "week")} and ${plural(d, "day")}`;
}

// Short, page-specific context so each page answers why people look up this N.
const CONTEXT: Record<number, { why: string; uses: string }> = {
  28: { why: "28 days is exactly four weeks, the length of an average menstrual cycle and a common billing or prescription cycle.", uses: "prescription refills, 4-week programs, cycle tracking and four-weekly pay periods" },
  30: { why: "30 days is the standard notice and billing period in the U.S.: rent notices, return windows, free trials and many payment terms use it.", uses: "notice periods, return and refund windows, free trials, net-30 invoices and 30-day challenges" },
  45: { why: "45 days is a common deadline for insurance claims, real estate closings and net-45 payment terms.", uses: "home-purchase closing timelines, net-45 invoices, claim deadlines and six-week plans" },
  60: { why: "60 days, roughly two months, is used for grace periods, health insurance special enrollment and many trial and probation periods.", uses: "special enrollment windows, grace periods, net-60 terms and two-month goals" },
  90: { why: "90 days, about three months, is the classic probation period at work and a common window for returns, visas and fitness challenges.", uses: "employment probation, 90-day returns, visa and travel limits, and 90-day challenges" },
  180: { why: "180 days, about six months, is used for passport validity rules, visa stays, warranty windows and half-year plans.", uses: "passport and visa rules, 180-day stay limits, warranties and half-year planning" },
};

export function makeDaysFromTodayDef(n: number): CalculatorDefinition<DaysFromTodayInputs, DaysFromTodayResults> {
  const ctx = CONTEXT[n];
  const h1 = `${n} Days From Today`;
  const defaults: DaysFromTodayInputs = { fromDate: "today", days: n, direction: "from" };
  const siblings: RelatedLink[] = DAYS_FROM_TODAY_PAGES.filter((k) => k !== n).map((k) => relatedLink(daysSlug(k)));
  return {
    slug: daysSlug(n),
    hub: "everyday",
    h1,
    valueProp: `The exact date ${n} days from today, with the weekday and the business-day equivalent.`,
    title: `${n} Days From Today: What's the Date? | freecalcs.io`,
    metaDescription: `What date is ${n} days from today? See the exact date and weekday, ${n} business days from today, and dates for other common counts. Updates daily.`,
    primaryKeyword: h1,
    secondaryKeywords: [`what is ${n} days from today`, `${n} days from now`, `${n} business days from today`, `${n} days ago`, `date ${n} days from today`],
    intro: `This page counts ${n} days forward from today's date and shows the date you land on, including the day of the week. ${ctx.why} Change the start date or count backward to find the date ${n} days ago.`,
    commercialIntent: 1,

    defaults,
    inputs: [
      { name: "fromDate", label: "Start date", type: "date", default: "today", helpText: "Defaults to today. Today counts as day 0." },
      { name: "days", label: "Number of days", type: "number", default: n, min: 0, max: 36500, step: 1 },
      { name: "direction", label: "Direction", type: "select", default: "from", options: [{ label: "Days from (forward)", value: "from" }, { label: "Days before (ago)", value: "before" }] },
    ],

    compute: computeDaysFromToday,

    results: [
      { key: "dateLabel", label: "The date is", format: "text", variant: "primary", hint: "Calendar days, counting today as day 0." },
      { key: "weekday", label: "Day of the week", format: "text", variant: "secondary" },
      { key: "weeksLabel", label: "In weeks", format: "text", variant: "secondary" },
      { key: "businessDateLabel", label: "Same count in business days", format: "text", variant: "secondary" },
      { key: "monthsApprox", label: "About how many months", format: "number", variant: "secondary" },
    ],

    breakdowns: [
      {
        title: "Other common day counts from your start date",
        columns: [
          { key: "offset", label: "Count", format: "text", align: "left" },
          { key: "date", label: "Date", format: "text", align: "right" },
          { key: "weekday", label: "Weekday", format: "text", align: "right" },
        ],
        rows: (r) => r.rows,
      },
    ],

    scenarios: [
      { id: "ago", label: `${n} days ago`, patch: { direction: "before" } },
      { id: "fwd", label: `${n} days from today`, patch: { direction: "from", fromDate: "today", days: n } },
    ],

    insights: [
      {
        id: "headline",
        priority: 95,
        when: (r) => r.valid,
        say: (r, v) =>
          `${num(r.days)} days ${v.direction === "before" ? "before" : "after"} ${r.fromLabel} is ${r.dateLabel}. That's ${weeksText(r.days)}, or about ${r.monthsApprox} months.`,
      },
      {
        id: "weekend",
        priority: 85,
        tone: "warn",
        when: (r) => r.valid && r.isWeekend,
        say: (r) => `That date falls on a ${r.weekday}. If it's a deadline, check whether it moves to the next business day; many contracts and agencies do that.`,
      },
      {
        id: "business",
        priority: 80,
        when: (r, v) => r.valid && r.days >= 5 && v.direction !== "before",
        say: (r) => `Counting only business days (Mon–Fri), ${num(r.days)} business days from the start is ${r.businessDateLabel}, before subtracting holidays.`,
      },
      {
        id: "convention",
        priority: 70,
        when: (r) => r.valid,
        say: () => `Today counts as day 0, so tomorrow is 1 day from today. If your deadline says "within" a number of days and counts today, subtract one day.`,
      },
      { id: "invalid", priority: 95, when: (r) => !r.valid, say: () => `Pick a start date to see the date.` },
    ],

    related: [relatedLink("date-calculator"), relatedLink("days-until"), ...siblings.slice(0, 4)],
    relatedArticles: [],

    faqs: [
      { q: `What is the date ${n} days from today?`, a: `The calculator above shows it using your device's date, and it updates every day. It counts today as day 0, so ${n} days from today is ${n} calendar days after today's date.` },
      { q: `How many weeks is ${n} days?`, a: `${n} days is ${weeksText(n)}, or about ${Math.round((n / 30.4375) * 10) / 10} months.` },
      { q: `What is ${n} business days from today?`, a: `Business days skip Saturdays and Sundays, so ${n} business days runs well past ${n} calendar days. The "business days" result above gives the exact date; subtract any public holidays that apply.` },
      { q: `What was the date ${n} days ago?`, a: `Tap "${n} days ago" above, or switch the direction to "Days before". The calculator counts backward ${n} days from your start date.` },
      { q: `What is ${n} days from today used for?`, a: `People look it up for ${ctx.uses}.` },
    ],

    teach: {
      heading: `How do you count ${n} days from today?`,
      whatIsIt: `Counting ${n} days from today means adding ${n} calendar days to today's date, treating today as day 0. Because months have 28 to 31 days, the result rarely falls on the same day-of-month a set number of months later.`,
      whyItMatters: `${ctx.why} Getting the count right matters when a deadline, refund or legal notice depends on it.`,
      whatToDoNext: `Check whether your deadline counts calendar days or business days and whether it includes today. To count days between two specific dates, use the date calculator.`,
    },

    method: { label: `Date = start date + ${n} calendar days (UTC dates, today = day 0); business days skip Saturday and Sunday` },

    monetization: [
      { kind: "internal", headline: "Counting between two dates?", body: "Find the days, weeks and weekdays between any two dates.", ctaLabel: "Open the date calculator", href: "/date-calculator" },
    ],
  };
}
