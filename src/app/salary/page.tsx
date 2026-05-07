'use client';

import { useState, useEffect, useCallback } from 'react';

// ── 2026 Federal Tax Brackets ──────────────────────────────────────────────
const FEDERAL_BRACKETS: Record<string, [number, number, number][]> = {
  single: [
    [0, 12400, 0.10],
    [12400, 50000, 0.12],
    [50000, 100525, 0.22],
    [100525, 197300, 0.24],
    [197300, 250525, 0.32],
    [250525, 626350, 0.35],
    [626350, Infinity, 0.37],
  ],
  married: [
    [0, 24800, 0.10],
    [24800, 100000, 0.12],
    [100000, 201050, 0.22],
    [201050, 394600, 0.24],
    [394600, 501050, 0.32],
    [501050, 751600, 0.35],
    [751600, Infinity, 0.37],
  ],
  married_sep: [
    [0, 12400, 0.10],
    [12400, 50000, 0.12],
    [50000, 100525, 0.22],
    [100525, 197300, 0.24],
    [197300, 250525, 0.32],
    [250525, 375800, 0.35],
    [375800, Infinity, 0.37],
  ],
  hoh: [
    [0, 18750, 0.10],
    [18750, 63100, 0.12],
    [63100, 100500, 0.22],
    [100500, 197300, 0.24],
    [197300, 250500, 0.32],
    [250500, 626350, 0.35],
    [626350, Infinity, 0.37],
  ],
};

const STANDARD_DEDUCTIONS: Record<string, number> = {
  single: 16100,
  married: 32200,
  married_sep: 16100,
  hoh: 24150,
};

// ── State Tax Rates (2026) ─────────────────────────────────────────────────
const STATE_TAXES: Record<string, { rate: number; flat?: boolean; name: string }> = {
  AL: { rate: 0.05, name: 'Alabama' },
  AK: { rate: 0, name: 'Alaska' },
  AZ: { rate: 0.025, name: 'Arizona' },
  AR: { rate: 0.039, name: 'Arkansas' },
  CA: { rate: 0.093, name: 'California' },
  CO: { rate: 0.044, name: 'Colorado', flat: true },
  CT: { rate: 0.065, name: 'Connecticut' },
  DE: { rate: 0.066, name: 'Delaware' },
  FL: { rate: 0, name: 'Florida' },
  GA: { rate: 0.055, name: 'Georgia' },
  HI: { rate: 0.08, name: 'Hawaii' },
  ID: { rate: 0.058, name: 'Idaho' },
  IL: { rate: 0.0495, name: 'Illinois', flat: true },
  IN: { rate: 0.0305, name: 'Indiana', flat: true },
  IA: { rate: 0.057, name: 'Iowa' },
  KS: { rate: 0.057, name: 'Kansas' },
  KY: { rate: 0.04, name: 'Kentucky', flat: true },
  LA: { rate: 0.03, name: 'Louisiana' },
  ME: { rate: 0.075, name: 'Maine' },
  MD: { rate: 0.0575, name: 'Maryland' },
  MA: { rate: 0.05, name: 'Massachusetts', flat: true },
  MI: { rate: 0.0425, name: 'Michigan', flat: true },
  MN: { rate: 0.0985, name: 'Minnesota' },
  MS: { rate: 0.05, name: 'Mississippi' },
  MO: { rate: 0.048, name: 'Missouri' },
  MT: { rate: 0.059, name: 'Montana' },
  NE: { rate: 0.0664, name: 'Nebraska' },
  NV: { rate: 0, name: 'Nevada' },
  NH: { rate: 0, name: 'New Hampshire' },
  NJ: { rate: 0.0897, name: 'New Jersey' },
  NM: { rate: 0.059, name: 'New Mexico' },
  NY: { rate: 0.109, name: 'New York' },
  NC: { rate: 0.045, name: 'North Carolina', flat: true },
  ND: { rate: 0.025, name: 'North Dakota' },
  OH: { rate: 0.035, name: 'Ohio' },
  OK: { rate: 0.0475, name: 'Oklahoma' },
  OR: { rate: 0.099, name: 'Oregon' },
  PA: { rate: 0.0307, name: 'Pennsylvania', flat: true },
  RI: { rate: 0.0599, name: 'Rhode Island' },
  SC: { rate: 0.064, name: 'South Carolina' },
  SD: { rate: 0, name: 'South Dakota' },
  TN: { rate: 0, name: 'Tennessee' },
  TX: { rate: 0, name: 'Texas' },
  UT: { rate: 0.0465, name: 'Utah', flat: true },
  VT: { rate: 0.0875, name: 'Vermont' },
  VA: { rate: 0.0575, name: 'Virginia' },
  WA: { rate: 0, name: 'Washington' },
  WV: { rate: 0.065, name: 'West Virginia' },
  WI: { rate: 0.0765, name: 'Wisconsin' },
  WY: { rate: 0, name: 'Wyoming' },
  DC: { rate: 0.109, name: 'Washington D.C.' },
};

const NO_INCOME_TAX_STATES = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'];

// ── Pay frequency multipliers (per year) ───────────────────────────────────
const PAY_FREQ: Record<string, { label: string; periods: number }> = {
  annual:     { label: 'Annually',    periods: 1 },
  monthly:    { label: 'Monthly',     periods: 12 },
  semimonthly:{ label: 'Semi-Monthly',periods: 24 },
  biweekly:   { label: 'Bi-Weekly',   periods: 26 },
  weekly:     { label: 'Weekly',      periods: 52 },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(n: number, decimals = 0) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtDollar(n: number, decimals = 2) {
  return '$' + fmt(n, decimals);
}
function parseMoney(s: string) {
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
}
function fmtMoneyInput(s: string) {
  const raw = s.replace(/[^0-9.]/g, '');
  const parts = raw.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
}

function calcFederalTax(taxableIncome: number, filing: string): number {
  const brackets = FEDERAL_BRACKETS[filing] || FEDERAL_BRACKETS.single;
  let tax = 0;
  for (const [lo, hi, rate] of brackets) {
    if (taxableIncome <= lo) break;
    tax += (Math.min(taxableIncome, hi) - lo) * rate;
  }
  return Math.max(0, tax);
}

function calcStateTax(annualGross: number, stateCode: string): number {
  const st = STATE_TAXES[stateCode];
  if (!st || st.rate === 0) return 0;
  // Simplified top marginal approach for states without full bracket tables
  return annualGross * st.rate * 0.75; // approximate effective rate
}

interface CalcResult {
  grossAnnual: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  preTaxDeductions: number;
  postTaxDeductions: number;
  netAnnual: number;
  effectiveRate: number;
  marginalRate: number;
  ficaTotal: number;
}

function calculate(
  mode: string,
  salaryStr: string,
  hourlyStr: string,
  hoursStr: string,
  overtimeHoursStr: string,
  bonusStr: string,
  filing: string,
  state: string,
  freq: string,
  k401: string,
  hsa: string,
  healthIns: string,
  fsa: string,
  roth401: string,
  otherPost: string,
): CalcResult {
  let baseAnnual = 0;
  if (mode === 'salary') {
    baseAnnual = parseMoney(salaryStr);
  } else {
    const hourly = parseMoney(hourlyStr);
    const hours = parseFloat(hoursStr) || 40;
    const ot = parseFloat(overtimeHoursStr) || 0;
    baseAnnual = (hourly * hours + ot * hourly * 1.5) * 52;
  }

  const bonusAnnual = parseMoney(bonusStr);
  const grossAnnual = baseAnnual + bonusAnnual;

  // Pre-tax deductions
  const k401Amt = parseMoney(k401);
  const hsaAmt = parseMoney(hsa);
  const healthAmt = parseMoney(healthIns);
  const fsaAmt = parseMoney(fsa);
  const preTaxTotal = k401Amt + hsaAmt + healthAmt + fsaAmt;

  // FICA base (HSA & health ins reduce FICA too)
  const ficaBase = Math.max(0, grossAnnual - hsaAmt - healthAmt);

  // Social Security 2026: 6.2% up to $184,500
  const ssCap = 184500;
  const socialSecurity = Math.min(ficaBase, ssCap) * 0.062;

  // Medicare: 1.45% + 0.9% over $200k
  const medicareTax = ficaBase * 0.0145;
  const additionalMedicare = Math.max(0, ficaBase - 200000) * 0.009;

  // Federal taxable income
  const stdDed = STANDARD_DEDUCTIONS[filing] || STANDARD_DEDUCTIONS.single;
  const taxableIncome = Math.max(0, grossAnnual - preTaxTotal - stdDed);
  const federalTax = calcFederalTax(taxableIncome, filing);

  // State tax
  const stateTax = calcStateTax(grossAnnual - preTaxTotal, state);

  // Post-tax deductions
  const rothAmt = parseMoney(roth401);
  const otherPostAmt = parseMoney(otherPost);
  const postTaxTotal = rothAmt + otherPostAmt;

  const totalDeductions = federalTax + stateTax + socialSecurity + medicareTax + additionalMedicare + preTaxTotal + postTaxTotal;
  const netAnnual = Math.max(0, grossAnnual - totalDeductions);
  const effectiveRate = grossAnnual > 0 ? (federalTax + stateTax + socialSecurity + medicareTax + additionalMedicare) / grossAnnual : 0;

  // Marginal federal rate
  const brackets = FEDERAL_BRACKETS[filing] || FEDERAL_BRACKETS.single;
  let marginalRate = brackets[brackets.length - 1][2];
  for (const [lo, hi, rate] of brackets) {
    if (taxableIncome <= hi) { marginalRate = rate; break; }
  }

  return {
    grossAnnual,
    federalTax,
    stateTax,
    socialSecurity,
    medicare: medicareTax + additionalMedicare,
    additionalMedicare,
    preTaxDeductions: preTaxTotal,
    postTaxDeductions: postTaxTotal,
    netAnnual,
    effectiveRate,
    marginalRate,
    ficaTotal: socialSecurity + medicareTax + additionalMedicare,
  };
}

// ── SVG Donut Chart ────────────────────────────────────────────────────────
function DonutChart({ slices }: { slices: { value: number; color: string; label: string }[] }) {
  const total = slices.reduce((s, x) => s + Math.max(0, x.value), 0);
  if (total === 0) return null;
  let cumulative = 0;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const paths: { d: string; color: string }[] = [];
  for (const sl of slices) {
    if (sl.value <= 0) continue;
    const frac = sl.value / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const endAngle = (cumulative + frac) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = frac > 0.5 ? 1 : 0;
    const innerR = 42;
    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);
    paths.push({
      color: sl.color,
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`,
    });
    cumulative += frac;
  }
  return (
    <svg viewBox="0 0 180 180" className="w-full max-w-[180px]">
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} />
      ))}
      <circle cx={cx} cy={cy} r={42} fill="white" />
    </svg>
  );
}

// ── Comparison Panel ───────────────────────────────────────────────────────
interface ScenarioData {
  label: string;
  salary: string;
  hourly: string;
  state: string;
  k401: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SalaryCalculator() {
  // Mode
  const [inputMode, setInputMode] = useState<'salary' | 'hourly'>('salary');
  const [activeTab, setActiveTab] = useState<'results' | 'compare' | 'tips'>('results');

  // Inputs
  const [salaryInput, setSalaryInput] = useState('75,000');
  const [hourlyInput, setHourlyInput] = useState('25.00');
  const [hoursInput, setHoursInput] = useState('40');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [bonusInput, setBonusInput] = useState('0');
  const [filing, setFiling] = useState('single');
  const [state, setState] = useState('TX');
  const [payFreq, setPayFreq] = useState('biweekly');

  // Deductions
  const [k401Input, setK401Input] = useState('0');
  const [hsaInput, setHsaInput] = useState('0');
  const [healthInput, setHealthInput] = useState('0');
  const [fsaInput, setFsaInput] = useState('0');
  const [roth401Input, setRoth401Input] = useState('0');
  const [otherPostInput, setOtherPostInput] = useState('0');
  const [showDeductions, setShowDeductions] = useState(false);

  // Compare
  const [compareMode, setCompareMode] = useState(false);
  const [scenario2, setScenario2] = useState<ScenarioData>({
    label: 'Scenario B',
    salary: '90,000',
    hourly: '30.00',
    state: 'CA',
    k401: '0',
  });

  // Result
  const [result, setResult] = useState<CalcResult | null>(null);
  const [result2, setResult2] = useState<CalcResult | null>(null);

  const runCalc = useCallback(() => {
    const r = calculate(
      inputMode, salaryInput, hourlyInput, hoursInput, overtimeHours,
      bonusInput, filing, state, payFreq,
      k401Input, hsaInput, healthInput, fsaInput, roth401Input, otherPostInput,
    );
    setResult(r);

    if (compareMode) {
      const r2 = calculate(
        inputMode, scenario2.salary, scenario2.hourly, hoursInput, overtimeHours,
        bonusInput, filing, scenario2.state, payFreq,
        scenario2.k401, hsaInput, healthInput, fsaInput, roth401Input, otherPostInput,
      );
      setResult2(r2);
    }
  }, [inputMode, salaryInput, hourlyInput, hoursInput, overtimeHours, bonusInput,
      filing, state, payFreq, k401Input, hsaInput, healthInput, fsaInput,
      roth401Input, otherPostInput, compareMode, scenario2]);

  useEffect(() => { runCalc(); }, [runCalc]);

  const periods = PAY_FREQ[payFreq]?.periods ?? 26;

  const perPeriod = (annual: number) => annual / periods;

  const stateSorted = Object.entries(STATE_TAXES).sort((a, b) => a[1].name.localeCompare(b[1].name));

  const donutSlices = result ? [
    { value: result.netAnnual, color: '#2563eb', label: 'Take-Home' },
    { value: result.federalTax, color: '#ef4444', label: 'Federal Tax' },
    { value: result.stateTax, color: '#f97316', label: 'State Tax' },
    { value: result.ficaTotal, color: '#8b5cf6', label: 'FICA' },
    { value: result.preTaxDeductions, color: '#10b981', label: 'Pre-Tax Deductions' },
  ] : [];

  // ── Row component ────────────────────────────────────────────────────────
  const Row = ({ label, annual, highlight = false, muted = false, color = '' }:
    { label: string; annual: number; highlight?: boolean; muted?: boolean; color?: string }) => (
    <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${highlight ? 'bg-blue-50 border border-blue-200' : muted ? '' : 'hover:bg-gray-50'}`}>
      <span className={`text-sm ${muted ? 'text-gray-400' : highlight ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{label}</span>
      <div className="text-right">
        <span className={`text-sm font-semibold ${color || (highlight ? 'text-blue-700' : 'text-gray-800')}`}>
          {fmtDollar(perPeriod(annual))}
        </span>
        <span className="text-xs text-gray-400 ml-2 hidden sm:inline">{fmtDollar(annual)}/yr</span>
      </div>
    </div>
  );

  // input style
  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white";
  const label = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <div style={{ fontFamily: "DM Sans, Helvetica Neue, sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }} className="text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-3">
            <a href="/" className="text-blue-200 text-sm hover:text-white transition">← freecalcs.io</a>
          </div>
          <h1 className="text-3xl font-bold mb-2">Salary & Take-Home Pay Calculator</h1>
          <p className="text-blue-200 text-sm max-w-xl">
            Instantly see your real take-home pay after federal tax, state tax, FICA, and all deductions.
            All 50 states · 2026 tax rates · No sign-up required.
          </p>
          <div className="flex gap-3 mt-4">
            <span className="bg-white/10 text-xs px-3 py-1 rounded-full">✓ 2026 Tax Brackets</span>
            <span className="bg-white/10 text-xs px-3 py-1 rounded-full">✓ All 50 States</span>
            <span className="bg-white/10 text-xs px-3 py-1 rounded-full">✓ Live Calculation</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT: Inputs */}
          <div className="lg:col-span-2 space-y-4">

            {/* Mode toggle */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-4">
                {(['salary', 'hourly'] as const).map(m => (
                  <button key={m} onClick={() => setInputMode(m)}
                    className={`flex-1 py-2.5 text-sm font-semibold transition ${inputMode === m ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    {m === 'salary' ? '💼 Salary' : '⏰ Hourly'}
                  </button>
                ))}
              </div>

              {inputMode === 'salary' ? (
                <div>
                  <label className={label}>Annual Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                    <input className={inp + ' pl-7'} type="text" inputMode="numeric"
                      value={salaryInput}
                      onChange={e => setSalaryInput(fmtMoneyInput(e.target.value))} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className={label}>Hourly Rate</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input className={inp + ' pl-7'} type="text" inputMode="decimal"
                        value={hourlyInput} onChange={e => setHourlyInput(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={label}>Hrs/Week</label>
                      <input className={inp} type="number" min="0" max="80"
                        value={hoursInput} onChange={e => setHoursInput(e.target.value)} />
                    </div>
                    <div>
                      <label className={label}>OT Hrs/Wk</label>
                      <input className={inp} type="number" min="0" max="40"
                        value={overtimeHours} onChange={e => setOvertimeHours(e.target.value)} />
                    </div>
                  </div>
                  {parseFloat(hourlyInput) > 0 && (
                    <div className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                      ≈ {fmtDollar((parseMoney(hourlyInput) * (parseFloat(hoursInput) || 40)) * 52)}/yr base
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filing & State */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
              <div>
                <label className={label}>Filing Status</label>
                <select className={inp} value={filing} onChange={e => setFiling(e.target.value)}>
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="married_sep">Married Filing Separately</option>
                  <option value="hoh">Head of Household</option>
                </select>
              </div>
              <div>
                <label className={label}>State</label>
                <select className={inp} value={state} onChange={e => setState(e.target.value)}>
                  {stateSorted.map(([code, s]) => (
                    <option key={code} value={code}>
                      {s.name}{NO_INCOME_TAX_STATES.includes(code) ? ' (No Income Tax)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Pay Frequency</label>
                <select className={inp} value={payFreq} onChange={e => setPayFreq(e.target.value)}>
                  {Object.entries(PAY_FREQ).map(([k, v]) => (
                    <option key={k} value={k}>{v.label} ({v.periods}x/yr)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Annual Bonus / Commission</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input className={inp + ' pl-7'} type="text" inputMode="numeric"
                    value={bonusInput} onChange={e => setBonusInput(fmtMoneyInput(e.target.value))} />
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setShowDeductions(!showDeductions)}>
                <span className="text-sm font-semibold text-gray-700">💰 Deductions & Benefits</span>
                <span className="text-gray-400 text-lg">{showDeductions ? '−' : '+'}</span>
              </button>
              {showDeductions && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                  <p className="text-xs text-green-600 font-medium">Pre-tax (reduces taxable income)</p>
                  {[
                    ['Traditional 401(k)', k401Input, setK401Input, `Max $${(23500).toLocaleString()}/yr`],
                    ['HSA Contribution', hsaInput, setHsaInput, 'Max $4,300 self/$8,550 family'],
                    ['Health Insurance', healthInput, setHealthInput, 'Medical/dental/vision'],
                    ['FSA', fsaInput, setFsaInput, 'Max $3,400/yr'],
                  ].map(([lbl, val, setter, hint]: any) => (
                    <div key={lbl}>
                      <label className={label}>{lbl} <span className="normal-case font-normal text-gray-400">{hint}</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input className={inp + ' pl-7'} type="text" inputMode="numeric"
                          value={val} onChange={(e: any) => setter(fmtMoneyInput(e.target.value))} />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-purple-600 font-medium mt-3">Post-tax</p>
                  {[
                    ['Roth 401(k)', roth401Input, setRoth401Input, 'Max $23,500/yr'],
                    ['Other Deductions', otherPostInput, setOtherPostInput, 'Union dues, garnishments, etc.'],
                  ].map(([lbl, val, setter, hint]: any) => (
                    <div key={lbl}>
                      <label className={label}>{lbl} <span className="normal-case font-normal text-gray-400">{hint}</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input className={inp + ' pl-7'} type="text" inputMode="numeric"
                          value={val} onChange={(e: any) => setter(fmtMoneyInput(e.target.value))} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-3 space-y-4">

            {/* Big take-home card */}
            {result && (
              <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }} className="rounded-2xl p-5 text-white shadow-md">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                  {PAY_FREQ[payFreq]?.label} Take-Home Pay
                </p>
                <div className="text-4xl font-bold mb-1">{fmtDollar(perPeriod(result.netAnnual))}</div>
                <p className="text-blue-200 text-sm">{fmtDollar(result.netAnnual)} per year</p>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-blue-200 text-xs">Gross Pay</p>
                    <p className="font-bold">{fmtDollar(perPeriod(result.grossAnnual))}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-blue-200 text-xs">Effective Rate</p>
                    <p className="font-bold">{(result.effectiveRate * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-blue-200 text-xs">Marginal Rate</p>
                    <p className="font-bold">{(result.marginalRate * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {(['results', 'compare', 'tips'] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition ${activeTab === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t === 'results' ? '📊 Breakdown' : t === 'compare' ? '⚖️ Compare' : '💡 Tax Tips'}
                </button>
              ))}
            </div>

            {/* RESULTS TAB */}
            {activeTab === 'results' && result && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Donut */}
                  <div className="flex-shrink-0">
                    <DonutChart slices={donutSlices} />
                    <div className="space-y-1 mt-2">
                      {donutSlices.filter(s => s.value > 0).map(s => (
                        <div key={s.label} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }}></span>
                          <span className="text-xs text-gray-500">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rows */}
                  <div className="flex-1 w-full space-y-0.5">
                    <div className="flex justify-between items-center text-xs text-gray-400 px-3 pb-1 border-b border-gray-100 mb-1">
                      <span>Item</span>
                      <div className="flex gap-6">
                        <span>{PAY_FREQ[payFreq]?.label}</span>
                        <span className="hidden sm:block w-24 text-right">Annual</span>
                      </div>
                    </div>
                    <Row label="Gross Pay" annual={result.grossAnnual} />
                    {result.preTaxDeductions > 0 && <Row label="Pre-Tax Deductions" annual={-result.preTaxDeductions} color="text-green-600" />}
                    <Row label="Federal Income Tax" annual={result.federalTax} color="text-red-500" />
                    {result.stateTax > 0 && <Row label={`${STATE_TAXES[state]?.name || state} State Tax`} annual={result.stateTax} color="text-orange-500" />}
                    <Row label="Social Security (6.2%)" annual={result.socialSecurity} color="text-purple-500" />
                    <Row label="Medicare (1.45%)" annual={result.medicare - result.additionalMedicare} color="text-purple-500" />
                    {result.additionalMedicare > 0 && <Row label="Add'l Medicare (0.9%)" annual={result.additionalMedicare} color="text-purple-500" />}
                    {result.postTaxDeductions > 0 && <Row label="Post-Tax Deductions" annual={result.postTaxDeductions} color="text-gray-500" />}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <Row label="🏠 Net Take-Home Pay" annual={result.netAnnual} highlight />
                    </div>
                  </div>
                </div>

                {/* Pay period row */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Take-Home by Pay Period</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(PAY_FREQ).map(([k, v]) => (
                      <div key={k} className={`rounded-xl p-3 text-center cursor-pointer transition border ${payFreq === k ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                        onClick={() => setPayFreq(k)}>
                        <p className="text-xs text-gray-400">{v.label}</p>
                        <p className="font-bold text-sm text-gray-800">{fmtDollar(result.netAnnual / v.periods)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COMPARE TAB */}
            {activeTab === 'compare' && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                <p className="text-sm text-gray-500">Compare two job offers or scenarios side-by-side.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-bold text-blue-600 mb-2">Scenario A (Current)</p>
                    <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
                      <p className="text-gray-500">Gross: <strong className="text-gray-800">{fmtDollar(result?.grossAnnual || 0)}/yr</strong></p>
                      <p className="text-gray-500">State: <strong className="text-gray-800">{STATE_TAXES[state]?.name}</strong></p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-600 mb-2">Scenario B (Compare)</p>
                    <div className="space-y-2">
                      <div>
                        <label className={label}>Salary</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <input className={inp + ' pl-6 text-sm'} type="text" inputMode="numeric"
                            value={scenario2.salary}
                            onChange={e => setScenario2({ ...scenario2, salary: fmtMoneyInput(e.target.value) })} />
                        </div>
                      </div>
                      <div>
                        <label className={label}>State</label>
                        <select className={inp + ' text-sm'} value={scenario2.state}
                          onChange={e => setScenario2({ ...scenario2, state: e.target.value })}>
                          {stateSorted.map(([code, s]) => <option key={code} value={code}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {result && result2 && (
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    {[
                      ['Gross Annual', result.grossAnnual, result2.grossAnnual],
                      ['Federal Tax', result.federalTax, result2.federalTax],
                      ['State Tax', result.stateTax, result2.stateTax],
                      ['FICA', result.ficaTotal, result2.ficaTotal],
                      ['Net Take-Home', result.netAnnual, result2.netAnnual],
                    ].map(([lbl, a, b]) => {
                      const diff = (b as number) - (a as number);
                      return (
                        <div key={lbl as string} className={`flex items-center gap-2 p-2 rounded-lg ${lbl === 'Net Take-Home' ? 'bg-gray-50 font-semibold' : ''}`}>
                          <span className="text-xs text-gray-500 w-28">{lbl}</span>
                          <span className="flex-1 text-sm text-blue-700 text-right">{fmtDollar(a as number)}</span>
                          <span className="flex-1 text-sm text-purple-700 text-right">{fmtDollar(b as number)}</span>
                          <span className={`text-xs font-bold w-20 text-right ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {diff > 0 ? '+' : ''}{fmtDollar(diff)}
                          </span>
                        </div>
                      );
                    })}
                    <div className="text-center pt-2">
                      {result2.netAnnual > result.netAnnual ? (
                        <p className="text-sm font-semibold text-green-600">
                          Scenario B pays {fmtDollar(result2.netAnnual - result.netAnnual)} more per year
                          ({fmtDollar((result2.netAnnual - result.netAnnual) / periods)} per paycheck)
                        </p>
                      ) : result.netAnnual > result2.netAnnual ? (
                        <p className="text-sm font-semibold text-blue-600">
                          Scenario A pays {fmtDollar(result.netAnnual - result2.netAnnual)} more per year
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">Both scenarios yield equal take-home pay.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TIPS TAB */}
            {activeTab === 'tips' && result && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-800">💡 Personalized Tax-Saving Tips</h3>

                {parseMoney(k401Input) < 23500 && (
                  <div className="flex gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                    <span className="text-2xl">📈</span>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Max out your 401(k)</p>
                      <p className="text-xs text-green-700 mt-0.5">
                        You can contribute up to ${(23500).toLocaleString()}/yr. Each additional $1,000 pre-tax
                        saves ~{fmtDollar(1000 * result.marginalRate)} in federal tax.
                        {' '}Maxing out saves ~{fmtDollar((23500 - parseMoney(k401Input)) * result.marginalRate)}/yr in federal tax.
                      </p>
                    </div>
                  </div>
                )}

                {parseMoney(hsaInput) === 0 && (
                  <div className="flex gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="text-2xl">🏥</span>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Open an HSA</p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        If you have a high-deductible health plan, an HSA lets you save $4,300/yr (self-only) tax-free.
                        That's a {(result.marginalRate * 100).toFixed(0)}% instant return on your contribution.
                      </p>
                    </div>
                  </div>
                )}

                {NO_INCOME_TAX_STATES.includes(state) ? (
                  <div className="flex gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">You live in a no-income-tax state!</p>
                      <p className="text-xs text-yellow-700 mt-0.5">
                        {STATE_TAXES[state]?.name} has no state income tax. That is a significant advantage vs. high-tax states like CA or NY.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-2xl">🗺️</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">State Tax Impact</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        You pay ~{fmtDollar(result.stateTax)}/yr in {STATE_TAXES[state]?.name} state tax.
                        Moving to a no-tax state (TX, FL, NV, etc.) would save this amount annually.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-sm font-semibold text-purple-800">Marginal vs. Effective Rate</p>
                    <p className="text-xs text-purple-700 mt-0.5">
                      Your marginal (highest) rate is {(result.marginalRate * 100).toFixed(0)}%, but your effective rate is only {(result.effectiveRate * 100).toFixed(1)}%.
                      This means your average dollar is taxed at {(result.effectiveRate * 100).toFixed(1)}%, not {(result.marginalRate * 100).toFixed(0)}%.
                      The US uses a progressive system. Only dollars above each threshold are taxed at the higher rate.
                    </p>
                  </div>
                )}

                {result.grossAnnual > 200000 && (
                  <div className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="text-sm font-semibold text-red-800">Additional Medicare Tax</p>
                      <p className="text-xs text-red-700 mt-0.5">
                        You owe an extra 0.9% Medicare tax on income above $200,000. Consider maximizing
                        pre-tax deductions to reduce your taxable income below this threshold if possible.
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">2026 Key Limits</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <span>401(k) limit: $23,500</span>
                    <span>HSA (self): $4,300</span>
                    <span>SS wage base: $184,500</span>
                    <span>FSA limit: $3,400</span>
                    <span>Standard ded. (single): $16,100</span>
                    <span>Standard ded. (MFJ): $32,200</span>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 px-1">
              Estimates based on 2026 IRS tax rates. Actual withholding may vary based on W-4 elections, 
              local taxes, and employer-specific factors. Not tax advice. Consult a tax professional.
            </p>
          </div>
        </div>

        {/* FAQ / SEO Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">How is Take-Home Pay Calculated?</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong className="text-gray-800">1. Start with Gross Pay</strong> - your salary or hourly rate x hours worked.</p>
              <p><strong className="text-gray-800">2. Subtract Pre-Tax Deductions</strong> - 401(k), HSA, and health insurance reduce your taxable income.</p>
              <p><strong className="text-gray-800">3. Calculate Federal Tax</strong> - using 2026 IRS progressive brackets (10%-37%).</p>
              <p><strong className="text-gray-800">4. Calculate State Tax</strong> - varies by state (0% in TX, FL, NV to 13.3% in CA).</p>
              <p><strong className="text-gray-800">5. Subtract FICA</strong> - Social Security (6.2% up to $184,500) + Medicare (1.45%).</p>
              <p><strong className="text-gray-800">6. Net Pay</strong> = Gross − All Taxes − All Deductions.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">2026 FICA & Tax Rates</h2>
            <div className="space-y-2 text-sm">
              {[
                ['Social Security', '6.2%', 'Up to $184,500'],
                ['Medicare', '1.45%', 'No limit'],
                ['Add\'l Medicare', '0.9%', 'Over $200,000'],
                ['Federal (lowest)', '10%', 'Up to $12,400 (single)'],
                ['Federal (highest)', '37%', 'Over $626,350 (single)'],
                ['Standard Deduction', '$16,100', 'Single filer 2026'],
              ].map(([item, rate, note]) => (
                <div key={item} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-600">{item}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-800 mr-2">{rate}</span>
                    <span className="text-xs text-gray-400">{note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Internal links */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[
              ['Income Tax Calculator', '/tax'],
              ['Mortgage Calculator', '/mortgage'],
              ['Compound Interest', '/compound-interest'],
              ['Loan Calculator', '/loan'],
              ['TDEE & Calories', '/tdee'],
            ].map(([name, href]) => (
              <a key={href} href={href}
                className="bg-white text-sm text-blue-700 font-medium px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition">
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
