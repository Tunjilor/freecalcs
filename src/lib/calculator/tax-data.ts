// SINGLE SOURCE OF TRUTH for every U.S. federal tax figure that changes
// annually. Every tax calculator imports from here — no tax number is hardcoded
// in any compute or definition. The annual update is a single-file edit: next
// January, add a "2027" block and bump DEFAULT_YEAR.
//
// SOURCES (each value below is the official figure for its year):
//   2025 ordinary brackets, standard deduction, LTCG thresholds — IRS Rev. Proc.
//     2024-40. (These match the values already shipped in production /tax.)
//   2026 ordinary brackets, standard deduction, LTCG thresholds — IRS Rev. Proc.
//     2025-32. (Also matching production /tax.)
//   Social Security wage base — SSA COLA fact sheets: 2025 = $176,100;
//     2026 = $184,500.
//   FICA rates (SS 6.2% / 12.4% SE; Medicare 1.45% / 2.9% SE), Additional
//     Medicare 0.9% over $200k single / $250k MFJ / $125k MFS, and the SE net
//     factor 0.9235 — IRC / IRS Topic Nos. 751 & 560 (fixed by statute; the
//     Additional Medicare thresholds are NOT inflation-indexed).
//   Child Tax Credit $2,200/child — reflects the amount shipped in production
//     /tax (OBBBA, 2025). Verify/adjust for indexing each year.

export type FilingStatus = "single" | "married" | "married_sep" | "hoh";
export type TaxYear = "2025" | "2026";

/** [lowerBound, upperBound, rate] — upperBound is exclusive; last is Infinity. */
export type Bracket = [number, number, number];
export type FilingTable = Record<FilingStatus, Bracket[]>;

export type YearData = {
  brackets: FilingTable; // ordinary income
  stdDed: Record<FilingStatus, number>;
  ltcg: FilingTable; // long-term capital gains
  ssWageBase: number; // Social Security taxable maximum
  childTaxCredit: number; // per qualifying child
};

export const TAX_DATA: Record<TaxYear, YearData> = {
  // ---- 2025 — IRS Rev. Proc. 2024-40; SSA 2025 wage base $176,100 ----
  "2025": {
    brackets: {
      single:      [[0,11925,.10],[11925,48475,.12],[48475,103350,.22],[103350,197300,.24],[197300,250525,.32],[250525,626350,.35],[626350,Infinity,.37]],
      married:     [[0,23850,.10],[23850,96950,.12],[96950,206700,.22],[206700,394600,.24],[394600,501050,.32],[501050,751600,.35],[751600,Infinity,.37]],
      married_sep: [[0,11925,.10],[11925,48475,.12],[48475,103350,.22],[103350,197300,.24],[197300,250525,.32],[250525,375800,.35],[375800,Infinity,.37]],
      hoh:         [[0,17000,.10],[17000,64850,.12],[64850,103350,.22],[103350,197300,.24],[197300,250500,.32],[250500,626350,.35],[626350,Infinity,.37]],
    },
    stdDed: { single: 15750, married: 31500, married_sep: 15750, hoh: 23625 },
    ltcg: {
      single:      [[0,48350,0],[48350,533400,.15],[533400,Infinity,.20]],
      married:     [[0,96700,0],[96700,600050,.15],[600050,Infinity,.20]],
      married_sep: [[0,48350,0],[48350,300000,.15],[300000,Infinity,.20]],
      hoh:         [[0,64750,0],[64750,566700,.15],[566700,Infinity,.20]],
    },
    ssWageBase: 176100,
    childTaxCredit: 2200,
  },
  // ---- 2026 — IRS Rev. Proc. 2025-32; SSA 2026 wage base $184,500 ----
  "2026": {
    brackets: {
      single:      [[0,12400,.10],[12400,50400,.12],[50400,105700,.22],[105700,201775,.24],[201775,256225,.32],[256225,640600,.35],[640600,Infinity,.37]],
      married:     [[0,24800,.10],[24800,100800,.12],[100800,211400,.22],[211400,403550,.24],[403550,512450,.32],[512450,768700,.35],[768700,Infinity,.37]],
      married_sep: [[0,12400,.10],[12400,50400,.12],[50400,105700,.22],[105700,201775,.24],[201775,256225,.32],[256225,384350,.35],[384350,Infinity,.37]],
      hoh:         [[0,17700,.10],[17700,67450,.12],[67450,105700,.22],[105700,201775,.24],[201775,256200,.32],[256200,640600,.35],[640600,Infinity,.37]],
    },
    stdDed: { single: 16100, married: 32200, married_sep: 16100, hoh: 24150 },
    ltcg: {
      single:      [[0,49450,0],[49450,545500,.15],[545500,Infinity,.20]],
      married:     [[0,98900,0],[98900,613700,.15],[613700,Infinity,.20]],
      married_sep: [[0,49450,0],[49450,306850,.15],[306850,Infinity,.20]],
      hoh:         [[0,66200,0],[66200,579600,.15],[579600,Infinity,.20]],
    },
    ssWageBase: 184500,
    childTaxCredit: 2200,
  },
};

export const DEFAULT_YEAR: TaxYear = "2026";

// FICA / self-employment constants — fixed by statute (see sources above).
export const FICA = {
  ssRateEmployee: 0.062,
  ssRateSelfEmployed: 0.124,
  medicareRateEmployee: 0.0145,
  medicareRateSelfEmployed: 0.029,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: {
    single: 200000,
    married: 250000,
    married_sep: 125000,
    hoh: 200000,
  } as Record<FilingStatus, number>,
  seNetFactor: 0.9235, // net SE earnings multiplier before SE tax
} as const;

// Shared select options so every tax calculator labels filing status/year the same.
export const FILING_OPTIONS: { label: string; value: FilingStatus }[] = [
  { label: "Single", value: "single" },
  { label: "Married filing jointly", value: "married" },
  { label: "Married filing separately", value: "married_sep" },
  { label: "Head of household", value: "hoh" },
];

export const YEAR_OPTIONS: { label: string; value: TaxYear }[] = [
  { label: "2026 tax year", value: "2026" },
  { label: "2025 tax year", value: "2025" },
];

// ---- Core bracket math (pure; operates on the tables above) ----------------

/** Progressive tax on `taxable` using a filing status's ordinary brackets. */
export function calcFederalTax(taxable: number, brackets: Bracket[]): number {
  let tax = 0;
  for (const [lo, hi, rate] of brackets) {
    if (taxable <= lo) break;
    tax += (Math.min(taxable, hi) - lo) * rate;
  }
  return Math.max(0, tax);
}

/** Marginal rate — the rate on the last dollar of `taxable`. */
export function marginalRate(taxable: number, brackets: Bracket[]): number {
  for (const [lo, hi, rate] of brackets) {
    void lo;
    if (taxable <= hi) return rate;
  }
  return brackets[brackets.length - 1][2];
}

/**
 * Long-term capital-gains tax: the gain is stacked ON TOP of ordinary income,
 * so it's taxed at the 0/15/20% rate(s) that apply to the income band(s) it
 * lands in. `ordinaryIncome` is taxable ordinary income (after deductions).
 */
export function calcLTCGTax(
  gain: number,
  ordinaryIncome: number,
  ltcgBrackets: Bracket[],
): number {
  let tax = 0;
  for (const [lo, hi, rate] of ltcgBrackets) {
    if (ordinaryIncome >= hi) continue;
    const taxableAtRate = Math.min(ordinaryIncome + gain, hi) - Math.max(ordinaryIncome, lo);
    if (taxableAtRate > 0) tax += taxableAtRate * rate;
  }
  return Math.max(0, tax);
}

/** Per-bracket breakdown of ordinary tax, for the "how your tax stacks up" view. */
export function bracketBreakdown(
  taxable: number,
  brackets: Bracket[],
): { rate: number; amountInBracket: number; taxInBracket: number }[] {
  const out: { rate: number; amountInBracket: number; taxInBracket: number }[] = [];
  for (const [lo, hi, rate] of brackets) {
    if (taxable <= lo) break;
    const amountInBracket = Math.min(taxable, hi) - lo;
    if (amountInBracket > 0) out.push({ rate, amountInBracket, taxInBracket: amountInBracket * rate });
  }
  return out;
}
