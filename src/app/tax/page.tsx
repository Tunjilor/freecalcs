"use client";
import { useState } from "react";
import Link from "next/link";
export default function TaxCalculator() {
  const [income, setIncome] = useState(75000);
  const [filing, setFiling] = useState("single");
  const brackets = filing === "single" ? [[11000,0.10],[44725,0.12],[95375,0.22],[201050,0.24],[383900,0.32],[487450,0.35],[999999999,0.37]] : [[22000,0.10],[89450,0.12],[190750,0.22],[364200,0.24],[462500,0.32],[693750,0.35],[999999999,0.37]];
  let tax = 0; let prev = 0;
  for (const [limit, rate] of brackets) { if (income <= prev) break; tax += (Math.min(income, Number(limit)) - prev) * Number(rate); prev = Number(limit); }
  const effective = ((tax / income) * 100).toFixed(1);
  const fmt = (v:number) => v.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>Federal Income Tax Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:32,fontSize:16}}>Estimate your 2024 federal income tax.</p>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28,marginBottom:16}}>
          <div style={{marginBottom:22}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><label style={{fontSize:14,fontWeight:600,color:"#374151"}}>Annual income</label><span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>{fmt(income)}</span></div>
            <input type="range" min={10000} max={500000} step={1000} value={income} onChange={e=>setIncome(Number(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setFiling("single")} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #e5e7eb",background:filing==="single"?"#2563eb":"#fff",color:filing==="single"?"#fff":"#374151",fontWeight:600,fontSize:14,cursor:"pointer"}}>Single</button>
            <button onClick={()=>setFiling("married")} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #e5e7eb",background:filing==="married"?"#2563eb":"#fff",color:filing==="married"?"#fff":"#374151",fontWeight:600,fontSize:14,cursor:"pointer"}}>Married</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[["Federal tax",fmt(tax),true],["Effective rate",effective+"%",false],["After-tax",fmt(income-tax),false]].map(([l,v,hi])=>(
            <div key={String(l)} style={{background:hi?"#2563eb":"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"18px 12px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:hi?"#fff":"#111",marginBottom:4}}>{String(v)}</div>
              <div style={{fontSize:11,color:hi?"rgba(255,255,255,0.8)":"#6b7280"}}>{String(l)}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
