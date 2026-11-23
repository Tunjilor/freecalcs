import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import BreakEvenClient from "./BreakEvenClient";
import { breakEvenDef } from "./definition";

const URL = "https://www.freecalcs.io/break-even";

export const metadata: Metadata = {
  title: breakEvenDef.title,
  description: breakEvenDef.metaDescription,
  keywords: [breakEvenDef.primaryKeyword, ...breakEvenDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: breakEvenDef.title,
    description: breakEvenDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: breakEvenDef.title,
    description: breakEvenDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={breakEvenDef} />
      <BreakEvenClient />
    </>
  );
}
