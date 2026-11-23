import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import FinalGradeClient from "./FinalGradeClient";
import { finalGradeDef } from "./definition";

const URL = "https://www.freecalcs.io/final-grade";

export const metadata: Metadata = {
  title: finalGradeDef.title,
  description: finalGradeDef.metaDescription,
  keywords: [finalGradeDef.primaryKeyword, ...finalGradeDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: finalGradeDef.title,
    description: finalGradeDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: finalGradeDef.title,
    description: finalGradeDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={finalGradeDef} />
      <FinalGradeClient />
    </>
  );
}
