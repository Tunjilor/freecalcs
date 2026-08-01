// FAQPage structured data for blog posts. Sixteen posts each carried a
// byte-identical `const faqSchema = {...}` next to their own `faqs` array; this
// is that block, written once. Sibling of ArticleJsonLd/SiteJsonLd — same shape:
// build the object, stringify it into a single <script>. Server component, so
// the block lands in the RAW prerendered HTML for a no-JS crawl.
//
// Pass the post's existing `faqs` array unchanged. The array stays in the post
// because the visible FAQ section renders from that same array — which is the
// point: one source for both the markup and the schema, so they cannot drift
// apart. Google requires FAQ structured data to match the FAQ shown on screen.
//
// Key order here (@context, @type, mainEntity; then @type, name, acceptedAnswer
// per question) reproduces what the inline blocks emitted. JSON.stringify
// follows insertion order, so reordering these keys would silently change every
// post's emitted bytes — leave them as they are.

export type Faq = { q: string; a: string };

export default function FaqJsonLd({ faqs }: { faqs: readonly Faq[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
