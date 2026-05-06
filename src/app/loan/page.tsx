"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("20000");
  const [rate, setRate] = useState("5.5");
  const [years, setYears] = useState("5");

  const a = parseFloat(amount) || 0;
  const r = parseFloat(rate) || 0;
  const y = parseFloat(years) || 0;
  const mr = r / 100 / 12;
  const n = y * 12;
  const payment = mr > 0 ? a * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : a / n;
  const total = payment * n;
  const interest = total - a;
  const fmt = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "system-ui,sans-serif" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}><b style={{ color: "#111" }}>freecalcs</b><b style={{ color: "#2563eb" }}>.io</b></Link>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>All calculators</Link>
        </div>
      </nav>
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: "#111", marginBottom: 6 }}>Loan and EMI Calculator</h1>
        <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 16 }}>Calculate monthly payments for any loan.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 20 }}>Loan details</h2>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Loan amount ($)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 15, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Interest rate (%)</label>
              <input type="number" value={rate} onChange={e => setRate(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 15, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Loan term (years)</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 15, boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#2563eb", borderRadius: 16, padding: 28, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Monthly payment</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{fmt(payment)}</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>Total payment</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>{fmt(total)}</span>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>Total interest</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>{fmt(interest)}</span>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>Loan amount</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>{fmt(a)}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}