import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import DownPaymentClient from "./DownPaymentClient";
import { downPaymentDef } from "./definition";

const URL = "https://www.freecalcs.io/down-payment";

export const metadata: Metadata = {
  title: downPaymentDef.title,
  description: downPaymentDef.metaDescription,
  keywords: [downPaymentDef.primaryKeyword, ...downPaymentDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: downPaymentDef.title,
    description: downPaymentDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: downPaymentDef.title,
    description: downPaymentDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={downPaymentDef} />
      <DownPaymentClient />
    </>
  );
}
