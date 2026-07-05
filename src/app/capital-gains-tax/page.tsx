import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import CapitalGainsClient from "./CapitalGainsClient";
import { capitalGainsDef } from "./definition";

const URL = "https://www.freecalcs.io/capital-gains-tax";

export const metadata: Metadata = {
  title: capitalGainsDef.title,
  description: capitalGainsDef.metaDescription,
  keywords: [capitalGainsDef.primaryKeyword, ...capitalGainsDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: capitalGainsDef.title,
    description: capitalGainsDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: capitalGainsDef.title,
    description: capitalGainsDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={capitalGainsDef} />
      <CapitalGainsClient />
    </>
  );
}
