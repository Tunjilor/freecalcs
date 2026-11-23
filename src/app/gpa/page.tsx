import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import GpaClient from "./GpaClient";
import { gpaDef } from "./definition";

const URL = "https://www.freecalcs.io/gpa";

export const metadata: Metadata = {
  title: gpaDef.title,
  description: gpaDef.metaDescription,
  keywords: [gpaDef.primaryKeyword, ...gpaDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: gpaDef.title,
    description: gpaDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: gpaDef.title,
    description: gpaDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={gpaDef} />
      <GpaClient />
    </>
  );
}
