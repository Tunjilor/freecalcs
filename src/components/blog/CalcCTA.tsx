import Link from "next/link";
import { tokens as t } from "@/lib/calculator/tokens";

// A prominent, contextual in-content call-to-action for blog posts, linking to
// the calculator the surrounding text is discussing. Token-styled (no hardcoded
// hex). Place it right after the paragraph that describes the calculation — not
// dumped at the bottom.

type Props = { href: string; label: string; blurb: string; cta?: string };

export default function CalcCTA({ href, label, blurb, cta = "Open the calculator" }: Props) {
  return (
    <aside
      style={{
        background: t.color.brandTint,
        border: `1px solid ${t.color.line}`,
        borderRadius: t.radius.lg,
        padding: 20,
        margin: "28px 0",
      }}
    >
      <p style={{ fontSize: t.font.h3, fontWeight: 800, color: t.color.ink, margin: "0 0 6px" }}>
        {label}
      </p>
      <p style={{ fontSize: t.font.body, color: t.color.body, lineHeight: 1.6, margin: "0 0 14px" }}>
        {blurb}
      </p>
      <Link
        href={href}
        style={{
          display: "inline-block",
          background: t.color.brand,
          color: t.color.onBrand,
          fontSize: t.font.body,
          fontWeight: 700,
          padding: "10px 18px",
          borderRadius: t.radius.md,
          textDecoration: "none",
        }}
      >
        {cta} →
      </Link>
    </aside>
  );
}
