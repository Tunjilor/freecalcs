// Site-level structured data: the WebSite + Organization pair, emitted once on
// the homepage. Calculator pages already emit their own WebApplication +
// FAQPage + BreadcrumbList graph (components/calculator/JsonLd.tsx, per
// BUILD-STANDARD §7) and blog posts emit Article (components/ArticleJsonLd.tsx)
// — the homepage was the one page with no JSON-LD at all, which is why audits
// report "no Organization schema" for the site. Same shape as the sibling
// emitters: a single @graph, stringified into one <script>. Server component,
// no client JS, so the block is in the RAW prerendered HTML for a no-JS crawl.
//
// EVERY VALUE HERE IS VERIFIED-REAL. Nothing in this file may be filled in
// speculatively: no founder name, no address or contactPoint, and above all no
// aggregateRating/review (a self-serving site-wide rating is a Google manual-
// action risk, not just a fib). If a field would need inventing, omit it.

const SITE = "https://www.freecalcs.io";

// Stable @id anchors so other pages can reference these nodes instead of
// duplicating them. Keep them stable — they are the entity's identity.
export const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;

// The wordmark actually rendered in the nav and footer (layout.tsx). Dimensions
// are the real pixel size of public/freecalcs-logo.png, read from the file, and
// clear Google's 112x112 minimum for an Organization logo. If the asset is ever
// re-exported at a different size, update these to match.
const LOGO = { url: `${SITE}/freecalcs-logo.png`, width: 763, height: 163 };

// The Organization node itself, exported so other emitters (ArticleJsonLd's
// publisher) embed THIS object rather than restating the entity by hand. That
// is what keeps every page's idea of the publisher byte-identical and sharing
// one @id — the whole point of the anchor above.
//
// It is exported as a full node, not just the @id, on purpose. Google evaluates
// structured data per page, so an Article whose publisher is a lone
// { "@id": ... } points at a node that is not in that page's graph — a dangling
// reference Google may simply drop. Embedding the node keeps it resolvable
// locally while the shared @id still unifies the entity across pages for
// consumers that do resolve globally (knowledge graph, LLM retrieval).
export const ORGANIZATION = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "FreeCalcs",
  // Reconciles the two names already published for this one entity:
  // manifest.ts uses "FreeCalcs", the title suffix uses "freecalcs.io".
  // Declaring the alternate keeps them resolving to a single entity rather
  // than competing.
  alternateName: "freecalcs.io",
  url: SITE,
  logo: { "@type": "ImageObject", ...LOGO },
  description:
    "Free online calculators for mortgage, tax, salary, retirement, and health decisions. No sign-up required.",
  // No sameAs yet. The @freecalcsio handle in layout.tsx's twitter metadata is
  // the obvious candidate, but https://x.com/freecalcsio currently 404s -- and
  // X returns 200 even for handles that don't exist (it serves its SPA shell
  // and reports the miss client-side), so a 404 there is anomalous rather than
  // routine bot-blocking. Pending manual verification. A sameAs pointing at a
  // URL that does not resolve weakens entity confidence instead of
  // strengthening it, so add one only once the profile is confirmed to load.
} as const;

// No SearchAction on purpose. The homepage search (components/home/HomeSearch)
// is a client-side DOM filter over already-rendered cards — there is no
// /search?q= route to point a urlTemplate at, so declaring one would claim a
// capability the site does not have. (Google also retired the Sitelinks
// Searchbox rich result in Nov 2023, so it would render nothing regardless.)
// Do not "complete" this schema by adding one unless a real search URL ships.
export default function SiteJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "FreeCalcs",
        alternateName: "freecalcs.io",
        url: SITE,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-US",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
