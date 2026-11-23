"use client";
import { tokens as t } from "@/lib/calculator/tokens";
import type { InputField as InputFieldSpec, RowColumn, RowValue } from "@/lib/calculator/types";

// Renders a `type: "rows"` input: a compact, editable list of rows (e.g. GPA
// courses or people splitting a bill) with add/remove controls. Each column is
// a text, number, currency, percent or select cell. Emits the full row array.

type Props<Inputs> = {
  field: InputFieldSpec<Inputs>;
  rows: RowValue[];
  onChange: (rows: RowValue[]) => void;
};

function blankRow(columns: RowColumn[], template?: RowValue): RowValue {
  if (template) return { ...template };
  const r: RowValue = {};
  for (const c of columns) r[c.name] = c.type === "text" ? "" : c.type === "select" ? (c.options?.[0]?.value ?? "") : 0;
  return r;
}

const cellBase: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  borderRadius: t.radius.md - 2,
  border: `1.5px solid ${t.color.line}`,
  fontSize: 14,
  fontWeight: 600,
  color: t.color.ink,
  background: t.color.surface,
  outline: "none",
  boxSizing: "border-box",
  padding: "9px 10px",
};

export default function RowsInput<Inputs>({ field, rows, onChange }: Props<Inputs>) {
  const columns = field.columns ?? [];
  const min = field.minRows ?? 1;
  const max = field.maxRows ?? 20;

  const setCell = (i: number, name: string, v: number | string) =>
    onChange(rows.map((r, j) => (j === i ? { ...r, [name]: v } : r)));
  const remove = (i: number) => onChange(rows.filter((_, j) => j !== i));
  const add = () => onChange([...rows, blankRow(columns, field.newRow)]);

  const cell = (c: RowColumn, r: RowValue, i: number) => {
    const id = `${field.name}-${i}-${c.name}`;
    const label = `${c.label} ${i + 1}`;
    if (c.type === "select") {
      return (
        <select id={id} aria-label={label} className="fc-select" style={{ ...cellBase, padding: "9px 26px 9px 10px", backgroundPosition: "right 8px center" }}
          value={String(r[c.name] ?? "")} onChange={(e) => setCell(i, c.name, e.target.value)}>
          {c.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }
    if (c.type === "text") {
      return (
        <input id={id} aria-label={label} className="fc-input" type="text" placeholder={c.placeholder}
          value={String(r[c.name] ?? "")} onChange={(e) => setCell(i, c.name, e.target.value)} style={cellBase} />
      );
    }
    const v = r[c.name];
    return (
      <div style={{ position: "relative" }}>
        {c.type === "currency" && <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: t.color.faint, fontSize: 13, fontWeight: 700 }}>$</span>}
        <input id={id} aria-label={label} className="fc-input" type="number" inputMode="decimal"
          min={c.min} max={c.max} step={c.step ?? (c.type === "currency" ? 0.01 : 1)} placeholder={c.placeholder}
          value={typeof v === "number" ? (v === 0 && c.placeholder ? "" : v) : ""}
          onChange={(e) => setCell(i, c.name, parseFloat(e.target.value) || 0)}
          style={{ ...cellBase, paddingLeft: c.type === "currency" ? 20 : 10, paddingRight: c.type === "percent" ? 22 : 10 }} />
        {c.type === "percent" && <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: t.color.faint, fontSize: 12, fontWeight: 700 }}>%</span>}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: t.space.md }}>
      <p style={{ fontSize: t.font.label, fontWeight: 600, color: t.color.body, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {field.label}
      </p>
      <div role="table" aria-label={field.label}>
        <div role="row" style={{ display: "flex", gap: 6, marginBottom: 4 }}>
          {columns.map((c) => (
            <span role="columnheader" key={c.name} style={{ flex: c.grow ?? 1, minWidth: 0, fontSize: 10.5, fontWeight: 700, color: t.color.faint, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {c.label}
            </span>
          ))}
          <span style={{ width: 28 }} aria-hidden />
        </div>
        {rows.map((r, i) => (
          <div role="row" key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
            {columns.map((c) => (
              <div role="cell" key={c.name} style={{ flex: c.grow ?? 1, minWidth: 0 }}>{cell(c, r, i)}</div>
            ))}
            <button type="button" onClick={() => remove(i)} disabled={rows.length <= min} aria-label={`Remove row ${i + 1}`}
              style={{ width: 28, height: 28, flexShrink: 0, border: "none", borderRadius: 8, background: rows.length <= min ? "transparent" : t.color.lineSoft, color: rows.length <= min ? t.color.line : t.color.muted, fontSize: 16, lineHeight: 1, cursor: rows.length <= min ? "default" : "pointer" }}>
              ×
            </button>
          </div>
        ))}
      </div>
      {rows.length < max && (
        <button type="button" onClick={add}
          style={{ marginTop: 2, border: `1.5px dashed ${t.color.line}`, background: "transparent", color: t.color.brand, fontWeight: 700, fontSize: 13, padding: "8px 12px", borderRadius: t.radius.md - 2, cursor: "pointer", width: "100%" }}>
          + {field.addLabel ?? "Add row"}
        </button>
      )}
      {field.helpText && <p style={{ fontSize: 11, color: t.color.faint, marginTop: 4, lineHeight: 1.4 }}>{field.helpText}</p>}
    </div>
  );
}
