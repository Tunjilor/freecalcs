import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import ApyCalculatorClient from "./ApyCalculatorClient";
import { apyCalculatorDef } from "./definition";

const URL = "https://www.freecalcs.io/apy-calculator";

export const metadata: Metadata = {
  title: apyCalculatorDef.title,
  description: apyCalculatorDef.metaDescription,
  keywords: [apyCalculatorDef.primaryKeyword, ...apyCalculatorDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: apyCalculatorDef.title,
    description: apyCalculatorDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: apyCalculatorDef.title,
    description: apyCalculatorDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={apyCalculatorDef} />
      <ApyCalculatorClient />
    </>
  );
}
