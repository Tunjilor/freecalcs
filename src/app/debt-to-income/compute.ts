// PURE compute for the Debt-to-Income (DTI) Calculator. See BUILD-STANDARD §2.
//
// Domain reference — common mortgage DTI guidelines (front-end / back-end):
//   28/36 rule: classic conventional guideline.
//   Conventional (Fannie Mae DU): back-end up to 45%, up to 50% with strong
//     compensating factors.
//   FHA: 31% / 43% standard; automated approvals can go higher (up to ~57%).
//   VA: 41% back-end guideline, with residual income as the main test.
//   USDA: 29% / 41%.

import { round2 } from "../../lib/calculator/finance.ts";

export type DtiInputs = {
  annualIncome: number; // gross, before tax
  housingPayment: number; // monthly PITI + HOA (current rent if not buying)
  carPayments: number;
  studentLoans: number;
  creditCardMinimums: number;
  otherDebts: number; // personal loans, child support, etc.
};

export type ProgramCheck = {
  program: string;
  frontLimit: number | null; // % or null when no front-end test
  backLimit: number;
  passes: boolean;
};

export type DtiResults = {
  grossMonthly: number;
  otherDebtTotal: number; // non-housing debts
  totalDebt: number;
  frontEnd: number; // % housing / income
  backEnd: number; // % total / income
  band: "excellent" | "good" | "stretch" | "high" | "na";
  bandLabel: string;
  // 28/36 rule guide.
  maxHousingAt28: number;
  maxHousingAt36: number; // 36% of income minus other debts
  maxHousingRule: number; // the lower of the two
  // Debt reduction to reach common targets.
  debtCutTo36: number;
  debtCutTo43: number;
  programs: ProgramCheck[];
  programsPassing: number;
};

const PROGRAMS: { program: string; front: number | null; back: number }[] = [
  { program: "Conventional (28/36 rule)", front: 28, back: 36 },
  { program: "Conventional (DU, max)", front: null, back: 45 },
  { program: "FHA (standard)", front: 31, back: 43 },
  { program: "VA (guideline)", front: null, back: 41 },
  { program: "USDA", front: 29, back: 41 },
];

export function computeDti(v: DtiInputs): DtiResults {
  const grossMonthly = Math.max(0, v.annualIncome) / 12;
  const housing = Math.max(0, v.housingPayment);
  const other =
    Math.max(0, v.carPayments) +
    Math.max(0, v.studentLoans) +
    Math.max(0, v.creditCardMinimums) +
    Math.max(0, v.otherDebts);
  const total = housing + other;

  const has = grossMonthly > 0;
  const frontEnd = has ? (housing / grossMonthly) * 100 : 0;
  const backEnd = has ? (total / grossMonthly) * 100 : 0;

  let band: DtiResults["band"] = "na";
  let bandLabel = "Enter your income";
  if (has) {
    if (backEnd <= 36) {
      band = "excellent";
      bandLabel = "Strong — within the 36% guideline";
    } else if (backEnd <= 43) {
      band = "good";
      bandLabel = "Acceptable for most lenders";
    } else if (backEnd <= 50) {
      band = "stretch";
      bandLabel = "Stretch — needs strong credit or reserves";
    } else {
      band = "high";
      bandLabel = "High — most lenders will decline";
    }
  }

  const maxHousingAt28 = grossMonthly * 0.28;
  const maxHousingAt36 = Math.max(0, grossMonthly * 0.36 - other);
  const debtCutTo36 = Math.max(0, total - grossMonthly * 0.36);
  const debtCutTo43 = Math.max(0, total - grossMonthly * 0.43);

  const programs = PROGRAMS.map((p) => ({
    program: p.program,
    frontLimit: p.front,
    backLimit: p.back,
    passes: has && backEnd <= p.back + 1e-9 && (p.front === null || frontEnd <= p.front + 1e-9),
  }));

  return {
    grossMonthly: round2(grossMonthly),
    otherDebtTotal: round2(other),
    totalDebt: round2(total),
    frontEnd: round2(frontEnd),
    backEnd: round2(backEnd),
    band,
    bandLabel,
    maxHousingAt28: round2(maxHousingAt28),
    maxHousingAt36: round2(maxHousingAt36),
    maxHousingRule: round2(Math.min(maxHousingAt28, maxHousingAt36)),
    debtCutTo36: round2(debtCutTo36),
    debtCutTo43: round2(debtCutTo43),
    programs,
    programsPassing: programs.filter((p) => p.passes).length,
  };
}
