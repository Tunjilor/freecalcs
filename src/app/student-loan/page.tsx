import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import StudentLoanClient from "./StudentLoanClient";
import { studentLoanDef } from "./definition";

const URL = "https://www.freecalcs.io/student-loan";

export const metadata: Metadata = {
  title: studentLoanDef.title,
  description: studentLoanDef.metaDescription,
  keywords: [studentLoanDef.primaryKeyword, ...studentLoanDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: studentLoanDef.title,
    description: studentLoanDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: studentLoanDef.title,
    description: studentLoanDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={studentLoanDef} />
      <StudentLoanClient />
    </>
  );
}
