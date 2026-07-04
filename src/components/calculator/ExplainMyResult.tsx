import { tokens as t } from "@/lib/calculator/tokens";
import type { InsightRule } from "@/lib/calculator/types";

// The signature "Explain My Result" feature (BUILD-STANDARD §4). Runs the
// definition's InsightRule[] against the computed results, keeps the ones that
// fire, sorts by priority, and renders the top N as curated sentences. Pure,
// deterministic, indexable — no LLM call.

type Props<Inputs, Results> = {
  rules: InsightRule<Inputs, Results>[];
  results: Results;
  inputs: Inputs;
  max?: number;
};

export default function ExplainMyResult<Inputs, Results>({
  rules,
  results,
  inputs,
  max = 4,
}: Props<Inputs, Results>) {
  const fired = rules
    .filter((r) => {
      try {
        return r.when(results, inputs);
      } catch {
        return false;
      }
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, max);

  if (fired.length === 0) return null;

  return (
    <div
      style={{
        background: t.color.surface,
        borderRadius: t.radius.lg,
        border: `1px solid ${t.color.line}`,
        padding: 22,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: t.color.brand,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          💡 Explain my result
        </span>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
        {fired.map((rule) => {
          const tone = rule.tone ?? "info";
          const accent =
            tone === "success" ? t.color.success : tone === "warn" ? t.color.warn : t.color.brand;
          return (
            <li
              key={rule.id}
              style={{
                display: "flex",
                gap: 12,
                fontSize: 14,
                lineHeight: 1.6,
                color: t.color.body,
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 4,
                  borderRadius: 2,
                  background: accent,
                }}
              />
              <span>{rule.say(results, inputs)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
