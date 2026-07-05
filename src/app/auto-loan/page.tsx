import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import AutoLoanClient from "./AutoLoanClient";
import { autoLoanDef } from "./definition";

const URL = "https://www.freecalcs.io/auto-loan";

export const metadata: Metadata = {
  title: autoLoanDef.title,
  description: autoLoanDef.metaDescription,
  keywords: [autoLoanDef.primaryKeyword, ...autoLoanDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: autoLoanDef.title,
    description: autoLoanDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: autoLoanDef.title,
    description: autoLoanDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={autoLoanDef} />
      <AutoLoanClient />
    </>
  );
}
