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
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}><b style={{color:"#111"}}>freecalcs</b><b style={{color:"#2563eb"}}>.io</b></Link>
          <Link href="/" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>← All calculators</Link>
        </div>
      </nav>
      <section style={{maxWidth:480,margin:"0 auto",padding:"48px 24px 80px"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#111",marginBottom:6}}>Scientific Calculator</h1>
        <p style={{color:"#6b7280",marginBottom:24,fontSize:16}}>Full scientific functions including trig, logs, and more.</p>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:20}}>
          <div style={{background:"#f8f9fb",borderRadius:10,padding:"16px 20px",marginBottom:16,minHeight:80}}>
            <div style={{fontSize:12,color:"#9ca3af",minHeight:18}}>{expr}</div>
            <div style={{fontSize:36,fontWeight:700,color:"#111",textAlign:"right",wordBreak:"break-all"}}>{display}</div>
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
  );
}
