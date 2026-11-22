import { tokens as t } from "@/lib/calculator/tokens";
import type { ReferenceSection as ReferenceSectionSpec } from "@/lib/calculator/types";
import { DataTable } from "./BreakdownTable";

// Static reference content below the calculator (BUILD-STANDARD §1.8b): an H2,
// a short explanation, and one or more input-independent tables (e.g. the full
// published tax brackets). Rendered only when a definition supplies `reference`.

export default function ReferenceSection({ section }: { section: ReferenceSectionSpec }) {
  return (
    <div>
      <h2 style={{ fontSize: t.font.h3, fontWeight: 800, color: t.color.ink, marginBottom: 12 }}>
        {section.heading}
      </h2>
      {section.body?.split("\n\n").map((para, i) => (
        <p key={i} style={{ fontSize: t.font.lead, color: t.color.body, lineHeight: 1.75, marginBottom: 14, maxWidth: 760 }}>
          {para}
        </p>
      ))}
      <div style={{ display: "grid", gap: 28, marginTop: 8 }}>
        {section.tables.map((tbl) => (
          <DataTable key={tbl.title} heading title={tbl.title} columns={tbl.columns} rows={tbl.rows} note={tbl.note} />
        ))}
      </div>
    </div>
  );
}
