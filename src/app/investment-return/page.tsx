import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import InvestmentReturnClient from "./InvestmentReturnClient";
import { investmentReturnDef } from "./definition";

const URL = "https://www.freecalcs.io/investment-return";

export const metadata: Metadata = {
  title: investmentReturnDef.title,
  description: investmentReturnDef.metaDescription,
  keywords: [investmentReturnDef.primaryKeyword, ...investmentReturnDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: investmentReturnDef.title,
    description: investmentReturnDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: investmentReturnDef.title,
    description: investmentReturnDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={investmentReturnDef} />
      <InvestmentReturnClient />
    </>
  );
}
