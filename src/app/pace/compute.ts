// PURE compute for the Running Pace Calculator. See BUILD-STANDARD §2.
// Pace = time ÷ distance. Race predictions use Riegel's formula:
//   T2 = T1 × (D2 ÷ D1)^1.06

import { round2 } from "../../lib/calculator/finance.ts";

export const MI_PER_KM = 0.621371;

export type PaceInputs = {
  distance: number;
  unit: "mi" | "km";
  hours: number;
  minutes: number;
  seconds: number;
};

export type PaceResults = {
  pacePerMile: string;
  pacePerKm: string;
  speedMph: number;
  speedKph: number;
  totalSeconds: number;
  valid: boolean;
  predictions: { race: string; time: string }[];
};

export function fmtTime(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "—";
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${m}:${String(r).padStart(2, "0")}`;
}

const RACES: [string, number][] = [
  ["5K", 5 * MI_PER_KM],
  ["10K", 10 * MI_PER_KM],
  ["Half marathon", 13.1094],
  ["Marathon", 26.2188],
];

export function computePace(v: PaceInputs): PaceResults {
  const d = Math.max(0, v.distance);
  const miles = v.unit === "km" ? d * MI_PER_KM : d;
  const t = Math.max(0, v.hours) * 3600 + Math.max(0, v.minutes) * 60 + Math.max(0, v.seconds);
  const valid = miles > 0 && t > 0;
  const perMile = valid ? t / miles : 0;
  return {
    pacePerMile: valid ? `${fmtTime(perMile)} /mi` : "—",
    pacePerKm: valid ? `${fmtTime(perMile * MI_PER_KM)} /km` : "—",
    speedMph: valid ? round2(miles / (t / 3600)) : 0,
    speedKph: valid ? round2(miles / MI_PER_KM / (t / 3600)) : 0,
    totalSeconds: t,
    valid,
    predictions: RACES.map(([race, m]) => ({ race, time: valid ? fmtTime(t * Math.pow(m / miles, 1.06)) : "—" })),
  };
}
