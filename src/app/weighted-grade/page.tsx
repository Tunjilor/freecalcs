import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import WeightedGradeClient from "./WeightedGradeClient";
import { weightedGradeDef } from "./definition";

const URL = "https://www.freecalcs.io/weighted-grade";

export const metadata: Metadata = {
  title: weightedGradeDef.title,
  description: weightedGradeDef.metaDescription,
  keywords: [weightedGradeDef.primaryKeyword, ...weightedGradeDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: weightedGradeDef.title,
    description: weightedGradeDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: weightedGradeDef.title,
    description: weightedGradeDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={weightedGradeDef} />
      <WeightedGradeClient />
    </>
  );
}
