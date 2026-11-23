import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import CarAffordabilityClient from "./CarAffordabilityClient";
import { carAffordabilityDef } from "./definition";

const URL = "https://www.freecalcs.io/car-affordability";

export const metadata: Metadata = {
  title: carAffordabilityDef.title,
  description: carAffordabilityDef.metaDescription,
  keywords: [carAffordabilityDef.primaryKeyword, ...carAffordabilityDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: carAffordabilityDef.title,
    description: carAffordabilityDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: carAffordabilityDef.title,
    description: carAffordabilityDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={carAffordabilityDef} />
      <CarAffordabilityClient />
    </>
  );
}
