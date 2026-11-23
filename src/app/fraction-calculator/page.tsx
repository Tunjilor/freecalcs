import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import FractionCalculatorClient from "./FractionCalculatorClient";
import { fractionCalculatorDef } from "./definition";

const URL = "https://www.freecalcs.io/fraction-calculator";

export const metadata: Metadata = {
  title: fractionCalculatorDef.title,
  description: fractionCalculatorDef.metaDescription,
  keywords: [fractionCalculatorDef.primaryKeyword, ...fractionCalculatorDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: fractionCalculatorDef.title,
    description: fractionCalculatorDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: fractionCalculatorDef.title,
    description: fractionCalculatorDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={fractionCalculatorDef} />
      <FractionCalculatorClient />
    </>
  );
}
