import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import DebtConsolidationClient from "./DebtConsolidationClient";
import { debtConsolidationDef } from "./definition";

const URL = "https://www.freecalcs.io/debt-consolidation";

export const metadata: Metadata = {
  title: debtConsolidationDef.title,
  description: debtConsolidationDef.metaDescription,
  keywords: [debtConsolidationDef.primaryKeyword, ...debtConsolidationDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: debtConsolidationDef.title,
    description: debtConsolidationDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: debtConsolidationDef.title,
    description: debtConsolidationDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={debtConsolidationDef} />
      <DebtConsolidationClient />
    </>
  );
}
