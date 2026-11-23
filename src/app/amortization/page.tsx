import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import AmortizationClient from "./AmortizationClient";
import { amortizationDef } from "./definition";

const URL = "https://www.freecalcs.io/amortization";

export const metadata: Metadata = {
  title: amortizationDef.title,
  description: amortizationDef.metaDescription,
  keywords: [amortizationDef.primaryKeyword, ...amortizationDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: amortizationDef.title,
    description: amortizationDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: amortizationDef.title,
    description: amortizationDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={amortizationDef} />
      <AmortizationClient />
    </>
  );
}
