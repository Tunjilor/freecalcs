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
  // schema.org applicationCategory. Defaults to FinanceApplication because
  // most calculators here are financial — but /age, /percentage, /scientific
  // and /tip are not, and saying otherwise misdescribes them. Override for any
  // calculator that isn't about money.
  applicationCategory?: "FinanceApplication" | "UtilityApplication" | "HealthApplication";
};

// Home -> Hub -> Calculator, except the hub crumb is dropped when it would not
// name a distinct level: the `everyday` hub points at "/" (the home crumb
// already there), and `loans` points at /loan, which IS the loan calculator.
// Emitting those would give two crumbs the same URL — not a hierarchy, and a
// breadcrumb Google may discard whole. An honest two-level Home -> Calculator
// is better than a padded three. If a hub ever gets its own real landing page,
// its members pick the third crumb back up automatically.
function breadcrumb(hub: HubId, slug: string, h1: string) {
  const hubInfo = HUBS[hub];
  const pageUrl = `${SITE}/${slug}`;
  const hubUrl = `${SITE}${hubInfo.href}`;
  const hubIsDistinct = hubInfo.href !== "/" && hubUrl !== pageUrl;

  const crumbs = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
    ...(hubIsDistinct
      ? [{ "@type": "ListItem", position: 2, name: hubInfo.label, item: hubUrl }]
      : []),
  ];
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      ...crumbs,
      { "@type": "ListItem", position: crumbs.length + 1, name: h1, item: pageUrl },
    ],
  };
}

export default function JsonLd({ def, applicationCategory = "FinanceApplication" }: Props) {
  const url = `${SITE}/${def.slug}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: def.h1,
        url,
        description: def.metaDescription,
        applicationCategory,
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
