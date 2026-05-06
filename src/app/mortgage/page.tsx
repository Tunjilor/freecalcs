"use client";
import { useState } from "react";
import Link from "next/link";

export default function MortgageCalculator() {
  const [home, setHome] = useState(300000);
  const [down, setDown] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const principal = home - down;
  const r = rate / 100 / 12;
  const n = years * 12;
  const payment = principal * (r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1);
  const total = payment * n;
  const interest = total - principal;
  const fmt = (v: number) => v.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});

  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>Mortgage Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:32,fontSize:16}}>Estimate your monthly payment instantly.</p>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28,marginBottom:16}}>
          {([["Home price",home,setHome,50000,2000000,5000,true],["Down payment",down,setDown,0,home,1000,true],["Interest rate",rate,setRate,0.5,15,0.1,false],["Loan term (years)",years,setYears,5,30,5,false]] as const).map(([label,value,set,min,max,step,isMoney])=>(
            <div key={String(label)} style={{marginBottom:22}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <label style={{fontSize:14,fontWeight:600,color:"#374151"}}>{label}</label>
                <span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>{isMoney ? fmt(Number(value)) : value}{!isMoney && String(label).includes("rate") ? "%" : !isMoney ? " yrs" : ""}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={Number(value)}
                onChange={e=>(set as (v:number)=>void)(Number(e.target.value))}
                style={{width:"100%",accentColor:"#2563eb"}}/>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {[["Monthly payment",fmt(payment),true],["Total paid",fmt(total),false],["Total interest",fmt(interest),false]].map(([label,value,hi])=>(
            <div key={String(label)} style={{background:hi?"#2563eb":"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"18px 12px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:hi?"#fff":"#111",marginBottom:4}}>{value}</div>
              <div style={{fontSize:11,color:hi?"rgba(255,255,255,0.8)":"#6b7280"}}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{background:"#eff6ff",borderRadius:10,padding:"14px 18px",fontSize:14,color:"#1d4ed8"}}>
          <b>Loan:</b> {fmt(principal)} at {rate}% for {years} years
        </div>
      </section>
    </main>
  );
}