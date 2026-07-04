import { tokens as t } from "@/lib/calculator/tokens";

// The trust / method line (BUILD-STANDARD §1.12). Names the formula or data
// source and its year so users know the numbers are grounded.

type Props = { label: string; sourceUrl?: string; year?: number };

export default function MethodNote({ label, sourceUrl, year }: Props) {
  return (
    <p
      style={{
        fontSize: 12,
        color: t.color.muted,
        lineHeight: 1.6,
        display: "flex",
        gap: 6,
        alignItems: "baseline",
        flexWrap: "wrap",
      }}
    >
      <span aria-hidden>🔎</span>
      <span>
        {label}
        {year ? ` (${year})` : ""}.{" "}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: t.color.brand, textDecoration: "none", fontWeight: 600 }}
          >
            Source
          </a>
        )}
      </span>
    </p>
  );
}
