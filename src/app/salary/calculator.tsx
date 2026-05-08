'use client';
import { useState, useEffect, useCallback } from 'react';

const FEDERAL_BRACKETS: Record<string, [number,number,number][]> = {
  single:      [[0,12400,.10],[12400,50000,.12],[50000,100525,.22],[100525,197300,.24],[197300,250525,.32],[250525,626350,.35],[626350,Infinity,.37]],
  married:     [[0,24800,.10],[24800,100000,.12],[100000,201050,.22],[201050,394600,.24],[394600,501050,.32],[501050,751600,.35],[751600,Infinity,.37]],
  married_sep: [[0,12400,.10],[12400,50000,.12],[50000,100525,.22],[100525,197300,.24],[197300,250525,.32],[250525,375800,.35],[375800,Infinity,.37]],
  hoh:         [[0,18750,.10],[18750,63100,.12],[63100,100500,.22],[100500,197300,.24],[197300,250500,.32],[250500,626350,.35],[626350,Infinity,.37]],
};
const STD_DED: Record<string,number> = {single:16100,married:32200,married_sep:16100,hoh:24150};
const STATES: Record<string,{rate:number;name:string;notax?:boolean}> = {
  AL:{rate:.05,name:'Alabama'},AK:{rate:0,name:'Alaska',notax:true},AZ:{rate:.025,name:'Arizona'},
  AR:{rate:.039,name:'Arkansas'},CA:{rate:.093,name:'California'},CO:{rate:.044,name:'Colorado'},
  CT:{rate:.065,name:'Connecticut'},DE:{rate:.066,name:'Delaware'},FL:{rate:0,name:'Florida',notax:true},
  GA:{rate:.055,name:'Georgia'},HI:{rate:.08,name:'Hawaii'},ID:{rate:.058,name:'Idaho'},
  IL:{rate:.0495,name:'Illinois'},IN:{rate:.0305,name:'Indiana'},IA:{rate:.057,name:'Iowa'},
  KS:{rate:.057,name:'Kansas'},KY:{rate:.04,name:'Kentucky'},LA:{rate:.03,name:'Louisiana'},
  ME:{rate:.075,name:'Maine'},MD:{rate:.0575,name:'Maryland'},MA:{rate:.05,name:'Massachusetts'},
  MI:{rate:.0425,name:'Michigan'},MN:{rate:.0985,name:'Minnesota'},MS:{rate:.05,name:'Mississippi'},
  MO:{rate:.048,name:'Missouri'},MT:{rate:.059,name:'Montana'},NE:{rate:.0664,name:'Nebraska'},
  NV:{rate:0,name:'Nevada',notax:true},NH:{rate:0,name:'New Hampshire',notax:true},NJ:{rate:.0897,name:'New Jersey'},
  NM:{rate:.059,name:'New Mexico'},NY:{rate:.109,name:'New York'},NC:{rate:.045,name:'North Carolina'},
  ND:{rate:.025,name:'North Dakota'},OH:{rate:.035,name:'Ohio'},OK:{rate:.0475,name:'Oklahoma'},
  OR:{rate:.099,name:'Oregon'},PA:{rate:.0307,name:'Pennsylvania'},RI:{rate:.0599,name:'Rhode Island'},
  SC:{rate:.064,name:'South Carolina'},SD:{rate:0,name:'South Dakota',notax:true},TN:{rate:0,name:'Tennessee',notax:true},
  TX:{rate:0,name:'Texas',notax:true},UT:{rate:.0465,name:'Utah'},VT:{rate:.0875,name:'Vermont'},
  VA:{rate:.0575,name:'Virginia'},WA:{rate:0,name:'Washington',notax:true},WV:{rate:.065,name:'West Virginia'},
  WI:{rate:.0765,name:'Wisconsin'},WY:{rate:0,name:'Wyoming',notax:true},DC:{rate:.109,name:'Washington D.C.'},
};
const FREQS: Record<string,{label:string;periods:number}> = {
  annual:{label:'Annually',periods:1},monthly:{label:'Monthly',periods:12},
  semimonthly:{label:'Semi-Monthly',periods:24},biweekly:{label:'Bi-Weekly',periods:26},weekly:{label:'Weekly',periods:52},
};

function fmt(n:number,d=0){return n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});}
function fmtD(n:number){return '$'+fmt(Math.abs(n),2);}
function parseMoney(s:string){return parseFloat(s.replace(/[^0-9.]/g,''))||0;}
function fmtInput(s:string){
  const raw=s.replace(/[^0-9.]/g,'');const parts=raw.split('.');
  parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
  return parts.length>1?parts[0]+'.'+parts[1]:parts[0];
}
interface Res{gross:number;fed:number;stateTax:number;ss:number;medicare:number;addlMed:number;preTax:number;postTax:number;net:number;effRate:number;margRate:number;}
function calcFed(income:number,filing:string):number{
  const b=FEDERAL_BRACKETS[filing]||FEDERAL_BRACKETS.single;let t=0;
  for(const [lo,hi,rate] of b){if(income<=lo)break;t+=(Math.min(income,hi)-lo)*rate;}
  return Math.max(0,t);
}
function compute(mode:string,sal:number|string,hrly:number|string,hrs:number|string,ot:string,bonus:string,filing:string,state:string,k401:string,hsa:string,health:string,fsa:string,roth:string,other:string):Res{
  let base=0;
  if(mode==='salary'){base=parseFloat(String(sal))||0;}
  else{const h=parseFloat(String(hrly))||0;const w=parseFloat(String(hrs))||40;const o=parseFloat(ot)||0;base=(h*w+o*h*1.5)*52;}
  const gross=base+(parseFloat(bonus)||0);
  const k=parseMoney(k401),hs=parseMoney(hsa),he=parseMoney(health),fs=parseMoney(fsa);
  const preTax=k+hs+he+fs;
  const ficaBase=Math.max(0,gross-hs-he);
  const ss=Math.min(ficaBase,184500)*.062;
  const medicare=ficaBase*.0145;
  const addlMed=Math.max(0,ficaBase-200000)*.009;
  const std=STD_DED[filing]||STD_DED.single;
  const taxable=Math.max(0,gross-preTax-std);
  const fed=calcFed(taxable,filing);
  const stateTax=(STATES[state]?.rate||0)*Math.max(0,gross-preTax)*.75;
  const ro=parseMoney(roth),ot2=parseMoney(other),postTax=ro+ot2;
  const net=Math.max(0,gross-fed-stateTax-ss-medicare-addlMed-preTax-postTax);
  const effRate=gross>0?(fed+stateTax+ss+medicare+addlMed)/gross:0;
  const b2=FEDERAL_BRACKETS[filing]||FEDERAL_BRACKETS.single;
  let margRate=b2[b2.length-1][2];
  for(const [lo,hi,rate] of b2){if(taxable<=hi){margRate=rate;break;}}
  return{gross,fed,stateTax,ss,medicare,addlMed,preTax,postTax,net,effRate,margRate};
}

function DonutChart({slices}:{slices:{value:number;color:string;label:string}[]}){
  const total=slices.reduce((s,x)=>s+Math.max(0,x.value),0);
  if(!total)return null;
  let cum=0;const r=70,cx=90,cy=90,ir=44;
  const paths:{d:string;color:string}[]=[];
  for(const sl of slices){
    if(sl.value<=0)continue;
    const frac=sl.value/total;const sa=cum*2*Math.PI-Math.PI/2;const ea=(cum+frac)*2*Math.PI-Math.PI/2;
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
    const la=frac>.5?1:0;
    const ix1=cx+ir*Math.cos(sa),iy1=cy+ir*Math.sin(sa),ix2=cx+ir*Math.cos(ea),iy2=cy+ir*Math.sin(ea);
    paths.push({color:sl.color,d:`M ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${la} 0 ${ix1} ${iy1} Z`});
    cum+=frac;
  }
  return(
    <svg viewBox="0 0 180 180" style={{width:'100%',maxWidth:180}}>
      {paths.map((p,i)=><path key={i} d={p.d} fill={p.color}/>)}
      <circle cx={cx} cy={cy} r={ir} fill="white"/>
    </svg>
  );
}

// ── Inline style tokens ──────────────────────────────────────────────────────
const C={blue:'#2563eb',darkBlue:'#1e3a5f',red:'#ef4444',orange:'#f97316',purple:'#8b5cf6',green:'#10b981',gray:'#6b7280',lightGray:'#f8fafc',border:'#e5e7eb',white:'#ffffff'};
const card:React.CSSProperties={background:C.white,borderRadius:16,padding:'16px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',border:`1px solid ${C.border}`,marginBottom:16};
const inputStyle:React.CSSProperties={width:'100%',border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 12px',fontSize:14,outline:'none',background:C.white,boxSizing:'border-box'};
const inputWrapStyle:React.CSSProperties={position:'relative'};
const prefixStyle:React.CSSProperties={position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.gray,fontSize:14,pointerEvents:'none'};
const labelStyle:React.CSSProperties={display:'block',fontSize:11,fontWeight:600,color:C.gray,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4};
const selectStyle:React.CSSProperties={...inputStyle,appearance:'none',cursor:'pointer'};
const btnBase:React.CSSProperties={flex:1,padding:'10px 0',fontSize:14,fontWeight:600,border:'none',cursor:'pointer',transition:'all .15s'};

export default function SalaryCalculator(){
  const [mode,setMode]=useState<'salary'|'hourly'>('salary');
  const [tab,setTab]=useState<'results'|'compare'|'tips'>('results');
  const [sal,setSal]=useState(75000);
  const [hrly,setHrly]=useState(25);
  const [hrs,setHrs]=useState(40);
  const [otHrs,setOtHrs]=useState('0');
  const [bonus,setBonus]=useState('0');
  const [filing,setFiling]=useState('single');
  const [stateVal,setStateVal]=useState('TX');
  const [freq,setFreq]=useState('biweekly');
  const [k401,setK401]=useState('0');
  const [hsa,setHsa]=useState('0');
  const [health,setHealth]=useState('0');
  const [fsa,setFsa]=useState('0');
  const [roth,setRoth]=useState('0');
  const [other,setOther]=useState('0');
  const [showDed,setShowDed]=useState(false);
  const [sal2,setSal2]=useState('90,000');
  const [state2,setState2]=useState('CA');
  const [res,setRes]=useState<Res|null>(null);
  const [res2,setRes2]=useState<Res|null>(null);

  const run=useCallback(()=>{
    setRes(compute(mode,sal,hrly,hrs,otHrs,bonus,filing,stateVal,k401,hsa,health,fsa,roth,other));
    setRes2(compute(mode,sal2,hrly,hrs,otHrs,bonus,filing,state2,k401,hsa,health,fsa,roth,other));
  },[mode,sal,hrly,hrs,otHrs,bonus,filing,stateVal,k401,hsa,health,fsa,roth,other,sal2,state2]);
  useEffect(()=>{run();},[run]);

  const periods=FREQS[freq]?.periods??26;
  const pp=(n:number)=>n/periods;
  const stateSorted=Object.entries(STATES).sort((a,b)=>a[1].name.localeCompare(b[1].name));

  const MoneyIn=({value,onChange,placeholder='e.g. 75000'}:{value:number|string;onChange:(v:number)=>void;placeholder?:string})=>(
    <div style={{position:'relative'}}>
      <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:14,pointerEvents:'none'}}>$</span>
      <input
        style={{...inputStyle,paddingLeft:28,color:'#111827',fontWeight:500}}
        type="number"
        inputMode="numeric"
        min="0"
        placeholder={placeholder}
        value={value||''}
        onChange={e=>onChange(parseFloat(e.target.value)||0)}
      />
    </div>
  );

  const ResultRow=({label,annual,color,highlight=false}:{label:string;annual:number;color?:string;highlight?:boolean})=>(
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',borderRadius:8,background:highlight?'#eff6ff':'transparent',border:highlight?`1px solid #bfdbfe`:'1px solid transparent'}}>
      <span style={{fontSize:13,color:highlight?'#1e40af':C.gray,fontWeight:highlight?600:400}}>{label}</span>
      <div style={{textAlign:'right'}}>
        <span style={{fontSize:13,fontWeight:600,color:color||(highlight?C.blue:'#1f2937')}}>{fmtD(pp(annual))}</span>
        <span style={{fontSize:11,color:'#9ca3af',marginLeft:8}}>{fmtD(annual)}/yr</span>
      </div>
    </div>
  );

  const donutSlices=res?[
    {value:res.net,color:C.blue,label:'Take-Home'},
    {value:res.fed,color:C.red,label:'Federal Tax'},
    {value:res.stateTax,color:C.orange,label:'State Tax'},
    {value:res.ss+res.medicare+res.addlMed,color:C.purple,label:'FICA'},
    {value:res.preTax,color:C.green,label:'Pre-Tax Ded.'},
  ]:[];

  const TipCard=({bg,border,titleColor,textColor,icon,title,body}:{bg:string;border:string;titleColor:string;textColor:string;icon:string;title:string;body:string})=>(
    <div style={{display:'flex',gap:12,padding:12,background:bg,borderRadius:12,border:`1px solid ${border}`}}>
      <span style={{fontSize:20,flexShrink:0}}>{icon}</span>
      <div><p style={{fontSize:13,fontWeight:600,color:titleColor,margin:'0 0 4px'}}>{title}</p><p style={{fontSize:12,color:textColor,margin:0,lineHeight:1.5}}>{body}</p></div>
    </div>
  );

  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.lightGray,minHeight:'100vh'}}>

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:C.white,padding:'32px 16px 40px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:28,fontWeight:700,margin:'12px 0 8px',color:C.white}}>Salary &amp; Take-Home Pay Calculator</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 16px'}}>See your real take-home pay after all taxes and deductions. All 50 states | 2026 rates | No sign-up.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['2026 Tax Brackets','All 50 States','Live Results','Salary + Hourly'].map(t=>(
              <span key={t} style={{background:'rgba(255,255,255,.15)',fontSize:12,padding:'4px 12px',borderRadius:20,color:C.white}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(0,3fr)',gap:20}} className="salary-grid">
            <style>{`@media(max-width:700px){.salary-grid{grid-template-columns:1fr!important;}}`}</style>

            {/* LEFT COL */}
            <div>
              {/* Mode toggle */}
              <div style={{...card}}>
                <div style={{display:'flex',borderRadius:10,overflow:'hidden',border:`1px solid ${C.border}`,marginBottom:16}}>
                  {(['salary','hourly'] as const).map(m=>(
                    <button key={m} onClick={()=>setMode(m)} style={{...btnBase,background:mode===m?C.blue:C.white,color:mode===m?C.white:C.gray,borderRadius:0}}>
                      {m==='salary'?'Salary':'Hourly'}
                    </button>
                  ))}
                </div>
                {mode==='salary'?(
                  <div><label style={labelStyle}>Annual Salary</label><MoneyIn value={sal} onChange={setSal}/></div>
                ):(
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    <div><label style={labelStyle}>Hourly Rate</label><MoneyIn value={hrly} onChange={setHrly}/></div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      <div><label style={labelStyle}>Hrs/Week</label><input style={inputStyle} type="number" min="0" max="80" value={hrs} onChange={e=>setHrs(Number(e.target.value)||0)}/></div>
                      <div><label style={labelStyle}>OT Hrs/Wk</label><input style={inputStyle} type="number" min="0" max="40" value={otHrs} onChange={e=>setOtHrs(e.target.value)}/></div>
                    </div>
                    {hrly>0&&(
                      <div style={{fontSize:12,color:C.blue,background:'#eff6ff',borderRadius:8,padding:'6px 10px'}}>
                        approx. {fmtD((hrly*(parseFloat(String(hrs))||40))*52)}/yr base
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Filing/State/Freq */}
              <div style={{...card}}>
                {[
                  {lbl:'Filing Status',el:<select style={selectStyle} value={filing} onChange={e=>setFiling(e.target.value)}><option value="single">Single</option><option value="married">Married Filing Jointly</option><option value="married_sep">Married Filing Separately</option><option value="hoh">Head of Household</option></select>},
                  {lbl:'State',el:<select style={selectStyle} value={stateVal} onChange={e=>setStateVal(e.target.value)}>{stateSorted.map(([code,s])=><option key={code} value={code}>{s.name}{s.notax?' (No Tax)':''}</option>)}</select>},
                  {lbl:'Pay Frequency',el:<select style={selectStyle} value={freq} onChange={e=>setFreq(e.target.value)}>{Object.entries(FREQS).map(([k,v])=><option key={k} value={k}>{v.label} ({v.periods}x/yr)</option>)}</select>},
                  {lbl:'Annual Bonus',el:<MoneyIn value={bonus} onChange={setBonus}/>},
                ].map(({lbl,el},i)=>(
                  <div key={i} style={{marginBottom:i<3?12:0}}><label style={labelStyle}>{lbl}</label>{el}</div>
                ))}
              </div>

              {/* Deductions */}
              <div style={{...card,padding:0}}>
                <button onClick={()=>setShowDed(!showDed)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:16,background:'transparent',border:'none',cursor:'pointer',textAlign:'left'}}>
                  <span style={{fontSize:14,fontWeight:600,color:'#1f2937'}}>Deductions &amp; Benefits</span>
                  <span style={{fontSize:20,color:C.gray,fontWeight:300}}>{showDed?'-':'+'}</span>
                </button>
                {showDed&&(
                  <div style={{padding:'0 16px 16px',borderTop:`1px solid ${C.border}`,paddingTop:12}}>
                    <p style={{fontSize:11,fontWeight:600,color:C.green,margin:'0 0 8px'}}>Pre-tax (reduces taxable income)</p>
                    {[['401(k) - max $23,500/yr',k401,setK401],['HSA - max $4,300 self',hsa,setHsa],['Health Insurance',health,setHealth],['FSA - max $3,400/yr',fsa,setFsa]].map(([l,v,s]:any)=>(
                      <div key={l} style={{marginBottom:10}}><label style={labelStyle}>{l}</label><MoneyIn value={v} onChange={s}/></div>
                    ))}
                    <p style={{fontSize:11,fontWeight:600,color:C.purple,margin:'12px 0 8px'}}>Post-tax</p>
                    {[['Roth 401(k)',roth,setRoth],['Other Deductions',other,setOther]].map(([l,v,s]:any)=>(
                      <div key={l} style={{marginBottom:10}}><label style={labelStyle}>{l}</label><MoneyIn value={v} onChange={s}/></div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COL */}
            <div>
              {/* Big result card */}
              {res&&(
                <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,borderRadius:16,padding:20,color:C.white,marginBottom:16,boxShadow:'0 4px 20px rgba(37,99,235,.3)'}}>
                  <p style={{fontSize:11,fontWeight:600,letterSpacing:'0.1em',color:'#93c5fd',margin:'0 0 4px',textTransform:'uppercase'}}>{FREQS[freq]?.label} Take-Home Pay</p>
                  <div style={{fontSize:40,fontWeight:700,margin:'0 0 4px'}}>{fmtD(pp(res.net))}</div>
                  <p style={{color:'#93c5fd',fontSize:13,margin:'0 0 16px'}}>{fmtD(res.net)} per year</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {[['Gross Pay',fmtD(pp(res.gross))],['Effective Rate',(res.effRate*100).toFixed(1)+'%'],['Marginal Rate',(res.margRate*100).toFixed(0)+'%']].map(([l,v])=>(
                      <div key={l} style={{background:'rgba(255,255,255,.12)',borderRadius:10,padding:'10px 12px'}}>
                        <p style={{fontSize:11,color:'#93c5fd',margin:'0 0 2px'}}>{l}</p>
                        <p style={{fontSize:15,fontWeight:700,margin:0}}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div style={{display:'flex',gap:4,background:'#f1f5f9',borderRadius:12,padding:4,marginBottom:16}}>
                {(['results','compare','tips'] as const).map(t=>(
                  <button key={t} onClick={()=>setTab(t)} style={{...btnBase,borderRadius:9,background:tab===t?C.white:'transparent',color:tab===t?C.blue:C.gray,boxShadow:tab===t?'0 1px 3px rgba(0,0,0,.1)':'none',fontSize:13}}>
                    {t==='results'?'Breakdown':t==='compare'?'Compare':'Tax Tips'}
                  </button>
                ))}
              </div>

              {/* RESULTS */}
              {tab==='results'&&res&&(
                <div style={{...card}}>
                  <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                    <div style={{flexShrink:0,width:180}}>
                      <DonutChart slices={donutSlices}/>
                      <div style={{marginTop:8}}>
                        {donutSlices.filter(s=>s.value>0).map(s=>(
                          <div key={s.label} style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                            <span style={{width:10,height:10,borderRadius:'50%',background:s.color,flexShrink:0}}></span>
                            <span style={{fontSize:11,color:C.gray}}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#9ca3af',padding:'0 12px 6px',borderBottom:`1px solid ${C.border}`,marginBottom:4}}>
                        <span>Item</span><span>{FREQS[freq]?.label} / Annual</span>
                      </div>
                      <ResultRow label="Gross Pay" annual={res.gross}/>
                      {res.preTax>0&&<ResultRow label="Pre-Tax Deductions" annual={-res.preTax} color={C.green}/>}
                      <ResultRow label="Federal Income Tax" annual={res.fed} color={C.red}/>
                      {res.stateTax>0&&<ResultRow label={STATES[stateVal]?.name+' State Tax'} annual={res.stateTax} color={C.orange}/>}
                      <ResultRow label="Social Security (6.2%)" annual={res.ss} color={C.purple}/>
                      <ResultRow label="Medicare (1.45%)" annual={res.medicare} color={C.purple}/>
                      {res.addlMed>0&&<ResultRow label="Add'l Medicare (0.9%)" annual={res.addlMed} color={C.purple}/>}
                      {res.postTax>0&&<ResultRow label="Post-Tax Deductions" annual={res.postTax} color={C.gray}/>}
                      <div style={{borderTop:`1px solid ${C.border}`,marginTop:6,paddingTop:6}}>
                        <ResultRow label="Net Take-Home Pay" annual={res.net} highlight/>
                      </div>
                    </div>
                  </div>
                  {/* Pay period grid */}
                  <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
                    <p style={{fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Take-Home by Pay Period</p>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:6}}>
                      {Object.entries(FREQS).map(([k,v])=>(
                        <div key={k} onClick={()=>setFreq(k)} style={{borderRadius:10,padding:'10px 8px',textAlign:'center',cursor:'pointer',border:`1px solid ${freq===k?C.blue:C.border}`,background:freq===k?'#eff6ff':C.white,transition:'all .15s'}}>
                          <p style={{fontSize:10,color:C.gray,margin:'0 0 3px'}}>{v.label}</p>
                          <p style={{fontSize:13,fontWeight:700,color:'#1f2937',margin:0}}>{fmtD(res.net/v.periods)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* COMPARE */}
              {tab==='compare'&&res&&res2&&(
                <div style={{...card}}>
                  <p style={{fontSize:13,color:C.gray,marginBottom:16}}>Compare two job offers or scenarios side-by-side.</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                    <div>
                      <p style={{fontSize:11,fontWeight:700,color:C.blue,marginBottom:8}}>Scenario A (Current)</p>
                      <div style={{background:'#f8fafc',borderRadius:10,padding:12,fontSize:13}}>
                        <p style={{color:C.gray,margin:'0 0 4px'}}>Gross: <strong style={{color:'#1f2937'}}>{fmtD(res.gross)}/yr</strong></p>
                        <p style={{color:C.gray,margin:0}}>State: <strong style={{color:'#1f2937'}}>{STATES[stateVal]?.name}</strong></p>
                      </div>
                    </div>
                    <div>
                      <p style={{fontSize:11,fontWeight:700,color:C.purple,marginBottom:8}}>Scenario B (Compare)</p>
                      <div style={{display:'flex',flexDirection:'column',gap:8}}>
                        <div><label style={labelStyle}>Salary</label><MoneyIn value={sal2} onChange={setSal2}/></div>
                        <div><label style={labelStyle}>State</label><select style={selectStyle} value={state2} onChange={e=>setState2(e.target.value)}>{stateSorted.map(([code,s])=><option key={code} value={code}>{s.name}</option>)}</select></div>
                      </div>
                    </div>
                  </div>
                  <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
                    {[['Gross Annual',res.gross,res2.gross],['Federal Tax',res.fed,res2.fed],['State Tax',res.stateTax,res2.stateTax],['Net Take-Home',res.net,res2.net]].map(([l,a,b])=>{
                      const diff=(b as number)-(a as number);
                      return(
                        <div key={l as string} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:`1px solid #f3f4f6`}}>
                          <span style={{fontSize:12,color:C.gray,width:100,flexShrink:0}}>{l}</span>
                          <span style={{flex:1,fontSize:13,color:C.blue,textAlign:'right',fontWeight:l==='Net Take-Home'?700:400}}>{fmtD(a as number)}</span>
                          <span style={{flex:1,fontSize:13,color:C.purple,textAlign:'right',fontWeight:l==='Net Take-Home'?700:400}}>{fmtD(b as number)}</span>
                          <span style={{fontSize:12,fontWeight:700,width:72,textAlign:'right',color:diff>0?C.green:diff<0?C.red:'#9ca3af'}}>{diff>0?'+':''}{fmtD(diff)}</span>
                        </div>
                      );
                    })}
                    <div style={{textAlign:'center',paddingTop:12}}>
                      {res2.net>res.net&&<p style={{fontSize:13,fontWeight:600,color:C.green,margin:0}}>Scenario B pays {fmtD(res2.net-res.net)} more per year</p>}
                      {res.net>res2.net&&<p style={{fontSize:13,fontWeight:600,color:C.blue,margin:0}}>Scenario A pays {fmtD(res.net-res2.net)} more per year</p>}
                      {res.net===res2.net&&<p style={{fontSize:13,color:C.gray,margin:0}}>Both scenarios are equal.</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* TIPS */}
              {tab==='tips'&&res&&(
                <div style={{...card,display:'flex',flexDirection:'column',gap:10}}>
                  <h3 style={{fontSize:15,fontWeight:700,color:'#1f2937',margin:'0 0 4px'}}>Personalized Tax-Saving Tips</h3>
                  {parseMoney(k401)<23500&&<TipCard bg="#f0fdf4" border="#86efac" titleColor="#166534" textColor="#15803d" icon="+" title="Max out your 401(k)" body={`You can contribute up to $23,500/yr. Each additional $1,000 pre-tax saves approx. ${fmtD(1000*res.margRate)} in federal tax.`}/>}
                  {parseMoney(hsa)===0&&<TipCard bg="#eff6ff" border="#93c5fd" titleColor="#1e40af" textColor="#1d4ed8" icon="+" title="Open an HSA" body={`With a high-deductible health plan, save $4,300/yr tax-free. That is a ${(res.margRate*100).toFixed(0)}% instant return on contributions.`}/>}
                  {STATES[stateVal]?.notax?<TipCard bg="#fefce8" border="#fde047" titleColor="#854d0e" textColor="#a16207" icon="*" title="No-income-tax state!" body={`${STATES[stateVal]?.name} has no state income tax - a major advantage vs. high-tax states like CA or NY.`}/>
                  :<TipCard bg="#f9fafb" border={C.border} titleColor="#1f2937" textColor={C.gray} icon="~" title="State Tax Impact" body={`You pay approx. ${fmtD(res.stateTax)}/yr in ${STATES[stateVal]?.name} state tax. Moving to TX, FL, or NV would save this annually.`}/>}
                  <TipCard bg="#faf5ff" border="#c4b5fd" titleColor="#6b21a8" textColor="#7c3aed" icon="%" title="Marginal vs. Effective Rate" body={`Your marginal rate is ${(res.margRate*100).toFixed(0)}%, but effective rate is only ${(res.effRate*100).toFixed(1)}%. The US progressive system means only dollars above each bracket hit the higher rate.`}/>
                  {res.gross>200000&&<TipCard bg="#fef2f2" border="#fca5a5" titleColor="#991b1b" textColor="#b91c1c" icon="!" title="Additional Medicare Tax" body="You owe an extra 0.9% Medicare on income above $200,000. Maximize pre-tax deductions to reduce exposure."/>}
                  <div style={{background:'#f8fafc',borderRadius:10,padding:12,border:`1px solid ${C.border}`}}>
                    <p style={{fontSize:11,fontWeight:600,color:'#374151',marginBottom:8}}>2026 Key Limits</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,fontSize:11,color:C.gray}}>
                      {['401(k): $23,500','HSA (self): $4,300','SS wage base: $184,500','FSA: $3,400','Std. ded. (single): $16,100','Std. ded. (MFJ): $32,200'].map(t=><span key={t}>{t}</span>)}
                    </div>
                  </div>
                </div>
              )}

              <p style={{fontSize:11,color:'#9ca3af',marginTop:8}}>Estimates based on 2026 IRS rates. Not tax advice - consult a tax professional.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginTop:48}} className="faq-grid">
          <style>{`@media(max-width:600px){.faq-grid{grid-template-columns:1fr!important;}}`}</style>
          <div style={{...card}}>
            <h2 style={{fontSize:16,fontWeight:700,color:'#1f2937',marginBottom:16}}>How is Take-Home Pay Calculated?</h2>
            {[['1. Start with Gross Pay','Your salary or hourly rate x hours worked.'],['2. Subtract Pre-Tax Deductions','401(k), HSA, and health insurance reduce taxable income.'],['3. Calculate Federal Tax','Using 2026 IRS progressive brackets (10%-37%).'],['4. Calculate State Tax','Varies by state (0% in TX, FL, NV to 9.3%+ in CA).'],['5. Subtract FICA','Social Security 6.2% up to $184,500, Medicare 1.45%.'],['6. Net Pay','Gross minus all taxes minus all deductions.']].map(([t,b])=>(
              <div key={t} style={{marginBottom:10}}><strong style={{fontSize:13,color:'#1f2937'}}>{t}</strong><p style={{fontSize:12,color:C.gray,margin:'2px 0 0'}}>{b}</p></div>
            ))}
          </div>
          <div style={{...card}}>
            <h2 style={{fontSize:16,fontWeight:700,color:'#1f2937',marginBottom:16}}>2026 FICA and Tax Rates</h2>
            {[['Social Security','6.2%','Up to $184,500'],["Medicare",'1.45%','No limit'],["Add'l Medicare",'0.9%','Over $200,000'],['Federal (lowest)','10%','Up to $12,400 (single)'],['Federal (highest)','37%','Over $626,350'],['Std. Deduction','$16,100','Single filer 2026']].map(([item,rate,note])=>(
              <div key={item} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid #f3f4f6`,fontSize:13}}>
                <span style={{color:C.gray}}>{item}</span>
                <div style={{textAlign:'right'}}><strong style={{color:'#1f2937',marginRight:8}}>{rate}</strong><span style={{fontSize:11,color:'#9ca3af'}}>{note}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* All Calculators */}
        <div style={{background:'linear-gradient(135deg,#eff6ff,#eef2ff)',borderRadius:16,padding:20,border:'1px solid #bfdbfe',marginTop:20}}>
          <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:12}}>All freecalcs.io Calculators</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {[['Mortgage Calculator','/mortgage'],['Mortgage Qualifier','/qualify'],['Rent vs Buy','/rent-vs-buy'],['Income Tax','/tax'],['BMI Calculator','/bmi'],['TDEE & Calories','/tdee'],['Compound Interest','/compound-interest'],['Loan Calculator','/loan'],['Age Calculator','/age'],['Percentage Calc','/percentage'],['Tip Calculator','/tip']].map(([name,href])=>(
              <a key={href} href={href} style={{background:C.white,fontSize:13,color:C.blue,fontWeight:500,padding:'8px 16px',borderRadius:10,border:`1px solid #bfdbfe`,textDecoration:'none'}}>{name}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}