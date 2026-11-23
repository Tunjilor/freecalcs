import { test } from "node:test";
import assert from "node:assert/strict";
import { article, teachSubject } from "./teach.ts";

const heading = (h1: string) => {
  const s = teachSubject(h1);
  return `What is ${article(s)} ${s}?`;
};

test("subject strips 'Calculator' and anything after it", () => {
  assert.equal(teachSubject("Budget Calculator (50/30/20 Rule)"), "Budget");
  assert.equal(teachSubject("Investment Return Calculator (CAGR)"), "Investment Return");
  assert.equal(teachSubject("Tax Refund Estimator"), "Tax Refund Estimator");
});

test("a / an", () => {
  assert.equal(heading("Amortization Calculator"), "What is an Amortization?");
  assert.equal(heading("Auto Loan Calculator"), "What is an Auto Loan?");
  assert.equal(heading("Emergency Fund Calculator"), "What is an Emergency Fund?");
  assert.equal(heading("FHA Loan Calculator"), "What is an FHA Loan?");
  assert.equal(heading("USDA Loan Calculator"), "What is a USDA Loan?");
  assert.equal(heading("HELOC Calculator"), "What is a HELOC?");
  assert.equal(heading("VA Loan Calculator"), "What is a VA Loan?");
  assert.equal(heading("401(k) Calculator"), "What is a 401(k)?");
  assert.equal(heading("Mortgage Payoff Calculator"), "What is a Mortgage Payoff?");
});

// Every calculator sets teach.heading (BUILD-STANDARD §1.10), so no page falls
// back to the generic "What is a/an …?" wording.
test("every calculator definition sets teach.heading", async () => {
  const { readdirSync, readFileSync, existsSync } = await import("node:fs");
  const { join } = await import("node:path");
  const app = join(import.meta.dirname, "../../app");
  const missing: string[] = [];
  for (const dir of readdirSync(app)) {
    const f = join(app, dir, "definition.ts");
    if (!existsSync(f)) continue;
    let src = readFileSync(f, "utf8");
    // Pages built by a shared factory (e.g. the "N days from today" pages)
    // carry their teach block in the factory module.
    const factory = /from "@\/lib\/calculator\/([\w/-]+\/definition)"/.exec(src);
    if (factory) src = readFileSync(join(import.meta.dirname, `${factory[1]}.ts`), "utf8");
    const m = /teach:\s*\{\s*heading:\s*["`]([^"`]+)["`]/.exec(src);
    if (!m || !m[1].endsWith("?") || m[1].length > 60) missing.push(dir);
  }
  assert.deepEqual(missing, []);
});
