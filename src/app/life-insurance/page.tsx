import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import LifeInsuranceClient from "./LifeInsuranceClient";
import { lifeInsuranceDef } from "./definition";

const URL = "https://www.freecalcs.io/life-insurance";

export const metadata: Metadata = {
  title: lifeInsuranceDef.title,
  description: lifeInsuranceDef.metaDescription,
  keywords: [lifeInsuranceDef.primaryKeyword, ...lifeInsuranceDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: lifeInsuranceDef.title,
    description: lifeInsuranceDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: lifeInsuranceDef.title,
    description: lifeInsuranceDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={lifeInsuranceDef} />
      <LifeInsuranceClient />
    </>
  );
}
