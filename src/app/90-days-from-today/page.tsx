import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import Days90Client from "./Days90Client";
import { days90Def } from "./definition";

const URL = "https://www.freecalcs.io/90-days-from-today";

export const metadata: Metadata = {
  title: days90Def.title,
  description: days90Def.metaDescription,
  keywords: [days90Def.primaryKeyword, ...days90Def.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: days90Def.title,
    description: days90Def.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: days90Def.title,
    description: days90Def.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={days90Def} />
      <Days90Client />
    </>
  );
}
