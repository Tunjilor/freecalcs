"use client";
import { useState } from "react";
import { tokens as t } from "@/lib/calculator/tokens";
import type { InputField as InputFieldSpec } from "@/lib/calculator/types";

// Renders any InputField spec: currency (with $ mask + thousands separators),
// percent, number, years/months, or a select. Value is always a number except
// for selects, which carry string values. Emits the parsed value up.

type Props<Inputs> = {
  field: InputFieldSpec<Inputs>;
  value: number | string;
  onChange: (v: number | string) => void;
};

const labelStyle: React.CSSProperties = {
  fontSize: t.font.label,
  fontWeight: 600,
  color: t.color.body,
  display: "block",
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const fieldBase: React.CSSProperties = {
  width: "100%",
  borderRadius: t.radius.md - 1,
  border: `1.5px solid ${t.color.line}`,
  fontSize: t.font.lead,
  fontWeight: 600,
  color: t.color.ink,
  background: t.color.surface,
  outline: "none",
  boxSizing: "border-box",
};

export default function InputField<Inputs>({ field, value, onChange }: Props<Inputs>) {
  const [display, setDisplay] = useState(
    field.type === "currency" && typeof value === "number"
      ? value > 0
        ? value.toLocaleString("en-US")
        : ""
      : String(value),
  );

  if (field.type === "select") {
    return (
      <div style={{ marginBottom: t.space.md }}>
        <label style={labelStyle} htmlFor={field.name}>
          {field.label}
        </label>
        <select
          id={field.name}
          className="fc-select"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {field.helpText && <p style={hintStyle}>{field.helpText}</p>}
      </div>
    );
  }

  if (field.type === "currency") {
    return (
      <div style={{ marginBottom: t.space.md }}>
        <label style={labelStyle} htmlFor={field.name}>
          {field.label}
        </label>
        <div style={{ position: "relative" }}>
          <span style={prefixStyle}>$</span>
          <input
            id={field.name}
            className="fc-input"
            type="text"
            inputMode="numeric"
            value={display}
            placeholder="0"
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              const n = parseInt(raw, 10) || 0;
              setDisplay(n > 0 ? n.toLocaleString("en-US") : "");
              onChange(n);
            }}
            style={{ ...fieldBase, padding: "11px 14px 11px 26px" }}
          />
        </div>
        {field.helpText && <p style={hintStyle}>{field.helpText}</p>}
      </div>
    );
  }

  // number / percent / years / months
  const suffix =
    field.type === "percent" ? "%" : field.type === "years" ? "yrs" : field.type === "months" ? "mo" : undefined;
  return (
    <div style={{ marginBottom: t.space.md }}>
      <label style={labelStyle} htmlFor={field.name}>
        {field.label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={field.name}
          className="fc-input"
          type="number"
          inputMode="decimal"
          step={field.step ?? (field.type === "percent" ? 0.1 : 1)}
          min={field.min}
          max={field.max}
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{ ...fieldBase, padding: suffix ? "11px 44px 11px 14px" : "11px 14px" }}
        />
        {suffix && <span style={suffixStyle}>{suffix}</span>}
      </div>
      {field.helpText && <p style={hintStyle}>{field.helpText}</p>}
    </div>
  );
}

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: t.color.faint,
  marginTop: 4,
  lineHeight: 1.4,
};
const prefixStyle: React.CSSProperties = {
  position: "absolute",
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  color: t.color.faint,
  fontWeight: 700,
  pointerEvents: "none",
  fontSize: 15,
};
const suffixStyle: React.CSSProperties = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  color: t.color.faint,
  fontWeight: 700,
  fontSize: 13,
  pointerEvents: "none",
};
