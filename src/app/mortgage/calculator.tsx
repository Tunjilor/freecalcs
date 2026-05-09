// @ts-nocheck
"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

type Mode = "buy" | "refinance" | "equity" | "afford";

interface AmortRow {
  month: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

function MoneyInput({ label, value, onChange, hint }: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  const [display, setDisplay] = useState(
    value > 0 ? value.toLocaleString("en-US") : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = parseInt(raw, 10) || 0;
    const formatted = num > 0 ? num.toLocaleString("en-US") : "";
    setDisplay(formatted);
    onChange(num);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700, pointerEvents: "none", fontSize: 15 }}>$</span>
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder="0"
          style={{ width: "100%", padding: "11px 14px 11px 26px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 15, fontWeight: 600, color: "#111", background: "#fff", outline: "none", boxSizing: "border-box" }}
        />
      </div>
      {hint && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, lineHeight: 1.4 }}>{hint}</p>}
    </div>
  );
}

// Rate/number input component  
function NumberInput({ label, value, onChange, suffix, step, hint }: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: number;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          step={step || 0.1}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          style={{ width: "100%", padding: "11px 30px 11px 14px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 15, fontWeight: 600, color: "#111", background: "#fff", outline: "none", boxSizing: "border-box" }}
        />
        {suffix && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700, fontSize: 13, pointerEvents: "none" }}>{suffix}</span>}
      </div>
      {hint && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, lineHeight: 1.4 }}>{hint}</p>}
    </div>
  );
}

export default function MortgageCalculator() {
  const [mode, setMode] = useState<Mode>("buy");
  const [homePrice, setHomePrice] = useState(400000);
  const [downAmt, setDownAmt] = useState(80000);
  const [downPct, setDownPct] = useState(20);
  const [downMode, setDownMode] = useState<"$" | "%">("$");
  const [loanBalance, setLoanBalance] = useState(280000);
  const [equityAmt, setEquityAmt] = useState(50000);
  const [rate, setRate] = useState(6.27);
  const [years, setYears] = useState(30);
  const [customYears, setCustomYears] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [startMonth, setStartMonth] = useState(new Date().getMonth());
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [propTax, setPropTax] = useState(4800);
  const [insurance, setInsurance] = useState(1500);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [hoa, setHoa] = useState(0);
  const [extraPayment, setExtraPayment] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [activeTab, setActiveTab] = useState<"summary" | "amortization" | "compare" | "affordability">("summary");
  const [showFullAmort, setShowFullAmort] = useState(false);
  const [compareRate, setCompareRate] = useState(5.5);
  const [compareYears, setCompareYears] = useState(15);

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const _homePrice = sp.get('homePrice'); if (_homePrice) setHomePrice(Number(_homePrice));
    const _downAmt = sp.get('downAmt'); if (_downAmt) setDownAmt(Number(_downAmt));
    const _rate = sp.get('rate'); if (_rate) setRate(_rate as any);
    const _term = sp.get('term'); if (_term) setTerm(_term as any);
  }, []);
  const shareCalc = () => {
    const params = new URLSearchParams({ 'homePrice': String(homePrice), 'downAmt': String(downAmt), 'rate': String(rate), 'term': String(term) });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    window.history.replaceState({}, '', '?' + params.toString());
  };

  const actualYears = useCustom ? (parseFloat(customYears) || 30) : years;

  const principal = useMemo(() => {
    if (mode === "buy") {
      if (downMode === "%") return homePrice * (1 - downPct / 100);
      return homePrice - downAmt;
    }
    if (mode === "refinance") return loanBalance;
    if (mode === "equity") return loanBalance + equityAmt;
    return homePrice * 0.8;
  }, [mode, homePrice, downAmt, downPct, downMode, loanBalance, equityAmt]);

  const downPayment = downMode === "%" ? homePrice * downPct / 100 : downAmt;
  const downPctCalc = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const needsPMI = mode === "buy" && downPctCalc < 20;
  const mr = rate / 100 / 12;
  const n = actualYears * 12;

  const basePmt = useMemo(() => {
    if (mr <= 0 || n <= 0) return principal / (n || 1);
    return principal * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  }, [principal, mr, n]);

  const monthlyTax = propTax / 12;
  const monthlyIns = insurance / 12;
  const monthlyPMI = needsPMI ? (principal * pmiRate / 100 / 12) : 0;
  const totalMonthly = basePmt + monthlyTax + monthlyIns + monthlyPMI + hoa;
  const totalMonthlyWithExtra = totalMonthly + extraPayment;
  const biWeekly = basePmt / 2;

  const amortSchedule = useMemo((): AmortRow[] => {
    const rows: AmortRow[] = [];
    let balance = principal;
    let totalInt = 0;
    const pmt = basePmt + extraPayment;
    const startDate = new Date(startYear, startMonth);
    for (let i = 1; i <= n && balance > 0; i++) {
      const intPmt = balance * mr;
      const prinPmt = Math.min(pmt - intPmt, balance);
      balance = Math.max(0, balance - prinPmt);
      totalInt += intPmt;
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + i - 1);
      rows.push({ month: i, date: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }), payment: intPmt + prinPmt, principal: prinPmt, interest: intPmt, balance, totalInterest: totalInt });
      if (balance === 0) break;
    }
    return rows;
  }, [principal, mr, n, basePmt, extraPayment, startYear, startMonth]);

  const baseSchedule = useMemo((): AmortRow[] => {
    if (extraPayment === 0) return amortSchedule;
    const rows: AmortRow[] = [];
    let balance = principal;
    let totalInt = 0;
    const startDate = new Date(startYear, startMonth);
    for (let i = 1; i <= n && balance > 0; i++) {
      const intPmt = balance * mr;
      const prinPmt = Math.min(basePmt - intPmt, balance);
      balance = Math.max(0, balance - prinPmt);
      totalInt += intPmt;
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + i - 1);
      rows.push({ month: i, date: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }), payment: basePmt, principal: prinPmt, interest: intPmt, balance, totalInterest: totalInt });
      if (balance === 0) break;
    }
    return rows;
  }, [principal, mr, n, basePmt, extraPayment, startYear, startMonth]);

  const monthsSaved = baseSchedule.length - amortSchedule.length;
  const interestSaved = (baseSchedule[baseSchedule.length - 1]?.totalInterest || 0) - (amortSchedule[amortSchedule.length - 1]?.totalInterest || 0);
  const totalInterest = amortSchedule[amortSchedule.length - 1]?.totalInterest || 0;
  const totalCost = principal + totalInterest;
  const pmiRemovalMonth = amortSchedule.findIndex(r => r.balance <= principal * 0.8) + 1;
  const payoffDate = amortSchedule[amortSchedule.length - 1]?.date || "";
  const startDateStr = new Date(startYear, startMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const mrC = compareRate / 100 / 12;
  const nC = compareYears * 12;
  const pmtC = mrC > 0 ? principal * (mrC * Math.pow(1 + mrC, nC)) / (Math.pow(1 + mrC, nC) - 1) : principal / nC;
  const totalIntC = pmtC * nC - principal;

  const maxPITI_28 = annualIncome / 12 * 0.28;
  const maxTotal_36 = annualIncome / 12 * 0.36 - monthlyDebts;
  const maxAffordable = Math.min(maxPITI_28, maxTotal_36);
  const maxLoan = mr > 0 ? maxAffordable / (mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1)) : maxAffordable * n;
  const affordableHome = maxLoan / 0.8;
  const dti = totalMonthly / (annualIncome / 12) * 100;

  const fmt = (v: number) => isNaN(v) || !isFinite(v) ? "$0" : v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const fmt2 = (v: number) => isNaN(v) || !isFinite(v) ? "$0.00" : v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtPct = (v: number) => `${isNaN(v) || !isFinite(v) ? "0.0" : v.toFixed(1)}%`;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const handleCSV = () => {
    const header = "Month,Date,Payment,Principal,Interest,Balance,Total Interest\n";
    const rows = amortSchedule.map(r => `${r.month},${r.date},${r.payment.toFixed(2)},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.balance.toFixed(2)},${r.totalInterest.toFixed(2)}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([header + rows], { type: "text/csv" }));
    a.download = "amortization-schedule.csv";
    a.click();
  };

  const displayedRows = showFullAmort ? amortSchedule : amortSchedule.slice(0, 24);

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1; }
        input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1) !important; outline: none; }
        select { width: 100%; padding: 11px 32px 11px 14px; border-radius: 9px; border: 1.5px solid #e5e7eb; font-size: 15px; font-weight: 600; color: #111; background: #fff; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; cursor: pointer; }
        .card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; padding: 22px; margin-bottom: 14px; }
        .section-title { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 16px; }
        .mode-btn { flex: 1; padding: 10px 6px; border-radius: 9px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.15s; text-align: center; }
        .mode-btn.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
        .tab-btn { padding: 8px 14px; border-radius: 8px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #6b7280; cursor: pointer; flex: 1; text-align: center; }
        .tab-btn.active { background: #fff; color: #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .term-btn { flex: 1; padding: 9px 2px; border-radius: 8px; border: 1.5px solid #e5e7eb; background: #fff; cursor: pointer; text-align: center; transition: all 0.15s; }
        .term-btn.active { border-color: #2563eb; background: #eff6ff; }
        .result-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        .result-row:last-child { border-bottom: none; }
        .stat-box { background: #f8f9fb; border-radius: 10px; padding: 14px; text-align: center; }
        .amort-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .amort-table th { background: #f8f9fb; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #e5e7eb; }
        .amort-table td { padding: 9px 12px; border-bottom: 1px solid #f3f4f6; color: #374151; }
        .amort-table tr:hover td { background: #f8f9fb; }
        .amort-table tr.year-row td { background: #eff6ff; font-weight: 700; color: #1d4ed8; }
        .progress-bar { height: 10px; border-radius: 5px; background: #e5e7eb; overflow: hidden; margin: 8px 0; }
        .progress-fill { height: 100%; border-radius: 5px; background: #2563eb; }
        .two-col { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: start; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .action-btn { padding: 8px 14px; border-radius: 8px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; }
        .action-btn:hover { border-color: #2563eb; color: #2563eb; }
        @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } .results-col { order: -1; } .grid-3 { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } .mode-btn { font-size: 11px; padding: 8px 4px; } }
        @media print { nav, .no-print { display: none !important; } }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <b style={{ color: "#111", fontSize: 20 }}>freecalcs</b><b style={{ color: "#2563eb", fontSize: 20 }}>.io</b>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", color: "#15803d", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>📊 30yr avg: 6.27%</span>
            <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← All calculators</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 4 }}>Mortgage Calculator</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Full payment breakdown with amortization, extra payments, and loan comparison.</p>
          </div>
          <div className="no-print" style={{ display: "flex", gap: 8 }}>
            <button className="action-btn" onClick={() => window.print()}>🖨️ Print</button>
            <button className="action-btn" onClick={handleCSV}>📥 CSV</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {([["buy","🏠 Buy a Home"],["refinance","🔄 Refinance"],["equity","💰 Use Equity"],["afford","💡 Can I Afford It?"]] as [Mode,string][]).map(([m,l]) => (
            <button key={m} className={`mode-btn${mode===m?" active":""}`} onClick={() => { setMode(m); setActiveTab("summary"); }}>{l}</button>
          ))}
        </div>

        <div className="two-col">
          <div>
            <div className="card">
              <p className="section-title">{mode==="buy"?"Home Purchase":mode==="refinance"?"Refinance":mode==="equity"?"Home Equity":"Affordability"} Details</p>

              {(mode==="buy"||mode==="afford") && (
                <>
                  <MoneyInput label="Home price" value={homePrice} onChange={setHomePrice} />
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Down payment</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        {downMode==="$" && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700, pointerEvents: "none" }}>$</span>}
                        <input
                          type="text" inputMode="numeric"
                          value={downMode==="$" ? (downAmt > 0 ? downAmt.toLocaleString("en-US") : "") : String(downPct)}
                          onChange={e => {
                            const clean = e.target.value.replace(/[^0-9.]/g, "");
                            downMode==="$" ? setDownAmt(parseFloat(clean)||0) : setDownPct(parseFloat(clean)||0);
                          }}
                          style={{ width: "100%", padding: downMode==="$"?"11px 14px 11px 24px":"11px 28px 11px 14px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 15, fontWeight: 600, color: "#111", background: "#fff", outline: "none" }}
                        />
                        {downMode==="%" && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700, pointerEvents: "none" }}>%</span>}
                      </div>
                      <div style={{ display: "flex", borderRadius: 9, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
                        {(["$","%"] as const).map(m => (
                          <button key={m} onClick={() => setDownMode(m)}
                            style={{ padding: "0 14px", background: downMode===m?"#2563eb":"#fff", color: downMode===m?"#fff":"#374151", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{m}</button>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                      {fmt(downPayment)} ({fmtPct(downPctCalc)}) · Loan: {fmt(principal)}
                      {downPctCalc < 20 ? " · ⚠️ PMI required" : " · ✅ No PMI"}
                    </p>
                  </div>
                </>
              )}

              {(mode==="refinance"||mode==="equity") && (
                <MoneyInput label="Current loan balance" value={loanBalance} onChange={setLoanBalance} />
              )}
              {mode==="equity" && (
                <MoneyInput label="Equity to access" value={equityAmt} onChange={setEquityAmt}
                  hint={`New loan total: ${fmt(loanBalance + equityAmt)}`} />
              )}
              {mode==="afford" && (
                <>
                  <MoneyInput label="Annual household income" value={annualIncome} onChange={setAnnualIncome} hint="Use gross income before taxes" />
                  <MoneyInput label="Monthly debts (car, student loans, etc.)" value={monthlyDebts} onChange={setMonthlyDebts} />
                </>
              )}

              <NumberInput label="Interest rate (annual)" value={rate} onChange={setRate} suffix="%" step={0.1}
                hint="Today's 30yr avg: 6.27% · 15yr avg: 5.62% · 5/1 ARM: 6.42%" />

              <div style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Loan term</label>
                <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                  {[{l:"10yr",v:10,d:"Fast"},{l:"15yr",v:15,d:"Popular"},{l:"20yr",v:20,d:"Balanced"},{l:"30yr",v:30,d:"Lowest pmt"},{l:"40yr",v:40,d:"Non-QM"}].map(t => (
                    <button key={t.v} className={`term-btn${!useCustom&&years===t.v?" active":""}`}
                      onClick={() => { setYears(t.v); setUseCustom(false); setCustomYears(""); }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: !useCustom&&years===t.v?"#2563eb":"#111" }}>{t.l}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{t.d}</div>
                    </button>
                  ))}
                </div>
                <div style={{ position: "relative" }}>
                  <input type="number" placeholder="Custom term"
                    value={customYears}
                    onFocus={() => setUseCustom(true)}
                    onChange={e => { setCustomYears(e.target.value); setUseCustom(true); }}
                    style={{ width: "100%", padding: "11px 50px 11px 14px", borderRadius: 9, border: `1.5px solid ${useCustom?"#2563eb":"#e5e7eb"}`, fontSize: 15, fontWeight: 600, color: "#111", background: "#fff", outline: "none" }} />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700, fontSize: 13 }}>years</span>
                </div>
              </div>
            </div>

            <div className="card">
              <p className="section-title">Loan start date</p>
              <div className="grid-2">
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Month</label>
                  <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))}>
                    {months.map((m,i) => <option key={i} value={i}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Year</label>
                  <select value={startYear} onChange={e => setStartYear(Number(e.target.value))}>
                    {Array.from({length:10},(_,i)=>new Date().getFullYear()+i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <p className="section-title">Monthly costs</p>
              <div className="grid-2">
                <div>
                  <MoneyInput label="Property tax /yr" value={propTax} onChange={setPropTax} hint={`${fmt(propTax/12)}/mo`} />
                </div>
                <div>
                  <MoneyInput label="Home insurance /yr" value={insurance} onChange={setInsurance} hint={`${fmt(insurance/12)}/mo`} />
                </div>
                {needsPMI && (
                  <NumberInput label="PMI rate" value={pmiRate} onChange={setPmiRate} suffix="%" step={0.1} hint={`${fmt2(monthlyPMI)}/mo`} />
                )}
                <div>
                  <MoneyInput label="HOA /mo" value={hoa} onChange={setHoa} />
                </div>
              </div>
            </div>

            <div className="card">
              <p className="section-title">Extra monthly payment</p>
              <MoneyInput label="" value={extraPayment} onChange={setExtraPayment} />
              {extraPayment > 0 && (
                <div style={{ marginTop: 6, padding: "10px 14px", background: "#dcfce7", borderRadius: 8, fontSize: 13, color: "#15803d" }}>
                  💚 Saves <b>{fmt(interestSaved)}</b> in interest · pays off <b>{monthsSaved} months</b> early
                </div>
              )}
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>Even $100/mo extra can save tens of thousands and cut years off your loan.</p>
            </div>
          </div>

          {/* RIGHT — results */}
          <div className="results-col">
            <div style={{ background: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%)", borderRadius: 16, padding: "28px 24px", marginBottom: 14, color: "#fff" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Total monthly payment</p>
              <p style={{ fontSize: 56, fontWeight: 800, lineHeight: 1, marginBottom: 6 }}>{fmt2(totalMonthlyWithExtra)}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 20 }}>{fmtPct(rate)} interest · {actualYears} years · starts {startDateStr}</p>
              <div className="grid-2" style={{ gap: 10 }}>
                {[["Principal & interest",fmt2(basePmt)],["Taxes & insurance",fmt2(monthlyTax+monthlyIns)]].map(([l,v]) => (
                  <div key={String(l)} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 3 }}>{l}</p>
                    <p style={{ fontSize: 17, fontWeight: 700 }}>{v}</p>
                  </div>
                ))}
                {monthlyPMI > 0 && (
                  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 3 }}>PMI</p>
                    <p style={{ fontSize: 17, fontWeight: 700 }}>{fmt2(monthlyPMI)}</p>
                  </div>
                )}
                {hoa > 0 && (
                  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 3 }}>HOA</p>
                    <p style={{ fontSize: 17, fontWeight: 700 }}>{fmt2(hoa)}</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: "#f1f5f9", borderRadius: 10, padding: 4, display: "flex", gap: 2, marginBottom: 14 }}>
              {[["summary","📊 Summary"],["amortization","📅 Amortization"],["compare","⚖️ Compare"],["affordability","💡 Affordability"]].map(([t,l]) => (
                <button key={t} className={`tab-btn${activeTab===t?" active":""}`} onClick={() => setActiveTab(t as typeof activeTab)}>{l}</button>
              ))}
            </div>

            {activeTab==="summary" && (
              <>
                <div className="card">
                  <p className="section-title">Loan summary</p>
                  {[["Loan amount",fmt(principal)],["Total interest paid",fmt(totalInterest)],["Total cost of loan",fmt(totalCost)],["Payoff date",payoffDate]].map(([l,v]) => (
                    <div key={String(l)} className="result-row">
                      <span style={{ color: "#6b7280" }}>{l}</span>
                      <span style={{ fontWeight: 700, color: "#111" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "#2563eb", fontWeight: 600 }}>Principal {fmtPct(principal/totalCost*100)}</span>
                      <span style={{ color: "#dc2626", fontWeight: 600 }}>Interest {fmtPct(totalInterest/totalCost*100)}</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${principal/totalCost*100}%` }} /></div>
                  </div>
                </div>

                <div className="card">
                  <p className="section-title">Payment options</p>
                  <div className="grid-2">
                    {[["Monthly payment",fmt2(basePmt)],["Bi-weekly payment",fmt2(biWeekly)],["Annual total",fmt(basePmt*12)],["Payoff date",payoffDate]].map(([l,v]) => (
                      <div key={String(l)} className="stat-box">
                        <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>{l}</p>
                        <p style={{ fontSize: 15, fontWeight: 800, color: "#111" }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 12, lineHeight: 1.6 }}>
                    💡 Bi-weekly payments = 26 half-payments/year (13 full payments). This pays off a 30yr loan ~4 years early.
                  </p>
                </div>

                {needsPMI && (
                  <div className="card" style={{ borderColor: "#fcd34d", background: "#fffbeb" }}>
                    <p className="section-title">PMI information</p>
                    {[["Monthly PMI",fmt2(monthlyPMI)],["PMI removed (20% equity)",amortSchedule[pmiRemovalMonth-1]?.date||"N/A"]].map(([l,v]) => (
                      <div key={String(l)} className="result-row">
                        <span style={{ color: "#6b7280" }}>{l}</span>
                        <span style={{ fontWeight: 700, color: "#92400e" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="card">
                  <p className="section-title">Loan type guide</p>
                  {[{term:"30-year fixed",desc:"Most popular. Lowest monthly payment. Most interest paid overall.",tag:"Most popular"},{term:"15-year fixed",desc:"Roughly half the total interest. Higher payment but faster equity.",tag:"Best value"},{term:"5/1 ARM",desc:"Fixed 5 years then adjusts. Good if you plan to move or refinance.",tag:"Flexible"},{term:"40-year",desc:"Lowest payment but non-qualified mortgage. Higher rates apply.",tag:"Non-QM"}].map(({term,desc,tag}) => (
                    <div key={term} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{term}</span>
                        <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{tag}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#6b7280" }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab==="amortization" && (
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p className="section-title" style={{ margin: 0 }}>Amortization schedule — {amortSchedule.length} payments</p>
                  <button className="action-btn" onClick={handleCSV}>📥 Export CSV</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="amort-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Date</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th><th>Total interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedRows.map(row => (
                        <tr key={row.month} className={row.month%12===0?"year-row":""}>
                          <td>{row.month}</td>
                          <td>{row.date}</td>
                          <td>{fmt2(row.payment)}</td>
                          <td style={{ color: "#2563eb" }}>{fmt2(row.principal)}</td>
                          <td style={{ color: "#dc2626" }}>{fmt2(row.interest)}</td>
                          <td style={{ fontWeight: 600 }}>{fmt(row.balance)}</td>
                          <td style={{ color: "#6b7280" }}>{fmt(row.totalInterest)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {amortSchedule.length > 24 && (
                  <div style={{ padding: 16, textAlign: "center", borderTop: "1px solid #e5e7eb" }}>
                    <button className="action-btn" onClick={() => setShowFullAmort(!showFullAmort)}>
                      {showFullAmort ? "Show less ▲" : `Show all ${amortSchedule.length} payments ▼`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab==="compare" && (
              <>
                <div className="card">
                  <p className="section-title">Scenario B — adjust to compare</p>
                  <div className="grid-2">
                    <NumberInput label="Rate" value={compareRate} onChange={setCompareRate} suffix="%" step={0.1} />
                    <NumberInput label="Term (years)" value={compareYears} onChange={setCompareYears} step={1} />
                  </div>
                </div>
                <div className="grid-2" style={{ gap: 12 }}>
                  {[{label:"Scenario A (current)",pmt:basePmt,total:totalCost,int:totalInterest,r:rate,y:actualYears,active:true},{label:"Scenario B",pmt:pmtC,total:principal+totalIntC,int:totalIntC,r:compareRate,y:compareYears,active:false}].map(s => (
                    <div key={s.label} className="card" style={{ borderColor: s.active?"#2563eb":"#e5e7eb", background: s.active?"#f0f7ff":"#fff" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: s.active?"#2563eb":"#6b7280", marginBottom: 12 }}>{s.label}</p>
                      <p style={{ fontSize: 32, fontWeight: 800, color: "#111", marginBottom: 4 }}>{fmt2(s.pmt)}<span style={{ fontSize: 13, fontWeight: 400, color: "#6b7280" }}>/mo</span></p>
                      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>{s.r}% · {s.y} years</p>
                      {[["Total cost",fmt(s.total)],["Total interest",fmt(s.int)]].map(([l,v]) => (
                        <div key={String(l)} className="result-row">
                          <span style={{ color: "#6b7280", fontSize: 13 }}>{l}</span>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="card" style={{ background: pmtC<basePmt?"#dcfce7":"#fee2e2", borderColor: pmtC<basePmt?"#86efac":"#fca5a5" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: pmtC<basePmt?"#15803d":"#b91c1c", marginBottom: 6 }}>
                    {pmtC<basePmt?"✅ Scenario B saves you money":"✅ Scenario A has the lower payment"}
                  </p>
                  <p style={{ fontSize: 13, color: "#374151" }}>
                    Monthly difference: <b>{fmt2(Math.abs(basePmt-pmtC))}</b> · Total interest difference: <b>{fmt(Math.abs(totalInterest-totalIntC))}</b>
                  </p>
                </div>
              </>
            )}

            {activeTab==="affordability" && (
              <>
                <div className="card" style={{ borderColor: dti<=28?"#86efac":dti<=36?"#fcd34d":"#fca5a5", background: dti<=28?"#f0fdf4":dti<=36?"#fffbeb":"#fef2f2" }}>
                  <p className="section-title">28/36 Rule Analysis</p>
                  <div className="grid-2" style={{ marginBottom: 14 }}>
                    <div className="stat-box">
                      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Housing DTI</p>
                      <p style={{ fontSize: 28, fontWeight: 800, color: dti<=28?"#15803d":dti<=36?"#92400e":"#b91c1c" }}>{fmtPct(dti)}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af" }}>Recommended: ≤28%</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Status</p>
                      <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: dti<=28?"#dcfce7":dti<=36?"#fef3c7":"#fee2e2", color: dti<=28?"#15803d":dti<=36?"#92400e":"#b91c1c" }}>
                        {dti<=28?"✅ Comfortable":dti<=36?"⚠️ Stretching":"❌ Too High"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <p className="section-title">How much house can you afford?</p>
                  {[["Maximum affordable home",fmt(affordableHome)],["Recommended max payment",fmt2(maxPITI_28)],["Your current payment",fmt2(totalMonthly)]].map(([l,v]) => (
                    <div key={String(l)} className="result-row">
                      <span style={{ color: "#6b7280" }}>{l}</span>
                      <span style={{ fontWeight: 700, color: "#111" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <p className="section-title">Income for affordability check</p>
                  <MoneyInput label="Annual household income" value={annualIncome} onChange={setAnnualIncome} hint="Use gross income before taxes" />
                  <MoneyInput label="Monthly debts" value={monthlyDebts} onChange={setMonthlyDebts} hint="Car, student loans, credit cards (minimums only)" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}