import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money } from "@/lib/calculator/format";
import { computeTermLife, type TermLifeInputs, type TermLifeResults } from "./compute";

const defaults: TermLifeInputs = {
  annualIncome: 90000,
  incomeMultiple: 10,
  mortgageBalance: 250000,
  yourAge: 35,
  retirementAge: 65,
  youngestChildAge: 4,
  mortgageYearsLeft: 26,
};

export const termLifeDef: CalculatorDefinition<TermLifeInputs, TermLifeResults> = {
  slug: "term-life",
  hub: "insurance",
  h1: "Term Life Insurance Calculator",
  valueProp: "Estimate how much term coverage you need and how long the term should run — a planning estimate, not a quote.",
  title: "Term Life Insurance Calculator | freecalcs.io",
  metaDescription:
    "Free term life insurance calculator: estimate your coverage need and the right term length to outlast your mortgage, income-earning years, and kids' dependence. A planning estimate, not a quote.",
  primaryKeyword: "Term Life Insurance Calculator",
  secondaryKeywords: ["term life coverage amount", "how long a term should be", "term length calculator", "term vs whole life"],
  intro:
    "Term life insurance covers you for a set number of years — ideally long enough to outlast your biggest financial obligations. This calculator estimates both the coverage amount (using an income-multiple rule) and the term length that carries you past your mortgage, your income-earning years, and your children's dependence. It's a planning estimate to bring to an agent, not a quote or a guarantee of price.",
  commercialIntent: 5,

  defaults,
  inputs: [
    { name: "annualIncome", label: "Your annual income", type: "currency", default: 90000 },
    { name: "incomeMultiple", label: "Coverage as × income", type: "number", default: 10, min: 1, max: 20, step: 1, helpText: "A common rule is 10× income." },
    { name: "mortgageBalance", label: "Mortgage balance", type: "currency", default: 250000 },
    { name: "yourAge", label: "Your age", type: "number", default: 35, min: 18, max: 75 },
    { name: "retirementAge", label: "Planned retirement age", type: "number", default: 65, min: 40, max: 80 },
    { name: "youngestChildAge", label: "Youngest child's age", type: "number", default: 4, min: 0, max: 30, helpText: "Used to estimate years until independence (age 22)." },
    { name: "mortgageYearsLeft", label: "Years left on mortgage", type: "years", default: 26, min: 0, max: 40 },
  ],

  compute: computeTermLife,

  results: [
    { key: "coverageNeed", label: "Estimated coverage need", format: "currency", variant: "primary", hint: "Income multiple + mortgage — a planning estimate, not a quote." },
    { key: "recommendedTermYears", label: "Recommended term (years)", format: "number", variant: "secondary" },
    { key: "longestObligationYears", label: "Longest obligation (years)", format: "number", variant: "secondary" },
    { key: "yearsUntilRetirement", label: "Years to retirement", format: "number", variant: "secondary" },
    { key: "yearsUntilChildIndependent", label: "Years until kids independent", format: "number", variant: "secondary" },
    { key: "mortgageYearsLeft", label: "Years left on mortgage", format: "number", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "What sets your term length",
      columns: [
        { key: "milestone", label: "Milestone", format: "text", align: "left" },
        { key: "years", label: "Years away", format: "number" },
      ],
      rows: (r) => [
        { milestone: "Until your youngest child is independent", years: r.yearsUntilChildIndependent },
        { milestone: "Until you reach retirement", years: r.yearsUntilRetirement },
        { milestone: "Until your mortgage is paid off", years: r.mortgageYearsLeft },
      ],
      note: "Your term should outlast the longest of these; we round it up to a standard term (10/15/20/25/30). It's a planning guide, not a recommendation to buy a specific policy.",
    },
  ],

  scenarios: [
    { id: "retire70", label: "Retire at 70", patch: { retirementAge: 70 } },
    { id: "newbaby", label: "Newborn (age 0)", patch: { youngestChildAge: 0 } },
    { id: "mult12", label: "12× income", patch: { incomeMultiple: 12 } },
  ],

  insights: [
    {
      id: "estimate-caveat",
      priority: 96,
      tone: "warn",
      when: () => true,
      say: () =>
        `This is a planning ESTIMATE, not a quote. It sizes the coverage and term — not the price, which depends on your age, health, and the insurer. Use it as a starting point and get quotes from a licensed agent before you buy.`,
    },
    {
      id: "term-length",
      priority: 92,
      when: (r) => r.longestObligationYears > 0,
      say: (r) =>
        `Your term should outlast your biggest obligation. Here that's ${r.longestObligationYears} years — until ${r.longestObligationLabel} — so a ${r.recommendedTermYears}-year term keeps you covered the whole way through.`,
    },
    {
      id: "coverage-need",
      priority: 84,
      when: (r, v) => r.coverageNeed > 0,
      say: (r, v) =>
        `A common rule sizes coverage at ${v.incomeMultiple}× income plus your mortgage — about ${money(
          r.coverageNeed,
        )} here. For a figure that also reflects your debts and education costs, the DIME-based life insurance calculator is more thorough.`,
    },
    {
      id: "term-vs-perm",
      priority: 78,
      when: () => true,
      say: () =>
        `Term life covers a need that shrinks over time — the mortgage gets paid off and the kids grow up — at a small fraction of permanent-insurance cost. That's why most families use term for exactly this kind of temporary need.`,
    },
  ],

  related: [
    relatedLink("life-insurance"),
    relatedLink("retirement"),
    relatedLink("savings-goal"),
    relatedLink("mortgage"),
  ],

  faqs: [
    { q: "How long should my term be?", a: "Long enough to outlast your biggest financial obligations — typically the longest of: years until your youngest child is independent, years until you retire, or years left on your mortgage. This calculator finds that longest window and rounds up to a standard term (10, 15, 20, 25, or 30 years). It's a guide, not a rule." },
    { q: "How much term life insurance do I need?", a: "A common shortcut is 10–12× your annual income, plus your mortgage balance. This calculator uses that approach for a quick estimate. For a more thorough number that also accounts for other debts and your children's education, use the DIME-based life insurance calculator. Either way, the result is an estimate, not a quote." },
    { q: "Is this a quote for a term policy?", a: "No. It estimates the coverage amount and term length that fit your situation — it does not price a policy. Actual premiums depend on your age, health, tobacco use, the term, and the insurer. Get quotes from a licensed agent or broker to see real prices." },
    { q: "Term vs whole life — which should I get?", a: "For a temporary need like covering a mortgage and raising kids, term life is usually far cheaper per dollar of coverage, since it lasts only as long as you need it. Whole (permanent) life costs much more and is generally chosen for estate-planning or lifelong-dependent situations. A licensed agent can help you decide." },
    { q: "What happens when my term ends?", a: "Coverage stops unless you renew (usually at a much higher price) or convert to a permanent policy. The idea behind term is that by the time it ends, you no longer need it — the mortgage is paid, the kids are grown, and you've built savings. That's why matching the term to your obligations matters." },
    { q: "Should I buy one long term or ladder several?", a: "Some people 'ladder' policies — e.g. a 30-year and a 15-year — so coverage steps down as obligations shrink, lowering total premiums. It's a reasonable strategy but adds complexity. This calculator estimates a single term; discuss laddering with an agent if it interests you." },
  ],

  teach: {
    whatIsIt:
      "Term life insurance pays out if you die within a set period — the 'term.' It's the simplest, cheapest form of life insurance because it covers a temporary need and builds no cash value. This calculator estimates two things: how much coverage to carry (an income-multiple rule plus your mortgage) and how long the term should run.\n\nThe term-length logic is straightforward: your coverage should last until your family no longer depends on your income — the longest of paying off the mortgage, your kids reaching independence, or your own retirement. Like all the insurance tools here, this is a planning estimate, not a quote.",
    whyItMatters:
      "Matching the term to your obligations is what makes term life both effective and affordable. Too short, and coverage lapses while your family still needs it; too long, and you pay for years of protection you don't need. Getting the amount roughly right — enough to replace income and clear the mortgage — protects your family without overspending.\n\nBut 'roughly right' is the key phrase. The income-multiple rule is a crude shortcut, the DIME method is more thorough, and neither prices a policy. The real cost depends on your health and age and is set by an insurer, so treat every number here as a planning input, not a decision.",
    whatToDoNext:
      "Enter your real numbers and read which milestone drives your term — usually retirement or your mortgage. Try the scenarios to see how a new baby or a later retirement changes the recommended term.\n\nThen compare this quick estimate against the more detailed DIME-based life insurance calculator, and take both to a licensed agent for actual quotes. Term life is inexpensive enough that most families can afford ample coverage — but confirm the price with a professional, and remember this tool is information, not financial advice.",
  },

  method: {
    label: "Coverage sized by an income-multiple rule plus mortgage; term length set to outlast your longest obligation — a planning ESTIMATE, not a quote or guarantee",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Want a more thorough coverage number?",
      body: "The DIME-based life insurance calculator accounts for your debts and your children's education, not just an income multiple — a more complete planning estimate.",
      ctaLabel: "Open the life insurance calculator",
      href: "/life-insurance",
    },
  ],
};
