import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import WaterIntakeClient from "./WaterIntakeClient";
import { waterIntakeDef } from "./definition";

const URL = "https://www.freecalcs.io/water-intake";

export const metadata: Metadata = {
  title: waterIntakeDef.title,
  description: waterIntakeDef.metaDescription,
  keywords: [waterIntakeDef.primaryKeyword, ...waterIntakeDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: waterIntakeDef.title,
    description: waterIntakeDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: waterIntakeDef.title,
    description: waterIntakeDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={waterIntakeDef} />
      <WaterIntakeClient />
    </>
  );
}
