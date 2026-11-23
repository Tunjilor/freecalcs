import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import SimpleInterestClient from "./SimpleInterestClient";
import { simpleInterestDef } from "./definition";

const URL = "https://www.freecalcs.io/simple-interest";

export const metadata: Metadata = {
  title: simpleInterestDef.title,
  description: simpleInterestDef.metaDescription,
  keywords: [simpleInterestDef.primaryKeyword, ...simpleInterestDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: simpleInterestDef.title,
    description: simpleInterestDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: simpleInterestDef.title,
    description: simpleInterestDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={simpleInterestDef} />
      <SimpleInterestClient />
    </>
  );
}
