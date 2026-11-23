// APY Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money2 } from "@/lib/calculator/format";
import { computeApy, type ApyInputs, type ApyResults } from "./compute";

const defaults: ApyInputs = { rate: 4.5, compounding: "daily", deposit: 10000, monthly: 0, years: 1 };

export const apyCalculatorDef: CalculatorDefinition<ApyInputs, ApyResults> = {
  slug: "apy-calculator",
  hub: "investing",
  h1: "APY Calculator",
  valueProp: "Turn an interest rate into APY and see what your savings will earn.",
  title: "APY Calculator: Annual Percentage Yield | freecalcs.io",
  metaDescription:
    "Free APY calculator: convert an interest rate to annual percentage yield for daily, monthly or quarterly compounding, and see what your savings will earn.",
  primaryKeyword: "APY Calculator",
  secondaryKeywords: ["annual percentage yield calculator", "APR to APY", "APY interest calculator", "high yield savings calculator", "savings interest calculator"],
  intro:
    "Banks advertise savings accounts and CDs by APY, the annual percentage yield, which includes the effect of compounding. This APY calculator converts a stated interest rate to APY for any compounding schedule and shows how much interest your deposit, plus any monthly savings, will earn.",
  commercialIntent: 3,

  defaults,
  inputs: [
    { name: "rate", label: "Interest rate (APR)", type: "percent", default: 4.5, step: 0.01, min: 0, max: 100, helpText: "The stated annual rate before compounding. If the bank already quotes APY, the APY result will match it with annual compounding." },
    {
      name: "compounding",
      label: "Compounding",
      type: "select",
      default: "daily",
      options: [
        { label: "Daily", value: "daily" },
        { label: "Monthly", value: "monthly" },
        { label: "Quarterly", value: "quarterly" },
        { label: "Semiannually", value: "semiannual" },
        { label: "Annually", value: "annual" },
        { label: "Continuously", value: "continuous" },
      ],
    },
    { name: "deposit", label: "Initial deposit", type: "currency", default: 10000 },
    { name: "monthly", label: "Monthly deposit (optional)", type: "currency", default: 0 },
    { name: "years", label: "Years", type: "years", default: 1, min: 0, max: 100, step: 0.5 },
  ],

  compute: computeApy,

  results: [
    { key: "apyLabel", label: "APY", format: "text", variant: "primary", hint: "Annual percentage yield, including compounding." },
    { key: "interest", label: "Interest earned", format: "currency2", variant: "secondary" },
    { key: "endBalance", label: "Ending balance", format: "currency2", variant: "secondary" },
    { key: "totalDeposits", label: "Total deposited", format: "currency2", variant: "secondary" },
  ],

  chart: { kind: "area", title: "Balance over time", yFormat: "currency", series: (r) => r.path },

  breakdowns: [
    {
      title: "Same rate, different compounding",
      columns: [
        { key: "compounding", label: "Compounding", format: "text", align: "left" },
        { key: "apy", label: "APY", format: "text", align: "right" },
        { key: "interest", label: "Interest earned", format: "currency2", align: "right" },
      ],
      rows: (r) => r.byCompounding,
      note: "Interest assumes the rate stays the same for the whole period; savings rates can change at any time.",
    },
  ],

  scenarios: [
    { id: "hysa", label: "High-yield savings, 5 years", patch: { years: 5, monthly: 200 } },
    { id: "cd", label: "1-year CD, monthly compounding", patch: { compounding: "monthly", years: 1, monthly: 0 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r, v) => v.rate > 0,
      say: (r, v) => `A ${v.rate}% rate compounded ${v.compounding === "semiannual" ? "semiannually" : v.compounding === "annual" ? "annually" : v.compounding === "continuous" ? "continuously" : v.compounding} works out to an APY of ${r.apyLabel}, ${r.boost.toFixed(3)} points more than the stated rate.`,
    },
    {
      id: "earn",
      priority: 90,
      when: (r) => r.interest > 0,
      say: (r, v) => `Over ${v.years} year${v.years === 1 ? "" : "s"}, you'd earn ${money2(r.interest)} in interest, for an ending balance of ${money2(r.endBalance)}.`,
    },
    {
      id: "compare",
      priority: 80,
      when: (r, v) => v.rate > 0,
      say: () => `When comparing accounts, compare APY to APY. Two accounts with the same APY pay the same, whatever their compounding schedule.`,
    },
    {
      id: "inflation",
      priority: 70,
      when: (r) => r.apy > 0 && r.apy < 3,
      tone: "warn",
      say: () => `An APY under about 3% may not keep up with inflation. High-yield savings accounts and CDs often pay more than a standard savings account.`,
    },
    {
      id: "tax",
      priority: 60,
      when: (r) => r.interest > 10,
      say: () => `Interest from savings and CDs is taxed as ordinary income, and banks send a 1099-INT once you earn $10 or more in a year.`,
    },
    { id: "zero", priority: 95, when: (r, v) => v.rate <= 0, say: () => `Enter the account's interest rate to see its APY.` },
  ],

  related: [relatedLink("cd"), relatedLink("compound-interest"), relatedLink("savings-goal"), relatedLink("simple-interest"), relatedLink("emergency-fund"), relatedLink("inflation")],
  relatedArticles: [{ slug: "blog/compound-interest-explained", label: "Compound interest explained" }],

  faqs: [
    { q: "What is APY?", a: "Annual percentage yield is the interest you actually earn in a year, including interest on interest. A 5% rate compounded daily has an APY of about 5.13%." },
    { q: "What's the difference between APR and APY?", a: "APR is the stated annual rate without compounding; APY includes it. Lenders tend to quote APR on loans and banks quote APY on savings, because APY is the bigger number." },
    { q: "How do you calculate APY?", a: "APY = (1 + r ÷ n)^n − 1, where r is the annual rate as a decimal and n is the number of compounding periods a year (365 for daily, 12 for monthly)." },
    { q: "Does daily or monthly compounding make a big difference?", a: "Not much at savings-account rates. At 5%, daily compounding gives 5.127% APY and monthly gives 5.116%: about $1 a year more per $10,000." },
    { q: "Is APY guaranteed?", a: "On a CD, the rate is usually locked for the term. On savings and money market accounts, the bank can change the rate at any time, so your actual earnings may differ." },
  ],

  teach: {
    heading: "What is APY and how does it work?",
    whatIsIt:
      "APY (annual percentage yield) is the yearly return on a deposit once compounding is included. Each time interest is added to your balance, the next interest payment is calculated on the larger amount.",
    whyItMatters:
      "APY puts every account on the same footing, so you can compare a daily-compounding savings account with a monthly-compounding CD and see which actually pays more.",
    whatToDoNext:
      "Compare the APY your bank pays with high-yield savings and CD offers. For longer goals, see how regular deposits grow with the savings goal or compound interest calculators.",
  },

  method: { label: "APY = (1 + r/n)^n − 1 (continuous: e^r − 1); balances grow at the APY, with monthly deposits added at month-end" },

  monetization: [
    { kind: "internal", headline: "Locking in a rate?", body: "See what a certificate of deposit earns by term and compounding.", ctaLabel: "Open the CD calculator", href: "/cd" },
  ],
};
