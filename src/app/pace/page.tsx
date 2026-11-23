import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import PaceClient from "./PaceClient";
import { paceDef } from "./definition";

const URL = "https://www.freecalcs.io/pace";

export const metadata: Metadata = {
  title: paceDef.title,
  description: paceDef.metaDescription,
  keywords: [paceDef.primaryKeyword, ...paceDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: paceDef.title,
    description: paceDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: paceDef.title,
    description: paceDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={paceDef} />
      <PaceClient />
    </>
  );
}
