import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import TermLifeClient from "./TermLifeClient";
import { termLifeDef } from "./definition";

const URL = "https://www.freecalcs.io/term-life";

export const metadata: Metadata = {
  title: termLifeDef.title,
  description: termLifeDef.metaDescription,
  keywords: [termLifeDef.primaryKeyword, ...termLifeDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: termLifeDef.title,
    description: termLifeDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: termLifeDef.title,
    description: termLifeDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={termLifeDef} />
      <TermLifeClient />
    </>
  );
}
