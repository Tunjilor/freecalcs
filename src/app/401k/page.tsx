import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import FourOhOneKClient from "./FourOhOneKClient";
import { fourOhOneKDef } from "./definition";

const URL = "https://www.freecalcs.io/401k";

export const metadata: Metadata = {
  title: fourOhOneKDef.title,
  description: fourOhOneKDef.metaDescription,
  keywords: [fourOhOneKDef.primaryKeyword, ...fourOhOneKDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: fourOhOneKDef.title,
    description: fourOhOneKDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: fourOhOneKDef.title,
    description: fourOhOneKDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={fourOhOneKDef} />
      <FourOhOneKClient />
    </>
  );
}
