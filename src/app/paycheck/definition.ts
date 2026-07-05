import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, ratioPct } from "@/lib/calculator/format";
import { FILING_OPTIONS, YEAR_OPTIONS } from "@/lib/calculator/tax-data";
import { computePaycheck, type PaycheckInputs, type PaycheckResults } from "./compute";

const defaults: PaycheckInputs = {
  year: "2026",
  filing: "single",
  grossPerCheck: 3000,
  frequency: "biweekly",
  preTaxPerCheck: 200,
};

export const paycheckDef: CalculatorDefinition<PaycheckInputs, PaycheckResults> = {
  slug: "paycheck",
  hub: "tax",
  h1: "Paycheck Calculator",
  valueProp: "Estimate your take-home pay per check after federal tax and FICA.",
  title: "Paycheck Calculator (Take-Home Pay) | freecalcs.io",
  metaDescription:
    "Free paycheck calculator for 2025 & 2026. Estimate take-home pay per check from gross, pay frequency, filing status, and pre-tax deductions — federal withholding, Social Security, and Medicare.",
  primaryKeyword: "Paycheck Calculator",
  secondaryKeywords: ["take home pay calculator", "net pay calculator", "paycheck after taxes", "biweekly paycheck"],
  intro:
    "Your gross pay and the number that actually lands in your account are two very different figures. This paycheck calculator estimates your take-home pay per check for the 2025 and 2026 tax years — subtracting an estimate of federal withholding, Social Security, and Medicare, plus any pre-tax deductions — so you can budget around what you really bring home.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "year", label: "Tax year", type: "select", default: "2026", options: YEAR_OPTIONS },
    { name: "filing", label: "Filing status", type: "select", default: "single", options: FILING_OPTIONS },
    { name: "grossPerCheck", label: "Gross pay per check", type: "currency", default: 3000 },
    {
      name: "frequency",
      label: "Pay frequency",
      type: "select",
      default: "biweekly",
      options: [
        { label: "Weekly (52/yr)", value: "weekly" },
        { label: "Every 2 weeks (26/yr)", value: "biweekly" },
        { label: "Twice a month (24/yr)", value: "semimonthly" },
        { label: "Monthly (12/yr)", value: "monthly" },
      ],
    },
    { name: "preTaxPerCheck", label: "Pre-tax deductions per check", type: "currency", default: 200, helpText: "401(k), HSA, etc. — lowers taxable income." },
  ],

  compute: computePaycheck,

  results: [
    { key: "netPerCheck", label: "Take-home per check", format: "currency2", variant: "primary", hint: "After federal tax, Social Security, Medicare, and pre-tax deductions." },
    { key: "federalPerCheck", label: "Federal withholding (est.)", format: "currency2", variant: "secondary" },
    { key: "ficaPerCheck", label: "FICA (SS + Medicare)", format: "currency2", variant: "secondary" },
    { key: "socialSecurityPerCheck", label: "Social Security", format: "currency2", variant: "secondary" },
    { key: "medicarePerCheck", label: "Medicare", format: "currency2", variant: "secondary" },
    { key: "annualNet", label: "Annual take-home", format: "currency", variant: "secondary" },
  ],

  scenarios: [
    { id: "weekly", label: "Paid weekly", patch: { frequency: "weekly" } },
    { id: "monthly", label: "Paid monthly", patch: { frequency: "monthly" } },
    { id: "y2025", label: "2025 tax year", patch: { year: "2025" } },
  ],

  insights: [
    {
      id: "take-home-rate",
      priority: 90,
      when: (r, v) => v.grossPerCheck > 0,
      say: (r, v) =>
        `You take home about ${ratioPct(
          r.takeHomeRate,
        )} of your gross — ${money(r.netPerCheck)} of every ${money(v.grossPerCheck)} check.`,
    },
    {
      id: "ss-cap",
      priority: 85,
      tone: "info",
      when: (r) => r.hitSsCap,
      say: () =>
        `Your income is above the Social Security wage base, so later in the year your Social Security withholding stops and those paychecks get noticeably larger.`,
    },
    {
      id: "fica-share",
      priority: 82,
      when: (r) => r.ficaPerCheck > 0,
      say: (r) =>
        `FICA takes ${money(r.ficaPerCheck)} per check (${money(
          r.socialSecurityPerCheck,
        )} Social Security + ${money(
          r.medicarePerCheck,
        )} Medicare) — a flat payroll tax that applies no matter your bracket.`,
    },
    {
      id: "pretax-benefit",
      priority: 78,
      tone: "success",
      when: (r, v) => v.preTaxPerCheck > 0,
      say: (r, v) =>
        `Your ${money(
          v.preTaxPerCheck,
        )} pre-tax contribution each check lowers your taxable income, so part of it is effectively funded by the federal tax you no longer owe.`,
    },
    {
      id: "annual-net",
      priority: 74,
      when: (r) => r.annualNet > 0,
      say: (r) =>
        `Annualized, that's ${money(r.annualNet)} of take-home pay across ${r.periods} checks — the number to budget your year around.`,
    },
  ],

  related: [
    relatedLink("tax"),
    relatedLink("tax-refund"),
    relatedLink("salary"),
    relatedLink("self-employment-tax"),
  ],
  relatedArticles: [
    { slug: "blog/2026-tax-brackets-guide", label: "2026 federal tax brackets guide" },
  ],

  faqs: [
    { q: "How is take-home pay calculated?", a: "Start with gross pay, subtract pre-tax deductions (like 401(k) and HSA), then subtract federal income tax withholding, Social Security (6.2%), and Medicare (1.45%). What's left is your net, or take-home, pay. State and local taxes, where they apply, come out too — this calculator estimates the federal portion." },
    { q: "How accurate is the federal withholding estimate?", a: "It uses the annualized-bracket method — annualizing your check, applying the standard deduction and tax brackets, then dividing back per period. That closely approximates the IRS Pub. 15-T percentage method employers use, but your actual withholding depends on your W-4 entries, so treat it as a planning estimate." },
    { q: "What is FICA on my paycheck?", a: "FICA is Social Security (6.2% up to the annual wage base) plus Medicare (1.45% on all wages, with an extra 0.9% on high earners). It's a flat payroll tax that funds those programs and is withheld from every paycheck regardless of your income tax bracket." },
    { q: "Do pre-tax deductions increase my take-home pay?", a: "They lower your taxable income, so they reduce your federal tax withholding — meaning a $200 pre-tax 401(k) contribution costs you less than $200 in take-home. It's not free (the money goes into your account, not your pocket), but the tax savings soften the hit." },
    { q: "Why is my first paycheck of the year smaller than my last?", a: "Social Security tax stops once your year-to-date wages hit the wage base. High earners who cross it will see Social Security withholding disappear later in the year, making those checks larger — then it resets each January." },
    { q: "Does this include state income tax?", a: "No. This estimates federal withholding and FICA only. Nine states have no income tax; the rest vary widely. If your state taxes income, subtract that separately to get your true net pay." },
  ],

  teach: {
    whatIsIt:
      "A paycheck calculator turns your gross pay into an estimate of what actually reaches your bank account. Between the two sit federal income tax withholding, Social Security and Medicare (FICA), and any pre-tax deductions you've elected, like retirement or health savings contributions.\n\nWithholding is an estimate your employer makes each pay period based on your W-4 and the IRS tables. FICA is a flat payroll tax. Pre-tax deductions come out before income tax is figured, which is why they lower the tax bite.",
    whyItMatters:
      "People budget around gross pay and then wonder where the money went. On a $3,000 biweekly check, a meaningful slice disappears to withholding and FICA before you ever see it. Knowing your real take-home is the foundation of any working budget.\n\nIt also helps you make decisions: how much a raise actually adds after taxes, whether you can afford a bigger 401(k) contribution (which costs less than its face value in take-home), and how pay frequency changes the size of each check even when annual pay is identical.",
    whatToDoNext:
      "Compare your estimate here to a real pay stub. If they're far apart, your W-4 may need adjusting — too much withholding means a big refund (an interest-free loan to the government), too little means a bill in April.\n\nUse the refund estimator to check whether your withholding is on track for the year, and if you're weighing a bigger pre-tax contribution, re-run this with the higher deduction to see the true cost to your take-home. Remember to subtract state tax separately if your state has one.",
  },

  method: {
    label: "Estimated federal withholding via the annualized-bracket method (approximates IRS Pub. 15-T); FICA and wage base per IRS/SSA for 2025 & 2026",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Big refund or a surprise bill?",
      body: "If your take-home looks off, your withholding may be too. Estimate your full-year federal refund or balance due and fine-tune your W-4.",
      ctaLabel: "Open the tax refund estimator",
      href: "/tax-refund",
    },
  ],
};
