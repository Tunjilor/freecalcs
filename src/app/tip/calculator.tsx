// @ts-nocheck
'use client';
import { useState } from 'react';

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', gray:'#6b7280', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc' };
const card: React.CSSProperties = { background:C.white, borderRadius:16, padding:20, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, marginBottom:16 };
const inp: React.CSSProperties  = { width:'100%', border:`1px solid #cbd5e1`, borderRadius:10, padding:'10px 12px', fontSize:15, outline:'none', background:C.white, boxSizing:'border-box', color:'#111827', fontWeight:600 };
const lbl: React.CSSProperties  = { display:'block', fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 } as React.CSSProperties;

const ALL_CALCS = [
  ['/mortgage','Mortgage Calculator'],['/qualify','Mortgage Qualifier'],['/rent-vs-buy','Rent vs Buy'],
  ['/loan','Loan & EMI'],['/salary','Salary Calculator'],['/tax','Income Tax'],
  ['/compound-interest','Compound Interest'],['/percentage','Percentage Calc'],
  ['/bmi','BMI Calculator'],['/tdee','TDEE & Calories'],['/age','Age Calculator'],
];

const TIP_PRESETS = [10,15,18,20,22,25];

const SERVICE_PRESETS = [
  { label:'Restaurant', tip:18 },
  { label:'Bar / Drinks', tip:20 },
  { label:'Food Delivery', tip:15 },
  { label:'Hair / Salon', tip:20 },
  { label:'Taxi / Rideshare', tip:15 },
  { label:'Hotel Housekeeping', tip:5 },
  { label:'Spa / Massage', tip:20 },
  { label:'Pizza Delivery', tip:15 },
];

function fmt2(n:number){ return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmt0(n:number){ return n.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0}); }

export default function TipCalculator(){
  const [bill, setBill]         = useState('85.00');
  const [tipPct, setTipPct]     = useState(20);
  const [customTip, setCustom]  = useState('');
  const [people, setPeople]     = useState(3);
  const [roundUp, setRoundUp]   = useState(false);
  const [taxRate, setTaxRate]     = useState('0');
  const [tipOnPreTax, setPreTax]  = useState(false);

  const billAmt    = parseFloat(bill.replace(/[^0-9.]/g,''))||0;
  const taxAmt     = billAmt * (parseFloat(taxRate)||0) / 100;
  const preTaxAmt  = taxRate && parseFloat(taxRate)>0 ? billAmt / (1 + (parseFloat(taxRate)||0)/100) : billAmt;
  const tipBase    = tipOnPreTax ? preTaxAmt : billAmt;
  const activeTip = customTip ? parseFloat(customTip)||0 : tipPct;
  const tipAmt    = tipBase * activeTip / 100;
  const total     = billAmt + tipAmt;
  const perPerson = total / Math.max(1, people);
  const tipPer    = tipAmt / Math.max(1, people);
  const roundedPer= Math.ceil(perPerson);
  const roundedTotal = roundedPer * people;
  const roundedTip = roundedTotal - billAmt;
  const roundedTipPct = billAmt > 0 ? (roundedTip/billAmt*100) : 0;

  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>
      <style>{`@media(max-width:680px){.tip-grid{grid-template-columns:1fr!important;}}`}</style>

      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:C.white,padding:'32px 16px 40px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:28,fontWeight:700,margin:'12px 0 8px',color:C.white}}>Tip Calculator</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 16px'}}>Calculate tip amount and split the bill evenly. Quick presets for restaurants, bars, delivery, salons, and more.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Bill Splitter','Custom Tip %','Round Up Option','Service Presets','Per-Person Breakdown'].map(t=>(
              <span key={t} style={{background:'rgba(255,255,255,.15)',fontSize:12,padding:'4px 12px',borderRadius:20,color:C.white}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(0,3fr)',gap:20}} className="tip-grid">

          {/* LEFT */}
          <div>
            <div style={{...card}}>
              <div style={{marginBottom:16}}>
                <label style={lbl}>Bill Amount</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:16,pointerEvents:'none',fontWeight:600}}>$</span>
                  <input style={{...inp,paddingLeft:28,fontSize:22,fontWeight:700}} type="number" min="0" step="0.01" value={bill} onChange={e=>setBill(e.target.value)}/>
                </div>
              </div>

              <div style={{marginBottom:16}}>
                <label style={lbl}>Tip Percentage</label>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:8}}>
                  {TIP_PRESETS.map(p=>(
                    <button key={p} onClick={()=>{setTipPct(p);setCustom('');}}
                      style={{padding:'10px 0',fontSize:15,fontWeight:700,borderRadius:10,border:`1px solid ${!customTip&&tipPct===p?C.blue:C.border}`,background:!customTip&&tipPct===p?C.blue:C.white,color:!customTip&&tipPct===p?C.white:'#374151',cursor:'pointer'}}>
                      {p}%
                    </button>
                  ))}
                </div>
                <div style={{position:'relative'}}>
                  <input style={{...inp,paddingRight:32,textAlign:'left'}} type="number" min="0" max="100" placeholder="Custom %" value={customTip} onChange={e=>setCustom(e.target.value)}/>
                  <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:14,pointerEvents:'none'}}>%</span>
                </div>
              </div>

              <div style={{marginBottom:16}}>
                <label style={lbl}>Number of People</label>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <button onClick={()=>setPeople(Math.max(1,people-1))} style={{width:40,height:40,borderRadius:10,border:`1px solid ${C.border}`,background:C.white,fontSize:20,fontWeight:700,cursor:'pointer',color:'#374151',flexShrink:0}}>-</button>
                  <span style={{fontSize:24,fontWeight:700,color:'#111827',flex:1,textAlign:'center'}}>{people}</span>
                  <button onClick={()=>setPeople(people+1)} style={{width:40,height:40,borderRadius:10,border:`1px solid ${C.blue}`,background:C.blue,fontSize:20,fontWeight:700,cursor:'pointer',color:C.white,flexShrink:0}}>+</button>
                </div>
              </div>

              <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#f8fafc',borderRadius:10,border:`1px solid ${C.border}`}}>
                <input type="checkbox" id="roundup" checked={roundUp} onChange={e=>setRoundUp(e.target.checked)} style={{width:16,height:16,accentColor:C.blue}}/>
                <label htmlFor="roundup" style={{fontSize:13,color:'#374151',cursor:'pointer'}}>Round up per person to nearest dollar</label>
              </div>

              <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <div>
                  <label style={lbl}>Sales Tax Rate %</label>
                  <input style={inp} type='number' min='0' max='15' step='0.1' placeholder='e.g. 8.5' value={taxRate} onChange={e=>setTaxRate(e.target.value)}/>
                </div>
                {parseFloat(taxRate)>0&&(
                  <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',background:'#f8fafc',borderRadius:10,border:'1px solid #e5e7eb',marginTop:20}}>
                    <input type='checkbox' id='pretax' checked={tipOnPreTax} onChange={e=>setPreTax(e.target.checked)} style={{width:16,height:16,accentColor:'#2563eb'}}/>
                    <label htmlFor='pretax' style={{fontSize:12,color:'#374151',cursor:'pointer'}}>Tip on pre-tax amount</label>
                  </div>
                )}
              </div>
            </div>

            {/* Service type presets */}
            <div style={{...card}}>
              <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Quick Service Presets</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {SERVICE_PRESETS.map(s=>(
                  <button key={s.label} onClick={()=>{setTipPct(s.tip);setCustom('');}}
                    style={{padding:'8px 10px',fontSize:12,fontWeight:600,borderRadius:9,border:`1px solid ${!customTip&&tipPct===s.tip?C.blue:C.border}`,background:!customTip&&tipPct===s.tip?'#eff6ff':C.white,color:!customTip&&tipPct===s.tip?C.blue:'#374151',cursor:'pointer',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span>{s.label}</span>
                    <span style={{fontWeight:700,color:C.blue}}>{s.tip}%</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* Hero result */}
            <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,borderRadius:16,padding:20,color:C.white,marginBottom:16,boxShadow:'0 4px 20px rgba(37,99,235,.3)'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <div>
                  <p style={{fontSize:11,fontWeight:600,color:'#93c5fd',margin:'0 0 4px',textTransform:'uppercase',letterSpacing:'.1em'}}>Tip Amount</p>
                  <div style={{fontSize:40,fontWeight:700,lineHeight:1}}>${fmt2(roundUp?roundedTip:tipAmt)}</div>
                  <p style={{fontSize:13,color:'#93c5fd',margin:'4px 0 0'}}>{(roundUp?roundedTipPct:activeTip).toFixed(1)}% of bill</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontSize:11,fontWeight:600,color:'#93c5fd',margin:'0 0 4px',textTransform:'uppercase',letterSpacing:'.1em'}}>Total Bill</p>
                  <div style={{fontSize:40,fontWeight:700,lineHeight:1}}>${fmt2(roundUp?roundedTotal:total)}</div>
                  <p style={{fontSize:13,color:'#93c5fd',margin:'4px 0 0'}}>including tip</p>
                </div>
              </div>
              <div style={{borderTop:'1px solid rgba(255,255,255,.2)',paddingTop:16}}>
                <p style={{fontSize:11,fontWeight:600,color:'#93c5fd',margin:'0 0 6px',textTransform:'uppercase',letterSpacing:'.1em'}}>Per Person ({people} {people===1?'person':'people'})</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  <div style={{background:'rgba(255,255,255,.12)',borderRadius:10,padding:'12px 14px'}}>
                    <p style={{fontSize:11,color:'#93c5fd',margin:'0 0 2px'}}>Each pays</p>
                    <p style={{fontSize:22,fontWeight:700,margin:0}}>${fmt2(roundUp?roundedPer:perPerson)}</p>
                  </div>
                  <div style={{background:'rgba(255,255,255,.12)',borderRadius:10,padding:'12px 14px'}}>
                    <p style={{fontSize:11,color:'#93c5fd',margin:'0 0 2px'}}>Tip each</p>
                    <p style={{fontSize:22,fontWeight:700,margin:0}}>${fmt2(roundUp?roundedTip/people:tipPer)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full breakdown */}
            <div style={{...card}}>
              <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 14px'}}>Full Breakdown</p>
              {[
                ['Bill Subtotal', '$'+fmt2(billAmt), '#111827'],
                ['Tip ('+activeTip+'%)', '$'+fmt2(tipAmt), '#2563eb'],
                ['Total', '$'+fmt2(total), '#111827'],
              ].map(([l,v,color])=>(
                <div key={l as string} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid #f3f4f6`}}>
                  <span style={{fontSize:14,color:'#374151'}}>{l}</span>
                  <span style={{fontSize:14,fontWeight:700,color:color as string}}>{v}</span>
                </div>
              ))}
              {roundUp&&(
                <div style={{marginTop:10,padding:'10px 12px',background:'#f0fdf4',borderRadius:8,border:'1px solid #86efac'}}>
                  <p style={{fontSize:12,color:'#166534',margin:0}}>Rounded up: each pays <strong>${fmt0(roundedPer)}</strong> - total tip becomes <strong>${fmt2(roundedTip)}</strong> ({roundedTipPct.toFixed(1)}%)</p>
                </div>
              )}
            </div>

            {/* Tip guide */}
            <div style={{...card}}>
              <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Tip Guide by Service Quality</p>
              {[
                {quality:'Exceptional',range:'25%+',color:'#16a34a',bg:'#f0fdf4',border:'#86efac'},
                {quality:'Great',range:'20-25%',color:'#2563eb',bg:'#eff6ff',border:'#93c5fd'},
                {quality:'Good',range:'15-20%',color:'#d97706',bg:'#fffbeb',border:'#fcd34d'},
                {quality:'Fair',range:'10-15%',color:'#dc2626',bg:'#fef2f2',border:'#fca5a5'},
              ].map(({quality,range,color,bg,border})=>(
                <div key={quality} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',borderRadius:9,marginBottom:6,background:bg,border:`1px solid ${border}`}}>
                  <span style={{fontSize:13,fontWeight:600,color}}>{quality}</span>
                  <span style={{fontSize:13,fontWeight:700,color}}>{range}</span>
                </div>
              ))}
              {parseFloat(taxRate)>0&&tipOnPreTax&&(<p style={{fontSize:12,color:'#2563eb',background:'#eff6ff',borderRadius:8,padding:'8px 10px',margin:'0 0 10px'}}>Tipping on pre-tax amount: {fmt2(billAmt-taxAmt)} instead of full {fmt2(billAmt)} bill</p>)}
              <p style={{fontSize:11,color:'#9ca3af',margin:'10px 0 0',lineHeight:1.5}}>Tip culture varies by country. In the US, 18-20% is standard for sit-down restaurants. Tipping is discretionary in all cases.</p>
            </div>
          </div>
        </div>

        <div style={{background:'linear-gradient(135deg,#eff6ff,#eef2ff)',borderRadius:16,padding:20,border:'1px solid #bfdbfe',marginTop:8}}>
          <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:12}}>All freecalcs.io Calculators</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {ALL_CALCS.map(([href,name])=>(
              <a key={href} href={href} style={{background:C.white,fontSize:13,color:C.blue,fontWeight:500,padding:'8px 16px',borderRadius:10,border:'1px solid #bfdbfe',textDecoration:'none'}}>{name}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}