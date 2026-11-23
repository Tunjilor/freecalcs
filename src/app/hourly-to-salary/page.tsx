import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import HourlyToSalaryClient from "./HourlyToSalaryClient";
import { hourlyToSalaryDef } from "./definition";

const URL = "https://www.freecalcs.io/hourly-to-salary";

export const metadata: Metadata = {
  title: hourlyToSalaryDef.title,
  description: hourlyToSalaryDef.metaDescription,
  keywords: [hourlyToSalaryDef.primaryKeyword, ...hourlyToSalaryDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: hourlyToSalaryDef.title,
    description: hourlyToSalaryDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: hourlyToSalaryDef.title,
    description: hourlyToSalaryDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={hourlyToSalaryDef} />
      <HourlyToSalaryClient />
    </>
  );
}
