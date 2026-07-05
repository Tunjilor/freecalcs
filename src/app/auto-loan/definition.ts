import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, months, ratioPct } from "@/lib/calculator/format";
import { computeAutoLoan, type AutoLoanInputs, type AutoLoanResults } from "./compute";

const defaults: AutoLoanInputs = {
  vehiclePrice: 35000,
  downPayment: 3000,
  tradeIn: 0,
  salesTaxRate: 7,
  fees: 500,
  termMonths: 60,
  apr: 6.5,
  extraPayment: 0,
};

export const autoLoanDef: CalculatorDefinition<AutoLoanInputs, AutoLoanResults> = {
  slug: "auto-loan",
  hub: "loans",
  h1: "Auto Loan Calculator",
  valueProp: "Estimate your car payment with trade-in, sales tax, fees, and extra payments.",
  title: "Auto Loan Calculator | freecalcs.io",
  metaDescription:
    "Free auto loan calculator: estimate your monthly car payment including down payment, trade-in, sales tax, and dealer fees. See total interest, total cost, and how extra payments help.",
  primaryKeyword: "Auto Loan Calculator",
  secondaryKeywords: ["car payment calculator", "auto loan interest", "car loan APR", "vehicle finance calculator"],
  intro:
    "Buying a car is really two decisions — the price and the financing — and the second one quietly costs thousands. This auto loan calculator turns your vehicle price, down payment, trade-in, sales tax, and APR into a real monthly payment, then shows the total interest and the true out-the-door cost so you can negotiate the loan, not just the sticker.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "vehiclePrice", label: "Vehicle price", type: "currency", default: 35000 },
    { name: "downPayment", label: "Down payment", type: "currency", default: 3000 },
    { name: "tradeIn", label: "Trade-in value", type: "currency", default: 0, helpText: "In most states, a trade-in lowers the sales tax you owe." },
    { name: "salesTaxRate", label: "Sales tax rate", type: "percent", default: 7, step: 0.1 },
    { name: "fees", label: "Dealer & registration fees", type: "currency", default: 500, helpText: "Doc, title, and registration fees financed into the loan." },
    { name: "termMonths", label: "Loan term (months)", type: "months", default: 60, min: 12, max: 96 },
    { name: "apr", label: "APR", type: "percent", default: 6.5, step: 0.1 },
    { name: "extraPayment", label: "Extra principal / month", type: "currency", default: 0 },
  ],

  compute: computeAutoLoan,

  results: [
    { key: "monthlyPayment", label: "Estimated monthly payment", format: "currency2", variant: "primary", hint: "Principal & interest on the financed amount." },
    { key: "amountFinanced", label: "Amount financed", format: "currency", variant: "secondary" },
    { key: "totalInterest", label: "Total interest", format: "currency", variant: "secondary" },
    { key: "salesTax", label: "Sales tax", format: "currency", variant: "secondary" },
    { key: "taxAndFees", label: "Tax & fees financed", format: "currency", variant: "secondary" },
    { key: "totalCost", label: "Total of payments", format: "currency", variant: "secondary" },
    { key: "totalOutOfPocket", label: "Total out of pocket", format: "currency", variant: "secondary" },
  ],

  chart: {
    kind: "area",
    title: "Loan balance over time",
    yFormat: "currency",
    series: (r) => r.schedule.map((row) => ({ x: `Mo ${row.month}`, y: row.balance })),
  },

  scenarios: [
    { id: "term48", label: "48-month term", patch: { termMonths: 48 }, blurb: "Shorter term, less interest." },
    { id: "down", label: "Put $5,000 down", patch: { downPayment: 5000 } },
    { id: "extra", label: "Add $100/mo", patch: { extraPayment: 100 } },
  ],

  insights: [
    {
      id: "interest-share",
      priority: 90,
      when: (r) => r.totalInterest > 0,
      say: (r, v) =>
        `Over this loan you'll pay about ${money(r.totalInterest)} in interest — roughly ${ratioPct(
          r.interestShareOfPrice,
        )} of the car's ${money(v.vehiclePrice)} price on top of the price itself.`,
    },
    {
      id: "long-term-warning",
      priority: 85,
      tone: "warn",
      when: (r, v) => v.termMonths >= 72,
      say: (r, v) =>
        `A ${v.termMonths}-month term keeps the payment low but stretches ${money(
          r.totalInterest,
        )} of interest across ${months(v.termMonths)} — and cars depreciate faster than the loan pays down, so you can owe more than it's worth for years.`,
    },
    {
      id: "tax-fees",
      priority: 75,
      when: (r) => r.taxAndFees > 0,
      say: (r) =>
        `${money(r.taxAndFees)} of sales tax and fees got rolled into the loan, so you're financing — and paying interest on — that amount too, not just the car.`,
    },
    {
      id: "down-payment",
      priority: 72,
      when: (r, v) => v.vehiclePrice > 0 && v.downPayment / v.vehiclePrice < 0.2,
      say: (r, v) =>
        `Your down payment is ${ratioPct(
          v.downPayment / v.vehiclePrice,
        )} of the price. Putting 20% down (about ${money(
          0.2 * v.vehiclePrice,
        )}) would shrink the payment and help you avoid owing more than the car is worth.`,
    },
    {
      id: "extra-active",
      priority: 80,
      tone: "success",
      when: (r, v) => v.extraPayment > 0 && r.monthsSaved > 0,
      say: (r, v) =>
        `Your extra ${money(v.extraPayment)}/month pays the car off about ${months(
          r.monthsSaved,
        )} early and saves roughly ${money(r.interestSaved)} in interest.`,
    },
    {
      id: "extra-lever",
      priority: 70,
      when: (r, v) => v.extraPayment === 0 && r.leverInterestSaved > 0,
      say: (r) =>
        `Adding just ${money(r.leverExtra)}/month would clear the loan about ${months(
          r.leverMonthsSaved,
        )} sooner and save around ${money(r.leverInterestSaved)} in interest.`,
    },
  ],

  related: [
    relatedLink("loan"),
    relatedLink("personal-loan"),
    relatedLink("loan-payoff"),
    relatedLink("debt-payoff"),
  ],

  faqs: [
    { q: "How is a car loan payment calculated?", a: "Your payment uses the standard amortization formula on the amount financed (vehicle price + sales tax + fees − down payment − trade-in): P × [r(1+r)^n] / [(1+r)^n − 1], where r is the monthly APR and n is the number of months. Early payments are mostly interest; later ones are mostly principal." },
    { q: "Does a trade-in reduce my sales tax?", a: "In most U.S. states, yes — sales tax is charged on the price minus your trade-in value, so a trade-in lowers both the amount financed and the tax. A handful of states tax the full price; this calculator uses the common trade-in-credit rule." },
    { q: "Is a longer loan term a good idea?", a: "A longer term (72–84 months) lowers the monthly payment but increases total interest and keeps you 'underwater' — owing more than the car is worth — for longer, because cars depreciate quickly. If you can afford the payment on a 48–60 month term, it usually costs far less overall." },
    { q: "How much should I put down on a car?", a: "A common guideline is 10–20% down on a used car and at least 20% on a new one, enough to offset first-year depreciation so you're not immediately underwater. A larger down payment lowers your payment and total interest and can improve your rate." },
    { q: "Can I pay off my auto loan early?", a: "Usually yes, and it saves interest because auto loans are simple-interest. Check your contract for a prepayment penalty first (rare but possible). Use the extra-payment field to see exactly how much time and interest an extra amount each month saves." },
    { q: "What APR should I expect on an auto loan?", a: "Rates depend heavily on credit score, loan term, and whether the car is new or used. Buyers with strong credit see the lowest rates; longer terms and used cars carry higher ones. Always get pre-approved by your own bank or credit union before the dealership so you have a rate to beat." },
  ],

  teach: {
    whatIsIt:
      "An auto loan is a secured, amortizing loan: the car is the collateral, and you repay a fixed amount each month that covers interest plus a shrinking slice of the principal. The amount you actually finance isn't just the sticker price — it's the price plus sales tax and dealer fees, minus your down payment and trade-in.\n\nThat 'amount financed' is what interest is charged on, which is why rolling taxes and fees into the loan quietly raises your total cost: you pay interest on them for the life of the loan.",
    whyItMatters:
      "Dealers negotiate in monthly payments because a lower payment can hide a longer term and thousands more in interest. A $35,000 car at 6.5% costs about $4,600 in interest over 60 months — but stretch it to 84 months for a smaller payment and the interest climbs sharply while the car keeps depreciating.\n\nSeeing the total interest and out-the-door cost — not just the payment — is what lets you compare offers honestly. Two loans with the same monthly payment can differ by thousands once you account for term length and fees.",
    whatToDoNext:
      "Get pre-approved by your own bank or credit union before you shop, so you walk in with a rate to beat and can treat dealer financing as just another quote. Negotiate the car's price and the financing separately — never let them be blended into 'what payment are you looking for?'\n\nThen use the scenarios above to test a shorter term, a bigger down payment, or an extra monthly payment. Even a modest extra amount each month can shave months off the loan and keep you from being underwater.",
  },

  method: {
    label: "Uses the standard amortization formula; sales tax follows the common trade-in-credit rule (tax charged on price − trade-in)",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Compare this to a personal loan",
      body: "Financing a private-party car or a vehicle a dealer won't finance? A personal loan may be an option. Compare the payment and true cost side by side before you commit.",
      ctaLabel: "Open the personal loan calculator",
      href: "/personal-loan",
    },
  ],
};
