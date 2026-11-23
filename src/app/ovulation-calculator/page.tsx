import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import OvulationCalculatorClient from "./OvulationCalculatorClient";
import { ovulationCalculatorDef } from "./definition";

const URL = "https://www.freecalcs.io/ovulation-calculator";

export const metadata: Metadata = {
  title: ovulationCalculatorDef.title,
  description: ovulationCalculatorDef.metaDescription,
  keywords: [ovulationCalculatorDef.primaryKeyword, ...ovulationCalculatorDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: ovulationCalculatorDef.title,
    description: ovulationCalculatorDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ovulationCalculatorDef.title,
    description: ovulationCalculatorDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={ovulationCalculatorDef} />
      <OvulationCalculatorClient />
    </>
  );
}
