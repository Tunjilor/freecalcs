import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import UsdaLoanClient from "./UsdaLoanClient";
import { usdaLoanDef } from "./definition";

const URL = "https://www.freecalcs.io/usda-loan";

export const metadata: Metadata = {
  title: usdaLoanDef.title,
  description: usdaLoanDef.metaDescription,
  keywords: [usdaLoanDef.primaryKeyword, ...usdaLoanDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: usdaLoanDef.title,
    description: usdaLoanDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: usdaLoanDef.title,
    description: usdaLoanDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={usdaLoanDef} />
      <UsdaLoanClient />
    </>
  );
}
