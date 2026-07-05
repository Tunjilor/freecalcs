import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import LoanPayoffClient from "./LoanPayoffClient";
import { loanPayoffDef } from "./definition";

const URL = "https://www.freecalcs.io/loan-payoff";

export const metadata: Metadata = {
  title: loanPayoffDef.title,
  description: loanPayoffDef.metaDescription,
  keywords: [loanPayoffDef.primaryKeyword, ...loanPayoffDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: loanPayoffDef.title,
    description: loanPayoffDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: loanPayoffDef.title,
    description: loanPayoffDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={loanPayoffDef} />
      <LoanPayoffClient />
    </>
  );
}
