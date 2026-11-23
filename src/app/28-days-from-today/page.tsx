import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import Days28Client from "./Days28Client";
import { days28Def } from "./definition";

const URL = "https://www.freecalcs.io/28-days-from-today";

export const metadata: Metadata = {
  title: days28Def.title,
  description: days28Def.metaDescription,
  keywords: [days28Def.primaryKeyword, ...days28Def.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: days28Def.title,
    description: days28Def.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: days28Def.title,
    description: days28Def.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={days28Def} />
      <Days28Client />
    </>
  );
}
