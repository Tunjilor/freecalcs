"use client";
import { useState } from "react";
import Link from "next/link";

export default function MortgageCalculator() {
  const [home, setHome] = useState(300000);
  const [down, setDown] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const principal = home - down;
  const mr = rate / 100 / 12;
  const n = years * 12;
  const payment = mr > 0 ? principal * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : principal / n;
  const total = payment * n;
  const interest = total - principal;
  const fmt = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const handlePrint = () => window.print();
  const handleCSV = () => {
    const csv = `Field,Value\nHome Price,$${home}\nDown Payment,$${down}\nLoan Amount,$${principal}\nInterest Rate,${rate}%\nLoan Term,${years} years\nMonthly Payment,${fmt(payment)}\nTotal Payment,${fmt(total)}\nTotal Interest,${fmt(interest)}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mortgage.csv";
    a.click();
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        .input-group { margin-bottom: 20px; }
        .input-label { font-size: 13px; font-weight: 600; color: #374151; display: block; margin-bottom: 6px; }
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          font-size: 16px;
          font-weight: 600;
          color: #111;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-field:focus { border-color: #2563eb; }
        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 10px;
        }
        .action-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }
        .action-btn:hover { border-color: #2563eb; color: #2563eb; }
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 700px) {
          .two-col { grid-template-columns: 1fr; }
          .results-panel { order: -1; }
        }
        @media print { nav, .action-btns { display: none; } }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <p style={{ color: "#6b7280", fontSize: 15 }}>Enter your loan details to see your monthly payment.</p>
          </div>
          <div className="action-btns" style={{ display: "flex", gap: 8 }}>
            <button className="action-btn" onClick={handlePrint}>🖨️ Print</button>
            <button className="action-btn" onClick={handleCSV}>📥 CSV</button>
          </div>
        </div>

        <div className="two-col">
          {/* Left — inputs */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 20 }}>Loan details</p>

            <div className="input-group">
              <label className="input-label">Home price</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontWeight: 600, fontSize: 16 }}>$</span>
                <input className="input-field" style={{ paddingLeft: 28 }} type="number" value={home}
                  onChange={e => setHome(Number(e.target.value))} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Down payment</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontWeight: 600, fontSize: 16 }}>$</span>
                <input className="input-field" style={{ paddingLeft: 28 }} type="number" value={down}
                  onChange={e => setDown(Number(e.target.value))} />
              </div>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                {home > 0 ? `${((down / home) * 100).toFixed(1)}% of home price` : ""}
              </p>
            </div>

            <div className="input-group">
              <label className="input-label">Interest rate</label>
              <div style={{ position: "relative" }}>
                <input className="input-field" style={{ paddingRight: 32 }} type="number" step={0.1} value={rate}
                  onChange={e => setRate(Number(e.target.value))} />
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontWeight: 600, fontSize: 16 }}>%</span>
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Loan term</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[10, 15, 20, 30].map(y => (
                  <button key={y} onClick={() => setYears(y)}
                    style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1.5px solid ${years === y ? "#2563eb" : "#e5e7eb"}`, background: years === y ? "#eff6ff" : "#fff", color: years === y ? "#2563eb" : "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    {y}yr
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — results */}
          <div className="results-panel">
            <div style={{ background: "#2563eb", borderRadius: 16, padding: "28px 24px", textAlign: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Monthly payment</p>
              <p style={{ fontSize: 56, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 6 }}>{fmt(payment)}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{rate}% interest · {years} year term</p>
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

            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", marginTop: 2 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Principal vs interest</p>
              <div style={{ height: 10, borderRadius: 6, background: "#e5e7eb", overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: total > 0 ? `${(principal / total * 100).toFixed(0)}%` : "0%", background: "#2563eb", borderRadius: 6 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280" }}>
                <span>Principal {total > 0 ? `${(principal / total * 100).toFixed(0)}%` : ""}</span>
                <span>Interest {total > 0 ? `${(interest / total * 100).toFixed(0)}%` : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}