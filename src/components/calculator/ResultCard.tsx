import { tokens as t } from "@/lib/calculator/tokens";

// The headline number card. `primary` renders the big hero (dark gradient,
// large value); `secondary` renders a compact stat tile.

type Props = {
  variant: "primary" | "secondary";
  label: string;
  value: string;
  hint?: string;
  sub?: { label: string; value: string }[]; // small breakdown chips (primary only)
};

export default function ResultCard({ variant, label, value, hint, sub }: Props) {
  if (variant === "primary") {
    return (
      <div
        style={{
          background: t.gradient.hero,
          borderRadius: t.radius.xl,
          padding: "28px 24px",
          boxShadow: t.shadow.hero,
          color: t.color.onBrand,
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: t.color.onBrandFaint,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 6,
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: t.font.hero, fontWeight: 800, lineHeight: 1, marginBottom: 6 }}>
          {value}
        </p>
        {hint && (
          <p style={{ fontSize: 12, color: t.color.onBrandFaint, marginBottom: sub ? 20 : 0 }}>
            {hint}
          </p>
        )}
        {sub && sub.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: t.space.sm,
            }}
          >
            {sub.map((s) => (
              <div
                key={s.label}
                style={{
                  background: t.color.onBrandPanel,
                  borderRadius: t.radius.md,
                  padding: "12px 14px",
                }}
              >
                <p style={{ fontSize: 11, color: t.color.onBrandFaint, marginBottom: 3 }}>
                  {s.label}
                </p>
                <p style={{ fontSize: 17, fontWeight: 700 }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: t.color.surfaceAlt,
        borderRadius: t.radius.md,
        padding: 14,
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 11, color: t.color.faint, fontWeight: 600, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 15, fontWeight: 800, color: t.color.ink }}>{value}</p>
      {hint && <p style={{ fontSize: 11, color: t.color.faint, marginTop: 2 }}>{hint}</p>}
    </div>
  );
}
