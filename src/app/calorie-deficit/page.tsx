import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import CalorieDeficitClient from "./CalorieDeficitClient";
import { calorieDeficitDef } from "./definition";

const URL = "https://www.freecalcs.io/calorie-deficit";

export const metadata: Metadata = {
  title: calorieDeficitDef.title,
  description: calorieDeficitDef.metaDescription,
  keywords: [calorieDeficitDef.primaryKeyword, ...calorieDeficitDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: calorieDeficitDef.title,
    description: calorieDeficitDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: calorieDeficitDef.title,
    description: calorieDeficitDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={calorieDeficitDef} />
      <CalorieDeficitClient />
    </>
  );
}
