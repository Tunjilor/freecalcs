import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import RentAffordabilityClient from "./RentAffordabilityClient";
import { rentAffordabilityDef } from "./definition";

const URL = "https://www.freecalcs.io/rent-affordability";

export const metadata: Metadata = {
  title: rentAffordabilityDef.title,
  description: rentAffordabilityDef.metaDescription,
  keywords: [rentAffordabilityDef.primaryKeyword, ...rentAffordabilityDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: rentAffordabilityDef.title,
    description: rentAffordabilityDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: rentAffordabilityDef.title,
    description: rentAffordabilityDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={rentAffordabilityDef} />
      <RentAffordabilityClient />
    </>
  );
}
