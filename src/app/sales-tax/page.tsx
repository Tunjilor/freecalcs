import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import SalesTaxClient from "./SalesTaxClient";
import { salesTaxDef } from "./definition";

const URL = "https://www.freecalcs.io/sales-tax";

export const metadata: Metadata = {
  title: salesTaxDef.title,
  description: salesTaxDef.metaDescription,
  keywords: [salesTaxDef.primaryKeyword, ...salesTaxDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: salesTaxDef.title,
    description: salesTaxDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: salesTaxDef.title,
    description: salesTaxDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={salesTaxDef} />
      <SalesTaxClient />
    </>
  );
}
