import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import PersonalLoanClient from "./PersonalLoanClient";
import { personalLoanDef } from "./definition";

const URL = "https://www.freecalcs.io/personal-loan";

export const metadata: Metadata = {
  title: personalLoanDef.title,
  description: personalLoanDef.metaDescription,
  keywords: [personalLoanDef.primaryKeyword, ...personalLoanDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: personalLoanDef.title,
    description: personalLoanDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: personalLoanDef.title,
    description: personalLoanDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={personalLoanDef} />
      <PersonalLoanClient />
    </>
  );
}
