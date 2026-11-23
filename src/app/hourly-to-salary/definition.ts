// Hourly to Salary Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2 } from "@/lib/calculator/format";
import { computeHourly, type HourlyInputs, type HourlyResults } from "./compute";

const defaults: HourlyInputs = { hourlyRate: 25, hoursPerWeek: 40, overtimeHours: 0, weeksPerYear: 52 };

export const hourlyToSalaryDef: CalculatorDefinition<HourlyInputs, HourlyResults> = {
  slug: "hourly-to-salary",
  hub: "tax",
  h1: "Hourly to Salary Calculator",
  valueProp: "Convert an hourly wage to yearly, monthly, biweekly and weekly pay, with overtime.",
  title: "Hourly to Salary Calculator: Hourly to Annual Pay | freecalcs.io",
  metaDescription:
    "Free hourly to salary calculator: convert your hourly wage to annual, monthly, biweekly, weekly and daily pay, with overtime and unpaid time off.",
  primaryKeyword: "Hourly to Salary Calculator",
  secondaryKeywords: ["hourly to annual salary", "hourly wage calculator", "how much is $20 an hour a year", "hourly to yearly"],
  intro:
    "How much is your hourly wage a year? This hourly to salary calculator converts your rate to annual, monthly, biweekly, weekly and daily pay before taxes. It also counts overtime at time-and-a-half and any unpaid weeks off, so the result matches what you'd actually earn.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "hourlyRate", label: "Hourly rate", type: "currency", default: 25, step: 0.25 },
    { name: "hoursPerWeek", label: "Regular hours / week", type: "number", default: 40, min: 0, max: 80 },
    { name: "overtimeHours", label: "Overtime hours / week", type: "number", default: 0, min: 0, max: 40, helpText: "Paid at 1.5× your rate." },
    {
      name: "weeksPerYear",
      label: "Paid weeks / year",
      type: "number",
      default: 52,
      min: 1,
      max: 52,
      helpText: "52 if your time off is paid. Subtract any unpaid weeks.",
    },
  ],

  compute: computeHourly,

  results: [
    { key: "annual", label: "Annual salary", format: "currency", variant: "primary", hint: "Gross pay, before taxes." },
    { key: "monthly", label: "Monthly", format: "currency2", variant: "secondary" },
    { key: "biweekly", label: "Biweekly", format: "currency2", variant: "secondary" },
    { key: "weekly", label: "Weekly", format: "currency2", variant: "secondary" },
    { key: "daily", label: "Daily", format: "currency2", variant: "secondary" },
    { key: "overtimeAnnual", label: "Overtime pay / year", format: "currency", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Your pay by period",
      columns: [
        { key: "period", label: "Period", format: "text", align: "left" },
        { key: "amount", label: "Gross pay", format: "currency2", align: "right" },
      ],
      rows: (r) => r.rows,
    },
  ],

  reference: {
    heading: "Hourly to salary conversion table",
    body: "Annual pay at 40 hours a week for 52 weeks (2,080 hours), before taxes.",
    tables: [
      {
        title: "Common hourly wages per year",
        columns: [
          { key: "hourly", label: "Hourly", format: "currency2", align: "left" },
          { key: "annual", label: "Per year", format: "currency", align: "right" },
          { key: "monthly", label: "Per month", format: "currency", align: "right" },
        ],
        rows: [15, 17, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60, 75].map((h) => ({
          hourly: h,
          annual: h * 2080,
          monthly: Math.round((h * 2080) / 12),
        })),
      },
    ],
  },

  scenarios: [
    { id: "ot", label: "+5 hrs overtime", patch: { overtimeHours: 5 } },
    { id: "pt", label: "Part time (25 hrs)", patch: { hoursPerWeek: 25 } },
    { id: "unpaid", label: "2 weeks unpaid", patch: { weeksPerYear: 50 } },
    { id: "raise", label: "$2/hr raise", patch: { hourlyRate: 27 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.annual > 0,
      say: (r, v) =>
        `${money2(v.hourlyRate)} an hour works out to ${money(r.annual)} a year before taxes, or about ${money(r.monthly)} a month.`,
    },
    {
      id: "shortcut",
      priority: 85,
      when: (r, v) => v.hoursPerWeek === 40 && v.overtimeHours === 0 && v.weeksPerYear === 52,
      say: (r, v) =>
        `Quick shortcut: double your hourly rate and add three zeros. ${money2(v.hourlyRate)} × 2,000 ≈ ${money(
          v.hourlyRate * 2000,
        )}; the exact figure with 2,080 hours is ${money(r.annualAt2080)}.`,
    },
    {
      id: "overtime",
      priority: 88,
      tone: "success",
      when: (r) => r.overtimeAnnual > 0,
      say: (r) => `Overtime adds ${money(r.overtimeAnnual)} a year, which is ${Math.round((r.overtimeAnnual / r.annual) * 100)}% of your total pay.`,
    },
    {
      id: "unpaid-time",
      priority: 80,
      tone: "warn",
      when: (r, v) => v.weeksPerYear < 52,
      say: (r, v) =>
        `${52 - v.weeksPerYear} unpaid week${52 - v.weeksPerYear === 1 ? "" : "s"} cost${52 - v.weeksPerYear === 1 ? "s" : ""} you ${money(
          r.annualAt2080 * (v.hoursPerWeek / 40) - r.regularAnnual,
        )} a year. When comparing with a salaried offer, remember salaried jobs usually include paid time off.`,
    },
    {
      id: "take-home",
      priority: 70,
      when: (r) => r.annual > 0,
      say: () => `These are gross figures. Federal and state income tax plus 7.65% for Social Security and Medicare come out before you're paid; the salary calculator shows your take-home pay.`,
    },
  ],

  related: [relatedLink("salary"), relatedLink("paycheck"), relatedLink("tax"), relatedLink("budget"), relatedLink("self-employment-tax")],
  relatedArticles: [],

  faqs: [
    { q: "How do I convert hourly pay to salary?", a: "Multiply your hourly rate by the hours you work each week, then by the number of paid weeks in a year. At 40 hours and 52 weeks, that's your hourly rate × 2,080." },
    { q: "How much is $20 an hour a year?", a: "$41,600 a year at 40 hours a week for 52 weeks, or about $3,467 a month before taxes." },
    { q: "How much is $25 an hour a year?", a: "$52,000 a year at 40 hours a week for 52 weeks, or about $4,333 a month before taxes." },
    { q: "How is overtime calculated?", a: "Under federal law, non-exempt employees earn at least 1.5 times their regular rate for hours over 40 in a workweek. Some states, like California, also require overtime for long days." },
    { q: "Should I count paid holidays and vacation?", a: "If your time off is paid, keep 52 weeks. If you take unpaid time off, subtract those weeks, since you won't be paid for them." },
  ],

  teach: {
    heading: "How do you convert hourly pay to salary?",
    whatIsIt:
      "Hourly-to-salary conversion turns an hourly wage into the equivalent yearly, monthly and weekly pay. The standard full-time year is 2,080 hours: 40 hours a week for 52 weeks.",
    whyItMatters:
      "Job offers, loan applications and rental applications often ask for annual income, while hourly jobs pay by the hour. Converting correctly, including overtime and unpaid time off, keeps you from overstating or understating your income.\n\nIt also matters when comparing an hourly job with a salaried one. Salaried roles usually include paid holidays and vacation, while many hourly roles don't, so the same annual figure can mean different amounts of work.",
    whatToDoNext:
      "To see what you actually take home after taxes, enter the annual figure into the salary calculator. Then use the budget calculator to split your take-home pay into needs, wants and savings.",
  },

  method: { label: "Annual = (rate × regular hours + rate × 1.5 × overtime hours) × paid weeks; monthly = annual ÷ 12, biweekly = annual ÷ 26, weekly = annual ÷ 52" },

  monetization: [
    { kind: "internal", headline: "What will you actually take home?", body: "See your pay after federal and state taxes, FICA and 401(k) in all 50 states.", ctaLabel: "Open the salary calculator", href: "/salary" },
  ],
};
