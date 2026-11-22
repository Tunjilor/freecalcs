import { tokens as t } from "@/lib/calculator/tokens";
import { money, money2, num } from "@/lib/calculator/format";
import type { BreakdownSpec, BreakdownColumn } from "@/lib/calculator/types";

// Renders a BreakdownSpec as a real table (BUILD-STANDARD §1.6) — for
// variable-length row data like a tax bracket breakdown. Additive: only
// rendered when a definition supplies `breakdowns`. <DataTable> is the shared
// presentational table, also used by <ReferenceSection>.

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
  return <DataTable title={spec.title} columns={spec.columns} rows={spec.rows(results)} note={spec.note} />;
}

export function DataTable({
  title,
  columns,
  rows,
  note,
  heading = false,
}: {
  title: string;
  columns: BreakdownColumn[];
  rows: Record<string, number | string>[];
  note?: string;
  /** Render the title as an H3 (reference content) instead of a small label. */
  heading?: boolean;
}) {
  if (!rows.length) return null;
  return (
    <section aria-label={title}>
      {heading ? (
        <h3 style={{ fontSize: t.font.lead, fontWeight: 800, color: t.color.ink, marginBottom: 12 }}>{title}</h3>
      ) : (
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
          {title}
        </p>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {columns.map((c) => (
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
                {columns.map((c) => (
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
      {note && <p style={{ fontSize: 11, color: t.color.faint, marginTop: 8, lineHeight: 1.5 }}>{note}</p>}
    </section>
  );
}
