import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import FhaLoanClient from "./FhaLoanClient";
import { fhaLoanDef } from "./definition";

const URL = "https://www.freecalcs.io/fha-loan";

export const metadata: Metadata = {
  title: fhaLoanDef.title,
  description: fhaLoanDef.metaDescription,
  keywords: [fhaLoanDef.primaryKeyword, ...fhaLoanDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: fhaLoanDef.title,
    description: fhaLoanDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: fhaLoanDef.title,
    description: fhaLoanDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={fhaLoanDef} />
      <FhaLoanClient />
    </>
  );
}
