import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import TaxClient from "./TaxClient";
import { incomeTaxDef } from "./definition";

// Upgraded in place onto the CalculatorDefinition standard. Same /tax URL.
// Keeps filing status, the 2025/2026 year toggle, all income lines, itemized
// toggle, pre-tax deductions, and the Child Tax Credit; adds the shared insight
// engine, a bracket-by-bracket breakdown table + chart, and JSON-LD. Self-
// employment tax, capital gains, and the refund estimate moved to their own
// pages (cross-linked from the definition).

const URL = "https://www.freecalcs.io/tax";

export const metadata: Metadata = {
  title: incomeTaxDef.title,
  description: incomeTaxDef.metaDescription,
  keywords: [incomeTaxDef.primaryKeyword, ...incomeTaxDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: incomeTaxDef.title,
    description: incomeTaxDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: incomeTaxDef.title,
    description: incomeTaxDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={incomeTaxDef} />
      <TaxClient />
    </>
  );
}
