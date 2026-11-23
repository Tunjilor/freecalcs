import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import PregnancyDueDateClient from "./PregnancyDueDateClient";
import { pregnancyDueDateDef } from "./definition";

const URL = "https://www.freecalcs.io/pregnancy-due-date";

export const metadata: Metadata = {
  title: pregnancyDueDateDef.title,
  description: pregnancyDueDateDef.metaDescription,
  keywords: [pregnancyDueDateDef.primaryKeyword, ...pregnancyDueDateDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: pregnancyDueDateDef.title,
    description: pregnancyDueDateDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pregnancyDueDateDef.title,
    description: pregnancyDueDateDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={pregnancyDueDateDef} />
      <PregnancyDueDateClient />
    </>
  );
}
