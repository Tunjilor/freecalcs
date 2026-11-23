import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import Days60Client from "./Days60Client";
import { days60Def } from "./definition";

const URL = "https://www.freecalcs.io/60-days-from-today";

export const metadata: Metadata = {
  title: days60Def.title,
  description: days60Def.metaDescription,
  keywords: [days60Def.primaryKeyword, ...days60Def.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: days60Def.title,
    description: days60Def.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: days60Def.title,
    description: days60Def.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={days60Def} />
      <Days60Client />
    </>
  );
}
