import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import DebtPayoffClient from "./DebtPayoffClient";
import { debtPayoffDef } from "./definition";

const URL = "https://www.freecalcs.io/debt-payoff";

export const metadata: Metadata = {
  title: debtPayoffDef.title,
  description: debtPayoffDef.metaDescription,
  keywords: [debtPayoffDef.primaryKeyword, ...debtPayoffDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: debtPayoffDef.title,
    description: debtPayoffDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: debtPayoffDef.title,
    description: debtPayoffDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={debtPayoffDef} />
      <DebtPayoffClient />
    </>
  );
}
