// ItemList structured data for the homepage calculator grid. Sibling of
// SiteJsonLd / ArticleJsonLd / FaqJsonLd — build the object, stringify it into
// one <script>. Server component, so it lands in the RAW prerendered HTML.
//
// Fed the same array the grid renders from, so positions cannot drift out of
// sync with what a visitor sees. Google requires ItemList order to match the
// visible order; passing the array rather than restating it is what guarantees
// that. Do not hand-maintain a second copy of this list.
//
// This is deliberately the SUMMARY-PAGE shape: position + name + url, each url
// pointing at the calculator's own page. The alternative "all-in-one" shape
// nests a full entity (with description, offers, applicationCategory) per item,
// and is for pages that contain the content itself. This page only links out —
// and every calculator page already emits its own WebApplication node, so
// nesting descriptions here would put two competing descriptions of the same
// tool into the graph. Add `description` only if this page ever inlines the
// calculators themselves.

const SITE = "https://www.freecalcs.io";

export type ItemListEntry = { slug: string; label: string };

export default function ItemListJsonLd({
  items,
  name,
}: {
  items: readonly ItemListEntry[];
  name: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      url: `${SITE}/${c.slug}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
