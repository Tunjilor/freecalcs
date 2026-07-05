import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, pct } from "@/lib/calculator/format";
import {
  computeLifeInsurance,
  type LifeInsuranceInputs,
  type LifeInsuranceResults,
} from "./compute";

const defaults: LifeInsuranceInputs = {
  annualIncome: 90000,
  yearsToReplace: 10,
  totalDebt: 20000,
  mortgageBalance: 300000,
  childrenCount: 2,
  educationPerChild: 100000,
  existingCoverage: 100000,
  liquidSavings: 50000,
};

export const lifeInsuranceDef: CalculatorDefinition<LifeInsuranceInputs, LifeInsuranceResults> = {
  slug: "life-insurance",
  hub: "insurance",
  h1: "Life Insurance Calculator",
  valueProp: "Estimate how much life insurance you need with the DIME method — a planning estimate, not a quote.",
  title: "Life Insurance Calculator (DIME Method) | freecalcs.io",
  metaDescription:
    "Free life insurance needs calculator using the DIME method (Debt, Income, Mortgage, Education). Estimate how much coverage your family would need — a planning estimate, not a quote.",
  primaryKeyword: "Life Insurance Calculator",
  secondaryKeywords: ["how much life insurance do I need", "DIME method", "life insurance needs", "term life coverage amount"],
  intro:
    "How much life insurance is enough? This calculator uses the DIME method — Debt, Income, Mortgage, and Education — to size the coverage your family would need to stay financially secure if your income disappeared. It's a well-established planning estimate, not a quote: think of it as a starting number to bring to a licensed agent, not a precise or guaranteed figure.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "annualIncome", label: "Your annual income", type: "currency", default: 90000 },
    { name: "yearsToReplace", label: "Years of income to replace", type: "years", default: 10, min: 0, max: 40, helpText: "How long your family would need your income replaced." },
    { name: "totalDebt", label: "Non-mortgage debt", type: "currency", default: 20000, helpText: "Credit cards, auto, student loans, etc." },
    { name: "mortgageBalance", label: "Mortgage balance", type: "currency", default: 300000 },
    { name: "childrenCount", label: "Number of children", type: "number", default: 2, min: 0, max: 12, step: 1 },
    { name: "educationPerChild", label: "Education cost per child", type: "currency", default: 100000 },
    { name: "existingCoverage", label: "Existing life insurance", type: "currency", default: 100000 },
    { name: "liquidSavings", label: "Savings & liquid assets", type: "currency", default: 50000 },
  ],

  compute: computeLifeInsurance,

  results: [
    { key: "recommendedCoverage", label: "Estimated coverage need", format: "currency", variant: "primary", hint: "DIME total minus what you already have — a planning estimate, not a quote." },
    { key: "grossNeed", label: "Total DIME need", format: "currency", variant: "secondary" },
    { key: "offsets", label: "Existing coverage + savings", format: "currency", variant: "secondary" },
    { key: "incomeComponent", label: "Income replacement", format: "currency", variant: "secondary" },
    { key: "mortgageComponent", label: "Mortgage", format: "currency", variant: "secondary" },
    { key: "educationComponent", label: "Education", format: "currency", variant: "secondary" },
    { key: "tenXIncome", label: "10× income (rule of thumb)", format: "currency", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Your coverage need, by the DIME method",
      columns: [
        { key: "component", label: "Component", format: "text", align: "left" },
        { key: "covers", label: "What it covers", format: "text", align: "left" },
        { key: "amount", label: "Amount", format: "currency" },
      ],
      rows: (r) => [
        { component: "D — Debt", covers: "Clear remaining non-mortgage debts", amount: r.debtComponent },
        { component: "I — Income", covers: "Replace lost income for your family", amount: r.incomeComponent },
        { component: "M — Mortgage", covers: "Pay off the mortgage", amount: r.mortgageComponent },
        { component: "E — Education", covers: "Fund your children's education", amount: r.educationComponent },
      ],
      note: "DIME sums these four needs, then subtracts coverage and savings you already have. It's a planning estimate — other reasonable methods (10× income, human-life value) give different numbers, and none is a quote.",
    },
  ],

  scenarios: [
    { id: "replace15", label: "Replace income 15 years", patch: { yearsToReplace: 15 } },
    { id: "nokids", label: "No children", patch: { childrenCount: 0 } },
    { id: "nocoverage", label: "No existing coverage", patch: { existingCoverage: 0 } },
  ],

  insights: [
    {
      id: "estimate-caveat",
      priority: 96,
      tone: "warn",
      when: () => true,
      say: () =>
        `This is a planning ESTIMATE, not a quote or a guarantee. It sizes a need using the DIME rule of thumb; the coverage that's right for you — and what it costs — depends on your health, age, and goals. Use this as a starting point and get quotes from a licensed insurance agent.`,
    },
    {
      id: "dime-breakdown",
      priority: 92,
      when: (r) => r.grossNeed > 0,
      say: (r) =>
        `By the DIME method your family's need totals about ${money(
          r.grossNeed,
        )} — ${money(r.incomeComponent)} to replace income, ${money(
          r.mortgageComponent,
        )} for the mortgage, ${money(r.educationComponent)} for education, and ${money(
          r.debtComponent,
        )} for other debts. Netting out the ${money(
          r.offsets,
        )} you already have leaves an estimated ${money(r.recommendedCoverage)} to cover.`,
    },
    {
      id: "income-replacement-lever",
      priority: 84,
      when: (r, v) => r.incomeComponent > 0,
      say: (r, v) =>
        `Income replacement is the largest piece (~${pct(
          r.incomeSharePct,
          0,
        )} of the total). Each extra year you'd want to replace adds about ${money(
          v.annualIncome,
        )} to the estimate — so how long your family would need support is the biggest lever here.`,
    },
    {
      id: "vs-ten-x",
      priority: 80,
      when: (r) => r.tenXIncome > 0,
      say: (r) =>
        `A simpler rule of thumb — 10× income — suggests about ${money(
          r.tenXIncome,
        )}. This DIME estimate comes out ${
          r.vsTenXDelta >= 0 ? "higher" : "lower"
        } because it reflects your actual mortgage, debts, and children rather than a flat multiple. When reasonable methods disagree, lean toward the one that matches your real obligations.`,
    },
    {
      id: "existing-coverage",
      priority: 70,
      when: (r, v) => v.existingCoverage > 0,
      say: (r, v) =>
        `You already hold ${money(
          v.existingCoverage,
        )} of coverage, which this nets out — so the gap to fill is about ${money(
          r.recommendedCoverage,
        )}, not the full ${money(r.grossNeed)}.`,
    },
  ],

  related: [
    relatedLink("term-life"),
    relatedLink("retirement"),
    relatedLink("savings-goal"),
    relatedLink("debt-payoff"),
    relatedLink("auto-insurance-estimator"),
  ],

  faqs: [
    { q: "What is the DIME method?", a: "DIME is a rule of thumb for sizing life insurance: add your Debt (non-mortgage), Income to replace (annual income × the years your family would need it), Mortgage balance, and Education costs for your children. The total is your rough coverage need, before subtracting any existing coverage and savings. It's a planning estimate, not a precise formula." },
    { q: "How much life insurance do I actually need?", a: "There's no single correct number — it depends on your obligations and goals. DIME, the 10× income rule, and the human-life-value method all give different figures. This calculator gives you a DIME estimate and shows the 10× number for comparison. Treat the result as a starting point to discuss with a licensed agent, not a guarantee." },
    { q: "Is this calculator a quote?", a: "No. It estimates how much coverage you might need — it does not price a policy or guarantee you can buy that amount at any particular premium. Actual premiums depend on your age, health, tobacco use, coverage type, and the insurer. Get quotes from a licensed agent or broker before deciding." },
    { q: "Should I subtract my existing coverage and savings?", a: "Yes, to find the gap you still need to fill. If your DIME need is $1.4M and you already have $100k of coverage plus $50k in savings, the additional coverage to consider is about $1.25M. This calculator does that subtraction for you." },
    { q: "How many years of income should I replace?", a: "Common choices are 10, 15, or 20 years, or until your youngest child is independent, or until you'd have retired. Longer replacement periods raise the estimate substantially since income is usually the biggest component. There's no universally right answer — pick the horizon that fits your family's situation." },
    { q: "Does DIME work for term or whole life?", a: "DIME sizes the coverage amount, not the policy type. Most families use term life to cover a need that shrinks over time (as the mortgage is paid and kids grow up), because it's far cheaper per dollar of coverage. Whether term or permanent insurance fits your goals is a separate question for a licensed agent." },
  ],

  teach: {
    whatIsIt:
      "This is a life insurance NEEDS estimator. It doesn't sell or price a policy — it helps you answer 'how much coverage would my family need?' using the DIME method: Debt + Income replacement + Mortgage + Education.\n\nDIME is one of several accepted rules of thumb. Others include the 10× income rule (simple but crude) and the human-life-value method (which projects your lifetime earnings). None is a precise formula, and reasonable people using different methods arrive at different numbers — which is exactly why the result here is an estimate, not an answer.",
    whyItMatters:
      "Life insurance exists to replace what your income provides: paying off debts and the mortgage, funding your kids' education, and keeping the household running for years. Getting the amount roughly right matters — too little leaves your family exposed, while too much means paying for coverage you don't need.\n\nA grounded estimate turns a vague worry into a concrete planning number. But it's genuinely an estimate: the 'right' amount is a judgment call about how long your family would need support and which obligations must be covered, and the price of that coverage is set by an insurer based on your health and age — not by this tool.",
    whatToDoNext:
      "Fill in your real numbers and read the DIME breakdown. Try different income-replacement horizons to see how sensitive the estimate is — it's usually the biggest driver. Compare the DIME total against the 10× income figure shown; if they diverge a lot, think about which better reflects your obligations.\n\nThen take the estimate to a licensed insurance agent or broker for actual quotes. Most families find term life covers this kind of need affordably. This tool is a planning starting point and reinforces the site's disclaimer: it's information, not financial advice, and not a substitute for a professional quote.",
  },

  method: {
    label: "Uses the DIME method (Debt + Income + Mortgage + Education) — a planning ESTIMATE, not a quote or guarantee; actual coverage and premiums require a licensed insurance agent",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Protecting a plan you're still building?",
      body: "Life insurance replaces the income that funds your family's future. See whether your retirement savings are on track alongside it.",
      ctaLabel: "Open the retirement calculator",
      href: "/retirement",
    },
  ],
};
