import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDaysFromToday } from "./compute.ts";
import { addBusinessDays, parseISODate, toISODate } from "../dates.ts";

test("30 and 90 days from Nov 23, 2026", () => {
  const r = computeDaysFromToday({ fromDate: "2026-11-23", days: 30, direction: "from" });
  assert.equal(r.dateISO, "2026-12-23");
  assert.equal(r.weekday, "Wednesday");
  assert.equal(r.weeksLabel, "4 weeks, 2 days");
  const r90 = computeDaysFromToday({ fromDate: "2026-11-23", days: 90, direction: "from" });
  assert.equal(r90.dateISO, "2027-02-21");
  assert.equal(r90.isWeekend, true); // Sunday
});

test("days before, crossing a leap day", () => {
  const r = computeDaysFromToday({ fromDate: "2028-03-01", days: 1, direction: "before" });
  assert.equal(r.dateISO, "2028-02-29");
  const r180 = computeDaysFromToday({ fromDate: "2026-11-23", days: 180, direction: "before" });
  assert.equal(r180.dateISO, "2026-05-27");
});

test("business days skip weekends", () => {
  // Fri Nov 27, 2026 + 1 business day = Mon Nov 30
  assert.equal(toISODate(addBusinessDays(parseISODate("2026-11-27")!, 1)), "2026-11-30");
  // Mon + 5 business days = next Mon
  assert.equal(toISODate(addBusinessDays(parseISODate("2026-11-23")!, 5)), "2026-11-30");
  assert.equal(toISODate(addBusinessDays(parseISODate("2026-11-30")!, -1)), "2026-11-27");
  const r = computeDaysFromToday({ fromDate: "2026-11-23", days: 30, direction: "from" });
  assert.equal(r.businessDateLabel, "Mon, Jan 4, 2027");
});

test("edge inputs: blank date, negative, huge", () => {
  assert.equal(computeDaysFromToday({ fromDate: "", days: 30, direction: "from" }).valid, false);
  assert.equal(computeDaysFromToday({ fromDate: "2026-11-23", days: -5, direction: "from" }).days, 0);
  const big = computeDaysFromToday({ fromDate: "2026-11-23", days: 99999999, direction: "from" });
  assert.equal(big.days, 36500);
  assert.equal(big.businessDateLabel, "—");
  assert.equal(big.rows.length, 10);
});
