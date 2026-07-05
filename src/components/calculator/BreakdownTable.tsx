import { tokens as t } from "@/lib/calculator/tokens";
import { money, money2, num } from "@/lib/calculator/format";
import type { BreakdownSpec, BreakdownColumn } from "@/lib/calculator/types";

// Renders a BreakdownSpec as a real table (BUILD-STANDARD §1.6) — for
// variable-length row data like a tax bracket breakdown. Additive: only
// rendered when a definition supplies `breakdowns`.

function fmt(v: number | string, format: BreakdownColumn["format"]): string {
  if (format === "text") return String(v);
  const n = typeof v === "number" ? v : Number(v);
  switch (format) {
    case "currency":
      return money(n);
    case "currency2":
      return money2(n);
    case "percent":
      return `${Number.isInteger(n) ? n : n.toFixed(2)}%`;
    case "number":
      return num(n);
    default:
      return String(v);
  }
}

export default function BreakdownTable<Results>({
  spec,
  results,
}: {
  spec: BreakdownSpec<Results>;
  results: Results;
}) {
  const rows = spec.rows(results);
  if (!rows.length) return null;
  return (
    <section aria-label={spec.title}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: t.color.faint,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 12,
        }}
      >
        {spec.title}
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {spec.columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    textAlign: c.align ?? (c.format === "text" ? "left" : "right"),
                    padding: "8px 10px",
                    borderBottom: `1px solid ${t.color.line}`,
                    color: t.color.muted,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {spec.columns.map((c) => (
                  <td
                    key={c.key}
                    style={{
                      textAlign: c.align ?? (c.format === "text" ? "left" : "right"),
                      padding: "8px 10px",
                      borderBottom: `1px solid ${t.color.lineSoft}`,
                      color: t.color.body,
                      fontWeight: c.format === "text" ? 400 : 600,
                    }}
                  >
                    {fmt(row[c.key], c.format)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {spec.note && (
        <p style={{ fontSize: 11, color: t.color.faint, marginTop: 8, lineHeight: 1.5 }}>{spec.note}</p>
      )}
    </section>
  );
}
