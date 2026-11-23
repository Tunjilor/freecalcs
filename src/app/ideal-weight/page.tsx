import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import IdealWeightClient from "./IdealWeightClient";
import { idealWeightDef } from "./definition";

const URL = "https://www.freecalcs.io/ideal-weight";

export const metadata: Metadata = {
  title: idealWeightDef.title,
  description: idealWeightDef.metaDescription,
  keywords: [idealWeightDef.primaryKeyword, ...idealWeightDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: idealWeightDef.title,
    description: idealWeightDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: idealWeightDef.title,
    description: idealWeightDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={idealWeightDef} />
      <IdealWeightClient />
    </>
  );
}
