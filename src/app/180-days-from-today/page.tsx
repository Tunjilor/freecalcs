import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import Days180Client from "./Days180Client";
import { days180Def } from "./definition";

const URL = "https://www.freecalcs.io/180-days-from-today";

export const metadata: Metadata = {
  title: days180Def.title,
  description: days180Def.metaDescription,
  keywords: [days180Def.primaryKeyword, ...days180Def.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: days180Def.title,
    description: days180Def.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: days180Def.title,
    description: days180Def.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={days180Def} />
      <Days180Client />
    </>
  );
}
