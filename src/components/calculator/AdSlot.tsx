import { tokens as t } from "@/lib/calculator/tokens";

// Display-ad placeholder (BUILD-STANDARD §6, "AdSense foundation"). Reserves a
// fixed height so ad insertion causes no layout shift. Swap the inner content
// for the real AdSense unit when the account is live.

type Props = { label?: string; height?: number };

export default function AdSlot({ label = "Advertisement", height = 90 }: Props) {
  return (
    <div
      aria-label={label}
      style={{
        minHeight: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px dashed ${t.color.line}`,
        borderRadius: t.radius.md,
        background: t.color.surfaceAlt,
        color: t.color.faint,
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}
