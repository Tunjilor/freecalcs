'use client';
import { useState, useEffect, useCallback } from 'react';

const FEDERAL_BRACKETS: Record<string, [number,number,number][]> = {
  single: [[0,12400,0.10],[12400,50000,0.12],[50000,100525,0.22],[100525,197300,0.24],[197300,250525,0.32],[250525,626350,0.35],[626350,Infinity,0.37]],
  married: [[0,24800,0.10],[24800,100000,0.12],[100000,201050,0.22],[201050,394600,0.24],[394600,501050,0.32],[501050,751600,0.35],[751600,Infinity,0.37]],
  married_sep: [[0,12400,0.10],[12400,50000,0.12],[50000,100525,0.22],[100525,197300,0.24],[197300,250525,0.32],[250525,375800,0.35],[375800,Infinity,0.37]],
  hoh: [[0,18750,0.10],[18750,63100,0.12],[63100,100500,0.22],[100500,197300,0.24],[197300,250500,0.32],[250500,626350,0.35],[626350,Infinity,0.37]],
};

const STD_DED: Record<string,number> = { single:16100, married:32200, married_sep:16100, hoh:24150 };

const STATES: Record<string,{rate:number;name:string;notax?:boolean}> = {
  AL:{rate:0.05,name:'Alabama'},AK:{rate:0,name:'Alaska',notax:true},AZ:{rate:0.025,name:'Arizona'},
  AR:{rate:0.039,name:'Arkansas'},CA:{rate:0.093,name:'California'},CO:{rate:0.044,name:'Colorado'},
  CT:{rate:0.065,name:'Connecticut'},DE:{rate:0.066,name:'Delaware'},FL:{rate:0,name:'Florida',notax:true},
  GA:{rate:0.055,name:'Georgia'},HI:{rate:0.08,name:'Hawaii'},ID:{rate:0.058,name:'Idaho'},
  IL:{rate:0.0495,name:'Illinois'},IN:{rate:0.0305,name:'Indiana'},IA:{rate:0.057,name:'Iowa'},
  KS:{rate:0.057,name:'Kansas'},KY:{rate:0.04,name:'Kentucky'},LA:{rate:0.03,name:'Louisiana'},
  ME:{rate:0.075,name:'Maine'},MD:{rate:0.0575,name:'Maryland'},MA:{rate:0.05,name:'Massachusetts'},
  MI:{rate:0.0425,name:'Michigan'},MN:{rate:0.0985,name:'Minnesota'},MS:{rate:0.05,name:'Mississippi'},
  MO:{rate:0.048,name:'Missouri'},MT:{rate:0.059,name:'Montana'},NE:{rate:0.0664,name:'Nebraska'},
  NV:{rate:0,name:'Nevada',notax:true},NH:{rate:0,name:'New Hampshire',notax:true},NJ:{rate:0.0897,name:'New Jersey'},
  NM:{rate:0.059,name:'New Mexico'},NY:{rate:0.109,name:'New York'},NC:{rate:0.045,name:'North Carolina'},
  ND:{rate:0.025,name:'North Dakota'},OH:{rate:0.035,name:'Ohio'},OK:{rate:0.0475,name:'Oklahoma'},
  OR:{rate:0.099,name:'Oregon'},PA:{rate:0.0307,name:'Pennsylvania'},RI:{rate:0.0599,name:'Rhode Island'},
  SC:{rate:0.064,name:'South Carolina'},SD:{rate:0,name:'South Dakota',notax:true},TN:{rate:0,name:'Tennessee',notax:true},
  TX:{rate:0,name:'Texas',notax:true},UT:{rate:0.0465,name:'Utah'},VT:{rate:0.0875,name:'Vermont'},
  VA:{rate:0.0575,name:'Virginia'},WA:{rate:0,name:'Washington',notax:true},WV:{rate:0.065,name:'West Virginia'},
  WI:{rate:0.0765,name:'Wisconsin'},WY:{rate:0,name:'Wyoming',notax:true},DC:{rate:0.109,name:'Washington D.C.'},
};

const FREQS: Record<string,{label:string;periods:number}> = {
  annual:{label:'Annually',periods:1},monthly:{label:'Monthly',periods:12},
  semimonthly:{label:'Semi-Monthly',periods:24},biweekly:{label:'Bi-Weekly',periods:26},
  weekly:{label:'Weekly',periods:52},
};

function fmt(n:number,d=0){return n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});}
function fmtD(n:number){return '$'+fmt(n,2);}
function parseMoney(s:string){return parseFloat(s.replace(/[^0-9.]/g,''))||0;}
function fmtInput(s:string){
  const raw=s.replace(/[^0-9.]/g,'');
  const parts=raw.split('.');
  parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
  return parts.length>1?parts[0]+'.'+parts[1]:parts[0];
}

interface Res {
  gross:number;fed:number;state:number;ss:number;medicare:number;addlMed:number;
  preTax:number;postTax:number;net:number;effRate:number;margRate:number;
}

function calcTax(income:number,filing:string):number{
  const b=FEDERAL_BRACKETS[filing]||FEDERAL_BRACKETS.single;
  let t=0;
  for(const [lo,hi,rate] of b){
    if(income<=lo)break;
    t+=(Math.min(income,hi)-lo)*rate;
  }
  return Math.max(0,t);
}

function compute(
  mode:string,sal:string,hrly:string,hrs:string,ot:string,bonus:string,
  filing:string,state:string,k401:string,hsa:string,health:string,fsa:string,roth:string,other:string
):Res{
  let base=0;
  if(mode==='salary'){base=parseMoney(sal);}
  else{const h=parseMoney(hrly);const w=parseFloat(hrs)||40;const o=parseFloat(ot)||0;base=(h*w+o*h*1.5)*52;}
  const gross=base+parseMoney(bonus);
  const k=parseMoney(k401);const hs=parseMoney(hsa);const he=parseMoney(health);const fs=parseMoney(fsa);
  const preTax=k+hs+he+fs;
  const ficaBase=Math.max(0,gross-hs-he);
  const ss=Math.min(ficaBase,184500)*0.062;
  const med=ficaBase*0.0145;
  const addlMed=Math.max(0,ficaBase-200000)*0.009;
  const std=STD_DED[filing]||STD_DED.single;
  const taxable=Math.max(0,gross-preTax-std);
  const fed=calcTax(taxable,filing);
  const st=(STATES[state]?.rate||0)*Math.max(0,gross-preTax)*0.75;
  const ro=parseMoney(roth);const ot2=parseMoney(other);const postTax=ro+ot2;
  const net=Math.max(0,gross-fed-st-ss-med-addlMed-preTax-postTax);
  const effRate=gross>0?(fed+st+ss+med+addlMed)/gross:0;
  const b2=FEDERAL_BRACKETS[filing]||FEDERAL_BRACKETS.single;
  let margRate=b2[b2.length-1][2];
  for(const [lo,hi,rate] of b2){if(taxable<=hi){margRate=rate;break;}}
  return {gross,fed,state:st,ss,medicare:med,addlMed,preTax,postTax,net,effRate,margRate};
}

function DonutChart({slices}:{slices:{value:number;color:string;label:string}[]}){
  const total=slices.reduce((s,x)=>s+Math.max(0,x.value),0);
  if(!total)return null;
  let cum=0;
  const r=70,cx=90,cy=90,ir=42;
  const paths:{d:string;color:string}[]=[];
  for(const sl of slices){
    if(sl.value<=0)continue;
    const frac=sl.value/total;
    const sa=cum*2*Math.PI-Math.PI/2;
    const ea=(cum+frac)*2*Math.PI-Math.PI/2;
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa);
    const x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
    const la=frac>0.5?1:0;
    const ix1=cx+ir*Math.cos(sa),iy1=cy+ir*Math.sin(sa);
    const ix2=cx+ir*Math.cos(ea),iy2=cy+ir*Math.sin(ea);
    paths.push({color:sl.color,d:`M ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${la} 0 ${ix1} ${iy1} Z`});
    cum+=frac;
  }
  return(
    <svg viewBox="0 0 180 180" className="w-full max-w-[180px]">
      {paths.map((p,i)=><path key={i} d={p.d} fill={p.color}/>)}
      <circle cx={cx} cy={cy} r={ir} fill="white"/>
    </svg>
  );
}

export default function SalaryCalculator(){
  const [mode,setMode]=useState<'salary'|'hourly'>('salary');
  const [tab,setTab]=useState<'results'|'compare'|'tips'>('results');
  const [sal,setSal]=useState('75,000');
  const [hrly,setHrly]=useState('25.00');
  const [hrs,setHrs]=useState('40');
  const [otHrs,setOtHrs]=useState('0');
  const [bonus,setBonus]=useState('0');
  const [filing,setFiling]=useState('single');
  const [state,setStateVal]=useState('TX');
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
    const r=compute(mode,sal,hrly,hrs,otHrs,bonus,filing,state,k401,hsa,health,fsa,roth,other);
    setRes(r);
    const r2=compute(mode,sal2,hrly,hrs,otHrs,bonus,filing,state2,k401,hsa,health,fsa,roth,other);
    setRes2(r2);
  },[mode,sal,hrly,hrs,otHrs,bonus,filing,state,k401,hsa,health,fsa,roth,other,sal2,state2]);

  useEffect(()=>{run();},[run]);

  const periods=FREQS[freq]?.periods??26;
  const pp=(n:number)=>n/periods;
  const stateSorted=Object.entries(STATES).sort((a,b)=>a[1].name.localeCompare(b[1].name));

  const inp="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition";
  const lbl="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";
  const MoneyIn=({value,onChange,placeholder='0'}:{value:string;onChange:(v:string)=>void;placeholder?:string})=>(
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
      <input className={inp+' pl-7'} type="text" inputMode="numeric" placeholder={placeholder}
        value={value} onChange={e=>onChange(fmtInput(e.target.value))}/>
    </div>
  );

  const Row=({label,annual,highlight=false,color=''}:{label:string;annual:number;highlight?:boolean;color?:string})=>(
    <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${highlight?'bg-blue-50 border border-blue-200':'hover:bg-gray-50'}`}>
      <span className={`text-sm ${highlight?'font-semibold text-gray-800':'text-gray-600'}`}>{label}</span>
      <div className="text-right">
        <span className={`text-sm font-semibold ${color||(highlight?'text-blue-700':'text-gray-800')}`}>{fmtD(pp(annual))}</span>
        <span className="text-xs text-gray-400 ml-2 hidden sm:inline">{fmtD(annual)}/yr</span>
      </div>
    </div>
  );

  const donutSlices=res?[
    {value:res.net,color:'#2563eb',label:'Take-Home'},
    {value:res.fed,color:'#ef4444',label:'Federal Tax'},
    {value:res.state,color:'#f97316',label:'State Tax'},
    {value:res.ss+res.medicare+res.addlMed,color:'#8b5cf6',label:'FICA'},
    {value:res.preTax,color:'#10b981',label:'Pre-Tax Ded.'},
  ]:[];

  return(
    <div style={{fontFamily:'system-ui,sans-serif',background:'#f8fafc',minHeight:'100vh'}}>
      <div style={{background:'linear-gradient(135deg,#1e3a5f,#2563eb)'}} className="text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <a href="/" className="text-blue-200 text-sm hover:text-white">&lt;- freecalcs.io</a>
          <h1 className="text-3xl font-bold mt-3 mb-2">Salary &amp; Take-Home Pay Calculator</h1>
          <p className="text-blue-200 text-sm">See your real take-home pay after all taxes and deductions. All 50 states | 2026 rates | No sign-up.</p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <span className="bg-white/10 text-xs px-3 py-1 rounded-full">2026 Tax Brackets</span>
            <span className="bg-white/10 text-xs px-3 py-1 rounded-full">All 50 States</span>
            <span className="bg-white/10 text-xs px-3 py-1 rounded-full">Live Results</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-4">
                {(['salary','hourly'] as const).map(m=>(
                  <button key={m} onClick={()=>setMode(m)}
                    className={`flex-1 py-2.5 text-sm font-semibold transition ${mode===m?'bg-blue-600 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    {m==='salary'?'Salary':'Hourly'}
                  </button>
                ))}
              </div>
              {mode==='salary'?(
                <div>
                  <label className={lbl}>Annual Salary</label>
                  <MoneyIn value={sal} onChange={setSal}/>
                </div>
              ):(
                <div className="space-y-3">
                  <div><label className={lbl}>Hourly Rate</label><MoneyIn value={hrly} onChange={setHrly}/></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className={lbl}>Hrs/Week</label><input className={inp} type="number" min="0" max="80" value={hrs} onChange={e=>setHrs(e.target.value)}/></div>
                    <div><label className={lbl}>OT Hrs/Wk</label><input className={inp} type="number" min="0" max="40" value={otHrs} onChange={e=>setOtHrs(e.target.value)}/></div>
                  </div>
                  {parseMoney(hrly)>0&&(
                    <div className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                      approx. {fmtD((parseMoney(hrly)*(parseFloat(hrs)||40))*52)}/yr base
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
              <div>
                <label className={lbl}>Filing Status</label>
                <select className={inp} value={filing} onChange={e=>setFiling(e.target.value)}>
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="married_sep">Married Filing Separately</option>
                  <option value="hoh">Head of Household</option>
                </select>
              </div>
              <div>
                <label className={lbl}>State</label>
                <select className={inp} value={state} onChange={e=>setStateVal(e.target.value)}>
                  {stateSorted.map(([code,s])=>(
                    <option key={code} value={code}>{s.name}{s.notax?' (No Income Tax)':''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Pay Frequency</label>
                <select className={inp} value={freq} onChange={e=>setFreq(e.target.value)}>
                  {Object.entries(FREQS).map(([k,v])=>(<option key={k} value={k}>{v.label} ({v.periods}x/yr)</option>))}
                </select>
              </div>
              <div>
                <label className={lbl}>Annual Bonus</label>
                <MoneyIn value={bonus} onChange={setBonus}/>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left" onClick={()=>setShowDed(!showDed)}>
                <span className="text-sm font-semibold text-gray-700">Deductions &amp; Benefits</span>
                <span className="text-gray-400 text-lg">{showDed?'-':'+'}</span>
              </button>
              {showDed&&(
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                  <p className="text-xs text-green-600 font-medium">Pre-tax (reduces taxable income)</p>
                  <div><label className={lbl}>401(k) - max $23,500/yr</label><MoneyIn value={k401} onChange={setK401}/></div>
                  <div><label className={lbl}>HSA - max $4,300 self/$8,550 family</label><MoneyIn value={hsa} onChange={setHsa}/></div>
                  <div><label className={lbl}>Health Insurance Premium</label><MoneyIn value={health} onChange={setHealth}/></div>
                  <div><label className={lbl}>FSA - max $3,400/yr</label><MoneyIn value={fsa} onChange={setFsa}/></div>
                  <p className="text-xs text-purple-600 font-medium mt-3">Post-tax</p>
                  <div><label className={lbl}>Roth 401(k)</label><MoneyIn value={roth} onChange={setRoth}/></div>
                  <div><label className={lbl}>Other Deductions</label><MoneyIn value={other} onChange={setOther}/></div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-3 space-y-4">
            {res&&(
              <div style={{background:'linear-gradient(135deg,#1e3a5f,#2563eb)'}} className="rounded-2xl p-5 text-white shadow-md">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">{FREQS[freq]?.label} Take-Home Pay</p>
                <div className="text-4xl font-bold mb-1">{fmtD(pp(res.net))}</div>
                <p className="text-blue-200 text-sm">{fmtD(res.net)} per year</p>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/10 rounded-xl p-3"><p className="text-blue-200 text-xs">Gross Pay</p><p className="font-bold">{fmtD(pp(res.gross))}</p></div>
                  <div className="bg-white/10 rounded-xl p-3"><p className="text-blue-200 text-xs">Effective Rate</p><p className="font-bold">{(res.effRate*100).toFixed(1)}%</p></div>
                  <div className="bg-white/10 rounded-xl p-3"><p className="text-blue-200 text-xs">Marginal Rate</p><p className="font-bold">{(res.margRate*100).toFixed(0)}%</p></div>
                </div>
              </div>
            )}

            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {(['results','compare','tips'] as const).map(t=>(
                <button key={t} onClick={()=>setTab(t)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition ${tab===t?'bg-white text-blue-700 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>
                  {t==='results'?'Breakdown':t==='compare'?'Compare':'Tax Tips'}
                </button>
              ))}
            </div>

            {tab==='results'&&res&&(
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-shrink-0">
                    <DonutChart slices={donutSlices}/>
                    <div className="space-y-1 mt-2">
                      {donutSlices.filter(s=>s.value>0).map(s=>(
                        <div key={s.label} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:s.color}}></span>
                          <span className="text-xs text-gray-500">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-0.5">
                    <div className="flex justify-between text-xs text-gray-400 px-3 pb-1 border-b border-gray-100 mb-1">
                      <span>Item</span><span>{FREQS[freq]?.label} / Annual</span>
                    </div>
                    <Row label="Gross Pay" annual={res.gross}/>
                    {res.preTax>0&&<Row label="Pre-Tax Deductions" annual={-res.preTax} color="text-green-600"/>}
                    <Row label="Federal Income Tax" annual={res.fed} color="text-red-500"/>
                    {res.state>0&&<Row label={STATES[state]?.name+' State Tax'} annual={res.state} color="text-orange-500"/>}
                    <Row label="Social Security (6.2%)" annual={res.ss} color="text-purple-500"/>
                    <Row label="Medicare (1.45%)" annual={res.medicare} color="text-purple-500"/>
                    {res.addlMed>0&&<Row label="Additional Medicare (0.9%)" annual={res.addlMed} color="text-purple-500"/>}
                    {res.postTax>0&&<Row label="Post-Tax Deductions" annual={res.postTax} color="text-gray-500"/>}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <Row label="Net Take-Home Pay" annual={res.net} highlight/>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Take-Home by Pay Period</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(FREQS).map(([k,v])=>(
                      <div key={k} className={`rounded-xl p-3 text-center cursor-pointer border transition ${freq===k?'border-blue-400 bg-blue-50':'border-gray-100 hover:border-gray-200'}`} onClick={()=>setFreq(k)}>
                        <p className="text-xs text-gray-400">{v.label}</p>
                        <p className="font-bold text-sm text-gray-800">{fmtD(res.net/v.periods)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab==='compare'&&res&&res2&&(
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                <p className="text-sm text-gray-500">Compare two job offers or scenarios side-by-side.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-bold text-blue-600 mb-2">Scenario A (Current)</p>
                    <div className="bg-gray-50 rounded-xl p-3 text-sm">
                      <p className="text-gray-500">Gross: <strong>{fmtD(res.gross)}/yr</strong></p>
                      <p className="text-gray-500">State: <strong>{STATES[state]?.name}</strong></p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-600 mb-2">Scenario B (Compare)</p>
                    <div className="space-y-2">
                      <div><label className={lbl}>Salary</label><MoneyIn value={sal2} onChange={setSal2}/></div>
                      <div>
                        <label className={lbl}>State</label>
                        <select className={inp} value={state2} onChange={e=>setState2(e.target.value)}>
                          {stateSorted.map(([code,s])=>(<option key={code} value={code}>{s.name}</option>))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  {[['Gross Annual',res.gross,res2.gross],['Federal Tax',res.fed,res2.fed],['State Tax',res.state,res2.state],['Net Take-Home',res.net,res2.net]].map(([lbl2,a,b])=>{
                    const diff=(b as number)-(a as number);
                    return(
                      <div key={lbl2 as string} className={`flex items-center gap-2 p-2 rounded-lg ${lbl2==='Net Take-Home'?'bg-gray-50 font-semibold':''}`}>
                        <span className="text-xs text-gray-500 w-28">{lbl2}</span>
                        <span className="flex-1 text-sm text-blue-700 text-right">{fmtD(a as number)}</span>
                        <span className="flex-1 text-sm text-purple-700 text-right">{fmtD(b as number)}</span>
                        <span className={`text-xs font-bold w-20 text-right ${diff>0?'text-green-600':diff<0?'text-red-500':'text-gray-400'}`}>{diff>0?'+':''}{fmtD(diff)}</span>
                      </div>
                    );
                  })}
                  <div className="text-center pt-2">
                    {res2.net>res.net?(<p className="text-sm font-semibold text-green-600">Scenario B pays {fmtD(res2.net-res.net)} more per year</p>)
                    :res.net>res2.net?(<p className="text-sm font-semibold text-blue-600">Scenario A pays {fmtD(res.net-res2.net)} more per year</p>)
                    :(<p className="text-sm text-gray-500">Both scenarios yield equal take-home pay.</p>)}
                  </div>
                </div>
              </div>
            )}

            {tab==='tips'&&res&&(
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-800">Personalized Tax-Saving Tips</h3>
                {parseMoney(k401)<23500&&(
                  <div className="flex gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                    <span className="text-xl font-bold text-green-600">+</span>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Max out your 401(k)</p>
                      <p className="text-xs text-green-700 mt-0.5">You can contribute up to $23,500/yr. Each additional $1,000 pre-tax saves approx. {fmtD(1000*res.margRate)} in federal tax.</p>
                    </div>
                  </div>
                )}
                {parseMoney(hsa)===0&&(
                  <div className="flex gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="text-xl font-bold text-blue-600">+</span>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Open an HSA</p>
                      <p className="text-xs text-blue-700 mt-0.5">With a high-deductible health plan, an HSA lets you save $4,300/yr tax-free. That is a {(res.margRate*100).toFixed(0)}% instant return.</p>
                    </div>
                  </div>
                )}
                {STATES[state]?.notax?(
                  <div className="flex gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <span className="text-xl font-bold text-yellow-600">*</span>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">No-income-tax state!</p>
                      <p className="text-xs text-yellow-700 mt-0.5">{STATES[state]?.name} has no state income tax. That is a significant advantage vs. high-tax states like CA or NY.</p>
                    </div>
                  </div>
                ):(
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-xl font-bold text-gray-500">~</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">State Tax Impact</p>
                      <p className="text-xs text-gray-600 mt-0.5">You pay approx. {fmtD(res.state)}/yr in {STATES[state]?.name} state tax. Moving to a no-tax state (TX, FL, NV) would save this amount annually.</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-xl font-bold text-purple-600">%</span>
                  <div>
                    <p className="text-sm font-semibold text-purple-800">Marginal vs. Effective Rate</p>
                    <p className="text-xs text-purple-700 mt-0.5">Your marginal rate is {(res.margRate*100).toFixed(0)}%, but your effective rate is only {(res.effRate*100).toFixed(1)}%. The US uses a progressive system - only dollars above each threshold hit the higher rate.</p>
                  </div>
                </div>
                {res.gross>200000&&(
                  <div className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                    <span className="text-xl font-bold text-red-600">!</span>
                    <div>
                      <p className="text-sm font-semibold text-red-800">Additional Medicare Tax</p>
                      <p className="text-xs text-red-700 mt-0.5">You owe an extra 0.9% Medicare on income above $200,000. Maximize pre-tax deductions to reduce this if possible.</p>
                    </div>
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">2026 Key Limits</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <span>401(k) limit: $23,500</span><span>HSA (self): $4,300</span>
                    <span>SS wage base: $184,500</span><span>FSA limit: $3,400</span>
                    <span>Std. ded. (single): $16,100</span><span>Std. ded. (MFJ): $32,200</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 px-1">Estimates based on 2026 IRS tax rates. Not tax advice - consult a tax professional.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">How is Take-Home Pay Calculated?</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong className="text-gray-800">1. Start with Gross Pay</strong> - your salary or hourly rate x hours worked.</p>
              <p><strong className="text-gray-800">2. Subtract Pre-Tax Deductions</strong> - 401(k), HSA, and health insurance reduce taxable income.</p>
              <p><strong className="text-gray-800">3. Calculate Federal Tax</strong> - using 2026 IRS progressive brackets (10%-37%).</p>
              <p><strong className="text-gray-800">4. Calculate State Tax</strong> - varies by state (0% in TX, FL, NV to 13.3% in CA).</p>
              <p><strong className="text-gray-800">5. Subtract FICA</strong> - Social Security (6.2% up to $184,500) + Medicare (1.45%).</p>
              <p><strong className="text-gray-800">6. Net Pay</strong> = Gross minus All Taxes minus All Deductions.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">2026 FICA and Tax Rates</h2>
            <div className="space-y-2 text-sm">
              {[['Social Security','6.2%','Up to $184,500'],['Medicare','1.45%','No limit'],["Add'l Medicare",'0.9%','Over $200,000'],['Federal (lowest)','10%','Up to $12,400 (single)'],['Federal (highest)','37%','Over $626,350 (single)'],['Standard Deduction','$16,100','Single filer 2026']].map(([item,rate,note])=>(
                <div key={item} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-600">{item}</span>
                  <div className="text-right"><span className="font-semibold text-gray-800 mr-2">{rate}</span><span className="text-xs text-gray-400">{note}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[['Income Tax Calculator','/tax'],['Mortgage Calculator','/mortgage'],['Compound Interest','/compound-interest'],['Loan Calculator','/loan'],['TDEE and Calories','/tdee']].map(([name,href])=>(
              <a key={href} href={href} className="bg-white text-sm text-blue-700 font-medium px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition">{name}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
