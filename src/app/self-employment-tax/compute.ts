// PURE compute for the Self-Employment Tax Calculator. All rates/thresholds come
// from src/lib/calculator/tax-data.ts — no tax number is hardcoded here.
//
// SE tax = Social Security (12.4% up to the wage base) + Medicare (2.9%) on
// 92.35% of net self-employment earnings, plus Additional Medicare (0.9%) on
// earnings above the filing-status threshold. Half of the regular SE tax (the
// 15.3% portion, excluding Additional Medicare) is deductible against income tax.

import { FICA, TAX_DATA, type FilingStatus, type TaxYear } from "../../lib/calculator/tax-data.ts";

export type SelfEmploymentInputs = {
  year: TaxYear;
  filing: FilingStatus;
  netIncome: number; // net self-employment profit
};

export type SelfEmploymentResults = {
  netEarnings: number; // net income × 0.9235
  ssWageBase: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  seTax: number;
  deductibleHalf: number; // 50% of the SS+Medicare portion
  effectiveRate: number; // seTax / netIncome (0–1)
  hitSsCap: boolean;
  quarterlyEstimate: number; // seTax / 4 (SE portion of estimated taxes)
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeSelfEmployment(v: SelfEmploymentInputs): SelfEmploymentResults {
  const net = Math.max(0, v.netIncome);
  const netEarnings = net * FICA.seNetFactor;
  const wageBase = TAX_DATA[v.year].ssWageBase;

  const ssBase = Math.min(netEarnings, wageBase);
  const socialSecurity = ssBase * FICA.ssRateSelfEmployed;
  const medicare = netEarnings * FICA.medicareRateSelfEmployed;

  const threshold = FICA.additionalMedicareThreshold[v.filing];
  const additionalMedicare = Math.max(0, netEarnings - threshold) * FICA.additionalMedicareRate;

  const seTax = socialSecurity + medicare + additionalMedicare;
  const deductibleHalf = (socialSecurity + medicare) / 2;

  return {
    netEarnings: round2(netEarnings),
    ssWageBase: wageBase,
    socialSecurity: round2(socialSecurity),
    medicare: round2(medicare),
    additionalMedicare: round2(additionalMedicare),
    seTax: round2(seTax),
    deductibleHalf: round2(deductibleHalf),
    effectiveRate: net > 0 ? round2((seTax / net) * 10000) / 10000 : 0,
    hitSsCap: netEarnings >= wageBase,
    quarterlyEstimate: round2(seTax / 4),
  };
}
