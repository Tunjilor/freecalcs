import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import SquareFootageClient from "./SquareFootageClient";
import { squareFootageDef } from "./definition";

const URL = "https://www.freecalcs.io/square-footage";

export const metadata: Metadata = {
  title: squareFootageDef.title,
  description: squareFootageDef.metaDescription,
  keywords: [squareFootageDef.primaryKeyword, ...squareFootageDef.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: squareFootageDef.title,
    description: squareFootageDef.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: squareFootageDef.title,
    description: squareFootageDef.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={squareFootageDef} />
      <SquareFootageClient />
    </>
  );
}
