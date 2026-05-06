"use client";
import { useState } from "react";
import Link from "next/link";

export default function RentVsBuy() {
  const [homePrice, setHomePrice] = useState("400000");
  const [downPct, setDownPct] = useState("20");
  const [mortgageRate, setMortgageRate] = useState("6.5");
  const [rent, setRent] = useState("2000");
  const [years, setYears] = useState("7");
  const [appreciation, setAppreciation] = useState("3");

  const h = parseFloat(homePrice)||0;
  const dp = parseFloat(downPct)||0;
  const r = parseFloat(mortgageRate)||0;
  const mo_rent = parseFloat(rent)||0;
  const y = parseFloat(years)||0;
  const app = parseFloat(appreciation)||0;

  const down = h*dp/100;
  const principal = h-down;
  const mr = r/100/12; const n = 30*12;
  const payment = mr>0 ? principal*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1) : principal/n;
  const totalMortgage = payment*y*12;
  const totalRent = mo_rent*y*12*Math.pow(1.03,y/2);
  const futureValue = h*Math.pow(1+app/100,y);
  const equity = futureValue-principal*(Math.pow(1+mr,n)-Math.pow(1+mr,n-y*12))/(Math.pow(1+mr,n)-1)-down;
  const buyCost = totalMortgage+down-equity;
  const better = buyCost < totalRent ? "buying" : "renting";
  const savings = Math.abs(totalRent-buyCost);
  const fmt = (v:number) => isNaN(v)||!isFinite(v)?"$0":v.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});

  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:960,margin:"0 auto",padding:"48px 24px 80px"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>Rent vs Buy Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:32,fontSize:16}}>Find out whether buying or renting makes more financial sense for you.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}}>
          <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28}}>
            {[
              {label:"Home price ($)",val:homePrice,set:setHomePrice},
              {label:"Down payment (%)",val:downPct,set:setDownPct},
              {label:"Mortgage rate (%)",val:mortgageRate,set:setMortgageRate},
              {label:"Monthly rent ($)",val:rent,set:setRent},
              {label:"Years to compare",val:years,set:setYears},
              {label:"Home appreciation (%/yr)",val:appreciation,set:setAppreciation},
            ].map((f)=>(
              <div key={f.label} style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>{f.label}</label>
                <input type="number" value={f.val} onChange={e=>f.set(e.target.value)}
                  style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:15,boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:better==="buying"?"#2563eb":"#6b7280",borderRadius:16,padding:28,textAlign:"center"}}>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginBottom:8,fontWeight:600,textTransform:"uppercase"}}>Better option over {y} years</div>
              <div style={{fontSize:42,fontWeight:800,color:"#fff",textTransform:"capitalize"}}>{better}</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.8)",marginTop:8}}>saves approx. {fmt(savings)}</div>
            </div>
            {[["Total cost of buying",fmt(buyCost),"#2563eb"],["Total cost of renting",fmt(totalRent),"#6b7280"],["Home future value",fmt(futureValue),"#059669"],["Estimated equity",fmt(equity),"#059669"]].map(([l,v,c])=>(
              <div key={String(l)} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,color:"#6b7280"}}>{l}</span>
                <span style={{fontSize:18,fontWeight:700,color:String(c)}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
