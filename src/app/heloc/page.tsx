import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import HelocClient from "./HelocClient";
import { helocDef } from "./definition";

const URL = "https://www.freecalcs.io/heloc";

export const metadata: Metadata = {
  title: helocDef.title,
  description: helocDef.metaDescription,
  keywords: [helocDef.primaryKeyword, ...helocDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: helocDef.title,
    description: helocDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: helocDef.title,
    description: helocDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={helocDef} />
      <HelocClient />
    </>
  );
}
