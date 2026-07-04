import { tokens as t } from "@/lib/calculator/tokens";
import type { MonetizationSlot } from "@/lib/calculator/types";

// OPT-IN monetization variant (BUILD-STANDARD §6): a real, disclosed affiliate /
// lead-gen offer. Use this ONLY when an actual offer exists — it renders a
// sponsored/nofollow link and a commission disclosure. The default slot is
// <InternalCTA>. Wiring a live offer is a one-line swap of `href` in the
// definition's monetization array.

type Props = { slot: Extract<MonetizationSlot, { kind: "affiliate" }> };

export default function AffiliateCTA({ slot }: Props) {
  return (
    <aside
      style={{
        background: t.color.brandTint,
        border: `1px solid ${t.color.line}`,
        borderRadius: t.radius.lg,
        padding: 22,
      }}
    >
      <p style={{ fontSize: t.font.h3, fontWeight: 800, color: t.color.ink, marginBottom: 6 }}>
        {slot.headline}
      </p>
      <p style={{ fontSize: t.font.body, color: t.color.body, lineHeight: 1.6, marginBottom: 14 }}>
        {slot.body}
      </p>
      <a
        href={slot.href}
        rel="sponsored nofollow"
        style={{
          display: "inline-block",
          background: t.color.brand,
          color: t.color.onBrand,
          fontSize: t.font.body,
          fontWeight: 700,
          padding: "11px 20px",
          borderRadius: t.radius.md,
          textDecoration: "none",
        }}
      >
        {slot.ctaLabel} →
      </a>
      {slot.disclosure !== false && (
        <p style={{ fontSize: 11, color: t.color.faint, marginTop: 12 }}>
          We may earn a commission if you use this link, at no cost to you.{" "}
          <a href="/affiliate-disclosure" style={{ color: t.color.muted }}>
            Disclosure
          </a>
          .
        </p>
      )}
    </aside>
  );
}
