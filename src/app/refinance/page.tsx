import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import RefinanceClient from "./RefinanceClient";
import { refinanceDef } from "./definition";

const URL = "https://www.freecalcs.io/refinance";

export const metadata: Metadata = {
  title: refinanceDef.title,
  description: refinanceDef.metaDescription,
  keywords: [refinanceDef.primaryKeyword, ...refinanceDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: refinanceDef.title,
    description: refinanceDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: refinanceDef.title,
    description: refinanceDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={refinanceDef} />
      <RefinanceClient />
    </>
  );
}
