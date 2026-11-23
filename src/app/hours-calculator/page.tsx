import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import HoursCalculatorClient from "./HoursCalculatorClient";
import { hoursCalculatorDef } from "./definition";

const URL = "https://www.freecalcs.io/hours-calculator";

export const metadata: Metadata = {
  title: hoursCalculatorDef.title,
  description: hoursCalculatorDef.metaDescription,
  keywords: [hoursCalculatorDef.primaryKeyword, ...hoursCalculatorDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: hoursCalculatorDef.title,
    description: hoursCalculatorDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: hoursCalculatorDef.title,
    description: hoursCalculatorDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={hoursCalculatorDef} />
      <HoursCalculatorClient />
    </>
  );
}
