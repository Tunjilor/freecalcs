"use client";
import { useState } from "react";
import Link from "next/link";
export default function TipCalculator() {
  const [bill, setBill] = useState(50);
  const [tip, setTip] = useState(18);
  const [people, setPeople] = useState(2);
  const tipAmt = bill*tip/100;
  const total = bill+tipAmt;
  const fmt = (v:number) => v.toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});
  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>Tip Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:32,fontSize:16}}>Split bills and calculate tips instantly.</p>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28,marginBottom:16}}>
          {[["Bill amount",bill,setBill,1,500,1],["Tip %",tip,setTip,0,30,1],["People",people,setPeople,1,20,1]].map(([l,v,s,min,max,step])=>(
            <div key={String(l)} style={{marginBottom:22}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><label style={{fontSize:14,fontWeight:600,color:"#374151"}}>{String(l)}</label><span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>{String(l).includes("Bill")?"$":""}{String(v)}{String(l).includes("Tip")?"%":""}</span></div>
              <input type="range" min={Number(min)} max={Number(max)} step={Number(step)} value={Number(v)} onChange={e=>(s as (n:number)=>void)(Number(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}}/>
            </div>
          ))}
          <div style={{display:"flex",gap:8}}>{[10,15,18,20,25].map(t=><button key={t} onClick={()=>setTip(t)} style={{padding:"6px 16px",borderRadius:8,border:"1px solid #e5e7eb",background:tip===t?"#2563eb":"#fff",color:tip===t?"#fff":"#374151",fontWeight:600,fontSize:13,cursor:"pointer"}}>{t}%</button>)}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[["Per person",fmt(total/people),true],["Tip amount",fmt(tipAmt),false],["Total bill",fmt(total),false]].map(([l,v,hi])=>(
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
