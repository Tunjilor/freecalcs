import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import AffordabilityClient from "./AffordabilityClient";
import { affordabilityDef } from "./definition";

const URL = "https://www.freecalcs.io/home-affordability";

export const metadata: Metadata = {
  title: affordabilityDef.title,
  description: affordabilityDef.metaDescription,
  keywords: [affordabilityDef.primaryKeyword, ...affordabilityDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: affordabilityDef.title,
    description: affordabilityDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: affordabilityDef.title,
    description: affordabilityDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={affordabilityDef} />
      <AffordabilityClient />
    </>
  );
}
