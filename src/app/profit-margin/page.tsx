import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import ProfitMarginClient from "./ProfitMarginClient";
import { profitMarginDef } from "./definition";

const URL = "https://www.freecalcs.io/profit-margin";

export const metadata: Metadata = {
  title: profitMarginDef.title,
  description: profitMarginDef.metaDescription,
  keywords: [profitMarginDef.primaryKeyword, ...profitMarginDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: profitMarginDef.title,
    description: profitMarginDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: profitMarginDef.title,
    description: profitMarginDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={profitMarginDef} />
      <ProfitMarginClient />
    </>
  );
}
