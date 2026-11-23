import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import FutureValueClient from "./FutureValueClient";
import { futureValueDef } from "./definition";

const URL = "https://www.freecalcs.io/future-value";

export const metadata: Metadata = {
  title: futureValueDef.title,
  description: futureValueDef.metaDescription,
  keywords: [futureValueDef.primaryKeyword, ...futureValueDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: futureValueDef.title,
    description: futureValueDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: futureValueDef.title,
    description: futureValueDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={futureValueDef} />
      <FutureValueClient />
    </>
  );
}
