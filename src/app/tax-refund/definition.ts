import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, ratioPct } from "@/lib/calculator/format";
import { FILING_OPTIONS, YEAR_OPTIONS } from "@/lib/calculator/tax-data";
import { computeTaxRefund, type TaxRefundInputs, type TaxRefundResults } from "./compute";

const defaults: TaxRefundInputs = {
  year: "2026",
  filing: "single",
  income: 75000,
  preTaxDeductions: 5000,
  withheld: 9000,
  children: 0,
  otherCredits: 0,
};

export const taxRefundDef: CalculatorDefinition<TaxRefundInputs, TaxRefundResults> = {
  slug: "tax-refund",
  hub: "tax",
  h1: "Tax Refund Estimator",
  valueProp: "Estimate your federal refund or balance due from income, withholding, and credits.",
  title: "Tax Refund Estimator (2025 & 2026) | freecalcs.io",
  metaDescription:
    "Free tax refund estimator for the 2025 & 2026 tax years. Enter income, withholding, pre-tax deductions, and children to estimate your federal refund or the amount you'll owe.",
  primaryKeyword: "Tax Refund Estimator",
  secondaryKeywords: ["tax refund calculator", "how big will my refund be", "federal refund estimate", "will I owe taxes"],
  intro:
    "Will you get money back or write a check? This tax refund estimator compares what you actually owe in federal income tax — after the standard deduction, pre-tax deductions, and the Child Tax Credit — against what's already been withheld, for the 2025 and 2026 tax years. See your projected refund or balance due, and whether your withholding is on track.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "year", label: "Tax year", type: "select", default: "2026", options: YEAR_OPTIONS },
    { name: "filing", label: "Filing status", type: "select", default: "single", options: FILING_OPTIONS },
    { name: "income", label: "Total income (wages)", type: "currency", default: 75000 },
    { name: "preTaxDeductions", label: "Pre-tax deductions", type: "currency", default: 5000, helpText: "401(k), HSA, and other above-the-line adjustments." },
    { name: "withheld", label: "Federal tax withheld", type: "currency", default: 9000, helpText: "From your W-2 box 2 (or year-to-date pay stubs)." },
    { name: "children", label: "Qualifying children", type: "number", default: 0, min: 0, max: 12, step: 1 },
    { name: "otherCredits", label: "Other tax credits", type: "currency", default: 0, helpText: "Education, energy, or other nonrefundable credits." },
  ],

  compute: computeTaxRefund,

  results: [
    { key: "outcomeLabel", label: "Estimated result", format: "text", variant: "primary", hint: "Federal refund (money back) or balance due for the year." },
    { key: "taxAfterCredits", label: "Your federal tax", format: "currency", variant: "secondary" },
    { key: "withheld", label: "Tax withheld", format: "currency", variant: "secondary" },
    { key: "taxableIncome", label: "Taxable income", format: "currency", variant: "secondary" },
    { key: "taxBeforeCredits", label: "Tax before credits", format: "currency", variant: "secondary" },
    { key: "childTaxCredit", label: "Child Tax Credit", format: "currency", variant: "secondary" },
  ],

  scenarios: [
    { id: "kids", label: "2 kids", patch: { children: 2 } },
    { id: "married", label: "Married filing jointly", patch: { filing: "married" } },
    { id: "y2025", label: "2025 tax year", patch: { year: "2025" } },
  ],

  insights: [
    {
      id: "outcome",
      priority: 92,
      tone: "info",
      when: (r, v) => v.income > 0,
      say: (r) =>
        r.refundOrOwed >= 1
          ? `You're on track for a ${money(
              r.refundOrOwed,
            )} refund. A large refund is an interest-free loan to the IRS — trimming your withholding would put more of that money in each paycheck instead.`
          : r.refundOrOwed <= -1
            ? `You're projected to owe ${money(
                Math.abs(r.refundOrOwed),
              )}. If a balance due tops $1,000, raise your withholding or make an estimated payment to avoid an underpayment penalty.`
            : `You're almost exactly even — your withholding is closely matched to your actual tax, which is the ideal outcome.`,
    },
    {
      id: "ctc",
      priority: 85,
      tone: "success",
      when: (r, v) => v.children > 0 && r.childTaxCredit > 0,
      say: (r, v) =>
        `The Child Tax Credit is cutting your federal tax by up to ${money(
          r.creditsApplied,
        )} (${money(r.childTaxCredit / v.children)} per child), directly increasing your refund or shrinking what you owe.`,
    },
    {
      id: "tax-vs-withheld",
      priority: 78,
      when: (r, v) => v.income > 0,
      say: (r) =>
        `Your actual federal income tax works out to ${money(
          r.taxAfterCredits,
        )} after credits, against ${money(r.withheld)} already withheld — the gap is your refund or bill.`,
    },
    {
      id: "effective-withholding",
      priority: 72,
      when: (r, v) => v.income > 0 && r.withheld > 0,
      say: (r, v) =>
        `You're withholding about ${ratioPct(
          r.effectiveWithholdingRate,
        )} of your ${money(v.income)} income for federal tax.`,
    },
    {
      id: "taxable-income",
      priority: 68,
      when: (r, v) => v.income > 0,
      say: (r) =>
        `Your taxable income is ${money(
          r.taxableIncome,
        )} after the standard deduction and your pre-tax deductions — that's the figure the brackets are applied to.`,
    },
  ],

  related: [
    relatedLink("tax"),
    relatedLink("paycheck"),
    relatedLink("self-employment-tax"),
    relatedLink("salary"),
  ],
  relatedArticles: [
    { slug: "blog/2026-tax-brackets-guide", label: "2026 federal tax brackets guide" },
  ],

  faqs: [
    { q: "How is my tax refund calculated?", a: "A refund is simply the tax you had withheld minus the tax you actually owe. This estimator figures your taxable income (income minus pre-tax and standard deductions), applies the brackets, subtracts credits like the Child Tax Credit, then compares that final tax to what you've had withheld. Withheld more than you owe = refund; less = balance due." },
    { q: "Why do I get a refund at all?", a: "Employers withhold tax from each paycheck based on your W-4. If the total withheld over the year exceeds your actual tax, the IRS returns the difference as a refund. A big refund isn't a bonus — it means you lent the government money interest-free all year and could have kept more in each paycheck." },
    { q: "Is a big refund a good thing?", a: "Not really. It means you over-withheld. That money could have been in your budget, savings, or an investment throughout the year. Many people prefer a small refund or near-zero balance. If your refund is consistently large, adjust your W-4 to reduce withholding." },
    { q: "What is the Child Tax Credit worth?", a: "For 2025 and 2026 it's up to $2,200 per qualifying child under 17, subject to income phase-outs at higher incomes. It's largely a dollar-for-dollar reduction of your tax, and a portion is refundable, so it's one of the most valuable credits for families and a major driver of refunds." },
    { q: "What if the calculator says I'll owe money?", a: "It means your withholding is running behind your tax. If the shortfall is small, you'll just pay it at filing. If it's over $1,000, the IRS may charge an underpayment penalty — increase your W-4 withholding or make a quarterly estimated payment to close the gap before year-end." },
    { q: "How accurate is this estimate?", a: "It's a solid planning estimate using the standard deduction and the main credits. It doesn't capture every situation — itemized deductions, self-employment tax, capital gains, or state tax — so use the full income tax calculator for a more complete picture, and treat this as a directional check on your withholding." },
  ],

  teach: {
    whatIsIt:
      "A tax refund estimator projects whether you'll get money back or owe when you file. The logic is simple: your refund equals the tax withheld from your paychecks minus the tax you actually owe for the year.\n\nThe 'tax you owe' part comes from your taxable income — total income minus pre-tax and standard deductions — run through the brackets, then reduced by credits like the Child Tax Credit. Comparing that to your withholding tells you which way the balance tips.",
    whyItMatters:
      "Most Americans get a refund, and many treat it as forced savings. But a large refund means you gave the IRS an interest-free loan and lived on less all year. Knowing your likely refund early lets you decide whether to adjust your withholding and reclaim that cash flow.\n\nThe flip side matters more: if you're under-withheld — common for people with side income, two earners, or big capital gains — you can owe a surprise bill plus a penalty. Estimating now gives you months to fix it instead of a shock in April.",
    whatToDoNext:
      "Enter your income, current withholding (your latest pay stub's year-to-date figure or W-2 box 2), pre-tax contributions, and kids. If the projected refund is large, submit a new W-4 to reduce withholding and boost each paycheck. If you're set to owe, do the opposite or schedule an estimated payment.\n\nThen use the paycheck calculator to see how a W-4 change affects your take-home, and the full income tax calculator if you itemize or have other income. Re-check mid-year — a raise, a bonus, or a new job can move the number.",
  },

  method: {
    label: "2025 & 2026 brackets, standard deduction, and Child Tax Credit ($2,200/child) per IRS; credits treated as nonrefundable",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Want the full breakdown?",
      body: "For itemized deductions, multiple income types, and a bracket-by-bracket view, use the complete federal income tax calculator.",
      ctaLabel: "Open the income tax calculator",
      href: "/tax",
    },
  ],
};
