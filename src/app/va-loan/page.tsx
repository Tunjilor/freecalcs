import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import VaLoanClient from "./VaLoanClient";
import { vaLoanDef } from "./definition";

// Server component: sets metadata, emits the structured data into the initial
// HTML, and renders the (client) calculator — which Next statically prerenders
// with its default results, so the page is real HTML in view-source.

const URL = "https://www.freecalcs.io/va-loan";

export const metadata: Metadata = {
  title: vaLoanDef.title,
  description: vaLoanDef.metaDescription,
  keywords: [vaLoanDef.primaryKeyword, ...vaLoanDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: vaLoanDef.title,
    description: vaLoanDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: vaLoanDef.title,
    description: vaLoanDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={vaLoanDef} />
      <VaLoanClient />
    </>
  );
}
