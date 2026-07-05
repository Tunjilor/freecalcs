import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import RetirementClient from "./RetirementClient";
import { retirementDef } from "./definition";

const URL = "https://www.freecalcs.io/retirement";

export const metadata: Metadata = {
  title: retirementDef.title,
  description: retirementDef.metaDescription,
  keywords: [retirementDef.primaryKeyword, ...retirementDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: retirementDef.title,
    description: retirementDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: retirementDef.title,
    description: retirementDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={retirementDef} />
      <RetirementClient />
    </>
  );
}
