import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import TimeCalculatorClient from "./TimeCalculatorClient";
import { timeCalculatorDef } from "./definition";

const URL = "https://www.freecalcs.io/time-calculator";

export const metadata: Metadata = {
  title: timeCalculatorDef.title,
  description: timeCalculatorDef.metaDescription,
  keywords: [timeCalculatorDef.primaryKeyword, ...timeCalculatorDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: timeCalculatorDef.title,
    description: timeCalculatorDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: timeCalculatorDef.title,
    description: timeCalculatorDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={timeCalculatorDef} />
      <TimeCalculatorClient />
    </>
  );
}
