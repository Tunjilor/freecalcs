import { test } from "node:test";
import assert from "node:assert/strict";
import { run, pressKey, initialState, keyFromKeyboard, formatNumber, ERROR_TEXT, type CalcKey } from "./basic-calc.ts";
import { parseInput, percentOf, whatPercent, percentChange, formatResult, formatChange } from "./percent-calc.ts";

// Turn "12+3=" into calculator keys so the tests read like button presses.
const keys = (s: string): CalcKey[] =>
  [...s].map((ch) => {
    const k = ch === "C" ? "clear" : ch === "<" ? "backspace" : ch;
    return k as CalcKey;
  });
const show = (s: string) => run(keys(s)).display;

// ---- Basic calculator ------------------------------------------------------

test("0.1 + 0.2 displays 0.3", () => {
  assert.equal(show("0.1+0.2="), "0.3");
  assert.equal(show(".1+.2="), "0.3");
});

test("the four operations", () => {
  assert.equal(show("12+30="), "42");
  assert.equal(show("7-10="), "-3");
  assert.equal(show("6*7="), "42");
  assert.equal(show("1/3="), "0.333333333333");
  assert.equal(show("1.1*3="), "3.3");
});

test("operations chain left to right and show the running total", () => {
  assert.equal(show("2+3*"), "5");
  assert.equal(show("2+3*4="), "20");
  assert.equal(run(keys("2+3*")).expression, "5 ×");
});

test("pressing a second operator replaces the first", () => {
  assert.equal(show("8+-3="), "5");
  assert.equal(run(keys("8+*")).expression, "8 ×");
});

test("divide by zero shows an error until a new number or clear", () => {
  const s = run(keys("5/0="));
  assert.equal(s.display, ERROR_TEXT);
  assert.equal(s.error, true);
  assert.equal(pressKey(s, "+").display, ERROR_TEXT, "operators are ignored after an error");
  assert.equal(run(keys("4+1="), s).display, "5", "a digit starts a new calculation");
  assert.equal(pressKey(s, "clear").display, "0");
  assert.equal(show("9/0+"), ERROR_TEXT, "also when chained");
});

test("percent", () => {
  assert.equal(show("50%"), "0.5");
  assert.equal(show("200+10%"), "20");
  assert.equal(show("200+10%="), "220");
  assert.equal(show("200-10%="), "180");
  assert.equal(show("80*25%="), "20");
});

test("decimal point, leading zeros, backspace, clear", () => {
  assert.equal(show("1.2.3"), "1.23", "a second point is ignored");
  assert.equal(show("007"), "7");
  assert.equal(show("123<"), "12");
  assert.equal(show("5<"), "0");
  assert.equal(show("12+3C"), "0");
  assert.deepEqual(run(keys("12+3C")), initialState);
});

test("result can be reused: = then an operator continues from it", () => {
  assert.equal(show("2+3=*4="), "20");
  assert.equal(show("2+3=9"), "9", "a digit after = starts fresh");
});

test("entry is capped at 15 digits", () => {
  assert.equal(show("1234567890123456789"), "123456789012345");
});

test("formatNumber rounds float noise and avoids -0", () => {
  assert.equal(formatNumber(0.1 + 0.2), "0.3");
  assert.equal(formatNumber(-0), "0");
  assert.equal(formatNumber(Infinity), ERROR_TEXT);
});

test("keyboard mapping", () => {
  assert.equal(keyFromKeyboard("7"), "7");
  assert.equal(keyFromKeyboard("Enter"), "=");
  assert.equal(keyFromKeyboard("x"), "*");
  assert.equal(keyFromKeyboard(","), ".");
  assert.equal(keyFromKeyboard("Escape"), "clear");
  assert.equal(keyFromKeyboard("Backspace"), "backspace");
  assert.equal(keyFromKeyboard("a"), null);
  assert.equal(keyFromKeyboard("Tab"), null);
});

// ---- Percentage calculator -------------------------------------------------

test("25% of 80 = 20", () => {
  assert.equal(percentOf(25, 80), 20);
  assert.equal(formatResult(percentOf(25, 80)), "20");
  assert.equal(formatResult(percentOf(7.5, 1999.99)), "149.9993");
});

test("20 is what % of 80 → 25", () => {
  assert.equal(whatPercent(20, 80), 25);
  assert.equal(formatResult(whatPercent(1, 3)), "33.3333");
  assert.equal(whatPercent(5, 0), null, "of zero is undefined");
});

test("% change from 50 to 75 = +50%", () => {
  assert.equal(percentChange(50, 75), 50);
  assert.equal(formatChange(percentChange(50, 75)), "+50%");
  assert.equal(formatChange(percentChange(80, 60)), "−25%");
  assert.equal(formatChange(percentChange(40, 40)), "0%");
  assert.equal(formatChange(percentChange(-50, -25)), "+50%", "measured against |start|");
  assert.equal(percentChange(0, 10), null, "change from zero is undefined");
  assert.equal(formatChange(null), "—");
});

test("parseInput accepts what people type", () => {
  assert.equal(parseInput("1,250"), 1250);
  assert.equal(parseInput(" 25% "), 25);
  assert.equal(parseInput("+3.5"), 3.5);
  assert.equal(parseInput("-4"), -4);
  assert.equal(parseInput(""), null);
  assert.equal(parseInput("-"), null);
  assert.equal(parseInput("abc"), null);
  assert.equal(percentOf(parseInput(""), 80), null);
});
