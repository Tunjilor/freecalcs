// PURE compute for the Federal Income Tax Calculator (the upgraded /tax). All
// tax figures come from tax-data.ts — nothing hardcoded here. Preserves every
// capability of the prior /tax EXCEPT self-employment tax, long-term capital
// gains, and the withholding→refund estimator, which now live on their own
// dedicated pages (/self-employment-tax, /capital-gains-tax, /tax-refund).

import {
  TAX_DATA,
  calcFederalTax,
  marginalRate,
  bracketBreakdown,
  type FilingStatus,
  type TaxYear,
} from "../../lib/calculator/tax-data.ts";

export type IncomeTaxInputs = {
  year: TaxYear;
  filing: FilingStatus;
  wages: number;
  interest: number;
  dividends: number;
  otherIncome: number;
  deductionType: "standard" | "itemized";
  itemizedAmount: number;
  contribution401k: number;
  hsa: number;
  studentLoanInterest: number; // capped at $2,500
  children: number; // qualifying children for the Child Tax Credit
};

export type BracketRow = {
  rate: number; // percent, e.g. 22
  amountInBracket: number;
  taxInBracket: number;
};

export type IncomeTaxResults = {
  totalIncome: number;
  aboveLineDeductions: number;
  agi: number;
  deduction: number;
  deductionKind: string; // "standard" | "itemized"
  taxableIncome: number;
  taxBeforeCredits: number;
  childTaxCredit: number;
  federalTax: number; // after credits
  effectiveRate: number; // percent (0–100), tax / total income
  marginalRate: number; // percent (0–100)
  afterTaxIncome: number; // total income − federal tax
  brackets: BracketRow[]; // bracket-by-bracket breakdown
  curve: { x: string; y: number }[]; // cumulative tax vs taxable income (chart)
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const STUDENT_LOAN_CAP = 2500;

export function computeIncomeTax(v: IncomeTaxInputs): IncomeTaxResults {
  const yd = TAX_DATA[v.year];
  const brackets = yd.brackets[v.filing];

  const totalIncome =
    Math.max(0, v.wages) + Math.max(0, v.interest) + Math.max(0, v.dividends) + Math.max(0, v.otherIncome);

  const aboveLine =
    Math.max(0, v.contribution401k) +
    Math.max(0, v.hsa) +
    Math.min(Math.max(0, v.studentLoanInterest), STUDENT_LOAN_CAP);
  const agi = Math.max(0, totalIncome - aboveLine);

  const stdDed = yd.stdDed[v.filing];
  // Itemizing still floors at the standard deduction (you take the larger).
  const deduction =
    v.deductionType === "itemized" ? Math.max(stdDed, Math.max(0, v.itemizedAmount)) : stdDed;
  const deductionKind = deduction > stdDed ? "itemized" : "standard";

  const taxableIncome = Math.max(0, agi - deduction);
  const taxBeforeCredits = calcFederalTax(taxableIncome, brackets);

  const children = Math.max(0, Math.floor(v.children));
  const childTaxCredit = Math.min(children * yd.childTaxCredit, taxBeforeCredits);
  const federalTax = Math.max(0, taxBeforeCredits - childTaxCredit);

  const rows = bracketBreakdown(taxableIncome, brackets).map((b) => ({
    rate: round2(b.rate * 100),
    amountInBracket: round2(b.amountInBracket),
    taxInBracket: round2(b.taxInBracket),
  }));

  // Cumulative-tax curve: tax owed as taxable income rises from 0 to the user's.
  const curve: { x: string; y: number }[] = [];
  const steps = 40;
  const top = Math.max(taxableIncome, 1);
  for (let i = 0; i <= steps; i++) {
    const x = (top / steps) * i;
    curve.push({ x: `$${Math.round(x / 1000)}k`, y: round2(calcFederalTax(x, brackets)) });
  }

  return {
    totalIncome: round2(totalIncome),
    aboveLineDeductions: round2(aboveLine),
    agi: round2(agi),
    deduction: round2(deduction),
    deductionKind,
    taxableIncome: round2(taxableIncome),
    taxBeforeCredits: round2(taxBeforeCredits),
    childTaxCredit: round2(childTaxCredit),
    federalTax: round2(federalTax),
    effectiveRate: totalIncome > 0 ? round2((federalTax / totalIncome) * 100) : 0,
    marginalRate: round2(marginalRate(taxableIncome, brackets) * 100),
    afterTaxIncome: round2(totalIncome - federalTax),
    brackets: rows,
    curve,
  };
}
