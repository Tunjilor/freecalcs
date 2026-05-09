// @ts-nocheck
'use client';
import { useState, useEffect, useCallback } from 'react';

// 2026 Federal Tax Brackets (One Big Beautiful Bill / TCJA extended)
const BRACKETS: Record<string, [number, number, number][]> = {
  single:      [[0,12400,.10],[12400,50000,.12],[50000,100525,.22],[100525,197300,.24],[197300,250525,.32],[250525,626350,.35],[626350,Infinity,.37]],
  married:     [[0,24800,.10],[24800,100000,.12],[100000,201050,.22],[201050,394600,.24],[394600,501050,.32],[501050,751600,.35],[751600,Infinity,.37]],
  married_sep: [[0,12400,.10],[12400,50000,.12],[50000,100525,.22],[100525,197300,.24],[197300,250525,.32],[250525,375800,.35],[375800,Infinity,.37]],
  hoh:         [[0,18750,.10],[18750,63100,.12],[63100,100500,.22],[100500,197300,.24],[197300,250500,.32],[250500,626350,.35],[626350,Infinity,.37]],
};

// 2026 Standard Deductions
const STD_DED: Record<string, number> = {
  single:16100, married:32200, married_sep:16100, hoh:24150
};

// 2026 Long-term capital gains brackets (single)
const LTCG_BRACKETS: Record<string, [number, number, number][]> = {
  single:      [[0,48350,0],[48350,533400,.15],[533400,Infinity,.20]],
  married:     [[0,96700,0],[96700,600050,.15],[600050,Infinity,.20]],
  married_sep: [[0,48350,0],[48350,300000,.15],[300000,Infinity,.20]],
  hoh:         [[0,64750,0],[64750,566700,.15],[566700,Infinity,.20]],
};

function calcFed(taxable: number, filing: string): number {
  const b = BRACKETS[filing] || BRACKETS.single;
  let tax = 0;
  for (const [lo, hi, rate] of b) {
    if (taxable <= lo) break;
    tax += (Math.min(taxable, hi) - lo) * rate;
  }
  return Math.max(0, tax);
}

function calcLTCG(ltcgAmt: number, ordinaryIncome: number, filing: string): number {
  const b = LTCG_BRACKETS[filing] || LTCG_BRACKETS.single;
  let tax = 0;
  let stackBase = ordinaryIncome;
  for (const [lo, hi, rate] of b) {
    if (stackBase >= hi) continue;
    const taxableAtRate = Math.min(stackBase + ltcgAmt, hi) - Math.max(stackBase, lo);
    if (taxableAtRate > 0) tax += taxableAtRate * rate;
  }
  return Math.max(0, tax);
}

function getMarginalRate(taxable: number, filing: string): number {
  const b = BRACKETS[filing] || BRACKETS.single;
  for (const [lo, hi, rate] of b) {
    if (taxable <= hi) return rate;
  }
  return 0.37;
}

function parseMoney(s: any): number { const str = String(s); return parseFloat(str.replace(/[^0-9.]/g, '')) || 0; }
function fmtInput(s: string): string {
  // Strip everything except digits and first decimal point
  const clean = s.replace(/[^0-9.]/g, '');
  const parts = clean.split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? intPart + '.' + parts.slice(1).join('') : intPart;
}
function fmtD(n: number): string { return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtDInt(n: number): string { return '$' + Math.round(Math.abs(n)).toLocaleString('en-US'); }

const ALL_CALCS = [
  ['/mortgage','Mortgage Calculator'],['/qualify','Mortgage Qualifier'],['/rent-vs-buy','Rent vs Buy'],
  ['/loan','Loan & EMI'],['/salary','Salary & Take-Home'],['/compound-interest','Compound Interest'],
  ['/percentage','Percentage Calc'],['/bmi','BMI Calculator'],['/tdee','TDEE & Calories'],
  ['/age','Age Calculator'],['/tip','Tip Calculator'],
];

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', gray:'#6b7280', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc', text:'#1f2937', textLight:'#374151' };
const card: React.CSSProperties = { background:'rgba(255,255,255,0.85)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderRadius:20, padding:24, boxShadow:'0 4px 24px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)', border:'1px solid rgba(226,232,240,0.8)', marginBottom:20, transition:'all 0.3s ease' };
const inp: React.CSSProperties = { width:'100%', border:'1.5px solid #e2e8f0', borderRadius:12, padding:'12px 14px', fontSize:15, outline:'none', background:'#f8fafc', boxSizing:'border-box', color:'#111827', fontWeight:600, transition:'all 0.2s ease', letterSpacing:'-0.01em' };
const lbl: React.CSSProperties = { display:'block', fontSize:12, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 } as React.CSSProperties;
const btnBase: React.CSSProperties = { flex:1, padding:'10px 0', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', transition:'all .15s' };

interface TaxResult {
  agi: number;
  deduction: number;
  taxableIncome: number;
  federalTax: number;
  ltcgTax: number;
  selfEmployTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  afterTax: number;
  withheld: number;
  refundOrOwed: number;
}

function compute(
  filing: string, wages: any, selfEmp: any, interest: any,
  dividends: any, ltcg: any, other: any,
  useStd: boolean, itemized: any, k401: any, hsa: any, studentLoan: any,
  children: any, withheld: any, taxYear: string
): TaxResult {
  const wagesAmt    = parseMoney(wages);
  const selfEmpAmt  = parseMoney(selfEmp);
  const interestAmt = parseMoney(interest);
  const dividendsAmt= parseMoney(dividends);
  const ltcgAmt     = parseMoney(ltcg);
  const otherAmt    = parseMoney(other);
  const k401Amt     = parseMoney(k401);
  const hsaAmt      = parseMoney(hsa);
  const slAmt       = parseMoney(studentLoan);
  const withheldAmt = parseMoney(withheld);
  const childrenN   = parseInt(children) || 0;

  // Self-employment tax (15.3% on 92.35% of net SE income)
  const seTaxBase = selfEmpAmt * 0.9235;
  const selfEmployTax = seTaxBase * 0.153;
  const seDeduction = selfEmployTax / 2; // deductible half

  // AGI
  const totalIncome = wagesAmt + selfEmpAmt + interestAmt + dividendsAmt + ltcgAmt + otherAmt;
  const aboveLineDed = k401Amt + hsaAmt + Math.min(slAmt, 2500) + seDeduction;
  const agi = Math.max(0, totalIncome - aboveLineDed);

  // Below-line deductions
  const stdDed = STD_DED[filing] || STD_DED.single;
  const itemAmt = parseMoney(itemized);
  const deduction = useStd ? stdDed : Math.max(stdDed, itemAmt);

  // Ordinary taxable income (excludes LTCG — stacked separately)
  const ordinaryIncome = Math.max(0, agi - deduction - ltcgAmt);
  const taxableIncome  = Math.max(0, agi - deduction);

  // Federal tax on ordinary income only
  const federalTax = calcFed(ordinaryIncome, filing);

  // LTCG tax (stacked on top of ordinary)
  const ltcgTax = calcLTCG(ltcgAmt, ordinaryIncome, filing);

  // Child tax credit ($2,200 per qualifying child, up to tax liability)
  const childCredit = Math.min(childrenN * 2200, federalTax + ltcgTax);

  const totalFedTax = Math.max(0, federalTax + ltcgTax - childCredit);
  const totalTax    = totalFedTax + selfEmployTax;

  const effectiveRate = totalIncome > 0 ? totalFedTax / totalIncome : 0;
  const marginalRate  = getMarginalRate(ordinaryIncome, filing);
  const afterTax      = Math.max(0, totalIncome - totalTax);
  const refundOrOwed  = withheldAmt - totalFedTax;

  // Bracket breakdown
  const bData = BRACKETS[filing] || BRACKETS.single;
  const brackets = bData.map(([lo, hi, rate]) => {
    const taxable = Math.max(0, Math.min(ordinaryIncome, hi === Infinity ? ordinaryIncome : hi) - lo);
    return { rate, min: lo, max: hi === Infinity ? ordinaryIncome : hi, taxable, tax: taxable * rate };
  }).filter(b => b.taxable > 0 || ordinaryIncome > b.min);

  return { agi, deduction, taxableIncome, federalTax, ltcgTax, selfEmployTax, totalTax, effectiveRate, marginalRate, afterTax, withheld: withheldAmt, refundOrOwed };
}

export default function TaxCalculator() {
  const [filing, setFiling]       = useState('single');
  const [tab, setTab]             = useState<'summary'|'brackets'|'planning'>('summary');
  const [useStd, setUseStd]       = useState(true);

  // Income
  const [wages, setWages]         = useState(75000);
  const [selfEmp, setSelfEmp]     = useState('0');
  const [interest, setInterest]   = useState('0');
  const [dividends, setDividends] = useState('0');
  const [ltcg, setLtcg]           = useState('0');
  const [other, setOther]         = useState('0');

  // Deductions
  const [itemized, setItemized]   = useState('0');
  const [k401, setK401]           = useState('0');
  const [hsa, setHsa]             = useState('0');
  const [studentLoan, setStudentLoan] = useState('0');

  // Credits / withholding
  const [children, setChildren]   = useState('0');
  const [withheld, setWithheld]   = useState('0');

  const [res, setRes] = useState<TaxResult | null>(null);

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const _filing = sp.get('filing'); if (_filing) setFiling(_filing as any);
    const _wages = sp.get('wages'); if (_wages) setWages(Number(_wages));
    const _selfEmp = sp.get('selfEmp'); if (_selfEmp) setSelfEmp(_selfEmp as any);
    const _interest = sp.get('interest'); if (_interest) setInterest(_interest as any);
    const _dividends = sp.get('dividends'); if (_dividends) setDividends(_dividends as any);
    const _ltcg = sp.get('ltcg'); if (_ltcg) setLtcg(_ltcg as any);
  }, []);
  const shareCalc = () => {
    const params = new URLSearchParams({ 'filing': String(filing), 'wages': String(wages), 'selfEmp': String(selfEmp), 'interest': String(interest), 'dividends': String(dividends), 'ltcg': String(ltcg) });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    window.history.replaceState({}, '', '?' + params.toString());
  };

  const run = useCallback(() => {
    setRes(compute(filing, wages, selfEmp, interest, dividends, ltcg, other, useStd, itemized, k401, hsa, studentLoan, children, withheld, '2026'));
  }, [filing, wages, selfEmp, interest, dividends, ltcg, other, useStd, itemized, k401, hsa, studentLoan, children, withheld]);

  useEffect(() => { run(); }, [run]);

  const MoneyIn = ({ value, onChange, placeholder = '0' }: { value: string|number; onChange: (v: string) => void; placeholder?: string }) => (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 14, pointerEvents: 'none' }}>$</span>
      <input
        style={{ ...inp, paddingLeft: 28 }}
        type="number"
        inputMode="numeric"
        min="0"
        placeholder={placeholder}
        value={value||''}
        onChange={e => {
          const raw = e.target.value.replace(/[^0-9.]/g, '');
          onChange(raw);
        }}
      />
    </div>
  );

  const Section = ({ title, id, children: ch }: { title: string; id?: string; children: React.ReactNode }) => (
    <div id={id} style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px', paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>{title}</p>
      {ch}
    </div>
  );

  const bData = res ? (BRACKETS[filing] || BRACKETS.single).map(([lo, hi, rate]) => {
    const taxable = Math.max(0, Math.min(
      Math.max(0, res.taxableIncome - parseMoney(ltcg)),
      hi === Infinity ? Math.max(0, res.taxableIncome - parseMoney(ltcg)) : hi) - lo);
    return { rate, lo, hi, taxable, tax: taxable * rate };
  }).filter(b => b.lo < Math.max(0, res.taxableIncome - parseMoney(ltcg))) : [];

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', background: 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      <style>{`html{scroll-behavior:smooth;} [id]{scroll-margin-top:70px;}`}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.darkBlue},${C.blue})`, color: C.white, padding: '32px 16px 40px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <a href="/" style={{ color: '#93c5fd', fontSize: 13, textDecoration: 'none' }}>&lt;- freecalcs.io</a>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '12px 0 8px', color: C.white }}>Federal Income Tax Calculator <span style={{ background:'rgba(255,255,255,.2)', fontSize:18, padding:'2px 10px', borderRadius:8, verticalAlign:'middle' }}>2026</span></h1>
          <p style={{ color: '#93c5fd', fontSize: 14, margin: '0 0 16px' }}>Estimate your 2026 federal tax, refund, bracket breakdown, and effective rate. Includes self-employment tax, capital gains, and credits.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              ['Income Fields', '#income-section', null],
              ['Capital Gains', '#capital-gains', null],
              ['Self-Employment', '#self-employment', null],
              ['Credits & Refund', '#credits', null],
              ['Bracket Visualizer', '#brackets', 'brackets'],
              ['Tax Tips', '#tax-tips', 'planning'],
            ].map(([t, href, switchTab]) => (
              <a key={t as string} href={href as string}
                onClick={() => { if (switchTab) setTab(switchTab as 'summary'|'brackets'|'planning'); }}
                style={{ background:'rgba(255,255,255,.15)', fontSize:12, padding:'4px 12px', borderRadius:20, color:C.white, textDecoration:'none', cursor:'pointer', transition:'background .15s' }}
                onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,.28)')}
                onMouseLeave={e => (e.currentTarget.style.background='rgba(255,255,255,.15)')}>{t}</a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,3fr)', gap: 20 }} className="tax-grid">
          <style>{`@media(max-width:700px){.tax-grid{grid-template-columns:1fr!important;}}`}</style>

          {/* LEFT: Inputs */}
          <div>
            <div style={{ ...card }}>

              {/* Filing Status as button group */}
              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>Filing Status</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  {[['single','Single'],['married','Married Jointly'],['married_sep','Married Separately'],['hoh','Head of Household']].map(([val,label]) => (
                    <button key={val} onClick={() => setFiling(val)}
                      style={{ padding:'9px 10px', fontSize:13, fontWeight:600, borderRadius:9, border:`1px solid ${filing===val?C.blue:C.border}`, background:filing===val?C.blue:C.white, color:filing===val?C.white:C.gray, cursor:'pointer', transition:'all .15s', textAlign:'center' }}>
                      {label}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop:10, fontSize:12, color:C.gray, background:'#f0fdf4', borderRadius:8, padding:'8px 12px' }}>
                  2026 Standard deduction: <strong style={{ color:'#166534' }}>{fmtDInt(STD_DED[filing]||16100)}</strong>
                </div>
              </div>

              <div id="income-section">
              <Section title="Income">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><label style={lbl}>W-2 Wages / Salary</label><MoneyIn value={wages} onChange={setWages} /></div>
                  <div id="self-employment"><label style={lbl}>Self-Employment Income</label><MoneyIn value={selfEmp} onChange={setSelfEmp} /></div>
                  <div><label style={lbl}>Interest Income</label><MoneyIn value={interest} onChange={setInterest} /></div>
                  <div><label style={lbl}>Ordinary Dividends</label><MoneyIn value={dividends} onChange={setDividends} /></div>
                  <div id="capital-gains">
                    <label style={lbl}>Long-Term Capital Gains <span style={{ fontWeight: 400, color: '#9ca3af', textTransform: 'none' }}>(0%, 15%, or 20%)</span></label>
                    <MoneyIn value={ltcg} onChange={setLtcg} />
                  </div>
                  <div><label style={lbl}>Other Income</label><MoneyIn value={other} onChange={setOther} /></div>
                </div>
              </Section>

              <Section title="Above-the-Line Deductions">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><label style={lbl}>Traditional 401(k) / IRA Contributions</label><MoneyIn value={k401} onChange={setK401} /></div>
                  <div><label style={lbl}>HSA Contributions</label><MoneyIn value={hsa} onChange={setHsa} /></div>
                  <div><label style={lbl}>Student Loan Interest <span style={{ fontWeight: 400, color: '#9ca3af', textTransform: 'none' }}>(max $2,500)</span></label><MoneyIn value={studentLoan} onChange={setStudentLoan} /></div>
                </div>
              </Section>

              <Section title="Below-the-Line Deductions">
                <div style={{ display: 'flex', gap: 8, borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 10 }}>
                  <button onClick={() => setUseStd(true)} style={{ ...btnBase, background: useStd ? C.blue : C.white, color: useStd ? C.white : C.gray, borderRadius: 0 }}>Standard</button>
                  <button onClick={() => setUseStd(false)} style={{ ...btnBase, background: !useStd ? C.blue : C.white, color: !useStd ? C.white : C.gray, borderRadius: 0 }}>Itemized</button>
                </div>
                {useStd ? (
                  <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#166534' }}>
                    Standard deduction: <strong>{fmtDInt(STD_DED[filing] || 16100)}</strong> for {filing === 'married' ? 'married filing jointly' : filing === 'hoh' ? 'head of household' : 'single/MFS'} (2026)
                  </div>
                ) : (
                  <div>
                    <label style={lbl}>Total Itemized Deductions</label>
                    <MoneyIn value={itemized} onChange={setItemized} />
                    <p style={{ fontSize: 11, color: C.gray, margin: '6px 0 0' }}>Include: mortgage interest, SALT (max $40,400), charitable donations, medical expenses over 7.5% AGI.</p>
                  </div>
                )}
              </Section>

              <Section title="Credits &amp; Withholding" id="credits">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={lbl}>Qualifying Children under 17 <span style={{ fontWeight: 400, color: '#9ca3af', textTransform: 'none' }}>($2,200/child credit)</span></label>
                    <input style={inp} type="number" min="0" max="10" value={children} onChange={e => setChildren(e.target.value)} />
                  </div>
                  <div><label style={lbl}>Federal Tax Already Withheld</label><MoneyIn value={withheld} onChange={setWithheld} /></div>
                </div>
              </Section>
              </div>{/* end income-section wrapper */}
            </div>
          </div>

          {/* RIGHT: Results */}
          <div>
            {res && (
              <>
                {/* Hero result */}
                <div style={{ background: `linear-gradient(135deg,${C.darkBlue},${C.blue})`, borderRadius: 16, padding: 20, color: C.white, marginBottom: 16, boxShadow: '0 4px 20px rgba(37,99,235,.3)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', color: '#93c5fd', margin: '0 0 4px', textTransform: 'uppercase' }}>Total Federal Tax</p>
                      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1 }}>{fmtDInt(res.totalTax)}</div>
                    </div>
                    {res.withheld > 0 && (
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', color: res.refundOrOwed >= 0 ? '#86efac' : '#fca5a5', margin: '0 0 4px', textTransform: 'uppercase' }}>
                          {res.refundOrOwed >= 0 ? 'Est. Refund' : 'Est. Amount Owed'}
                        </p>
                        <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1, color: res.refundOrOwed >= 0 ? '#86efac' : '#fca5a5' }}>
                          {fmtDInt(Math.abs(res.refundOrOwed))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[
                      ['Effective Rate', (res.effectiveRate * 100).toFixed(1) + '%'],
                      ['Marginal Rate', (res.marginalRate * 100).toFixed(0) + '%'],
                      ['After-Tax Income', fmtDInt(res.afterTax)],
                    ].map(([l, v]) => (
                      <div key={l} style={{ background: 'rgba(255,255,255,.12)', borderRadius: 10, padding: '10px 12px' }}>
                        <p style={{ fontSize: 11, color: '#93c5fd', margin: '0 0 2px' }}>{l}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 16 }}>
                  {(['summary', 'brackets', 'planning'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{ ...btnBase, borderRadius: 9, background: tab === t ? C.white : 'transparent', color: tab === t ? C.blue : C.gray, boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,.1)' : 'none', fontSize: 13 }}>
                      {t === 'summary' ? 'Summary' : t === 'brackets' ? 'Brackets' : 'Tax Tips'}
                    </button>
                  ))}
                </div>

                {res&&(()=>{const ins=getTaxInsights(res);return ins.length>0?(
                  <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
                    {ins.map((t,i)=>(
                      <div key={i} style={{padding:'12px 16px',background:'linear-gradient(135deg,#f0fdf4,#eff6ff)',borderRadius:14,border:'1px solid #bbf7d0',fontSize:14,color:'#15803d',fontWeight:500}}>{t}</div>
                    ))}
                  </div>
                ):null})()}
                {/* SUMMARY TAB */}
                {tab === 'summary' && (
                  <div style={{ ...card }}>
                    {/* Income flow */}
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 12px' }}>Tax Calculation Flow</p>
                    {[
                      ['Total Income', parseMoney(wages) + parseMoney(selfEmp) + parseMoney(interest) + parseMoney(dividends) + parseMoney(ltcg) + parseMoney(other), '#1f2937', false],
                      ['Above-the-Line Deductions', -(parseMoney(k401) + parseMoney(hsa) + Math.min(parseMoney(studentLoan), 2500) + (parseMoney(selfEmp) * 0.9235 * 0.153 / 2)), '#16a34a', false],
                      ['Adjusted Gross Income (AGI)', res.agi, C.blue, true],
                      ['Standard / Itemized Deduction', -res.deduction, '#16a34a', false],
                      ['Taxable Income', res.taxableIncome, C.blue, true],
                      ['Federal Income Tax', res.federalTax, '#dc2626', false],
                      ...(parseMoney(ltcg) > 0 ? [['Capital Gains Tax', res.ltcgTax, '#f97316', false] as [string, number, string, boolean]] : []),
                      ...(parseMoney(selfEmp) > 0 ? [['Self-Employment Tax', res.selfEmployTax, '#8b5cf6', false] as [string, number, string, boolean]] : []),
                      ...(parseInt(children) > 0 ? [['Child Tax Credit', -(parseInt(children) * 2200), '#16a34a', false] as [string, number, string, boolean]] : []),
                      ['Total Tax Liability', res.totalTax, '#1f2937', true],
                    ].map(([label, amount, color, highlight]) => (
                      <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, marginBottom: 4, background: highlight ? '#f0f9ff' : 'transparent', border: `1px solid ${highlight ? '#bfdbfe' : 'transparent'}` }}>
                        <span style={{ fontSize: 13, color: highlight ? '#1e40af' : C.gray, fontWeight: highlight ? 600 : 400 }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: color as string }}>
                          {(amount as number) < 0 ? '-' : ''}{fmtD(Math.abs(amount as number))}
                        </span>
                      </div>
                    ))}
                    {res.withheld > 0 && (
                      <div id="refund" style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: res.refundOrOwed >= 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${res.refundOrOwed >= 0 ? '#86efac' : '#fca5a5'}` }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: res.refundOrOwed >= 0 ? '#166534' : '#991b1b', margin: '0 0 4px' }}>
                          {res.refundOrOwed >= 0 ? 'Estimated Refund' : 'Estimated Amount Owed'}
                        </p>
                        <p style={{ fontSize: 20, fontWeight: 700, color: res.refundOrOwed >= 0 ? '#16a34a' : '#dc2626', margin: 0 }}>
                          {fmtDInt(Math.abs(res.refundOrOwed))}
                        </p>
                        <p style={{ fontSize: 11, color: C.gray, margin: '4px 0 0' }}>Withheld: {fmtDInt(res.withheld)} / Tax due: {fmtDInt(res.totalTax)}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* BRACKETS TAB */}
                {tab === 'brackets' && (
                  <div id="brackets" style={{ ...card, scrollMarginTop: 70 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 12px' }}>2026 Tax Bracket Breakdown</p>
                    <p style={{ fontSize: 13, color: '#374151', margin: '0 0 14px' }}>Only dollars within each bracket are taxed at that rate. Your {(res.marginalRate * 100).toFixed(0)}% marginal rate applies ONLY to income above {fmtDInt((BRACKETS[filing] || BRACKETS.single).find(b => b[2] === res.marginalRate)?.[0] || 0)}.</p>
                    {(BRACKETS[filing] || BRACKETS.single).map(([lo, hi, rate], i) => {
                      const ordinary = Math.max(0, res.taxableIncome - parseMoney(ltcg));
                      const taxableInBracket = Math.max(0, Math.min(ordinary, hi === Infinity ? ordinary : hi) - lo);
                      const isActive = ordinary > lo;
                      const isMarginal = rate === res.marginalRate && isActive;
                      const bracketTax = taxableInBracket * rate;
                      const barWidth = taxableInBracket > 0 ? Math.min(100, (taxableInBracket / (ordinary || 1)) * 100) : 0;
                      const colors = ['#3b82f6','#22c55e','#f59e0b','#f97316','#ef4444','#b91c1c','#7f1d1d'];
                      return (
                        <div key={i} style={{ marginBottom: 10, opacity: isActive ? 1 : 0.55 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ width: 28, textAlign: 'center', padding: '2px 6px', borderRadius: 6, background: colors[i], color: C.white, fontSize: 11, fontWeight: 700 }}>{(rate * 100).toFixed(0)}%</span>
                              <span style={{ color: '#374151', fontWeight: isMarginal ? 700 : 400 }}>
                                {fmtDInt(lo)} - {hi === Infinity ? 'and above' : fmtDInt(hi)}
                                {isMarginal && <span style={{ marginLeft: 6, fontSize: 10, background: C.blue, color: C.white, padding: '1px 6px', borderRadius: 4 }}>your bracket</span>}
                              </span>
                            </div>
                            <span style={{ color: isActive ? '#1f2937' : C.gray, fontWeight: 600 }}>{isActive ? fmtD(bracketTax) : '--'}</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                            <div style={{ width: barWidth + '%', height: '100%', background: colors[i], borderRadius: 3, transition: 'width .3s' }}></div>
                          </div>
                          {isActive && taxableInBracket > 0 && <p style={{ fontSize: 11, color: '#4b5563', margin: '2px 0 0' }}>{fmtDInt(taxableInBracket)} taxed at {(rate * 100).toFixed(0)}%</p>}
                        </div>
                      );
                    })}
                    {parseMoney(ltcg) > 0 && (
                      <div style={{ marginTop: 14, padding: '10px 14px', background: '#fffbeb', borderRadius: 10, border: '1px solid #fcd34d' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e', margin: '0 0 4px' }}>Capital Gains Tax</p>
                        <p style={{ fontSize: 12, color: '#b45309', margin: 0 }}>Your {fmtDInt(parseMoney(ltcg))} in long-term capital gains is taxed at preferential rates (0%, 15%, or 20%) separately from ordinary income. Estimated LTCG tax: {fmtD(res.ltcgTax)}.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* PLANNING TAB */}
                {tab === 'planning' && (
                  <div id="tax-tips" style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1f2937', margin: 0 }}>Tax Planning Tips</p>

                    {parseMoney(k401) < 23500 && (
                      <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 10, border: '1px solid #86efac' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#166534', margin: '0 0 4px' }}>Max your 401(k)</p>
                        <p style={{ fontSize: 12, color: '#15803d', margin: 0 }}>Contributing the max $23,500 saves you {fmtDInt((23500 - parseMoney(k401)) * res.marginalRate)} in federal tax at your {(res.marginalRate * 100).toFixed(0)}% marginal rate.</p>
                      </div>
                    )}

                    {!useStd && parseMoney(itemized) < (STD_DED[filing] || 16100) && (
                      <div style={{ padding: 12, background: '#fffbeb', borderRadius: 10, border: '1px solid #fcd34d' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#92400e', margin: '0 0 4px' }}>Take the Standard Deduction</p>
                        <p style={{ fontSize: 12, color: '#b45309', margin: 0 }}>Your itemized deductions ({fmtDInt(parseMoney(itemized))}) are less than the standard deduction ({fmtDInt(STD_DED[filing] || 16100)}). Switch to standard to save {fmtDInt((STD_DED[filing] - parseMoney(itemized)) * res.marginalRate)}.</p>
                      </div>
                    )}

                    {parseMoney(ltcg) > 0 && (
                      <div style={{ padding: 12, background: '#eff6ff', borderRadius: 10, border: '1px solid #93c5fd' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', margin: '0 0 4px' }}>Capital Gains Strategy</p>
                        <p style={{ fontSize: 12, color: '#1d4ed8', margin: 0 }}>Long-term gains (held 12+ months) are taxed at 0-20% vs. up to 37% for short-term. Always hold assets 12+ months before selling when possible.</p>
                      </div>
                    )}

                    {parseInt(children) === 0 && (
                      <div style={{ padding: 12, background: '#faf5ff', borderRadius: 10, border: '1px solid #c4b5fd' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#6b21a8', margin: '0 0 4px' }}>Child Tax Credit</p>
                        <p style={{ fontSize: 12, color: '#7c3aed', margin: 0 }}>If you have qualifying children under 17, enter them above. Each child reduces your tax bill by up to $2,200 in 2026.</p>
                      </div>
                    )}

                    <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10, border: `1px solid ${C.border}` }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>2026 Key Numbers</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 12, color: C.gray }}>
                        {[
                          ['Standard ded. (single)', '$16,100'],
                          ['Standard ded. (MFJ)', '$32,200'],
                          ['401(k) limit', '$23,500'],
                          ['SALT deduction cap', '$40,400'],
                          ['Child tax credit', '$2,200/child'],
                          ['EITC (3+ children)', 'up to $8,231'],
                          ['HSA (self-only)', '$4,300'],
                          ['Student loan interest', 'up to $2,500'],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{k}</span><strong style={{ color: '#1f2937' }}>{v}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>This calculator estimates federal tax only. State taxes, AMT, and other factors may apply. Consult a tax professional for advice specific to your situation.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 40 }} className="tax-faq">
          <style>{`.tax-faq{} @media(max-width:600px){.tax-faq{grid-template-columns:1fr!important;}}`}</style>
          <div style={{ ...card }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', marginBottom: 12 }}>How Federal Income Tax Works</h2>
            <div style={{ fontSize: 13, color: C.gray, lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#1f2937' }}>Step 1 - Total Income:</strong> Add all income sources: wages, self-employment, interest, dividends, and capital gains.</p>
              <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#1f2937' }}>Step 2 - AGI:</strong> Subtract above-the-line deductions (401k, HSA, student loan interest) to get Adjusted Gross Income.</p>
              <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#1f2937' }}>Step 3 - Taxable Income:</strong> Subtract the standard or itemized deduction from AGI.</p>
              <p style={{ margin: 0 }}><strong style={{ color: '#1f2937' }}>Step 4 - Apply Brackets:</strong> Tax is calculated progressively - each dollar is taxed only at the rate for its bracket, not your entire income.</p>
            </div>
          </div>
          <div style={{ ...card }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', marginBottom: 12 }}>2026 Federal Tax Brackets (Single)</h2>
            <div style={{ fontSize: 13 }}>
              {[['10%','$0 - $12,400','#3b82f6'],['12%','$12,401 - $50,000','#22c55e'],['22%','$50,001 - $100,525','#f59e0b'],['24%','$100,526 - $197,300','#f97316'],['32%','$197,301 - $250,525','#ef4444'],['35%','$250,526 - $626,350','#b91c1c'],['37%','Over $626,350','#7f1d1d']].map(([rate, range, color]) => (
                <div key={rate} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid #f3f4f6` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 36, textAlign: 'center', padding: '2px 4px', borderRadius: 5, background: color, color: C.white, fontSize: 11, fontWeight: 700 }}>{rate}</span>
                    <span style={{ color: C.gray }}>{range}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Calculators */}
        <div style={{ background: 'linear-gradient(135deg,#eff6ff,#eef2ff)', borderRadius: 16, padding: 20, border: '1px solid #bfdbfe', marginTop: 8 }}>
          <p style={{fontSize:18,fontWeight:700,color:'#111827',marginBottom:4}}>Related Calculators</p>
          <p style={{fontSize:13,color:'#64748b',marginBottom:16}}>Tools that work great alongside this one</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10}}>

              <a key="/salary" href="/salary" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>Salary Calculator →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Complete take-home pay breakdown</span>
              </a>
              <a key="/compound-interest" href="/compound-interest" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>Compound Interest →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Grow your tax refund</span>
              </a>
              <a key="/loan" href="/loan" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>Loan Calculator →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Understand interest deductions</span>
              </a>
              <a key="/percentage" href="/percentage" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>Percentage Calculator →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Quick tax rate math</span>
              </a>
          </div>
        </div>
        <div style={{marginTop:20}}>
          <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:12}}>All freecalcs.io Calculators</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_CALCS.map(([href, name]) => (
              <a key={href} href={href} style={{ background: C.white, fontSize: 13, color: C.blue, fontWeight: 500, padding: '8px 16px', borderRadius: 10, border: '1px solid #bfdbfe', textDecoration: 'none' }}>{name}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}