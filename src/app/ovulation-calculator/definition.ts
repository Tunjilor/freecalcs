// Ovulation Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { computeOvulation, type OvulationInputs, type OvulationResults } from "./compute";

const defaults: OvulationInputs = { lmpDate: "today-10", cycleLength: 28 };

export const ovulationCalculatorDef: CalculatorDefinition<OvulationInputs, OvulationResults> = {
  slug: "ovulation-calculator",
  hub: "health",
  h1: "Ovulation Calculator",
  valueProp: "Estimate your ovulation date and most fertile days for the next six cycles.",
  title: "Ovulation Calculator: Fertile Window & Dates | freecalcs.io",
  metaDescription:
    "Free ovulation calculator: estimate when you ovulate and your fertile window from your last period and cycle length, plus your next period and test date.",
  primaryKeyword: "Ovulation Calculator",
  secondaryKeywords: ["fertile window calculator", "ovulation calendar", "when do I ovulate", "most fertile days", "fertility calculator"],
  intro:
    "You're most likely to conceive in the few days before and on the day you ovulate. This ovulation calculator uses the first day of your last period and your usual cycle length to estimate your ovulation date and fertile window, plus your next period, when to test, and a due date if you conceive.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "lmpDate", label: "First day of your last period", type: "date", default: "today-10" },
    { name: "cycleLength", label: "Usual cycle length (days)", type: "number", default: 28, min: 20, max: 45, helpText: "From the first day of one period to the first day of the next. 28 is average; 21–35 is typical." },
  ],

  compute: computeOvulation,

  results: [
    { key: "ovulationLabel", label: "Estimated ovulation", format: "text", variant: "primary", hint: "About 14 days before your next period." },
    { key: "windowLabel", label: "Fertile window", format: "text", variant: "secondary" },
    { key: "peakLabel", label: "Most fertile days", format: "text", variant: "secondary" },
    { key: "nextPeriodLabel", label: "Next period expected", format: "text", variant: "secondary" },
    { key: "dueLabel", label: "Due date if you conceive", format: "text", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Your next six cycles",
      columns: [
        { key: "cycle", label: "Cycle", format: "text", align: "left" },
        { key: "period", label: "Period starts", format: "text", align: "right" },
        { key: "fertile", label: "Fertile window", format: "text", align: "right" },
        { key: "ovulation", label: "Ovulation", format: "text", align: "right" },
        { key: "due", label: "Due date if conceived", format: "text", align: "right" },
      ],
      rows: (r) => r.cycles,
      note: "Estimates assume a regular cycle. Ovulation can shift from month to month, even in regular cycles.",
    },
  ],

  scenarios: [
    { id: "short", label: "26-day cycle", patch: { cycleLength: 26 } },
    { id: "long", label: "32-day cycle", patch: { cycleLength: 32 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.valid,
      say: (r) => `With a ${r.cycle}-day cycle, you'll most likely ovulate around ${r.ovulationLabel} (cycle day ${r.ovulationDay}). Your fertile window is ${r.windowLabel}.`,
    },
    {
      id: "timing",
      priority: 88,
      when: (r) => r.valid,
      say: (r) => `Chances of conceiving are highest from ${r.peakLabel}. Sex every 1–2 days during the fertile window covers it without needing to pinpoint the exact day.`,
    },
    {
      id: "test",
      priority: 80,
      when: (r) => r.valid,
      say: (r) => `If your period hasn't started by ${r.testLabel}, a home pregnancy test should be reliable from that day on.`,
    },
    {
      id: "irregular",
      priority: 90,
      tone: "warn",
      when: (r) => r.valid && r.irregular,
      say: () => `Cycles shorter than 21 or longer than 35 days can mean you don't ovulate every month, which makes calendar estimates less reliable. Ovulation tests or tracking temperature help, and it's worth mentioning to your doctor.`,
    },
    {
      id: "confirm",
      priority: 65,
      when: (r) => r.valid,
      say: () => `Calendar estimates work best with regular cycles. Ovulation predictor kits (LH tests) detect the hormone surge 24–36 hours before ovulation for a more precise read.`,
    },
    { id: "invalid", priority: 95, when: (r) => !r.valid, say: () => `Enter the first day of your last period to see your fertile days.` },
  ],

  related: [relatedLink("pregnancy-due-date"), relatedLink("days-until"), relatedLink("date-calculator"), relatedLink("28-days-from-today"), relatedLink("water-intake")],
  relatedArticles: [],

  faqs: [
    { q: "When do I ovulate?", a: "Usually about 14 days before your next period starts. In a 28-day cycle that's around day 14 or 15; in a 32-day cycle, around day 18 or 19." },
    { q: "How many days a month can I get pregnant?", a: "About six: the five days before ovulation and the day of ovulation. Sperm can survive up to five days, while an egg lives about 12–24 hours after release." },
    { q: "How accurate is an ovulation calculator?", a: "It's an estimate based on averages. The luteal phase varies from about 11 to 17 days, and ovulation can shift with stress, illness or travel, so combine it with ovulation tests or symptoms for better accuracy." },
    { q: "What are signs of ovulation?", a: "Common signs include clear, stretchy cervical mucus (like egg whites), a slight rise in basal body temperature after ovulation, mild one-sided pelvic pain and a positive LH test." },
    { q: "Can I use this calculator as birth control?", a: "No. Calendar estimates aren't reliable enough to prevent pregnancy. Talk to a healthcare provider about contraception." },
  ],

  teach: {
    heading: "How do you know when you're ovulating?",
    whatIsIt:
      "Ovulation is when an ovary releases an egg, usually once per cycle. The fertile window is the stretch of days when sex can lead to pregnancy: the five days before ovulation plus the day itself.",
    whyItMatters:
      "Timing sex to your fertile window gives the best chance of conceiving each cycle. Knowing your next period and test date also helps you avoid testing too early.",
    whatToDoNext:
      "Track your period start dates for a few months to learn your real cycle length. If you're under 35 and haven't conceived after 12 months of trying (6 months if 35 or older), see a doctor.",
  },

  method: { label: "Calendar method: ovulation = next period − 14 days; fertile window = ovulation −5 to +1 days; due date = LMP + 280 days + (cycle − 28)" },

  monetization: [
    { kind: "internal", headline: "Think you might be pregnant?", body: "Find your due date, how far along you are and key milestones.", ctaLabel: "Open the pregnancy due date calculator", href: "/pregnancy-due-date" },
  ],
};
