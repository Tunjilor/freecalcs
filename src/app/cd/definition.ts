// CD Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import { computeCd, type CdInputs, type CdResults } from "./compute";

const defaults: CdInputs = { deposit: 10000, apy: 4, termMonths: 12, taxRate: 22, inflation: 3 };

export const cdDef: CalculatorDefinition<CdInputs, CdResults> = {
  slug: "cd",
  hub: "investing",
  h1: "CD Calculator",
  valueProp: "See what a certificate of deposit earns by maturity, before and after taxes and inflation.",
  title: "CD Calculator: Certificate of Deposit Interest | freecalcs.io",
  metaDescription:
    "Free CD calculator: how much a certificate of deposit earns by maturity at your APY and term, plus interest after taxes and inflation.",
  primaryKeyword: "CD Calculator",
  secondaryKeywords: ["certificate of deposit calculator", "CD interest calculator", "CD rates calculator", "how much will my CD earn"],
  intro:
    "A certificate of deposit pays a fixed rate for a fixed term, so you can know exactly what you'll have at maturity. This CD calculator uses the APY your bank quotes to show your ending balance and interest. It also shows what's left after income tax and inflation, which is how a CD really compares with other options.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "deposit", label: "Deposit", type: "currency", default: 10000 },
    { name: "apy", label: "APY", type: "percent", default: 4, step: 0.05, helpText: "The annual percentage yield your bank quotes. Rates change often." },
    { name: "termMonths", label: "Term (months)", type: "number", default: 12, min: 1, max: 120 },
    { name: "taxRate", label: "Your income tax rate", type: "percent", default: 22, step: 1, helpText: "CD interest is taxed as ordinary income. Use your federal bracket plus any state tax." },
    { name: "inflation", label: "Expected inflation", type: "percent", default: 3, step: 0.25 },
  ],

  compute: computeCd,

  results: [
    { key: "endingBalance", label: "Balance at maturity", format: "currency2", variant: "primary", hint: "Deposit plus interest." },
    { key: "interestEarned", label: "Interest earned", format: "currency2", variant: "secondary" },
    { key: "taxOnInterest", label: "Estimated tax on interest", format: "currency2", variant: "secondary" },
    { key: "afterTaxInterest", label: "Interest after tax", format: "currency2", variant: "secondary" },
    { key: "afterTaxApy", label: "After-tax yield", format: "percent", variant: "secondary" },
    { key: "realApy", label: "Real yield (after tax & inflation)", format: "percent", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Balance over the term",
      columns: [
        { key: "month", label: "When", format: "text", align: "left" },
        { key: "balance", label: "Balance", format: "currency2", align: "right" },
      ],
      rows: (r) => r.rows,
    },
  ],

  scenarios: [
    { id: "6", label: "6-month CD", patch: { termMonths: 6 } },
    { id: "60", label: "5-year CD", patch: { termMonths: 60 } },
    { id: "ira", label: "In an IRA (no tax now)", patch: { taxRate: 0 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.interestEarned > 0,
      say: (r, v) => `At ${pct(v.apy, 2)} APY, ${money(v.deposit)} grows to ${money(r.endingBalance)} in ${v.termMonths} months, earning ${money(r.interestEarned)}.`,
    },
    {
      id: "real",
      priority: 90,
      when: (r) => r.interestEarned > 0,
      say: (r) =>
        r.realApy > 0
          ? `After tax and inflation, your real yield is ${pct(r.realApy, 2)}, so your buying power still grows.`
          : `After tax and inflation, your real yield is ${pct(r.realApy, 2)}. The CD protects your principal but doesn't keep pace with rising prices.`,
    },
    {
      id: "penalty",
      priority: 80,
      tone: "warn",
      when: () => true,
      say: () => `Withdrawing before maturity usually costs an early withdrawal penalty, often several months of interest. Only lock up money you won't need during the term.`,
    },
    {
      id: "insured",
      priority: 60,
      when: (r, v) => v.deposit > 0,
      say: () => `CDs at FDIC-insured banks and NCUA-insured credit unions are protected up to $250,000 per depositor, per institution, per ownership category.`,
    },
  ],

  related: [relatedLink("compound-interest"), relatedLink("savings-goal"), relatedLink("emergency-fund"), relatedLink("inflation"), relatedLink("simple-interest"), relatedLink("future-value")],
  relatedArticles: [{ slug: "blog/compound-interest-explained", label: "Compound interest explained" }],

  faqs: [
    { q: "How is CD interest calculated?", a: "Banks quote an APY that already includes compounding. Your balance at maturity is deposit × (1 + APY)^(years). A 12-month CD at 4% APY turns $10,000 into $10,400." },
    { q: "Is CD interest taxable?", a: "Yes. CD interest is taxed as ordinary income in the year it's credited, even if the CD hasn't matured, unless the CD is held in an IRA or other tax-advantaged account." },
    { q: "What happens if I withdraw early?", a: "You'll usually pay a penalty, commonly a few months to a year of interest depending on the term. Some banks offer no-penalty CDs at slightly lower rates." },
    { q: "What's the difference between APY and APR on a CD?", a: "APR is the simple annual rate; APY includes the effect of compounding. Always compare CDs by APY." },
    { q: "Are CDs safe?", a: "CDs from FDIC-insured banks or NCUA-insured credit unions are insured up to $250,000 per depositor, per institution, per ownership category." },
  ],

  teach: {
    heading: "What is a CD?",
    whatIsIt:
      "A certificate of deposit is a savings account that locks your money for a set term, from a few months to several years, in exchange for a fixed interest rate. At maturity you get your deposit back plus interest.",
    whyItMatters:
      "CDs trade flexibility for certainty. You know your return in advance, and your principal is insured. That makes them useful for money you'll need on a specific date, like a down payment next year.\n\nBut a fixed rate can lose ground to inflation and taxes, which is why this calculator shows your real yield too.",
    whatToDoNext:
      "Compare APYs across online banks and credit unions, which often pay more than big branch banks. If you want flexibility, consider a CD ladder: splitting money across several terms so one matures every few months.",
  },

  method: { label: "Balance = deposit × (1 + APY)^(months ÷ 12). After-tax yield = APY × (1 − tax rate). Real yield = (1 + after-tax yield) ÷ (1 + inflation) − 1. Insurance limits per FDIC" },

  monetization: [
    { kind: "internal", headline: "Saving toward a goal?", body: "Work out the monthly amount to hit a target by a date, with interest included.", ctaLabel: "Open the savings goal calculator", href: "/savings-goal" },
  ],
};
