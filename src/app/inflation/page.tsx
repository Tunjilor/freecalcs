import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import InflationClient from "./InflationClient";
import { inflationDef } from "./definition";

const URL = "https://www.freecalcs.io/inflation";

export const metadata: Metadata = {
  title: inflationDef.title,
  description: inflationDef.metaDescription,
  keywords: [inflationDef.primaryKeyword, ...inflationDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: inflationDef.title,
    description: inflationDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: inflationDef.title,
    description: inflationDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={inflationDef} />
      <InflationClient />
    </>
  );
}
