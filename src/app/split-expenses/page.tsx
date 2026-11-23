import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import SplitExpensesClient from "./SplitExpensesClient";
import { splitExpensesDef } from "./definition";

const URL = "https://www.freecalcs.io/split-expenses";

export const metadata: Metadata = {
  title: splitExpensesDef.title,
  description: splitExpensesDef.metaDescription,
  keywords: [splitExpensesDef.primaryKeyword, ...splitExpensesDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: splitExpensesDef.title,
    description: splitExpensesDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: splitExpensesDef.title,
    description: splitExpensesDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={splitExpensesDef} />
      <SplitExpensesClient />
    </>
  );
}
