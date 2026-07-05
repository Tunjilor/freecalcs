import type { Metadata } from "next";
import CalcCTA from "@/components/blog/CalcCTA";
import RelatedTools from "@/components/blog/RelatedTools";
import { tokens as t } from "@/lib/calculator/tokens";

const URL = "https://www.freecalcs.io/blog/rent-or-buy-a-home";
const TITLE = "Rent or Buy a Home? The Honest Math.";
const DESCRIPTION =
  "\"Renting is throwing money away\" is the wrong starting point. Once you count closing costs, maintenance, and the down payment's opportunity cost, buying often loses short-term and wins mainly over the long haul.";

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "freecalcs.io", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "Is renting really throwing money away?",
    a: "No — that framing is misleading. Rent buys you housing plus flexibility, and it keeps your down payment free to invest. Buyers 'throw away' money too: mortgage interest (most of your early payment), property tax, insurance, maintenance, and transaction costs are all money that doesn't build equity. Neither choice is pure waste; they're different trade-offs, and which wins depends on your situation and how long you'll stay.",
  },
  {
    q: "How long do I need to stay for buying to be worth it?",
    a: "That's the single most important factor — the 'break-even' number of years. Before it, renting is usually cheaper; after it, buying pulls ahead. In many markets break-even runs about 5 years, but it can be shorter in affordable areas and 8+ years in expensive ones or at higher mortgage rates. If you might move within a few years, buying often loses to renting once transaction costs are counted.",
  },
  {
    q: "What costs do people forget when they buy?",
    a: "The ones that don't build equity: closing costs (2–5% buying, 6%+ selling), property tax, homeowners insurance, and maintenance (budget around 1% of the home's value per year). On top of those is the opportunity cost of the down payment — tens of thousands of dollars that could otherwise be invested. Comparing rent to only the mortgage payment, ignoring all of these, is how people talk themselves into a worse deal.",
  },
  {
    q: "Doesn't buying always build wealth?",
    a: "Not automatically. Buying can build wealth through appreciation and forced savings (paying down principal), but only if you stay long enough to outrun the transaction and carrying costs, and only if the market cooperates — home values can stagnate or fall for years. Renting and investing the difference can build comparable or greater wealth, especially over shorter horizons. Buying is a good wealth-builder often, not always.",
  },
  {
    q: "Should I buy if I can afford it but might move soon?",
    a: "Probably not, on the math alone. If there's a real chance you'll move within a few years, the closing costs to buy and the ~6% cost to sell can wipe out any gains, and your early payments have barely dented the principal. Buying rewards staying put. If flexibility matters right now — job uncertainty, a possible relocation — renting is often the smarter financial move, not a fallback.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const read = t.layout.readWidth;
const heroChip: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: t.color.onBrand, background: t.color.onBrandPanel,
  padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: ".06em",
};
const heroMeta: React.CSSProperties = { fontSize: 12, color: t.color.onBrandFaint };
const card: React.CSSProperties = {
  background: t.color.surface, borderRadius: t.radius.xl, padding: "32px 28px",
  boxShadow: t.shadow.card, border: `1px solid ${t.color.line}`, marginBottom: 32,
};
const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: t.color.ink, margin: "0 0 14px" };
const p: React.CSSProperties = { fontSize: 15, color: t.color.body, lineHeight: 1.8, margin: "0 0 16px" };
const strong: React.CSSProperties = { color: t.color.ink, fontWeight: 700 };
const inlineLink: React.CSSProperties = { color: t.color.brand, fontWeight: 600, textDecoration: "none" };
const faqBox: React.CSSProperties = {
  padding: "16px 20px", background: t.color.surfaceAlt, borderRadius: t.radius.md, border: `1px solid ${t.color.line}`,
};

export default function Article() {
  return (
    <div style={{ fontFamily: t.font.family, background: t.gradient.page, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div style={{ background: t.gradient.hero, color: t.color.onBrand, padding: "40px 16px 48px" }}>
        <div style={{ maxWidth: read, margin: "0 auto" }}>
          <a href="/blog" style={{ color: t.color.onBrandFaint, fontSize: 13, textDecoration: "none" }}>← Back to Blog</a>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 12px", flexWrap: "wrap" }}>
            <span style={heroChip}>Mortgage</span>
            <span style={heroMeta}>9 min read</span>
            <span style={heroMeta}>Jul 5, 2026</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.3, color: t.color.onBrand }}>{TITLE}</h1>
          <p style={{ color: t.color.onBrandFaint, fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            &quot;Renting is throwing money away, always buy&quot; is the advice everyone repeats. The real math is more
            honest — and often points the other way, at least for a while.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: read, margin: "0 auto", padding: "40px 16px" }}>
        <div style={card}>
          {/* Your situation */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 17, color: t.color.body, lineHeight: 1.75, margin: "0 0 16px" }}>
              Everyone in your life seems to agree: renting is throwing money away, and the smart, grown-up move is to buy.
              So you feel a low hum of guilt every time you pay rent, like you&apos;re failing at money.
            </p>
            <p style={p}>
              Here&apos;s the honest version, and it might surprise you: <span style={strong}>buying is often the worse
              financial move</span>, especially in the first few years, once you count the costs people conveniently
              forget. Renting isn&apos;t throwing money away — and buying isn&apos;t automatically building wealth. Let&apos;s
              do the real math so you can decide for your own situation.
            </p>
          </div>

          {/* The forgotten costs */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The costs the &quot;always buy&quot; crowd skips</h2>
            <p style={p}>
              &quot;Rent is wasted, a mortgage builds equity&quot; sounds obvious, but it hides two things. First, in the
              early years <span style={strong}>most of your mortgage payment is interest</span>, not equity — you&apos;re
              &quot;throwing away&quot; money to the bank just like a renter throws it to a landlord. Second, owning comes
              with a stack of costs that build <span style={strong}>no</span> equity at all:
            </p>
            <p style={p}>
              <span style={strong}>Closing costs</span> of 2–5% to buy and <span style={strong}>6%+ to sell</span>.
              <span style={strong}> Property tax</span> (roughly 0.5–2.5% of value a year). <span style={strong}>Homeowners
              insurance.</span> <span style={strong}>Maintenance</span> — budget about 1% of the home&apos;s value every
              year for the roof, HVAC, and the surprises. And the quietest one: the <span style={strong}>opportunity cost
              of your down payment</span> — tens of thousands of dollars locked in the house that could otherwise be
              invested and growing.
            </p>
          </div>

          {/* The math */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The math, with real numbers</h2>
            <p style={p}>
              Suppose you can <span style={strong}>rent for $2,200 a month</span>, or <span style={strong}>buy a $400,000
              home</span> with 20% down ($80,000) at 6.5%. The mortgage payment alone is about $2,020 — right around your
              rent, which is where the &quot;might as well buy&quot; instinct comes from. But that&apos;s not the real cost
              of owning.
            </p>
            <p style={p}>
              Add roughly <span style={strong}>$370 property tax, $125 insurance, and $335 maintenance</span> a month, and
              owning actually runs about <span style={strong}>$2,850 a month</span> — some <span style={strong}>$650 more
              than renting</span>. On top of that you&apos;ve tied up $80,000 that could have been invested, and paid about
              <span style={strong}> $10,000 in closing costs</span> to get in.
            </p>
            <p style={p}>
              <span style={strong}>Over a short horizon — say 3 years — buying usually loses.</span> Your payments have
              barely touched the principal, modest appreciation gets eaten by the ~6% cost to sell, and the down payment
              that could&apos;ve been invested at ~7% sat in the walls. Renting and investing the difference often comes out
              ahead.
            </p>
            <p style={p}>
              <span style={strong}>Over a long horizon — 10+ years — buying typically pulls ahead.</span> At about 3%
              appreciation a $400,000 home is worth roughly <span style={strong}>$537,000</span> in ten years, more of each
              payment goes to principal, your fixed mortgage stops feeling expensive as rents keep rising, and the one-time
              transaction costs spread thin. Time is what makes buying win.
            </p>
            <CalcCTA
              href="/rent-vs-buy"
              label="Run your own numbers over time"
              blurb="Enter your real rent, home price, rate, and how long you'll stay to see the break-even year — the point where buying overtakes renting-and-investing for your situation."
              cta="Open the rent vs buy calculator"
            />
          </div>

          {/* The honest tension */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The honest part: it hinges on things you can&apos;t fully know</h2>
            <p style={p}>
              The whole decision comes down to a <span style={strong}>break-even number of years</span> — stay past it and
              buying wins, sell before it and renting would have won. And three things that drive that break-even
              aren&apos;t knowable in advance.
            </p>
            <p style={p}>
              <span style={strong}>How long you&apos;ll actually stay.</span> Jobs, relationships, and life change; the
              five-year plan becomes a two-year reality more often than people expect. <span style={strong}>Whether
              you&apos;d truly invest the difference.</span> Renting only wins if that $650 a month and the $80,000 down
              payment actually get invested — if they&apos;d be spent, the forced savings of a mortgage may serve you
              better. And <span style={strong}>the market</span> — appreciation is an assumption, not a promise; homes can
              stagnate or fall for a decade.
            </p>
            <p style={p}>
              There&apos;s also a side of this no spreadsheet captures: the <span style={strong}>stability and control</span>
              of owning — no landlord, no forced moves, paint it any color you like — versus the <span style={strong}>freedom</span>
              of renting to pick up and go. Those are real, and they&apos;re personal. The math tells you the price of each
              choice; it can&apos;t tell you how much the non-financial parts are worth to you.
            </p>
          </div>

          {/* Common mistakes */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Common mistakes</h2>
            <p style={p}>
              <span style={strong}>Comparing rent to just the mortgage payment.</span> The payment is only part of owning.
              Add tax, insurance, maintenance, and transaction costs before you decide — that&apos;s the comparison that
              tells the truth.
            </p>
            <p style={p}>
              <span style={strong}>Assuming you&apos;ll stay long-term.</span> Most people overestimate how long
              they&apos;ll keep a home. If there&apos;s a real chance you move within a few years, that alone can tip the
              answer toward renting.
            </p>
            <p style={p}>
              <span style={strong}>Buying at the edge of what you can afford.</span> Stretching to the top of your budget
              leaves nothing for the maintenance surprises and makes you house-poor. Check a comfortable price with the{" "}
              <a href="/home-affordability" style={inlineLink}>home affordability calculator</a> before you fall for a
              listing.
            </p>
            <p style={p}>
              <span style={strong}>Forgetting the down payment could be invested.</span> That $80,000 isn&apos;t free just
              because it&apos;s &quot;in the house.&quot; Counting its forgone growth is what makes the rent-vs-buy
              comparison honest.
            </p>
          </div>

          {/* Conditional recommendation */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={h2}>So — should you rent or buy?</h2>
            <p style={p}>
              <span style={strong}>Buy</span> if you&apos;re confident you&apos;ll stay <span style={strong}>past your
              break-even</span> — often five years or more — the full cost of owning fits comfortably in your budget with
              room for maintenance, and you value the stability of a place that&apos;s yours. Over a long horizon, that
              combination usually builds real wealth and beats renting.
            </p>
            <p style={p}>Lean toward <span style={strong}>renting</span> if any of these fits you:</p>
            <p style={p}>
              <span style={strong}>1. You might move within a few years.</span> The costs to buy and sell need time to pay
              off; a short stay usually favors renting, and renting keeps you free to go.
            </p>
            <p style={p}>
              <span style={strong}>2. The numbers favor renting-and-investing where you live.</span> In pricey markets the
              break-even can stretch to 8–10+ years. If renting is meaningfully cheaper and you&apos;ll invest the
              difference, that can build more wealth than buying.
            </p>
            <p style={p}>
              <span style={strong}>3. You&apos;re not ready for the carrying costs.</span> If the full monthly cost — plus a
              maintenance cushion — would leave you stretched or wipe out your emergency fund, you&apos;re not being left
              behind by renting. You&apos;re avoiding becoming house-poor.
            </p>
            <p style={p}>
              And if the non-financial side matters most to you — the stability of owning, or the freedom of renting — that&apos;s
              a legitimate reason to weight the decision, as long as you make the trade{" "}
              <span style={strong}>knowing the numbers</span>, not because someone told you rent is wasted money.
            </p>
          </div>

          {/* Disclaimer reinforcement */}
          <p
            style={{
              fontSize: 12, color: t.color.faint, lineHeight: 1.6, fontStyle: "italic",
              borderTop: `1px solid ${t.color.line}`, paddingTop: 20, margin: "8px 0 0",
            }}
          >
            This article is information to help you think through the decision — it isn&apos;t financial advice. freecalcs
            isn&apos;t your advisor, and the right choice depends on details only you know, including your local market,
            how long you&apos;ll stay, and your full financial picture. For a purchase this size, it&apos;s worth confirming
            the numbers with a qualified, fee-only financial professional.
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.color.ink, margin: "0 0 16px" }}>Frequently asked questions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((f) => (
              <div key={f.q} style={faqBox}>
                <p style={{ fontSize: 14, fontWeight: 700, color: t.color.ink, margin: "0 0 8px" }}>{f.q}</p>
                <p style={{ fontSize: 14, color: t.color.body, lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue planning */}
        <RelatedTools
          heading="Continue planning"
          tools={[
            { href: "/rent-vs-buy", label: "Rent vs Buy Calculator" },
            { href: "/home-affordability", label: "Home Affordability Calculator" },
            { href: "/mortgage", label: "Mortgage Calculator" },
            { href: "/down-payment", label: "Down Payment Calculator" },
          ]}
        />

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          <a
            href="/blog"
            style={{
              background: t.color.surface, color: t.color.brand, fontSize: 13, fontWeight: 600,
              padding: "10px 20px", borderRadius: t.radius.md, border: `1px solid ${t.color.line}`, textDecoration: "none",
            }}
          >
            ← All Articles
          </a>
        </div>
      </div>
    </div>
  );
}
