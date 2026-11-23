import { test } from "node:test";
import assert from "node:assert/strict";
import { computeApy, apyFrom } from "./compute.ts";

test("APY from APR by compounding", () => {
  assert.equal(apyFrom(5, "daily").toFixed(3), "5.127");
  assert.equal(apyFrom(5, "monthly").toFixed(3), "5.116");
  assert.equal(apyFrom(5, "quarterly").toFixed(3), "5.095");
  assert.equal(apyFrom(5, "annual").toFixed(3), "5.000");
  assert.equal(apyFrom(5, "continuous").toFixed(3), "5.127");
  assert.equal(apyFrom(12, "monthly").toFixed(3), "12.683");
});

test("$10,000 at 5% compounded daily for 1 year", () => {
  const r = computeApy({ rate: 5, compounding: "daily", deposit: 10000, monthly: 0, years: 1 });
  assert.equal(r.apyLabel, "5.127%");
  assert.equal(r.endBalance, 10512.67);
  assert.equal(r.interest, 512.67);
  assert.equal(r.byCompounding.length, 6);
});

test("monthly deposits", () => {
  // $100/month at 0% for 2 years = $2,400 deposits, no interest
  const z = computeApy({ rate: 0, compounding: "monthly", deposit: 0, monthly: 100, years: 2 });
  assert.equal(z.endBalance, 2400);
  assert.equal(z.interest, 0);
  // 12% monthly = 1%/mo: 100 at end of each month for 12 months = 1268.25
  const r = computeApy({ rate: 12, compounding: "monthly", deposit: 0, monthly: 100, years: 1 });
  assert.equal(r.endBalance, 1268.25);
});

test("edge inputs", () => {
  const big = computeApy({ rate: 99999999, compounding: "daily", deposit: 99999999, monthly: 99999999, years: 99999999 });
  assert.ok(Number.isFinite(big.apy));
  const neg = computeApy({ rate: -5, compounding: "daily", deposit: -1, monthly: -1, years: -1 });
  assert.equal(neg.endBalance, 0);
  assert.equal(neg.apyLabel, "0.000%");
});
