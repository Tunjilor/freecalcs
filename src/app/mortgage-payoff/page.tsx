import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import MortgagePayoffClient from "./MortgagePayoffClient";
import { mortgagePayoffDef } from "./definition";

const URL = "https://www.freecalcs.io/mortgage-payoff";

export const metadata: Metadata = {
  title: mortgagePayoffDef.title,
  description: mortgagePayoffDef.metaDescription,
  keywords: [mortgagePayoffDef.primaryKeyword, ...mortgagePayoffDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: mortgagePayoffDef.title,
    description: mortgagePayoffDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: mortgagePayoffDef.title,
    description: mortgagePayoffDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={mortgagePayoffDef} />
      <MortgagePayoffClient />
    </>
  );
}
