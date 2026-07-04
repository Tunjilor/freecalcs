import { tokens as t } from "@/lib/calculator/tokens";

// The three-question educational section (BUILD-STANDARD §1.10): What is it /
// Why it matters / What to do next. Genuinely useful prose, server-rendered
// for SEO. Accepts HTML-free strings; render as paragraphs.

type Props = {
  h1: string;
  teach: { whatIsIt: string; whyItMatters: string; whatToDoNext: string };
};

export default function TeachBlock({ h1, teach }: Props) {
  const blocks: { heading: string; body: string }[] = [
    { heading: `What is a ${h1.replace(/ Calculator$/, "")}?`, body: teach.whatIsIt },
    { heading: "Why it matters", body: teach.whyItMatters },
    { heading: "What to do next", body: teach.whatToDoNext },
  ];
  return (
    <section aria-label="Guide">
      {blocks.map((b) => (
        <div key={b.heading} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: t.color.ink, marginBottom: 10 }}>
            {b.heading}
          </h2>
          {b.body.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{ fontSize: t.font.lead, color: t.color.body, lineHeight: 1.8, marginBottom: 14 }}
            >
              {para}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
