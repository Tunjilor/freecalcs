// Mortgage Payoff Calculator definition. Page content derives from this object
// plus the pure compute in ./compute.ts. Shape mirrors the VA reference build.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months } from "@/lib/calculator/format";
import {
  computeMortgagePayoff,
  type MortgagePayoffInputs,
  type MortgagePayoffResults,
} from "./compute";

const defaults: MortgagePayoffInputs = {
  originalLoan: 300000,
  rate: 6.5,
  termYears: 30,
  yearsPaid: 5,
  extraMonthly: 200,
  lumpSum: 0,
  targetYears: 0,
};

export const mortgagePayoffDef: CalculatorDefinition<MortgagePayoffInputs, MortgagePayoffResults> = {
  slug: "mortgage-payoff",
  hub: "mortgage",
  h1: "Mortgage Payoff Calculator",
  valueProp: "See how extra payments or a lump sum move your mortgage-free date and cut your interest.",
  title: "Mortgage Payoff Calculator: Extra Payments | freecalcs.io",
  metaDescription:
    "Free mortgage payoff calculator: see how extra monthly payments or a lump sum shorten your loan, how much interest you save, and what it takes to finish early.",
  primaryKeyword: "Mortgage Payoff Calculator",
  secondaryKeywords: [
    "pay off mortgage early calculator",
    "extra mortgage payment calculator",
    "mortgage extra payment",
    "early mortgage payoff",
    "biweekly mortgage payments",
  ],
  intro:
    "Every extra dollar you put toward your mortgage principal skips all the interest it would have earned the bank for the rest of the loan. This mortgage payoff calculator starts from your original loan and how long you've been paying, then shows how extra monthly payments or a one-time lump sum change your payoff date and total interest, and what it would take to be mortgage-free by a goal year.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "originalLoan", label: "Original loan amount", type: "currency", default: 300000 },
    { name: "rate", label: "Interest rate", type: "percent", default: 6.5, step: 0.05 },
    { name: "termYears", label: "Original term", type: "years", default: 30, min: 5, max: 40 },
    {
      name: "yearsPaid",
      label: "Years already paid",
      type: "years",
      default: 5,
      min: 0,
      max: 40,
      step: 0.5,
    },
    { name: "extraMonthly", label: "Extra principal / month", type: "currency", default: 200 },
    {
      name: "lumpSum",
      label: "One-time lump sum today",
      type: "currency",
      default: 0,
      helpText: "A bonus, tax refund or inheritance put straight toward principal.",
    },
    {
      name: "targetYears",
      label: "Goal: mortgage-free in (years)",
      type: "years",
      default: 0,
      min: 0,
      max: 40,
      helpText: "Optional. Leave at 0 to skip.",
    },
  ],

  compute: computeMortgagePayoff,

  results: [
    {
      key: "interestSaved",
      label: "Interest saved",
      format: "currency",
      variant: "primary",
      hint: "Compared with paying on schedule from today.",
    },
    { key: "monthsSaved", label: "Months cut from the loan", format: "number", variant: "secondary" },
    { key: "newPayoffMonths", label: "Months left with your plan", format: "number", variant: "secondary" },
    { key: "remainingMonths", label: "Months left on schedule", format: "number", variant: "secondary" },
    { key: "currentBalance", label: "Estimated balance today", format: "currency", variant: "secondary" },
    { key: "monthlyPI", label: "Scheduled principal & interest", format: "currency2", variant: "secondary" },
    { key: "totalExtraPaid", label: "Total extra you'll pay", format: "currency", variant: "secondary" },
    { key: "extraForTarget", label: "Extra / month to hit your goal", format: "currency2", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Balance with your payoff plan",
    yFormat: "currency",
    series: (r) =>
      r.schedule
        .filter((row) => row.month % 12 === 0 || row.month === r.schedule.length)
        .map((row) => ({ x: `Yr ${Math.ceil(row.month / 12)}`, y: row.balance })),
  },

  scenarios: [
    { id: "100", label: "+$100/mo", patch: { extraMonthly: 100 } },
    { id: "500", label: "+$500/mo", patch: { extraMonthly: 500 } },
    { id: "lump", label: "$10k lump sum", patch: { lumpSum: 10000 } },
    { id: "goal15", label: "Done in 15 years", patch: { targetYears: 15 } },
  ],

  insights: [
    {
      id: "plan-result",
      priority: 95,
      tone: "success",
      when: (r) => r.monthsSaved > 0,
      say: (r) =>
        `Your plan pays the mortgage off ${months(r.monthsSaved)} early and saves about ${money(
          r.interestSaved,
        )} in interest. Each $100 you prepay saves about ${money(r.savedPerDollar * 100)} in interest.`,
    },
    {
      id: "target-extra",
      priority: 94,
      when: (r) => r.targetReachable,
      say: (r, v) =>
        `To be mortgage-free in ${v.targetYears} years, you'd need about ${money(
          r.extraForTarget,
        )} extra a month on top of your ${money(r.monthlyPI)} payment${
          v.lumpSum > 0 ? ", counting the lump sum" : ""
        }.`,
    },
    {
      id: "target-already",
      priority: 93,
      tone: "success",
      when: (r) => r.hasTarget && !r.targetReachable,
      say: (r, v) =>
        `Good news: your loan is already scheduled to end within ${v.targetYears} years (${months(
          r.remainingMonths,
        )} left), so no extra payment is needed to hit that goal.`,
    },
    {
      id: "one-extra-per-year",
      priority: 85,
      when: (r) => r.oneExtraMonthsSaved > 0 && r.remainingMonths > 60,
      say: (r) =>
        `One extra payment a year (${money(r.oneExtraPerYear)}, or about ${money(
          r.oneExtraPerYear / 12,
        )} a month) would cut ${months(r.oneExtraMonthsSaved)} and about ${money(
          r.oneExtraInterestSaved,
        )} in interest. That's the same effect biweekly payments have, without paying a service to set them up.`,
    },
    {
      id: "rate-is-return",
      priority: 80,
      when: (r, v) => r.totalExtraPaid > 0 && v.rate >= 6,
      say: (r, v) =>
        `Prepaying a ${v.rate}% mortgage earns a guaranteed, risk-free ${v.rate}% on that money. That beats most savings accounts and bonds, though a 401(k) match or high-interest debt should usually come first.`,
    },
    {
      id: "low-rate-tradeoff",
      priority: 80,
      tone: "warn",
      when: (r, v) => r.totalExtraPaid > 0 && v.rate < 4.5,
      say: (r, v) =>
        `At ${v.rate}%, your mortgage is cheap money. Extra payments still save ${money(
          r.interestSaved,
        )}, but investing the same cash has historically earned more over long periods. Make sure your emergency fund is full first.`,
    },
    {
      id: "no-plan-yet",
      priority: 70,
      when: (r) => r.monthsSaved === 0 && r.remainingMonths > 0 && !r.hasTarget,
      say: (r) =>
        `You have ${months(r.remainingMonths)} and about ${money(
          r.interestRemaining,
        )} of interest left on schedule. Try an extra amount or a lump sum to see how much of that you can keep.`,
    },
  ],

  related: [
    relatedLink("mortgage"),
    relatedLink("refinance"),
    relatedLink("15-vs-30-year-mortgage"),
    relatedLink("loan-payoff"),
    relatedLink("heloc"),
    relatedLink("emergency-fund"),
  ],
  relatedArticles: [
    { slug: "blog/pay-off-mortgage-early", label: "Should you pay off your mortgage early?" },
    { slug: "blog/pay-off-low-rate-mortgage-early", label: "Paying off a low-rate mortgage early" },
    { slug: "blog/15-year-vs-30-year-mortgage", label: "15-year vs 30-year mortgage" },
  ],

  faqs: [
    {
      q: "How much does paying an extra $100 a month save on a mortgage?",
      a: "It depends on your rate and how much is left, but on a typical $300,000, 30-year loan at 6.5%, $100 a month from the start saves about $61,000 of interest and four years. Enter your own numbers above to see the exact figure.",
    },
    {
      q: "Is it better to pay extra monthly or make a lump sum?",
      a: "Money applied sooner saves more, so a lump sum today beats the same total spread over years. In practice, a steady monthly amount is easier to keep up, and both work the same way: they reduce principal so less interest accrues.",
    },
    {
      q: "Do biweekly mortgage payments really help?",
      a: "Yes, but only because 26 half-payments equal 13 full payments a year, one more than normal. You can get the same result by adding one-twelfth of your payment each month, with no setup fees.",
    },
    {
      q: "Will extra payments lower my monthly payment?",
      a: "No. On a standard fixed-rate mortgage, extra principal shortens the loan but the required payment stays the same. If you want a lower payment instead, ask your lender about a recast after a large lump sum.",
    },
    {
      q: "Is there a penalty for paying off a mortgage early?",
      a: "Most U.S. home loans have no prepayment penalty, and FHA, VA and USDA loans never do. Check your closing documents to be sure, and tell your servicer to apply extra money to principal, not future payments.",
    },
    {
      q: "Should I pay off my mortgage or invest?",
      a: "Paying down the loan earns a guaranteed return equal to your rate. If your rate is high, that's hard to beat. If it's low, investing has historically come out ahead. Get your employer match, pay off high-interest debt and fund an emergency account first.",
    },
  ],

  teach: {
    whatIsIt:
      "A mortgage payoff plan is any strategy that pays principal faster than the schedule requires: a fixed extra amount each month, one extra payment a year, or occasional lump sums. Because mortgage interest is charged on the remaining balance, every dollar of principal you pay early stops costing you interest for the rest of the loan.\n\nThis calculator works out your current balance from the original loan and how long you've been paying, so you don't need to dig up a statement. It then compares paying on schedule with your plan.",
    whyItMatters:
      "Early in a mortgage, most of each payment is interest. On a 30-year loan at 6.5%, the first year's payments cover only about $3,300 of principal on a $300,000 loan; the rest is interest. Extra payments go straight to principal, which is why even small amounts cut years off the loan.\n\nThe savings also add up to a guaranteed return. Prepaying a 6.5% mortgage is like earning 6.5% with no risk. Whether that's the best use of your cash depends on your rate, your other debts and your savings, which is why the insights above change with your numbers.",
    whatToDoNext:
      "Before you send extra money, make sure you have an emergency fund, you're getting any 401(k) match, and you have no credit-card debt; those come first. Then confirm your loan has no prepayment penalty and find out how your servicer applies extra payments. Most let you mark them 'principal only' online.\n\nIf you're choosing between a shorter loan and a 30-year loan with extra payments, the 15 vs 30 year mortgage calculator compares the two. If rates have dropped below yours, the refinance calculator will show whether refinancing beats prepaying.",
  },

  method: {
    label:
      "Uses the standard amortization formula: today's balance is derived from the original loan and payments made, then the remaining schedule is re-run with your extra payments applied to principal",
  },

  monetization: [
    {
      kind: "internal",
      headline: "Would refinancing beat prepaying?",
      body: "If today's rates are lower than yours, a refinance could save more than extra payments. Compare it in a minute.",
      ctaLabel: "Open the refinance calculator",
      href: "/refinance",
    },
  ],
};
