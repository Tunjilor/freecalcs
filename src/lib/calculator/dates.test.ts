import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseISODate, toISODate, addDays, daysBetween, weekdaysBetween, monthsAndDays, resolveDateToken, formatDate,
} from "./dates.ts";

const d = (s: string) => parseISODate(s)!;

test("parse and format", () => {
  assert.equal(toISODate(d("2026-02-28")), "2026-02-28");
  assert.equal(parseISODate("2026-02-30"), null);
  assert.equal(parseISODate("nope"), null);
  assert.equal(formatDate(d("2026-11-23")), "Mon, Nov 23, 2026");
});

test("day arithmetic across DST and leap years", () => {
  assert.equal(daysBetween(d("2026-03-01"), d("2026-03-15")), 14); // spans US DST start
  assert.equal(daysBetween(d("2028-02-28"), d("2028-03-01")), 2); // leap year
  assert.equal(toISODate(addDays(d("2026-12-31"), 1)), "2027-01-01");
  assert.equal(daysBetween(d("2026-01-10"), d("2026-01-01")), -9);
});

test("weekdays between", () => {
  assert.equal(weekdaysBetween(d("2026-11-23"), d("2026-11-30")), 5); // Mon → next Mon
  assert.equal(weekdaysBetween(d("2026-11-28"), d("2026-11-30")), 0); // Sat → Mon
  assert.equal(weekdaysBetween(d("2026-11-30"), d("2026-11-23")), -5);
});

test("months and days", () => {
  assert.deepEqual(monthsAndDays(d("2026-01-31"), d("2026-03-01")), { years: 0, months: 1, days: 1 });
  assert.deepEqual(monthsAndDays(d("2000-05-15"), d("2026-11-23")), { years: 26, months: 6, days: 8 });
});

test("tokens", () => {
  assert.equal(resolveDateToken("today", "2026-11-23"), "2026-11-23");
  assert.equal(resolveDateToken("today+30", "2026-11-23"), "2026-12-23");
  assert.equal(resolveDateToken("today-56", "2026-11-23"), "2026-09-28");
  assert.equal(resolveDateToken("next:12-25", "2026-11-23"), "2026-12-25");
  assert.equal(resolveDateToken("next:01-01", "2026-11-23"), "2027-01-01");
  assert.equal(resolveDateToken("next:11-23", "2026-11-23"), "2026-11-23");
  // After the date has passed this year, it rolls to next year.
  assert.equal(resolveDateToken("next:12-25", "2026-12-26"), "2027-12-25");
  assert.equal(resolveDateToken("next:01-01", "2027-01-01"), "2027-01-01");
  assert.equal(resolveDateToken("next:01-01", "2027-01-02"), "2028-01-01");
  assert.equal(resolveDateToken("2025-07-04", "2026-11-23"), "2025-07-04");
});
