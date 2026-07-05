// PURE compute for the Paycheck (take-home) Calculator. All tax figures come
// from tax-data.ts — nothing hardcoded here.
//
// Federal withholding is ESTIMATED with the annualized-bracket method: annualize
// the check, subtract pre-tax deductions and the standard deduction, apply the
// brackets, then divide back per period. This approximates IRS Pub. 15-T
// percentage-method withholding closely enough for planning and is clearly
// labeled an estimate. FICA is applied to gross wages (the common simplification;
// 401(k) is FICA-taxable, so this is accurate for 401(k) deferrals).

import {
  TAX_DATA,
  FICA,
  calcFederalTax,
  type FilingStatus,
  type TaxYear,
} from "../../lib/calculator/tax-data.ts";

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export type PaycheckInputs = {
  year: TaxYear;
  filing: FilingStatus;
  grossPerCheck: number;
  frequency: PayFrequency;
  preTaxPerCheck: number; // 401(k)/HSA etc. per check (reduces taxable income)
};

export type PaycheckResults = {
  periods: number;
  annualGross: number;
  federalPerCheck: number;
  socialSecurityPerCheck: number;
  medicarePerCheck: number;
  ficaPerCheck: number;
  netPerCheck: number;
  annualNet: number;
  takeHomeRate: number; // net / gross (0–1)
  hitSsCap: boolean;
};

const PERIODS: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computePaycheck(v: PaycheckInputs): PaycheckResults {
  const periods = PERIODS[v.frequency];
  const gross = Math.max(0, v.grossPerCheck);
  const preTax = Math.min(Math.max(0, v.preTaxPerCheck), gross);
  const annualGross = gross * periods;
  const annualPreTax = preTax * periods;

  const yd = TAX_DATA[v.year];
  const brackets = yd.brackets[v.filing];
  const stdDed = yd.stdDed[v.filing];

  const annualTaxable = Math.max(0, annualGross - annualPreTax - stdDed);
  const annualFederal = calcFederalTax(annualTaxable, brackets);
  const federalPerCheck = annualFederal / periods;

  // Social Security: 6.2% up to the wage base (on gross wages).
  const ssAnnual = Math.min(annualGross, yd.ssWageBase) * FICA.ssRateEmployee;
  const socialSecurityPerCheck = ssAnnual / periods;
  // Medicare: 1.45% on all wages + 0.9% Additional Medicare above the threshold.
  const medicareAnnual =
    annualGross * FICA.medicareRateEmployee +
    Math.max(0, annualGross - FICA.additionalMedicareThreshold[v.filing]) * FICA.additionalMedicareRate;
  const medicarePerCheck = medicareAnnual / periods;

  const ficaPerCheck = socialSecurityPerCheck + medicarePerCheck;
  const netPerCheck = gross - preTax - federalPerCheck - ficaPerCheck;

  return {
    periods,
    annualGross: round2(annualGross),
    federalPerCheck: round2(federalPerCheck),
    socialSecurityPerCheck: round2(socialSecurityPerCheck),
    medicarePerCheck: round2(medicarePerCheck),
    ficaPerCheck: round2(ficaPerCheck),
    netPerCheck: round2(netPerCheck),
    annualNet: round2(netPerCheck * periods),
    takeHomeRate: gross > 0 ? round2((netPerCheck / gross) * 10000) / 10000 : 0,
    hitSsCap: annualGross >= yd.ssWageBase,
  };
}
