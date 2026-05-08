"use client";
import { useState } from "react";
import Link from "next/link";
export default function PercentageCalculator() {
  const [mode, setMode] = useState(0);
  const [a, setA] = useState(25);
  const [b, setB] = useState(200);
  const results = [
    {q:"What is A% of B?", a:(a*b/100).toFixed(2)},
    {q:"A is what % of B?", a:(a/b*100).toFixed(2)+"%"},
    {q:"% change from A to B?", a:((b-a)/a*100).toFixed(2)+"%"},
  ];
  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>Percentage Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:32,fontSize:16}}>Percent of, percentage change, and more.</p>
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          {["% of","X is % of Y","% change"].map((l,i)=><button key={i} onClick={()=>setMode(i)} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #e5e7eb",background:mode===i?"#2563eb":"#fff",color:mode===i?"#fff":"#374151",fontWeight:600,fontSize:13,cursor:"pointer"}}>{l}</button>)}
        </div>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28,marginBottom:16}}>
          <p style={{fontSize:16,fontWeight:600,color:"#374151",marginBottom:20}}>{results[mode].q}</p>
          {[["Value A",a,setA],["Value B",b,setB]].map(([l,v,s])=>(
            <div key={String(l)} style={{marginBottom:20}}>
              <label style={{fontSize:14,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>{String(l)}</label>
              <input type="number" value={Number(v)} onChange={e=>(s as (n:number)=>void)(Number(e.target.value))} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:16}}/>
            </div>
          ))}
        </div>
        <div style={{background:"#2563eb",borderRadius:16,padding:28,textAlign:"center"}}>
          <div style={{fontSize:48,fontWeight:800,color:"#fff",marginBottom:8}}>{results[mode].a}</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.8)"}}>{results[mode].q}</div>
        </div>
      </section>
    </main>
  );
}
