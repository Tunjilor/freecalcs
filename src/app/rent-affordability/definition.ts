// Rent Affordability Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import {
  computeRentAffordability,
  type RentAffordabilityInputs,
  type RentAffordabilityResults,
} from "./compute";

const defaults: RentAffordabilityInputs = { annualIncome: 60000, monthlyTakeHome: 3900, monthlyDebts: 300, otherNeeds: 600, rent: 1600 };

export const rentAffordabilityDef: CalculatorDefinition<RentAffordabilityInputs, RentAffordabilityResults> = {
  slug: "rent-affordability",
  hub: "mortgage",
  h1: "Rent Affordability Calculator",
  valueProp: "Find how much rent you can afford using the 30% rule, the 40x landlord test and your real budget.",
  title: "Rent Affordability Calculator: How Much Rent? | freecalcs.io",
  metaDescription:
    "Free rent affordability calculator: how much rent you can afford by the 30% rule, the landlord 40x income test and your take-home budget, plus a rent check.",
  primaryKeyword: "Rent Affordability Calculator",
  secondaryKeywords: ["how much rent can I afford", "30% rule rent", "40x rent rule", "rent to income ratio"],
  intro:
    "The 30% rule is the classic answer to how much rent you can afford, but landlords use their own test, and your budget may say something else again. This rent affordability calculator runs all three: 30% of gross income, the 40x rent income requirement many landlords use, and what's left in your take-home pay after debts and other needs.",
  commercialIntent: 3,

  defaults,
  inputs: [
    { name: "annualIncome", label: "Gross annual income", type: "currency", default: 60000, helpText: "Before taxes, all roommates or earners on the lease." },
    { name: "monthlyTakeHome", label: "Monthly take-home pay", type: "currency", default: 3900 },
    { name: "monthlyDebts", label: "Monthly debt payments", type: "currency", default: 300, helpText: "Car, student loan and card minimums." },
    { name: "otherNeeds", label: "Other essentials / month", type: "currency", default: 600, helpText: "Groceries, utilities, transportation, insurance." },
    { name: "rent", label: "Rent you're considering", type: "currency", default: 1600, helpText: "Optional. Leave at 0 to just see your limits." },
  ],

  compute: computeRentAffordability,

  results: [
    { key: "recommendedRent", label: "Comfortable rent", format: "currency", variant: "primary", hint: "The lowest of the three limits." },
    { key: "rentAt30", label: "30% of gross income", format: "currency", variant: "secondary" },
    { key: "rentAt40x", label: "Landlord 40x test", format: "currency", variant: "secondary" },
    { key: "rentAt5030", label: "What your budget allows", format: "currency", variant: "secondary" },
    { key: "rentPctGross", label: "Your rent as % of gross", format: "percent", variant: "secondary" },
    { key: "incomeNeeded40x", label: "Income landlords want (40x)", format: "currency", variant: "secondary" },
  ],

  scenarios: [
    { id: "cheaper", label: "Rent $1,300", patch: { rent: 1300 } },
    { id: "roommate", label: "Add a roommate's $40k", patch: { annualIncome: 100000, monthlyTakeHome: 6500 } },
    { id: "no-car", label: "Pay off the car", patch: { monthlyDebts: 0 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.recommendedRent > 0,
      say: (r) =>
        `A comfortable rent for you is about ${money(r.recommendedRent)} a month. The 30% rule allows ${money(r.rentAt30)}, landlords' 40x test allows ${money(
          r.rentAt40x,
        )}, and your take-home budget leaves ${money(r.rentAt5030)} for rent.`,
    },
    {
      id: "burdened",
      priority: 92,
      tone: "warn",
      when: (r) => r.hasRent && r.costBurdened,
      say: (r) =>
        r.severelyBurdened
          ? `At ${pct(r.rentPctGross, 0)} of gross income, this rent would leave you severely cost-burdened by HUD's definition (over 50%).`
          : `This rent is ${pct(r.rentPctGross, 0)} of your gross income, above the 30% guideline HUD uses to define cost-burdened households.`,
    },
    {
      id: "40x",
      priority: 90,
      when: (r) => r.hasRent,
      say: (r) =>
        r.passes40x
          ? `You pass the common 40x income test for this rent.`
          : `Many landlords require income of 40 times the monthly rent, ${money(r.incomeNeeded40x)} a year for this apartment. A guarantor, a co-signer or a larger deposit can sometimes stand in.`,
    },
    {
      id: "budget-tight",
      priority: 85,
      tone: "warn",
      when: (r) => r.rentAt5030 < r.rentAt30 * 0.8,
      say: (r) =>
        `Your debts and other needs leave less room than the 30% rule suggests. Rent above ${money(r.rentAt5030)} would push your essentials past half of your take-home pay.`,
    },
    {
      id: "comfortable",
      priority: 88,
      tone: "success",
      when: (r) => r.hasRent && !r.costBurdened && r.passes40x,
      say: (r) => `At ${pct(r.rentPctGross, 0)} of gross income, this rent fits comfortably.`,
    },
  ],

  related: [relatedLink("rent-vs-buy"), relatedLink("budget"), relatedLink("home-affordability"), relatedLink("salary"), relatedLink("debt-to-income")],
  relatedArticles: [{ slug: "blog/rent-or-buy-a-home", label: "Should you rent or buy a home?" }],

  faqs: [
    { q: "How much rent can I afford?", a: "A common guideline is no more than 30% of your gross monthly income. On $60,000 a year, that's $1,500 a month. If you carry debt or live in a high-cost area, your real budget may be lower." },
    { q: "What is the 40x rent rule?", a: "Many landlords require your annual income to be at least 40 times the monthly rent. For a $1,500 apartment, that means earning $60,000 or more. Some use 30x or 3x monthly rent instead." },
    { q: "Is the 30% rule based on gross or net income?", a: "Gross income, before taxes. That's why this calculator also checks your take-home budget, which is a more realistic test for many people." },
    { q: "What if I can't meet the income requirement?", a: "Options include a co-signer or guarantor, a larger security deposit, prepaying some rent, adding a roommate's income, or showing savings. Policies vary by landlord and state." },
    { q: "Should utilities count toward rent?", a: "If utilities are included in the rent, compare the full amount. If not, budget for them separately; this calculator includes them in 'other essentials'." },
  ],

  teach: {
    heading: "How much rent can you afford?",
    whatIsIt:
      "Rent affordability is the highest rent you can pay without squeezing the rest of your budget. The three common yardsticks are the 30% rule (rent at most 30% of gross income), the landlord's 40x test (annual income at least 40 times the rent) and a take-home budget check.",
    whyItMatters:
      "Rent is usually your largest bill, and it's hard to reduce once you've signed a lease. HUD considers households paying over 30% of income on housing to be cost-burdened, and over 50% severely so. Those households have far less room for savings or emergencies.\n\nThe landlord test matters too: if you don't meet it, you may not get the apartment at all.",
    whatToDoNext:
      "Use the comfortable rent above as a ceiling when you search, and remember to budget for renter's insurance, utilities and moving costs. If you're weighing a lease against buying, the rent vs buy calculator compares the long-term costs.",
  },

  method: { label: "30% rule = 0.30 × gross monthly income; 40x test = annual income ÷ 40; budget = 50% of take-home − debts − other essentials. Cost-burden thresholds per HUD" },

  monetization: [
    { kind: "internal", headline: "Thinking about buying instead?", body: "Compare the long-run cost of renting with owning a home in your area.", ctaLabel: "Open the rent vs buy calculator", href: "/rent-vs-buy" },
  ],
};
