"use client";
import { useState } from "react";
import Link from "next/link";

export default function MortgageCalculator() {
  const [home, setHome] = useState("300000");
  const [down, setDown] = useState("60000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");

  const h = parseFloat(home)||0;
  const d = parseFloat(down)||0;
  const r = parseFloat(rate)||0;
  const y = parseFloat(years)||0;
  const principal = h - d;
  const mr = r/100/12;
  const n = y*12;
  const payment = mr > 0 ? principal*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1) : principal/n;
  const total = payment*n;
  const interest = total-principal;
  const fmt = (v:number) => isNaN(v)||!isFinite(v) ? "$0" : v.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});

  const handlePrint = () => window.print();
  const handleCSV = () => {
    const csv = `Field,Value\nHome Price,$${h}\nDown Payment,$${d}\nLoan Amount,$${principal}\nInterest Rate,${r}%\nLoan Term,${y} years\nMonthly Payment,${fmt(payment)}\nTotal Payment,${fmt(total)}\nTotal Interest,${fmt(interest)}`;
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="mortgage.csv"; a.click();
  };

  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <style>{`@media print{nav,#actions{display:none}}`}</style>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:960,margin:"0 auto",padding:"48px 24px 80px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:32}}>
          <div>
            <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>Mortgage Calculator</h1>
            <p style={{color:"#6b7280",fontSize:16}}>Estimate your monthly mortgage payment.</p>
          </div>
          <div id="actions" style={{display:"flex",gap:8}}>
            <button onClick={handlePrint} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",fontSize:13,fontWeight:600,color:"#374151",cursor:"pointer"}}>🖨️ Print</button>
            <button onClick={handleCSV} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",fontSize:13,fontWeight:600,color:"#374151",cursor:"pointer"}}>📥 CSV</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}}>
          <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28}}>
            <h2 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:20}}>Loan details</h2>
            {[
              {label:"Home price ($)",val:home,set:setHome,hint:"e.g. 300000"},
              {label:"Down payment ($)",val:down,set:setDown,hint:"e.g. 60000"},
              {label:"Interest rate (%)",val:rate,set:setRate,hint:"e.g. 6.5"},
              {label:"Loan term (years)",val:years,set:setYears,hint:"e.g. 30"},
            ].map((f)=>(
              <div key={f.label} style={{marginBottom:18}}>
                <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>{f.label}</label>
                <input type="number" value={f.val} placeholder={f.hint}
                  onChange={e=>f.set(e.target.value)}
                  style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:15,outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{background:"#f8f9fb",borderRadius:8,padding:"12px 14px",fontSize:13,color:"#6b7280",marginTop:8}}>
              Loan amount: <b style={{color:"#111"}}>{fmt(principal)}</b>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:"#2563eb",borderRadius:16,padding:28,textAlign:"center"}}>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>Monthly payment</div>
              <div style={{fontSize:52,fontWeight:800,color:"#fff",lineHeight:1}}>{fmt(payment)}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:8}}>{rate}% for {years} years</div>
            </div>
            {[["Total payment",fmt(total)],["Total interest",fmt(interest)],["Principal",fmt(principal)]].map(([l,v])=>(
              <div key={String(l)} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,color:"#6b7280"}}>{l}</span>
                <span style={{fontSize:18,fontWeight:700,color:"#111"}}>{v}</span>
              </div>
            ))}
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 20px"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:10}}>Payment breakdown</div>
              <div style={{height:12,borderRadius:6,background:"#e5e7eb",overflow:"hidden"}}>
                <div style={{height:"100%",width:total>0?`${(principal/total*100).toFixed(0)}%`:"0%",background:"#2563eb",borderRadius:6}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12,color:"#6b7280"}}>
                <span>Principal {total>0?`${(principal/total*100).toFixed(0)}%`:""}</span>
                <span>Interest {total>0?`${(interest/total*100).toFixed(0)}%`:""}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
