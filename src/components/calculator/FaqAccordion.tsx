import { tokens as t } from "@/lib/calculator/tokens";

// Renders the FAQ list as native <details> (works with JS disabled). The
// matching FAQPage JSON-LD is emitted separately by <JsonLd> from the same
// faqs array, so the structured data always matches the visible content.

type Props = { faqs: { q: string; a: string }[] };

export default function FaqAccordion({ faqs }: Props) {
  return (
    <section aria-label="Frequently asked questions">
      <h2 style={{ fontSize: t.font.h2, fontWeight: 800, color: t.color.ink, marginBottom: 16 }}>
        Frequently asked questions
      </h2>
      {faqs.map(({ q, a }) => (
        <details key={q} style={{ borderBottom: `1px solid ${t.color.line}`, padding: "14px 0" }}>
          <summary
            style={{
              fontWeight: 700,
              fontSize: t.font.lead,
              color: t.color.ink,
              cursor: "pointer",
              listStyle: "none",
            }}
          >
            {/* H3 keeps the FAQ questions in the heading outline (§5). */}
            <h3 style={{ display: "inline", fontSize: t.font.lead, fontWeight: 700, margin: 0 }}>
              {q}
            </h3>
          </summary>
          <p style={{ marginTop: 10, fontSize: t.font.body, color: t.color.muted, lineHeight: 1.7 }}>
            {a}
          </p>
        </details>
      ))}
    </section>
  );
}
