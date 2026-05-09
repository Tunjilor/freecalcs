// @ts-nocheck
'use client';
import { useState, useEffect, useCallback } from 'react';


const C = { blue:'#2563eb', darkBlue:'#0f172a', gray:'#6b7280', border:'#e2e8f0', white:'#ffffff', light:'#f8fafc', text:'#111827', accent:'#7c3aed', emerald:'#059669' };
const card: React.CSSProperties = { background:'rgba(255,255,255,0.85)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderRadius:20, padding:24, boxShadow:'0 4px 24px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)', border:'1px solid rgba(226,232,240,0.8)', marginBottom:20, transition:'all 0.3s ease' };
const inp: React.CSSProperties  = { width:'100%', border:'1.5px solid #e2e8f0', borderRadius:12, padding:'12px 14px', fontSize:15, outline:'none', background:'#f8fafc', boxSizing:'border-box', color:'#111827', fontWeight:600, transition:'all 0.2s ease', letterSpacing:'-0.01em' };
const lbl: React.CSSProperties  = { display:'block', fontSize:12, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 } as React.CSSProperties;
const btnBase: React.CSSProperties = { flex:1, padding:'10px 0', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', transition:'all .15s' };

const FREQ_OPTIONS = [
  { key:'annually',    label:'Annually',     n:1  },
  { key:'semiannually',label:'Semi-Annually', n:2  },
  { key:'quarterly',   label:'Quarterly',    n:4  },
  { key:'monthly',     label:'Monthly',      n:12 },
  { key:'weekly',      label:'Weekly',       n:52 },
  { key:'daily',       label:'Daily',        n:365},
];

const CONTRIB_FREQ = [
  { key:'monthly',  label:'Monthly',   factor:12 },
  { key:'annually', label:'Annually',  factor:1  },
];

const ALL_CALCS = [
  ['/mortgage','Mortgage Calculator'],['/qualify','Mortgage Qualifier'],['/rent-vs-buy','Rent vs Buy'],
  ['/loan','Loan & EMI'],['/salary','Salary Calculator'],['/tax','Income Tax'],
  ['/percentage','Percentage Calc'],['/bmi','BMI Calculator'],['/tdee','TDEE & Calories'],
  ['/age','Age Calculator'],['/tip','Tip Calculator'],
];

interface YearRow { year:number; balance:number; principal:number; interest:number; contributions:number; }

function compute(
  principal:number, rate:number, years:number, compoundN:number,
  contrib:number, contribN:number, inflation:boolean, inflationRate:number
):{finalBalance:number; totalPrincipal:number; totalContributions:number; totalInterest:number; rows:YearRow[]; rule72:number;} {
  if(!principal && !contrib) return {finalBalance:0,totalPrincipal:0,totalContributions:0,totalInterest:0,rows:[],rule72:0};
  const r = rate/100;
  const rows:YearRow[] = [];
  let balance = principal;
  const annualContrib = contrib * contribN;

  for(let y=1; y<=years; y++){
    // Compound interest: A = P(1 + r/n)^(nt)
    const startBalance = balance;
    balance = balance * Math.pow(1 + r/compoundN, compoundN);
    // Add contributions compounded for the year
    if(annualContrib > 0){
      // FV of annuity (monthly contributions)
      if(contribN === 12){
        const monthlyRate = r/12;
        const fvAnnuity = contrib * ((Math.pow(1+monthlyRate,12)-1)/monthlyRate);
        balance += fvAnnuity;
      } else {
        balance += annualContrib;
      }
    }
    const yearInterest = balance - startBalance - annualContrib;
    rows.push({
      year: y,
      balance: inflation ? balance/Math.pow(1+inflationRate/100,y) : balance,
      principal: principal,
      interest: rows.length>0 ? (rows[rows.length-1].interest + Math.max(0,yearInterest)) : Math.max(0,yearInterest),
      contributions: annualContrib*y,
    });
  }

  const finalBalance = rows[rows.length-1]?.balance || 0;
  const totalContributions = annualContrib * years;
  const totalPrincipal = principal;
  const totalInterest = finalBalance - totalPrincipal - totalContributions;
  const rule72 = rate > 0 ? 72/rate : 0;

  return {finalBalance, totalPrincipal, totalContributions, totalInterest:Math.max(0,totalInterest), rows, rule72};
}

function fmtD(n:number){return '$'+Math.round(n).toLocaleString('en-US');}
function fmtDec(n:number){return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}

export default function CompoundInterestCalculator(){
  const [principal, setPrincipal]     = useState('10000');
  const [rate, setRate]               = useState('7');
  const [years, setYears]             = useState('20');
  const [compoundFreq, setCompFreq]   = useState('monthly');
  const [contrib, setContrib]         = useState('200');
  const [contribFreq, setContribFreq] = useState('monthly');
  const [inflation, setInflation]     = useState(false);
  const [inflationRate, setInflRate]  = useState('3');
  const [tab, setTab]                 = useState<'chart'|'table'|'compare'>('chart');
  const [showTable, setShowTable]     = useState(false);

  interface Result { finalBalance:number; totalPrincipal:number; totalContributions:number; totalInterest:number; rows:YearRow[]; rule72:number; }
  const [res, setRes] = useState<Result|null>(null);
  const [res2, setRes2] = useState<Result|null>(null);
  const [copied, setCopied] = useState(false);

  // Load from URL params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const p = sp.get('principal'); if (p) setPrincipal(p);
    const r = sp.get('rate'); if (r) setRate(r);
    const y = sp.get('years'); if (y) setYears(y);
    const f = sp.get('freq'); if (f) setCompFreq(f);
    const c = sp.get('contrib'); if (c) setContrib(c);
    const cf = sp.get('contribFreq'); if (cf) setContribFreq(cf);
    const inf = sp.get('inflation'); if (inf === 'true') setInflation(true);
    const ir = sp.get('inflationRate'); if (ir) setInflRate(ir);
  }, []);

  // Share function
  const shareCalc = () => {
    const params = new URLSearchParams({
      principal, rate, years, freq: compoundFreq, contrib, contribFreq,
      ...(inflation ? { inflation: 'true', inflationRate } : {})
    });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    window.history.replaceState({}, '', '?' + params.toString());
  };

  const run = useCallback(()=>{
    const p=parseFloat(principal.replace(/,/g,''))||0;
    const r=parseFloat(rate)||0;
    const y=parseInt(years)||0;
    const cf=FREQ_OPTIONS.find(f=>f.key===compoundFreq)?.n||12;
    const c=parseFloat(contrib.replace(/,/g,''))||0;
    const cFreq=CONTRIB_FREQ.find(f=>f.key===contribFreq)?.factor||12;
    const ir=parseFloat(inflationRate)||3;
    setRes(compute(p,r,y,cf,c,cFreq,inflation,ir));
    // Compare: no contributions version
    setRes2(compute(p,r,y,cf,0,12,inflation,ir));
  },[principal,rate,years,compoundFreq,contrib,contribFreq,inflation,inflationRate]);

  useEffect(()=>{run();},[run]);

  // Simple bar chart using divs
  const BarChart = ()=>{
    if(!res||!res.rows.length) return null;
    const maxBal = Math.max(...res.rows.map(r=>r.balance));
    const showEvery = res.rows.length > 20 ? Math.ceil(res.rows.length/20) : 1;
    const displayRows = res.rows.filter((_,i)=>(i+1)%showEvery===0||i===res.rows.length-1);
    return(
      <div>
        <div style={{display:'flex',alignItems:'flex-end',gap:2,height:180,padding:'0 4px'}}>
          {displayRows.map(row=>{
            const heightPct = (row.balance/maxBal)*100;
            const principalPct = (res.totalPrincipal/row.balance)*100;
            const contribPct = Math.min(100-principalPct,(res.totalContributions/row.balance)*100);
            const interestPct = Math.max(0,100-principalPct-contribPct);
            return(
              <div key={row.year} style={{flex:1,height:heightPct+'%',display:'flex',flexDirection:'column-reverse',borderRadius:'3px 3px 0 0',overflow:'hidden',minWidth:4}} title={`Year ${row.year}: ${fmtD(row.balance)}`}>
                <div style={{height:principalPct+'%',background:'#2563eb'}}></div>
                <div style={{height:contribPct+'%',background:'#60a5fa'}}></div>
                <div style={{height:interestPct+'%',background:'#10b981'}}></div>
              </div>
            );
          })}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#9ca3af',marginTop:4}}>
          <span>Year 1</span><span>Year {res.rows.length}</span>
        </div>
        <div style={{display:'flex',gap:16,marginTop:10,flexWrap:'wrap'}}>
          {[['#2563eb','Principal'],['#60a5fa','Contributions'],['#10b981','Interest Earned']].map(([color,label])=>(
            <div key={label} style={{display:'flex',alignItems:'center',gap:5}}>
              <span style={{width:10,height:10,borderRadius:2,background:color,flexShrink:0}}></span>
              <span style={{fontSize:11,color:'#374151'}}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif',background:'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)',minHeight:'100vh'}}>
      <style>{`html{scroll-behavior:smooth;} @media(max-width:680px){.ci-grid{grid-template-columns:1fr!important;}} input[type=range]{width:100%;accent-color:#2563eb;}`}</style>

      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)',color:C.white,padding:'32px 16px 40px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:28,fontWeight:700,margin:'12px 0 8px',color:C.white}}>Compound Interest Calculator</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 16px'}}>See how your money grows over time with compound interest. Compare frequencies, add contributions, and adjust for inflation.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Growth Chart','Amortization Table','Contribution Impact','Rule of 72','Inflation Adjusted'].map(t=>(
              <span key={t} style={{background:'rgba(255,255,255,.15)',fontSize:12,padding:'4px 12px',borderRadius:20,color:C.white}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(0,3fr)',gap:20}} className="ci-grid">

          {/* LEFT */}
          <div>
            <div style={{...card}}>
              <div style={{marginBottom:14}}>
                <label style={lbl}>Initial Investment</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:14,pointerEvents:'none'}}>$</span>
                  <input style={{...inp,paddingLeft:28}} type="number" min="0" value={principal} onChange={e=>setPrincipal(e.target.value)}/>
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                  <label style={{...lbl,marginBottom:0}}>Annual Interest Rate</label>
                  <span style={{fontSize:16,fontWeight:700,color:C.blue}}>{rate}%</span>
                </div>
                <input type="range" min="0.1" max="30" step="0.1" value={rate} onChange={e=>setRate(e.target.value)} style={{width:'100%'}}/>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#9ca3af'}}>
                  <span>0.1%</span><span style={{color:'#374151',fontSize:11}}>S&P avg: ~10% | HYSA: ~4.5%</span><span>30%</span>
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                  <label style={{...lbl,marginBottom:0}}>Time Period</label>
                  <span style={{fontSize:16,fontWeight:700,color:C.blue}}>{years} yrs</span>
                </div>
                <input type="range" min="1" max="50" step="1" value={years} onChange={e=>setYears(e.target.value)} style={{width:'100%'}}/>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#9ca3af'}}><span>1 yr</span><span>50 yrs</span></div>
              </div>

              <div style={{marginBottom:14}}>
                <label style={lbl}>Compound Frequency</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5}}>
                  {FREQ_OPTIONS.map(f=>(
                    <button key={f.key} onClick={()=>setCompFreq(f.key)} style={{padding:'7px 4px',fontSize:11,fontWeight:600,borderRadius:8,border:`1px solid ${compoundFreq===f.key?C.blue:C.border}`,background:compoundFreq===f.key?C.blue:C.white,color:compoundFreq===f.key?C.white:'#374151',cursor:'pointer'}}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <label style={lbl}>Monthly Contribution</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:14,pointerEvents:'none'}}>$</span>
                  <input style={{...inp,paddingLeft:28}} type="number" min="0" value={contrib} onChange={e=>setContrib(e.target.value)}/>
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <label style={lbl}>Contribution Frequency</label>
                <div style={{display:'flex',borderRadius:10,overflow:'hidden',border:`1px solid ${C.border}`}}>
                  {CONTRIB_FREQ.map(f=>(
                    <button key={f.key} onClick={()=>setContribFreq(f.key)} style={{...btnBase,background:contribFreq===f.key?C.blue:C.white,color:contribFreq===f.key?C.white:C.gray,borderRadius:0}}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#f8fafc',borderRadius:10,border:`1px solid ${C.border}`}}>
                <input type="checkbox" id="inflation" checked={inflation} onChange={e=>setInflation(e.target.checked)} style={{width:16,height:16,accentColor:C.blue}}/>
                <label htmlFor="inflation" style={{fontSize:13,color:'#374151',cursor:'pointer',flex:1}}>Adjust for inflation</label>
                {inflation&&(
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <input type="number" min="0" max="20" step="0.1" value={inflationRate} onChange={e=>setInflRate(e.target.value)} style={{...inp,width:60,padding:'4px 8px',textAlign:'center'}}/>
                    <span style={{fontSize:12,color:'#374151'}}>%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rule of 72 */}
            {res&&res.rule72>0&&(
              <div style={{...card,background:'linear-gradient(135deg,#eff6ff,#eef2ff,#f0fdf4)',border:'1px solid #bfdbfe',boxShadow:'0 2px 12px rgba(37,99,235,.08)'}}>
                <p style={{fontSize:12,fontWeight:700,color:'#1e40af',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 6px'}}>Rule of 72</p>
                <p style={{fontSize:22,fontWeight:700,color:C.blue,margin:'0 0 4px'}}>{res.rule72.toFixed(1)} years</p>
                <p style={{fontSize:12,color:'#374151',margin:0}}>to double your money at {rate}% annual return (72 / {rate} = {res.rule72.toFixed(1)})</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {res&&(
              <>
                {/* Hero */}
                <div style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)',borderRadius:16,padding:20,color:C.white,marginBottom:16,boxShadow:'0 4px 20px rgba(37,99,235,.3)'}}>
                  <p style={{fontSize:11,fontWeight:600,letterSpacing:'.1em',color:'#93c5fd',margin:'0 0 4px',textTransform:'uppercase'}}>Future Value after {years} Years</p>
                  <div style={{fontSize:48,fontWeight:800,lineHeight:1,letterSpacing:'-0.02em',margin:'0 0 4px'}}>{fmtD(res.finalBalance)}</div>
                  {inflation&&<p style={{color:'#93c5fd',fontSize:12,margin:'0 0 12px'}}>Inflation-adjusted value</p>}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:12}}>
                    {[
                      ['Principal',fmtD(res.totalPrincipal),'#93c5fd'],
                      ['Contributions',fmtD(res.totalContributions),'#93c5fd'],
                      ['Interest Earned',fmtD(res.totalInterest),'#86efac'],
                    ].map(([l,v,c])=>(
                      <div key={l} style={{background:'rgba(255,255,255,.15)',backdropFilter:'blur(8px)',borderRadius:14,padding:'14px 16px',border:'1px solid rgba(255,255,255,.1)'}}>
                        <p style={{fontSize:11,color:c,margin:'0 0 2px'}}>{l}</p>
                        <p style={{fontSize:14,fontWeight:700,margin:0}}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donut-style breakdown */}
                <div style={{...card,marginBottom:16}}>
                  <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Breakdown</p>
                  {res.finalBalance>0&&[
                    {label:'Principal',amount:res.totalPrincipal,color:'#2563eb'},
                    {label:'Contributions',amount:res.totalContributions,color:'#60a5fa'},
                    {label:'Interest Earned',amount:res.totalInterest,color:'#10b981'},
                  ].map(({label,amount,color})=>{
                    const pct=res.finalBalance>0?(amount/res.finalBalance*100):0;
                    return(
                      <div key={label} style={{marginBottom:10}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                          <span style={{fontSize:13,color:'#374151',fontWeight:500}}>{label}</span>
                          <div>
                            <span style={{fontSize:13,fontWeight:700,color:'#111827'}}>{fmtD(amount)}</span>
                            <span style={{fontSize:11,color:'#9ca3af',marginLeft:6}}>{pct.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div style={{height:8,borderRadius:4,background:'#f1f5f9',overflow:'hidden'}}>
                          <div style={{width:pct+'%',height:'100%',background:color,borderRadius:4,transition:'width .4s'}}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tabs */}
                <div style={{display:'flex',gap:4,background:'#f1f5f9',borderRadius:14,padding:5,boxShadow:'inset 0 1px 2px rgba(0,0,0,.06)',marginBottom:16}}>
                  {(['chart','table','compare'] as const).map(t=>(
                    <button key={t} onClick={()=>setTab(t)} style={{...btnBase,borderRadius:9,background:tab===t?C.white:'transparent',color:tab===t?C.blue:C.gray,boxShadow:tab===t?'0 1px 3px rgba(0,0,0,.1)':'none',fontSize:13}}>
                      {t==='chart'?'Growth Chart':t==='table'?'Year-by-Year':'With vs Without'}
                    </button>
                  ))}
                </div>

                {/* CHART TAB */}
                {tab==='chart'&&(
                  <div style={{...card}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 14px'}}>Balance Growth Over Time</p>
                    <BarChart/>
                    <div style={{marginTop:16,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      {[
                        {label:'After 5 yrs',row:res.rows[Math.min(4,res.rows.length-1)]},
                        {label:'After 10 yrs',row:res.rows[Math.min(9,res.rows.length-1)]},
                        {label:'After 20 yrs',row:res.rows[Math.min(19,res.rows.length-1)]},
                        {label:`After ${years} yrs`,row:res.rows[res.rows.length-1]},
                      ].filter(x=>x.row).map(({label,row})=>(
                        <div key={label} style={{background:'#f8fafc',borderRadius:10,padding:'10px 12px',border:`1px solid ${C.border}`}}>
                          <p style={{fontSize:11,color:'#6b7280',margin:'0 0 2px'}}>{label}</p>
                          <p style={{fontSize:15,fontWeight:700,color:'#111827',margin:0}}>{fmtD(row.balance)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TABLE TAB */}
                {tab==='table'&&(
                  <div style={{...card}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Year-by-Year Breakdown</p>
                    <div style={{overflowX:'auto'}}>
                      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                        <thead>
                          <tr style={{background:'#f8fafc'}}>
                            {['Year','Balance','Interest (Cumul.)','Contributions (Cumul.)'].map(h=>(
                              <th key={h} style={{padding:'8px 10px',textAlign:'right',color:'#374151',fontWeight:700,borderBottom:`1px solid ${C.border}`,whiteSpace:'nowrap'}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {res.rows.filter((_,i)=>res.rows.length<=20||(i+1)%Math.ceil(res.rows.length/20)===0||i===res.rows.length-1).map((row,i)=>(
                            <tr key={row.year} style={{borderBottom:`1px solid #f3f4f6`,background:i%2===0?C.white:'#fafafa'}}>
                              <td style={{padding:'7px 10px',color:'#374151',fontWeight:600,textAlign:'right'}}>{row.year}</td>
                              <td style={{padding:'7px 10px',color:'#111827',fontWeight:700,textAlign:'right'}}>{fmtD(row.balance)}</td>
                              <td style={{padding:'7px 10px',color:'#10b981',fontWeight:600,textAlign:'right'}}>{fmtD(row.interest)}</td>
                              <td style={{padding:'7px 10px',color:'#2563eb',textAlign:'right'}}>{fmtD(row.contributions)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* COMPARE TAB */}
                {tab==='compare'&&res2&&(
                  <div style={{...card}}>
                    <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Impact of Adding Contributions</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                      {[
                        {label:'With Contributions',val:res.finalBalance,color:C.blue,contrib:true},
                        {label:'Principal Only',val:res2.finalBalance,color:'#6b7280',contrib:false},
                      ].map(({label,val,color})=>(
                        <div key={label} style={{padding:14,borderRadius:12,border:`1px solid ${color==='#6b7280'?C.border:C.blue}`,background:color===C.blue?'#eff6ff':C.white,textAlign:'center'}}>
                          <p style={{fontSize:11,fontWeight:600,color,textTransform:'uppercase',letterSpacing:'.04em',margin:'0 0 6px'}}>{label}</p>
                          <p style={{fontSize:22,fontWeight:700,color:'#111827',margin:0}}>{fmtD(val)}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{padding:14,background:'#f0fdf4',borderRadius:12,border:'1px solid #86efac',textAlign:'center'}}>
                      <p style={{fontSize:13,color:'#166534',margin:'0 0 4px'}}>Your contributions add</p>
                      <p style={{fontSize:24,fontWeight:700,color:'#16a34a',margin:'0 0 4px'}}>{fmtD(res.finalBalance-res2.finalBalance)}</p>
                      <p style={{fontSize:12,color:'#15803d',margin:0}}>to your final balance vs. investing {fmtD(parseFloat(principal.replace(/,/g,''))||0)} alone</p>
                    </div>

                    <div style={{marginTop:16}}>
                      <p style={{fontSize:12,fontWeight:700,color:'#111827',margin:'0 0 10px'}}>Compounding Frequency Comparison (same rate, {years} years)</p>
                      {FREQ_OPTIONS.map(f=>{
                        const p=parseFloat(principal.replace(/,/g,''))||0;
                        const r=parseFloat(rate)||0;
                        const y=parseInt(years)||0;
                        const result = compute(p,r,y,f.n,0,12,false,3);
                        const isSelected = f.key===compoundFreq;
                        return(
                          <div key={f.key} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',borderRadius:8,marginBottom:4,background:isSelected?'#eff6ff':C.white,border:`1px solid ${isSelected?C.blue:C.border}`}}>
                            <span style={{fontSize:13,fontWeight:isSelected?700:400,color:isSelected?C.blue:'#374151'}}>{f.label}</span>
                            <span style={{fontSize:13,fontWeight:700,color:'#111827'}}>{fmtD(result.finalBalance)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p style={{fontSize:11,color:'#9ca3af',marginTop:8}}>Results are estimates. Past returns do not guarantee future results. Not financial advice.</p>
              </>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginTop:40}} className="ci-faq">
          <style>{`.ci-faq{} @media(max-width:600px){.ci-faq{grid-template-columns:1fr!important;}}`}</style>
          <div style={{...card}}>
            <h2 style={{fontSize:16,fontWeight:700,color:'#111827',marginBottom:12}}>How Compound Interest Works</h2>
            <p style={{fontSize:13,color:'#374151',lineHeight:1.6,margin:'0 0 10px'}}>Compound interest earns interest on both your initial principal AND on the interest you have already earned. This creates exponential growth over time.</p>
            <p style={{fontSize:13,color:'#374151',lineHeight:1.6,margin:'0 0 8px'}}><strong>Formula:</strong> A = P(1 + r/n)^(nt)</p>
            <p style={{fontSize:12,color:'#6b7280',margin:0}}>Where P = principal, r = annual rate, n = compounds per year, t = years</p>
          </div>
          <div style={{...card}}>
            <h2 style={{fontSize:16,fontWeight:700,color:'#111827',marginBottom:12}}>Compound Frequency Impact</h2>
            <p style={{fontSize:13,color:'#374151',lineHeight:1.6,margin:'0 0 10px'}}>The more frequently interest compounds, the more you earn. Daily compounding yields slightly more than monthly, which yields more than annually.</p>
            <p style={{fontSize:13,color:'#374151',lineHeight:1.6,margin:0}}>For most savings accounts and investments, monthly or daily compounding is standard. The difference between monthly and daily on typical balances is small.</p>
          </div>
        </div>

        {/* All Calculators */}
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