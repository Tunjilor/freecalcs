import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import MacroClient from "./MacroClient";
import { macroDef } from "./definition";

const URL = "https://www.freecalcs.io/macro";

export const metadata: Metadata = {
  title: macroDef.title,
  description: macroDef.metaDescription,
  keywords: [macroDef.primaryKeyword, ...macroDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: macroDef.title,
    description: macroDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: macroDef.title,
    description: macroDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={macroDef} />
      <MacroClient />
    </>
  );
}
