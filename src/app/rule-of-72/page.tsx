import type { Metadata } from "next";
import JsonLd from "@/components/calculator/JsonLd";
import RuleOf72Client from "./RuleOf72Client";
import { ruleOf72Def } from "./definition";

const URL = "https://www.freecalcs.io/rule-of-72";

export const metadata: Metadata = {
  title: ruleOf72Def.title,
  description: ruleOf72Def.metaDescription,
  keywords: [ruleOf72Def.primaryKeyword, ...ruleOf72Def.secondaryKeywords],
  alternates: { canonical: URL },
  openGraph: {
    title: ruleOf72Def.title,
    description: ruleOf72Def.metaDescription,
    url: URL,
    siteName: "FreeCalcs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ruleOf72Def.title,
    description: ruleOf72Def.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd def={ruleOf72Def} />
      <RuleOf72Client />
    </>
  );
}
