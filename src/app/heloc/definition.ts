import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, pct } from "@/lib/calculator/format";
import { computeHeloc, type HelocInputs, type HelocResults } from "./compute";

const defaults: HelocInputs = {
  homeValue: 500000,
  mortgageBalance: 300000,
  cltvLimit: 85,
  drawAmount: 50000,
  rate: 8.5,
  drawPeriodYears: 10,
  repayPeriodYears: 20,
};

export const helocDef: CalculatorDefinition<HelocInputs, HelocResults> = {
  slug: "heloc",
  hub: "mortgage",
  h1: "HELOC Calculator",
  valueProp: "See your available home-equity credit line and interest-only vs repayment payments.",
  title: "HELOC Calculator (Home Equity Line of Credit) | freecalcs.io",
  metaDescription:
    "Free HELOC calculator: estimate your available home equity line of credit from your home value, mortgage balance, and CLTV limit — plus interest-only draw-period and repayment payments.",
  primaryKeyword: "HELOC Calculator",
  secondaryKeywords: ["home equity line of credit", "CLTV calculator", "heloc payment", "available home equity"],
  intro:
    "A home equity line of credit lets you borrow against the equity you've built, up to a lender's combined loan-to-value (CLTV) limit. This calculator estimates how large a credit line you could open, and what the payments look like — the low interest-only payments during the draw period, and the bigger principal-and-interest payments once repayment begins.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "homeValue", label: "Home value", type: "currency", default: 500000 },
    { name: "mortgageBalance", label: "Mortgage balance", type: "currency", default: 300000 },
    { name: "cltvLimit", label: "Lender CLTV limit", type: "percent", default: 85, step: 1, helpText: "Max combined loan-to-value most lenders allow — often 80–90%." },
    { name: "drawAmount", label: "Amount you'd draw", type: "currency", default: 50000 },
    { name: "rate", label: "HELOC interest rate", type: "percent", default: 8.5, step: 0.1 },
    { name: "drawPeriodYears", label: "Draw period (years)", type: "years", default: 10, min: 1, max: 15 },
    { name: "repayPeriodYears", label: "Repayment period (years)", type: "years", default: 20, min: 5, max: 30 },
  ],

  compute: computeHeloc,

  results: [
    { key: "availableCreditLine", label: "Available credit line", format: "currency", variant: "primary", hint: "How much you could borrow at this CLTV limit." },
    { key: "interestOnlyPayment", label: "Interest-only payment (draw)", format: "currency2", variant: "secondary" },
    { key: "repaymentPayment", label: "Repayment payment (P&I)", format: "currency2", variant: "secondary" },
    { key: "totalEquity", label: "Total home equity", format: "currency", variant: "secondary" },
    { key: "maxBorrow", label: "Max combined borrowing", format: "currency", variant: "secondary" },
    { key: "currentCltv", label: "Current CLTV", format: "percent", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Balance over the draw + repayment periods",
    yFormat: "currency",
    series: (r) => r.balancePath,
  },

  scenarios: [
    { id: "cltv90", label: "90% CLTV limit", patch: { cltvLimit: 90 } },
    { id: "draw100", label: "Draw $100k", patch: { drawAmount: 100000 } },
    { id: "shortdraw", label: "5-year draw period", patch: { drawPeriodYears: 5 } },
  ],

  insights: [
    {
      id: "over-limit",
      priority: 96,
      tone: "warn",
      when: (r) => r.overLimit,
      say: (r, v) =>
        `Your mortgage balance already exceeds ${pct(
          v.cltvLimit,
          0,
        )} of your home's value, so no HELOC is available at this CLTV limit. You'd need more equity or a higher-limit lender.`,
    },
    {
      id: "cltv-headroom",
      priority: 90,
      when: (r) => !r.overLimit && r.availableCreditLine > 0,
      say: (r, v) =>
        `At a ${pct(v.cltvLimit, 0)} CLTV limit you could borrow up to ${money(
          r.availableCreditLine,
        )} — that's your equity headroom above your ${money(v.mortgageBalance)} mortgage.`,
    },
    {
      id: "draw-period-cost",
      priority: 84,
      when: (r) => r.draw > 0,
      say: (r) =>
        `During the interest-only draw period you'd pay about ${money2(
          r.interestOnlyPayment,
        )}/month on a ${money(r.draw)} draw — but that payment doesn't reduce the balance at all.`,
    },
    {
      id: "payment-shock",
      priority: 80,
      tone: "warn",
      when: (r) => r.draw > 0 && r.paymentJump > 0,
      say: (r) =>
        `When the draw period ends, payments jump to about ${money2(
          r.repaymentPayment,
        )}/month (up ${money2(r.paymentJump)}) as you start repaying principal. Budget for that step-up before you draw.`,
    },
    {
      id: "equity-note",
      priority: 68,
      when: (r) => r.totalEquity > 0,
      say: (r) =>
        `You hold ${money(
          r.totalEquity,
        )} of equity in the home; a HELOC lets you borrow against part of it without disturbing your existing mortgage rate.`,
    },
  ],

  related: [
    relatedLink("mortgage"),
    relatedLink("refinance"),
    relatedLink("home-affordability"),
    relatedLink("va-loan"),
    relatedLink("loan-payoff"),
  ],

  faqs: [
    { q: "How much can I borrow with a HELOC?", a: "Lenders cap your combined loan-to-value (CLTV) — your mortgage plus the HELOC — usually at 80–90% of your home's value. Your available line is that CLTV limit times the home value, minus your current mortgage balance. On a $500,000 home with a $300,000 mortgage and an 85% limit, that's up to $125,000." },
    { q: "What is CLTV?", a: "Combined loan-to-value is all the debt secured by your home divided by its value. If you owe $300,000 on a $500,000 home, your current CLTV is 60%. Lenders let you borrow up to their CLTV ceiling (often 85%), so the gap between your current CLTV and that ceiling is your borrowing headroom." },
    { q: "What's the difference between the draw period and the repayment period?", a: "The draw period (often 10 years) is when you can borrow and repay flexibly, typically making interest-only payments. When it ends, the repayment period (often 20 years) begins: you can no longer draw, and payments rise to cover principal plus interest, fully paying off the balance." },
    { q: "Why do HELOC payments jump after the draw period?", a: "During the draw period, interest-only payments keep your balance flat. Once repayment starts, you must pay down that entire balance over the remaining term, so the payment steps up — sometimes sharply. This 'payment shock' catches borrowers who only budgeted for the interest-only phase." },
    { q: "Is a HELOC better than a cash-out refinance?", a: "It depends. A HELOC leaves your primary mortgage (and its rate) untouched and only charges interest on what you draw — good if you have a low mortgage rate. A cash-out refinance replaces the whole loan, which can make sense if you'd also lower your rate. Compare both for your situation." },
    { q: "Are HELOC rates fixed or variable?", a: "Most HELOCs have variable rates tied to the prime rate, so your payment can rise or fall over time. Some lenders offer fixed-rate options on portions you draw. This calculator uses the rate you enter; if your rate is variable, run a higher rate to stress-test the payment." },
  ],

  teach: {
    whatIsIt:
      "A HELOC is a revolving credit line secured by your home's equity — the difference between what it's worth and what you still owe. Instead of a lump sum, you get a limit you can draw from as needed, like a credit card backed by your house.\n\nIt works in two phases. During the draw period you borrow and repay flexibly, usually paying only interest. After that, the repayment period begins: the line closes to new draws and you pay off the balance with principal-and-interest payments.",
    whyItMatters:
      "A HELOC can be a flexible, lower-cost way to fund renovations, consolidate debt, or cover big expenses — especially attractive when you have a low first-mortgage rate you don't want to disturb with a refinance. Because you only pay interest on what you draw, an unused line costs little.\n\nThe risks are real, though. It's secured by your home, the rate is usually variable, and the interest-only draw period can lull you into treating it as cheap money — until repayment starts and the payment jumps. Understanding the credit line and both payment phases before you borrow is what keeps a HELOC a tool rather than a trap.",
    whatToDoNext:
      "Estimate your available line here, then decide how much you'd actually draw — borrowing the maximum just because it's available is how people get overextended. Look closely at the repayment-period payment, not just the interest-only figure, and make sure it fits your budget.\n\nBecause most HELOC rates are variable, stress-test by entering a rate a few points higher to see how the payment holds up. And compare against a cash-out refinance if lowering your first-mortgage rate is also on the table.",
  },

  method: {
    label: "Available line = home value × CLTV limit − mortgage balance; payments use the standard amortization formula",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Compare with a cash-out refinance",
      body: "A HELOC keeps your first mortgage intact, but if you'd also lower your rate, a refinance might win. Compare the payment and break-even.",
      ctaLabel: "Open the refinance calculator",
      href: "/refinance",
    },
  ],
};
