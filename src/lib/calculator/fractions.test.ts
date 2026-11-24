import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFraction, add, sub, mul, div, fracLabel, mixedLabel } from "./fractions.ts";

test("parse", () => {
  assert.deepEqual(parseFraction("3/4"), { n: 3, d: 4 });
  assert.deepEqual(parseFraction("6/8"), { n: 3, d: 4 });
  assert.deepEqual(parseFraction("1 1/2"), { n: 3, d: 2 });
  assert.deepEqual(parseFraction("-1-1/2"), { n: -3, d: 2 });
  assert.deepEqual(parseFraction("−2"), { n: -2, d: 1 });
  assert.deepEqual(parseFraction("0.375"), { n: 3, d: 8 });
  assert.deepEqual(parseFraction(".5"), { n: 1, d: 2 });
  assert.deepEqual(parseFraction("3/-4"), { n: -3, d: 4 });
  for (const bad of ["", "abc", "1/0", "1//2", "1 2", "1.2.3", "/", "-"]) assert.equal(parseFraction(bad), null, bad);
});

test("arithmetic and labels", () => {
  const a = parseFraction("1/2")!, b = parseFraction("1/3")!;
  assert.equal(fracLabel(add(a, b)), "5/6");
  assert.equal(fracLabel(sub(a, b)), "1/6");
  assert.equal(fracLabel(mul(a, b)), "1/6");
  assert.equal(fracLabel(div(a, b)), "3/2");
  assert.equal(mixedLabel(div(a, b)), "1 1/2");
  assert.equal(div(a, parseFraction("0")!), null);
  assert.equal(mixedLabel(parseFraction("-7/3")), "-2 1/3");
  assert.equal(parseFraction("99999999999999999999/3"), null);
});
