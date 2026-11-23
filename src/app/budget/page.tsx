import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import BudgetClient from "./BudgetClient";
import { budgetDef } from "./definition";

const URL = "https://www.freecalcs.io/budget";

export const metadata: Metadata = {
  title: budgetDef.title,
  description: budgetDef.metaDescription,
  keywords: [budgetDef.primaryKeyword, ...budgetDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: budgetDef.title,
    description: budgetDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: budgetDef.title,
    description: budgetDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={budgetDef} />
      <BudgetClient />
    </>
  );
}
