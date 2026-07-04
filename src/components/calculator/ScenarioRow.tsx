"use client";
import { tokens as t } from "@/lib/calculator/tokens";
import type { ScenarioSpec } from "@/lib/calculator/types";

// What-if preset chips (BUILD-STANDARD §1.7). Clicking a chip patches the
// current inputs with the scenario's overrides so the whole page recomputes.

type Props<Inputs> = {
  scenarios: ScenarioSpec<Inputs>[];
  onApply: (patch: Partial<Inputs>) => void;
};

export default function ScenarioRow<Inputs>({ scenarios, onApply }: Props<Inputs>) {
  if (!scenarios.length) return null;
  return (
    <div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: t.color.faint,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 10,
        }}
      >
        What if…
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onApply(s.patch)}
            title={s.blurb}
            style={{
              border: `1.5px solid ${t.color.line}`,
              background: t.color.surface,
              color: t.color.body,
              borderRadius: 20,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
