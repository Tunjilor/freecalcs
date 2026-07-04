// The CalculatorDefinition schema — the contract every calculator fills in.
// See docs/BUILD-STANDARD.md §2 and §4. An agent building calculator #N writes
// a definition of this shape (plus a pure compute + tests) and drops it into
// <CalculatorShell>. If something you need isn't expressible here, STOP and
// propose a schema change rather than inventing a one-off pattern.

export type HubId =
  | "mortgage"
  | "loans"
  | "tax"
  | "investing"
  | "health"
  | "everyday";

/** A single user input. `name` must be a key of the calculator's Inputs type. */
export type InputField<Inputs> = {
  name: keyof Inputs & string;
  label: string;
  type: "currency" | "percent" | "number" | "years" | "months" | "select";
  default: number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  helpText?: string;
  /** Optional: hide this field unless the predicate is true (e.g. show PMI only when relevant). */
  showWhen?: (v: Inputs) => boolean;
};

/** Declares which computed field renders as a result, how, and its emphasis. */
export type ResultSpec<Results> = {
  key: keyof Results & string;
  label: string;
  format: "currency" | "currency2" | "percent" | "number" | "text";
  variant: "primary" | "secondary";
  /** Optional sublabel under the value, e.g. "principal & interest". */
  hint?: string;
};

/** A rules-based insight for "Explain My Result" (§4). Deterministic, curated. */
export type InsightRule<Inputs, Results> = {
  id: string;
  when: (r: Results, v: Inputs) => boolean;
  say: (r: Results, v: Inputs) => string;
  priority: number; // higher renders first
  tone?: "info" | "success" | "warn";
};

/** Optional time-series / breakdown chart driven from Results. */
export type ChartSpec<Results> = {
  kind: "area" | "line";
  title: string;
  /** Pull the series (x label + y value) out of the computed Results. */
  series: (r: Results) => { x: string; y: number }[];
  yFormat?: "currency" | "number";
};

/** A what-if preset: a labeled override of one or more inputs. */
export type ScenarioSpec<Inputs> = {
  id: string;
  label: string;
  patch: Partial<Inputs>;
  blurb?: string;
};

export type RelatedLink = { slug: string; label: string };

// Monetization slot (BUILD-STANDARD §6). A discriminated union so the DEFAULT
// is a relevant internal-link next step (no commission, no disclosure), and the
// affiliate variant is opt-in — used only when a real, disclosed offer exists.
type CtaBase = { headline: string; body: string; ctaLabel: string; href: string };

export type MonetizationSlot =
  /** Default: a helpful internal next-step link (e.g. to a sibling calculator). */
  | ({ kind: "internal" } & CtaBase)
  /** Opt-in: a real, disclosed affiliate/lead-gen offer. One-line swap of href. */
  | ({ kind: "affiliate"; disclosure?: boolean } & CtaBase)
  /** Display-ad placeholder. */
  | { kind: "ad"; label?: string; height?: number };

export type CalculatorDefinition<Inputs, Results> = {
  slug: string; // "va-loan" -> /va-loan
  hub: HubId;
  h1: string; // exact target keyword
  valueProp: string; // one-line under the H1
  title: string; // <title>
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intro: string; // 40–80 words
  commercialIntent: 1 | 2 | 3 | 4 | 5;

  defaults: Inputs;
  inputs: InputField<Inputs>[];
  compute: (v: Inputs) => Results; // PURE, unit-tested
  results: ResultSpec<Results>[];

  chart?: ChartSpec<Results>;
  scenarios?: ScenarioSpec<Inputs>[];

  insights: InsightRule<Inputs, Results>[];

  related: RelatedLink[];
  relatedArticles?: RelatedLink[];
  faqs: { q: string; a: string }[];
  teach: { whatIsIt: string; whyItMatters: string; whatToDoNext: string };
  method: { label: string; sourceUrl?: string; year?: number };
  monetization?: MonetizationSlot[];
};
