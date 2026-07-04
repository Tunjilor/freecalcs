import { HUBS } from "@/lib/calculator/hubs";
import type { CalculatorDefinition, HubId } from "@/lib/calculator/types";

// Emits the three required structured-data blocks (BUILD-STANDARD §7) from the
// definition so agents can't malform them: WebApplication + FAQPage +
// BreadcrumbList. Server component — reads only serializable fields (strings),
// never the compute/insight functions, so it is safe on the RSC boundary.

const SITE = "https://www.freecalcs.io";

type Props = {
  // Only the serializable slice is needed here.
  def: Pick<
    CalculatorDefinition<unknown, unknown>,
    "slug" | "h1" | "metaDescription" | "faqs" | "hub"
  >;
};

function breadcrumb(hub: HubId, slug: string, h1: string) {
  const hubInfo = HUBS[hub];
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: hubInfo.label, item: `${SITE}${hubInfo.href}` },
      { "@type": "ListItem", position: 3, name: h1, item: `${SITE}/${slug}` },
    ],
  };
}

export default function JsonLd({ def }: Props) {
  const url = `${SITE}/${def.slug}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: def.h1,
        url,
        description: def.metaDescription,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: def.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumb(def.hub, def.slug, def.h1),
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
