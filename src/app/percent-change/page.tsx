import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import PercentChangeClient from "./PercentChangeClient";
import { percentChangeDef } from "./definition";

const URL = "https://www.freecalcs.io/percent-change";

export const metadata: Metadata = {
  title: percentChangeDef.title,
  description: percentChangeDef.metaDescription,
  keywords: [percentChangeDef.primaryKeyword, ...percentChangeDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: percentChangeDef.title,
    description: percentChangeDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: percentChangeDef.title,
    description: percentChangeDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={percentChangeDef} />
      <PercentChangeClient />
    </>
  );
}
