import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import TimeCardCalculatorClient from "./TimeCardCalculatorClient";
import { timeCardCalculatorDef } from "./definition";

const URL = "https://www.freecalcs.io/time-card-calculator";

export const metadata: Metadata = {
  title: timeCardCalculatorDef.title,
  description: timeCardCalculatorDef.metaDescription,
  keywords: [timeCardCalculatorDef.primaryKeyword, ...timeCardCalculatorDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: timeCardCalculatorDef.title,
    description: timeCardCalculatorDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: timeCardCalculatorDef.title,
    description: timeCardCalculatorDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={timeCardCalculatorDef} />
      <TimeCardCalculatorClient />
    </>
  );
}
