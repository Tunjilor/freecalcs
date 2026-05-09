// @ts-nocheck
"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

type IncomeType = "w2" | "self" | "retired" | "mixed";
type LoanType = "conventional" | "fha" | "va" | "usda" | "jumbo";

export default function MortgageQualifier() {
  // Income
  const [incomeType, setIncomeType] = useState<IncomeType>("w2");
  const [annualIncome, setAnnualIncome] = useState(95000);
  const [coIncome, setCoIncome] = useState(0);
  const [hasCoBorrower, setHasCoBorrower] = useState(false);

  // Debts
  const [carPayment, setCarPayment] = useState(400);
  const [studentLoan, setStudentLoan] = useState(200);
  const [creditCards, setCreditCards] = useState(100);
  const [otherDebts, setOtherDebts] = useState(0);
  const [childSupport, setChildSupport] = useState(0);

  // Credit & profile
  const [creditScore, setCreditScore] = useState(720);
  const [employmentYears, setEmploymentYears] = useState(3);
  const [bankruptcyYears, setBankruptcyYears] = useState(0);
  const [foreclosureYears, setForeclosureYears] = useState(0);
  const [isVeteran, setIsVeteran] = useState(false);
  const [isRural, setIsRural] = useState(false);
  const [firstTimeBuyer, setFirstTimeBuyer] = useState(false);

  // Purchase
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [propTax, setPropTax] = useState(4800);
  const [insurance, setInsurance] = useState(1500);
  const [hoa, setHoa] = useState(0);
  const [preferredRate, setPreferredRate] = useState(6.27);
  const [preferredTerm, setPreferredTerm] = useState(30);

  // Assets
  const [savings, setSavings] = useState(50000);
  const [retirement, setRetirement] = useState(0);

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const _annualIncome = sp.get('annualIncome'); if (_annualIncome) setAnnualIncome(Number(_annualIncome));
    const _coIncome = sp.get('coIncome'); if (_coIncome) setCoIncome(Number(_coIncome));
    const _carPayment = sp.get('carPayment'); if (_carPayment) setCarPayment(Number(_carPayment));
    const _studentLoan = sp.get('studentLoan'); if (_studentLoan) setStudentLoan(Number(_studentLoan));
    const _creditCards = sp.get('creditCards'); if (_creditCards) setCreditCards(Number(_creditCards));
  }, []);
  const shareCalc = () => {
    const params = new URLSearchParams({ 'annualIncome': String(annualIncome), 'coIncome': String(coIncome), 'carPayment': String(carPayment), 'studentLoan': String(studentLoan), 'creditCards': String(creditCards) });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    window.history.replaceState({}, '', '?' + params.toString());
  };

  const totalIncome = annualIncome + (hasCoBorrower ? coIncome : 0);
  const grossMonthly = totalIncome / 12;
  const totalMonthlyDebts = carPayment + studentLoan + creditCards + otherDebts + childSupport;
  const loanAmount = homePrice - downPayment;
  const downPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;

  // Rate adjustment based on credit score
  const rateAdjustment = useMemo(() => {
    if (creditScore >= 760) return -0.25;
    if (creditScore >= 740) return -0.125;
    if (creditScore >= 720) return 0;
    if (creditScore >= 700) return 0.125;
    if (creditScore >= 680) return 0.25;
    if (creditScore >= 660) return 0.5;
    if (creditScore >= 640) return 0.75;
    if (creditScore >= 620) return 1.0;
    return 1.5;
  }, [creditScore]);

  const adjustedRate = preferredRate + rateAdjustment;
  const mr = adjustedRate / 100 / 12;
  const n = preferredTerm * 12;
  const basePmt = mr > 0 ? loanAmount * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : loanAmount / n;
  const pmi = downPct < 20 ? loanAmount * 0.005 / 12 : 0;
  const monthlyTax = propTax / 12;
  const monthlyIns = insurance / 12;
  const totalHousing = basePmt + monthlyTax + monthlyIns + pmi + hoa;
  const totalAllDebts = totalHousing + totalMonthlyDebts;
  const frontDTI = grossMonthly > 0 ? (totalHousing / grossMonthly) * 100 : 0;
  const backDTI = grossMonthly > 0 ? (totalAllDebts / grossMonthly) * 100 : 0;

  // Max loan based on 28/36 rule
  const maxHousingPmt = grossMonthly * 0.28;
  const maxTotalPmt = grossMonthly * 0.43 - totalMonthlyDebts;
  const maxAffordablePmt = Math.min(maxHousingPmt, maxTotalPmt);
  const maxLoan = mr > 0 ? maxAffordablePmt / (mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1)) : maxAffordablePmt * n;
  const maxHome = maxLoan + downPayment;

  // Reserves check (months of payments in savings)
  const reserveMonths = totalHousing > 0 ? savings / totalHousing : 0;

  // Loan type eligibility
  const loanTypes = useMemo(() => {
    const results: { type: LoanType; name: string; eligible: boolean; reason: string; minDown: number; maxDTI: number; color: string; badge: string }[] = [
      {
        type: "conventional",
        name: "Conventional",
        eligible: creditScore >= 620 && backDTI <= 50 && bankruptcyYears >= 4 && foreclosureYears >= 7,
        reason: creditScore < 620 ? "Need 620+ credit score" : backDTI > 50 ? "DTI too high (max 50%)" : bankruptcyYears > 0 && bankruptcyYears < 4 ? "Wait 4 years after bankruptcy" : foreclosureYears > 0 && foreclosureYears < 7 ? "Wait 7 years after foreclosure" : "✅ You qualify",
        minDown: 3,
        maxDTI: 50,
        color: "#2563eb",
        badge: "Most common",
      },
      {
        type: "fha",
        name: "FHA Loan",
        eligible: creditScore >= 580 && backDTI <= 57 && bankruptcyYears >= 2 && foreclosureYears >= 3,
        reason: creditScore < 500 ? "Need 500+ credit score (10% down)" : creditScore < 580 ? "Need 580+ for 3.5% down" : backDTI > 57 ? "DTI too high (max 57%)" : bankruptcyYears > 0 && bankruptcyYears < 2 ? "Wait 2 years after bankruptcy" : foreclosureYears > 0 && foreclosureYears < 3 ? "Wait 3 years after foreclosure" : "✅ You qualify",
        minDown: creditScore >= 580 ? 3.5 : 10,
        maxDTI: 57,
        color: "#059669",
        badge: "First-time buyers",
      },
      {
        type: "va",
        name: "VA Loan",
        eligible: isVeteran && creditScore >= 580 && bankruptcyYears >= 2 && foreclosureYears >= 2,
        reason: !isVeteran ? "Veterans & active duty only" : creditScore < 580 ? "Most lenders require 580+" : bankruptcyYears > 0 && bankruptcyYears < 2 ? "Wait 2 years after bankruptcy" : "✅ You qualify",
        minDown: 0,
        maxDTI: 41,
        color: "#7c3aed",
        badge: "0% down",
      },
      {
        type: "usda",
        name: "USDA Loan",
        eligible: isRural && creditScore >= 640 && backDTI <= 41 && bankruptcyYears >= 3 && foreclosureYears >= 3,
        reason: !isRural ? "Rural/suburban areas only" : creditScore < 640 ? "Need 640+ credit score" : backDTI > 41 ? "DTI too high (max 41%)" : "✅ You qualify",
        minDown: 0,
        maxDTI: 41,
        color: "#0891b2",
        badge: "Rural buyers",
      },
      {
        type: "jumbo",
        name: "Jumbo Loan",
        eligible: loanAmount > 766550 && creditScore >= 700 && downPct >= 10 && backDTI <= 43,
        reason: loanAmount <= 766550 ? "Only for loans over $766,550" : creditScore < 700 ? "Need 700+ credit score" : downPct < 10 ? "Need 10%+ down payment" : backDTI > 43 ? "DTI too high (max 43%)" : "✅ You qualify",
        minDown: 10,
        maxDTI: 43,
        color: "#b45309",
        badge: "High-value homes",
      },
    ];
    return results;
  }, [creditScore, backDTI, bankruptcyYears, foreclosureYears, isVeteran, isRural, loanAmount, downPct]);

  const eligibleLoans = loanTypes.filter(l => l.eligible);
  const overallQualifies = eligibleLoans.length > 0 && employmentYears >= 2;

  // Score factors
  const factors = [
    { label: "Credit score", value: creditScore >= 760 ? "Excellent" : creditScore >= 720 ? "Good" : creditScore >= 680 ? "Fair" : "Poor", ok: creditScore >= 680, detail: `${creditScore} · ${rateAdjustment > 0 ? "+" : ""}${rateAdjustment}% rate adjustment` },
    { label: "Front-end DTI", value: fmtPct(frontDTI), ok: frontDTI <= 28, detail: `Housing costs vs income · Max 28%` },
    { label: "Back-end DTI", value: fmtPct(backDTI), ok: backDTI <= 43, detail: `All debts vs income · Max 43%` },
    { label: "Down payment", value: fmtPct(downPct), ok: downPct >= 20, detail: downPct < 20 ? "PMI required · 20% avoids PMI" : "Excellent · No PMI required" },
    { label: "Employment", value: `${employmentYears} years`, ok: employmentYears >= 2, detail: "2+ years required · Self-employed needs 2yr tax returns" },
    { label: "Cash reserves", value: `${reserveMonths.toFixed(1)} months`, ok: reserveMonths >= 2, detail: "2-6 months of payments required after closing" },
    { label: "Bankruptcy", value: bankruptcyYears === 0 ? "None" : `${bankruptcyYears} years ago`, ok: bankruptcyYears === 0 || bankruptcyYears >= 4, detail: "Conventional: 4yr wait · FHA: 2yr · VA: 2yr" },
    { label: "Foreclosure", value: foreclosureYears === 0 ? "None" : `${foreclosureYears} years ago`, ok: foreclosureYears === 0 || foreclosureYears >= 7, detail: "Conventional: 7yr wait · FHA: 3yr · VA: 2yr" },
  ];

  const fmt = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const fmt2 = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function fmtPct(v: number) { return `${isNaN(v) || !isFinite(v) ? "0.0" : v.toFixed(1)}%`; }

  const scoreColor = overallQualifies ? "#15803d" : "#b91c1c";
  const scoreBg = overallQualifies ? "#f0fdf4" : "#fef2f2";
  const scoreBorder = overallQualifies ? "#86efac" : "#fca5a5";

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .lbl { font-size: 12px; font-weight: 600; color: #374151; display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.04em; }
        .inp { width: 100%; padding: 10px 14px; border-radius: 9px; border: 1.5px solid #e5e7eb; font-size: 15px; font-weight: 600; color: #111; background: #fff; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .inp:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        select.inp { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
        .inp-wrap { position: relative; }
        .inp-pre { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-weight: 700; pointer-events: none; }
        .inp-suf { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-weight: 700; font-size: 13px; pointer-events: none; }
        .card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; padding: 22px; margin-bottom: 14px; }
        .section-title { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 16px; }
        .field { margin-bottom: 14px; }
        .hint { font-size: 11px; color: #9ca3af; margin-top: 4px; line-height: 1.5; }
        .toggle-btn { flex: 1; padding: 9px 8px; border-radius: 8px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.15s; text-align: center; }
        .toggle-btn.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
        .factor-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
        .factor-row:last-child { border-bottom: none; }
        .check { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
        .loan-card { border-radius: 12px; border: 2px solid #e5e7eb; padding: 16px; margin-bottom: 10px; transition: all 0.15s; }
        .loan-card.eligible { border-color: #86efac; background: #f0fdf4; }
        .loan-card.ineligible { border-color: #e5e7eb; background: #f9fafb; opacity: 0.7; }
        .badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .progress-bar { height: 8px; border-radius: 4px; background: #e5e7eb; overflow: hidden; margin-top: 6px; }
        .progress-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
        .two-col { display: grid; grid-template-columns: 400px 1fr; gap: 20px; align-items: start; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .stat-box { background: #f8f9fb; border-radius: 10px; padding: 14px; }
        .credit-track { position: relative; height: 8px; border-radius: 4px; overflow: hidden; background: linear-gradient(to right, #ef4444 0%, #f59e0b 35%, #22c55e 65%, #2563eb 100%); margin: 8px 0; }
        .credit-thumb { position: absolute; top: -4px; width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 3px solid #2563eb; transform: translateX(-50%); transition: left 0.3s; }
        @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } .results-col { order: -1; } }
        @media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } .grid-3 { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <b style={{ color: "#111", fontSize: 20 }}>freecalcs</b><b style={{ color: "#2563eb", fontSize: 20 }}>.io</b>
          </Link>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link href="/mortgage" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>← Mortgage calculator</Link>
            <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>All calculators</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 80px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 4 }}>Mortgage Qualification Calculator</h1>
          <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 600 }}>
            See exactly what loan officers check when reviewing your mortgage application. Get a full qualification analysis across all major loan programs.
          </p>
        </div>

        <div className="two-col">
          {/* LEFT — inputs */}
          <div>
            {/* Income */}
            <div className="card">
              <p className="section-title">Income</p>
              <div className="field">
                <label className="lbl">Income type</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {([["w2", "W-2 Employee"], ["self", "Self-Employed"], ["retired", "Retired"], ["mixed", "Mixed"]] as [IncomeType, string][]).map(([t, l]) => (
                    <button key={t} className={`toggle-btn${incomeType === t ? " active" : ""}`} onClick={() => setIncomeType(t)}
                      style={{ fontSize: 12 }}>{l}</button>
                  ))}
                </div>
                {incomeType === "self" && <p className="hint">⚠️ Self-employed: lenders use 2-year average of net income after deductions</p>}
              </div>
              <div className="field">
                <label className="lbl">Annual gross income (before taxes)</label>
                <div className="inp-wrap"><span className="inp-pre">$</span>
                  <input className="inp" style={{ paddingLeft: 24 }} type="number" value={annualIncome}
                    onChange={e => setAnnualIncome(Number(e.target.value))} />
                </div>
                <p className="hint">Use gross income — lenders do NOT use take-home pay</p>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: hasCoBorrower ? 10 : 0 }}>
                  <input type="checkbox" checked={hasCoBorrower} onChange={e => setHasCoBorrower(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }} />
                  <label className="lbl" style={{ margin: 0, cursor: "pointer" }} onClick={() => setHasCoBorrower(!hasCoBorrower)}>Add co-borrower income</label>
                </div>
                {hasCoBorrower && (
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={coIncome}
                      onChange={e => setCoIncome(Number(e.target.value))} placeholder="Co-borrower annual income" />
                  </div>
                )}
              </div>
            </div>

            {/* Monthly debts */}
            <div className="card">
              <p className="section-title">Monthly debt payments</p>
              <p className="hint" style={{ marginBottom: 14 }}>Include minimum payments only. Do NOT include rent (it goes away when you buy).</p>
              <div className="grid-2">
                {[
                  ["Car payment(s)", carPayment, setCarPayment],
                  ["Student loans", studentLoan, setStudentLoan],
                  ["Credit cards (min)", creditCards, setCreditCards],
                  ["Personal loans", otherDebts, setOtherDebts],
                  ["Child support/alimony", childSupport, setChildSupport],
                ].map(([l, v, s]) => (
                  <div key={String(l)}>
                    <label className="lbl">{String(l)}</label>
                    <div className="inp-wrap"><span className="inp-pre">$</span>
                      <input className="inp" style={{ paddingLeft: 24 }} type="number" value={Number(v)}
                        onChange={e => (s as (n: number) => void)(Number(e.target.value))} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#f8f9fb", borderRadius: 8, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "#6b7280" }}>Total monthly debts</span>
                <span style={{ fontWeight: 700 }}>{fmt2(totalMonthlyDebts)}</span>
              </div>
            </div>

            {/* Credit & profile */}
            <div className="card">
              <p className="section-title">Credit & borrower profile</p>
              <div className="field">
                <label className="lbl">Credit score (FICO)</label>
                <div className="inp-wrap">
                  <input className="inp" type="number" min={300} max={850} value={creditScore}
                    onChange={e => setCreditScore(Number(e.target.value))} />
                </div>
                <div className="credit-track">
                  <div className="credit-thumb" style={{ left: `${((creditScore - 300) / 550) * 100}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af" }}>
                  <span>Poor 300</span><span>Fair 580</span><span>Good 670</span><span>Very good 740</span><span>Exceptional 800+</span>
                </div>
                <p className="hint" style={{ marginTop: 6 }}>
                  {creditScore >= 760 ? "🟢 Exceptional — best available rates" :
                    creditScore >= 720 ? "🟢 Very good — excellent rates" :
                      creditScore >= 680 ? "🟡 Good — competitive rates" :
                        creditScore >= 640 ? "🟡 Fair — higher rates, limited options" :
                          creditScore >= 620 ? "🔴 Poor — conventional minimum, high rates" :
                            creditScore >= 580 ? "🔴 Very poor — FHA only, 3.5% down" :
                              "🔴 Critical — need 500+ for any mortgage"}
                </p>
              </div>

              <div className="field">
                <label className="lbl">Years at current employer</label>
                <div className="inp-wrap">
                  <input className="inp" style={{ paddingRight: 36 }} type="number" step={0.5} value={employmentYears}
                    onChange={e => setEmploymentYears(Number(e.target.value))} />
                  <span className="inp-suf">yrs</span>
                </div>
                <p className="hint">{employmentYears < 2 ? "⚠️ Most lenders require 2+ years. You may need a co-borrower or FHA manual underwriting." : "✅ Meets employment requirement"}</p>
              </div>

              <div className="grid-2">
                <div>
                  <label className="lbl">Bankruptcy (years ago)</label>
                  <input className="inp" type="number" value={bankruptcyYears} min={0}
                    onChange={e => setBankruptcyYears(Number(e.target.value))} placeholder="0 = none" />
                </div>
                <div>
                  <label className="lbl">Foreclosure (years ago)</label>
                  <input className="inp" type="number" value={foreclosureYears} min={0}
                    onChange={e => setForeclosureYears(Number(e.target.value))} placeholder="0 = none" />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {[
                  ["isVeteran", "🎖️ I am a veteran or active duty military (VA loan eligible)", isVeteran, setIsVeteran],
                  ["isRural", "🌾 Property is in a rural or suburban area (USDA loan eligible)", isRural, setIsRural],
                  ["firstTime", "🏠 I am a first-time home buyer", firstTimeBuyer, setFirstTimeBuyer],
                ].map(([key, label, val, setter]) => (
                  <label key={String(key)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: "#374151" }}>
                    <input type="checkbox" checked={Boolean(val)} onChange={e => (setter as (v: boolean) => void)(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer", flexShrink: 0 }} />
                    {String(label)}
                  </label>
                ))}
              </div>
            </div>

            {/* Purchase details */}
            <div className="card">
              <p className="section-title">Purchase & loan details</p>
              <div className="grid-2">
                <div>
                  <label className="lbl">Home price</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={homePrice}
                      onChange={e => setHomePrice(Number(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label className="lbl">Down payment</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={downPayment}
                      onChange={e => setDownPayment(Number(e.target.value))} />
                  </div>
                  <p className="hint">{fmtPct(downPct)} · {downPct < 20 ? "PMI required" : "No PMI"}</p>
                </div>
                <div>
                  <label className="lbl">Interest rate</label>
                  <div className="inp-wrap">
                    <input className="inp" style={{ paddingRight: 28 }} type="number" step={0.1} value={preferredRate}
                      onChange={e => setPreferredRate(Number(e.target.value))} />
                    <span className="inp-suf">%</span>
                  </div>
                </div>
                <div>
                  <label className="lbl">Loan term</label>
                  <select className="inp" value={preferredTerm} onChange={e => setPreferredTerm(Number(e.target.value))}>
                    {[10, 15, 20, 30, 40].map(y => <option key={y} value={y}>{y} years</option>)}
                  </select>
                </div>
                <div>
                  <label className="lbl">Property tax /yr</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={propTax}
                      onChange={e => setPropTax(Number(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label className="lbl">Home insurance /yr</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={insurance}
                      onChange={e => setInsurance(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>

            {/* Assets */}
            <div className="card">
              <p className="section-title">Assets & reserves</p>
              <div className="grid-2">
                <div>
                  <label className="lbl">Savings / checking</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={savings}
                      onChange={e => setSavings(Number(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label className="lbl">Retirement accounts</label>
                  <div className="inp-wrap"><span className="inp-pre">$</span>
                    <input className="inp" style={{ paddingLeft: 24 }} type="number" value={retirement}
                      onChange={e => setRetirement(Number(e.target.value))} />
                  </div>
                  <p className="hint">60% of retirement counted by lenders</p>
                </div>
              </div>
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#f8f9fb", borderRadius: 8, fontSize: 13 }}>
                <span style={{ color: "#6b7280" }}>Total usable assets: </span>
                <span style={{ fontWeight: 700 }}>{fmt(savings + retirement * 0.6)}</span>
                <span style={{ color: "#9ca3af", fontSize: 11, marginLeft: 8 }}>· {reserveMonths.toFixed(1)} months reserves</span>
              </div>
            </div>
          </div>

          {/* RIGHT — results */}
          <div className="results-col">
            {/* Overall verdict */}
            <div style={{ background: scoreBg, border: `2px solid ${scoreBorder}`, borderRadius: 16, padding: "24px 22px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: overallQualifies ? "#dcfce7" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  {overallQualifies ? "✅" : "❌"}
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: scoreColor }}>
                    {overallQualifies ? "You likely qualify!" : "Qualification challenges found"}
                  </p>
                  <p style={{ fontSize: 13, color: "#6b7280" }}>
                    {eligibleLoans.length} of {loanTypes.length} loan programs available
                  </p>
                </div>
              </div>
              <div className="grid-3">
                {[
                  ["Gross monthly income", fmt2(grossMonthly)],
                  ["Front-end DTI", fmtPct(frontDTI)],
                  ["Back-end DTI", fmtPct(backDTI)],
                ].map(([l, v]) => (
                  <div key={String(l)} className="stat-box">
                    <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>{l}</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DTI gauges */}
            <div className="card">
              <p className="section-title">DTI analysis</p>
              {[
                { label: "Front-end DTI (housing only)", value: frontDTI, max: 28, limit: "Max 28%" },
                { label: "Back-end DTI (all debts)", value: backDTI, max: 43, limit: "Max 43%" },
              ].map(({ label, value, max, limit }) => (
                <div key={label} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: value <= max ? "#15803d" : "#b91c1c" }}>{fmtPct(value)} <span style={{ color: "#9ca3af", fontWeight: 400 }}>/ {limit}</span></span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${Math.min(value / 55 * 100, 100)}%`,
                      background: value <= max ? "#22c55e" : value <= max * 1.2 ? "#f59e0b" : "#ef4444"
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                    <span>0%</span><span>Ideal ≤{max}%</span><span>High risk 50%+</span>
                  </div>
                </div>
              ))}
              <div style={{ padding: "12px 14px", background: "#f8f9fb", borderRadius: 8, fontSize: 13, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#6b7280" }}>Estimated monthly payment</span>
                  <span style={{ fontWeight: 700 }}>{fmt2(totalHousing)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#6b7280" }}>Rate (credit-adjusted)</span>
                  <span style={{ fontWeight: 700 }}>{adjustedRate.toFixed(2)}%{rateAdjustment !== 0 ? ` (${rateAdjustment > 0 ? "+" : ""}${rateAdjustment}% adjustment)` : " (no adjustment)"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Maximum home price (qualified)</span>
                  <span style={{ fontWeight: 700, color: "#2563eb" }}>{fmt(maxHome)}</span>
                </div>
              </div>
            </div>

            {/* Loan program eligibility */}
            <div className="card">
              <p className="section-title">Loan program eligibility</p>
              {loanTypes.map(loan => (
                <div key={loan.type} className={`loan-card ${loan.eligible ? "eligible" : "ineligible"}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{loan.eligible ? "✅" : "❌"}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{loan.name}</span>
                      <span className="badge" style={{ background: `${loan.color}20`, color: loan.color }}>{loan.badge}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: loan.eligible ? "#15803d" : "#9ca3af" }}>Min {loan.minDown}% down</span>
                  </div>
                  <p style={{ fontSize: 12, color: loan.eligible ? "#15803d" : "#6b7280", marginLeft: 28 }}>{loan.reason}</p>
                  {loan.eligible && (
                    <div style={{ marginTop: 8, marginLeft: 28, fontSize: 12, color: "#6b7280" }}>
                      Max DTI: {loan.maxDTI}% · Min down: {loan.minDown}% · Loan: {fmt(loanAmount)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Qualification factors */}
            <div className="card">
              <p className="section-title">Qualification factors checklist</p>
              {factors.map(f => (
                <div key={f.label} className="factor-row">
                  <div className="check" style={{ background: f.ok ? "#dcfce7" : "#fee2e2" }}>
                    {f.ok ? "✅" : "❌"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{f.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: f.ok ? "#15803d" : "#b91c1c" }}>{f.value}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips to improve */}
            {!overallQualifies && (
              <div className="card" style={{ borderColor: "#fcd34d", background: "#fffbeb" }}>
                <p className="section-title">How to improve your qualification</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {creditScore < 680 && (
                    <div style={{ display: "flex", gap: 10, fontSize: 13 }}>
                      <span>💳</span>
                      <div><b>Boost your credit score:</b> Pay down credit cards below 30% utilization. Each 20-point improvement can save 0.25%+ on your rate.</div>
                    </div>
                  )}
                  {backDTI > 43 && (
                    <div style={{ display: "flex", gap: 10, fontSize: 13 }}>
                      <span>💰</span>
                      <div><b>Reduce monthly debts:</b> Pay off {fmt(totalMonthlyDebts - (grossMonthly * 0.43 - totalHousing))}/mo in debts to reach 43% DTI. Start with highest-rate debt.</div>
                    </div>
                  )}
                  {downPct < 20 && (
                    <div style={{ display: "flex", gap: 10, fontSize: 13 }}>
                      <span>🏦</span>
                      <div><b>Save more down payment:</b> {fmt((homePrice * 0.2) - downPayment)} more gets you to 20% and eliminates PMI ({fmt2(pmi)}/mo savings).</div>
                    </div>
                  )}
                  {employmentYears < 2 && (
                    <div style={{ display: "flex", gap: 10, fontSize: 13 }}>
                      <span>💼</span>
                      <div><b>Build employment history:</b> Wait until you have 2 years at current employer, or apply with a co-borrower who has stable employment.</div>
                    </div>
                  )}
                  {reserveMonths < 2 && (
                    <div style={{ display: "flex", gap: 10, fontSize: 13 }}>
                      <span>🏧</span>
                      <div><b>Build cash reserves:</b> Save {fmt((2 - reserveMonths) * totalHousing)} more to have 2 months of payments in reserve after closing costs.</div>
                    </div>
                  )}
                  {isVeteran && <div style={{ display: "flex", gap: 10, fontSize: 13 }}>
                    <span>🎖️</span><div><b>Use your VA benefit:</b> VA loans offer 0% down, no PMI, and competitive rates. This is one of the best mortgage benefits available.</div>
                  </div>}
                </div>
              </div>
            )}

            {/* Next steps */}
            <div className="card">
              <p className="section-title">Next steps</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#2563eb", fontWeight: 700, flexShrink: 0 }}>1.</span>
                  <span><b>Get your free credit report</b> at AnnualCreditReport.com — check for errors that may be dragging your score down.</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#2563eb", fontWeight: 700, flexShrink: 0 }}>2.</span>
                  <span><b>Get pre-qualified</b> (soft credit check, no impact to score) from 2-3 lenders to compare real rates for your profile.</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#2563eb", fontWeight: 700, flexShrink: 0 }}>3.</span>
                  <span><b>Get pre-approved</b> (hard credit check) once you find the right home — this letter makes your offer competitive.</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#2563eb", fontWeight: 700, flexShrink: 0 }}>4.</span>
                  <span><b>Compare at least 3 lenders</b> — even a 0.25% rate difference saves {fmt((loanAmount * 0.0025 / 12) * n)} over the life of your loan.</span>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: "12px 14px", background: "#eff6ff", borderRadius: 8, fontSize: 12, color: "#1d4ed8", lineHeight: 1.5 }}>
                ⚠️ This calculator is for educational purposes only. Actual qualification depends on your complete financial profile, lender guidelines, and current underwriting standards. Always consult a licensed mortgage professional.
              </div>
            </div>

            {/* Link back to mortgage calc */}
            <div style={{ background: "#2563eb", borderRadius: 14, padding: "20px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Ready to calculate your payment?</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Use our full mortgage calculator with amortization schedule</p>
              </div>
              <Link href="/mortgage" style={{ background: "#fff", color: "#2563eb", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                Mortgage calculator →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}