import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months, pct } from "@/lib/calculator/format";
import {
  computePersonalLoan,
  type PersonalLoanInputs,
  type PersonalLoanResults,
} from "./compute";

const defaults: PersonalLoanInputs = {
  principal: 20000,
  apr: 11,
  termMonths: 48,
  originationFeePct: 5,
  extraPayment: 0,
};

export const personalLoanDef: CalculatorDefinition<PersonalLoanInputs, PersonalLoanResults> = {
  slug: "personal-loan",
  hub: "loans",
  h1: "Personal Loan Calculator",
  valueProp: "See your monthly payment, total interest, and the true APR once fees are counted.",
  title: "Personal Loan Calculator | freecalcs.io",
  metaDescription:
    "Free personal loan calculator: monthly payment, total interest, and the true APR after the origination fee. Compare terms and see how extra payments cut your cost.",
  primaryKeyword: "Personal Loan Calculator",
  secondaryKeywords: ["personal loan payment", "true APR calculator", "origination fee", "loan interest calculator"],
  intro:
    "A personal loan's advertised rate rarely tells the whole story: an origination fee is skimmed off the top, so you receive less than you borrow but repay the full amount. This calculator shows your real monthly payment, the total interest, and — crucially — the true APR once that fee is counted, so you can compare offers on equal footing.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "principal", label: "Loan amount", type: "currency", default: 20000 },
    { name: "apr", label: "APR", type: "percent", default: 11, step: 0.1 },
    { name: "termMonths", label: "Term (months)", type: "months", default: 48, min: 6, max: 120 },
    {
      name: "originationFeePct",
      label: "Origination fee",
      type: "percent",
      default: 5,
      step: 0.25,
      helpText: "A one-time fee (often 1–8%) deducted from the money you receive.",
    },
    { name: "extraPayment", label: "Extra principal / month", type: "currency", default: 0 },
  ],

  compute: computePersonalLoan,

  results: [
    { key: "monthlyPayment", label: "Estimated monthly payment", format: "currency2", variant: "primary", hint: "Fixed principal & interest each month." },
    { key: "amountReceived", label: "Money you receive", format: "currency", variant: "secondary", hint: "Principal minus the origination fee" },
    { key: "trueApr", label: "True APR (with fee)", format: "percent", variant: "secondary" },
    { key: "originationFee", label: "Origination fee", format: "currency", variant: "secondary" },
    { key: "totalInterest", label: "Total interest", format: "currency", variant: "secondary" },
    { key: "totalCost", label: "Total cost (interest + fee)", format: "currency", variant: "secondary" },
    { key: "totalRepaid", label: "Total repaid", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Loan balance over time",
    yFormat: "currency",
    series: (r) => r.schedule.map((row) => ({ x: `Mo ${row.month}`, y: row.balance })),
  },

  scenarios: [
    { id: "nofee", label: "No origination fee", patch: { originationFeePct: 0 } },
    { id: "term36", label: "36-month term", patch: { termMonths: 36 } },
    { id: "extra", label: "Add $100/mo", patch: { extraPayment: 100 } },
  ],

  insights: [
    {
      id: "fee-true-apr",
      priority: 92,
      tone: "warn",
      when: (r, v) => v.originationFeePct > 0 && r.trueApr > v.apr + 0.05,
      say: (r, v) =>
        `Your quoted ${pct(v.apr)} APR is really about ${pct(
          r.trueApr,
        )} once the ${money(r.originationFee)} origination fee is counted — because you repay the full ${money(
          v.principal,
        )} but only receive ${money(r.amountReceived)}.`,
    },
    {
      id: "no-fee",
      priority: 88,
      tone: "success",
      when: (r, v) => v.originationFeePct === 0,
      say: (r, v) =>
        `With no origination fee, the ${pct(v.apr)} APR is your true cost — you receive the full ${money(
          v.principal,
        )} you borrow. That's a meaningfully better deal than a fee-laden loan at the same rate.`,
    },
    {
      id: "interest-share",
      priority: 80,
      when: (r, v) => r.totalInterest > 0,
      say: (r, v) =>
        `You'll pay ${money(r.totalInterest)} in interest over ${months(
          v.termMonths,
        )} — plan around the total cost of ${money(r.totalCost)}, not just the monthly payment.`,
    },
    {
      id: "cost-of-borrowing",
      priority: 76,
      when: (r, v) => r.totalCost > 0,
      say: (r, v) =>
        `All in, borrowing ${money(v.principal)} here costs ${money(
          r.totalCost,
        )} — ${money(r.totalInterest)} of interest plus the ${money(
          r.originationFee,
        )} fee — spread over the life of the loan.`,
    },
    {
      id: "extra-active",
      priority: 78,
      tone: "success",
      when: (r, v) => v.extraPayment > 0 && r.monthsSaved > 0,
      say: (r, v) =>
        `Adding ${money(v.extraPayment)}/month clears the loan about ${months(
          r.monthsSaved,
        )} early and saves roughly ${money(r.interestSaved)} in interest.`,
    },
    {
      id: "extra-lever",
      priority: 70,
      when: (r, v) => v.extraPayment === 0 && r.leverInterestSaved > 0,
      say: (r) =>
        `Putting an extra ${money(r.leverExtra)}/month toward principal would save about ${money(
          r.leverInterestSaved,
        )} in interest and finish ${months(r.leverMonthsSaved)} sooner.`,
    },
  ],

  related: [
    relatedLink("loan"),
    relatedLink("auto-loan"),
    relatedLink("debt-payoff"),
    relatedLink("loan-payoff"),
  ],

  faqs: [
    { q: "What is an origination fee and how does it work?", a: "An origination fee is a one-time charge (commonly 1–8% of the loan) that most personal-loan lenders deduct from the money you receive. If you borrow $20,000 with a 5% fee, $1,000 is taken off the top — you get $19,000 but still repay $20,000 plus interest. That's why it raises your true APR." },
    { q: "What's the difference between APR and interest rate?", a: "The interest rate is the cost of borrowing the principal. The APR is meant to include fees like origination, so it reflects the true annual cost. When a loan has an origination fee, its real APR is higher than the quoted rate — this calculator computes that true APR for you." },
    { q: "How is my monthly payment calculated?", a: "The payment amortizes the full loan amount at your APR over the term: P × [r(1+r)^n] / [(1+r)^n − 1]. The origination fee doesn't change the payment (you repay the full principal); it changes how much you actually received, and therefore your true APR." },
    { q: "Is a shorter or longer term better?", a: "A shorter term means a higher monthly payment but much less total interest; a longer term lowers the payment but costs more overall. If the payment is affordable, the shorter term almost always wins — unless you're using the loan to consolidate higher-rate debt and need the cash-flow room." },
    { q: "Can I pay off a personal loan early?", a: "Most personal loans have no prepayment penalty, so extra payments go straight to principal and save interest. Confirm there's no penalty in your agreement, then use the extra-payment field to see the savings. The origination fee, however, is not refundable once the loan is issued." },
    { q: "What credit score do I need for a good rate?", a: "The best personal-loan APRs generally go to borrowers with scores in the high 600s and above; below that, rates rise steeply and fees are more common. Pre-qualifying with several lenders (a soft credit check) lets you compare real offers without hurting your score." },
  ],

  teach: {
    whatIsIt:
      "A personal loan is an unsecured, fixed-rate installment loan: no collateral, a set number of equal monthly payments, and a fixed payoff date. People use them to consolidate credit-card debt, cover a large expense, or finance something a specialized loan won't.\n\nBecause they're unsecured, rates are higher than a mortgage or auto loan, and most lenders charge an origination fee that comes out of the amount you receive. The interest math is ordinary amortization — the fee is the part borrowers most often overlook.",
    whyItMatters:
      "The origination fee is what makes two 'same rate' loans genuinely different. A 5% fee on a four-year loan can add two to three points to your effective APR — so an 11% loan with a fee can cost more than a 13% loan without one. Comparing only the advertised rate can lead you to the more expensive loan.\n\nThat's why the true APR matters. It rolls the fee into a single annual number you can line up against any other offer, including a 0% balance-transfer card or a HELOC, to see which is actually cheapest for your situation.",
    whatToDoNext:
      "Pre-qualify with several lenders — most use a soft credit check that won't affect your score — and collect the rate, term, and origination fee for each. Drop those numbers in here to compare true APRs, not headline rates.\n\nIf you're consolidating debt, check that the loan's true APR is actually lower than the rates you're replacing; if it isn't, you're just moving the balance. And if you can afford a shorter term or a small extra payment, use the scenarios above to see how much interest that saves.",
  },

  method: {
    label: "Uses the standard amortization formula; true APR solved from the payment stream and the net amount received",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Consolidating debt? Compare your payoff plan first",
      body: "If this loan is meant to wipe out credit cards, check whether the snowball or avalanche method — with no new loan at all — gets you debt-free faster and cheaper.",
      ctaLabel: "Open the debt payoff calculator",
      href: "/debt-payoff",
    },
  ],
};
