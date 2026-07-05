import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import RothClient from "./RothClient";
import { rothDef } from "./definition";

const URL = "https://www.freecalcs.io/roth-vs-traditional";

export const metadata: Metadata = {
  title: rothDef.title,
  description: rothDef.metaDescription,
  keywords: [rothDef.primaryKeyword, ...rothDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: rothDef.title,
    description: rothDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: rothDef.title,
    description: rothDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={rothDef} />
      <RothClient />
    </>
  );
}
