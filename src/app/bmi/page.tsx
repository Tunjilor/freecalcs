"use client";
import { useState } from "react";
import Link from "next/link";
export default function BMI() {
  const [unit, setUnit] = useState("imperial");
  const [weight, setWeight] = useState(170);
  const [height, setHeight] = useState(68);
  const [weightKg, setWeightKg] = useState(77);
  const [heightCm, setHeightCm] = useState(173);
  const bmi = unit === "imperial" ? (weight / (height * height)) * 703 : weightKg / ((heightCm/100) * (heightCm/100));
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
  const color = bmi < 18.5 ? "#3b82f6" : bmi < 25 ? "#22c55e" : bmi < 30 ? "#f59e0b" : "#ef4444";
  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>BMI Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:32,fontSize:16}}>Calculate your Body Mass Index instantly.</p>
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          <button onClick={()=>setUnit("imperial")} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #e5e7eb",background:unit==="imperial"?"#2563eb":"#fff",color:unit==="imperial"?"#fff":"#374151",fontWeight:600,fontSize:14,cursor:"pointer"}}>Imperial</button>
          <button onClick={()=>setUnit("metric")} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #e5e7eb",background:unit==="metric"?"#2563eb":"#fff",color:unit==="metric"?"#fff":"#374151",fontWeight:600,fontSize:14,cursor:"pointer"}}>Metric</button>
        </div>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28,marginBottom:16}}>
          {unit==="imperial" ? (
            <>
              <div style={{marginBottom:22}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><label style={{fontSize:14,fontWeight:600,color:"#374151"}}>Weight</label><span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>{weight} lbs</span></div>
                <input type="range" min={80} max={400} value={weight} onChange={e=>setWeight(Number(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}}/>
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><label style={{fontSize:14,fontWeight:600,color:"#374151"}}>Height</label><span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>{Math.floor(height/12)}ft {height%12}in</span></div>
                <input type="range" min={48} max={84} value={height} onChange={e=>setHeight(Number(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}}/>
              </div>
            </>
          ) : (
            <>
              <div style={{marginBottom:22}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><label style={{fontSize:14,fontWeight:600,color:"#374151"}}>Weight</label><span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>{weightKg} kg</span></div>
                <input type="range" min={30} max={200} value={weightKg} onChange={e=>setWeightKg(Number(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}}/>
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><label style={{fontSize:14,fontWeight:600,color:"#374151"}}>Height</label><span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>{heightCm} cm</span></div>
                <input type="range" min={140} max={220} value={heightCm} onChange={e=>setHeightCm(Number(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}}/>
              </div>
            </>
          )}
        </div>
        <div style={{background:"#fff",borderRadius:16,border:"2px solid "+color,padding:32,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:64,fontWeight:800,color,marginBottom:8}}>{bmi.toFixed(1)}</div>
          <div style={{fontSize:20,fontWeight:600,color}}>{category}</div>
        </div>
      </section>
    </main>
  );
}
