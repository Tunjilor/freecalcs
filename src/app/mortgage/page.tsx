"use client";
import { useState } from "react";
import Link from "next/link";

export default function MortgageCalculator() {
  const [home, setHome] = useState(300000);
  const [down, setDown] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [customYears, setCustomYears] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const actualYears = useCustom ? (parseFloat(customYears) || 0) : years;
  const principal = home - down;
  const mr = rate / 100 / 12;
  const n = actualYears * 12;
  const payment = mr > 0 && n > 0 ? principal * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : 0;
  const total = payment * n;
  const interest = total - principal;
  const fmt = (v: number) => isNaN(v) || !isFinite(v) ? "$0" : v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const handlePrint = () => window.print();
  const handleCSV = () => {
    const csv = `Field,Value\nHome Price,$${home}\nDown Payment,$${down}\nLoan Amount,$${principal}\nInterest Rate,${rate}%\nLoan Term,${actualYears} years\nMonthly Payment,${fmt(payment)}\nTotal Payment,${fmt(total)}\nTotal Interest,${fmt(interest)}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mortgage.csv";
    a.click();
  };

  const termOptions = [
    { label: "10yr", value: 10, desc: "Build equity fast" },
    { label: "15yr", value: 15, desc: "Less interest" },
    { label: "20yr", value: 20, desc: "Middle ground" },
    { label: "30yr", value: 30, desc: "Lowest payment" },
    { label: "40yr", value: 40, desc: "Non-QM" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        .input-label { font-size: 13px; font-weight: 600; color: #374151; display: block; margin-bottom: 6px; }
        .input-field {
          width: 100%; padding: 12px 16px; border-radius: 10px;
          border: 1.5px solid #e5e7eb; font-size: 16px; font-weight: 600;
          color: #111; background: #fff; outline: none; transition: border-color 0.15s;
        }
        .input-field:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .result-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 20px; background: #fff; border: 1px solid #e5e7eb;
          border-radius: 12px; margin-bottom: 10px;
        }
        .action-btn {
          padding: 8px 16px; border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; font-size: 13px; font-weight: 600; color: #374151;
          cursor: pointer; transition: all 0.15s;
        }
        .action-btn:hover { border-color: #2563eb; color: #2563eb; }
        .term-btn {
          flex: 1; padding: 10px 4px; border-radius: 8px;
          border: 1.5px solid #e5e7eb; background: #fff;
          cursor: pointer; transition: all 0.15s; text-align: center;
        }
        .term-btn.active { border-color: #2563eb; background: #eff6ff; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        @media (max-width: 700px) {
          .two-col { grid-template-columns: 1fr; }
          .results-panel { order: -1; }
          .action-btns { display: none !important; }
        }
        @media print { nav, .action-btns { display: none; } }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <b style={{ color: "#111", fontSize: 20 }}>freecalcs</b>
            <b style={{ color: "#2563eb", fontSize: 20 }}>.io</b>
          </Link>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← All calculators</Link>
        </div>
      </nav>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111", marginBottom: 4 }}>Mortgage Calculator</h1>
            <p style={{ color: "#6b7280", fontSize: 15 }}>Enter your loan details to see your monthly payment instantly.</p>
          </div>
          <div className="action-btns" style={{ display: "flex", gap: 8 }}>
            <button className="action-btn" onClick={handlePrint}>🖨️ Print</button>
            <button className="action-btn" onClick={handleCSV}>📥 CSV</button>
          </div>
        </div>

        <div className="two-col">
          {/* Inputs */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 }}>Loan details</p>

            <div>
              <label className="input-label">Home price</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700 }}>$</span>
                <input className="input-field" style={{ paddingLeft: 26 }} type="number" value={home}
                  onChange={e => setHome(Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className="input-label">Down payment</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700 }}>$</span>
                <input className="input-field" style={{ paddingLeft: 26 }} type="number" value={down}
                  onChange={e => setDown(Number(e.target.value))} />
              </div>
              {home > 0 && (
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  {((down / home) * 100).toFixed(1)}% of home price · Loan: {fmt(principal)}
                </p>
              )}
            </div>

            <div>
              <label className="input-label">Interest rate (annual)</label>
              <div style={{ position: "relative" }}>
                <input className="input-field" style={{ paddingRight: 30 }} type="number" step={0.1} value={rate}
                  onChange={e => setRate(Number(e.target.value))} />
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700 }}>%</span>
              </div>
            </div>

            <div>
              <label className="input-label">Loan term</label>
              {/* Quick select buttons */}
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {termOptions.map(t => (
                  <button key={t.value} className={`term-btn${!useCustom && years === t.value ? " active" : ""}`}
                    onClick={() => { setYears(t.value); setUseCustom(false); }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: !useCustom && years === t.value ? "#2563eb" : "#111" }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: !useCustom && years === t.value ? "#3b82f6" : "#9ca3af", marginTop: 2 }}>{t.desc}</div>
                  </button>
                ))}
              </div>
              {/* Custom input */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <input className="input-field"
                    style={{ paddingRight: 50, borderColor: useCustom ? "#2563eb" : "#e5e7eb" }}
                    type="number" placeholder="Custom"
                    value={customYears}
                    onFocus={() => setUseCustom(true)}
                    onChange={e => { setCustomYears(e.target.value); setUseCustom(true); }} />
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>years</span>
                </div>
                {useCustom && (
                  <button onClick={() => { setUseCustom(false); setCustomYears(""); }}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, color: "#6b7280", cursor: "pointer" }}>
                    Clear
                  </button>
                )}
              </div>
              {/* Term info */}
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#f8f9fb", borderRadius: 8, fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
                {actualYears === 30 && "30-year fixed: Most popular — lowest monthly payment, highest total interest."}
                {actualYears === 15 && "15-year fixed: Higher monthly payment but saves significantly on interest."}
                {actualYears === 10 && "10-year fixed: Fastest equity build, highest monthly payment."}
                {actualYears === 20 && "20-year fixed: Good middle ground between payment and interest savings."}
                {actualYears === 40 && "40-year loan: Lowest possible payment but non-qualified — higher rates apply."}
                {![10,15,20,30,40].includes(actualYears) && actualYears > 0 && `Custom ${actualYears}-year term selected.`}
                {actualYears === 5 && " Note: 5/1 ARM — fixed for 5 years, then adjusts annually."}
                {actualYears === 7 && " Note: 7/1 ARM — fixed for 7 years, then adjusts annually."}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="results-panel">
            <div style={{ background: "#2563eb", borderRadius: 16, padding: "28px 24px", textAlign: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Monthly payment</p>
              <p style={{ fontSize: 56, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 6 }}>{fmt(payment)}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{rate}% · {actualYears} year{actualYears !== 1 ? "s" : ""}</p>
            </div>

            <div className="result-row">
              <span style={{ fontSize: 14, color: "#6b7280" }}>Loan amount</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>{fmt(principal)}</span>
            </div>
            <div className="result-row">
              <span style={{ fontSize: 14, color: "#6b7280" }}>Total payment</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>{fmt(total)}</span>
            </div>
            <div className="result-row">
              <span style={{ fontSize: 14, color: "#6b7280" }}>Total interest</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#dc2626" }}>{fmt(interest)}</span>
            </div>
            <div className="result-row" style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>Down payment</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>{fmt(down)}</span>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Principal vs interest</p>
              <div style={{ height: 10, borderRadius: 6, background: "#e5e7eb", overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: total > 0 ? `${(principal / total * 100).toFixed(0)}%` : "0%", background: "#2563eb", borderRadius: 6 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280" }}>
                <span style={{ color: "#2563eb", fontWeight: 600 }}>Principal {total > 0 ? `${(principal / total * 100).toFixed(0)}%` : ""}</span>
                <span style={{ color: "#dc2626", fontWeight: 600 }}>Interest {total > 0 ? `${(interest / total * 100).toFixed(0)}%` : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}