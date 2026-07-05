import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import PaycheckClient from "./PaycheckClient";
import { paycheckDef } from "./definition";

const URL = "https://www.freecalcs.io/paycheck";

export const metadata: Metadata = {
  title: paycheckDef.title,
  description: paycheckDef.metaDescription,
  keywords: [paycheckDef.primaryKeyword, ...paycheckDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: paycheckDef.title,
    description: paycheckDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: paycheckDef.title,
    description: paycheckDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={paycheckDef} />
      <PaycheckClient />
    </>
  );
}
