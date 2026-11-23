import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import FifteenThirtyClient from "./FifteenThirtyClient";
import { fifteenThirtyDef } from "./definition";

const URL = "https://www.freecalcs.io/15-vs-30-year-mortgage";

export const metadata: Metadata = {
  title: fifteenThirtyDef.title,
  description: fifteenThirtyDef.metaDescription,
  keywords: [fifteenThirtyDef.primaryKeyword, ...fifteenThirtyDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: fifteenThirtyDef.title,
    description: fifteenThirtyDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: fifteenThirtyDef.title,
    description: fifteenThirtyDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={fifteenThirtyDef} />
      <FifteenThirtyClient />
    </>
  );
}
