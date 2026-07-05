import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money } from "@/lib/calculator/format";
import { FILING_OPTIONS, YEAR_OPTIONS } from "@/lib/calculator/tax-data";
import { computeIncomeTax, type IncomeTaxInputs, type IncomeTaxResults } from "./compute";

const defaults: IncomeTaxInputs = {
  year: "2026",
  filing: "single",
  wages: 85000,
  interest: 0,
  dividends: 0,
  otherIncome: 0,
  deductionType: "standard",
  itemizedAmount: 0,
  contribution401k: 5000,
  hsa: 0,
  studentLoanInterest: 0,
  children: 0,
};

export const incomeTaxDef: CalculatorDefinition<IncomeTaxInputs, IncomeTaxResults> = {
  slug: "tax",
  hub: "tax",
  h1: "Federal Income Tax Calculator",
  valueProp: "Estimate your federal income tax, effective and marginal rate, and take-home for 2025 or 2026.",
  title: "Federal Income Tax Calculator 2025 & 2026 | freecalcs.io",
  metaDescription:
    "Free federal income tax calculator for the 2025 & 2026 tax years. Enter income, filing status, and deductions to see your taxable income, tax owed, effective vs marginal rate, and a bracket-by-bracket breakdown.",
  primaryKeyword: "Federal Income Tax Calculator",
  secondaryKeywords: ["income tax calculator 2026", "federal tax brackets", "effective tax rate", "taxable income calculator"],
  intro:
    "Your tax bracket isn't the rate you pay on everything — it's the rate on your last dollar. This federal income tax calculator applies the 2025 or 2026 brackets and standard deduction to your income, factors in pre-tax deductions and the Child Tax Credit, and shows your tax owed, your true effective rate, and a bracket-by-bracket breakdown of exactly how it's calculated.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "year", label: "Tax year", type: "select", default: "2026", options: YEAR_OPTIONS },
    { name: "filing", label: "Filing status", type: "select", default: "single", options: FILING_OPTIONS },
    { name: "wages", label: "Wages / salary", type: "currency", default: 85000 },
    { name: "interest", label: "Interest income", type: "currency", default: 0 },
    { name: "dividends", label: "Dividend income", type: "currency", default: 0 },
    { name: "otherIncome", label: "Other income", type: "currency", default: 0 },
    {
      name: "deductionType",
      label: "Deduction",
      type: "select",
      default: "standard",
      options: [
        { label: "Standard deduction", value: "standard" },
        { label: "Itemize", value: "itemized" },
      ],
    },
    {
      name: "itemizedAmount",
      label: "Itemized deductions",
      type: "currency",
      default: 0,
      helpText: "Mortgage interest, SALT (capped), charitable gifts, etc.",
      showWhen: (v) => v.deductionType === "itemized",
    },
    { name: "contribution401k", label: "401(k) contribution", type: "currency", default: 5000, helpText: "Traditional (pre-tax) contributions." },
    { name: "hsa", label: "HSA contribution", type: "currency", default: 0 },
    { name: "studentLoanInterest", label: "Student loan interest", type: "currency", default: 0, helpText: "Deductible up to $2,500." },
    { name: "children", label: "Qualifying children", type: "number", default: 0, min: 0, max: 12, step: 1 },
  ],

  compute: computeIncomeTax,

  results: [
    { key: "federalTax", label: "Federal income tax", format: "currency", variant: "primary", hint: "After the standard/itemized deduction and Child Tax Credit — income tax only (not FICA)." },
    { key: "taxableIncome", label: "Taxable income", format: "currency", variant: "secondary" },
    { key: "marginalRate", label: "Marginal rate (top bracket)", format: "percent", variant: "secondary" },
    { key: "effectiveRate", label: "Effective rate", format: "percent", variant: "secondary" },
    { key: "agi", label: "Adjusted gross income", format: "currency", variant: "secondary" },
    { key: "deduction", label: "Deduction taken", format: "currency", variant: "secondary" },
    { key: "childTaxCredit", label: "Child Tax Credit", format: "currency", variant: "secondary" },
    { key: "afterTaxIncome", label: "After-tax income", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "line",
    title: "How tax grows with income (progressive layering)",
    yFormat: "currency",
    series: (r) => r.curve,
  },

  breakdowns: [
    {
      title: "Your tax, bracket by bracket",
      columns: [
        { key: "rate", label: "Rate", format: "percent", align: "left" },
        { key: "amountInBracket", label: "Income taxed here", format: "currency" },
        { key: "taxInBracket", label: "Tax", format: "currency" },
      ],
      rows: (r) =>
        r.brackets.map((b) => ({
          rate: b.rate,
          amountInBracket: b.amountInBracket,
          taxInBracket: b.taxInBracket,
        })),
      note: "Only the income that falls within each bracket is taxed at that bracket's rate — which is why your effective rate is lower than your top bracket.",
    },
  ],

  scenarios: [
    { id: "married", label: "Married filing jointly", patch: { filing: "married" } },
    { id: "y2025", label: "2025 tax year", patch: { year: "2025" } },
    { id: "kids", label: "2 kids", patch: { children: 2 } },
  ],

  insights: [
    {
      id: "marginal-vs-effective",
      priority: 92,
      when: (r, v) => v.wages + v.interest + v.dividends + v.otherIncome > 0,
      say: (r) =>
        `You're in the ${r.marginalRate}% bracket, but your effective rate is only ${r.effectiveRate}% — because only your top dollars are taxed at ${r.marginalRate}%, while the rest is taxed at the lower rates beneath it.`,
    },
    {
      id: "bracket-layers",
      priority: 86,
      when: (r) => r.brackets.length >= 2,
      say: (r) => {
        const first = r.brackets[0];
        const last = r.brackets[r.brackets.length - 1];
        return `Your first ${money(first.amountInBracket)} is taxed at just ${first.rate}%, while only the ${money(
          last.amountInBracket,
        )} in your top bracket is taxed at ${last.rate}% — see the full breakdown table below.`;
      },
    },
    {
      id: "deduction",
      priority: 80,
      tone: "success",
      when: (r) => r.deduction > 0,
      say: (r) =>
        r.deductionKind === "itemized"
          ? `Itemizing ${money(
              r.deduction,
            )} beats the standard deduction, lowering the income your tax is figured on.`
          : `The standard deduction shields your first ${money(
              r.deduction,
            )} of income from federal tax entirely — no itemizing required.`,
    },
    {
      id: "child-credit",
      priority: 78,
      tone: "success",
      when: (r, v) => v.children > 0 && r.childTaxCredit > 0,
      say: (r) => `The Child Tax Credit cut your federal tax by ${money(r.childTaxCredit)}, dollar for dollar.`,
    },
    {
      id: "take-home",
      priority: 70,
      when: (r, v) => v.wages + v.interest + v.dividends + v.otherIncome > 0,
      say: (r) =>
        `After federal income tax you keep ${money(
          r.afterTaxIncome,
        )} of your ${money(r.totalIncome)} — this is income tax only, so subtract FICA and any state tax for true take-home (see the paycheck calculator).`,
    },
  ],

  related: [
    relatedLink("tax-refund"),
    relatedLink("paycheck"),
    relatedLink("self-employment-tax"),
    relatedLink("capital-gains-tax"),
    relatedLink("salary"),
  ],
  relatedArticles: [{ slug: "blog/2026-tax-brackets-guide", label: "2026 tax brackets explained" }],

  faqs: [
    { q: "What's the difference between the 2025 and 2026 tax year?", a: "The 2025 tax year is what you file a return for in early 2026; the 2026 tax year is what you'll file in early 2027 and plan for during 2026. The brackets and standard deduction are slightly higher for 2026 due to inflation adjustments, so the same income can owe a bit less. Use the year toggle to switch." },
    { q: "Does a higher tax bracket mean all my income is taxed at that rate?", a: "No — this is the most common tax misconception. Only the portion of your income above each threshold is taxed at the higher rate; the rest is taxed at the lower rates beneath it. That's why your effective rate (total tax ÷ total income) is always lower than your top bracket. The breakdown table on this page shows exactly how each slice is taxed." },
    { q: "What is the standard deduction for 2026?", a: "For the 2026 tax year it's $16,100 for single filers and married filing separately, $24,150 for heads of household, and $32,200 for married couples filing jointly. You subtract it (or your itemized deductions, whichever is larger) before the brackets apply." },
    { q: "What's the difference between marginal and effective tax rate?", a: "Your marginal rate is the rate on your last dollar of income — your tax bracket. Your effective rate is your total tax divided by your total income. The effective rate is always lower because of the layered, progressive system. This calculator shows both." },
    { q: "Where did self-employment tax, capital gains, and the refund estimate go?", a: "To keep each tool focused, they now have dedicated pages: the self-employment tax calculator for 1099 income, the capital gains tax calculator for investment sales, and the tax refund estimator for comparing your withholding to what you owe. They're linked from this page." },
    { q: "Is this calculator my actual tax bill?", a: "It's a close estimate of federal income tax using your income, filing status, deductions, and the Child Tax Credit. It doesn't include every credit, the FICA payroll tax, state income tax, or special situations, so treat it as a planning tool rather than a filed return." },
  ],

  teach: {
    whatIsIt:
      "Federal income tax is what you owe the IRS on your taxable income — your total income minus adjustments (like 401(k) and HSA contributions) and either the standard deduction or your itemized deductions. The U.S. uses a progressive system: income is taxed in layers, each at its own rate, from 10% up to 37%.\n\nYour 'tax bracket' is just the rate on your highest layer. Credits like the Child Tax Credit then reduce the tax itself, dollar for dollar, after the brackets have done their work.",
    whyItMatters:
      "Understanding the layered system changes decisions. People turn down raises or overtime fearing a higher bracket will 'cost' them — but only the new income is taxed at the higher rate, never the income beneath it. Your effective rate, the number that actually matters for budgeting, is always lower than your bracket.\n\nIt also shows where the levers are: pre-tax contributions lower your taxable income (and can drop you a bracket), the standard deduction shields a large first chunk tax-free, and credits reduce the final bill directly. Seeing the bracket-by-bracket breakdown makes all of this concrete instead of abstract.",
    whatToDoNext:
      "Enter your income, filing status, and deductions, and read the breakdown table to see how each slice of income is taxed. If you're near a bracket edge, a larger 401(k) or HSA contribution might lower both your taxable income and your rate.\n\nThis page covers income tax; for the rest of your picture, use the linked tools: the paycheck calculator for FICA and per-check take-home, the tax refund estimator to check your withholding, and the self-employment and capital-gains calculators if you have 1099 or investment income.",
  },

  method: {
    label: "2025 & 2026 federal brackets, standard deduction, and Child Tax Credit — IRS Rev. Proc. 2024-40 & 2025-32",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Refund or bill this year?",
      body: "This shows the tax you owe. Compare it to what's already been withheld from your pay to project your federal refund or balance due.",
      ctaLabel: "Open the tax refund estimator",
      href: "/tax-refund",
    },
  ],
};
