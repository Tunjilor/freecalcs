import type { Metadata } from "next";
import CalcCTA from "@/components/blog/CalcCTA";
import RelatedTools from "@/components/blog/RelatedTools";
import { tokens as t } from "@/lib/calculator/tokens";

const URL = "https://www.freecalcs.io/blog/should-i-refinance-to-save-200-a-month";
const TITLE = "Should I Refinance to Save $200 a Month?";
const DESCRIPTION =
  "A lower monthly payment sounds like free money — but closing costs create a break-even, and a fresh 30-year term can quietly raise your total interest even at a lower rate. Here's how to tell if it's really a win.";

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "freecalcs.io", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "Is refinancing to lower my payment worth it?",
    a: "It can be — but a lower payment isn't automatically a win. Refinancing has closing costs (often $3,000–$6,000), so you only come out ahead if you stay in the home past the break-even point. And a lower payment sometimes comes from re-stretching the loan to a fresh 30 years, which can raise your total interest even at a lower rate. It's worth it when you'll stay past break-even and the lifetime math still works in your favor.",
  },
  {
    q: "What is the break-even point on a refinance?",
    a: "It's how many months of payment savings it takes to recoup your closing costs. If you save $200 a month and the refinance costs $5,000, your break-even is about 25 months — a little over two years. Stay past that and the savings are real; sell or refinance again before it, and you've lost money on the deal. It's the first number to check.",
  },
  {
    q: "Does refinancing reset my loan term?",
    a: "Usually yes, unless you choose otherwise. A standard refinance into a new 30-year loan restarts the clock — so if you were five years into your old mortgage, you're back to 30 years. Part of your 'savings' is just spreading the balance over more years. You can avoid this by refinancing into a shorter term (like a 20- or 25-year) or by keeping your old payment amount on the new lower-rate loan.",
  },
  {
    q: "Should I roll closing costs into the loan?",
    a: "It avoids paying out of pocket, but you then borrow those costs and pay interest on them for years, which raises the true cost of the refinance. A 'no-cost' refinance usually just hides the costs in a higher rate or a bigger balance. Rolling costs in can still make sense if you'll stay long enough, but include them in your break-even math rather than pretending they're free.",
  },
  {
    q: "How long should I plan to stay to make refinancing worth it?",
    a: "At least past your break-even point, and ideally well past it. If your break-even is two years and you're confident you'll stay five or more, the case is strong. If there's a real chance you'll move, change jobs, or refinance again within a couple of years, the closing costs may never pay off. Since you can't predict the future perfectly, give yourself a comfortable margin.",
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
            A $200-a-month cut sounds like free money. It isn&apos;t — and a lower payment isn&apos;t the same thing as a
            cheaper loan. Two numbers tell you whether it&apos;s really a win.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: read, margin: "0 auto", padding: "40px 16px" }}>
        <div style={card}>
          {/* Your situation */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 17, color: t.color.body, lineHeight: 1.75, margin: "0 0 16px" }}>
              A lender calls, or an ad pops up: refinance and cut your mortgage payment by $200 a month. Two hundred
              dollars back in your pocket every month, for basically doing paperwork — it&apos;s hard not to say yes on the
              spot.
            </p>
            <p style={p}>
              Sometimes it&apos;s a genuinely good move. But &quot;lower payment&quot; is the most misleading number in
              mortgages, because it can hide two things a lender has no reason to highlight. Let&apos;s walk through them
              with real numbers, so you can tell whether that $200 is a win or a mirage.
            </p>
          </div>

          {/* Where the savings come from */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Where the $200 actually comes from</h2>
            <p style={p}>
              A lower payment comes from one or both of two things: a <span style={strong}>lower interest rate</span>, or a
              <span style={strong}> longer term</span> that spreads the balance over more years. Those are very different.
              A lower rate genuinely saves you money. A longer term just rearranges it — and often costs you more overall.
            </p>
            <p style={p}>
              And either way, refinancing <span style={strong}>isn&apos;t free</span>. It comes with closing costs —
              appraisal, origination, title, and more — usually <span style={strong}>$3,000 to $6,000</span>. That single
              fact is what turns &quot;save $200 a month&quot; from an obvious yes into a real calculation.
            </p>
          </div>

          {/* Truth 1: break-even */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Truth #1: the break-even</h2>
            <p style={p}>
              Because you pay those costs up front, the savings have to <span style={strong}>earn them back</span> before
              you come out ahead. That&apos;s your break-even: closing costs divided by monthly savings.
            </p>
            <p style={p}>
              Save <span style={strong}>$200 a month</span> on a refinance that costs <span style={strong}>$5,000</span>,
              and your break-even is <span style={strong}>about 25 months</span> — a little over two years. Stay past that
              and the savings are real. But if you sell, move, or refinance again <span style={strong}>before</span> then,
              you never recouped the costs — you actually <span style={strong}>lost money</span> on the deal, no matter how
              nice the lower payment felt.
            </p>
            <CalcCTA
              href="/refinance"
              label="Find your break-even and lifetime cost"
              blurb="Enter your current loan and the new rate, term, and closing costs to see your real break-even month and how the total interest compares — the two numbers that decide this."
              cta="Open the refinance calculator"
            />
          </div>

          {/* Truth 2: the term reset trap */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Truth #2: the term-reset trap</h2>
            <p style={p}>
              This is the one most people miss. Say you took a <span style={strong}>$300,000 mortgage at 6.5%</span> and
              you&apos;re five years in — your payment is about <span style={strong}>$1,900</span>, you owe roughly
              <span style={strong}> $280,000</span>, and you have 25 years left. A lender offers to refinance that balance
              into a fresh <span style={strong}>30-year loan at 6.0%</span>. Your payment drops to about
              <span style={strong}> $1,685</span> — a tidy <span style={strong}>$210 a month</span> less.
            </p>
            <p style={p}>
              Here&apos;s the catch. Finishing your <span style={strong}>old</span> loan would cost you about
              <span style={strong}> $288,000</span> in remaining interest. The <span style={strong}>new</span> 30-year loan
              — even at the lower 6.0% rate — costs about <span style={strong}>$325,000</span> in interest. That&apos;s
              roughly <span style={strong}>$37,000 MORE</span>, despite the lower rate, because you just re-stretched 25
              years of loan back out to 30. The lower payment didn&apos;t save you money; it <span style={strong}>hid a
              higher lifetime cost</span> behind a smaller number.
            </p>
          </div>

          {/* The fix */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The fix: capture the rate, skip the stretch</h2>
            <p style={p}>
              The good news is that the lower rate is still worth having — you just have to avoid re-stretching the term.
              Two clean ways to do it:
            </p>
            <p style={p}>
              <span style={strong}>Refinance into a shorter term.</span> Take the 6.0% rate on a{" "}
              <span style={strong}>25-year</span> loan instead of 30. The payment is about $1,809 — still a bit lower than
              your old $1,900 — but total interest drops to about <span style={strong}>$262,000</span>, saving roughly
              <span style={strong}> $26,000</span> versus your old loan.
            </p>
            <p style={p}>
              <span style={strong}>Or keep paying your old amount.</span> Take the new lower rate, but keep sending about
              $1,900 a month instead of the new $1,685. That extra $210 goes straight to principal — you&apos;d pay the loan
              off in about <span style={strong}>22.6 years</span> (sooner than the 25 you had left) and save around
              <span style={strong}> $56,000</span> in interest. This is the strongest version of the move; the{" "}
              <a href="/loan-payoff" style={inlineLink}>loan payoff calculator</a> shows exactly what keeping the old
              payment does.
            </p>
          </div>

          {/* The honest tension */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The honest part</h2>
            <p style={p}>
              Two things can&apos;t be settled by a formula. First, your break-even depends on{" "}
              <span style={strong}>how long you&apos;ll stay</span> — and nobody knows that for certain. A job change, a
              growing family, or a move can arrive before the savings catch up to the costs. Second, and more subtly:
              <span style={strong}> &quot;lower payment&quot; and &quot;cheaper loan&quot; are not the same thing.</span> A
              refinance can do either, both, or neither, and the monthly number alone won&apos;t tell you which.
            </p>
            <p style={p}>
              That&apos;s the whole reason to run the two numbers — break-even and lifetime interest — instead of trusting
              the payment. A lower payment you&apos;ll keep for a decade at a lower rate is a real win. A lower payment
              you&apos;ll abandon in 18 months, or one that quietly adds five years of interest, is not.
            </p>
          </div>

          {/* Common mistakes */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Common mistakes</h2>
            <p style={p}>
              <span style={strong}>Chasing the monthly payment and ignoring the break-even.</span> If you might move before
              you recoup the closing costs, a lower payment is a loss dressed up as a win. Always check how many months it
              takes to earn the costs back.
            </p>
            <p style={p}>
              <span style={strong}>Not noticing the term reset.</span> A fresh 30-year loan can raise your total interest
              even at a lower rate. Compare lifetime interest, not just the payment — and refinance to a shorter or matching
              term when you can.
            </p>
            <p style={p}>
              <span style={strong}>Rolling closing costs into the loan and calling it &quot;no-cost.&quot;</span> Those
              costs don&apos;t vanish — you borrow them and pay interest on them for years. Include them in your break-even
              instead of pretending they&apos;re free.
            </p>
            <p style={p}>
              <span style={strong}>Refinancing again and again.</span> Each refinance resets the clock and stacks new
              closing costs. Serial refinancing to chase a lower payment can keep you perpetually early in an
              interest-heavy schedule, never really building equity.
            </p>
          </div>

          {/* Conditional recommendation */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={h2}>So — should you refinance?</h2>
            <p style={p}>
              Refinance if <span style={strong}>both</span> things are true: you&apos;re confident you&apos;ll stay in the
              home <span style={strong}>well past your break-even</span>, and the lifetime math still works — meaning you
              take the lower rate <span style={strong}>without</span> re-stretching the term, by choosing a shorter term or
              keeping your old payment. That combination is a genuine, money-saving win.
            </p>
            <p style={p}>Hold off, or think harder, if any of these fits you:</p>
            <p style={p}>
              <span style={strong}>1. You might move or sell within a couple of years.</span> If there&apos;s a real chance
              you&apos;ll leave before break-even, the closing costs likely won&apos;t pay off — a lower payment you keep
              only briefly is a net loss.
            </p>
            <p style={p}>
              <span style={strong}>2. The only way it lowers the payment is by re-stretching to a fresh 30 years.</span> If
              the &quot;savings&quot; come from adding years rather than a lower rate, you may pay more over the life of the
              loan. That&apos;s a cash-flow choice, not a savings one — fine if you truly need the lower payment, but know
              which it is.
            </p>
            <p style={p}>
              <span style={strong}>3. You&apos;d roll in the costs and haven&apos;t checked the real break-even.</span> A
              &quot;no-cost&quot; refinance still has costs. Run the actual numbers before you sign — if the break-even is
              longer than you&apos;ll stay, it&apos;s not the deal it looks like.
            </p>
            <p style={p}>
              And if the payment relief is what you truly need right now — that&apos;s a legitimate reason to refinance, even
              at a higher lifetime cost. Just make that trade <span style={strong}>on purpose</span>, with the break-even
              and lifetime numbers in front of you, rather than because a lower payment sounded like free money.
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
            isn&apos;t your advisor, and the right move depends on details only you know, including your exact loan, closing
            costs, and how long you&apos;ll stay. Rates and fees vary by lender; confirm the specific numbers with a
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
            { href: "/refinance", label: "Refinance Calculator" },
            { href: "/loan-payoff", label: "Loan Payoff Calculator" },
            { href: "/mortgage", label: "Mortgage Calculator" },
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
