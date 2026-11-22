import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import DtiClient from "./DtiClient";
import { dtiDef } from "./definition";

const URL = "https://www.freecalcs.io/debt-to-income";

export const metadata: Metadata = {
  title: dtiDef.title,
  description: dtiDef.metaDescription,
  keywords: [dtiDef.primaryKeyword, ...dtiDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: dtiDef.title,
    description: dtiDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: dtiDef.title,
    description: dtiDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={dtiDef} />
      <DtiClient />
    </>
  );
}
