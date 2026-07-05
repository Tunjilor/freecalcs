import Link from "next/link";
import { tokens as t } from "@/lib/calculator/tokens";

// The end-of-article "related tools" cluster: additional relevant calculators
// beyond the in-content CTA(s). Token-styled pill links (no hardcoded hex).

type Tool = { href: string; label: string };

export default function RelatedTools({
  tools,
  heading = "Related calculators",
}: {
  tools: Tool[];
  heading?: string;
}) {
  if (!tools.length) return null;
  return (
    <section style={{ marginTop: 32 }}>
      <p
        style={{
          fontSize: t.font.label,
          fontWeight: 700,
          color: t.color.faint,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          margin: "0 0 12px",
        }}
      >
        {heading}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {tools.map((x) => (
          <Link
            key={x.href}
            href={x.href}
            style={{
              background: t.color.brandTint,
              color: t.color.brand,
              fontSize: 13,
              fontWeight: 700,
              padding: "10px 18px",
              borderRadius: t.radius.md,
              textDecoration: "none",
            }}
          >
            {x.label} →
          </Link>
        ))}
      </div>
    </section>
  );
}
