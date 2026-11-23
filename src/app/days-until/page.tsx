import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import DaysUntilClient from "./DaysUntilClient";
import { daysUntilDef } from "./definition";

const URL = "https://www.freecalcs.io/days-until";

export const metadata: Metadata = {
  title: daysUntilDef.title,
  description: daysUntilDef.metaDescription,
  keywords: [daysUntilDef.primaryKeyword, ...daysUntilDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: daysUntilDef.title,
    description: daysUntilDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: daysUntilDef.title,
    description: daysUntilDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={daysUntilDef} />
      <DaysUntilClient />
    </>
  );
}
