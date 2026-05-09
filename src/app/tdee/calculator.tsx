// @ts-nocheck
'use client';
import { useState, useEffect, useCallback } from 'react';

// ── Formulas ────────────────────────────────────────────────────────────────
// Mifflin-St Jeor (most accurate, default)
function mifflin(wKg: number, hCm: number, age: number, sex: string) {
  return sex === 'male'
    ? 10 * wKg + 6.25 * hCm - 5 * age + 5
    : 10 * wKg + 6.25 * hCm - 5 * age - 161;
}
// Harris-Benedict (revised 1984)
function harrisBenedict(wKg: number, hCm: number, age: number, sex: string) {
  return sex === 'male'
    ? 13.397 * wKg + 4.799 * hCm - 5.677 * age + 88.362
    : 9.247 * wKg + 3.098 * hCm - 4.330 * age + 447.593;
}
// Katch-McArdle (uses lean body mass - most accurate when body fat known)
function katchMcArdle(lbmKg: number) {
  return 370 + 21.6 * lbmKg;
}

const ACTIVITY = [
  { key: 'sedentary',    label: 'Sedentary',          factor: 1.2,   desc: 'Desk job, little or no exercise' },
  { key: 'light',       label: 'Lightly Active',     factor: 1.375, desc: '1-3 days/week light exercise or walking' },
  { key: 'moderate',    label: 'Moderately Active',  factor: 1.55,  desc: '3-5 days/week moderate exercise' },
  { key: 'active',      label: 'Very Active',        factor: 1.725, desc: '6-7 days/week hard exercise or physical job' },
  { key: 'athlete',     label: 'Athlete',            factor: 1.9,   desc: 'Twice daily training, professional athlete' },
];

const GOALS = [
  { key: 'extreme_cut', label: 'Extreme Cut',    pct: -0.25, color: '#dc2626', note: 'Lose ~2 lbs/week' },
  { key: 'cut',         label: 'Cut',            pct: -0.15, color: '#f97316', note: 'Lose ~1 lb/week' },
  { key: 'mild_cut',    label: 'Mild Cut',       pct: -0.10, color: '#f59e0b', note: 'Lose ~0.5 lbs/week' },
  { key: 'maintain',    label: 'Maintain',       pct: 0,     color: '#16a34a', note: 'Maintain current weight' },
  { key: 'mild_bulk',   label: 'Mild Bulk',      pct: 0.10,  color: '#2563eb', note: 'Gain ~0.5 lbs/week' },
  { key: 'bulk',        label: 'Bulk',           pct: 0.15,  color: '#7c3aed', note: 'Gain ~1 lb/week' },
];

function calcMacros(calories: number, goal: string) {
  const isCut = goal.includes('cut');
  const isBulk = goal.includes('bulk');
  const proteinPct = isCut ? 0.40 : isBulk ? 0.30 : 0.30;
  const fatPct     = isCut ? 0.30 : isBulk ? 0.25 : 0.30;
  const carbPct    = 1 - proteinPct - fatPct;
  return {
    protein: Math.round((calories * proteinPct) / 4),
    carbs:   Math.round((calories * carbPct)    / 4),
    fat:     Math.round((calories * fatPct)     / 9),
    proteinPct, carbPct, fatPct,
  };
}

const ALL_CALCS = [
  ['/mortgage','Mortgage Calculator'],['/qualify','Mortgage Qualifier'],['/rent-vs-buy','Rent vs Buy'],
  ['/loan','Loan & EMI'],['/salary','Salary Calculator'],['/tax','Income Tax'],
  ['/compound-interest','Compound Interest'],['/percentage','Percentage Calc'],
  ['/bmi','BMI Calculator'],['/age','Age Calculator'],['/tip','Tip Calculator'],
];

const C = { blue:'#2563eb', darkBlue:'#0f172a', gray:'#6b7280', border:'#e2e8f0', white:'#ffffff', light:'#f8fafc', text:'#111827', accent:'#7c3aed', emerald:'#059669' };
const card: React.CSSProperties = { background:'rgba(255,255,255,0.85)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderRadius:20, padding:24, boxShadow:'0 4px 24px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)', border:'1px solid rgba(226,232,240,0.8)', marginBottom:20, transition:'all 0.3s ease' };
const inp: React.CSSProperties  = { width:'100%', border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 12px', fontSize:14, outline:'none', background:C.white, boxSizing:'border-box' };
const lbl: React.CSSProperties  = { display:'block', fontSize:11, fontWeight:600, color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 } as React.CSSProperties;
const btnBase: React.CSSProperties = { flex:1, padding:'10px 0', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', transition:'all .15s' };

export default function TDEECalculator() {
  const [unit, setUnit]         = useState<'imperial'|'metric'>('imperial');
  const [sex, setSex]           = useState('male');
  const [age, setAge]           = useState('30');
  const [weightLbs, setWLbs]    = useState('180');
  const [heightFt, setHFt]      = useState('5');
  const [heightIn, setHIn]      = useState('10');
  const [weightKg, setWKg]      = useState('82');
  const [heightCm, setHCm]      = useState('177');
  const [bodyFat, setBodyFat]   = useState('');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal]         = useState('maintain');
  const [formula, setFormula]   = useState('mifflin');
  const [tab, setTab]           = useState<'results'|'allActivity'|'macros'>('results');

  interface TDEEResult {
    bmr: number; tdee: number; goalCalories: number;
    bmrHB: number; bmrKatch: number;
    macros: ReturnType<typeof calcMacros>;
    activityLabel: string; goalLabel: string; goalColor: string; goalNote: string;
    weightLossWeeks: number;
  }
  const [res, setRes] = useState<TDEEResult | null>(null);

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const _unit = sp.get('unit'); if (_unit) setUnit(_unit as any);
    const _sex = sp.get('sex'); if (_sex) setSex(_sex as any);
    const _age = sp.get('age'); if (_age) setAge(_age as any);
    const _weightLbs = sp.get('weightLbs'); if (_weightLbs) setWLbs(_weightLbs as any);
    const _heightFt = sp.get('heightFt'); if (_heightFt) setHFt(_heightFt as any);
    const _heightIn = sp.get('heightIn'); if (_heightIn) setHIn(_heightIn as any);
  }, []);
  const shareCalc = () => {
    const params = new URLSearchParams({ 'unit': String(unit), 'sex': String(sex), 'age': String(age), 'weightLbs': String(weightLbs), 'heightFt': String(heightFt), 'heightIn': String(heightIn) });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    window.history.replaceState({}, '', '?' + params.toString());
  };

  const compute = useCallback(() => {
    let wKg = 0, hCm = 0;
    if (unit === 'imperial') {
      wKg = (parseFloat(weightLbs) || 0) * 0.453592;
      hCm = ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 2.54;
    } else {
      wKg = parseFloat(weightKg) || 0;
      hCm = parseFloat(heightCm) || 0;
    }
    const a = parseFloat(age) || 30;
    if (!wKg || !hCm) return;

    const bf = parseFloat(bodyFat);
    const lbm = !isNaN(bf) && bf > 0 ? wKg * (1 - bf / 100) : null;

    const bmrMifflin = mifflin(wKg, hCm, a, sex);
    const bmrHB      = harrisBenedict(wKg, hCm, a, sex);
    const bmrKatch   = lbm ? katchMcArdle(lbm) : bmrMifflin;

    const usedBMR = formula === 'mifflin' ? bmrMifflin
                  : formula === 'hb'      ? bmrHB
                  : (lbm ? bmrKatch : bmrMifflin);

    const act = ACTIVITY.find(a => a.key === activity) || ACTIVITY[2];
    const tdee = usedBMR * act.factor;

    const g = GOALS.find(g => g.key === goal) || GOALS[3];
    const goalCalories = Math.round(tdee * (1 + g.pct));

    const macros = calcMacros(goalCalories, goal);

    // Weeks to lose/gain 10 lbs at this deficit/surplus
    const dailyDelta = Math.abs(tdee * g.pct);
    const weightLossWeeks = dailyDelta > 0 ? Math.round((10 * 3500) / (dailyDelta * 7)) : 0;

    setRes({
      bmr: Math.round(bmrMifflin), tdee: Math.round(tdee), goalCalories,
      bmrHB: Math.round(bmrHB), bmrKatch: lbm ? Math.round(bmrKatch) : 0,
      macros, activityLabel: act.label, goalLabel: g.label, goalColor: g.color, goalNote: g.note,
      weightLossWeeks,
    });
  }, [unit, sex, age, weightLbs, heightFt, heightIn, weightKg, heightCm, bodyFat, activity, goal, formula]);

  useEffect(() => { compute(); }, [compute]);

  const GoalCard = ({ g }: { g: typeof GOALS[0] }) => {
    const cals = res ? Math.round(res.tdee * (1 + g.pct)) : 0;
    const active = goal === g.key;
    return (
      <div onClick={() => setGoal(g.key)} style={{ padding:'10px 12px', borderRadius:10, border:`1px solid ${active ? g.color : C.border}`, background: active ? g.color + '11' : C.white, cursor:'pointer', transition:'all .15s' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, fontWeight:active?700:500, color: active ? g.color : '#374151' }}>{g.label}</span>
          <span style={{ fontSize:14, fontWeight:700, color: g.color }}>{cals} kcal</span>
        </div>
        <p style={{ fontSize:11, color:C.gray, margin:'2px 0 0' }}>{g.note}</p>
      </div>
    );
  };

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', background:C.light, minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)', color:C.white, padding:'32px 16px 40px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <a href="/" style={{ color:'#93c5fd', fontSize:13, textDecoration:'none' }}>&lt;- freecalcs.io</a>
          <h1 style={{ fontSize:28, fontWeight:700, margin:'12px 0 8px', color:C.white }}>TDEE &amp; Calorie Calculator</h1>
          <p style={{ color:'#93c5fd', fontSize:14, margin:'0 0 16px' }}>Find your Total Daily Energy Expenditure, calorie goals, and macro breakdown. Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas.</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['Mifflin-St Jeor Formula','3 BMR Methods','Macro Breakdown','All Activity Levels','Goal Calories'].map(t => (
              <span key={t} style={{ background:'rgba(255,255,255,.15)', fontSize:12, padding:'4px 12px', borderRadius:20, color:C.white }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'24px 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) minmax(0,3fr)', gap:20 }} className="tdee-grid">
          <style>{`@media(max-width:680px){.tdee-grid{grid-template-columns:1fr!important;}}`}</style>

          {/* LEFT */}
          <div>
            <div style={{ ...card }}>
              {/* Unit toggle */}
              <div style={{ display:'flex', borderRadius:10, overflow:'hidden', border:`1px solid ${C.border}`, marginBottom:16 }}>
                {(['imperial','metric'] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)} style={{ ...btnBase, background:unit===u?C.blue:C.white, color:unit===u?C.white:C.gray, borderRadius:0 }}>
                    {u === 'imperial' ? 'Imperial' : 'Metric'}
                  </button>
                ))}
              </div>

              {/* Sex + Age */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                <div>
                  <label style={lbl}>Sex</label>
                  <select style={{ ...inp, appearance:'none' } as React.CSSProperties} value={sex} onChange={e => setSex(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Age</label>
                  <input style={inp} type="number" min="15" max="100" value={age} onChange={e => setAge(e.target.value)} />
                </div>
              </div>

              {/* Weight */}
              <div style={{ marginBottom:12 }}>
                <label style={lbl}>Weight {unit === 'imperial' ? '(lbs)' : '(kg)'}</label>
                {unit === 'imperial'
                  ? <input style={inp} type="number" value={weightLbs} onChange={e => setWLbs(e.target.value)} />
                  : <input style={inp} type="number" value={weightKg}  onChange={e => setWKg(e.target.value)} />}
              </div>

              {/* Height */}
              <div style={{ marginBottom:12 }}>
                <label style={lbl}>Height {unit === 'imperial' ? '(ft / in)' : '(cm)'}</label>
                {unit === 'imperial' ? (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    <input style={inp} type="number" placeholder="ft" value={heightFt} onChange={e => setHFt(e.target.value)} />
                    <input style={inp} type="number" placeholder="in" value={heightIn}  onChange={e => setHIn(e.target.value)} />
                  </div>
                ) : (
                  <input style={inp} type="number" value={heightCm} onChange={e => setHCm(e.target.value)} />
                )}
              </div>

              {/* Body fat optional */}
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Body Fat % <span style={{ fontWeight:400, color:'#9ca3af', textTransform:'none' }}>(optional - unlocks Katch-McArdle)</span></label>
                <input style={inp} type="number" min="3" max="60" placeholder="e.g. 20" value={bodyFat} onChange={e => setBodyFat(e.target.value)} />
              </div>

              {/* Formula */}
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>BMR Formula</label>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {[
                    { key:'mifflin', label:'Mifflin-St Jeor', note:'Most accurate (recommended)' },
                    { key:'hb',      label:'Harris-Benedict', note:'Classic formula, revised 1984' },
                    { key:'katch',   label:'Katch-McArdle',   note:'Most accurate with body fat %' },
                  ].map(f => (
                    <label key={f.key} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'8px 10px', borderRadius:8, border:`1px solid ${formula===f.key?C.blue:C.border}`, background:formula===f.key?'#eff6ff':C.white }}>
                      <input type="radio" name="formula" value={f.key} checked={formula===f.key} onChange={() => setFormula(f.key)} style={{ accentColor:C.blue }} />
                      <div>
                        <p style={{ fontSize:13, fontWeight:600, color:'#1f2937', margin:0 }}>{f.label}</p>
                        <p style={{ fontSize:11, color:C.gray, margin:0 }}>{f.note}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div>
                <label style={lbl}>Activity Level</label>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {ACTIVITY.map(a => (
                    <div key={a.key} onClick={() => setActivity(a.key)} style={{ padding:'10px 12px', borderRadius:10, border:`1px solid ${activity===a.key?C.blue:C.border}`, background:activity===a.key?'#eff6ff':C.white, cursor:'pointer', transition:'all .15s' }}>
                      <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <span style={{ fontSize:13, fontWeight:600, color:activity===a.key?C.blue:'#1f2937' }}>{a.label}</span>
                        <span style={{ fontSize:12, color:C.gray }}>x{a.factor}</span>
                      </div>
                      <p style={{ fontSize:11, color:C.gray, margin:'2px 0 0' }}>{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {res && (
              <>
                {/* Big result */}
                <div style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)', borderRadius:16, padding:20, color:C.white, marginBottom:16, boxShadow:'0 8px 32px rgba(37,99,235,.25), 0 2px 8px rgba(0,0,0,.1)' }}>
                  <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', color:'#93c5fd', margin:'0 0 4px', textTransform:'uppercase' }}>Your TDEE (Maintenance Calories)</p>
                  <div style={{ fontSize:48, fontWeight:700, lineHeight:1, margin:'0 0 4px' }}>{res.tdee.toLocaleString()}</div>
                  <p style={{ color:'#93c5fd', fontSize:14, margin:'0 0 16px' }}>calories per day to maintain your current weight</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                    {[
                      ['BMR (Mifflin)', res.bmr.toLocaleString() + ' kcal'],
                      ['Activity', res.activityLabel],
                      ['Weekly', (res.tdee * 7).toLocaleString() + ' kcal'],
                    ].map(([l,v]) => (
                      <div key={l} style={{ background:'rgba(255,255,255,.12)', borderRadius:10, padding:'10px 12px' }}>
                        <p style={{ fontSize:11, color:'#93c5fd', margin:'0 0 2px' }}>{l}</p>
                        <p style={{ fontSize:14, fontWeight:700, margin:0 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BMR comparison */}
                <div style={{ ...card }}>
                  <p style={{ fontSize:12, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 12px' }}>BMR by Formula</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                    {[
                      { label:'Mifflin-St Jeor', val:res.bmr, best:true },
                      { label:'Harris-Benedict', val:res.bmrHB, best:false },
                      { label:'Katch-McArdle',   val:res.bmrKatch || 0, best:false },
                    ].map(({ label, val, best }) => (
                      <div key={label} style={{ textAlign:'center', padding:'12px 8px', borderRadius:10, background: best?'#eff6ff':'#f8fafc', border:`1px solid ${best?C.blue:C.border}` }}>
                        <p style={{ fontSize:11, color:best?C.blue:C.gray, margin:'0 0 4px', fontWeight:600 }}>{label}</p>
                        <p style={{ fontSize:18, fontWeight:700, color:'#1f2937', margin:0 }}>{val > 0 ? val.toLocaleString() : '--'}</p>
                        <p style={{ fontSize:10, color:'#9ca3af', margin:'2px 0 0' }}>kcal/day</p>
                        {!val && label==='Katch-McArdle' && <p style={{ fontSize:10, color:'#f59e0b', margin:'4px 0 0' }}>Enter body fat %</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display:'flex', gap:4, background:'#f1f5f9', borderRadius:12, padding:4, marginBottom:16 }}>
                  {(['results','macros','allActivity'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{ ...btnBase, borderRadius:9, background:tab===t?C.white:'transparent', color:tab===t?C.blue:C.gray, boxShadow:tab===t?'0 1px 3px rgba(0,0,0,.1)':'none', fontSize:13, flex:1 }}>
                      {t==='results'?'Goal Calories':t==='macros'?'Macros':'All Activity'}
                    </button>
                  ))}
                </div>

                {/* GOAL CALORIES TAB */}
                {tab==='results' && (
                  <div style={{ ...card }}>
                    <p style={{ fontSize:12, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 12px' }}>Select Your Goal</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {GOALS.map(g => <GoalCard key={g.key} g={g} />)}
                    </div>
                    {goal !== 'maintain' && res.weightLossWeeks > 0 && (
                      <div style={{ marginTop:12, padding:'10px 14px', background:'#f0fdf4', borderRadius:10, border:'1px solid #86efac' }}>
                        <p style={{ fontSize:13, color:'#166534', margin:0 }}>
                          At {res.goalCalories.toLocaleString()} kcal/day, you will {goal.includes('cut')?'lose':'gain'} 10 lbs in approx. {res.weightLossWeeks} weeks.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* MACROS TAB */}
                {tab==='macros' && (
                  <div style={{ ...card }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                      <p style={{ fontSize:12, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.05em', margin:0 }}>Macro Breakdown</p>
                      <span style={{ fontSize:13, color:C.blue, fontWeight:600 }}>{res.goalCalories.toLocaleString()} kcal/day</span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
                      {[
                        { label:'Protein', g: res.macros.protein, pct: res.macros.proteinPct, color:'#2563eb', cal: res.macros.protein * 4 },
                        { label:'Carbs',   g: res.macros.carbs,   pct: res.macros.carbPct,    color:'#f59e0b', cal: res.macros.carbs * 4 },
                        { label:'Fat',     g: res.macros.fat,     pct: res.macros.fatPct,     color:'#ef4444', cal: res.macros.fat * 9 },
                      ].map(m => (
                        <div key={m.label} style={{ textAlign:'center', padding:'14px 10px', borderRadius:12, background:'#f8fafc', border:`1px solid ${C.border}` }}>
                          <div style={{ width:8, height:8, borderRadius:'50%', background:m.color, margin:'0 auto 6px' }}></div>
                          <p style={{ fontSize:11, color:C.gray, margin:'0 0 4px', fontWeight:600 }}>{m.label}</p>
                          <p style={{ fontSize:22, fontWeight:700, color:'#1f2937', margin:0 }}>{m.g}g</p>
                          <p style={{ fontSize:11, color:C.gray, margin:'2px 0 0' }}>{m.cal} kcal ({Math.round(m.pct*100)}%)</p>
                        </div>
                      ))}
                    </div>
                    {/* Macro bar */}
                    <div style={{ display:'flex', borderRadius:8, overflow:'hidden', height:12, marginBottom:10 }}>
                      <div style={{ width:`${res.macros.proteinPct*100}%`, background:'#2563eb' }}></div>
                      <div style={{ width:`${res.macros.carbPct*100}%`, background:'#f59e0b' }}></div>
                      <div style={{ width:`${res.macros.fatPct*100}%`, background:'#ef4444' }}></div>
                    </div>
                    <div style={{ fontSize:11, color:'#9ca3af', lineHeight:1.5 }}>
                      Macro ratios auto-adjust by goal. Cutting = higher protein. Bulking = higher carbs. These are starting targets; adjust based on your response.
                    </div>
                  </div>
                )}

                {/* ALL ACTIVITY TAB */}
                {tab==='allActivity' && (
                  <div style={{ ...card }}>
                    <p style={{ fontSize:12, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.05em', margin:'0 0 12px' }}>TDEE at Every Activity Level</p>
                    {ACTIVITY.map(a => {
                      const tdee2 = Math.round(res.bmr * a.factor);
                      const active = a.key === activity;
                      return (
                        <div key={a.key} onClick={() => setActivity(a.key)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', borderRadius:10, marginBottom:6, border:`1px solid ${active?C.blue:C.border}`, background:active?'#eff6ff':C.white, cursor:'pointer' }}>
                          <div>
                            <p style={{ fontSize:13, fontWeight:active?700:500, color:active?C.blue:'#1f2937', margin:0 }}>{a.label}</p>
                            <p style={{ fontSize:11, color:C.gray, margin:'2px 0 0' }}>{a.desc}</p>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <p style={{ fontSize:16, fontWeight:700, color:active?C.blue:'#1f2937', margin:0 }}>{tdee2.toLocaleString()}</p>
                            <p style={{ fontSize:10, color:C.gray, margin:0 }}>kcal/day</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tips */}
                <div style={{ ...card, background:'#f8fafc' }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'#1f2937', margin:'0 0 10px' }}>How to Use Your TDEE</p>
                  {[
                    ['TDEE is a starting estimate', 'Track your weight for 2-3 weeks. If it stays flat, your TDEE estimate is accurate. Adjust by 100-200 kcal if needed.'],
                    ['Protein is king', 'Aim for 0.7-1g of protein per pound of bodyweight to preserve muscle while cutting, or build muscle while bulking.'],
                    ['Aggressive cuts backfire', 'Deficits over 25% of TDEE cause muscle loss and metabolic adaptation. Slow and steady wins.'],
                    ['Refeeds matter', 'If cutting for more than 8 weeks, consider 1-2 maintenance days per week to support hormones and adherence.'],
                  ].map(([t, b]) => (
                    <div key={t as string} style={{ marginBottom:10 }}>
                      <p style={{ fontSize:12, fontWeight:600, color:'#1f2937', margin:'0 0 2px' }}>{t}</p>
                      <p style={{ fontSize:12, color:C.gray, margin:0, lineHeight:1.5 }}>{b}</p>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize:11, color:'#9ca3af' }}>TDEE estimates vary by individual. Consult a registered dietitian for personalized nutrition advice.</p>
              </>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginTop:40 }} className="faq-grid">
          <style>{`.faq-grid{} @media(max-width:600px){.faq-grid{grid-template-columns:1fr!important;}}`}</style>
          <div style={{ ...card }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#1f2937', marginBottom:14 }}>What is TDEE?</h2>
            <p style={{ fontSize:13, color:'#374151', lineHeight:1.6, margin:0 }}>TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day. It includes your Basal Metabolic Rate (calories burned at rest), the thermic effect of food (digestion), and all physical activity. Eating below your TDEE creates a deficit for fat loss. Eating above creates a surplus for muscle gain.</p>
          </div>
          <div style={{ ...card }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#1f2937', marginBottom:14 }}>Which BMR Formula is Best?</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13, color:C.gray }}>
              <p style={{ margin:0 }}><strong style={{ color:'#1f2937' }}>Mifflin-St Jeor (recommended):</strong> Most validated in research. Accurate within 10% for most people.</p>
              <p style={{ margin:0 }}><strong style={{ color:'#1f2937' }}>Harris-Benedict:</strong> Classic formula, slightly less accurate than Mifflin for most populations.</p>
              <p style={{ margin:0 }}><strong style={{ color:'#1f2937' }}>Katch-McArdle:</strong> Best if you know your body fat %. Accounts for lean mass directly.</p>
            </div>
          </div>
        </div>

        {/* All Calculators */}
        <div style={{ background:'linear-gradient(135deg,#eff6ff,#eef2ff)', borderRadius:16, padding:20, border:'1px solid #bfdbfe', marginTop:8 }}>
          <p style={{fontSize:18,fontWeight:700,color:'#111827',marginBottom:4}}>Related Calculators</p>
          <p style={{fontSize:13,color:'#64748b',marginBottom:16}}>Tools that work great alongside this one</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10}}>

              <a key="/bmi" href="/bmi" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>BMI Calculator →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Check BMI alongside calorie goals</span>
              </a>
              <a key="/age" href="/age" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>Age Calculator →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Age affects metabolic rate</span>
              </a>
              <a key="/percentage" href="/percentage" style={{textDecoration:'none',display:'block',padding:'14px 18px',background:'rgba(255,255,255,0.9)',borderRadius:14,border:'1px solid #e2e8f0'}}>
                <span style={{fontSize:14,fontWeight:600,color:'#2563eb'}}>Percentage Calculator →</span>
                <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>Macro percentage calculations</span>
              </a>
          </div>
        </div>
        <div style={{marginTop:20}}>
          <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:12}}>All freecalcs.io Calculators</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {ALL_CALCS.map(([href, name]) => (
              <a key={href} href={href} style={{ background:C.white, fontSize:13, color:C.blue, fontWeight:500, padding:'8px 16px', borderRadius:10, border:'1px solid #bfdbfe', textDecoration:'none' }}>{name}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}