// The VA Loan Calculator definition — the gold-standard reference. Everything
// on the page is derived from this object + the pure compute in ./compute.ts.
// To build calculator #2, copy this shape; don't rebuild the page.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months, pct } from "@/lib/calculator/format";
import {
  computeVaLoan,
  fundingFeeRate,
  type VaLoanInputs,
  type VaLoanResults,
} from "./compute";

const defaults: VaLoanInputs = {
  homePrice: 400000,
  downPayment: 0,
  rate: 6.5,
  termYears: 30,
  usage: "first",
  exempt: "no",
  financeFee: "yes",
  extraPayment: 0,
  propTaxAnnual: 4800,
  insuranceAnnual: 1500,
  hoaMonthly: 0,
};

export const vaLoanDef: CalculatorDefinition<VaLoanInputs, VaLoanResults> = {
  slug: "va-loan",
  hub: "mortgage",
  h1: "VA Loan Calculator",
  valueProp: "Estimate your $0-down VA mortgage payment, funding fee, and lifetime cost.",
  title: "VA Loan Calculator | freecalcs.io",
  metaDescription:
    "Free VA loan calculator: estimate your $0-down monthly payment, VA funding fee by tier, and total cost — with no PMI. See how disability exemption and extra payments change your numbers.",
  primaryKeyword: "VA Loan Calculator",
  secondaryKeywords: [
    "VA funding fee",
    "VA loan payment",
    "VA loan no down payment",
    "VA loan vs conventional",
  ],
  intro:
    "The VA loan is the strongest mortgage benefit most veterans and service members will ever have: buy with $0 down, pay no monthly mortgage insurance, and often get a lower rate than a conventional loan. This calculator estimates your monthly payment, the one-time VA funding fee for your exact scenario, and what the loan costs over its life.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "homePrice", label: "Home price", type: "currency", default: 400000 },
    {
      name: "downPayment",
      label: "Down payment",
      type: "currency",
      default: 0,
      helpText: "$0 is allowed with a VA loan. Putting 5%+ down lowers your funding fee.",
    },
    { name: "rate", label: "Interest rate", type: "percent", default: 6.5, step: 0.05 },
    { name: "termYears", label: "Loan term", type: "years", default: 30, min: 8, max: 30 },
    {
      name: "usage",
      label: "VA loan usage",
      type: "select",
      default: "first",
      options: [
        { label: "First-time use", value: "first" },
        { label: "Used my VA loan before", value: "subsequent" },
      ],
      helpText: "Subsequent use raises the fee only if you put less than 5% down.",
    },
    {
      name: "exempt",
      label: "Funding-fee exempt?",
      type: "select",
      default: "no",
      options: [
        { label: "No", value: "no" },
        { label: "Yes — disability comp / Purple Heart / surviving spouse", value: "yes" },
      ],
      helpText: "Veterans receiving service-connected disability compensation pay no funding fee.",
    },
    {
      name: "financeFee",
      label: "Funding fee",
      type: "select",
      default: "yes",
      options: [
        { label: "Roll into the loan (standard)", value: "yes" },
        { label: "Pay in cash at closing", value: "no" },
      ],
      showWhen: (v) => v.exempt === "no",
    },
    {
      name: "extraPayment",
      label: "Extra principal / month",
      type: "currency",
      default: 0,
      helpText: "VA loans never charge a prepayment penalty.",
    },
    { name: "propTaxAnnual", label: "Property tax / year", type: "currency", default: 4800 },
    { name: "insuranceAnnual", label: "Home insurance / year", type: "currency", default: 1500 },
    { name: "hoaMonthly", label: "HOA / month", type: "currency", default: 0 },
  ],

  compute: computeVaLoan,

  results: [
    {
      key: "totalMonthly",
      label: "Estimated monthly payment",
      format: "currency2",
      variant: "primary",
      hint: "Principal, interest, taxes & insurance — VA loans carry no PMI.",
    },
    { key: "monthlyPI", label: "Principal & interest", format: "currency2", variant: "secondary" },
    { key: "fundingFeeAmount", label: "VA funding fee", format: "currency", variant: "secondary" },
    { key: "fundingFeeRate", label: "Funding fee rate", format: "percent", variant: "secondary" },
    { key: "baseLoan", label: "Base loan (price − down)", format: "currency", variant: "secondary" },
    { key: "loanAmount", label: "Total loan amount", format: "currency", variant: "secondary" },
    { key: "monthlyPMI", label: "Monthly PMI", format: "currency2", variant: "secondary" },
    { key: "totalInterest", label: "Total interest", format: "currency", variant: "secondary" },
    { key: "totalCost", label: "Total of payments", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Loan balance over time",
    yFormat: "currency",
    series: (r) =>
      r.schedule.map((row) => ({
        x: `Yr ${Math.ceil(row.month / 12)}`,
        y: row.balance,
      })),
  },

  scenarios: [
    { id: "exempt", label: "I'm funding-fee exempt", patch: { exempt: "yes" }, blurb: "Disabled veterans pay $0 funding fee." },
    { id: "down5", label: "Put 5% down", patch: { downPayment: 20000 }, blurb: "Drops the funding fee to 1.50%." },
    { id: "extra", label: "Add $250/mo", patch: { extraPayment: 250 } },
    { id: "fifteen", label: "15-year loan", patch: { termYears: 15 } },
  ],

  insights: [
    {
      id: "exempt-saving",
      priority: 96,
      tone: "success",
      when: (r, v) => v.exempt === "yes",
      say: (r, v) => {
        const wouldBe = r.baseLoan * fundingFeeRate(v.usage, "no", r.downPaymentPct);
        return `Because you're funding-fee exempt, you skip the ${money(
          wouldBe,
        )} funding fee a non-exempt borrower would owe at this price and down payment — one of the largest single savings the VA benefit offers.`;
      },
    },
    {
      id: "funding-fee-tier",
      priority: 95,
      when: (r, v) => v.exempt === "no" && r.fundingFeeAmount > 0,
      say: (r, v) =>
        `At ${pct(r.downPaymentPct, r.downPaymentPct % 1 === 0 ? 0 : 1)} down on a ${
          v.usage === "subsequent" ? "subsequent" : "first-time"
        } VA loan, your funding fee is ${pct(r.fundingFeeRate)} — ${money(r.fundingFeeAmount)}${
          r.fundingFeeFinanced ? ", rolled into the loan so you owe nothing extra at closing" : ", paid in cash at closing"
        }.`,
    },
    {
      id: "no-down-no-pmi",
      priority: 90,
      tone: "success",
      when: (r) => r.downPaymentPct < 1,
      say: (r) =>
        `You're buying with $0 down — VA is one of the only ways to do that. And unlike a low-down-payment conventional loan, there's no PMI, which would run about ${money(
          r.conventionalPmiMonthly,
        )}/month on this purchase.`,
    },
    {
      id: "vs-conventional-pmi",
      priority: 85,
      when: (r) => r.conventionalPmiTotal > 0 && r.vaVsConventionalUpfrontSaving > 0,
      say: (r) =>
        `A comparable conventional loan would carry roughly ${money(
          r.conventionalPmiMonthly,
        )}/month in PMI until you reach 20% equity — about ${money(
          r.conventionalPmiTotal,
        )} in total. Your one-time VA funding fee comes out around ${money(
          r.vaVsConventionalUpfrontSaving,
        )} ahead.`,
    },
    {
      id: "extra-payment-active",
      priority: 80,
      tone: "success",
      when: (r, v) => v.extraPayment > 0 && r.monthsSaved > 0,
      say: (r, v) =>
        `Your extra ${money(v.extraPayment)}/month clears the loan about ${months(
          r.monthsSaved,
        )} early and saves roughly ${money(r.interestSaved)} in interest — with no prepayment penalty.`,
    },
    {
      id: "extra-payment-lever",
      priority: 70,
      when: (r, v) => v.extraPayment === 0 && r.leverInterestSaved > 0,
      say: (r) =>
        `Adding ${money(r.leverExtra)}/month toward principal would pay this off about ${months(
          r.leverMonthsSaved,
        )} early and save around ${money(
          r.leverInterestSaved,
        )} in interest. VA loans never charge a prepayment penalty.`,
    },
    {
      id: "subsequent-use-tip",
      priority: 60,
      tone: "warn",
      when: (r, v) => v.exempt === "no" && v.usage === "subsequent" && r.downPaymentPct < 5,
      say: (r) =>
        `Because this is a subsequent VA loan under 5% down, your fee is the higher 3.30% tier (${money(
          r.fundingFeeAmount,
        )}). Putting just 5% down would drop it to 1.50%.`,
    },
  ],

  related: [
    relatedLink("mortgage"),
    relatedLink("qualify"),
    relatedLink("rent-vs-buy"),
    relatedLink("loan"),
  ],
  relatedArticles: [
    { slug: "blog/using-your-va-loan-twice", label: "Using your VA loan twice (entitlement & the fee waiver)" },
    { slug: "blog/va-loan-eligibility", label: "VA loan eligibility explained" },
    { slug: "blog/fha-vs-conventional-vs-va-vs-usda", label: "FHA vs Conventional vs VA vs USDA" },
  ],

  faqs: [
    {
      q: "Can I really buy with $0 down on a VA loan?",
      a: "Yes. For eligible veterans and service members with full entitlement, the VA guarantees the loan so lenders can finance 100% of the purchase price with no down payment and no monthly mortgage insurance. You still pay closing costs and the one-time funding fee (unless exempt).",
    },
    {
      q: "How much is the VA funding fee?",
      a: "For a purchase, first-time use is 2.15% of the loan with less than 5% down, 1.50% with 5–9.99% down, and 1.25% with 10%+ down. Subsequent use is 3.30% under 5% down (the 1.50% and 1.25% tiers are the same). Veterans receiving service-connected disability compensation are exempt.",
    },
    {
      q: "Do VA loans have PMI?",
      a: "No. VA loans never carry private mortgage insurance, even at $0 down. That is one of the biggest monthly savings versus a conventional or FHA loan, where low down payments trigger mortgage insurance that can cost hundreds of dollars a month.",
    },
    {
      q: "Is the VA funding fee waived for disabled veterans?",
      a: "Yes. Veterans receiving (or entitled to receive) compensation for a service-connected disability are exempt from the funding fee entirely, as are Purple Heart recipients on active duty and eligible surviving spouses. Set 'Funding-fee exempt' to Yes to see your numbers with no fee.",
    },
    {
      q: "Can I use my VA loan benefit more than once?",
      a: "Yes — there is no lifetime limit and no first-time-buyer requirement. Selling a VA-financed home and paying off the loan restores your full entitlement so you can buy again with $0 down. This calculator's 'subsequent use' option reflects the higher funding-fee tier that can apply.",
    },
    {
      q: "Should I roll the funding fee into the loan or pay it at closing?",
      a: "You can do either. Financing the fee keeps cash in your pocket but adds it to your balance, so you pay interest on it over the life of the loan. Paying it in cash at closing costs more upfront but slightly lowers your monthly payment and total interest. Toggle 'Funding fee' to compare.",
    },
  ],

  teach: {
    whatIsIt:
      "A VA loan is a mortgage guaranteed by the U.S. Department of Veterans Affairs and available to eligible veterans, active-duty service members, National Guard and Reserve members, and some surviving spouses. The VA doesn't lend the money — private lenders do — but its guarantee lets them offer terms no other loan matches: no down payment, no private mortgage insurance, and competitive rates.\n\nThe main cost unique to the program is the VA funding fee, a one-time charge that helps keep the program running at no cost to taxpayers. Its size depends on your down payment, whether this is your first VA loan, and whether you qualify for an exemption.",
    whyItMatters:
      "For most buyers, the down payment and mortgage insurance are the two biggest obstacles to homeownership. A conventional buyer putting 5% down on a $400,000 home needs $20,000 upfront and then pays PMI — often $150–$250 a month — until they reach 20% equity, which can take a decade. A VA borrower can buy the same home with nothing down and never pay a cent of mortgage insurance.\n\nThat difference compounds. The money you don't spend on a down payment stays invested or in savings, and the PMI you never pay can add up to tens of thousands of dollars over the years it would otherwise apply. The funding fee is real, but for most borrowers it is far smaller than the PMI a conventional loan would charge — and it's waived entirely for veterans with a service-connected disability rating.",
    whatToDoNext:
      "Start by confirming your eligibility and requesting your Certificate of Eligibility (COE) — your lender can usually pull it in minutes. If you receive VA disability compensation, make sure your lender codes you as funding-fee exempt; it's a common, expensive oversight.\n\nThen shop at least three VA-approved lenders. Rates and lender fees vary more than most buyers expect, and because the loan terms are standardized, the rate and closing costs are where you actually save. Use the scenarios above to see how a small down payment, an exemption, or an extra principal payment changes your numbers, then take those figures into your rate conversations.",
  },

  method: {
    label:
      "Uses the standard amortization formula and the VA purchase funding-fee schedule effective April 7, 2023 (current for 2026)",
    sourceUrl: "https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/",
    year: 2026,
  },

  // Default monetization is a relevant INTERNAL next step (no commission, no
  // disclosure), per BUILD-STANDARD §6. When a real, disclosed VA-lender offer
  // exists, swap this to `{ kind: "affiliate", href: "<offer-url>", ... }` — the
  // <AffiliateCTA> variant is already wired.
  monetization: [
    {
      kind: "internal",
      headline: "See if you qualify for a VA loan",
      body: "You've got the numbers — now check eligibility. Our mortgage qualifier walks you through the VA (and every other) loan program in a couple of minutes, no sign-up required.",
      ctaLabel: "Check if you qualify",
      href: "/qualify",
    },
  ],
};
