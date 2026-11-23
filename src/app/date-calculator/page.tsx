import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import DateCalculatorClient from "./DateCalculatorClient";
import { dateCalculatorDef } from "./definition";

const URL = "https://www.freecalcs.io/date-calculator";

export const metadata: Metadata = {
  title: dateCalculatorDef.title,
  description: dateCalculatorDef.metaDescription,
  keywords: [dateCalculatorDef.primaryKeyword, ...dateCalculatorDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: dateCalculatorDef.title,
    description: dateCalculatorDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: dateCalculatorDef.title,
    description: dateCalculatorDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={dateCalculatorDef} />
      <DateCalculatorClient />
    </>
  );
}
