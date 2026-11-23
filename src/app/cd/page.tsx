import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import CdClient from "./CdClient";
import { cdDef } from "./definition";

const URL = "https://www.freecalcs.io/cd";

export const metadata: Metadata = {
  title: cdDef.title,
  description: cdDef.metaDescription,
  keywords: [cdDef.primaryKeyword, ...cdDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: cdDef.title,
    description: cdDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: cdDef.title,
    description: cdDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={cdDef} />
      <CdClient />
    </>
  );
}
