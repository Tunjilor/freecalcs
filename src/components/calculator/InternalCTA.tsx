import Link from "next/link";
import { tokens as t } from "@/lib/calculator/tokens";
import type { MonetizationSlot } from "@/lib/calculator/types";

// The DEFAULT monetization slot (BUILD-STANDARD §6): a relevant internal
// next-step link — e.g. "compare to a conventional loan" or "check if you
// qualify". No commission, no sponsored rel, no disclosure text. Placed AFTER
// the result + explanation so the user gets value first.

type Props = { slot: Extract<MonetizationSlot, { kind: "internal" }> };

export default function InternalCTA({ slot }: Props) {
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
      <Link
        href={slot.href}
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
      </Link>
    </aside>
  );
}
