// Net Worth Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import { computeNetWorth, type NetWorthInputs, type NetWorthResults } from "./compute";

const defaults: NetWorthInputs = {
  cash: 15000, retirement: 85000, investments: 20000, homeValue: 350000, vehicles: 18000, otherAssets: 0,
  mortgage: 260000, carLoans: 12000, studentLoans: 20000, creditCards: 3000, otherDebts: 0,
  age: 38, annualIncome: 90000,
};

export const netWorthDef: CalculatorDefinition<NetWorthInputs, NetWorthResults> = {
  slug: "net-worth",
  hub: "investing",
  h1: "Net Worth Calculator",
  valueProp: "Add up what you own and what you owe to see your net worth, and how it compares for your age and income.",
  title: "Net Worth Calculator: What Are You Worth? | freecalcs.io",
  metaDescription:
    "Free net worth calculator: total your assets and debts, see your net worth, liquid net worth and home equity, and compare with a benchmark for your age.",
  primaryKeyword: "Net Worth Calculator",
  secondaryKeywords: ["calculate net worth", "personal net worth", "assets minus liabilities", "net worth by age"],
  intro:
    "Net worth is the single best snapshot of your finances: everything you own minus everything you owe. This net worth calculator totals your assets and debts, separates out the money you could actually reach, and compares your result with a common benchmark for your age and income.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "cash", label: "Cash & savings", type: "currency", default: 15000 },
    { name: "retirement", label: "Retirement accounts", type: "currency", default: 85000, helpText: "401(k), 403(b), IRA, Roth IRA." },
    { name: "investments", label: "Other investments", type: "currency", default: 20000, helpText: "Brokerage accounts, HSA, crypto." },
    { name: "homeValue", label: "Home value", type: "currency", default: 350000 },
    { name: "vehicles", label: "Vehicles (resale value)", type: "currency", default: 18000 },
    { name: "otherAssets", label: "Other assets", type: "currency", default: 0 },
    { name: "mortgage", label: "Mortgage balance", type: "currency", default: 260000 },
    { name: "carLoans", label: "Car loans", type: "currency", default: 12000 },
    { name: "studentLoans", label: "Student loans", type: "currency", default: 20000 },
    { name: "creditCards", label: "Credit card balances", type: "currency", default: 3000 },
    { name: "otherDebts", label: "Other debts", type: "currency", default: 0 },
    { name: "age", label: "Your age", type: "number", default: 38, min: 18, max: 100 },
    { name: "annualIncome", label: "Household income / year", type: "currency", default: 90000 },
  ],

  compute: computeNetWorth,

  results: [
    { key: "netWorth", label: "Your net worth", format: "currency", variant: "primary", hint: "Total assets − total debts." },
    { key: "totalAssets", label: "Total assets", format: "currency", variant: "secondary" },
    { key: "totalLiabilities", label: "Total debts", format: "currency", variant: "secondary" },
    { key: "liquidNetWorth", label: "Liquid net worth", format: "currency", variant: "secondary" },
    { key: "homeEquity", label: "Home equity", format: "currency", variant: "secondary" },
    { key: "debtToAssetPct", label: "Debt-to-asset ratio", format: "percent", variant: "secondary" },
    { key: "benchmark", label: "Age × income ÷ 10 benchmark", format: "currency", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Your balance sheet",
      columns: [
        { key: "item", label: "Item", format: "text", align: "left" },
        { key: "side", label: "Type", format: "text", align: "left" },
        { key: "amount", label: "Amount", format: "currency", align: "right" },
      ],
      rows: (r) => r.rows,
    },
  ],

  scenarios: [
    { id: "no-cards", label: "Pay off credit cards", patch: { creditCards: 0, cash: 12000 } },
    { id: "home-up", label: "Home value +10%", patch: { homeValue: 385000 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.totalAssets > 0 || r.totalLiabilities > 0,
      say: (r) =>
        r.netWorth >= 0
          ? `Your net worth is ${money(r.netWorth)}: ${money(r.totalAssets)} in assets against ${money(r.totalLiabilities)} in debts.`
          : `Your net worth is ${money(r.netWorth)}, meaning you owe ${money(-r.netWorth)} more than you own. That's common early in a career with student loans, and it turns around as debts shrink.`,
    },
    {
      id: "benchmark",
      priority: 88,
      when: (r) => r.benchmark > 0,
      say: (r) =>
        r.vsBenchmarkPct >= 100
          ? `You're above the "age × income ÷ 10" benchmark (${money(r.benchmark)}) from The Millionaire Next Door, at ${pct(r.vsBenchmarkPct, 0)} of it. That's the authors' definition of a strong accumulator.`
          : `The "age × income ÷ 10" rule of thumb from The Millionaire Next Door suggests ${money(r.benchmark)} for you; you're at ${pct(
              r.vsBenchmarkPct,
              0,
            )} of it. It's a demanding benchmark, especially before 40, so treat it as a direction rather than a grade.`,
    },
    {
      id: "home-heavy",
      priority: 80,
      when: (r) => r.netWorth > 0 && r.homeEquity > r.netWorth * 0.6,
      say: (r) =>
        `Home equity is ${pct((r.homeEquity / r.netWorth) * 100, 0)} of your net worth. You can't spend it without selling or borrowing, so your liquid net worth of ${money(
          r.liquidNetWorth,
        )} is a better measure of your flexibility.`,
    },
    {
      id: "cards",
      priority: 85,
      tone: "warn",
      when: (r, v) => v.creditCards > 0 && v.cash > v.creditCards,
      say: (r, v) =>
        `You have ${money(v.cash)} in cash and ${money(v.creditCards)} on credit cards. Paying the cards off doesn't change your net worth today, but at typical card rates above 20% it stops it from leaking every month.`,
    },
    {
      id: "track",
      priority: 60,
      when: () => true,
      say: () => `Recalculate every six or twelve months. The trend matters more than any single number; a rising net worth means your plan is working.`,
    },
  ],

  related: [relatedLink("budget"), relatedLink("retirement"), relatedLink("debt-payoff"), relatedLink("emergency-fund"), relatedLink("investment-return")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate my net worth?", a: "Add up the current value of everything you own, including cash, investments, retirement accounts, your home and vehicles. Subtract everything you owe, such as your mortgage, car loans, student loans and credit cards. The difference is your net worth." },
    { q: "Should I include my home in net worth?", a: "Yes, at a realistic resale value, and subtract the mortgage. Just remember home equity isn't easy to spend, which is why this calculator also shows a liquid net worth." },
    { q: "What is a good net worth for my age?", a: "There's no single answer, but a popular rule of thumb from The Millionaire Next Door is age × annual income ÷ 10. Federal Reserve survey data shows median net worth rises steadily with age, peaking around retirement." },
    { q: "Should I include retirement accounts?", a: "Yes. They're part of your wealth, though withdrawals before 59½ usually face taxes and penalties, and traditional 401(k) and IRA balances will be taxed when withdrawn." },
    { q: "Is a negative net worth bad?", a: "It's normal for many people in their 20s with student loans. What matters is the direction: paying down debt and saving consistently moves it up each year." },
  ],

  teach: {
    whatIsIt:
      "Net worth is assets minus liabilities. Assets are things with value you own; liabilities are debts you owe. It's the personal version of a company's balance sheet.",
    whyItMatters:
      "Income tells you how much flows in; net worth tells you how much you've kept. Two people with the same salary can have very different net worths depending on how much they save and borrow.\n\nTracked over time, it's the clearest measure of financial progress. Paying down a loan, contributing to a 401(k) or letting investments grow all show up as a rising number.",
    whatToDoNext:
      "Write today's number down and set a reminder to recalculate in six months. To grow it, use the budget calculator to find room to save, the debt payoff calculator to clear high-interest balances first, and the retirement calculator to check you're on pace.",
  },

  method: { label: "Net worth = total assets − total liabilities. Liquid net worth = cash + non-retirement investments − non-mortgage debts. Benchmark = age × income ÷ 10 (Stanley & Danko)" },

  monetization: [
    { kind: "internal", headline: "Grow your net worth faster", body: "Find room in your budget to save more each month with the 50/30/20 rule.", ctaLabel: "Open the budget calculator", href: "/budget" },
  ],
};
