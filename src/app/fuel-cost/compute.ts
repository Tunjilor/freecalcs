// PURE compute for the Fuel Cost (Trip Gas) Calculator. See BUILD-STANDARD §2.

import { round2 } from "../../lib/calculator/finance.ts";

export type FuelCostInputs = {
  distance: number; // miles, one way
  roundTrip: "yes" | "no";
  mpg: number;
  pricePerGallon: number;
  people: number;
  tripsPerMonth: number; // for a monthly figure (0 to skip)
};

export type FuelCostResults = {
  totalMiles: number;
  gallons: number;
  tripCost: number;
  costPerPerson: number;
  costPerMile: number;
  monthlyCost: number;
  yearlyCost: number;
  costAt10mpgBetter: number; // same trip with mpg + 10
};

export function computeFuelCost(v: FuelCostInputs): FuelCostResults {
  const miles = Math.max(0, v.distance) * (v.roundTrip === "yes" ? 2 : 1);
  const mpg = Math.max(0, v.mpg);
  const price = Math.max(0, v.pricePerGallon);
  const gal = mpg > 0 ? miles / mpg : 0;
  const cost = gal * price;
  const people = Math.max(1, Math.round(v.people));
  const monthly = cost * Math.max(0, v.tripsPerMonth);
  return {
    totalMiles: round2(miles),
    gallons: round2(gal),
    tripCost: round2(cost),
    costPerPerson: round2(cost / people),
    costPerMile: mpg > 0 ? round2(price / mpg) : 0,
    monthlyCost: round2(monthly),
    yearlyCost: round2(monthly * 12),
    costAt10mpgBetter: round2((miles / (mpg + 10)) * price),
  };
}
