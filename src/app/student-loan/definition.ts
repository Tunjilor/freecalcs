// Student Loan Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months, pct } from "@/lib/calculator/format";
import { computeStudentLoan, type StudentLoanInputs, type StudentLoanResults } from "./compute";

const defaults: StudentLoanInputs = { balance: 35000, rate: 6.5, termYears: 10, extraMonthly: 0, annualIncome: 55000 };

export const studentLoanDef: CalculatorDefinition<StudentLoanInputs, StudentLoanResults> = {
  slug: "student-loan",
  hub: "loans",
  h1: "Student Loan Calculator",
  valueProp: "See your student loan payment, total interest and how fast extra payments clear the balance.",
  title: "Student Loan Calculator: Payment & Payoff | freecalcs.io",
  metaDescription:
    "Free student loan calculator: monthly payment and total interest, how extra payments shorten payoff, and the 10-year vs 25-year repayment trade-off.",
  primaryKeyword: "Student Loan Calculator",
  secondaryKeywords: ["student loan payment calculator", "student loan payoff calculator", "pay off student loans early", "student loan interest"],
  intro:
    "Student loans follow the same math as any fixed-rate loan, but the repayment term you choose can change the total cost by thousands. This student loan calculator shows your monthly payment and total interest, what extra payments save, and how the standard 10-year plan compares with stretching payments over 25 years.",
  commercialIntent: 4,

  defaults,
  inputs: [
    { name: "balance", label: "Loan balance", type: "currency", default: 35000, helpText: "Total across your loans. Use a weighted average rate if they differ." },
    { name: "rate", label: "Interest rate", type: "percent", default: 6.5, step: 0.05 },
    { name: "termYears", label: "Repayment term", type: "years", default: 10, min: 1, max: 30 },
    { name: "extraMonthly", label: "Extra payment / month", type: "currency", default: 0 },
    { name: "annualIncome", label: "Gross annual income", type: "currency", default: 55000, helpText: "Used to show your payment as a share of income." },
  ],

  compute: computeStudentLoan,

  results: [
    { key: "monthlyPayment", label: "Monthly payment", format: "currency2", variant: "primary", hint: "Required payment, before any extra." },
    { key: "totalInterest", label: "Total interest", format: "currency", variant: "secondary" },
    { key: "totalPaid", label: "Total repaid", format: "currency", variant: "secondary" },
    { key: "payoffMonths", label: "Months to pay off", format: "number", variant: "secondary" },
    { key: "interestSaved", label: "Interest saved by extra payments", format: "currency", variant: "secondary" },
    { key: "paymentPctIncome", label: "Payment as % of income", format: "percent", variant: "secondary" },
  ],

  chart: { kind: "area", title: "Balance over time", yFormat: "currency", series: (r) => r.series },

  breakdowns: [
    {
      title: "10-year vs 25-year repayment",
      columns: [
        { key: "plan", label: "Plan", format: "text", align: "left" },
        { key: "pmt", label: "Monthly", format: "currency2", align: "right" },
        { key: "interest", label: "Total interest", format: "currency", align: "right" },
      ],
      rows: (r) => [
        { plan: "Standard (10 years)", pmt: r.pmt10, interest: r.interest10 },
        { plan: "Extended (25 years)", pmt: r.pmt25, interest: r.interest25 },
      ],
      note: "Federal Extended repayment requires more than $30,000 in Direct Loans. Income-driven plans work differently and aren't modeled here.",
    },
  ],

  scenarios: [
    { id: "extra100", label: "+$100/month", patch: { extraMonthly: 100 } },
    { id: "refi", label: "Refinance to 4.5%", patch: { rate: 4.5 } },
    { id: "25", label: "25-year term", patch: { termYears: 25 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.monthlyPayment > 0,
      say: (r, v) =>
        `You'll pay ${money(r.monthlyPayment)} a month and ${money(r.totalInterest)} in interest, ${pct((r.totalInterest / v.balance) * 100, 0)} on top of what you borrowed.`,
    },
    {
      id: "extra",
      priority: 92,
      tone: "success",
      when: (r) => r.monthsSaved > 0,
      say: (r, v) => `Paying ${money(v.extraMonthly)} extra a month clears the loan ${months(r.monthsSaved)} sooner and saves ${money(r.interestSaved)}.`,
    },
    {
      id: "extended",
      priority: 85,
      when: (r) => r.interest25 > r.interest10,
      say: (r) =>
        `Stretching to 25 years would drop the payment to ${money(r.pmt25)} but cost ${money(r.interest25 - r.interest10)} more in interest than the 10-year plan.`,
    },
    {
      id: "burden",
      priority: 88,
      tone: "warn",
      when: (r) => r.paymentPctIncome > 10,
      say: (r) =>
        `Your payment is ${pct(r.paymentPctIncome, 1)} of gross income, above the roughly 10% that many advisers consider manageable. If these are federal loans, an income-driven repayment plan could lower it; check StudentAid.gov.`,
    },
    {
      id: "federal-note",
      priority: 60,
      when: () => true,
      say: () => `If you have federal loans and work in public service, look into Public Service Loan Forgiveness before paying extra or refinancing. Refinancing federal loans into a private loan ends eligibility.`,
    },
  ],

  related: [relatedLink("loan-payoff"), relatedLink("debt-payoff"), relatedLink("debt-to-income"), relatedLink("personal-loan"), relatedLink("budget"), relatedLink("final-grade")],
  relatedArticles: [],

  faqs: [
    { q: "How is a student loan payment calculated?", a: "For a fixed-rate loan, the payment that pays off the balance over the term is P × r ÷ (1 − (1 + r)^−n), where r is the monthly rate and n the number of payments. The standard federal plan uses a 10-year term." },
    { q: "Should I pay off student loans early?", a: "If your rate is high and you have an emergency fund and retirement savings on track, extra payments save real money. If you might qualify for forgiveness, paying extra could cost you, so check first." },
    { q: "What's the difference between Standard and Extended repayment?", a: "Standard repayment pays federal loans off in 10 years. Extended stretches them over up to 25 years for borrowers with more than $30,000 in Direct Loans, lowering the payment but raising total interest substantially." },
    { q: "Does this include income-driven repayment?", a: "No. Income-driven plans base payments on your income and family size, and rules change frequently. Use the Loan Simulator on StudentAid.gov for those." },
    { q: "Should I refinance my student loans?", a: "Refinancing private loans to a lower rate can save money. Refinancing federal loans into a private loan also lowers the rate, but you lose federal protections like income-driven plans, deferment and forgiveness." },
  ],

  teach: {
    heading: "How does student loan repayment work?",
    whatIsIt:
      "Most student loans are fixed-rate installment loans: you pay the same amount each month, and each payment covers the month's interest first and reduces the balance with the rest. The term, often 10 years for federal loans, sets how big the payment is.",
    whyItMatters:
      "The term is the biggest lever on total cost. Spreading the same balance over 25 years instead of 10 can more than double the interest. Extra payments work the other way: every dollar goes to principal and stops costing interest for the rest of the loan.\n\nFederal loans also come with options private loans don't, like income-driven repayment and forgiveness programs, which can matter more than the interest rate.",
    whatToDoNext:
      "Log in to StudentAid.gov (federal) or your servicer's site to confirm each loan's balance and rate. If you can afford extra payments, tell your servicer to apply them to the highest-rate loan. If the payment is a strain, explore income-driven plans before missing a payment.",
  },

  method: { label: "Standard fixed-rate amortization: payment = P × r ÷ (1 − (1 + r)^−n); extra payments reduce principal monthly. Extended repayment eligibility per Federal Student Aid" },

  monetization: [
    { kind: "internal", headline: "Juggling more than student loans?", body: "Plan a payoff order across all your debts with the snowball or avalanche method.", ctaLabel: "Open the debt payoff calculator", href: "/debt-payoff" },
  ],
};
