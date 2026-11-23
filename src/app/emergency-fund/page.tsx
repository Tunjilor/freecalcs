import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import EmergencyFundClient from "./EmergencyFundClient";
import { emergencyFundDef } from "./definition";

const URL = "https://www.freecalcs.io/emergency-fund";

export const metadata: Metadata = {
  title: emergencyFundDef.title,
  description: emergencyFundDef.metaDescription,
  keywords: [emergencyFundDef.primaryKeyword, ...emergencyFundDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: emergencyFundDef.title,
    description: emergencyFundDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: emergencyFundDef.title,
    description: emergencyFundDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={emergencyFundDef} />
      <EmergencyFundClient />
    </>
  );
}
