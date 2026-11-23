import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import RaiseClient from "./RaiseClient";
import { raiseDef } from "./definition";

const URL = "https://www.freecalcs.io/raise";

export const metadata: Metadata = {
  title: raiseDef.title,
  description: raiseDef.metaDescription,
  keywords: [raiseDef.primaryKeyword, ...raiseDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: raiseDef.title,
    description: raiseDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: raiseDef.title,
    description: raiseDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={raiseDef} />
      <RaiseClient />
    </>
  );
}
