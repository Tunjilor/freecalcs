import type { Metadata } from "next";
import CalcCTA from "@/components/blog/CalcCTA";
import RelatedTools from "@/components/blog/RelatedTools";
import { tokens as t } from "@/lib/calculator/tokens";

const URL = "https://www.freecalcs.io/blog/15-year-vs-30-year-mortgage";
const TITLE = "15-Year vs 30-Year Mortgage: Which Should You Actually Choose?";
const DESCRIPTION =
  "The 15-year has a lower rate and far less total interest — but its higher payment is both its strength and its risk. And a 30-year paid like a 15 captures most of the savings while keeping your flexibility.";

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "freecalcs.io", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "Is a 15-year mortgage always cheaper than a 30-year?",
    a: "On total cost, almost always yes — the 15-year carries a lower interest rate and, because you pay for half as long, dramatically less total interest. On a $300,000 loan the difference can be well over $200,000. But 'cheaper overall' isn't the whole question: the 15-year's monthly payment is much higher, and that higher required payment carries real cash-flow risk that the total-interest number doesn't show.",
  },
  {
    q: "Can I just take a 30-year and pay it off in 15?",
    a: "Yes, and it's a popular middle path. Take the 30-year and voluntarily pay the amount a 15-year would require; you'll pay it off in roughly 16 years and save most of the interest — while keeping the option to drop back to the lower required payment in a tight month. The catch is that you're stuck at the 30-year's higher rate, so you won't quite match a true 15-year's savings. You trade a little money for a lot of flexibility.",
  },
  {
    q: "What's the downside of a 15-year mortgage?",
    a: "The high required payment. It's the source of the savings, but it also means less monthly flexibility, less room if your income drops, and less cash free for investing, emergencies, or other goals. If the payment is a stretch, a rough patch that would be survivable on a 30-year can become a missed payment on a 15-year. The 15 rewards stable, comfortable cash flow and punishes a tight budget.",
  },
  {
    q: "Should I get a 15-year mortgage or invest the difference?",
    a: "It depends on whether you'd actually invest it. A 15-year is a guaranteed return equal to its rate, plus forced discipline. Taking a 30-year and investing the payment difference can beat that if markets cooperate and — crucially — if you truly invest the money rather than spend it. If the difference would quietly disappear into everyday spending, the 15-year's forced savings likely serves you better. Be honest about your own behavior.",
  },
  {
    q: "How much higher is a 15-year payment?",
    a: "Substantially. On a $300,000 loan, a 15-year around 5.75% runs about $2,491 a month, versus roughly $1,896 for a 30-year around 6.5% — nearly $600 more each month, even though the 15-year's rate is lower. That payment gap is exactly why the decision is about cash flow and flexibility, not just which loan has the smaller total.",
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
            The 15-year is cheaper on paper — but its higher payment is both the strength and the risk. And there&apos;s a
            hybrid most people never consider.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: read, margin: "0 auto", padding: "40px 16px" }}>
        <div style={card}>
          {/* Your situation */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 17, color: t.color.body, lineHeight: 1.75, margin: "0 0 16px" }}>
              You&apos;re staring at two boxes on a rate sheet: a 15-year mortgage and a 30-year. Everyone tells you the
              15-year is the responsible, cheaper choice — but the monthly payment on it is a lot higher, and that number
              makes you nervous.
            </p>
            <p style={p}>
              Both instincts are right, which is why this is a genuine decision and not an obvious one. The 15-year really
              is cheaper overall. The higher payment really is a risk. The honest answer isn&apos;t &quot;pick the
              15&quot; — it&apos;s understanding the trade-off, and knowing there&apos;s a third option that splits the
              difference.
            </p>
          </div>

          {/* What each gives you */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>What each one actually gives you</h2>
            <p style={p}>
              The <span style={strong}>15-year</span> comes with a lower interest rate, far less total interest, and much
              faster equity — you own the home outright in half the time. The price of all that is a
              <span style={strong}> much higher required monthly payment.</span>
            </p>
            <p style={p}>
              The <span style={strong}>30-year</span> flips it: a <span style={strong}>lower, more comfortable payment</span>
              and more monthly flexibility, at the cost of more total interest and slower equity. Neither is &quot;the
              smart one&quot; in the abstract — they&apos;re optimized for different things. The 15 optimizes for total cost
              and speed; the 30 optimizes for cash-flow breathing room.
            </p>
          </div>

          {/* The math */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The math, with real numbers</h2>
            <p style={p}>
              Take a <span style={strong}>$300,000 loan</span>. A 15-year around 5.75% runs about
              <span style={strong}> $2,491 a month</span> and costs roughly <span style={strong}>$148,000 in total
              interest</span>. A 30-year around 6.5% runs about <span style={strong}>$1,896 a month</span> — nearly
              <span style={strong}> $600 less</span> — but costs about <span style={strong}>$383,000 in interest</span>.
            </p>
            <p style={p}>
              So on paper the 15-year is dramatically cheaper: it saves you around <span style={strong}>$234,000 in
              interest</span> over the life of the loan. That&apos;s a real, enormous number — and it&apos;s why &quot;the
              15 is cheaper&quot; is completely true. The question the total doesn&apos;t answer is whether you can
              comfortably carry that extra $600 every single month for 15 years, no matter what life does.
            </p>
            <CalcCTA
              href="/mortgage"
              label="Compare both loans side by side"
              blurb="Enter your loan amount and both rates and terms to see the two payments and total-interest figures next to each other — the comparison that makes the trade-off concrete for your numbers."
              cta="Open the mortgage calculator"
            />
          </div>

          {/* The hybrid */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The option most people miss: a 30 paid like a 15</h2>
            <p style={p}>
              Here&apos;s the move that splits the difference. Take the <span style={strong}>30-year</span>, but
              voluntarily pay the <span style={strong}>15-year amount</span> — about $2,491 instead of the required $1,896.
              That extra $595 goes straight to principal. You&apos;d pay the loan off in roughly
              <span style={strong}> 16 years</span> and cut total interest to about <span style={strong}>$187,000</span> —
              saving around <span style={strong}>$195,000</span> versus the vanilla 30-year.
            </p>
            <p style={p}>
              The magic is the <span style={strong}>flexibility</span>: because your <span style={strong}>required</span>
              payment is still only $1,896, a bad month, a job change, or a big surprise lets you drop back to the lower
              amount without penalty — something a true 15-year contract never allows. The{" "}
              <a href="/loan-payoff" style={inlineLink}>loan payoff calculator</a> shows exactly how paying the higher
              amount on a 30-year plays out.
            </p>
            <p style={p}>
              The honest catch: the hybrid doesn&apos;t <span style={strong}>fully</span> match a true 15-year, because
              you&apos;re stuck at the 30-year&apos;s higher rate (6.5% vs 5.75%). That rate gap costs you roughly $39,000
              more than the real 15 would. So the hybrid buys flexibility for a real, but modest, price — you give up a
              little of the savings to keep your escape hatch.
            </p>
          </div>

          {/* The honest tension */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The honest part</h2>
            <p style={p}>
              The 15-year&apos;s high payment is, at the same time, its greatest strength and its biggest risk. As a
              <span style={strong}> strength</span>, it forces discipline most people can&apos;t muster on their own, saves
              a fortune in interest, and builds equity fast. As a <span style={strong}>risk</span>, it removes your monthly
              flexibility and cushion — the very thing you might need when income drops.
            </p>
            <p style={p}>
              Which side wins depends on three honest questions. <span style={strong}>How stable is your income?</span> A
              secure, comfortable budget can absorb the higher payment; a tight or variable one can&apos;t safely.
              <span style={strong}> Would you actually invest or use the difference well?</span> The 30-year&apos;s lower
              payment only wins if that ~$600 goes somewhere productive rather than evaporating into spending. And
              <span style={strong}> how much do you value guaranteed savings versus flexibility?</span> The 15 hands you
              certainty; the 30 hands you options. Both are legitimate things to want.
            </p>
          </div>

          {/* Common mistakes */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Common mistakes</h2>
            <p style={p}>
              <span style={strong}>Stretching into a 15-year payment with no cushion.</span> The interest savings mean
              nothing if the payment leaves you one setback from disaster. A 15-year is for when the higher payment fits
              comfortably with an emergency fund still intact — not when it&apos;s a stretch.
            </p>
            <p style={p}>
              <span style={strong}>Choosing the 30 &quot;for flexibility,&quot; then wasting it.</span> Taking the
              30-year for the lower payment and then neither paying extra nor investing the difference is the worst of both
              worlds — you get the higher total interest and no benefit from the flexibility. If you pick the 30, have a
              plan for the difference.
            </p>
            <p style={p}>
              <span style={strong}>Underrating the value of forced savings.</span> The 15-year&apos;s discipline is
              valuable precisely <span style={strong}>because</span> most people won&apos;t voluntarily pay extra on a
              30-year, year after year. Be honest about whether you&apos;re actually the type who will — if not, the 15&apos;s
              &quot;you must&quot; may serve you better than the 30&apos;s &quot;you could.&quot;
            </p>
            <p style={p}>
              <span style={strong}>Fixating on the rate gap alone.</span> A lower rate is nice, but the real decision is
              about the payment: whether you can carry it safely for the whole term. Don&apos;t let a half-point rate
              difference talk you into a payment your budget can&apos;t reliably handle.
            </p>
          </div>

          {/* Conditional recommendation */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={h2}>So — which should you choose?</h2>
            <p style={p}>
              <span style={strong}>Choose the 15-year</span> if the higher payment fits comfortably in your budget with a
              cushion to spare, your income is stable, and you value the guaranteed interest savings and the discipline of
              being forced to build equity fast. For a secure earner who wants certainty, the 15 is a powerful, wealth-
              building choice — and the lower rate makes it genuinely cheaper.
            </p>
            <p style={p}>Lean toward the <span style={strong}>30-year</span> — ideally paid like a 15 — if any of these fits:</p>
            <p style={p}>
              <span style={strong}>1. You want flexibility or your income varies.</span> The lower required payment is
              insurance against a bad month. Pay extra when you can, drop back when you must — the hybrid gives you most of
              the savings without the rigid commitment.
            </p>
            <p style={p}>
              <span style={strong}>2. You&apos;d genuinely put the difference to better use.</span> If that ~$600 would go
              toward a full employer match, high-interest debt, or investments you&apos;ll actually fund, the 30-year&apos;s
              lower payment can be the smarter allocation — as long as you truly do it.
            </p>
            <p style={p}>
              <span style={strong}>3. The 15-year payment is a stretch.</span> If it would leave you house-poor or wipe
              out your emergency fund, the 30-year isn&apos;t the lazy choice — it&apos;s the safe one. Take it, and pay
              extra toward the 15-year pace in the months you comfortably can.
            </p>
            <p style={p}>
              For a lot of people, that hybrid — <span style={strong}>a 30-year mortgage paid like a 15 whenever
              possible</span> — is the honest sweet spot: most of the savings, with an escape hatch you&apos;ll be grateful
              for if life throws a hard month at you.
            </p>
          </div>

          {/* Disclaimer reinforcement */}
          <p
            style={{
              fontSize: 12, color: t.color.faint, lineHeight: 1.6, fontStyle: "italic",
              borderTop: `1px solid ${t.color.line}`, paddingTop: 20, margin: "8px 0 0",
            }}
          >
            This article is information to help you think through the trade-off — it isn&apos;t financial advice. freecalcs
            isn&apos;t your advisor, and the right term depends on details only you know, including your income stability,
            budget, and goals. Rates are illustrative and vary by lender and market; confirm the specific numbers with a
            licensed loan officer before you commit.
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
            { href: "/mortgage", label: "Mortgage Calculator" },
            { href: "/loan-payoff", label: "Loan Payoff Calculator" },
            { href: "/refinance", label: "Refinance Calculator" },
            { href: "/home-affordability", label: "Home Affordability Calculator" },
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
