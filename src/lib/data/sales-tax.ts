// State sales tax rates, as of July 1, 2026 (Tax Foundation, "State and Local
// Sales Tax Rates, Midyear 2026"). `state` is the statewide base rate; `avgLocal`
// is the population-weighted average local rate; `combined` = state + avgLocal.
// Rates the table rounds to two decimals are stored at their statutory value
// (e.g. Missouri 4.225%, New Jersey 6.625%). Local rates vary by city/county,
// so the combined figure is an average, not the rate at any one address.
// Update twice a year when the Tax Foundation publishes January and July tables.

export const SALES_TAX_SOURCE_URL = "https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/";
export const SALES_TAX_AS_OF = "July 1, 2026";

export type StateSalesTax = { code: string; name: string; state: number; avgLocal: number; combined: number };

export const SALES_TAX: StateSalesTax[] = [
  { code: "AL", name: "Alabama", state: 4, avgLocal: 5.46, combined: 9.46 },
  { code: "AK", name: "Alaska", state: 0, avgLocal: 1.82, combined: 1.82 },
  { code: "AZ", name: "Arizona", state: 5.6, avgLocal: 2.94, combined: 8.54 },
  { code: "AR", name: "Arkansas", state: 6.5, avgLocal: 2.98, combined: 9.48 },
  { code: "CA", name: "California", state: 7.25, avgLocal: 1.78, combined: 9.03 },
  { code: "CO", name: "Colorado", state: 2.9, avgLocal: 4.99, combined: 7.89 },
  { code: "CT", name: "Connecticut", state: 6.35, avgLocal: 0, combined: 6.35 },
  { code: "DE", name: "Delaware", state: 0, avgLocal: 0, combined: 0 },
  { code: "DC", name: "District of Columbia", state: 6, avgLocal: 0, combined: 6 },
  { code: "FL", name: "Florida", state: 6, avgLocal: 0.98, combined: 6.98 },
  { code: "GA", name: "Georgia", state: 4, avgLocal: 3.56, combined: 7.56 },
  { code: "HI", name: "Hawaii", state: 4, avgLocal: 0.5, combined: 4.5 },
  { code: "ID", name: "Idaho", state: 6, avgLocal: 0.03, combined: 6.03 },
  { code: "IL", name: "Illinois", state: 6.25, avgLocal: 2.73, combined: 8.98 },
  { code: "IN", name: "Indiana", state: 7, avgLocal: 0, combined: 7 },
  { code: "IA", name: "Iowa", state: 6, avgLocal: 0.94, combined: 6.94 },
  { code: "KS", name: "Kansas", state: 6.5, avgLocal: 2.21, combined: 8.71 },
  { code: "KY", name: "Kentucky", state: 6, avgLocal: 0, combined: 6 },
  { code: "LA", name: "Louisiana", state: 5, avgLocal: 5.13, combined: 10.13 },
  { code: "ME", name: "Maine", state: 5.5, avgLocal: 0, combined: 5.5 },
  { code: "MD", name: "Maryland", state: 6, avgLocal: 0, combined: 6 },
  { code: "MA", name: "Massachusetts", state: 6.25, avgLocal: 0, combined: 6.25 },
  { code: "MI", name: "Michigan", state: 6, avgLocal: 0, combined: 6 },
  { code: "MN", name: "Minnesota", state: 6.875, avgLocal: 1.26, combined: 8.14 },
  { code: "MS", name: "Mississippi", state: 7, avgLocal: 0.06, combined: 7.06 },
  { code: "MO", name: "Missouri", state: 4.225, avgLocal: 4.22, combined: 8.44 },
  { code: "MT", name: "Montana", state: 0, avgLocal: 0, combined: 0 },
  { code: "NE", name: "Nebraska", state: 5.5, avgLocal: 1.48, combined: 6.98 },
  { code: "NV", name: "Nevada", state: 6.85, avgLocal: 1.39, combined: 8.24 },
  { code: "NH", name: "New Hampshire", state: 0, avgLocal: 0, combined: 0 },
  { code: "NJ", name: "New Jersey", state: 6.625, avgLocal: -0.02, combined: 6.6 },
  { code: "NM", name: "New Mexico", state: 4.875, avgLocal: 2.8, combined: 7.68 },
  { code: "NY", name: "New York", state: 4, avgLocal: 4.54, combined: 8.54 },
  { code: "NC", name: "North Carolina", state: 4.75, avgLocal: 2.35, combined: 7.1 },
  { code: "ND", name: "North Dakota", state: 5, avgLocal: 2.09, combined: 7.09 },
  { code: "OH", name: "Ohio", state: 5.75, avgLocal: 1.54, combined: 7.29 },
  { code: "OK", name: "Oklahoma", state: 4.5, avgLocal: 4.56, combined: 9.06 },
  { code: "OR", name: "Oregon", state: 0, avgLocal: 0, combined: 0 },
  { code: "PA", name: "Pennsylvania", state: 6, avgLocal: 0.34, combined: 6.34 },
  { code: "RI", name: "Rhode Island", state: 7, avgLocal: 0, combined: 7 },
  { code: "SC", name: "South Carolina", state: 6, avgLocal: 1.49, combined: 7.49 },
  { code: "SD", name: "South Dakota", state: 4.2, avgLocal: 1.91, combined: 6.11 },
  { code: "TN", name: "Tennessee", state: 7, avgLocal: 2.61, combined: 9.61 },
  { code: "TX", name: "Texas", state: 6.25, avgLocal: 1.95, combined: 8.2 },
  { code: "UT", name: "Utah", state: 6.1, avgLocal: 1.32, combined: 7.42 },
  { code: "VT", name: "Vermont", state: 6, avgLocal: 0.43, combined: 6.43 },
  { code: "VA", name: "Virginia", state: 5.3, avgLocal: 0.47, combined: 5.77 },
  { code: "WA", name: "Washington", state: 6.5, avgLocal: 3.07, combined: 9.57 },
  { code: "WV", name: "West Virginia", state: 6, avgLocal: 0.6, combined: 6.6 },
  { code: "WI", name: "Wisconsin", state: 5, avgLocal: 0.72, combined: 5.72 },
  { code: "WY", name: "Wyoming", state: 4, avgLocal: 1.39, combined: 5.39 },
];

export const SALES_TAX_BY_CODE: Record<string, StateSalesTax> = Object.fromEntries(
  SALES_TAX.map((s) => [s.code, s]),
);
