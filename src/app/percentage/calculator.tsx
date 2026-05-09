// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';

const C = { blue:'#2563eb', darkBlue:'#0f172a', gray:'#6b7280', border:'#e2e8f0', white:'#ffffff', light:'#f8fafc', text:'#111827', accent:'#7c3aed', emerald:'#059669' };
const card: React.CSSProperties = { background:'rgba(255,255,255,0.85)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderRadius:20, padding:24, boxShadow:'0 4px 24px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)', border:'1px solid rgba(226,232,240,0.8)', marginBottom:20, transition:'all 0.3s ease' };
const inp: React.CSSProperties  = { width:'100%', border:`1px solid #cbd5e1`, borderRadius:10, padding:'10px 12px', fontSize:15, outline:'none', background:C.white, boxSizing:'border-box', color:'#111827', fontWeight:600, textAlign:'right' } as React.CSSProperties;
const lbl: React.CSSProperties = { display:'block', fontSize:12, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 } as React.CSSProperties;
const resultStyle: React.CSSProperties = { fontSize:28, fontWeight:700, color:C.blue, textAlign:'center', padding:'16px', background:'#eff6ff', borderRadius:12, border:'1px solid #bfdbfe', margin:'12px 0' };

const ALL_CALCS = [
  ['/mortgage','Mortgage Calculator'],['/qualify','Mortgage Qualifier'],['/rent-vs-buy','Rent vs Buy'],
  ['/loan','Loan & EMI'],['/salary','Salary Calculator'],['/tax','Income Tax'],
  ['/compound-interest','Compound Interest'],['/bmi','BMI Calculator'],['/tdee','TDEE & Calories'],
  ['/age','Age Calculator'],['/tip','Tip Calculator'],
];

function fmt(n:number):string {
  if(!isFinite(n)||isNaN(n)) return 'N/A';
  const abs=Math.abs(n);
  if(abs>=1000) return n.toLocaleString('en-US',{maximumFractionDigits:2});
  return n.toFixed(4).replace(/\.?0+$/,'');
}

export default function PercentageCalculator(){
  // 1. What is X% of Y?
  const [p1,setP1]=useState('15'); const [v1,setV1]=useState('200');
  // 2. X is what % of Y?
  const [v2a,setV2a]=useState('30'); const [v2b,setV2b]=useState('200');
  // 3. % change from X to Y
  const [c3a,setC3a]=useState('80'); const [c3b,setC3b]=useState('100');
  // 4. % difference
  const [d4a,setD4a]=useState('50'); const [d4b,setD4b]=useState('75');
  // 5. Increase/decrease X by Y%
  const [v5,setV5]=useState('100'); const [p5,setP5]=useState('20'); const [mode5,setMode5]=useState<'increase'|'decrease'>('increase');
  // 6. Tip calculator
  const [bill,setBill]=useState('85'); const [tipPct,setTipPct]=useState('18'); const [people,setPeople]=useState('2');
  // 7. Discount
  const [price,setPrice]=useState('120'); const [disc,setDisc]=useState('25');
  // 8. Sales tax
  const [preTax,setPreTax]=useState('100'); const [taxRate,setTaxRate]=useState('8.5');

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const _p1 = sp.get('p1'); if (_p1) setP1(_p1 as any);
    const _v1 = sp.get('v1'); if (_v1) setV1(_v1 as any);
    const _v2a = sp.get('v2a'); if (_v2a) setV2a(_v2a as any);
    const _v2b = sp.get('v2b'); if (_v2b) setV2b(_v2b as any);
  }, []);
  const shareCalc = () => {
    const params = new URLSearchParams({ 'p1': String(p1), 'v1': String(v1), 'v2a': String(v2a), 'v2b': String(v2b) });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    window.history.replaceState({}, '', '?' + params.toString());
  };

  const r1 = (parseFloat(p1)||0)/100*(parseFloat(v1)||0);
  const r2 = (parseFloat(v2b)||0)>0?(parseFloat(v2a)||0)/(parseFloat(v2b)||0)*100:0;
  const r3a=parseFloat(c3a)||0; const r3b=parseFloat(c3b)||0;
  const r3=r3a!==0?(r3b-r3a)/Math.abs(r3a)*100:0;
  const r4a=parseFloat(d4a)||0; const r4b=parseFloat(d4b)||0;
  const r4=((r4a+r4b)/2)!==0?Math.abs(r4a-r4b)/((r4a+r4b)/2)*100:0;
  const r5base=parseFloat(v5)||0; const r5pct=(parseFloat(p5)||0)/100;
  const r5=mode5==='increase'?r5base*(1+r5pct):r5base*(1-r5pct);
  const billAmt=parseFloat(bill)||0; const tipAmt=billAmt*(parseFloat(tipPct)||0)/100;
  const total=billAmt+tipAmt; const perPerson=total/(parseInt(people)||1);
  const discAmt=(parseFloat(price)||0)*(parseFloat(disc)||0)/100;
  const afterDisc=(parseFloat(price)||0)-discAmt;
  const taxAmt=(parseFloat(preTax)||0)*(parseFloat(taxRate)||0)/100;
  const afterTax=(parseFloat(preTax)||0)+taxAmt;

  const CalcBlock=({title,formula,result,children,color='#2563eb'}:{title:string;formula:string;result:string;children:React.ReactNode;color?:string})=>(
    <div style={{...card}}>
      <p style={{fontSize:13,fontWeight:700,color:'#111827',margin:'0 0 4px'}}>{title}</p>
      <p style={{fontSize:11,color:C.gray,margin:'0 0 12px',fontStyle:'italic'}}>{formula}</p>
      {children}
      <div style={{...resultStyle,color,borderColor:color==='#2563eb'?'#bfdbfe':color==='#16a34a'?'#86efac':'#fcd34d',background:color==='#2563eb'?'#eff6ff':color==='#16a34a'?'#f0fdf4':'#fffbeb'}}>
        {result}
      </div>
    </div>
  );

  const Row=({children}:{children:React.ReactNode})=>(
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,flexWrap:'wrap'}}>{children}</div>
  );
  const N=({value,onChange,width='90px',suffix=''}:{value:string;onChange:(v:string)=>void;width?:string;suffix?:string})=>(
    <div style={{display:'flex',alignItems:'center',gap:4}}>
      <input style={{...inp,width,padding:'8px 10px'}} type="number" value={value} onChange={e=>onChange(e.target.value)}/>
      {suffix&&<span style={{fontSize:14,color:'#374151',fontWeight:500,whiteSpace:'nowrap'}}>{suffix}</span>}
    </div>
  );
  const Txt=({children}:{children:React.ReactNode})=>(<span style={{fontSize:14,color:'#374151',whiteSpace:'nowrap'}}>{children}</span>);

  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)',minHeight:'100vh'}}>
      <style>{`@media(max-width:680px){.pct-grid{grid-template-columns:1fr!important;}}`}</style>

      <div style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)',color:C.white,padding:'32px 16px 40px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:28,fontWeight:700,margin:'12px 0 8px',color:C.white}}>Percentage Calculator</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 16px'}}>8 percentage calculators in one. Percentage of, percentage change, difference, discount, sales tax, tip calculator, and more.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['% of a Number','% Change','% Difference','Discount','Sales Tax','Tip Calculator'].map(t=>(
              <span key={t} style={{background:'rgba(255,255,255,.15)',fontSize:12,padding:'4px 12px',borderRadius:20,color:C.white}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}} className="pct-grid">

          <CalcBlock title="1. What is X% of Y?" formula="Result = (X / 100) x Y"
            result={`${fmt(r1)}`}>
            <Row><Txt>What is</Txt><N value={p1} onChange={setP1} suffix="%"/><Txt>of</Txt><N value={v1} onChange={setV1}/><Txt>?</Txt></Row>
          </CalcBlock>

          <CalcBlock title="2. X is what percent of Y?" formula="Result = (X / Y) x 100"
            result={`${fmt(r2)}%`}>
            <Row><N value={v2a} onChange={setV2a}/><Txt>is what % of</Txt><N value={v2b} onChange={setV2b}/><Txt>?</Txt></Row>
          </CalcBlock>

          <CalcBlock title="3. Percentage Change" formula="Change = ((New - Old) / |Old|) x 100"
            result={`${r3>=0?'+':''}${fmt(r3)}%`}
            color={r3>=0?'#16a34a':'#dc2626'}>
            <Row><Txt>From</Txt><N value={c3a} onChange={setC3a}/><Txt>to</Txt><N value={c3b} onChange={setC3b}/></Row>
            <p style={{fontSize:12,color:C.gray,margin:'4px 0 0'}}>{r3>=0?'Increase':'Decrease'} of {fmt(Math.abs(r3))}%</p>
          </CalcBlock>

          <CalcBlock title="4. Percentage Difference" formula="Diff = |A - B| / ((A + B) / 2) x 100"
            result={`${fmt(r4)}%`}
            color='#d97706'>
            <Row><Txt>Between</Txt><N value={d4a} onChange={setD4a}/><Txt>and</Txt><N value={d4b} onChange={setD4b}/></Row>
          </CalcBlock>

          <CalcBlock title="5. Increase or Decrease by %" formula="Result = Value x (1 +/- Rate)"
            result={`${fmt(r5)}`}>
            <Row>
              <div style={{display:'flex',borderRadius:8,overflow:'hidden',border:`1px solid ${C.border}`}}>
                {(['increase','decrease'] as const).map(m=>(
                  <button key={m} onClick={()=>setMode5(m)} style={{padding:'6px 12px',fontSize:12,fontWeight:600,border:'none',background:mode5===m?C.blue:C.white,color:mode5===m?C.white:'#374151',cursor:'pointer',textTransform:'capitalize'}}>{m}</button>
                ))}
              </div>
            </Row>
            <Row><N value={v5} onChange={setV5}/><Txt>by</Txt><N value={p5} onChange={setP5} suffix="%"/></Row>
          </CalcBlock>

          <CalcBlock title="6. Tip Calculator" formula="Tip = Bill x Rate | Per person = Total / People"
            result={`${fmtDollar(tipAmt)} tip / ${fmtDollar(perPerson)} per person`}>
            <Row><Txt>Bill</Txt><N value={bill} onChange={setBill} width="90px"/><Txt>Tip</Txt><N value={tipPct} onChange={setTipPct} suffix="%"/><Txt>Split</Txt><N value={people} onChange={setPeople} width="55px"/></Row>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:8}}>
              {[['Bill',fmtDollar(billAmt)],['Tip',fmtDollar(tipAmt)],['Total',fmtDollar(total)]].map(([l,v])=>(
                <div key={l} style={{textAlign:'center',padding:'6px',background:'#f8fafc',borderRadius:8}}>
                  <p style={{fontSize:10,color:C.gray,margin:'0 0 2px'}}>{l}</p>
                  <p style={{fontSize:13,fontWeight:700,color:'#111827',margin:0}}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
              {[15,18,20,22,25].map(t=>(
                <button key={t} onClick={()=>setTipPct(String(t))} style={{padding:'4px 10px',fontSize:11,fontWeight:600,borderRadius:6,border:`1px solid ${tipPct===String(t)?C.blue:C.border}`,background:tipPct===String(t)?C.blue:C.white,color:tipPct===String(t)?C.white:'#374151',cursor:'pointer'}}>{t}%</button>
              ))}
            </div>
          </CalcBlock>

          <CalcBlock title="7. Discount Calculator" formula="Sale Price = Original x (1 - Discount%)"
            result={`${fmtDollar(afterDisc)} (save ${fmtDollar(discAmt)})`}
            color='#16a34a'>
            <Row><N value={price} onChange={setPrice}/><Txt>discounted by</Txt><N value={disc} onChange={setDisc} suffix="%"/></Row>
          </CalcBlock>

          <CalcBlock title="8. Sales Tax Calculator" formula="Total = Price x (1 + Tax Rate)"
            result={`${fmtDollar(afterTax)} total (${fmtDollar(taxAmt)} tax)`}
            color='#d97706'>
            <Row><N value={preTax} onChange={setPreTax}/><Txt>with</Txt><N value={taxRate} onChange={setTaxRate} suffix="% tax"/></Row>
          </CalcBlock>
        </div>

        {/* How it works */}
        <div style={{...card,marginTop:8}}>
          <h2 style={{fontSize:16,fontWeight:700,color:'#111827',marginBottom:14}}>Percentage Formulas Reference</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}} className="pct-grid">
            {[
              ['X% of Y','(X / 100) x Y'],
              ['X is what % of Y','(X / Y) x 100'],
              ['% Change','((New - Old) / |Old|) x 100'],
              ['% Difference','|A - B| / ((A + B) / 2) x 100'],
              ['Increase by %','Value x (1 + Rate / 100)'],
              ['Decrease by %','Value x (1 - Rate / 100)'],
              ['Discount','Price x (1 - Discount / 100)'],
              ['Sales Tax','Price x (1 + Tax / 100)'],
            ].map(([label,formula])=>(
              <div key={label} style={{padding:'8px 12px',background:'#f8fafc',borderRadius:9,border:`1px solid ${C.border}`}}>
                <p style={{fontSize:12,fontWeight:700,color:'#111827',margin:'0 0 2px'}}>{label}</p>
                <p style={{fontSize:11,color:C.gray,margin:0,fontFamily:'monospace'}}>{formula}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:'linear-gradient(135deg,#eff6ff,#eef2ff)',borderRadius:16,padding:20,border:'1px solid #bfdbfe',marginTop:8}}>
          <p style={{fontSize:18,fontWeight:700,color:'#111827',marginBottom:4}}>Related Calculators</p>
          <p style={{fontSize:13,color:'#64748b',marginBottom:16}}>Tools that work great alongside this one</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10}}>

              <a key="/tip" href="/tip" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>Tip Calculator →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Quick tips with bill splitting</span>
              </a>
              <a key="/tax" href="/tax" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>Income Tax Calculator →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Tax bracket percentage math</span>
              </a>
              <a key="/compound-interest" href="/compound-interest" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>Compound Interest →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Percentage growth in action</span>
              </a>
          </div>
        </div>
        <div style={{marginTop:20}}>
          <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:12}}>All freecalcs.io Calculators</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {ALL_CALCS.map(([href,name])=>(<a key={href} href={href} style={{background:C.white,fontSize:13,color:C.blue,fontWeight:500,padding:'8px 16px',borderRadius:10,border:'1px solid #bfdbfe',textDecoration:'none'}}>{name}</a>))}
          </div>
        </div>
      </div>
    </div>
  );
}

function fmtDollar(n:number):string{
  return '$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}