// @ts-nocheck
"use client";
import { useState } from "react";
import Link from "next/link";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [newNum, setNewNum] = useState(true);

  const press = (val: string) => {
    if(val==="C"){setDisplay("0");setExpr("");setNewNum(true);return;}
    if(val==="⌫"){setDisplay(display.length>1?display.slice(0,-1):"0");return;}
    if(val==="="){
      try{
        let e = expr+display;
        e=e.replace(/×/g,"*").replace(/÷/g,"/").replace(/π/g,String(Math.PI)).replace(/e/g,String(Math.E));
        e=e.replace(/sin\(/g,"Math.sin(").replace(/cos\(/g,"Math.cos(").replace(/tan\(/g,"Math.tan(");
        e=e.replace(/√\(/g,"Math.sqrt(").replace(/log\(/g,"Math.log10(").replace(/ln\(/g,"Math.log(");
        const result = Function('"use strict";return ('+e+')')();
        setDisplay(String(parseFloat(result.toFixed(10))));
        setExpr("");setNewNum(true);
      }catch{setDisplay("Error");setNewNum(true);}
      return;
    }
    const ops = ["+","-","×","÷","^","(",")",","];
    if(ops.includes(val)){setExpr(expr+display+val);setDisplay("0");setNewNum(true);return;}
    const fns = ["sin(","cos(","tan(","√(","log(","ln(","π","e"];
    if(fns.includes(val)){
      if(val==="π"){setDisplay(String(Math.PI.toFixed(8)));setNewNum(true);}
      else if(val==="e"){setDisplay(String(Math.E.toFixed(8)));setNewNum(true);}
      else{setExpr(expr+(newNum?"":display)+val);setDisplay("0");setNewNum(true);}
      return;
    }
    if(val==="."){
      if(newNum){setDisplay("0.");setNewNum(false);}
      else if(!display.includes(".")){setDisplay(display+".");}
      return;
    }
    if(newNum){setDisplay(val);setNewNum(false);}
    else{setDisplay(display==="0"?val:display+val);}
  };

  const btn = (label:string, type="num") => {
    const colors:Record<string,string> = {op:"#e5e7eb",fn:"#dbeafe",eq:"#2563eb",clear:"#fee2e2"};
    const textColors:Record<string,string> = {op:"#111",fn:"#1d4ed8",eq:"#fff",clear:"#dc2626"};
    return (
      <button key={label} onClick={()=>press(label)} style={{padding:"16px 8px",borderRadius:10,border:"1px solid #e5e7eb",background:colors[type]||"#fff",color:textColors[type]||"#111",fontSize:type==="fn"?13:16,fontWeight:600,cursor:"pointer",transition:"all 0.1s"}}>
        {label}
      </button>
    );
  };

  return (
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif',background:'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)',minHeight:'100vh'}}>
      <div style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)',color:'#fff',padding:'32px 16px 40px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:28,fontWeight:700,margin:'12px 0 8px',color:'#fff'}}>Scientific Calculator</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 16px'}}>Full scientific functions including trig, logarithms, exponents, constants, and memory. Free and instant.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Trig Functions','Logarithms','Exponents','Constants','Memory'].map(t=>(
              <span key={t} style={{background:'rgba(255,255,255,.15)',fontSize:12,padding:'4px 12px',borderRadius:20,color:'#fff'}}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <main style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:20}}>
          <div style={{background:"#f8f9fb",borderRadius:10,padding:"16px 20px",marginBottom:16,minHeight:80}}>
            <div style={{fontSize:12,color:"#9ca3af",minHeight:18}}>{expr}</div>
            <div style={{fontSize:40,fontWeight:800,letterSpacing:'-0.02em',color:"#111",textAlign:"right",wordBreak:"break-all"}}>{display}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
            {btn("sin(","fn")}{btn("cos(","fn")}{btn("tan(","fn")}{btn("log(","fn")}{btn("ln(","fn")}
            {btn("√(","fn")}{btn("π","fn")}{btn("e","fn")}{btn("(","op")}{btn(")","op")}
            {btn("7")}{btn("8")}{btn("9")}{btn("÷","op")}{btn("C","clear")}
            {btn("4")}{btn("5")}{btn("6")}{btn("×","op")}{btn("⌫","op")}
            {btn("1")}{btn("2")}{btn("3")}{btn("-","op")}{btn("^","op")}
            {btn("0")}{btn(".")}{btn("00")}{btn("+","op")}{btn("=","eq")}
          </div>
        </div>
      </section>
    </main>
      {/* Related Calculators */}
      <div style={{maxWidth:960,margin:"0 auto",padding:"0 16px 40px"}}>
        <p style={{fontSize:18,fontWeight:700,color:"#111827",marginBottom:4}}>Related Calculators</p>
        <p style={{fontSize:13,color:"#64748b",marginBottom:16}}>Tools that work great alongside this one</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:10}}>
          {[["/percentage","Percentage Calculator","Quick percentage math"],["/compound-interest","Compound Interest","Growth and investment math"],["/tip","Tip Calculator","Bill splitting calculations"]].map(([href,name,desc])=>(
            <a key={href} href={href} style={{textDecoration:"none",display:"block",padding:"14px 18px",background:"rgba(255,255,255,0.9)",borderRadius:14,border:"1px solid #e2e8f0"}}>
              <span style={{fontSize:14,fontWeight:600,color:"#2563eb"}}>{name} →</span>
              <span style={{display:"block",fontSize:13,color:"#64748b",marginTop:2}}>{desc}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
