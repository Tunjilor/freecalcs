"use client";
import { useState } from "react";
import Link from "next/link";
export default function TDEE() {
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(170);
  const [height, setHeight] = useState(68);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState(1.55);
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;
  const bmr = gender === "male" ? 88.362 + (13.397*weightKg) + (4.799*heightCm) - (5.677*age) : 447.593 + (9.247*weightKg) + (3.098*heightCm) - (4.330*age);
  const tdee = Math.round(bmr * activity);
  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>TDEE Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:32,fontSize:16}}>Find your Total Daily Energy Expenditure.</p>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:28,marginBottom:16}}>
          <div style={{display:"flex",gap:8,marginBottom:24}}>
            <button onClick={()=>setGender("male")} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #e5e7eb",background:gender==="male"?"#2563eb":"#fff",color:gender==="male"?"#fff":"#374151",fontWeight:600,fontSize:14,cursor:"pointer"}}>Male</button>
            <button onClick={()=>setGender("female")} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #e5e7eb",background:gender==="female"?"#2563eb":"#fff",color:gender==="female"?"#fff":"#374151",fontWeight:600,fontSize:14,cursor:"pointer"}}>Female</button>
          </div>
          {[["Age",age,setAge,18,80,1,"yrs"],["Weight",weight,setWeight,80,350,1,"lbs"],["Height",height,setHeight,48,84,1,"in"]].map(([l,v,s,min,max,step,unit])=>(
            <div key={String(l)} style={{marginBottom:22}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><label style={{fontSize:14,fontWeight:600,color:"#374151"}}>{String(l)}</label><span style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>{String(v)} {String(unit)}</span></div>
              <input type="range" min={Number(min)} max={Number(max)} step={Number(step)} value={Number(v)} onChange={e=>(s as (n:number)=>void)(Number(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}}/>
            </div>
          ))}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[[1.2,"Sedentary"],[1.375,"Lightly active"],[1.55,"Moderately active"],[1.725,"Very active"],[1.9,"Extra active"]].map(([val,label])=>(
              <button key={String(label)} onClick={()=>setActivity(Number(val))} style={{padding:"10px 14px",borderRadius:8,border:"1px solid "+(activity===val?"#2563eb":"#e5e7eb"),background:activity===val?"#eff6ff":"#fff",textAlign:"left",cursor:"pointer",fontSize:14,fontWeight:600,color:activity===val?"#2563eb":"#111"}}>{String(label)}</button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[["Maintain",tdee,true],["Lose weight",tdee-500,false],["Gain weight",tdee+500,false]].map(([l,v,hi])=>(
            <div key={String(l)} style={{background:hi?"#2563eb":"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"18px 12px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:800,color:hi?"#fff":"#111",marginBottom:4}}>{String(v)} cal</div>
              <div style={{fontSize:11,color:hi?"rgba(255,255,255,0.8)":"#6b7280"}}>{String(l)}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
