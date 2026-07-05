import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, ratioPct } from "@/lib/calculator/format";
import { FILING_OPTIONS, YEAR_OPTIONS } from "@/lib/calculator/tax-data";
import {
  computeSelfEmployment,
  type SelfEmploymentInputs,
  type SelfEmploymentResults,
} from "./compute";

const defaults: SelfEmploymentInputs = { year: "2026", filing: "single", netIncome: 80000 };

export const selfEmploymentDef: CalculatorDefinition<SelfEmploymentInputs, SelfEmploymentResults> = {
  slug: "self-employment-tax",
  hub: "tax",
  h1: "Self-Employment Tax Calculator",
  valueProp: "Estimate your SE tax (Social Security + Medicare) and the deductible half.",
  title: "Self-Employment Tax Calculator | freecalcs.io",
  metaDescription:
    "Free self-employment tax calculator for the 2025 & 2026 tax years. Estimate your SE tax (Social Security + Medicare) on net profit, the deductible half, and your quarterly set-aside.",
  primaryKeyword: "Self-Employment Tax Calculator",
  secondaryKeywords: ["SE tax", "self employment tax rate", "1099 tax calculator", "quarterly estimated taxes"],
  intro:
    "When you work for yourself, you pay both halves of Social Security and Medicare — that's the self-employment tax, on top of income tax. This calculator estimates your SE tax on net profit for the 2025 and 2026 tax years, shows the portion you can deduct, and gives you a quarterly number to set aside so April isn't a shock.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "year", label: "Tax year", type: "select", default: "2026", options: YEAR_OPTIONS },
    { name: "filing", label: "Filing status", type: "select", default: "single", options: FILING_OPTIONS },
    { name: "netIncome", label: "Net self-employment profit", type: "currency", default: 80000, helpText: "Business income minus business expenses (Schedule C net)." },
  ],

  compute: computeSelfEmployment,

  results: [
    { key: "seTax", label: "Self-employment tax", format: "currency", variant: "primary", hint: "Social Security + Medicare on 92.35% of your profit." },
    { key: "socialSecurity", label: "Social Security (12.4%)", format: "currency", variant: "secondary" },
    { key: "medicare", label: "Medicare (2.9%)", format: "currency", variant: "secondary" },
    { key: "additionalMedicare", label: "Additional Medicare (0.9%)", format: "currency", variant: "secondary" },
    { key: "deductibleHalf", label: "Deductible half", format: "currency", variant: "secondary" },
    { key: "netEarnings", label: "Net earnings (× 92.35%)", format: "currency", variant: "secondary" },
    { key: "quarterlyEstimate", label: "Set aside per quarter", format: "currency", variant: "secondary" },
  ],

  scenarios: [
    { id: "y2025", label: "2025 tax year", patch: { year: "2025" } },
    { id: "married", label: "Married filing jointly", patch: { filing: "married" } },
    { id: "high", label: "$200k profit", patch: { netIncome: 200000 } },
  ],

  insights: [
    {
      id: "rate-breakdown",
      priority: 92,
      when: (r) => r.seTax > 0,
      say: (r, v) =>
        `Your self-employment tax is ${money(r.seTax)} — ${money(
          r.socialSecurity,
        )} of Social Security plus ${money(r.medicare)} of Medicare, charged on ${money(
          r.netEarnings,
        )} (92.35% of your ${money(v.netIncome)} profit).`,
    },
    {
      id: "ss-cap",
      priority: 88,
      tone: "info",
      when: (r) => r.hitSsCap,
      say: (r) =>
        `You've hit the ${money(
          r.ssWageBase,
        )} Social Security wage base — profit above it owes only the 2.9% Medicare portion, not the full 15.3%, so your marginal SE rate drops sharply.`,
    },
    {
      id: "deductible-half",
      priority: 85,
      tone: "success",
      when: (r) => r.deductibleHalf > 0,
      say: (r) =>
        `You can deduct ${money(
          r.deductibleHalf,
        )} — half your SE tax — from your income before figuring income tax, which softens the overall hit.`,
    },
    {
      id: "quarterly",
      priority: 80,
      tone: "warn",
      when: (r) => r.quarterlyEstimate > 0,
      say: (r) =>
        `Set aside about ${money(
          r.quarterlyEstimate,
        )} each quarter for SE tax alone — plus your income tax — and pay estimated taxes to avoid an IRS underpayment penalty.`,
    },
    {
      id: "effective-rate",
      priority: 70,
      when: (r, v) => v.netIncome > 0,
      say: (r, v) =>
        `That works out to an effective self-employment tax of ${ratioPct(
          r.effectiveRate,
        )} of your ${money(v.netIncome)} profit — separate from, and before, any federal income tax.`,
    },
  ],

  related: [
    relatedLink("tax"),
    relatedLink("tax-refund"),
    relatedLink("paycheck"),
    relatedLink("capital-gains-tax"),
  ],

  faqs: [
    { q: "What is self-employment tax?", a: "It's the self-employed person's version of the Social Security and Medicare (FICA) taxes that employees and employers split. As your own boss you pay both halves: 12.4% Social Security (up to the annual wage base) plus 2.9% Medicare, for 15.3% total, charged on 92.35% of your net profit. It's separate from and in addition to federal income tax." },
    { q: "Why is SE tax calculated on 92.35% of my profit?", a: "The 7.65% reduction mirrors the employer's share of FICA that an employee wouldn't pay tax on. Multiplying net profit by 0.9235 before applying the 15.3% rate keeps the self-employed roughly even with employees, who are taxed on wages after the employer's half." },
    { q: "What is the deductible half of SE tax?", a: "You can deduct one-half of your self-employment tax (the 15.3% portion) as an above-the-line adjustment to income. It doesn't reduce the SE tax itself, but it lowers the income your federal income tax is calculated on, so it trims your income-tax bill." },
    { q: "Do I have to make quarterly estimated payments?", a: "Generally yes, if you expect to owe $1,000 or more. Because no employer is withholding for you, the IRS wants tax paid throughout the year via quarterly estimates (April, June, September, January). Missing them can trigger an underpayment penalty even if you pay in full by the filing deadline." },
    { q: "Does the Social Security wage base cap my SE tax?", a: "The 12.4% Social Security portion only applies up to the annual wage base ($176,100 in 2025, $184,500 in 2026). Net earnings above that owe just the 2.9% Medicare portion (plus 0.9% Additional Medicare over the high-income threshold), so your marginal SE rate falls once you cross the cap." },
    { q: "Is SE tax the same as income tax?", a: "No. SE tax funds Social Security and Medicare; income tax is separate and uses the tax brackets. A self-employed person owes both on the same profit. Use the income tax and refund calculators alongside this one to see your full federal bill." },
  ],

  teach: {
    whatIsIt:
      "Self-employment tax is how independent workers — freelancers, contractors, gig workers, sole proprietors, and single-member LLC owners — fund Social Security and Medicare. Employees have 7.65% withheld and their employer quietly pays a matching 7.65%. When you're self-employed, there's no employer, so you pay the whole 15.3% yourself.\n\nIt's charged on your net profit (income minus business expenses) times 92.35%, not on your gross revenue, and it's completely separate from the federal income tax you also owe on that profit.",
    whyItMatters:
      "SE tax is the number that surprises new freelancers most. On $80,000 of profit it runs over $11,000 — before a dollar of income tax. Because nobody withholds it for you, it's easy to spend money in the year that you actually owe to the IRS, then face a large bill plus penalties in April.\n\nThe good news is two-fold: you deduct half of it against your income tax, and once your earnings pass the Social Security wage base, the rate on additional profit drops from 15.3% to about 2.9%. Knowing both helps you plan set-asides and price your work correctly.",
    whatToDoNext:
      "Estimate your annual profit, run it through this calculator, and open a separate savings account for taxes. Move your quarterly set-aside there every time you get paid so the money is ready when estimates are due.\n\nThen pair this with the income tax calculator to see your combined bill, and make your quarterly estimated payments on time. If your self-employment income is growing, ask a tax professional whether an S-corp election could reduce the SE tax on part of your earnings.",
  },

  method: {
    label: "2025 & 2026 SE tax: 15.3% on 92.35% of net profit (Social Security capped at the SSA wage base) plus 0.9% Additional Medicare; rates per IRS",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "See your full federal bill",
      body: "Self-employment tax is only half the story — you also owe income tax on the same profit. Estimate the income-tax side and your total with the full tax calculator.",
      ctaLabel: "Open the income tax calculator",
      href: "/tax",
    },
  ],
};
