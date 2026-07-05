import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import CreditCardClient from "./CreditCardClient";
import { creditCardDef } from "./definition";

const URL = "https://www.freecalcs.io/credit-card-payoff";

export const metadata: Metadata = {
  title: creditCardDef.title,
  description: creditCardDef.metaDescription,
  keywords: [creditCardDef.primaryKeyword, ...creditCardDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: creditCardDef.title,
    description: creditCardDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: creditCardDef.title,
    description: creditCardDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={creditCardDef} />
      <CreditCardClient />
    </>
  );
}
