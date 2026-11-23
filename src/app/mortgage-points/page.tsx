import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import MortgagePointsClient from "./MortgagePointsClient";
import { mortgagePointsDef } from "./definition";

const URL = "https://www.freecalcs.io/mortgage-points";

export const metadata: Metadata = {
  title: mortgagePointsDef.title,
  description: mortgagePointsDef.metaDescription,
  keywords: [mortgagePointsDef.primaryKeyword, ...mortgagePointsDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: mortgagePointsDef.title,
    description: mortgagePointsDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: mortgagePointsDef.title,
    description: mortgagePointsDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={mortgagePointsDef} />
      <MortgagePointsClient />
    </>
  );
}
