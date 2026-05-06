"use client";
import { useState } from "react";
import Link from "next/link";
export default function CompoundInterest() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [monthly, setMonthly] = useState(200);
  const r = rate/100/12; const n = years*12;
  const total = principal * Math.pow(1+r,n) + monthly * ((Math.pow(1+r,n)-1)/r);
  const contributed = principal + monthly*years*12;
  const interest = total - contributed;
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
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>Compound Interest Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:32,fontSize:16}}>See how your savings grow over time.</p>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28,marginBottom:16}}>
          {[["Initial deposit",principal,setPrincipal,1000,100000,500,true],["Annual return",rate,setRate,1,20,0.5,false],["Years",years,setYears,1,40,1,false],["Monthly contribution",monthly,setMonthly,0,2000,50,true]].map(([l,v,s,min,max,step,isMoney])=>(
            <div key={String(l)} style={{marginBottom:22}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><label style={{fontSize:14,fontWeight:600,color:"#374151"}}>{String(l)}</label><span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>{isMoney?fmt(Number(v)):v}{!isMoney&&String(l).includes("return")?"%":!isMoney&&String(l).includes("Year")?" yrs":""}</span></div>
              <input type="range" min={Number(min)} max={Number(max)} step={Number(step)} value={Number(v)} onChange={e=>(s as (n:number)=>void)(Number(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}}/>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[["Final balance",fmt(total),true],["Contributed",fmt(contributed),false],["Interest earned",fmt(interest),false]].map(([l,v,hi])=>(
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
