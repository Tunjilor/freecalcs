// Sales Tax Calculator definition. State rates come from src/lib/data/sales-tax.ts,
// the same module the compute uses (BUILD-STANDARD §1.8b).

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money2, pct } from "@/lib/calculator/format";
import { SALES_TAX, SALES_TAX_AS_OF, SALES_TAX_SOURCE_URL } from "@/lib/data/sales-tax";
import { computeSalesTax, type SalesTaxInputs, type SalesTaxResults } from "./compute";

const defaults: SalesTaxInputs = { amount: 100, state: "TX", customRate: 0, mode: "add" };

export const salesTaxDef: CalculatorDefinition<SalesTaxInputs, SalesTaxResults> = {
  slug: "sales-tax",
  hub: "tax",
  h1: "Sales Tax Calculator",
  valueProp: "Add sales tax to a price, or back it out of a total, with 2026 rates for every state.",
  title: "Sales Tax Calculator 2026: Rates by State | freecalcs.io",
  metaDescription:
    "Free sales tax calculator with 2026 rates for all 50 states and D.C.: add tax to a price or back it out of a total, using your state average or exact rate.",
  primaryKeyword: "Sales Tax Calculator",
  secondaryKeywords: ["sales tax by state", "reverse sales tax calculator", "how much is sales tax", "state sales tax rates 2026"],
  intro:
    "Sales tax depends on where you buy: a statewide rate plus city and county taxes that can push the total past 10%. This sales tax calculator adds tax to a price or works backward from a receipt total, using each state's average combined rate from the Tax Foundation or the exact rate for your city if you know it.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "amount", label: "Amount", type: "currency", default: 100 },
    {
      name: "mode",
      label: "Calculate",
      type: "select",
      default: "add",
      options: [
        { label: "Add tax to a price", value: "add" },
        { label: "Remove tax from a total", value: "remove" },
      ],
    },
    {
      name: "state",
      label: "State",
      type: "select",
      default: "TX",
      options: SALES_TAX.map((s) => ({ label: s.name, value: s.code })),
    },
    {
      name: "customRate",
      label: "Exact local rate (optional)",
      type: "percent",
      default: 0,
      step: 0.01,
      helpText: "Leave at 0 to use the state's average combined rate. Your city's exact rate is on your receipt or your state revenue site.",
    },
  ],

  compute: computeSalesTax,

  results: [
    { key: "total", label: "Total", format: "currency2", variant: "primary", hint: "Price plus sales tax." },
    { key: "tax", label: "Sales tax", format: "currency2", variant: "secondary" },
    { key: "preTax", label: "Price before tax", format: "currency2", variant: "secondary" },
    { key: "rateUsed", label: "Rate used", format: "percent", variant: "secondary" },
    { key: "stateRate", label: "State base rate", format: "percent", variant: "secondary" },
    { key: "avgLocalRate", label: "Average local rate", format: "percent", variant: "secondary" },
  ],

  reference: {
    heading: `Sales tax rates by state (${SALES_TAX_AS_OF})`,
    body: "Statewide rates plus the population-weighted average of local rates. Your exact rate depends on your city and county.",
    tables: [
      {
        title: "State and average local sales tax rates",
        columns: [
          { key: "name", label: "State", format: "text", align: "left" },
          { key: "state", label: "State rate", format: "percent", align: "right" },
          { key: "avgLocal", label: "Avg. local", format: "percent", align: "right" },
          { key: "combined", label: "Combined", format: "percent", align: "right" },
        ],
        rows: SALES_TAX.map((s) => ({ name: s.name, state: s.state, avgLocal: s.avgLocal, combined: s.combined })),
      },
    ],
  },

  scenarios: [
    { id: "ca", label: "California", patch: { state: "CA" } },
    { id: "ny", label: "New York", patch: { state: "NY" } },
    { id: "fl", label: "Florida", patch: { state: "FL" } },
    { id: "rev", label: "Remove tax from $108.25", patch: { amount: 108.25, mode: "remove" } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.preTax > 0,
      say: (r) =>
        `At ${pct(r.rateUsed, 3).replace(/\.?0+%$/, "%")}, tax on ${money2(r.preTax)} is ${money2(r.tax)}, for a total of ${money2(r.total)}.`,
    },
    {
      id: "average",
      priority: 85,
      when: (r) => !r.usingCustom && r.avgLocalRate > 0,
      say: (r) =>
        `${r.stateName}'s ${pct(r.combinedRate, 2)} is an average: ${pct(r.stateRate, 3).replace(/\.?0+%$/, "%")} state plus about ${pct(r.avgLocalRate, 2)} in local taxes. Enter your city's exact rate for a precise figure.`,
    },
    {
      id: "no-tax",
      priority: 90,
      tone: "success",
      when: (r) => !r.usingCustom && r.combinedRate === 0,
      say: (r) => `${r.stateName} has no general state or local sales tax.`,
    },
    {
      id: "alaska",
      priority: 88,
      when: (r) => !r.usingCustom && r.stateRate === 0 && r.avgLocalRate > 0,
      say: (r) => `${r.stateName} has no statewide sales tax, but some local governments charge their own.`,
    },
    {
      id: "exemptions",
      priority: 60,
      when: () => true,
      say: () => `Many states exempt or reduce tax on groceries and prescription drugs, and some tax clothing differently. Check your state's rules for specific items.`,
    },
  ],

  related: [relatedLink("discount"), relatedLink("percentage"), relatedLink("tax"), relatedLink("auto-loan"), relatedLink("profit-margin")],
  relatedArticles: [{ slug: "blog/2026-tax-brackets-guide", label: "2026 federal tax brackets guide" }],

  faqs: [
    { q: "How do I calculate sales tax?", a: "Multiply the price by the tax rate as a decimal. At 8%, tax on $50 is 50 × 0.08 = $4, for a total of $54." },
    { q: "How do I remove sales tax from a total?", a: "Divide the total by 1 plus the tax rate. If you paid $108.25 at 8.25%, the pre-tax price is 108.25 ÷ 1.0825 = $100, and the tax was $8.25." },
    { q: "Which states have no sales tax?", a: "Delaware, Montana, New Hampshire and Oregon have no statewide or local general sales tax. Alaska has no state sales tax but allows local ones." },
    { q: "Which state has the highest sales tax?", a: "By average combined rate, Louisiana is highest at about 10.13% as of mid-2026, followed by Tennessee, Washington, Arkansas and Alabama. California has the highest statewide base rate at 7.25%." },
    { q: "Why is my receipt's tax different from the state average?", a: "Cities, counties and special districts add their own rates, so the total varies within a state. The state average here is weighted by population; enter your local rate for an exact result." },
  ],

  teach: {
    heading: "How does sales tax work?",
    whatIsIt:
      "Sales tax is a tax on retail purchases, collected by the seller at checkout and passed to the government. In the U.S., 45 states and D.C. charge a statewide sales tax, and many cities and counties add their own on top.",
    whyItMatters:
      "The combined rate can add 10% or more to a purchase, which matters for big-ticket items like cars, appliances and furniture. It also differs a lot across state lines, which is why a price that looks the same can cost noticeably more in one place than another.",
    whatToDoNext:
      "For an exact local rate, check your receipt or your state department of revenue's rate lookup. If you're a business owner, remember you may need to collect sales tax for out-of-state customers too, depending on where you have nexus.",
  },

  method: {
    label: `Tax = price × rate; reverse: price = total ÷ (1 + rate). State and average local rates from the Tax Foundation, ${SALES_TAX_AS_OF}`,
    sourceUrl: SALES_TAX_SOURCE_URL,
    year: 2026,
  },

  monetization: [
    { kind: "internal", headline: "Shopping a sale?", body: "Stack discounts and add tax to see the real checkout price.", ctaLabel: "Open the discount calculator", href: "/discount" },
  ],
};
