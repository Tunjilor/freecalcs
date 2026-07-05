import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import { computeRoth, type RothInputs, type RothResults } from "./compute";

const defaults: RothInputs = {
  annualContribution: 7000,
  currentTaxRate: 24,
  retirementTaxRate: 22,
  years: 30,
  annualReturn: 7,
};

export const rothDef: CalculatorDefinition<RothInputs, RothResults> = {
  slug: "roth-vs-traditional",
  hub: "investing",
  h1: "Roth vs Traditional Calculator",
  valueProp: "See which account leaves you more after tax — the answer is all about your tax rate now vs later.",
  title: "Roth vs Traditional Calculator (IRA & 401k) | freecalcs.io",
  metaDescription:
    "Free Roth vs Traditional calculator: compare the after-tax value of Roth and Traditional retirement contributions. See which wins based on your current vs retirement tax rate, and the break-even.",
  primaryKeyword: "Roth vs Traditional Calculator",
  secondaryKeywords: ["roth vs traditional ira", "roth vs traditional 401k", "roth conversion break even", "pre-tax vs roth"],
  intro:
    "Roth or Traditional? The entire decision comes down to one question: will your tax rate in retirement be higher or lower than it is today? This calculator compares the after-tax value of the same contribution in each account, shows which comes out ahead for your numbers, and makes the break-even rule explicit so you can decide with confidence.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "annualContribution", label: "Annual contribution (pre-tax)", type: "currency", default: 7000 },
    { name: "currentTaxRate", label: "Tax rate today", type: "percent", default: 24, step: 1 },
    { name: "retirementTaxRate", label: "Tax rate in retirement", type: "percent", default: 22, step: 1 },
    { name: "years", label: "Years until retirement", type: "years", default: 30, min: 1, max: 50 },
    { name: "annualReturn", label: "Expected annual return", type: "percent", default: 7, step: 0.1 },
  ],

  compute: computeRoth,

  results: [
    { key: "winner", label: "Better account for you", format: "text", variant: "primary", hint: "The one that leaves more after tax, given your rate now vs in retirement." },
    { key: "rothAfterTax", label: "Roth after-tax value", format: "currency", variant: "secondary" },
    { key: "traditionalAfterTax", label: "Traditional after-tax value", format: "currency", variant: "secondary" },
    { key: "difference", label: "Difference", format: "currency", variant: "secondary" },
    { key: "pretaxBalance", label: "Pre-tax balance at retirement", format: "currency", variant: "secondary" },
    { key: "breakEvenRate", label: "Break-even retirement rate", format: "percent", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "After-tax value, side by side",
      columns: [
        { key: "account", label: "Account", format: "text", align: "left" },
        { key: "when", label: "Taxed", format: "text", align: "left" },
        { key: "rate", label: "At rate", format: "percent" },
        { key: "value", label: "After-tax value", format: "currency" },
      ],
      rows: (r) => [
        { account: "Roth", when: "Now", rate: r.currentTaxRate, value: r.rothAfterTax },
        { account: "Traditional", when: "In retirement", rate: r.retirementTaxRate, value: r.traditionalAfterTax },
      ],
      note: "Both start from the same pre-tax contribution. Roth is taxed now at today's rate; Traditional is taxed at withdrawal at your retirement rate. Whichever rate is lower wins.",
    },
  ],

  scenarios: [
    { id: "higher", label: "Higher rate in retirement", patch: { retirementTaxRate: 32 } },
    { id: "lower", label: "Lower rate in retirement", patch: { retirementTaxRate: 15 } },
    { id: "equal", label: "Same rate (break-even)", patch: { retirementTaxRate: 24 } },
  ],

  insights: [
    {
      id: "break-even-rule",
      priority: 94,
      when: () => true,
      say: () =>
        `The rule in one line: Traditional wins if your tax rate in retirement is LOWER than today's, Roth wins if it's HIGHER, and they're exactly equal when the two rates match.`,
    },
    {
      id: "which-wins",
      priority: 90,
      tone: "success",
      when: (r) => r.winner !== "Tie",
      say: (r) =>
        `For your numbers, ${r.winner} comes out ahead by ${money(
          r.difference,
        )} — ${money(r.rothAfterTax)} after-tax with Roth vs ${money(
          r.traditionalAfterTax,
        )} with Traditional.`,
    },
    {
      id: "tie",
      priority: 90,
      tone: "info",
      when: (r) => r.winner === "Tie",
      say: (r) =>
        `Your rates are equal, so the two are mathematically identical (${money(
          r.rothAfterTax,
        )} either way). Choose on flexibility instead — Roth has tax-free withdrawals and no required minimum distributions.`,
    },
    {
      id: "why-timing",
      priority: 82,
      when: (r) => r.winner !== "Tie",
      say: (r) =>
        `It's purely about tax timing: Roth pays tax now at ${pct(
          r.currentTaxRate,
        )} and never again; Traditional defers it and pays ${pct(
          r.retirementTaxRate,
        )} at withdrawal. Nothing else in the math differs.`,
    },
    {
      id: "hedge",
      priority: 70,
      when: () => true,
      say: () =>
        `Unsure where rates will land? Splitting contributions between both hedges your bet and gives you tax flexibility in retirement — you can choose which account to draw from each year.`,
    },
  ],

  related: [
    relatedLink("401k"),
    relatedLink("retirement"),
    relatedLink("savings-goal"),
    relatedLink("compound-interest"),
  ],

  faqs: [
    { q: "Should I choose Roth or Traditional?", a: "It depends on whether your tax rate will be higher or lower in retirement than it is now. If you expect a lower rate later (common for high earners near peak income), Traditional's upfront deduction wins. If you expect a higher rate later (common for younger savers early in their careers), Roth's tax-free withdrawals win. When the rates are equal, they're identical." },
    { q: "What's the difference between Roth and Traditional?", a: "Traditional contributions are pre-tax: you deduct them now and pay income tax when you withdraw in retirement. Roth contributions are after-tax: you pay tax now, and qualified withdrawals — including all the growth — are completely tax-free. Same accounts, opposite tax timing." },
    { q: "Why does the break-even depend only on the tax rate?", a: "Because for the same pre-tax contribution, both accounts grow identically. The only difference is when you pay tax and at what rate. Mathematically, Roth's after-tax value is the balance times (1 − today's rate), and Traditional's is the balance times (1 − retirement rate). Whichever rate is smaller leaves you more." },
    { q: "Does the Roth 'lose' the upfront tax deduction?", a: "Yes, and that's the trade. Roth gives up the deduction now in exchange for tax-free growth and withdrawals later. This calculator accounts for that by comparing the same pre-tax contribution — so the comparison is apples-to-apples and comes down purely to your rate now vs later." },
    { q: "Are there other reasons to pick Roth?", a: "Beyond the tax math, Roth accounts have no required minimum distributions in the owner's lifetime, offer tax-free inheritance to heirs, and provide tax diversification — letting you control your taxable income in retirement. Many savers split contributions to hedge against uncertain future tax rates." },
    { q: "What if I can't predict my future tax rate?", a: "You're not alone — nobody can predict tax law decades out. That uncertainty is exactly why splitting contributions between Roth and Traditional is popular: it hedges the bet and gives you flexibility to draw from whichever account is more tax-efficient in a given retirement year." },
  ],

  teach: {
    whatIsIt:
      "Roth and Traditional are two tax treatments for the same retirement accounts (IRAs and 401(k)s). Traditional contributions are deducted from your taxable income now, grow tax-deferred, and are taxed as ordinary income when you withdraw. Roth contributions get no deduction now, but grow and are withdrawn completely tax-free.\n\nBecause the money grows identically in both, the choice isn't about returns — it's about when you'd rather pay the tax: at today's rate or at your rate in retirement.",
    whyItMatters:
      "This single decision can swing your after-tax retirement income by a meaningful margin, and it's widely misunderstood. People default to Roth because 'tax-free sounds better,' or to Traditional because 'a deduction now feels good' — without checking which actually leaves them more money.\n\nThe honest answer is a clean rule: it hinges entirely on your tax rate now versus later. High earners at peak income often benefit from the Traditional deduction and a likely lower retirement rate; younger or lower-income savers, who may face higher rates later, often benefit from locking in today's low rate with Roth.",
    whatToDoNext:
      "Estimate your marginal tax rate today and a realistic rate for retirement — remember retirement income (withdrawals, Social Security, pensions) determines the latter, and it's often lower than your peak-earning rate. Enter both and see which account wins and by how much.\n\nIf they're close, or you're unsure about future tax law, splitting contributions between Roth and Traditional is a sound hedge. Then use the 401(k) calculator to apply this choice to your workplace plan, and the retirement calculator to confirm your overall savings are on track.",
  },

  method: {
    label: "Compares equal pre-tax contributions: Roth after-tax = balance × (1 − current rate); Traditional = balance × (1 − retirement rate)",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Apply this to your 401(k)",
      body: "Most people make this choice inside a workplace 401(k). See how your contribution and employer match project out — then set the pre-tax vs Roth split.",
      ctaLabel: "Open the 401(k) calculator",
      href: "/401k",
    },
  ],
};
