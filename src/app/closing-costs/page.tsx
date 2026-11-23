import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import ClosingCostsClient from "./ClosingCostsClient";
import { closingCostsDef } from "./definition";

const URL = "https://www.freecalcs.io/closing-costs";

export const metadata: Metadata = {
  title: closingCostsDef.title,
  description: closingCostsDef.metaDescription,
  keywords: [closingCostsDef.primaryKeyword, ...closingCostsDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: closingCostsDef.title,
    description: closingCostsDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: closingCostsDef.title,
    description: closingCostsDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={closingCostsDef} />
      <ClosingCostsClient />
    </>
  );
}
