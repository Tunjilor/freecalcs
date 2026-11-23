import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import ElectricityCostClient from "./ElectricityCostClient";
import { electricityCostDef } from "./definition";

const URL = "https://www.freecalcs.io/electricity-cost";

export const metadata: Metadata = {
  title: electricityCostDef.title,
  description: electricityCostDef.metaDescription,
  keywords: [electricityCostDef.primaryKeyword, ...electricityCostDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: electricityCostDef.title,
    description: electricityCostDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: electricityCostDef.title,
    description: electricityCostDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={electricityCostDef} />
      <ElectricityCostClient />
    </>
  );
}
