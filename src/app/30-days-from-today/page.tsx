import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import Days30Client from "./Days30Client";
import { days30Def } from "./definition";

const URL = "https://www.freecalcs.io/30-days-from-today";

export const metadata: Metadata = {
  title: days30Def.title,
  description: days30Def.metaDescription,
  keywords: [days30Def.primaryKeyword, ...days30Def.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: days30Def.title,
    description: days30Def.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: days30Def.title,
    description: days30Def.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={days30Def} />
      <Days30Client />
    </>
  );
}
