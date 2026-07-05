import type { Metadata } from "next";
import CalcCTA from "@/components/blog/CalcCTA";
import RelatedTools from "@/components/blog/RelatedTools";
import { tokens as t } from "@/lib/calculator/tokens";

const URL = "https://www.freecalcs.io/blog/pay-off-low-rate-mortgage-early";
const TITLE = "Should I Pay Off My 3% Mortgage Early?";
const DESCRIPTION =
  "A 3% mortgage is often worth keeping, not rushing to pay off. The real trade-off is a guaranteed ~3% and peace of mind versus a higher-but-uncertain return — with real numbers to help you judge your own case.";

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "freecalcs.io", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "Is it smart to pay off a 3% mortgage early?",
    a: "It's a genuine trade-off, not an obvious yes or no. Paying it off is a guaranteed ~3% return plus the peace of mind of being debt-free. Investing the same money has historically earned more (~7% on average) but with no guarantee and real ups and downs. At a rate as low as 3%, the guaranteed return is a low bar, so the math often leans toward keeping the mortgage — but the certainty and behavioral side are legitimate reasons some people pay it down anyway.",
  },
  {
    q: "Is paying off my mortgage a guaranteed return?",
    a: "Yes — every extra dollar of principal saves you the mortgage's interest rate on that dollar, guaranteed, for the life of the loan. On a 3% mortgage that's a guaranteed 3% return. It's genuinely risk-free, which is its appeal. The catch is that 3% is a low guaranteed return compared with what diversified investments have historically earned, and the money becomes locked in your home rather than staying liquid.",
  },
  {
    q: "Should I invest instead of paying off my mortgage?",
    a: "Often the expected-value math favors investing when your mortgage rate is as low as 3%, because stocks have historically returned more over long periods. But 'historically' and 'expected' aren't 'guaranteed' — markets can be flat or down for years. Investing only wins if you actually invest the money (not spend it), have a long horizon, and can stomach the volatility. If any of those isn't true for you, the guaranteed mortgage paydown may be the better real-world choice.",
  },
  {
    q: "What should I do before paying extra on my mortgage?",
    a: "Three things usually come first: pay off any higher-rate debt (a 22% credit card dwarfs a 3% mortgage), build an emergency fund (mortgage prepayments are hard to get back if you lose your job), and capture your full employer 401(k) match (an instant 50–100% return beats 3%). Only after those does extra mortgage principal versus investing become the real question.",
  },
  {
    q: "Can I split the difference?",
    a: "Yes, and many people do. You can put some extra toward principal and invest the rest, getting part of the guaranteed payoff and part of the higher expected return. It's the same hedge as splitting retirement contributions when you're unsure about future tax rates — a reasonable answer when the honest truth is that nobody can tell you which will win.",
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
            <span style={heroMeta}>8 min read</span>
            <span style={heroMeta}>Jul 5, 2026</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.3, color: t.color.onBrand }}>{TITLE}</h1>
          <p style={{ color: t.color.onBrandFaint, fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            A low-rate mortgage is often worth keeping, not rushing to kill. The real question isn&apos;t &quot;debt bad&quot; —
            it&apos;s a guaranteed 3% versus a higher-but-uncertain return.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: read, margin: "0 auto", padding: "40px 16px" }}>
        <div style={card}>
          {/* Your situation */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 17, color: t.color.body, lineHeight: 1.75, margin: "0 0 16px" }}>
              You locked in a mortgage at around 3%, and now you&apos;ve got some extra money each month. Part of you wants
              to throw it at the mortgage and be done with the debt. It feels responsible — and being debt-free sounds great.
            </p>
            <p style={p}>
              But a 3% mortgage is one of the cheapest loans you&apos;ll ever have, and rushing to pay it off isn&apos;t
              the obvious win it feels like. The honest answer is a real trade-off, and it depends on you. Let&apos;s walk
              through it with actual numbers so you can judge your own case.
            </p>
          </div>

          {/* Guaranteed vs expected */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Guaranteed vs. expected — the whole ballgame</h2>
            <p style={p}>
              Every extra dollar you put toward principal earns you a <span style={strong}>guaranteed</span> return equal to
              your mortgage rate. On a 3% loan, extra principal is a risk-free 3% — you can&apos;t lose it, and it&apos;s
              certain. That certainty is the real appeal of paying a mortgage down.
            </p>
            <p style={p}>
              The alternative is investing that same money. Over long periods a diversified stock portfolio has returned
              around 7% a year on average — <span style={strong}>more</span> than 3%, but <span style={strong}>uncertain</span>.
              That 7% is a historical average, not a promise; markets can be flat or down for years at a stretch. So the
              comparison isn&apos;t &quot;3% vs 7%.&quot; It&apos;s <span style={strong}>a guaranteed 3% versus a probably-higher
              return that comes with real risk</span> — and staying liquid instead of locking the money in your walls.
            </p>
          </div>

          {/* The math */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The math, with real numbers</h2>
            <p style={p}>
              Say you owe <span style={strong}>$300,000 at 3% on a 30-year mortgage</span> — that&apos;s a payment of about
              $1,265 a month, and roughly <span style={strong}>$155,000 in total interest</span> if you run the full term.
              Now add <span style={strong}>$200 a month</span> to principal.
            </p>
            <p style={p}>
              The guaranteed side: those extra payments clear the loan in about <span style={strong}>24 years instead of
              30</span> — six years early — and save you roughly <span style={strong}>$34,000 in interest</span>. That
              $34,000 is certain, and being mortgage-free six years sooner is worth something real.
            </p>
            <CalcCTA
              href="/loan-payoff"
              label="See your exact payoff savings"
              blurb="Enter your real balance, rate, and a monthly extra to see how many years you'd cut and how much interest you'd save — the same math as the example above, with your numbers."
              cta="Open the loan payoff calculator"
            />
            <p style={p}>
              Now the other side. That same <span style={strong}>$200 a month invested at 7%</span> could grow to about
              <span style={strong}> $149,000</span> over those 24 years — and closer to <span style={strong}>$244,000</span>{" "}
              if you kept investing it across the full 30. On paper that dwarfs the $34,000 in interest saved. You can see how
              the growth compounds with the{" "}
              <a href="/compound-interest" style={inlineLink}>compound interest calculator</a>.
            </p>
            <p style={p}>
              So why isn&apos;t investing the obvious answer? Because the $34,000 is <span style={strong}>guaranteed</span>{" "}
              and the $149,000 is <span style={strong}>an expectation</span>, not a promise. Over a 24-year window a 7%
              average is reasonable — but it could be 4%, and it won&apos;t be a smooth line. You&apos;re trading certainty
              for a bigger, riskier maybe.
            </p>
          </div>

          {/* The honest tension */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The honest part nobody can settle for you</h2>
            <p style={p}>
              Here&apos;s the truth: <span style={strong}>no one can tell you for certain which wins</span>, because it
              depends on returns nobody can predict and on how you&apos;re wired. In pure expected-value terms, a 3%
              mortgage is a low hurdle, and investing usually comes out ahead over long horizons. But expected value
              isn&apos;t the whole story.
            </p>
            <p style={p}>
              Being debt-free has a value that doesn&apos;t show up in a spreadsheet — lower fixed costs, less to worry
              about if your income wobbles, and for many people, genuinely better sleep. If a guaranteed, certain outcome
              and a paid-off house are worth more to you than a probably-larger-but-uncertain balance, that&apos;s a
              legitimate choice, not a math error. The reverse is equally legitimate. This is a values question wearing a
              math costume.
            </p>
          </div>

          {/* Common mistakes */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Mistakes that make this an easy call — in the wrong direction</h2>
            <p style={p}>
              <span style={strong}>Paying extra on the mortgage while carrying higher-rate debt.</span> A 22% credit card
              makes a 3% mortgage irrelevant — paying that card off is a guaranteed 22% return. Clear high-rate debt first,
              always, before a dollar of extra mortgage principal.
            </p>
            <p style={p}>
              <span style={strong}>Prepaying with no emergency fund.</span> Money you send to your mortgage is locked in
              your home — you can&apos;t easily get it back if you lose your job or face a big bill. Build three to six
              months of expenses in accessible savings before you tie money up in principal.
            </p>
            <p style={p}>
              <span style={strong}>Skipping the 401(k) match to do it.</span> An employer match is an instant 50–100%
              return. Passing that up to earn a guaranteed 3% is a bad trade — capture the full match first.
            </p>
            <p style={p}>
              <span style={strong}>Assuming you&apos;ll invest the difference when you&apos;d actually spend it.</span> The
              case for investing only holds if the money truly gets invested. If, honestly, that $200 would drift into
              everyday spending, then forced mortgage paydown may leave you better off than an investment plan you
              won&apos;t stick to. Know yourself.
            </p>
          </div>

          {/* Conditional recommendation */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={h2}>So — should you pay it off early?</h2>
            <p style={p}>
              For most people with a 3% mortgage who have already cleared high-rate debt, built an emergency fund, and
              captured their match, the math <span style={strong}>leans toward keeping the mortgage and investing the
              extra</span> — a guaranteed 3% is a low bar, and a long-horizon investor has usually done better while staying
              liquid. But that&apos;s an expectation, not a guarantee, and the math isn&apos;t the whole story.
            </p>
            <p style={p}>Lean toward paying it off early instead if any of these fits you:</p>
            <p style={p}>
              <span style={strong}>1. The certainty is worth more to you than a probable extra return.</span> If being
              debt-free would genuinely improve your life and let you sleep, a guaranteed outcome has real value — take it.
            </p>
            <p style={p}>
              <span style={strong}>2. You&apos;re near retirement or your income is unstable.</span> Reducing a big fixed
              payment lowers your real risk when a market downturn or a job loss would hurt most. Certainty is worth more
              the less margin you have.
            </p>
            <p style={p}>
              <span style={strong}>3. You know you wouldn&apos;t actually invest the difference.</span> If the honest
              alternative is spending it, the mortgage paydown is the better real-world result — a plan you&apos;ll follow
              beats a better one you won&apos;t.
            </p>
            <p style={p}>
              And if you&apos;re torn — which is honest — <span style={strong}>split it</span>. Put some extra toward
              principal and invest the rest. You get part of the guaranteed payoff and part of the higher expected return,
              and you don&apos;t have to bet everything on a future nobody can see.
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
            isn&apos;t your advisor, and the right answer depends on details only you know, including your full financial
            picture and your comfort with risk. For a decision that plays out over decades, it&apos;s worth confirming with
            a qualified, fee-only financial professional.
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
            { href: "/loan-payoff", label: "Loan Payoff Calculator" },
            { href: "/refinance", label: "Refinance Calculator" },
            { href: "/compound-interest", label: "Compound Interest Calculator" },
            { href: "/retirement", label: "Retirement Calculator" },
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
