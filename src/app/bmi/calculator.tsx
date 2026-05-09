// @ts-nocheck
'use client';
import { useState, useCallback, useEffect } from 'react';

// BMI categories (WHO / CDC)
// Adult: <18.5 Underweight | 18.5-24.9 Normal | 25-29.9 Overweight | 30+ Obese
// Obese class I: 30-34.9 | II: 35-39.9 | III: 40+

function calcBMI(weightLbs: number, heightIn: number): number {
  if (!weightLbs || !heightIn) return 0;
  return (weightLbs / (heightIn * heightIn)) * 703;
}
function calcBMIMetric(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) return 0;
  const hm = heightCm / 100;
  return weightKg / (hm * hm);
}

interface BMIInfo {
  bmi: number;
  category: string;
  color: string;
  bgColor: string;
  borderColor: string;
  bmiPrime: number;
  ponderal: number;
  healthyWeightLow: number;
  healthyWeightHigh: number;
  toLoose: number;
  toGain: number;
  bodyFatEst: number;
  gaugeAngle: number;
}

function getBMIInfo(bmi: number, heightIn: number, age: number, sex: string, unit: string): BMIInfo {
  let category = 'Normal weight';
  let color = '#16a34a';
  let bgColor = '#f0fdf4';
  let borderColor = '#86efac';

  if (bmi < 18.5) { category = 'Underweight'; color = '#2563eb'; bgColor = '#eff6ff'; borderColor = '#93c5fd'; }
  else if (bmi < 25) { category = 'Normal weight'; color = '#16a34a'; bgColor = '#f0fdf4'; borderColor = '#86efac'; }
  else if (bmi < 30) { category = 'Overweight'; color = '#d97706'; bgColor = '#fffbeb'; borderColor = '#fcd34d'; }
  else if (bmi < 35) { category = 'Obese (Class I)'; color = '#dc2626'; bgColor = '#fef2f2'; borderColor = '#fca5a5'; }
  else if (bmi < 40) { category = 'Obese (Class II)'; color = '#b91c1c'; bgColor = '#fef2f2'; borderColor = '#f87171'; }
  else { category = 'Obese (Class III)'; color = '#7f1d1d'; bgColor = '#fff1f2'; borderColor = '#fb7185'; }

  const bmiPrime = bmi / 25;

  // Ponderal index (kg/m^3)
  const heightM = (heightIn * 2.54) / 100;
  const weightKg = ((bmi * heightIn * heightIn) / 703) * 0.453592;
  const ponderal = weightKg / (heightM * heightM * heightM);

  // Healthy weight range for this height
  const hwLow = unit === 'imperial' ? (18.5 * heightIn * heightIn) / 703 : 18.5 * (heightM * heightM);
  const hwHigh = unit === 'imperial' ? (24.9 * heightIn * heightIn) / 703 : 24.9 * (heightM * heightM);

  const currentWeight = unit === 'imperial' ? (bmi * heightIn * heightIn) / 703 : weightKg * 2.205;
  const toLoose = Math.max(0, currentWeight - hwHigh);
  const toGain = Math.max(0, hwLow - currentWeight);

  // Body fat estimate (Deurenberg formula)
  const sexFactor = sex === 'male' ? 1 : 0;
  const bodyFatEst = Math.max(0, (1.20 * bmi) + (0.23 * age) - (10.8 * sexFactor) - 5.4);

  // Gauge: 10 = leftmost, 40 = rightmost (BMI range for gauge)
  const clampedBMI = Math.max(10, Math.min(45, bmi));
  const gaugeAngle = ((clampedBMI - 10) / 35) * 180;

  return { bmi, category, color, bgColor, borderColor, bmiPrime, ponderal, healthyWeightLow: hwLow, healthyWeightHigh: hwHigh, toLoose, toGain, bodyFatEst, gaugeAngle };
}

// Gauge SVG
function BMIGauge({ bmi, angle, color }: { bmi: number; angle: number; color: string }) {
  const cx = 110, cy = 100, r = 80, ir = 55;
  const segments = [
    { start: 0, end: 36, color: '#3b82f6' },   // Underweight
    { start: 36, end: 90, color: '#22c55e' },   // Normal
    { start: 90, end: 126, color: '#f59e0b' },  // Overweight
    { start: 126, end: 154, color: '#ef4444' }, // Obese I
    { start: 154, end: 173, color: '#b91c1c' }, // Obese II
    { start: 173, end: 180, color: '#7f1d1d' }, // Obese III
  ];
  function arcPath(startDeg: number, endDeg: number, outerR: number, innerR: number) {
    const toRad = (d: number) => ((d + 180) * Math.PI) / 180;
    const x1 = cx + outerR * Math.cos(toRad(startDeg));
    const y1 = cy + outerR * Math.sin(toRad(startDeg));
    const x2 = cx + outerR * Math.cos(toRad(endDeg));
    const y2 = cy + outerR * Math.sin(toRad(endDeg));
    const ix1 = cx + innerR * Math.cos(toRad(startDeg));
    const iy1 = cy + innerR * Math.sin(toRad(startDeg));
    const ix2 = cx + innerR * Math.cos(toRad(endDeg));
    const iy2 = cy + innerR * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 90 ? 1 : 0;
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`;
  }
  // Needle
  const needleRad = ((angle + 180) * Math.PI) / 180;
  const nx = cx + 72 * Math.cos(needleRad);
  const ny = cy + 72 * Math.sin(needleRad);

  return (
    <svg viewBox="0 0 220 110" style={{ width: '100%', maxWidth: 300 }}>
      {segments.map((s, i) => (
        <path key={i} d={arcPath(s.start, s.end, r, ir)} fill={s.color} opacity={0.9} />
      ))}
      <circle cx={cx} cy={cy} r={ir - 2} fill="white" />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill={color} />
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#1f2937">{bmi > 0 ? bmi.toFixed(1) : '--'}</text>
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fill="#6b7280">BMI</text>
      <text x={18} y={108} fontSize={8} fill="#6b7280">Under</text>
      <text x={68} y={108} fontSize={8} fill="#6b7280">Normal</text>
      <text x={120} y={108} fontSize={8} fill="#6b7280">Over</text>
      <text x={165} y={108} fontSize={8} fill="#6b7280">Obese</text>
    </svg>
  );
}

const ALL_CALCS = [
  ['Mortgage Calculator', '/mortgage'],
  ['Mortgage Qualifier', '/qualify'],
  ['Rent vs Buy', '/rent-vs-buy'],
  ['Salary Calculator', '/salary'],
  ['Income Tax', '/tax'],
  ['TDEE & Calories', '/tdee'],
  ['Compound Interest', '/compound-interest'],
  ['Loan Calculator', '/loan'],
  ['Age Calculator', '/age'],
  ['Percentage Calc', '/percentage'],
  ['Tip Calculator', '/tip'],
];

const C = { blue: '#2563eb', darkBlue: '#0f172a', gray: '#6b7280', border: '#e2e8f0', white: '#ffffff', light: '#f8fafc', text: '#111827', accent: '#7c3aed', emerald: '#059669' };
const card: React.CSSProperties = { background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 20, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)', border: '1px solid rgba(226,232,240,0.8)', marginBottom: 20, transition: 'all 0.3s ease' };
const inp: React.CSSProperties = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', background: '#f8fafc', boxSizing: 'border-box', color: '#111827', fontWeight: 600, transition: 'all 0.2s ease' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 } as React.CSSProperties;
const btnBase: React.CSSProperties = { flex: 1, padding: '10px 0', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all .15s' };

export default function BMICalculator() {
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [weightLbs, setWeightLbs] = useState('160');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn2, setHeightIn2] = useState('10');
  const [weightKg, setWeightKg] = useState('72');
  const [heightCm, setHeightCm] = useState('177');
  const [age, setAge] = useState('35');
  const [sex, setSex] = useState('male');
  const [childMode, setChildMode] = useState(false);
  const [info, setInfo] = useState<BMIInfo | null>(null);

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const _unit = sp.get('unit'); if (_unit) setUnit(_unit as any);
    const _weightLbs = sp.get('weightLbs'); if (_weightLbs) setWeightLbs(_weightLbs as any);
    const _heightFt = sp.get('heightFt'); if (_heightFt) setHeightFt(_heightFt as any);
    const _heightIn = sp.get('heightIn'); if (_heightIn) setHeightIn2(_heightIn as any);
    const _weightKg = sp.get('weightKg'); if (_weightKg) setWeightKg(_weightKg as any);
    const _heightCm = sp.get('heightCm'); if (_heightCm) setHeightCm(_heightCm as any);
    const _age = sp.get('age'); if (_age) setAge(_age as any);
  }, []);
  const shareCalc = () => {
    const params = new URLSearchParams({ 'unit': String(unit), 'weightLbs': String(weightLbs), 'heightFt': String(heightFt), 'heightIn': String(heightIn2), 'weightKg': String(weightKg), 'heightCm': String(heightCm), 'age': String(age) });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    window.history.replaceState({}, '', '?' + params.toString());
  };

  const compute = useCallback(() => {
    let bmi = 0;
    let heightInTotal = 0;
    if (unit === 'imperial') {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn2) || 0;
      heightInTotal = ft * 12 + inch;
      bmi = calcBMI(parseFloat(weightLbs) || 0, heightInTotal);
    } else {
      const hcm = parseFloat(heightCm) || 0;
      heightInTotal = hcm / 2.54;
      bmi = calcBMIMetric(parseFloat(weightKg) || 0, hcm);
    }
    if (bmi > 0) {
      setInfo(getBMIInfo(bmi, heightInTotal, parseFloat(age) || 30, sex, unit));
    }
  }, [unit, weightLbs, heightFt, heightIn2, weightKg, heightCm, age, sex]);

  useEffect(() => { compute(); }, [compute]);

  const fmt1 = (n: number) => n.toFixed(1);
  const fmtW = (lbs: number) => unit === 'imperial' ? lbs.toFixed(1) + ' lbs' : (lbs * 0.453592).toFixed(1) + ' kg';

  // BMI table rows
  const bmiTable = [
    ['Underweight', 'Below 18.5', '#3b82f6'],
    ['Normal weight', '18.5 - 24.9', '#22c55e'],
    ['Overweight', '25 - 29.9', '#f59e0b'],
    ['Obese Class I', '30 - 34.9', '#ef4444'],
    ['Obese Class II', '35 - 39.9', '#b91c1c'],
    ['Obese Class III', '40 and above', '#7f1d1d'],
  ];

  const healthRisks = [
    ['Type 2 Diabetes', 'High', 'Very High', 'Very High'],
    ['Heart Disease', 'Moderate', 'High', 'Very High'],
    ['High Blood Pressure', 'Moderate', 'High', 'Very High'],
    ['Sleep Apnea', 'Low', 'Moderate', 'High'],
    ['Joint Problems', 'Low', 'Moderate', 'High'],
    ['Stroke', 'Moderate', 'High', 'Very High'],
  ];

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', background: 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.darkBlue},${C.blue})`, color: C.white, padding: '32px 16px 40px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <a href="/" style={{ color: '#93c5fd', fontSize: 13, textDecoration: 'none' }}>&lt;- freecalcs.io</a>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '12px 0 8px', color: C.white }}>BMI Calculator</h1>
          <p style={{ color: '#93c5fd', fontSize: 14, margin: '0 0 16px' }}>Calculate your Body Mass Index with health analysis, body fat estimate, and healthy weight range. Adults and children.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['WHO/CDC Standards', 'Adult + Children', 'Body Fat Estimate', 'BMI Prime', 'Health Risk Analysis'].map(t => (
              <span key={t} style={{ background: 'rgba(255,255,255,.15)', fontSize: 12, padding: '4px 12px', borderRadius: 20, color: C.white }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,3fr)', gap: 20 }} className="bmi-grid">
          <style>{`@media(max-width:680px){.bmi-grid{grid-template-columns:1fr!important;}}`}</style>

          {/* LEFT */}
          <div>
            <div style={{ ...card }}>
              {/* Unit toggle */}
              <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 16 }}>
                {(['imperial', 'metric'] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)} style={{ ...btnBase, background: unit === u ? C.blue : C.white, color: unit === u ? C.white : C.gray, borderRadius: 0, textTransform: 'capitalize' }}>
                    {u === 'imperial' ? 'Imperial (lbs/ft)' : 'Metric (kg/cm)'}
                  </button>
                ))}
              </div>

              {unit === 'imperial' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={lbl}>Weight (pounds)</label>
                    <input style={inp} type="number" min="50" max="700" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div><label style={lbl}>Height (feet)</label><input style={inp} type="number" min="1" max="8" value={heightFt} onChange={e => setHeightFt(e.target.value)} /></div>
                    <div><label style={lbl}>Height (inches)</label><input style={inp} type="number" min="0" max="11" value={heightIn2} onChange={e => setHeightIn2(e.target.value)} /></div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div><label style={lbl}>Weight (kg)</label><input style={inp} type="number" min="20" max="300" value={weightKg} onChange={e => setWeightKg(e.target.value)} /></div>
                  <div><label style={lbl}>Height (cm)</label><input style={inp} type="number" min="50" max="250" value={heightCm} onChange={e => setHeightCm(e.target.value)} /></div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <div>
                  <label style={lbl}>Age</label>
                  <input style={inp} type="number" min="2" max="120" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Sex</label>
                  <select style={{ ...inp, appearance: 'none' } as React.CSSProperties} value={sex} onChange={e => setSex(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="childMode" checked={childMode} onChange={e => setChildMode(e.target.checked)} style={{ width: 16, height: 16 }} />
                <label htmlFor="childMode" style={{ fontSize: 13, color: C.gray, cursor: 'pointer' }}>Child/Teen mode (age 2-19, uses CDC percentiles)</label>
              </div>
            </div>

            {/* BMI Classification Table */}
            <div style={{ ...card }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1f2937', margin: '0 0 12px' }}>BMI Classifications (WHO)</h3>
              {bmiTable.map(([cat, range, clr]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderRadius: 8, marginBottom: 4, background: info && info.category.startsWith(cat as string) ? '#f0f9ff' : 'transparent', border: `1px solid ${info && info.category.startsWith(cat as string) ? C.blue : 'transparent'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: clr as string, flexShrink: 0 }}></span>
                    <span style={{ fontSize: 13, color: '#1f2937' }}>{cat}</span>
                  </div>
                  <span style={{ fontSize: 12, color: C.gray }}>{range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {info && info.bmi > 0 && (
              <>
                {/* Main result */}
                <div style={{ background: `linear-gradient(135deg,${C.darkBlue},${C.blue})`, borderRadius: 16, padding: 20, color: C.white, marginBottom: 16, boxShadow: '0 8px 32px rgba(37,99,235,.25), 0 2px 8px rgba(0,0,0,.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#93c5fd', margin: '0 0 4px', textTransform: 'uppercase' }}>Your BMI</p>
                      <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, margin: '0 0 8px' }}>{fmt1(info.bmi)}</div>
                      <div style={{ display: 'inline-block', background: info.bgColor, color: info.color, fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 20, border: `1px solid ${info.borderColor}` }}>{info.category}</div>
                    </div>
                    <div style={{ width: 180, flexShrink: 0 }}>
                      <BMIGauge bmi={info.bmi} angle={info.gaugeAngle} color={info.color} />
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  {[
                    ['BMI Prime', fmt1(info.bmiPrime), info.bmiPrime < 0.74 ? '#3b82f6' : info.bmiPrime <= 1 ? '#16a34a' : '#dc2626', 'Ratio to upper normal limit (1.0 = top of normal)'],
                    ['Ponderal Index', fmt1(info.ponderal) + ' kg/m3', C.blue, 'Body mass relative to height (cube)'],
                    ['Est. Body Fat', fmt1(info.bodyFatEst) + '%', info.bodyFatEst < 18 ? '#3b82f6' : info.bodyFatEst < 25 ? '#16a34a' : info.bodyFatEst < 32 ? '#d97706' : '#dc2626', 'Estimated using Deurenberg formula (BMI, age, sex)'],
                    ['Healthy Weight', fmtW(info.healthyWeightLow) + ' - ' + fmtW(info.healthyWeightHigh), '#16a34a', 'Healthy BMI 18.5-24.9 range for your height'],
                  ].map(([title, value, color, note]) => (
                    <div key={title as string} style={{ ...card, marginBottom: 0, padding: 14 }}>
                      <p style={{ fontSize: 11, color: C.gray, margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{title}</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: color as string, margin: '0 0 4px' }}>{value}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>{note}</p>
                    </div>
                  ))}
                </div>

                {/* Weight to lose/gain */}
                {(info.toLoose > 0 || info.toGain > 0) && (
                  <div style={{ ...card, background: info.toLoose > 0 ? '#fef2f2' : '#f0fdf4', borderColor: info.toLoose > 0 ? '#fca5a5' : '#86efac' }}>
                    {info.toLoose > 0 ? (
                      <p style={{ fontSize: 14, color: '#dc2626', margin: 0 }}>
                        <strong>To reach healthy weight:</strong> lose {fmtW(info.toLoose)} to reach {fmtW(info.healthyWeightHigh)}.
                      </p>
                    ) : (
                      <p style={{ fontSize: 14, color: '#16a34a', margin: 0 }}>
                        <strong>To reach healthy weight:</strong> gain {fmtW(info.toGain)} to reach {fmtW(info.healthyWeightLow)}.
                      </p>
                    )}
                  </div>
                )}

                {info.toLoose === 0 && info.toGain === 0 && (
                  <div style={{ ...card, background: '#f0fdf4', borderColor: '#86efac' }}>
                    <p style={{ fontSize: 14, color: '#16a34a', margin: 0, fontWeight: 600 }}>You are within the healthy weight range for your height.</p>
                  </div>
                )}

                {/* Child mode note */}
                {childMode && (
                  <div style={{ ...card, background: '#fffbeb', borderColor: '#fcd34d' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#92400e', margin: '0 0 6px' }}>Child/Teen Mode (Age 2-19)</p>
                    <p style={{ fontSize: 12, color: '#b45309', margin: 0, lineHeight: 1.5 }}>
                      For children and teens, BMI is interpreted using CDC sex-specific BMI-for-age percentiles, not the adult category ranges shown above.
                      A BMI in the 85th-94th percentile = overweight; 95th+ = obese. Consult your pediatrician for full growth chart analysis.
                    </p>
                  </div>
                )}

                {/* Health Risks */}
                <div style={{ ...card }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1f2937', margin: '0 0 12px' }}>Health Risk by Weight Status</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ padding: '8px 10px', textAlign: 'left', color: C.gray, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>Condition</th>
                          <th style={{ padding: '8px 10px', textAlign: 'center', color: '#d97706', fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>Overweight</th>
                          <th style={{ padding: '8px 10px', textAlign: 'center', color: '#dc2626', fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>Obese I</th>
                          <th style={{ padding: '8px 10px', textAlign: 'center', color: '#7f1d1d', fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>Obese II/III</th>
                        </tr>
                      </thead>
                      <tbody>
                        {healthRisks.map(([cond, ow, ob1, ob2]) => (
                          <tr key={cond} style={{ borderBottom: `1px solid #f3f4f6` }}>
                            <td style={{ padding: '8px 10px', color: '#374151' }}>{cond}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'center', color: '#d97706' }}>{ow}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'center', color: '#dc2626' }}>{ob1}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'center', color: '#7f1d1d' }}>{ob2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Limitations */}
                <div style={{ ...card, background: '#f8fafc' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1f2937', margin: '0 0 10px' }}>BMI Limitations to Know</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      ['Athletes', 'Muscle is denser than fat. Highly trained athletes may show overweight/obese BMI despite low body fat.'],
                      ['Older Adults', 'Older adults tend to have more body fat than younger adults at the same BMI.'],
                      ['Sex Differences', 'Women typically have more body fat than men at the same BMI due to physiological differences.'],
                      ['Asian Populations', 'Some health organizations recommend lower BMI cutoffs for Asian individuals (23 for overweight, 27.5 for obese).'],
                    ].map(([title, text]) => (
                      <div key={title as string} style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 16, flexShrink: 0, color: C.blue, fontWeight: 700 }}>i</span>
                        <div>
                          <strong style={{ fontSize: 12, color: '#1f2937' }}>{title}:</strong>
                          <span style={{ fontSize: 12, color: C.gray }}> {text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12, marginBottom: 0 }}>BMI is a screening tool, not a diagnostic measure. Consult a healthcare provider for a full health assessment.</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* All Related Calculators */}
        <div style={{ background: 'linear-gradient(135deg,#eff6ff,#eef2ff)', borderRadius: 16, padding: 20, border: '1px solid #bfdbfe', marginTop: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>All freecalcs.io Calculators</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_CALCS.map(([name, href]) => (
              <a key={href} href={href} style={{ background: C.white, fontSize: 13, color: C.blue, fontWeight: 500, padding: '8px 16px', borderRadius: 10, border: '1px solid #bfdbfe', textDecoration: 'none' }}>{name}</a>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12 }}>BMI is a screening tool only. This calculator is not a substitute for professional medical advice.</p>
      </div>
    </div>
  );
}