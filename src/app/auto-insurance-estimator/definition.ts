import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money } from "@/lib/calculator/format";
import {
  computeAutoInsurance,
  type AutoInsuranceInputs,
  type AutoInsuranceResults,
} from "./compute";

const defaults: AutoInsuranceInputs = {
  ageBand: "25to64",
  coverageLevel: "standard",
  vehicleTier: "mid",
};

export const autoInsuranceDef: CalculatorDefinition<AutoInsuranceInputs, AutoInsuranceResults> = {
  slug: "auto-insurance-estimator",
  hub: "insurance",
  h1: "Auto Insurance Estimator",
  valueProp: "A rough ballpark range for car insurance by age, coverage, and vehicle — not a quote.",
  title: "Auto Insurance Estimator (Ballpark Range) | freecalcs.io",
  metaDescription:
    "Free auto insurance estimator: a rough ballpark premium RANGE based on your age band, coverage level, and vehicle value. Not a quote — real premiums depend on your record, location, and credit.",
  primaryKeyword: "Auto Insurance Estimator",
  secondaryKeywords: ["car insurance cost estimate", "average car insurance premium", "how much is car insurance", "auto insurance range"],
  intro:
    "What might car insurance cost you? This estimator gives a rough ballpark range based on the three biggest, broadest factors — your age band, coverage level, and vehicle value. It is deliberately a range, not a single number, and emphatically not a quote: your real premium depends on your driving record, exact location, credit, claims history, and mileage, which this tool doesn't collect. Use it for rough orientation, then get real quotes.",
  commercialIntent: 5,

  defaults,
  inputs: [
    {
      name: "ageBand",
      label: "Driver age band",
      type: "select",
      default: "25to64",
      options: [
        { label: "Under 25", value: "under25" },
        { label: "25 to 64", value: "25to64" },
        { label: "65 or older", value: "65plus" },
      ],
    },
    {
      name: "coverageLevel",
      label: "Coverage level",
      type: "select",
      default: "standard",
      options: [
        { label: "State-minimum liability", value: "minimum" },
        { label: "Standard", value: "standard" },
        { label: "Full coverage (comp + collision)", value: "full" },
      ],
    },
    {
      name: "vehicleTier",
      label: "Vehicle value",
      type: "select",
      default: "mid",
      options: [
        { label: "Economy (under $20k)", value: "economy" },
        { label: "Mid ($20k–$40k)", value: "mid" },
        { label: "Luxury (over $40k)", value: "luxury" },
      ],
    },
  ],

  compute: computeAutoInsurance,

  results: [
    { key: "rangeLabel", label: "Rough ballpark", format: "text", variant: "primary", hint: "A wide estimate range — NOT a quote. Your real price can fall outside it." },
    { key: "lowAnnual", label: "Low end / year", format: "currency", variant: "secondary" },
    { key: "highAnnual", label: "High end / year", format: "currency", variant: "secondary" },
    { key: "lowMonthly", label: "Low end / month", format: "currency2", variant: "secondary" },
    { key: "highMonthly", label: "High end / month", format: "currency2", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Rough range by coverage level",
      columns: [
        { key: "level", label: "Coverage", format: "text", align: "left" },
        { key: "low", label: "Low / year", format: "currency" },
        { key: "high", label: "High / year", format: "currency" },
      ],
      rows: (r) =>
        r.byCoverage.map((c) => ({ level: c.label, low: c.lowAnnual, high: c.highAnnual })),
      note: "These are wide ballpark bands from national averages — not quotes. Real premiums are set per driver using your record, ZIP, credit, and claims history, none of which this tool uses.",
    },
  ],

  scenarios: [
    { id: "young", label: "Under-25 driver", patch: { ageBand: "under25" } },
    { id: "fullcov", label: "Full coverage", patch: { coverageLevel: "full" } },
    { id: "luxury", label: "Luxury vehicle", patch: { vehicleTier: "luxury" } },
  ],

  insights: [
    {
      id: "estimate-caveat",
      priority: 98,
      tone: "warn",
      when: () => true,
      say: () =>
        `This is a ROUGH BALLPARK RANGE, not a quote. Real auto premiums depend on things this tool doesn't ask — your driving record, exact ZIP code, credit, claims history, annual mileage, and the specific insurer. Your actual price can land outside this range. Treat it as loose orientation and get real quotes from several insurers.`,
    },
    {
      id: "range-why",
      priority: 92,
      when: (r) => r.highAnnual > 0,
      say: (r) =>
        `Using only your age band, coverage level, and vehicle value, a typical premium lands roughly between ${money(
          r.lowAnnual,
        )} and ${money(
          r.highAnnual,
        )} a year. The band is wide on purpose — the factors we're not modeling routinely swing real prices by 2× or more.`,
    },
    {
      id: "factor-drivers",
      priority: 84,
      when: () => true,
      say: () =>
        `Age band and coverage level move this the most. Younger drivers and full coverage push toward the high end; a clean record, higher deductibles, and low mileage — none modeled here — can pull you below it.`,
    },
    {
      id: "shop-around",
      priority: 78,
      when: () => true,
      say: () =>
        `Rates for the same driver vary enormously between insurers, often 2–3×. Comparing several real quotes is by far the most reliable way to find your actual price — no estimator can replace that.`,
    },
  ],

  related: [
    relatedLink("life-insurance"),
    relatedLink("term-life"),
    relatedLink("salary"),
    relatedLink("savings-goal"),
  ],

  faqs: [
    { q: "How much does car insurance cost?", a: "It varies enormously — from a few hundred dollars a year for a minimum-liability policy on a clean older driver to several thousand for a young driver with full coverage on an expensive car. This tool gives a rough range from the broadest factors, but your real cost depends on details it doesn't collect. Only real quotes tell you your price." },
    { q: "Why is this an estimate range and not a quote?", a: "Because auto premiums are priced per individual using data this tool doesn't have: your exact address, driving record, credit-based insurance score, prior claims, annual mileage, and each insurer's own model. We only use age band, coverage level, and vehicle value, so the honest output is a wide range for orientation — not a price." },
    { q: "What factors most affect my car insurance premium?", a: "The biggest drivers are your driving record (tickets and at-fault accidents), location (ZIP-level risk), age and experience, coverage level and deductibles, the vehicle itself, annual mileage, and in most states your credit-based insurance score. This estimator captures only a few of these, which is why the range is broad." },
    { q: "Is minimum coverage enough?", a: "State-minimum liability is the cheapest but often leaves you exposed — it may not cover the other party's costs in a serious crash, and it doesn't repair your own car. Full coverage (comprehensive + collision) costs more but protects your vehicle. The right level depends on your car's value and your risk tolerance; an agent can help you weigh it." },
    { q: "How can I lower my car insurance?", a: "Compare quotes from several insurers (the single biggest lever), raise your deductibles, keep a clean record, bundle with home/renters insurance, ask about low-mileage and safe-driver discounts, and improve your credit where it's used. Because rates vary so much between companies, shopping around usually beats any single tactic." },
    { q: "Does my car's value change my premium?", a: "Yes, especially for full coverage — a more expensive car costs more to repair or replace, raising comprehensive and collision premiums. Liability-only premiums are less sensitive to the car's value. This tool uses a coarse economy/mid/luxury tier as a rough proxy." },
  ],

  teach: {
    whatIsIt:
      "This is an auto insurance ballpark estimator. It takes the three broadest premium factors — your age band, the coverage level you want, and roughly how much your vehicle is worth — multiplies national-average base premiums by simple factors, and then widens the result into a low–high range.\n\nThe range is the point. Auto insurance is priced individually, and the factors that matter most — your driving record, exact location, credit, and claims history — aren't in this tool. So rather than a falsely precise number, it gives a band wide enough to acknowledge that uncertainty.",
    whyItMatters:
      "A rough range is genuinely useful for orientation: it tells a shopper whether to expect roughly $80 or roughly $250 a month before they start getting quotes, which helps with budgeting and spotting an outlier quote. What it can't do — and shouldn't pretend to do — is price your specific policy.\n\nThat honesty matters because auto rates are among the most personalized in insurance. The same driver can get quotes that differ by 2–3× between companies for identical coverage. Any estimator that hands you one confident number is misleading you; the real answer only comes from actual quotes on your actual profile.",
    whatToDoNext:
      "Use the range to set rough expectations, and look at how it shifts across the age bands and coverage levels so you understand the levers. Then get real quotes from at least three or four insurers — online quotes take minutes and are the only way to learn your actual price.\n\nWhen you compare, hold the coverage limits and deductibles constant so you're comparing like for like, and ask about discounts. Remember this tool is loose orientation and reinforces the site's disclaimer: it's information, not financial advice, and not a substitute for a real quote.",
  },

  method: {
    label: "A rough ballpark RANGE from national-average base premiums adjusted by age band, coverage level, and vehicle value — NOT a quote; it ignores driving record, location, credit, claims history, and mileage, which strongly affect real premiums",
    year: 2026,
  },

  monetization: [
    {
      kind: "internal",
      headline: "Sizing up your other coverage too?",
      body: "If you're reviewing insurance, estimate how much life coverage your family would need with the DIME method — also a planning estimate, not a quote.",
      ctaLabel: "Open the life insurance calculator",
      href: "/life-insurance",
    },
  ],
};
