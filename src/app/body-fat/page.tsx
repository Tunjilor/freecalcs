import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import BodyFatClient from "./BodyFatClient";
import { bodyFatDef } from "./definition";

const URL = "https://www.freecalcs.io/body-fat";

export const metadata: Metadata = {
  title: bodyFatDef.title,
  description: bodyFatDef.metaDescription,
  keywords: [bodyFatDef.primaryKeyword, ...bodyFatDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: bodyFatDef.title,
    description: bodyFatDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: bodyFatDef.title,
    description: bodyFatDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={bodyFatDef} />
      <BodyFatClient />
    </>
  );
}
