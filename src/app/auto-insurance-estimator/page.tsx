import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import AutoInsuranceClient from "./AutoInsuranceClient";
import { autoInsuranceDef } from "./definition";

const URL = "https://www.freecalcs.io/auto-insurance-estimator";

export const metadata: Metadata = {
  title: autoInsuranceDef.title,
  description: autoInsuranceDef.metaDescription,
  keywords: [autoInsuranceDef.primaryKeyword, ...autoInsuranceDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: autoInsuranceDef.title,
    description: autoInsuranceDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: autoInsuranceDef.title,
    description: autoInsuranceDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={autoInsuranceDef} />
      <AutoInsuranceClient />
    </>
  );
}
