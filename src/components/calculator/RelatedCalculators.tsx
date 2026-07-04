import Link from "next/link";
import { tokens as t } from "@/lib/calculator/tokens";
import { HUBS } from "@/lib/calculator/hubs";
import type { HubId, RelatedLink } from "@/lib/calculator/types";

// Internal-link grid (BUILD-STANDARD §5). Always links up to the hub first,
// then sideways to sibling calculators. This is what turns pages into a cluster.

type Props = { hub: HubId; siblings: RelatedLink[] };

export default function RelatedCalculators({ hub, siblings }: Props) {
  const hubInfo = HUBS[hub];
  return (
    <section aria-label="Related calculators">
      <h2 style={{ fontSize: t.font.h3, fontWeight: 800, color: t.color.ink, marginBottom: 14 }}>
        Related calculators
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 10,
        }}
      >
        <Link href={hubInfo.href} style={hubCard}>
          <span style={{ fontWeight: 700, color: t.color.brand, fontSize: 14 }}>
            ↑ {hubInfo.label} hub
          </span>
          <span style={{ fontSize: 12, color: t.color.muted, marginTop: 2 }}>{hubInfo.blurb}</span>
        </Link>
        {siblings.map((s) => (
          <Link key={s.slug} href={`/${s.slug}`} style={card}>
            <span style={{ fontWeight: 700, color: t.color.ink, fontSize: 14 }}>{s.label}</span>
            <span style={{ fontSize: 12, color: t.color.brand, marginTop: 2 }}>Open →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const card: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  background: t.color.surface,
  border: `1px solid ${t.color.line}`,
  borderRadius: t.radius.lg,
  padding: "14px 16px",
  textDecoration: "none",
};
const hubCard: React.CSSProperties = { ...card, background: t.color.brandTint, borderColor: t.color.brandTint };
