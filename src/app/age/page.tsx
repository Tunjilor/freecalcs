"use client";
import { useState } from "react";
import Link from "next/link";
export default function AgeCalculator() {
  const [dob, setDob] = useState("1990-01-01");
  const today = new Date();
  const birth = new Date(dob);
  const years = today.getFullYear()-birth.getFullYear();
  const months = today.getMonth()-birth.getMonth()<0?12+today.getMonth()-birth.getMonth():today.getMonth()-birth.getMonth();
  const days = today.getDate()-birth.getDate()<0?30+today.getDate()-birth.getDate():today.getDate()-birth.getDate();
  const totalDays = Math.floor((today.getTime()-birth.getTime())/(1000*60*60*24));
  const next = new Date(today.getFullYear(),birth.getMonth(),birth.getDate());
  if(next<today) next.setFullYear(today.getFullYear()+1);
  const daysToNext = Math.ceil((next.getTime()-today.getTime())/(1000*60*60*24));
  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>Age Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:32,fontSize:16}}>Find your exact age and days until your next birthday.</p>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28,marginBottom:16}}>
          <label style={{fontSize:14,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>Date of birth</label>
          <input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:16}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[[String(years),"Years old",true],[months+"mo "+days+"d","Months & days",false],[totalDays.toLocaleString(),"Total days lived",false],[String(daysToNext),"Days to birthday",false]].map(([v,l,hi])=>(
            <div key={String(l)} style={{background:hi?"#2563eb":"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"18px 16px",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:800,color:hi?"#fff":"#111",marginBottom:4}}>{String(v)}</div>
              <div style={{fontSize:12,color:hi?"rgba(255,255,255,0.8)":"#6b7280"}}>{String(l)}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
