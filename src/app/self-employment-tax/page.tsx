import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import SelfEmploymentClient from "./SelfEmploymentClient";
import { selfEmploymentDef } from "./definition";

const URL = "https://www.freecalcs.io/self-employment-tax";

export const metadata: Metadata = {
  title: selfEmploymentDef.title,
  description: selfEmploymentDef.metaDescription,
  keywords: [selfEmploymentDef.primaryKeyword, ...selfEmploymentDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: selfEmploymentDef.title,
    description: selfEmploymentDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: selfEmploymentDef.title,
    description: selfEmploymentDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={selfEmploymentDef} />
      <SelfEmploymentClient />
    </>
  );
}
