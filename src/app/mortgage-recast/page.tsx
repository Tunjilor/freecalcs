import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import MortgageRecastClient from "./MortgageRecastClient";
import { mortgageRecastDef } from "./definition";

const URL = "https://www.freecalcs.io/mortgage-recast";

export const metadata: Metadata = {
  title: mortgageRecastDef.title,
  description: mortgageRecastDef.metaDescription,
  keywords: [mortgageRecastDef.primaryKeyword, ...mortgageRecastDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: mortgageRecastDef.title,
    description: mortgageRecastDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: mortgageRecastDef.title,
    description: mortgageRecastDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={mortgageRecastDef} />
      <MortgageRecastClient />
    </>
  );
}
