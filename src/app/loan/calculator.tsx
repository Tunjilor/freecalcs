// @ts-nocheck
'use client';
import { useState, useEffect, useCallback } from 'react';

const C = { blue:'#2563eb', darkBlue:'#0f172a', gray:'#6b7280', border:'#e2e8f0', white:'#ffffff', light:'#f8fafc', text:'#111827', accent:'#7c3aed', emerald:'#059669' };
const card: React.CSSProperties = { background:'rgba(255,255,255,0.85)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderRadius:20, padding:24, boxShadow:'0 4px 24px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)', border:'1px solid rgba(226,232,240,0.8)', marginBottom:20, transition:'all 0.3s ease' };
const inp: React.CSSProperties = { width:'100%', border:'1.5px solid #e2e8f0', borderRadius:12, padding:'12px 14px', fontSize:15, outline:'none', background:'#f8fafc', boxSizing:'border-box', color:'#111827', fontWeight:600, transition:'all 0.2s ease', letterSpacing:'-0.01em' };
const lbl: React.CSSProperties = { display:'block', fontSize:12, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 } as React.CSSProperties;
const btnBase: React.CSSProperties = { flex:1, padding:'10px 0', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', transition:'all .15s' };

const PRESETS = [
  { label:'Personal Loan', rate:'11.5', term:'60',  icon:'P' },
  { label:'Auto Loan',     rate:'7.1',  term:'60',  icon:'A' },
  { label:'Student Loan',  rate:'6.5',  term:'120', icon:'S' },
  { label:'Home Equity',   rate:'8.5',  term:'180', icon:'H' },
];

const ALL_CALCS = [
  ['/mortgage','Mortgage Calculator'],['/qualify','Mortgage Qualifier'],['/rent-vs-buy','Rent vs Buy'],
  ['/salary','Salary Calculator'],['/tax','Income Tax'],['/compound-interest','Compound Interest'],
  ['/percentage','Percentage Calc'],['/bmi','BMI Calculator'],['/tdee','TDEE & Calories'],
  ['/age','Age Calculator'],['/tip','Tip Calculator'],
];

function fmtD(n:number){return '$'+Math.round(Math.abs(n)).toLocaleString('en-US');}
function fmtDec(n:number){return '$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}

interface AmRow { month:number; payment:number; principal:number; interest:number; balance:number; }

function compute(principal:number, annualRate:number, termMonths:number, extraPayment:number, originationFee:number) {
  if(!principal||!annualRate||!termMonths) return null;
  const r = annualRate/100/12;
  const n = termMonths;
  const payment = principal * (r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1);
  const totalPayment = payment + extraPayment;

  const rows:AmRow[] = [];
  let balance = principal;
  let month = 0;
  let totalInterest = 0;

  while(balance > 0.01 && month < 600){
    month++;
    const interestCharge = balance * r;
    const principalPaid = Math.min(totalPayment - interestCharge, balance);
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interestCharge;
    rows.push({ month, payment:Math.min(totalPayment, principalPaid+interestCharge), principal:principalPaid, interest:interestCharge, balance });
  }

  const actualMonths = rows.length;
  const totalCost = principal + totalInterest + originationFee;
  const apr = annualRate; // simplified
  const monthsSaved = termMonths - actualMonths;

  return { payment, totalPayment, totalInterest, totalCost, rows, actualMonths, monthsSaved, apr, originationFee };
}

export default function LoanCalculator(){
  const [amount, setAmount]     = useState('25000');
  const [rate, setRate]         = useState('7.5');
  const [term, setTerm]         = useState('60');
  const [extra, setExtra]       = useState('0');
  const [origFee, setOrigFee]   = useState('0');
  const [tab, setTab]           = useState<'summary'|'amortization'|'compare'>('summary');
  const [res, setRes]           = useState<ReturnType<typeof compute>>(null);

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const _amount = sp.get('amount'); if (_amount) setAmount(_amount as any);
    const _rate = sp.get('rate'); if (_rate) setRate(_rate as any);
    const _term = sp.get('term'); if (_term) setTerm(_term as any);
    const _extra = sp.get('extra'); if (_extra) setExtra(_extra as any);
  }, []);
  const shareCalc = () => {
    const params = new URLSearchParams({ 'amount': String(amount), 'rate': String(rate), 'term': String(term), 'extra': String(extra) });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    window.history.replaceState({}, '', '?' + params.toString());
  };

  const run = useCallback(()=>{
    setRes(compute(
      parseFloat(amount.replace(/,/g,''))||0,
      parseFloat(rate)||0,
      parseInt(term)||0,
      parseFloat(extra.replace(/,/g,''))||0,
      parseFloat(origFee.replace(/,/g,''))||0,
    ));
  },[amount,rate,term,extra,origFee]);

  useEffect(()=>{run();},[run]);

  const applyPreset = (p:typeof PRESETS[0])=>{
    setRate(p.rate);
    setTerm(p.term);
  };

  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)',minHeight:'100vh'}}>
      <style>{`@media(max-width:680px){.loan-grid{grid-template-columns:1fr!important;}}`}</style>

      <div style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)',color:C.white,padding:'32px 16px 40px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:28,fontWeight:700,margin:'12px 0 8px',color:C.white}}>Loan &amp; EMI Calculator</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 16px'}}>Calculate monthly payments, total interest, and full amortization schedule for any loan. Personal, auto, student, or home equity.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Monthly Payment','Total Interest','Amortization Table','Extra Payment Impact','Loan Presets'].map(t=>(
              <span key={t} style={{background:'rgba(255,255,255,.15)',fontSize:12,padding:'4px 12px',borderRadius:20,color:C.white}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(0,3fr)',gap:20}} className="loan-grid">

          {/* LEFT */}
          <div>
            {/* Presets */}
            <div style={{...card}}>
              <p style={{fontSize:11,fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 10px'}}>Quick Presets</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:16}}>
                {PRESETS.map(p=>(
                  <button key={p.label} onClick={()=>applyPreset(p)} style={{padding:'8px 10px',fontSize:12,fontWeight:600,borderRadius:9,border:`1px solid ${C.border}`,background:C.white,color:'#374151',cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:6}}>
                    <span style={{width:20,height:20,borderRadius:5,background:C.blue,color:C.white,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{p.icon}</span>
                    <div>
                      <div style={{fontSize:11,fontWeight:700}}>{p.label}</div>
                      <div style={{fontSize:10,color:C.gray}}>{p.rate}% / {parseInt(p.term)/12}yr</div>
                    </div>
                  </button>
                ))}
              </div>

              <div style={{marginBottom:14}}>
                <label style={lbl}>Loan Amount</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:14,pointerEvents:'none'}}>$</span>
                  <input style={{...inp,paddingLeft:28}} type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)}/>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
                <div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <label style={{...lbl,marginBottom:0}}>Interest Rate</label>
                    <span style={{fontSize:14,fontWeight:700,color:C.blue}}>{rate}%</span>
                  </div>
                  <input type="range" min="0.1" max="36" step="0.1" value={rate} onChange={e=>setRate(e.target.value)} style={{width:'100%',accentColor:C.blue}}/>
                </div>
                <div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <label style={{...lbl,marginBottom:0}}>Term</label>
                    <span style={{fontSize:14,fontWeight:700,color:C.blue}}>{Math.floor(parseInt(term)||0)}mo</span>
                  </div>
                  <input type="range" min="6" max="360" step="6" value={term} onChange={e=>setTerm(e.target.value)} style={{width:'100%',accentColor:C.blue}}/>
                </div>
              </div>
              <div style={{display:'flex',gap:4,marginBottom:14,flexWrap:'wrap'}}>
                {[['12','1yr'],['24','2yr'],['36','3yr'],['48','4yr'],['60','5yr'],['84','7yr'],['120','10yr'],['180','15yr']].map(([v,l])=>(
                  <button key={v} onClick={()=>setTerm(v)} style={{padding:'4px 10px',fontSize:11,fontWeight:600,borderRadius:6,border:`1px solid ${term===v?C.blue:C.border}`,background:term===v?C.blue:C.white,color:term===v?C.white:'#374151',cursor:'pointer'}}>{l}</button>
                ))}
              </div>

              <div style={{marginBottom:14}}>
                <label style={lbl}>Extra Monthly Payment</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:14,pointerEvents:'none'}}>$</span>
                  <input style={{...inp,paddingLeft:28}} type="number" min="0" value={extra||''} onChange={e=>setExtra(e.target.value)}/>
                </div>
              </div>

              <div>
                <label style={lbl}>Origination Fee</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:14,pointerEvents:'none'}}>$</span>
                  <input style={{...inp,paddingLeft:28}} type="number" min="0" value={origFee||''} onChange={e=>setOrigFee(e.target.value)}/>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {res&&(
              <>
                <div style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)',borderRadius:16,padding:20,color:C.white,marginBottom:16,boxShadow:'0 8px 32px rgba(37,99,235,.25), 0 2px 8px rgba(0,0,0,.1)'}}>
                  <p style={{fontSize:11,fontWeight:600,letterSpacing:'.1em',color:'#93c5fd',margin:'0 0 4px',textTransform:'uppercase'}}>Monthly Payment</p>
                  <div style={{fontSize:48,fontWeight:700,lineHeight:1,margin:'0 0 4px'}}>{fmtDec(res.totalPayment)}</div>
                  {parseFloat(extra)>0&&<p style={{color:'#86efac',fontSize:12,margin:'0 0 12px'}}>Base: {fmtDec(res.payment)} + Extra: {fmtDec(parseFloat(extra)||0)}</p>}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:12}}>
                    {[
                      ['Total Interest',fmtD(res.totalInterest)],
                      ['Total Cost',fmtD(res.totalCost)],
                      ['Payoff',`${Math.floor(res.actualMonths/12)}yr ${res.actualMonths%12}mo`],
                    ].map(([l,v])=>(
                      <div key={l} style={{background:'rgba(255,255,255,.12)',borderRadius:10,padding:'10px 12px'}}>
                        <p style={{fontSize:11,color:'#93c5fd',margin:'0 0 2px'}}>{l}</p>
                        <p style={{fontSize:13,fontWeight:700,margin:0}}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {parseFloat(extra)>0&&res.monthsSaved>0&&(
                  <div style={{...card,background:'#f0fdf4',border:'1px solid #86efac'}}>
                    <p style={{fontSize:13,fontWeight:700,color:'#166534',margin:'0 0 4px'}}>Extra payment saves you</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                      <div style={{textAlign:'center'}}>
                        <p style={{fontSize:22,fontWeight:700,color:'#16a34a',margin:0}}>{res.monthsSaved} months</p>
                        <p style={{fontSize:11,color:'#15803d',margin:'2px 0 0'}}>paid off sooner</p>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <p style={{fontSize:22,fontWeight:700,color:'#16a34a',margin:0}}>{fmtD(parseFloat(extra)*(res.monthsSaved))}</p>
                        <p style={{fontSize:11,color:'#15803d',margin:'2px 0 0'}}>in interest saved</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment breakdown bar */}
                <div style={{...card}}>
                  <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Payment Breakdown</p>
                  {[
                    {label:'Loan Principal',amount:parseFloat(amount.replace(/,/g,''))||0,color:'#2563eb'},
                    {label:'Total Interest',amount:res.totalInterest,color:'#ef4444'},
                    ...(parseFloat(origFee)>0?[{label:'Origination Fee',amount:parseFloat(origFee)||0,color:'#f59e0b'}]:[]),
                  ].map(({label,amount:amt,color})=>{
                    const pct=res.totalCost>0?(amt/res.totalCost*100):0;
                    return(
                      <div key={label} style={{marginBottom:10}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                          <span style={{fontSize:13,color:'#374151',fontWeight:500}}>{label}</span>
                          <div><span style={{fontSize:13,fontWeight:700,color:'#111827'}}>{fmtD(amt)}</span><span style={{fontSize:11,color:'#9ca3af',marginLeft:6}}>{pct.toFixed(1)}%</span></div>
                        </div>
                        <div style={{height:8,borderRadius:4,background:'#f1f5f9',overflow:'hidden'}}>
                          <div style={{width:pct+'%',height:'100%',background:color,borderRadius:4}}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tabs */}
                <div style={{display:'flex',gap:4,background:'#f1f5f9',borderRadius:12,padding:4,marginBottom:16}}>
                  {(['summary','amortization','compare'] as const).map(t=>(
                    <button key={t} onClick={()=>setTab(t)} style={{...btnBase,borderRadius:9,background:tab===t?C.white:'transparent',color:tab===t?C.blue:C.gray,boxShadow:tab===t?'0 1px 3px rgba(0,0,0,.1)':'none',fontSize:13}}>
                      {t==='summary'?'Summary':t==='amortization'?'Schedule':'Compare Terms'}
                    </button>
                  ))}
                </div>

                {tab==='summary'&&(
                  <div style={{...card}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Loan Summary</p>
                    {[
                      ['Loan Amount',fmtD(parseFloat(amount.replace(/,/g,''))||0),'#374151'],
                      ['Annual Rate',rate+'%','#374151'],
                      ['Term',`${parseInt(term)} months (${(parseInt(term)/12).toFixed(1)} years)`,'#374151'],
                      ['Monthly Payment',fmtDec(res.payment),'#2563eb'],
                      ['Total of Payments',fmtD(res.payment*parseInt(term)),'#374151'],
                      ['Total Interest',fmtD(res.totalInterest),'#dc2626'],
                      ['Total Cost',fmtD(res.totalCost),'#111827'],
                    ].map(([l,v,c])=>(
                      <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:`1px solid #f3f4f6`}}>
                        <span style={{fontSize:13,color:'#6b7280'}}>{l}</span>
                        <span style={{fontSize:13,fontWeight:700,color:c}}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tab==='amortization'&&(
                  <div style={{...card}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Amortization Schedule</p>
                    <div style={{overflowX:'auto'}}>
                      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                        <thead>
                          <tr style={{background:'#f8fafc'}}>
                            {['Mo','Payment','Principal','Interest','Balance'].map(h=>(
                              <th key={h} style={{padding:'7px 8px',textAlign:'right',color:'#374151',fontWeight:700,borderBottom:`1px solid ${C.border}`,whiteSpace:'nowrap'}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {res.rows.filter((_,i)=>res.rows.length<=24||(i)%Math.ceil(res.rows.length/24)===0||i===res.rows.length-1).map((row,i)=>(
                            <tr key={row.month} style={{borderBottom:`1px solid #f3f4f6`,background:i%2===0?C.white:'#fafafa'}}>
                              <td style={{padding:'6px 8px',color:'#374151',fontWeight:600,textAlign:'right'}}>{row.month}</td>
                              <td style={{padding:'6px 8px',fontWeight:600,color:'#111827',textAlign:'right'}}>{fmtDec(row.payment)}</td>
                              <td style={{padding:'6px 8px',color:'#2563eb',textAlign:'right'}}>{fmtDec(row.principal)}</td>
                              <td style={{padding:'6px 8px',color:'#dc2626',textAlign:'right'}}>{fmtDec(row.interest)}</td>
                              <td style={{padding:'6px 8px',color:'#374151',textAlign:'right'}}>{fmtD(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {tab==='compare'&&(
                  <div style={{...card}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Compare Loan Terms</p>
                    {[36,48,60,72,84,120].map(months=>{
                      const r=compute(parseFloat(amount.replace(/,/g,''))||0,parseFloat(rate)||0,months,0,0);
                      const isSelected=months===parseInt(term);
                      if(!r)return null;
                      return(
                        <div key={months} onClick={()=>setTerm(String(months))} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,padding:'10px 12px',borderRadius:10,marginBottom:6,border:`1px solid ${isSelected?C.blue:C.border}`,background:isSelected?'#eff6ff':C.white,cursor:'pointer'}}>
                          <div><p style={{fontSize:11,color:C.gray,margin:'0 0 2px'}}>Term</p><p style={{fontSize:13,fontWeight:700,color:isSelected?C.blue:'#111827',margin:0}}>{months}mo ({(months/12).toFixed(0)}yr)</p></div>
                          <div><p style={{fontSize:11,color:C.gray,margin:'0 0 2px'}}>Payment</p><p style={{fontSize:13,fontWeight:700,color:'#111827',margin:0}}>{fmtDec(r.payment)}</p></div>
                          <div><p style={{fontSize:11,color:C.gray,margin:'0 0 2px'}}>Total Interest</p><p style={{fontSize:13,fontWeight:700,color:'#dc2626',margin:0}}>{fmtD(r.totalInterest)}</p></div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p style={{fontSize:11,color:'#9ca3af',marginTop:8}}>Estimates only. Actual loan terms vary by lender. Not financial advice.</p>
              </>
            )}
          </div>
        </div>

        <div style={{background:'linear-gradient(135deg,#eff6ff,#eef2ff)',borderRadius:16,padding:20,border:'1px solid #bfdbfe',marginTop:20}}>
          <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:12}}>Related Calculators</p>
          <p style={{fontSize:13,color:'#64748b',marginBottom:16}}>Tools that work great alongside this one</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10}}>\n            {[['/mortgage','Mortgage Calculator','Full mortgage payment breakdown with amortization'], ['/compound-interest','Compound Interest','Compare loan interest vs investment returns'], ['/salary','Salary Calculator','Know your take-home pay to plan loan payments'], ['/percentage','Percentage Calculator','Quick interest rate and payment calculations']].map(([href,name,desc])=>(\n              <a key={href} href={href} style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}><span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>{name} →</span><span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>{desc}</span></a>\n            ))}</div>\n        </div>\n        <div style={{marginTop:20}}>\n          <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:12}}>All freecalcs.io Calculators</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {ALL_CALCS.map(([href,name])=>(<a key={href} href={href} style={{background:C.white,fontSize:13,color:C.blue,fontWeight:500,padding:'8px 16px',borderRadius:10,border:'1px solid #bfdbfe',textDecoration:'none'}}>{name}</a>))}
          </div>
        </div>
      </div>
    </div>
  );
}