"use client";
import { useMemo, useState } from "react";
import { tokens as t } from "@/lib/calculator/tokens";
import { money, money2, pct, num } from "@/lib/calculator/format";
import type { CalculatorDefinition, ResultSpec } from "@/lib/calculator/types";
import InputField from "./InputField";
import ResultCard from "./ResultCard";
import ExplainMyResult from "./ExplainMyResult";
import ResultChart from "./ResultChart";
import ScenarioRow from "./ScenarioRow";
import RelatedCalculators from "./RelatedCalculators";
import TeachBlock from "./TeachBlock";
import FaqAccordion from "./FaqAccordion";
import MethodNote from "./MethodNote";
import InternalCTA from "./InternalCTA";
import AffiliateCTA from "./AffiliateCTA";
import AdSlot from "./AdSlot";

// The page template that lays out BUILD-STANDARD §1's anatomy from a
// CalculatorDefinition. Holds input state, runs the (pure) compute on every
// change, and renders every applicable section in the required order. Because
// compute runs during render with the definition's defaults, the initial HTML
// is statically prerendered with real numbers (SEO / view-source).

function formatValue<Results>(spec: ResultSpec<Results>, results: Results): string {
  const v = results[spec.key] as unknown;
  if (spec.format === "text") return String(v);
  const n = typeof v === "number" ? v : Number(v);
  switch (spec.format) {
    case "currency":
      return money(n);
    case "currency2":
      return money2(n);
    case "percent":
      return pct(n);
    case "number":
      return num(n);
    default:
      return String(v);
  }
}

export default function CalculatorShell<Inputs extends Record<string, number | string>, Results>({
  def,
}: {
  def: CalculatorDefinition<Inputs, Results>;
}) {
  const [values, setValues] = useState<Inputs>(def.defaults);
  const results = useMemo(() => def.compute(values), [def, values]);

  const setValue = (name: string, v: number | string) =>
    setValues((prev) => ({ ...prev, [name]: v }) as Inputs);
  const applyPatch = (patch: Partial<Inputs>) => setValues((prev) => ({ ...prev, ...patch }));

  const primary = def.results.find((r) => r.variant === "primary");
  const secondary = def.results.filter((r) => r.variant === "secondary");
  const visibleInputs = def.inputs.filter((f) => !f.showWhen || f.showWhen(values));

  return (
    <main style={{ background: t.gradient.page, fontFamily: t.font.family }}>
      <style>{scoped}</style>
      <div style={{ maxWidth: t.layout.maxWidth, margin: "0 auto", padding: "28px 20px 64px" }}>
        {/* 1. H1 + value prop */}
        <header style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: t.color.ink, marginBottom: 4 }}>
            {def.h1}
          </h1>
          <p style={{ color: t.color.muted, fontSize: 14 }}>{def.valueProp}</p>
        </header>

        {/* 2. Intro */}
        <p
          style={{
            fontSize: t.font.lead,
            color: t.color.body,
            lineHeight: 1.7,
            maxWidth: 760,
            marginBottom: 24,
          }}
        >
          {def.intro}
        </p>

        {/* 3. The calculator: inputs (left) + live results (right) */}
        <div className="fc-two-col">
          <section aria-label="Inputs" className="fc-card">
            <p className="fc-section-title">Your details</p>
            {visibleInputs.map((f) => (
              <InputField
                key={f.name}
                field={f}
                value={values[f.name]}
                onChange={(v) => setValue(f.name, v)}
              />
            ))}
          </section>

          <div className="fc-results-col" style={{ display: "grid", gap: 14 }}>
            {/* 4. Primary result card */}
            {primary && (
              <ResultCard
                variant="primary"
                label={primary.label}
                value={formatValue(primary, results)}
                hint={primary.hint}
                sub={secondary.slice(0, 2).map((s) => ({
                  label: s.label,
                  value: formatValue(s, results),
                }))}
              />
            )}

            {/* Secondary results table */}
            {secondary.length > 0 && (
              <section className="fc-card">
                <p className="fc-section-title">Breakdown</p>
                {secondary.map((s) => (
                  <div key={s.key} className="fc-row">
                    <span style={{ color: t.color.muted }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: t.color.ink }}>
                      {formatValue(s, results)}
                    </span>
                  </div>
                ))}
              </section>
            )}

            {/* 5. Explain My Result */}
            <ExplainMyResult rules={def.insights} results={results} inputs={values} />

            {/* 6. Visualization */}
            {def.chart && (
              <section className="fc-card">
                <ResultChart spec={def.chart} results={results} />
              </section>
            )}

            {/* 7. Scenario / what-if */}
            {def.scenarios && def.scenarios.length > 0 && (
              <section className="fc-card">
                <ScenarioRow scenarios={def.scenarios} onApply={applyPatch} />
              </section>
            )}

            {/* 8. Monetization slot A — AFTER result + explanation. Defaults to a
                relevant internal next-step; affiliate is opt-in (§6). */}
            {def.monetization?.map((slot, i) =>
              slot.kind === "internal" ? (
                <InternalCTA key={i} slot={slot} />
              ) : slot.kind === "affiliate" ? (
                <AffiliateCTA key={i} slot={slot} />
              ) : (
                <AdSlot key={i} label={slot.label} height={slot.height} />
              ),
            )}
          </div>
        </div>

        {/* 9. Related calculators */}
        <div style={{ marginTop: 40 }}>
          <RelatedCalculators hub={def.hub} siblings={def.related} />
        </div>
      </div>

      {/* 10–13. Educational content, FAQ, method note, related articles */}
      <article style={{ background: t.color.surface, borderTop: `1px solid ${t.color.line}` }}>
        <div style={{ maxWidth: t.layout.readWidth, margin: "0 auto", padding: "48px 20px 72px" }}>
          <TeachBlock h1={def.h1} teach={def.teach} />

          <div style={{ margin: "32px 0" }}>
            <FaqAccordion faqs={def.faqs} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <MethodNote {...def.method} />
          </div>

          {def.relatedArticles && def.relatedArticles.length > 0 && (
            <section aria-label="Related reading">
              <h2 style={{ fontSize: t.font.h3, fontWeight: 800, color: t.color.ink, marginBottom: 12 }}>
                Keep reading
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {def.relatedArticles.map((a) => (
                  <a key={a.slug} href={`/${a.slug}`} className="fc-article-link">
                    {a.label} →
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}

const scoped = `
  .fc-input:focus, .fc-select:focus { border-color: ${t.color.brand} !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1) !important; }
  .fc-select { width: 100%; padding: 11px 32px 11px 14px; border-radius: ${t.radius.md - 1}px; border: 1.5px solid ${t.color.line}; font-size: ${t.font.lead}px; font-weight: 600; color: ${t.color.ink}; background: ${t.color.surface}; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; cursor: pointer; }
  .fc-card { background: ${t.color.surface}; border-radius: ${t.radius.lg}px; border: 1px solid ${t.color.line}; padding: 22px; }
  .fc-section-title { font-size: 11px; font-weight: 700; color: ${t.color.faint}; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 16px; }
  .fc-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid ${t.color.lineSoft}; font-size: 14px; }
  .fc-row:last-child { border-bottom: none; }
  .fc-two-col { display: grid; grid-template-columns: ${t.layout.inputCol}px 1fr; gap: 20px; align-items: start; }
  .fc-article-link { background: ${t.color.brandTint}; color: ${t.color.brand}; font-size: 13px; font-weight: 700; padding: 10px 18px; border-radius: ${t.radius.md}px; text-decoration: none; }
  @media (max-width: 900px) { .fc-two-col { grid-template-columns: 1fr; } .fc-results-col { order: -1; } }
`;
