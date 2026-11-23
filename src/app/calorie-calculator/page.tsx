import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import CalorieCalculatorClient from "./CalorieCalculatorClient";
import { calorieCalculatorDef } from "./definition";

const URL = "https://www.freecalcs.io/calorie-calculator";

export const metadata: Metadata = {
  title: calorieCalculatorDef.title,
  description: calorieCalculatorDef.metaDescription,
  keywords: [calorieCalculatorDef.primaryKeyword, ...calorieCalculatorDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: calorieCalculatorDef.title,
    description: calorieCalculatorDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: calorieCalculatorDef.title,
    description: calorieCalculatorDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={calorieCalculatorDef} />
      <CalorieCalculatorClient />
    </>
  );
}
