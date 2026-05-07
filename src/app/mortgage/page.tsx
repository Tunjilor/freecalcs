"use client";
import { useState } from "react";
import Link from "next/link";

type CalcMode = "buy" | "refinance" | "equity";

export default function MortgageCalculator() {
  const [mode, setMode] = useState<CalcMode>("buy");
  const [home, setHome] = useState(400000);
  const [down, setDown] = useState(80000);
  const [balance, setBalance] = useState(280000);
  const [equityUse, setEquityUse] = useState(50000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [customYears, setCustomYears] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [startMonth, setStartMonth] = useState(new Date().getMonth());
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [propTax, setPropTax] = useState(3000);
  const [insurance, setInsurance] = useState(1500);
  const [pmi, setPmi] = useState(0.5);
  const [hoa, setHoa] = useState(0);

  const actualYears = useCustom ? (parseFloat(customYears) || 0) : years;
  
  const principal = mode === "buy" ? home - down : mode === "refinance" ? balance : balance + equityUse;
  const mr = rate / 100 / 12;
  const n = actualYears * 12;
  const basePmt = mr > 0 && n > 0 ? principal * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : 0;
  const monthlyTax = propTax / 12;
  const monthlyIns = insurance / 12;
  const monthlyPMI = (mode === "buy" && down / home < 0.2) ? (principal * pmi / 100 / 12) : 0;
  const monthlyHOA = hoa;
  const totalMonthly = basePmt + monthlyTax + monthlyIns + monthlyPMI + monthlyHOA;
  const biWeekly = basePmt / 2;
  const total = basePmt * n;
  const interest = total - principal;

  const payoffDate = new Date(startYear, startMonth + n);
  const payoffStr = payoffDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const startStr = new Date(startYear, startMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const fmt = (v: number) => isNaN(v) || !isFinite(v) ? "$0" : v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const fmt2 = (v: number) => isNaN(v) || !isFinite(v) ? "$0.00" : v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const termOptions = [
    { label: "10yr", value: 10, desc: "Fastest" },
    { label: "15yr", value: 15, desc: "Popular" },
    { label: "20yr", value: 20, desc: "Balanced" },
    { label: "30yr", value: 30, desc: "Lowest pmt" },
    { label: "40yr", value: 40, desc: "Non-QM" },
  ];

  const handleCSV = () => {
    const rows = [
      ["Calculator Mode", mode === "buy" ? "Buy a Home" : mode === "refinance" ? "Refinance" : "Use Equity"],
      ["Principal", fmt(principal)],
      ["Interest Rate", `${rate}%`],
      ["Loan Term", `${actualYears} years`],
      ["Start Date", startStr],
      ["Payoff Date", payoffStr],
      ["Monthly P&I", fmt2(basePmt)],
      ["Monthly Tax", fmt2(monthlyTax)],
      ["Monthly Insurance", fmt2(monthlyIns)],
      ["Monthly PMI", fmt2(monthlyPMI)],
      ["Monthly HOA", fmt2(monthlyHOA)],
      ["Total Monthly Payment", fmt2(totalMonthly)],
      ["Bi-weekly Payment", fmt2(biWeekly)],
      ["Total Interest", fmt(interest)],
      ["Total Payment", fmt(total)],
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "mortgage.csv";
    a.click();
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        .lbl { font-size: 13px; font-weight: 600; color: #374151; display: block; margin-bottom: 5px; }
        .inp {
          width: 100%; padding: 10px 14px; border-radius: 9px;
          border: 1.5px solid #e5e7eb; font-size: 15px; font-weight: 600;
          color: #111; background: #fff; outline: none;
        }
        .inp:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .inp-wrap { position: relative; }
        .inp-pre { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-weight: 700; font-size: 15px; }
        .inp-suf { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-weight: 700; font-size: 13px; }
        .row-result { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 8px; }
        .mode-btn { flex: 1; padding: 10px 8px; border-radius: 8px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.15s; }
        .mode-btn.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
        .term-btn { flex: 1; padding: 8px 2px; border-radius: 7px; border: 1.5px solid #e5e7eb; background: #fff; cursor: pointer; text-align: center; transition: all 0.15s; }
        .term-btn.active { border-color: #2563eb; background: #eff6ff; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
        .card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; padding: 22px; }
        .section-title { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 16px; }
        .field { margin-bottom: 14px; }
        .hint { font-size: 11px; color: #9ca3af; margin-top: 3px; }
        .divider { border: none; border-top: 1px solid #f3f4f6; margin: 14px 0; }
        select.inp { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
        @media (max-width: 720px) {
          .two-col { grid-template-columns: 1fr; }
          .results-col { order: -1; }
        }
        @media print { nav, .no-print { display: none; } }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <b style={{ color: "#111", fontSize: 20 }}>freecalcs</b><b style={{ color: "#2563eb", fontSize: 20 }}>.io</b>
          </Link>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← All calculators</Link>
        </div>
      </nav>

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 3 }}>Mortgage Calculator</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Calculate payments for buying, refinancing, or using home equity.</p>
          </div>
          <div className="no-print" style={{ display: "flex", gap: 8 }}>
            <button onClick={() => window.print()} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🖨️ Print</button>
            <button onClick={handleCSV} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📥 CSV</button>
          </div>
        </div>

        {/* Mode selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {([["buy","🏠 Buy a Home"],["refinance","🔄 Refinance"],["equity","💰 Use Equity"]] as [CalcMode,string][]).map(([m,l]) => (
            <button key={m} className={`mode-btn${mode===m?" active":""}`} onClick={() => setMode(m)}>{l}</button>
          ))}
        </div>

        <div className="two-col">
          {/* LEFT — inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Loan details */}
            <div className="card">
              <p className="section-title">Loan details</p>

              {mode === "buy" && (
                <>
                  <div className="field">
                    <label className="lbl">Home price</label>
                    <div className="inp-wrap"><span className="inp-pre">$</span>
                      <input className="inp" style={{ paddingLeft: 24 }} type="number" value={home} onChange={e => setHome(Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="lbl">Down payment</label>
                    <div className="inp-wrap"><span className="inp-pre">$</span>
                      <input className="inp" style={{ paddingLeft: 24 }} type="number" value={down} onChange={e => setDown(Number(e.target.value))} />
                    </div>
                    <p className="hint">{home > 0 ? `${((down/home)*100).toFixed(1)}% · Loan: ${fmt(home-down)}` : ""}{down/home < 0.2 ? " · PMI applies" : " · No PMI"}</p>
                  </div>
                </>
              )}

              {mode === "refinance" && (
                <div className="field">
                  <label className="lbl">Current loan balance</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} />
                  </div>
                </div>
              )}

              {mode === "equity" && (
                <>
                  <div className="field">
                    <label className="lbl">Current loan balance</label>
                    <div className="inp-wrap"><span className="inp-pre">$</span>
                      <input className="inp" style={{ paddingLeft: 24 }} type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="lbl">Equity amount to use</label>
                    <div className="inp-wrap"><span className="inp-pre">$</span>
                      <input className="inp" style={{ paddingLeft: 24 }} type="number" value={equityUse} onChange={e => setEquityUse(Number(e.target.value))} />
                    </div>
                    <p className="hint">New loan total: {fmt(balance + equityUse)}</p>
                  </div>
                </>
              )}

              <div className="field">
                <label className="lbl">Interest rate</label>
                <div className="inp-wrap">
                  <input className="inp" style={{ paddingRight: 28 }} type="number" step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} />
                  <span className="inp-suf">%</span>
                </div>
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label className="lbl">Loan term</label>
                <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                  {termOptions.map(t => (
                    <button key={t.value} className={`term-btn${!useCustom && years===t.value?" active":""}`}
                      onClick={() => { setYears(t.value); setUseCustom(false); }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: !useCustom && years===t.value ? "#2563eb" : "#111" }}>{t.label}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="inp-wrap">
                  <input className="inp" style={{ paddingRight: 50 }} type="number" placeholder="Custom years"
                    value={customYears} onFocus={() => setUseCustom(true)}
                    onChange={e => { setCustomYears(e.target.value); setUseCustom(true); }} />
                  <span className="inp-suf">yrs</span>
                </div>
              </div>
            </div>

            {/* Start date */}
            <div className="card">
              <p className="section-title">Start date</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label className="lbl">Month</label>
                  <select className="inp" value={startMonth} onChange={e => setStartMonth(Number(e.target.value))}>
                    {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">Year</label>
                  <select className="inp" value={startYear} onChange={e => setStartYear(Number(e.target.value))}>
                    {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Additional costs */}
            <div className="card">
              <p className="section-title">Monthly costs (optional)</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label className="lbl">Property tax/yr</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={propTax} onChange={e => setPropTax(Number(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label className="lbl">Home insurance/yr</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={insurance} onChange={e => setInsurance(Number(e.target.value))} />
                  </div>
                </div>
                {mode === "buy" && down/home < 0.2 && (
                  <div>
                    <label className="lbl">PMI rate</label>
                    <div className="inp-wrap">
                      <input className="inp" style={{ paddingRight: 28 }} type="number" step={0.1} value={pmi} onChange={e => setPmi(Number(e.target.value))} />
                      <span className="inp-suf">%</span>
                    </div>
                  </div>
                )}
                <div>
                  <label className="lbl">Monthly HOA</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={hoa} onChange={e => setHoa(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — results */}
          <div className="results-col" style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Main result */}
            <div style={{ background: "#2563eb", borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Total monthly payment</p>
              <p style={{ fontSize: 52, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 4 }}>{fmt2(totalMonthly)}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{rate}% · {actualYears} years · starts {startStr}</p>
            </div>

            {/* Payment breakdown */}
            <div className="card">
              <p className="section-title">Payment breakdown</p>
              {[
                ["Principal & interest", fmt2(basePmt), "#2563eb"],
                ["Property tax", fmt2(monthlyTax), "#374151"],
                ["Home insurance", fmt2(monthlyIns), "#374151"],
                ...(monthlyPMI > 0 ? [["PMI", fmt2(monthlyPMI), "#f59e0b"]] : []),
                ...(monthlyHOA > 0 ? [["HOA", fmt2(monthlyHOA), "#374151"]] : []),
              ].map(([l, v, c]) => (
                <div key={String(l)} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: 14 }}>
                  <span style={{ color: "#6b7280" }}>{l}</span>
                  <span style={{ fontWeight: 700, color: String(c) }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Loan summary */}
            <div className="card">
              <p className="section-title">Loan summary</p>
              {[
                ["Loan amount", fmt(principal)],
                ["Total interest", fmt(interest)],
                ["Total cost", fmt(total)],
              ].map(([l, v]) => (
                <div key={String(l)} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: 14 }}>
                  <span style={{ color: "#6b7280" }}>{l}</span>
                  <span style={{ fontWeight: 700, color: "#111" }}>{v}</span>
                </div>
              ))}
              {/* Progress bar */}
              <div style={{ marginTop: 12 }}>
                <div style={{ height: 8, borderRadius: 4, background: "#e5e7eb", overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ height: "100%", width: total > 0 ? `${(principal/total*100).toFixed(0)}%` : "0%", background: "#2563eb", borderRadius: 4 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "#2563eb", fontWeight: 600 }}>Principal {total > 0 ? `${(principal/total*100).toFixed(0)}%` : ""}</span>
                  <span style={{ color: "#dc2626", fontWeight: 600 }}>Interest {total > 0 ? `${(interest/total*100).toFixed(0)}%` : ""}</span>
                </div>
              </div>
            </div>

            {/* Key dates & payments */}
            <div className="card">
              <p className="section-title">Key dates & payment options</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  ["Start date", startStr],
                  ["Payoff date", payoffStr],
                  ["Bi-weekly payment", fmt2(biWeekly)],
                  ["Annual payment", fmt(basePmt * 12)],
                ].map(([l, v]) => (
                  <div key={String(l)} style={{ background: "#f8f9fb", borderRadius: 8, padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 3 }}>{l}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{v}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 10, lineHeight: 1.5 }}>
                💡 Bi-weekly payments can pay off your loan 4-6 years early and save thousands in interest.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}