// PURE compute for the Electricity Cost Calculator. See BUILD-STANDARD §2.
// kWh = watts × hours ÷ 1,000; cost = kWh × price per kWh.

import { round2 } from "../../lib/calculator/finance.ts";

export type ElectricityCostInputs = {
  watts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  centsPerKwh: number;
};

export type ElectricityCostResults = {
  kwhPerDay: number;
  kwhPerMonth: number;
  kwhPerYear: number;
  costPerHour: number;
  costPerDay: number;
  costPerMonth: number;
  costPerYear: number;
};

export function computeElectricityCost(v: ElectricityCostInputs): ElectricityCostResults {
  const kw = Math.max(0, v.watts) / 1000;
  const h = Math.min(24, Math.max(0, v.hoursPerDay));
  const d = Math.min(31, Math.max(0, v.daysPerMonth));
  const price = Math.max(0, v.centsPerKwh) / 100;
  const kwhDay = kw * h;
  const kwhMonth = kwhDay * d;
  return {
    kwhPerDay: round2(kwhDay),
    kwhPerMonth: round2(kwhMonth),
    kwhPerYear: round2(kwhMonth * 12),
    costPerHour: Math.round(kw * price * 10000) / 10000,
    costPerDay: round2(kwhDay * price),
    costPerMonth: round2(kwhMonth * price),
    costPerYear: round2(kwhMonth * 12 * price),
  };
}
