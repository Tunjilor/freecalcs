# FreeCalcs Calculator Page Build Standard (v1)

This is the single source of truth every calculator page must conform to. It exists so that
multiple Claude Code agents can build different calculators *in parallel* and produce a site
that looks and behaves like one product built by one team.

**Rule for agents:** You do not get to freestyle a calculator. You fill in a `CalculatorDefinition`
(structured data + a compute function + insight rules), drop it into the shared page template, and
run the Definition-of-Done checklist. If something you need isn't expressible in the schema below,
STOP and flag it for a schema change — do not invent a one-off pattern.

---

## 0. Assumed stack (confirm before first build)

This document assumes **Next.js (App Router) + TypeScript + React + Tailwind**, static-generated
(`generateStaticParams`) so every calculator page is prerendered HTML for SEO. If the real stack
differs, only the code samples change — the page anatomy, schema, insight engine, SEO rules, and
agent workflow are stack-agnostic and still apply.

---

## 1. Page anatomy (the contract)

Every calculator page renders these sections **in this order**. Sections marked *(required)* must
never be omitted; *(conditional)* render only when the definition supplies data.

1. **H1 + one-line value prop** *(required)* — the exact target keyword as the H1.
2. **Intro paragraph** *(required)* — 40–80 words, plain language, contains the primary keyword once
   and a secondary keyword once. Written for a human, not stuffed.
3. **The calculator** *(required)* — inputs on the left/top, live results on the right/bottom.
   Recomputes on input change (no "Calculate" button required, but a button is fine for mobile).
4. **Primary result card** *(required)* — the headline number(s), large and unmissable.
5. **Explain My Result** *(required)* — 2–4 sentences of curated, rules-based interpretation of
   *this user's* numbers. See §4. This is the signature feature; it is not optional.
6. **Visualization** *(conditional)* — chart/table when the calc has time series or breakdowns.
7. **Scenario / what-if row** *(conditional)* — 2–3 preset "what if you changed X" comparisons.
8. **Monetization slot A** *(conditional)* — a *relevant* affiliate/lead-gen CTA. See §6.
9. **Related calculators** *(required)* — 3–6 links, same hub first. See §5 internal linking.
10. **Educational content** *(required)* — "What is this / Why it matters / What to do next"
    (the three-question teach block). 300–800 words of genuinely useful prose.
11. **FAQ** *(required)* — 4–8 Q&As, each emitted as `FAQPage` JSON-LD (§7).
12. **Trust / method note** *(required)* — one line naming the formula or data source and its year,
    e.g. "Based on 2026 IRS federal brackets" or "Uses the standard amortization formula."
13. **Related articles** *(conditional)* — links into the hub's supporting content.

---

## 2. The CalculatorDefinition schema

Every calculator is data first. An agent's main job is producing a correct, well-tested definition.

```ts
type CalculatorDefinition = {
  slug: string;                 // "auto-loan" -> /auto-loan
  hub: HubId;                   // "loans" | "mortgage" | "tax" | "investing" | "health" | ...
  h1: string;                   // exact target keyword, e.g. "Auto Loan Calculator"
  primaryKeyword: string;
  secondaryKeywords: string[];
  intro: string;                // 40-80 words
  commercialIntent: 1 | 2 | 3 | 4 | 5; // 5 = high buyer intent (drives build priority)

  inputs: InputField[];         // typed, validated, with sensible defaults
  compute: (v: Inputs) => Results;   // PURE function, unit-tested, no side effects
  results: ResultSpec[];        // which Results fields render, formatting, which is "primary"

  chart?: ChartSpec;            // optional time series / breakdown
  scenarios?: ScenarioSpec[];   // optional what-if presets

  insights: InsightRule[];      // powers "Explain My Result" (§4)

  related: string[];            // slugs of related calculators (same hub first)
  faqs: { q: string; a: string }[];   // 4-8, human-written
  teach: { whatIsIt: string; whyItMatters: string; whatToDoNext: string };
  method: { label: string; sourceUrl?: string; year?: number }; // trust note
  monetization?: MonetizationSlot[]; // §6
};

type InputField = {
  name: string; label: string;
  type: "currency" | "percent" | "number" | "years" | "months" | "date" | "select";
  default: number | string;
  min?: number; max?: number; step?: number;
  options?: { label: string; value: string }[];
  helpText?: string;
};
```

The `compute` function is a **pure function** so it can be unit-tested in isolation and reused by
articles that pre-fill the calculator (the article→calculator flywheel). No DOM, no fetch, no dates
read from `Date.now()` inside it unless passed in.

---

## 3. Shared component library

Agents import these; they do not rebuild them. If a calculator needs a component that doesn't exist,
propose it as a library addition rather than inlining a bespoke one.

- `<CalculatorShell>` — the page template that lays out §1's anatomy from a `CalculatorDefinition`.
- `<InputField>` — renders any `InputField` type with validation + formatting (currency masks etc).
- `<ResultCard variant="primary|secondary">` — the headline number card.
- `<ExplainMyResult>` — runs the insight engine (§4) and renders sentences.
- `<ResultChart>` — wraps Recharts; accepts a `ChartSpec`. Line, area, stacked-bar, donut.
- `<ScenarioRow>` — renders what-if comparison chips.
- `<RelatedCalculators>` — internal-link grid.
- `<TeachBlock>` — the three-question educational section.
- `<FaqAccordion>` — renders FAQs **and** emits the `FAQPage` JSON-LD.
- `<MethodNote>` — the trust line.
- `<AffiliateCTA>` / `<AdSlot>` — monetization, rendered only when contextually relevant.

**Design tokens** live in one place (Tailwind config + CSS vars): colors, spacing, radii,
typography, chart palette. Every calculator inherits them so the family resemblance is automatic.
No agent hardcodes a hex value.

---

## 4. The "Explain My Result" engine (the differentiator)

This is **rules-based, curated logic — not a live LLM call.** It's deterministic, fast, free to run,
indexable, and impossible for competitors to scrape as easily as a formula. That's the moat.

An `InsightRule` inspects the computed `Results` and fires a templated sentence when its condition
is true. Order matters; render the top N that fire.

```ts
type InsightRule = {
  id: string;
  when: (r: Results, v: Inputs) => boolean;
  say: (r: Results, v: Inputs) => string;   // returns a finished sentence
  priority: number;                          // higher renders first
};
```

Example (auto loan):

```ts
{
  id: "interest-share-high",
  when: (r) => r.totalInterest / r.principal > 0.20,
  say: (r) => `Over this loan you'll pay about ${money(r.totalInterest)} in interest — ` +
              `roughly ${pct(r.totalInterest / r.principal)} of what you're borrowing.`,
  priority: 90,
},
{
  id: "extra-payment-lever",
  when: (r, v) => v.termMonths >= 48,
  say: (r) => `Adding ${money(50)}/month would cut about ${r.monthsSavedWith50} months ` +
              `and ${money(r.interestSavedWith50)} of interest.`,
  priority: 80,
}
```

Quality bar: insights must be **specific to the user's numbers**, actionable, and never generic
fluff like "this is a big number." If a rule can't say something a smart friend would say, cut it.
Every flagship calculator ships with **at least 4** insight rules.

---

## 5. SEO + internal linking rules

- H1 = primary keyword, exactly once. Only one H1 per page.
- Title tag: `{Keyword} | freecalcs.io` (~55–60 chars). Meta description ~150 chars, benefit-led.
- Section headers use H2/H3 in order; the FAQ questions are H3s.
- **Internal linking is mandatory and structured:** every page links to (a) its hub page, (b) 3–6
  sibling calculators in the same hub, (c) any supporting articles. Hubs link down to all members;
  members link up to the hub and sideways to siblings. This is what turns pages into a cluster
  Google reads as topical authority — do not skip it.
- URLs are flat and keyword-clean: `/auto-loan`, `/mortgage-payoff`. No dates, no IDs.
- Every page is statically prerendered (real HTML in view-source, not JS-injected).

---

## 6. Monetization (build it in from day one, tastefully)

Monetization is part of the standard, not an afterthought bolted on later. Rules:

- **Relevance only.** An `<AffiliateCTA>` appears only when it genuinely helps the user's next step:
  a refinance CTA under a mortgage-payoff result, a lender-comparison CTA under an auto-loan result,
  a tax-software CTA under an income-tax result. Never a random ad for an unrelated product.
- **Placement:** monetization slot A sits *after* the result + explanation (user got value first),
  never above the calculator, never interrupting input.
- **Commercial-intent scoring drives build order.** Definitions carry `commercialIntent: 1–5`.
  Build high-intent calculators (loans, refinance, insurance-needs, tax, debt payoff) **first** —
  they earn per visitor. Low-intent utilities (scientific, percentage, age, tip) come later or as
  cluster-support only; they bring traffic but little revenue.
- **AdSense foundation:** apply now so display ads earn whatever they can during the authority-build
  phase. Graduate to a better network (Ezoic → Mediavine/Raptive) as sessions grow.
- One disclosure line near any affiliate link; you already have a disclosure page — link it.

---

## 7. Structured data (JSON-LD, required)

Each page emits, at minimum:
- `WebApplication` or `SoftwareApplication` for the calculator tool itself.
- `FAQPage` built from the `faqs` array (this is a real rich-result opportunity — don't skip).
- `BreadcrumbList` for the hub → calculator path.

Emit via a shared `<JsonLd>` component fed from the definition so agents can't malform it.

---

## 8. Definition of Done (every agent runs this before opening a PR)

- [ ] `compute()` is pure and has unit tests covering typical + edge inputs (0, max, empty).
- [ ] All 13 required/applicable anatomy sections render from the definition.
- [ ] ≥4 insight rules, each specific and actionable; no generic filler.
- [ ] H1 = primary keyword; title/meta set; one H1 only.
- [ ] Internal links: hub + 3–6 siblings present and correct.
- [ ] JSON-LD: WebApplication + FAQPage + BreadcrumbList validate.
- [ ] Method/trust note present with correct year/source.
- [ ] Monetization slot relevant (or intentionally omitted for a low-intent utility).
- [ ] Page is statically prerendered — content visible in view-source with JS disabled.
- [ ] Mobile layout checked; charts responsive; no layout shift on compute.
- [ ] Matches design tokens (no hardcoded colors/spacing).

A page that fails any box is not done, regardless of how good it looks.

---

## 9. The multi-agent parallelization workflow

The order matters — parallelizing before the standard is frozen just produces 50 inconsistent pages
you rebuild.

**Phase A — Reference (do by hand, one agent, no parallelism).**
Build ONE gold-standard calculator end-to-end against this document. Recommended first build:
a **high-commercial-intent loan/debt calculator** (e.g. Auto Loan or Mortgage Payoff), not a
low-intent utility. Getting this one perfect defines the taste for everything after.

**Phase B — Extract the system.**
From the reference, finalize: the shared component library (§3), the `CalculatorShell` template,
the design tokens, the insight-rule and JSON-LD helpers, and this checklist. Freeze the schema.

**Phase C — Parallelize by hub, not by random calculator.**
Assign each agent a whole *hub* (Loans, Mortgage, Tax, Investing, Health…). One agent owning a hub
produces internally consistent cross-links and insights. Give each agent: this document + the
reference calculator + the hub's keyword/intent list. Sequence hubs by commercial intent:
Loans/Debt and Insurance first, then Tax and Investing, then Health, then low-intent utilities last.

**Phase D — Review gate (one reviewer agent or you).**
No page merges without passing §8. The reviewer's only job is enforcing the standard so the site
stays one product. Spot-check the `compute()` math against a known-good source for each calculator.

**Phase E — Cluster completion.**
For each hub, once its calculators exist, add the 3–5 supporting articles that pre-fill the
calculators (article→calculator flywheel), and wire the internal links both directions.

---

## 10. What NOT to build yet (deferred until traffic exists)

Per the strategy discussion: user accounts, saved profiles, the cross-calculator "Life Financial
Dashboard," and downloadable PDF reports are **retention** features. They matter only once
acquisition works. Do not spend early hours here. The one apparent exception — "Explain My Result" —
is already in the core standard (§4) because it doubles as SEO content, not just retention.
