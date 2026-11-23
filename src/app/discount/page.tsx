import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import DiscountClient from "./DiscountClient";
import { discountDef } from "./definition";

const URL = "https://www.freecalcs.io/discount";

export const metadata: Metadata = {
  title: discountDef.title,
  description: discountDef.metaDescription,
  keywords: [discountDef.primaryKeyword, ...discountDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: discountDef.title,
    description: discountDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: discountDef.title,
    description: discountDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={discountDef} />
      <DiscountClient />
    </>
  );
}
