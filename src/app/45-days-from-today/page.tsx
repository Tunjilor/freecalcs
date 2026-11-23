import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import Days45Client from "./Days45Client";
import { days45Def } from "./definition";

const URL = "https://www.freecalcs.io/45-days-from-today";

export const metadata: Metadata = {
  title: days45Def.title,
  description: days45Def.metaDescription,
  keywords: [days45Def.primaryKeyword, ...days45Def.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: days45Def.title,
    description: days45Def.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: days45Def.title,
    description: days45Def.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={days45Def} />
      <Days45Client />
    </>
  );
}
