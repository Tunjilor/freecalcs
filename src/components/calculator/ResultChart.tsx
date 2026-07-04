import { tokens as t } from "@/lib/calculator/tokens";
import { money } from "@/lib/calculator/format";
import type { ChartSpec } from "@/lib/calculator/types";

// Responsive inline-SVG chart — no external charting dependency (Recharts is
// not installed; adding it was deemed too heavy for one line series). Renders
// an area/line from a ChartSpec's series. The SVG uses a fixed viewBox with
// width:100%, so it scales fluidly and reserves its aspect ratio (no layout
// shift on compute).

type Props<Results> = { spec: ChartSpec<Results>; results: Results };

const W = 640;
const H = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 56 };

export default function ResultChart<Results>({ spec, results }: Props<Results>) {
  const raw = spec.series(results);
  if (!raw.length) return null;

  // Downsample to at most ~64 points for a clean path.
  const step = Math.max(1, Math.ceil(raw.length / 64));
  const pts = raw.filter((_, i) => i % step === 0 || i === raw.length - 1);

  const maxY = Math.max(...pts.map((p) => p.y), 1);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / (pts.length - 1 || 1)) * innerW;
  const y = (v: number) => PAD.top + innerH - (v / maxY) * innerH;

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.y).toFixed(1)}`).join(" ");
  const area = `${line} L${x(pts.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxY);
  const fmtY = spec.yFormat === "number" ? (v: number) => String(Math.round(v)) : (v: number) => money(v);

  return (
    <figure style={{ margin: 0 }}>
      <figcaption
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: t.color.faint,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 12,
        }}
      >
        {spec.title}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={spec.title}
        style={{ display: "block", aspectRatio: `${W} / ${H}` }}
      >
        <defs>
          <linearGradient id="fc-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.color.brand} stopOpacity="0.28" />
            <stop offset="100%" stopColor={t.color.brand} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={t.color.lineSoft}
              strokeWidth={1}
            />
            <text x={PAD.left - 8} y={y(tick) + 4} textAnchor="end" fontSize={10} fill={t.color.faint}>
              {fmtY(tick)}
            </text>
          </g>
        ))}
        {spec.kind === "area" && <path d={area} fill="url(#fc-chart-fill)" />}
        <path d={line} fill="none" stroke={t.color.brand} strokeWidth={2.5} strokeLinejoin="round" />
        <text x={PAD.left} y={H - 8} fontSize={10} fill={t.color.faint}>
          {pts[0].x}
        </text>
        <text x={W - PAD.right} y={H - 8} textAnchor="end" fontSize={10} fill={t.color.faint}>
          {pts[pts.length - 1].x}
        </text>
      </svg>
    </figure>
  );
}
