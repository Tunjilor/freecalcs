import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import DecimalToFractionClient from "./DecimalToFractionClient";
import { decimalToFractionDef } from "./definition";

const URL = "https://www.freecalcs.io/decimal-to-fraction";

export const metadata: Metadata = {
  title: decimalToFractionDef.title,
  description: decimalToFractionDef.metaDescription,
  keywords: [decimalToFractionDef.primaryKeyword, ...decimalToFractionDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: decimalToFractionDef.title,
    description: decimalToFractionDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: decimalToFractionDef.title,
    description: decimalToFractionDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={decimalToFractionDef} />
      <DecimalToFractionClient />
    </>
  );
}
