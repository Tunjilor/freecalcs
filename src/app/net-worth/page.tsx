import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import NetWorthClient from "./NetWorthClient";
import { netWorthDef } from "./definition";

const URL = "https://www.freecalcs.io/net-worth";

export const metadata: Metadata = {
  title: netWorthDef.title,
  description: netWorthDef.metaDescription,
  keywords: [netWorthDef.primaryKeyword, ...netWorthDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: netWorthDef.title,
    description: netWorthDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: netWorthDef.title,
    description: netWorthDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={netWorthDef} />
      <NetWorthClient />
    </>
  );
}
