// Debt-to-Income Calculator definition. Page content derives from this object
// plus the pure compute in ./compute.ts.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import { computeDti, type DtiInputs, type DtiResults } from "./compute";

const defaults: DtiInputs = {
  annualIncome: 84000,
  housingPayment: 1900,
  carPayments: 450,
  studentLoans: 250,
  creditCardMinimums: 100,
  otherDebts: 0,
};

export const dtiDef: CalculatorDefinition<DtiInputs, DtiResults> = {
  slug: "debt-to-income",
  hub: "mortgage",
  h1: "Debt-to-Income Ratio Calculator",
  valueProp: "Find your DTI ratio and see which mortgage programs it qualifies for.",
  title: "Debt-to-Income (DTI) Ratio Calculator | freecalcs.io",
  metaDescription:
    "Free DTI calculator: your front-end and back-end debt-to-income ratios, the 28/36 rule, and whether you meet conventional, FHA, VA and USDA limits.",
  primaryKeyword: "Debt-to-Income Ratio Calculator",
  secondaryKeywords: [
    "DTI calculator",
    "debt to income ratio",
    "DTI for mortgage",
    "front-end and back-end ratio",
    "28/36 rule calculator",
  ],
  intro:
    "Your debt-to-income ratio is one of the first numbers a mortgage lender checks. This debt-to-income ratio calculator works out both versions lenders use, the front-end ratio for housing alone and the back-end ratio for all your debts, then shows whether you meet the limits for conventional, FHA, VA and USDA loans and how much debt you'd need to pay off to get there.",
  commercialIntent: 4,

  defaults,
  inputs: [
    {
      name: "annualIncome",
      label: "Gross annual income",
      type: "currency",
      default: 84000,
      helpText: "Before taxes. Include every borrower on the loan.",
    },
    {
      name: "housingPayment",
      label: "Housing payment / month",
      type: "currency",
      default: 1900,
      helpText: "For a new home: principal, interest, taxes, insurance, PMI and HOA.",
    },
    { name: "carPayments", label: "Car payments / month", type: "currency", default: 450 },
    { name: "studentLoans", label: "Student loans / month", type: "currency", default: 250 },
    {
      name: "creditCardMinimums",
      label: "Credit card minimums / month",
      type: "currency",
      default: 100,
      helpText: "The minimum due, not the full balance.",
    },
    {
      name: "otherDebts",
      label: "Other debts / month",
      type: "currency",
      default: 0,
      helpText: "Personal loans, child support, alimony. Not utilities, phone or groceries.",
    },
  ],

  compute: computeDti,

  results: [
    {
      key: "backEnd",
      label: "Back-end DTI (all debts)",
      format: "percent",
      variant: "primary",
      hint: "The ratio lenders weigh most.",
    },
    { key: "bandLabel", label: "Where you stand", format: "text", variant: "secondary" },
    { key: "frontEnd", label: "Front-end DTI (housing only)", format: "percent", variant: "secondary" },
    { key: "grossMonthly", label: "Gross monthly income", format: "currency", variant: "secondary" },
    { key: "totalDebt", label: "Total monthly debt", format: "currency", variant: "secondary" },
    { key: "maxHousingRule", label: "Max housing payment (28/36 rule)", format: "currency", variant: "secondary" },
    { key: "debtCutTo36", label: "Monthly debt to cut to reach 36%", format: "currency", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Loan program check",
      columns: [
        { key: "program", label: "Program", format: "text", align: "left" },
        { key: "limit", label: "DTI limit", format: "text", align: "right" },
        { key: "status", label: "Your DTI", format: "text", align: "right" },
      ],
      rows: (r) =>
        r.programs.map((p) => ({
          program: p.program,
          limit: p.frontLimit === null ? `${p.backLimit}%` : `${p.frontLimit}% / ${p.backLimit}%`,
          status: p.passes ? "Within limit" : "Over limit",
        })),
      note: "Limits shown as front-end / back-end. Lenders can approve above these with strong credit, savings or automated underwriting.",
    },
  ],

  scenarios: [
    { id: "no-car", label: "Pay off the car", patch: { carPayments: 0 } },
    { id: "cheaper-home", label: "Housing $300 lower", patch: { housingPayment: 1600 } },
    { id: "raise", label: "$10k raise", patch: { annualIncome: 94000 } },
  ],

  insights: [
    {
      id: "band",
      priority: 99,
      tone: "info",
      when: (r) => r.band !== "na",
      say: (r) =>
        `Your back-end DTI is ${pct(r.backEnd, 1)}: ${money(r.totalDebt)} of debt payments on ${money(
          r.grossMonthly,
        )} of monthly income. ${
          r.band === "excellent"
            ? "That's inside the 36% guideline, so DTI shouldn't hold back your approval."
            : r.band === "good"
              ? "Most lenders will approve this, though you may not get their very best pricing."
              : r.band === "stretch"
                ? "Some lenders will go this high, but usually only with good credit and cash reserves."
                : "Above 50%, most mortgage lenders will decline, so lowering it comes first."
        }`,
    },
    {
      id: "cut-to-36",
      priority: 90,
      when: (r) => r.debtCutTo36 > 0 && r.band !== "na",
      say: (r) =>
        `To reach 36%, you'd need to cut about ${money(r.debtCutTo36)} a month from your payments, or earn about ${money(
          (r.debtCutTo36 / 0.36) * 12,
        )} more a year.${r.debtCutTo43 > 0 ? ` Getting under FHA's 43% standard limit takes ${money(r.debtCutTo43)} a month.` : ""}`,
    },
    {
      id: "front-end-high",
      priority: 85,
      tone: "warn",
      when: (r) => r.frontEnd > 31,
      say: (r) =>
        `Your housing payment alone is ${pct(r.frontEnd, 1)} of income, above the 28% conventional guideline and FHA's 31%. Under the 28/36 rule, a payment around ${money(
          r.maxHousingRule,
        )} would fit.`,
    },
    {
      id: "small-debt-lever",
      priority: 80,
      when: (r, v) => r.backEnd > 36 && v.creditCardMinimums > 0 && v.creditCardMinimums >= r.debtCutTo36,
      say: (r, v) =>
        `Paying off your credit cards would remove ${money(
          v.creditCardMinimums,
        )} of monthly minimums — enough on its own to bring you under 36%. Lenders count the minimum, so even a small card balance matters.`,
    },
    {
      id: "programs",
      priority: 75,
      when: (r) => r.band !== "na",
      say: (r) =>
        r.programsPassing === r.programs.length
          ? `You're within the standard DTI limits of every major loan program, including the strict 28/36 rule.`
          : r.programsPassing === 0
            ? `You're over the standard DTI limit of every major loan program. Paying down debt or adding a co-borrower's income would change that.`
            : `You're within the standard limits of ${r.programsPassing} of ${r.programs.length} loan programs checked below.`,
    },
    {
      id: "headroom",
      priority: 70,
      tone: "success",
      when: (r) => r.band === "excellent" && r.maxHousingAt36 > 0,
      say: (r) =>
        `Keeping your other debts where they are, the 28/36 rule allows a housing payment up to about ${money(
          r.maxHousingRule,
        )} a month. Use that as a ceiling when you shop, not a target.`,
    },
  ],

  related: [
    relatedLink("qualify"),
    relatedLink("home-affordability"),
    relatedLink("mortgage"),
    relatedLink("fha-loan"),
    relatedLink("debt-payoff"),
    relatedLink("credit-card-payoff"),
  ],
  relatedArticles: [
    { slug: "blog/28-36-rule-mortgage", label: "The 28/36 rule for mortgages" },
    { slug: "blog/can-i-buy-a-house-with-640-credit-score", label: "Can I buy a house with a 640 credit score?" },
    { slug: "blog/fha-loan-requirements", label: "FHA loan requirements in 2026" },
  ],

  faqs: [
    {
      q: "What is a good debt-to-income ratio?",
      a: "36% or lower is considered strong, with no more than 28% going to housing. Most lenders approve up to 43%, and some conventional and FHA loans go to 45% to 50% or higher with good credit and savings.",
    },
    {
      q: "What's the difference between front-end and back-end DTI?",
      a: "Front-end DTI counts only your housing payment, including taxes, insurance and HOA dues. Back-end DTI adds every other monthly debt payment. Lenders look at both, but back-end is usually the deciding number.",
    },
    {
      q: "What debts count in DTI?",
      a: "Recurring debts that show on your credit report or in court orders: mortgage or rent for the new home, car loans, student loans, credit card minimums, personal loans, child support and alimony. Utilities, phone bills, insurance and groceries don't count.",
    },
    {
      q: "Is DTI based on gross or net income?",
      a: "Gross income, before taxes and deductions. That's why DTI can look comfortable on paper while your take-home budget feels tight.",
    },
    {
      q: "What is the maximum DTI for an FHA loan?",
      a: "FHA's standard limits are 31% front-end and 43% back-end. Automated underwriting can approve higher ratios, sometimes in the mid-50s, when you have compensating factors like strong credit or cash reserves.",
    },
    {
      q: "How can I lower my DTI quickly?",
      a: "Pay off a small debt entirely, since that removes its whole payment. Paying off a card with a low balance or a car loan near its end usually does the most. Adding a co-borrower's income or choosing a cheaper home also lowers it.",
    },
  ],

  teach: {
    heading: "What is a debt-to-income ratio?",
    whatIsIt:
      "Your debt-to-income ratio, or DTI, is the share of your gross monthly income that goes to debt payments. A lender divides your monthly debts by your monthly income before taxes and expresses it as a percentage.\n\nThere are two versions. The front-end ratio includes only your housing payment. The back-end ratio includes housing plus every other recurring debt, like car loans, student loans and credit card minimums.",
    whyItMatters:
      "DTI measures how much room your budget has for a new mortgage payment, which is why it's a hard limit in loan approval. Two buyers with the same income and credit score can qualify for very different loan amounts because one has a $600 car payment and the other doesn't.\n\nIt also explains why a small debt can matter more than a big one. A $2,000 credit card balance with a $60 minimum and a nearly finished car loan with a $450 payment affect DTI very differently. Paying off the car does far more for your approval odds.",
    whatToDoNext:
      "If you're under 36%, you're in good shape: focus on credit score and down payment. If you're between 36% and 43%, you'll likely qualify but may see better pricing after paying down a debt. Above 43%, start with the debt that removes the biggest payment for the least money.\n\nOnce your DTI looks right, use the home affordability calculator to turn it into a price range, and the mortgage qualifier to see which loan programs fit.",
  },

  method: {
    label:
      "DTI = monthly debt payments ÷ gross monthly income. Program limits reflect standard published guidelines for conventional (28/36, DU up to 45%), FHA (31/43), VA (41%) and USDA (29/41) loans",
  },

  monetization: [
    {
      kind: "internal",
      headline: "Turn your DTI into a home price",
      body: "Your DTI sets how much house lenders will finance. See your price range with today's rates.",
      ctaLabel: "How much house can I afford?",
      href: "/home-affordability",
    },
  ],
};
