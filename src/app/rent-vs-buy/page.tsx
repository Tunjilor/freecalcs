'use client';
import { useState, useEffect } from 'react';

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', gray:'#6b7280', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc' };
const card: React.CSSProperties = { background:C.white, borderRadius:16, padding:20, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, marginBottom:16 };
const inp: React.CSSProperties = { width:'100%', border:`1px solid #cbd5e1`, borderRadius:10, padding:'10px 12px', fontSize:15, outline:'none', background:C.white, color:'#111827', fontWeight:600, boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block', fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 } as React.CSSProperties;

const ALL_CALCS = [
  ['/mortgage','Mortgage Calculator'],['/qualify','Mortgage Qualifier'],
  ['/loan','Loan & EMI'],['/salary','Salary Calculator'],['/tax','Income Tax'],
  ['/compound-interest','Compound Interest'],['/percentage','Percentage Calc'],
  ['/bmi','BMI Calculator'],['/tdee','TDEE & Calories'],['/age','Age Calculator'],['/tip','Tip Calculator'],
];

function fmt(v:number){ return isNaN(v)||!isFinite(v)?'$0':'$'+Math.round(v).toLocaleString('en-US'); }

interface Result {
  monthlyPayment:number; totalBuyCost:number; totalRentCost:number;
  buyEquity:number; netBuyCost:number; better:string; savings:number;
  breakEvenYears:number;
}

function compute(homePrice:number, downPct:number, rate:number, rent:number, years:number, appreciation:number, rentIncrease:number, propTax:number, maintenance:number): Result {
  if(!homePrice||!rate||!rent) return {monthlyPayment:0,totalBuyCost:0,totalRentCost:0,buyEquity:0,netBuyCost:0,better:'--',savings:0,breakEvenYears:0};
  const down = homePrice*downPct/100;
  const principal = homePrice-down;
  const mr = rate/100/12;
  const n = years*12;
  const monthlyPayment = mr>0 ? principal*(mr*Math.pow(1+mr,n*12/n))/(Math.pow(1+mr,n)-1) : principal/n;
  const totalMortgage = monthlyPayment*n;
  const annualPropTax = homePrice*propTax/100;
  const annualMaint = homePrice*maintenance/100;
  const totalBuyCost = totalMortgage + down + (annualPropTax+annualMaint)*years;
  const futureValue = homePrice*Math.pow(1+appreciation/100,years);
  const equity = futureValue - principal*(Math.pow(1+mr,n)-Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1);
  const buyEquity = futureValue - (principal * (Math.pow(1+mr,n) - Math.pow(1+mr,monthlyPayment/principal*n)) / (Math.pow(1+mr,n)-1));
  const netBuyCost = totalBuyCost - futureValue + homePrice;
  // Total rent with annual increases
  let totalRentCost = 0;
  let monthlyRent = rent;
  for(let y=0;y<years;y++){ totalRentCost+=monthlyRent*12; monthlyRent*=(1+rentIncrease/100); }
  const better = netBuyCost < totalRentCost ? 'buying' : 'renting';
  const savings = Math.abs(totalRentCost - netBuyCost);
  // Break even: find year when cumulative buy cost < cumulative rent cost
  let breakEvenYears = 0;
  let cumBuy = down;
  let cumRent = 0;
  monthlyRent = rent;
  for(let y=1;y<=30;y++){
    cumBuy += (monthlyPayment + annualPropTax/12 + annualMaint/12)*12;
    cumBuy -= (homePrice*Math.pow(1+appreciation/100,y) - homePrice); // appreciation gain
    cumRent += monthlyRent*12;
    monthlyRent *= (1+rentIncrease/100);
    if(cumBuy<=cumRent&&breakEvenYears===0) breakEvenYears=y;
  }
  return {monthlyPayment,totalBuyCost,totalRentCost,buyEquity:futureValue-homePrice*0.3,netBuyCost,better,savings,breakEvenYears};
}

export default function RentVsBuy(){
  const [homePrice,   setHomePrice]   = useState(400000);
  const [downPct,     setDownPct]     = useState(20);
  const [rate,        setRate]        = useState(6.5);
  const [rent,        setRent]        = useState(2000);
  const [years,       setYears]       = useState(7);
  const [appreciation,setAppreciation]= useState(3);
  const [rentIncrease,setRentIncrease]= useState(3);
  const [propTax,     setPropTax]     = useState(1.2);
  const [maintenance, setMaintenance] = useState(1);
  const [res,         setRes]         = useState<Result|null>(null);

  useEffect(()=>{
    setRes(compute(homePrice,downPct,rate,rent,years,appreciation,rentIncrease,propTax,maintenance));
  },[homePrice,downPct,rate,rent,years,appreciation,rentIncrease,propTax,maintenance]);

  const NumInput = ({label,value,onChange,prefix,suffix,min,max,step,hint}:{label:string;value:number;onChange:(v:number)=>void;prefix?:string;suffix?:string;min?:number;max?:number;step?:number;hint?:string}) => (
    <div style={{marginBottom:14}}>
      <label style={lbl}>{label}</label>
      <div style={{position:'relative'}}>
        {prefix&&<span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:14,pointerEvents:'none'}}>{prefix}</span>}
        <input
          style={{...inp, paddingLeft:prefix?28:12, paddingRight:suffix?36:12}}
          type="number" min={min} max={max} step={step||1}
          value={value||''}
          onChange={e=>onChange(parseFloat(e.target.value)||0)}
        />
        {suffix&&<span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:14,pointerEvents:'none'}}>{suffix}</span>}
      </div>
      {hint&&<p style={{fontSize:11,color:'#9ca3af',margin:'3px 0 0'}}>{hint}</p>}
    </div>
  );

  const isBuying = res?.better==='buying';

  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>
      <style>{`@media(max-width:700px){.rvb-grid{grid-template-columns:1fr!important;}}`}</style>

      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:'#fff',padding:'32px 16px 40px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:28,fontWeight:700,margin:'12px 0 8px',color:'#fff'}}>Rent vs Buy Calculator</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 16px'}}>Find out whether buying or renting makes more financial sense for you. Includes appreciation, property tax, rent increases, and break-even analysis.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Break-Even Analysis','Home Appreciation','Rent Increases','Property Tax','True Cost Comparison'].map(t=>(
              <span key={t} style={{background:'rgba(255,255,255,.15)',fontSize:12,padding:'4px 12px',borderRadius:20,color:'#fff'}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(0,3fr)',gap:20}} className="rvb-grid">

          {/* LEFT */}
          <div>
            <div style={{...card}}>
              <p style={{fontSize:12,fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 14px',paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>Home Details</p>
              <NumInput label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" min={50000} max={5000000} step={5000}/>
              <NumInput label="Down Payment %" value={downPct} onChange={setDownPct} suffix="%" min={0} max={100} step={1} hint={`$${Math.round(homePrice*downPct/100).toLocaleString()} down`}/>
              <NumInput label="Mortgage Rate" value={rate} onChange={setRate} suffix="%" min={1} max={15} step={0.1}/>
              <NumInput label="Home Appreciation /yr" value={appreciation} onChange={setAppreciation} suffix="%" min={0} max={20} step={0.1} hint="US avg ~3-4%/yr"/>
              <NumInput label="Property Tax Rate" value={propTax} onChange={setPropTax} suffix="%" min={0} max={5} step={0.1} hint={`~${fmt(homePrice*propTax/100)}/yr`}/>
              <NumInput label="Maintenance /yr" value={maintenance} onChange={setMaintenance} suffix="%" min={0} max={5} step={0.1} hint={`~${fmt(homePrice*maintenance/100)}/yr`}/>
            </div>
            <div style={{...card}}>
              <p style={{fontSize:12,fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 14px',paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>Rent & Comparison</p>
              <NumInput label="Monthly Rent" value={rent} onChange={setRent} prefix="$" min={500} max={20000} step={100}/>
              <NumInput label="Annual Rent Increase" value={rentIncrease} onChange={setRentIncrease} suffix="%" min={0} max={20} step={0.5} hint="US avg ~3%/yr"/>
              <NumInput label="Years to Compare" value={years} onChange={setYears} min={1} max={30} step={1}/>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {res&&(
              <>
                {/* Hero verdict */}
                <div style={{background:isBuying?`linear-gradient(135deg,#166534,#16a34a)`:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,borderRadius:16,padding:24,color:'#fff',marginBottom:16,boxShadow:'0 4px 20px rgba(0,0,0,.2)'}}>
                  <p style={{fontSize:11,fontWeight:600,letterSpacing:'.1em',color:'rgba(255,255,255,.7)',margin:'0 0 6px',textTransform:'uppercase'}}>Better Option Over {years} Years</p>
                  <div style={{fontSize:52,fontWeight:800,lineHeight:1,margin:'0 0 6px',textTransform:'capitalize'}}>{res.better}</div>
                  <p style={{fontSize:16,color:'rgba(255,255,255,.85)',margin:'0 0 16px'}}>saves you <strong>{fmt(res.savings)}</strong> over {years} years</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {[
                      ['Monthly Payment',fmt(res.monthlyPayment)],
                      ['True Buy Cost',fmt(res.netBuyCost)],
                      ['Total Rent Cost',fmt(res.totalRentCost)],
                    ].map(([l,v])=>(
                      <div key={l} style={{background:'rgba(255,255,255,.15)',borderRadius:10,padding:'10px 12px'}}>
                        <p style={{fontSize:11,color:'rgba(255,255,255,.7)',margin:'0 0 2px'}}>{l}</p>
                        <p style={{fontSize:14,fontWeight:700,margin:0}}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost breakdown */}
                <div style={{...card}}>
                  <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 14px'}}>Cost Breakdown over {years} Years</p>
                  {[
                    {label:'Buying: Mortgage payments',amount:res.monthlyPayment*years*12,color:'#2563eb'},
                    {label:'Buying: Down payment',amount:homePrice*downPct/100,color:'#60a5fa'},
                    {label:'Buying: Property tax + maintenance',amount:(homePrice*propTax/100+homePrice*maintenance/100)*years,color:'#93c5fd'},
                    {label:'Minus: Home equity gained',amount:-(homePrice*Math.pow(1+appreciation/100,years)-homePrice),color:'#16a34a'},
                    {label:'Renting: Total rent paid',amount:res.totalRentCost,color:'#f97316'},
                  ].map(({label,amount,color})=>{
                    const maxAmt = Math.max(res.totalBuyCost, res.totalRentCost);
                    const pct = Math.min(100, Math.abs(amount)/maxAmt*100);
                    return(
                      <div key={label} style={{marginBottom:10}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                          <span style={{fontSize:12,color:'#374151'}}>{label}</span>
                          <span style={{fontSize:12,fontWeight:700,color:amount<0?'#16a34a':color}}>{amount<0?'-':''}{fmt(Math.abs(amount))}</span>
                        </div>
                        <div style={{height:6,borderRadius:3,background:'#f1f5f9',overflow:'hidden'}}>
                          <div style={{width:pct+'%',height:'100%',background:color,borderRadius:3}}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Break-even */}
                <div style={{...card, background: res.breakEvenYears>0&&res.breakEvenYears<=years?'#f0fdf4':'#f8fafc', borderColor: res.breakEvenYears>0&&res.breakEvenYears<=years?'#86efac':C.border}}>
                  <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 10px'}}>Break-Even Analysis</p>
                  {res.breakEvenYears>0?(
                    <p style={{fontSize:15,color:res.breakEvenYears<=years?'#166534':'#374151',margin:0,lineHeight:1.6}}>
                      Buying becomes cheaper than renting after <strong>{res.breakEvenYears} years</strong>.
                      {res.breakEvenYears<=years?' You plan to stay longer than the break-even point, so buying makes more sense.'
                      :` You plan to stay ${years} years, which is before the break-even point of ${res.breakEvenYears} years.`}
                    </p>
                  ):(
                    <p style={{fontSize:14,color:'#374151',margin:0}}>Renting is financially better across the full comparison period at current inputs.</p>
                  )}
                </div>

                {/* Key assumptions */}
                <div style={{...card,background:'#f8fafc'}}>
                  <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 10px'}}>Your Assumptions</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,fontSize:12,color:'#374151'}}>
                    {[
                      [`Home price`,fmt(homePrice)],
                      [`Down payment`,`${downPct}% (${fmt(homePrice*downPct/100)})`],
                      [`Mortgage rate`,`${rate}%`],
                      [`Appreciation`,`${appreciation}%/yr`],
                      [`Monthly rent`,fmt(rent)],
                      [`Rent increases`,`${rentIncrease}%/yr`],
                      [`Prop. tax`,`${propTax}%/yr`],
                      [`Maintenance`,`${maintenance}%/yr`],
                    ].map(([k,v])=>(
                      <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:`1px solid ${C.border}`}}>
                        <span style={{color:'#6b7280'}}>{k}</span>
                        <strong style={{color:'#111827'}}>{v}</strong>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:11,color:'#9ca3af',margin:'10px 0 0'}}>Results are estimates. Consult a financial advisor before making real estate decisions.</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{background:'linear-gradient(135deg,#eff6ff,#eef2ff)',borderRadius:16,padding:20,border:'1px solid #bfdbfe',marginTop:20}}>
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