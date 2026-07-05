import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, ratioPct } from "@/lib/calculator/format";
import { FILING_OPTIONS, YEAR_OPTIONS } from "@/lib/calculator/tax-data";
import {
  computeCapitalGains,
  type CapitalGainsInputs,
  type CapitalGainsResults,
} from "./compute";

const defaults: CapitalGainsInputs = {
  year: "2026",
  filing: "single",
  proceeds: 60000,
  basis: 40000,
  holding: "long",
  otherTaxableIncome: 90000,
};

export const capitalGainsDef: CalculatorDefinition<CapitalGainsInputs, CapitalGainsResults> = {
  slug: "capital-gains-tax",
  hub: "tax",
  h1: "Capital Gains Tax Calculator",
  valueProp: "Short-term vs long-term: see the rate applied and what holding a year saves.",
  title: "Capital Gains Tax Calculator | freecalcs.io",
  metaDescription:
    "Free capital gains tax calculator for 2025 & 2026. Enter proceeds, basis, and holding period to see your gain, the rate applied (0/15/20% long-term or ordinary short-term), and tax owed.",
  primaryKeyword: "Capital Gains Tax Calculator",
  secondaryKeywords: ["long term capital gains tax", "short term capital gains", "capital gains rate 2026", "investment tax calculator"],
  intro:
    "Sell an investment for more than you paid and the profit is a capital gain — but how it's taxed depends entirely on how long you held it. This calculator shows your gain, whether it's taxed at ordinary rates (short-term) or the lower 0/15/20% long-term rates, the tax owed for the 2025 or 2026 year, and what waiting past the one-year mark would save.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "year", label: "Tax year", type: "select", default: "2026", options: YEAR_OPTIONS },
    { name: "filing", label: "Filing status", type: "select", default: "single", options: FILING_OPTIONS },
    { name: "proceeds", label: "Sale proceeds", type: "currency", default: 60000 },
    { name: "basis", label: "Cost basis (what you paid)", type: "currency", default: 40000 },
    {
      name: "holding",
      label: "Holding period",
      type: "select",
      default: "long",
      options: [
        { label: "Long-term (held more than 1 year)", value: "long" },
        { label: "Short-term (held 1 year or less)", value: "short" },
      ],
    },
    { name: "otherTaxableIncome", label: "Other taxable income", type: "currency", default: 90000, helpText: "Your ordinary taxable income — the gain stacks on top of it." },
  ],

  compute: computeCapitalGains,

  results: [
    { key: "taxOwed", label: "Capital gains tax", format: "currency", variant: "primary", hint: "Federal tax on this gain for the holding period selected." },
    { key: "gain", label: "Capital gain", format: "currency", variant: "secondary" },
    { key: "afterTaxProceeds", label: "After-tax proceeds", format: "currency", variant: "secondary" },
    { key: "longTermTax", label: "If long-term", format: "currency", variant: "secondary" },
    { key: "shortTermTax", label: "If short-term (ordinary)", format: "currency", variant: "secondary" },
    { key: "savingsFromLongTerm", label: "Long-term saving", format: "currency", variant: "secondary" },
  ],

  scenarios: [
    { id: "long", label: "Held long-term", patch: { holding: "long" } },
    { id: "short", label: "Held short-term", patch: { holding: "short" } },
    { id: "y2025", label: "2025 tax year", patch: { year: "2025" } },
  ],

  insights: [
    {
      id: "loss",
      priority: 95,
      tone: "warn",
      when: (r) => r.isLoss,
      say: (r) =>
        `This sale is a ${money(
          r.lossAmount,
        )} capital loss, so no tax is due. You can use it to offset other capital gains, and up to $3,000 of ordinary income per year, carrying the rest forward.`,
    },
    {
      id: "zero-bracket",
      priority: 90,
      tone: "success",
      when: (r, v) => r.ltcgZeroBracket && v.holding === "long",
      say: (r) =>
        `Your long-term gain of ${money(
          r.gain,
        )} falls entirely in the 0% capital-gains bracket — you owe $0 in federal tax on it at this income level.`,
    },
    {
      id: "short-vs-long",
      priority: 88,
      tone: "info",
      when: (r) => r.gain > 0 && r.savingsFromLongTerm > 0,
      say: (r, v) =>
        v.holding === "short"
          ? `Selling short-term taxes this at ordinary rates — ${money(
              r.shortTermTax,
            )}. Holding past one year would drop it to ${money(r.longTermTax)}, saving ${money(
              r.savingsFromLongTerm,
            )}.`
          : `By holding long-term you're paying ${money(
              r.longTermTax,
            )} instead of the ${money(r.shortTermTax)} this would cost at ordinary rates — a saving of ${money(
              r.savingsFromLongTerm,
            )}.`,
    },
    {
      id: "rate-applied",
      priority: 80,
      when: (r) => r.gain > 0,
      say: (r) =>
        `Your effective tax rate on this ${money(r.gain)} gain is ${ratioPct(
          r.rateApplied,
        )}, leaving you ${money(r.afterTaxProceeds)} of the sale after tax.`,
    },
    {
      id: "gain-magnitude",
      priority: 66,
      when: (r) => r.gain > 0,
      say: (r, v) =>
        `On ${money(v.proceeds)} of proceeds against a ${money(
          v.basis,
        )} cost basis, only the ${money(
          r.gain,
        )} gain is taxed — never your original investment.`,
    },
    {
      id: "holding-reminder",
      priority: 65,
      when: (r) => r.gain > 0,
      say: () =>
        `Long-term rates (0/15/20%) apply only after holding more than a full year. Miss the one-year mark by a day and the entire gain is taxed as ordinary income.`,
    },
  ],

  related: [
    relatedLink("tax"),
    relatedLink("tax-refund"),
    relatedLink("self-employment-tax"),
    relatedLink("compound-interest"),
  ],

  faqs: [
    { q: "What's the difference between short-term and long-term capital gains?", a: "It's the holding period. If you held the asset one year or less, the gain is short-term and taxed at your ordinary income tax rates (10–37%). Held more than a year, it's long-term and taxed at the preferential 0%, 15%, or 20% rates. The one-year line is the single biggest lever on your capital-gains bill." },
    { q: "What are the long-term capital gains rates for 2026?", a: "Long-term gains are taxed at 0%, 15%, or 20% depending on your taxable income. For 2026 (single), the 0% rate applies up to $49,450 of income, 15% up to $545,500, and 20% above that; married-filing-jointly thresholds are roughly double. The gain stacks on top of your ordinary income to determine which rate(s) apply." },
    { q: "How is the capital gains rate determined?", a: "Your long-term gain is 'stacked' on top of your ordinary taxable income. The portion that lands in the 0% band is untaxed, the portion in the 15% band is taxed at 15%, and so on. So a modest income can keep some or all of a gain in the 0% bracket, while a high income pushes it to 15% or 20%." },
    { q: "What is cost basis?", a: "Cost basis is what you paid for the asset, including commissions and fees, plus any reinvested dividends for funds. Your gain is proceeds minus basis. Keeping accurate basis records matters — overstating basis underpays tax, while understating it makes you pay more than you owe." },
    { q: "What happens if I sell at a loss?", a: "A capital loss offsets capital gains dollar-for-dollar. If losses exceed gains, you can deduct up to $3,000 against ordinary income each year and carry the remainder forward to future years. Strategically realizing losses to offset gains is called tax-loss harvesting." },
    { q: "Does this include the Net Investment Income Tax?", a: "No. High earners may owe an additional 3.8% Net Investment Income Tax on gains above certain income thresholds ($200k single, $250k married). This calculator estimates the base capital-gains tax; factor in the 3.8% separately if your income is above those levels." },
  ],

  teach: {
    whatIsIt:
      "A capital gain is the profit when you sell an asset — stocks, a fund, crypto, real estate — for more than your cost basis. The federal tax on that profit depends on two things: how long you owned the asset and how much other income you have.\n\nHold for one year or less and the gain is 'short-term,' taxed like a paycheck at your ordinary rates. Hold for more than a year and it becomes 'long-term,' taxed at the lower 0/15/20% rates. The gain is stacked on top of your ordinary income to decide which of those rates apply.",
    whyItMatters:
      "The holding period is one of the most valuable, most controllable levers in personal finance. The same $20,000 gain can be taxed at 22–24% if sold a day too early, or 15% — even 0% — if you wait past the one-year mark. On larger gains, that timing difference is thousands of dollars.\n\nIt also interacts with your income: because long-term gains stack on ordinary income, a lower-income year (early retirement, a sabbatical, a gap between jobs) can be a chance to realize gains at the 0% rate. Understanding the stacking is what turns capital-gains tax from a surprise into a plan.",
    whatToDoNext:
      "Before selling, check your holding period — if you're close to a year, waiting could move the gain into long-term rates. Estimate the tax both ways here so the trade-off is concrete.\n\nIf you have losers in your portfolio, consider realizing losses in the same year to offset gains (tax-loss harvesting). And if your income is unusually low this year, look at whether some long-term gains can be realized in the 0% bracket. For large or complex sales — especially real estate — confirm the details with a tax professional.",
  },

  method: {
    label: "2025 & 2026 long-term capital-gains brackets (0/15/20%) per IRS Rev. Proc. 2024-40 & 2025-32; short-term gains taxed at ordinary rates",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Fit this into your whole return",
      body: "Capital gains stack on top of your other income. See your complete federal picture — brackets, deductions, and total tax — with the full income tax calculator.",
      ctaLabel: "Open the income tax calculator",
      href: "/tax",
    },
  ],
};
