import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import SavingsGoalClient from "./SavingsGoalClient";
import { savingsGoalDef } from "./definition";

const URL = "https://www.freecalcs.io/savings-goal";

export const metadata: Metadata = {
  title: savingsGoalDef.title,
  description: savingsGoalDef.metaDescription,
  keywords: [savingsGoalDef.primaryKeyword, ...savingsGoalDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: savingsGoalDef.title,
    description: savingsGoalDef.metaDescription,
    url: URL,
    siteName: "freecalcs.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: savingsGoalDef.title,
    description: savingsGoalDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={savingsGoalDef} />
      <SavingsGoalClient />
    </>
  );
}
