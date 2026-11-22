"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { tokens as t } from "@/lib/calculator/tokens";
import { initialState, keyFromKeyboard, pressKey, type CalcKey, type CalcState } from "@/lib/home/basic-calc";
import { formatChange, formatResult, parseInput, percentChange, percentOf, whatPercent } from "@/lib/home/percent-calc";

// The homepage's quick tools: a basic calculator and three percentage forms,
// side by side on desktop and stacked on mobile. All the math lives in the
// pure, tested modules under src/lib/home. This file only wires keys and
// inputs to them. It's server-rendered with example values, so the static
// HTML already shows working results; no extra dependencies, no stylesheet.

type Btn = { key: CalcKey; label: string; aria?: string; kind?: "op" | "fn" | "eq"; wide?: boolean };

const BUTTONS: Btn[] = [
  { key: "clear", label: "AC", aria: "Clear", kind: "fn" },
  { key: "backspace", label: "⌫", aria: "Backspace", kind: "fn" },
  { key: "%", label: "%", aria: "Percent", kind: "fn" },
  { key: "/", label: "÷", aria: "Divide", kind: "op" },
  { key: "7", label: "7" }, { key: "8", label: "8" }, { key: "9", label: "9" },
  { key: "*", label: "×", aria: "Multiply", kind: "op" },
  { key: "4", label: "4" }, { key: "5", label: "5" }, { key: "6", label: "6" },
  { key: "-", label: "−", aria: "Subtract", kind: "op" },
  { key: "1", label: "1" }, { key: "2", label: "2" }, { key: "3", label: "3" },
  { key: "+", label: "+", aria: "Add", kind: "op" },
  { key: "0", label: "0", wide: true },
  { key: ".", label: ".", aria: "Decimal point" },
  { key: "=", label: "=", aria: "Equals", kind: "eq" },
];

function BasicCalculator() {
  const [state, setState] = useState<CalcState>(initialState);
  const rootRef = useRef<HTMLDivElement>(null);

  // Keyboard input works whenever focus is on the page itself or inside this
  // calculator. It stays out of the way of text fields (search, the percentage
  // inputs) and of links or buttons elsewhere, so Enter still follows a link.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = keyFromKeyboard(e.key);
      if (!key) return;
      const active = document.activeElement;
      const onPage = !active || active === document.body || active === document.documentElement;
      if (!onPage && !rootRef.current?.contains(active)) return;
      e.preventDefault(); // stops "/" opening quick-find and Enter re-clicking a focused button
      setState((s) => pressKey(s, key));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const long = state.display.length > 11;

  return (
    <div ref={rootRef} className="qc-card" role="group" aria-labelledby="qc-basic-title">
      <h2 id="qc-basic-title" className="qc-title">Calculator</h2>
      <div className="qc-display">
        <div className="qc-expr" aria-hidden="true">{state.expression || " "}</div>
        <output className="qc-readout" aria-live="polite" style={{ fontSize: long ? 22 : 32 }}>
          {state.display}
        </output>
      </div>
      <div className="qc-keys">
        {BUTTONS.map((b) => (
          <button
            key={b.key}
            type="button"
            aria-label={b.aria}
            className={`qc-key${b.kind ? ` qc-${b.kind}` : ""}${b.wide ? " qc-wide" : ""}`}
            onClick={() => setState((s) => pressKey(s, b.key))}
          >
            {b.label}
          </button>
        ))}
      </div>
      <p className="qc-foot">
        Works with your keyboard too. Need more functions?{" "}
        <Link href="/scientific">Scientific calculator →</Link>
      </p>
    </div>
  );
}

function NumField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <input
      className="qc-input"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function PercentageCalculator() {
  const [a1, setA1] = useState("25");
  const [b1, setB1] = useState("80");
  const [a2, setA2] = useState("20");
  const [b2, setB2] = useState("80");
  const [a3, setA3] = useState("50");
  const [b3, setB3] = useState("75");

  const r1 = formatResult(percentOf(parseInput(a1), parseInput(b1)));
  const p2 = whatPercent(parseInput(a2), parseInput(b2));
  const r2 = p2 === null ? "—" : `${formatResult(p2)}%`;
  const r3 = formatChange(percentChange(parseInput(a3), parseInput(b3)));

  return (
    <div className="qc-card" role="group" aria-labelledby="qc-pct-title">
      <h2 id="qc-pct-title" className="qc-title">Percentage calculator</h2>

      <div className="qc-form">
        <p className="qc-q">
          What is <NumField label="Percent" value={a1} onChange={setA1} /> % of{" "}
          <NumField label="Number" value={b1} onChange={setB1} />?
        </p>
        <output className="qc-answer" aria-live="polite">{r1}</output>
      </div>

      <div className="qc-form">
        <p className="qc-q">
          <NumField label="Part" value={a2} onChange={setA2} /> is what % of{" "}
          <NumField label="Whole" value={b2} onChange={setB2} />?
        </p>
        <output className="qc-answer" aria-live="polite">{r2}</output>
      </div>

      <div className="qc-form">
        <p className="qc-q">
          % change from <NumField label="Starting value" value={a3} onChange={setA3} /> to{" "}
          <NumField label="New value" value={b3} onChange={setB3} />
        </p>
        <output className="qc-answer" aria-live="polite">{r3}</output>
      </div>

      <p className="qc-foot">
        Discounts, increases, differences and more:{" "}
        <Link href="/percentage">all percentage tools →</Link>
      </p>
    </div>
  );
}

export default function QuickCalculators() {
  return (
    <section aria-label="Quick calculators" className="qc-section">
      <style>{css}</style>
      <div className="qc-grid">
        <BasicCalculator />
        <PercentageCalculator />
      </div>
    </section>
  );
}

const css = `
  .qc-section { max-width: ${t.layout.maxWidth}px; margin: -36px auto 0; padding: 0 24px; position: relative; }
  .qc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: ${t.space.lg}px; align-items: stretch; }
  .qc-card { background: ${t.color.surface}; border: 1px solid ${t.color.line}; border-radius: ${t.radius.xl}px; padding: ${t.space.lg}px; box-shadow: ${t.shadow.card}; display: flex; flex-direction: column; }
  .qc-title { font-size: 11px; font-weight: 700; color: ${t.color.muted}; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: ${t.space.md}px; }
  .qc-display { background: ${t.color.ink900}; border-radius: ${t.radius.lg}px; padding: 12px 16px; margin-bottom: ${t.space.md}px; text-align: right; overflow: hidden; }
  .qc-expr { font-size: 13px; color: ${t.color.faint}; min-height: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .qc-readout { display: block; color: ${t.color.onBrand}; font-weight: 700; line-height: 40px; height: 40px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
  .qc-keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .qc-key { font: inherit; font-size: 18px; font-weight: 600; height: 48px; border-radius: ${t.radius.md}px; border: 1px solid ${t.color.line}; background: ${t.color.surfaceAlt}; color: ${t.color.ink}; cursor: pointer; touch-action: manipulation; }
  .qc-key:hover { background: ${t.color.lineSoft}; }
  .qc-key:active { transform: scale(0.97); }
  .qc-key:focus-visible, .qc-input:focus-visible { outline: 2px solid ${t.color.brand}; outline-offset: 2px; }
  .qc-fn { color: ${t.color.brand}; background: ${t.color.brandTint}; border-color: ${t.color.brandTint}; }
  .qc-op { color: ${t.color.brand}; font-size: 22px; background: ${t.color.brandTint}; border-color: ${t.color.brandTint}; }
  .qc-eq { color: ${t.color.onBrand}; background: ${t.color.brand}; border-color: ${t.color.brand}; font-size: 22px; }
  .qc-eq:hover { background: ${t.color.brand}; opacity: 0.9; }
  .qc-wide { grid-column: span 2; }
  .qc-form { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid ${t.color.lineSoft}; }
  .qc-q { font-size: ${t.font.body}px; color: ${t.color.body}; line-height: 2.4; }
  .qc-input { font: inherit; font-size: ${t.font.body}px; font-weight: 600; width: 84px; padding: 6px 8px; border: 1.5px solid ${t.color.line}; border-radius: ${t.radius.sm}px; color: ${t.color.ink}; background: ${t.color.surface}; text-align: right; }
  .qc-input:focus { border-color: ${t.color.brand}; outline: none; }
  .qc-answer { flex-shrink: 0; min-width: 96px; text-align: right; font-size: 20px; font-weight: 800; color: ${t.color.brand}; font-variant-numeric: tabular-nums; }
  .qc-foot { margin-top: auto; padding-top: ${t.space.md}px; font-size: 12px; color: ${t.color.muted}; }
  .qc-foot a { color: ${t.color.brand}; font-weight: 600; text-decoration: none; }
  @media (max-width: 800px) {
    .qc-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .qc-section { padding: 0 16px; margin-top: -24px; }
    .qc-form { flex-direction: column; align-items: stretch; gap: 4px; }
    .qc-answer { text-align: left; }
    .qc-input { width: 76px; }
  }
`;
