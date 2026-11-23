import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import CarLeaseClient from "./CarLeaseClient";
import { carLeaseDef } from "./definition";

const URL = "https://www.freecalcs.io/car-lease";

export const metadata: Metadata = {
  title: carLeaseDef.title,
  description: carLeaseDef.metaDescription,
  keywords: [carLeaseDef.primaryKeyword, ...carLeaseDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: carLeaseDef.title,
    description: carLeaseDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: carLeaseDef.title,
    description: carLeaseDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={carLeaseDef} />
      <CarLeaseClient />
    </>
  );
}
