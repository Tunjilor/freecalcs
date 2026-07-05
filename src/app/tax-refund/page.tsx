import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import TaxRefundClient from "./TaxRefundClient";
import { taxRefundDef } from "./definition";

const URL = "https://www.freecalcs.io/tax-refund";

export const metadata: Metadata = {
  title: taxRefundDef.title,
  description: taxRefundDef.metaDescription,
  keywords: [taxRefundDef.primaryKeyword, ...taxRefundDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: taxRefundDef.title,
    description: taxRefundDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: taxRefundDef.title,
    description: taxRefundDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={taxRefundDef} />
      <TaxRefundClient />
    </>
  );
}
