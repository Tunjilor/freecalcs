import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import RetirementWithdrawalClient from "./RetirementWithdrawalClient";
import { retirementWithdrawalDef } from "./definition";

const URL = "https://www.freecalcs.io/retirement-withdrawal";

export const metadata: Metadata = {
  title: retirementWithdrawalDef.title,
  description: retirementWithdrawalDef.metaDescription,
  keywords: [retirementWithdrawalDef.primaryKeyword, ...retirementWithdrawalDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: retirementWithdrawalDef.title,
    description: retirementWithdrawalDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: retirementWithdrawalDef.title,
    description: retirementWithdrawalDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={retirementWithdrawalDef} />
      <RetirementWithdrawalClient />
    </>
  );
}
