import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import HeightCalculatorClient from "./HeightCalculatorClient";
import { heightCalculatorDef } from "./definition";

const URL = "https://www.freecalcs.io/height-calculator";

export const metadata: Metadata = {
  title: heightCalculatorDef.title,
  description: heightCalculatorDef.metaDescription,
  keywords: [heightCalculatorDef.primaryKeyword, ...heightCalculatorDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: heightCalculatorDef.title,
    description: heightCalculatorDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: heightCalculatorDef.title,
    description: heightCalculatorDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={heightCalculatorDef} />
      <HeightCalculatorClient />
    </>
  );
}
