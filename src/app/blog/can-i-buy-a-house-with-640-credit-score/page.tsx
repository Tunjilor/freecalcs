import type { Metadata } from "next";
import CalcCTA from "@/components/blog/CalcCTA";
import RelatedTools from "@/components/blog/RelatedTools";
import { tokens as t } from "@/lib/calculator/tokens";

const URL = "https://www.freecalcs.io/blog/can-i-buy-a-house-with-640-credit-score";
const TITLE = "My Credit Score Is 640. Can I Buy a House?";
const DESCRIPTION =
  "Yes — 640 is above the FHA floor and works for many conventional loans. The real question isn't whether you can qualify, but what a fair score costs you in rate, and whether waiting to raise it is worth it.";

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "freecalcs.io", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "Can I get a mortgage with a 640 credit score?",
    a: "Yes. 640 is a 'fair' score that clears the FHA minimum (580 for 3.5% down) and typically meets conventional loan requirements (usually around 620+). VA and USDA loans also commonly work at 640. You're not locked out — a 640 mainly affects the interest rate you're offered, not a hard yes-or-no on approval.",
  },
  {
    q: "What credit score do I actually need to buy a house?",
    a: "It depends on the loan. FHA allows 580 with 3.5% down (or 500–579 with 10% down), most conventional loans start around 620, and VA/USDA lenders often look for about 620–640. There's no universal cutoff at 700 or 740 — those higher scores just earn lower rates. At 640 you can qualify for several programs; the question is cost, not eligibility.",
  },
  {
    q: "How much does a lower credit score cost me?",
    a: "It shows up in your interest rate, and over 30 years that adds up. As an illustration, on a $300,000 loan a rate about 0.75% higher (say 7.0% vs 6.25%) raises the payment by roughly $150 a month and costs around $54,000 more in total interest over the life of the loan. Actual spreads move with the market, but the direction is always the same: a higher score buys a lower rate.",
  },
  {
    q: "Should I wait to raise my score before buying?",
    a: "It's a real trade-off. Waiting a few months to move from 640 into a higher tier can meaningfully cut your rate — worth it if you're close to a threshold and your fixes are simple (paying down card balances, correcting errors). But waiting means renting while prices and base rates move in ways nobody can predict, and you can refinance later if your score improves. There's no universally right answer; it depends on your situation.",
  },
  {
    q: "Will opening a new credit card hurt my mortgage application?",
    a: "It can. A new account adds a hard inquiry, lowers your average account age, and raises your reported balances — all of which can ding your score right when lenders are looking. Avoid opening new credit (cards, car loans, financing) from a few months before you apply until after you close. Keep your credit picture stable during the process.",
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
            Short answer: yes, you can. The homeownership door isn&apos;t closed at 640 — but let&apos;s be honest about
            what a fair score costs you, and whether waiting to raise it is worth it.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: read, margin: "0 auto", padding: "40px 16px" }}>
        <div style={card}>
          {/* Your situation */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 17, color: t.color.body, lineHeight: 1.75, margin: "0 0 16px" }}>
              You&apos;ve got a 640 credit score, you&apos;re thinking about buying a house, and somewhere you picked up the
              idea that you need a 700 or 740 to even be considered. So you&apos;re wondering if the door is closed before
              you&apos;ve started.
            </p>
            <p style={p}>
              It isn&apos;t. <span style={strong}>You can buy a house with a 640 score</span> — that&apos;s not wishful
              thinking, it&apos;s how the loan programs actually work. But the honest version of the answer isn&apos;t just
              &quot;yes.&quot; It&apos;s &quot;yes, and here&apos;s what it&apos;ll cost, and here&apos;s how to decide
              whether to buy now or wait.&quot;
            </p>
          </div>

          {/* Where 640 sits */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Where a 640 score actually sits</h2>
            <p style={p}>
              640 is considered a <span style={strong}>&quot;fair&quot;</span> score, and it clears the bar for the major
              loan programs. <span style={strong}>FHA</span> loans allow scores as low as 580 with 3.5% down — so at 640
              you&apos;re comfortably above the floor. Most <span style={strong}>conventional</span> loans start around 620,
              and VA and USDA lenders commonly work in this range too. You&apos;re eligible for several paths, not none.
            </p>
            <p style={p}>
              Here&apos;s the key thing most people get wrong: your score mostly sets your <span style={strong}>interest
              rate</span>, not a hard yes-or-no. And it&apos;s only <span style={strong}>one of three levers</span> lenders
              look at. The other two are your <span style={strong}>debt-to-income ratio</span> (how much of your income is
              already spoken for) and your <span style={strong}>down payment</span>. A strong showing on those can offset a
              fair score — which is why checking{" "}
              <a href="/qualify" style={inlineLink}>which loan programs you fit</a> matters more than fixating on the number
              alone.
            </p>
          </div>

          {/* The real question - cost */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The real question: what it costs you</h2>
            <p style={p}>
              Since 640 mainly affects your rate, the honest question isn&apos;t &quot;can I qualify?&quot; — it&apos;s
              &quot;what does a fair-credit rate cost me over time?&quot; A higher score buys a lower rate, and on a 30-year
              loan that gap is real money.
            </p>
            <p style={p}>
              Take a <span style={strong}>$300,000 loan</span> as an illustration. Suppose a 640 score gets you around
              <span style={strong}> 7.0%</span> while a 740 would get about <span style={strong}>6.25%</span> — a
              three-quarter-point difference. That&apos;s roughly <span style={strong}>$1,996 a month versus $1,847</span> —
              about <span style={strong}>$150 more each month</span>, and close to <span style={strong}>$54,000 more in
              total interest</span> over the full 30 years. (Rates move constantly, so treat the exact spread as
              illustrative — but a higher score always points the same direction.)
            </p>
            <CalcCTA
              href="/home-affordability"
              label="See what you can actually afford"
              blurb="Enter your income, debts, and down payment to see a realistic price range and monthly payment — the honest picture before you fall for a house at the top of your budget."
              cta="Open the home affordability calculator"
            />
            <p style={p}>
              Your <span style={strong}>down payment</span> is the other big lever you control right now. A larger one
              shrinks the loan, can remove or reduce mortgage insurance, and sometimes nudges your rate down — see how the
              targets work with the <a href="/down-payment" style={inlineLink}>down payment calculator</a>.
            </p>
          </div>

          {/* The honest tradeoff */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Buy now, or wait to raise your score?</h2>
            <p style={p}>
              This is the actual decision, and it&apos;s a genuine trade-off. <span style={strong}>Buy now</span> and
              you&apos;re building equity instead of paying rent — but you&apos;re locking in a fair-credit rate and the
              higher payment that comes with it. <span style={strong}>Wait six to twelve months</span> to move into a
              higher score tier, and you could shave real money off that rate — but you&apos;re renting in the meantime, and
              home prices and base rates might rise or fall while you do.
            </p>
            <p style={p}>
              Two honest points cut against over-thinking it. First, <span style={strong}>nobody can predict</span> where
              rates or prices go next — waiting for a better rate on your score can be undone by the whole market moving.
              Second, the rate you take today isn&apos;t necessarily forever: if your score climbs and rates fall, you can
              <span style={strong}> refinance</span> later. That&apos;s not free and it&apos;s not guaranteed, but it means
              buying at 640 isn&apos;t a 30-year sentence at today&apos;s rate. The choice is real, but it isn&apos;t
              all-or-nothing.
            </p>
          </div>

          {/* Common mistakes */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Common mistakes at this score</h2>
            <p style={p}>
              <span style={strong}>Assuming you&apos;re locked out and never checking.</span> Plenty of people at 640 talk
              themselves out of even getting pre-approved. Don&apos;t guess — a pre-approval costs little and tells you your
              real number and rate instead of a rumor.
            </p>
            <p style={p}>
              <span style={strong}>Only talking to one lender.</span> Lenders weigh a 640 differently and price it
              differently. Getting quotes from several within a short window (it counts as a single inquiry for scoring) can
              swing your rate more than a small score bump would.
            </p>
            <p style={p}>
              <span style={strong}>Draining your savings for the down payment.</span> Emptying your accounts to put more
              down — and leaving nothing for emergencies — trades one risk for a bigger one. A new home comes with surprise
              costs; keep a cushion so a broken furnace doesn&apos;t become a missed payment.
            </p>
            <p style={p}>
              <span style={strong}>Opening new credit right before applying.</span> A new card or car loan in the months
              before you apply can drop your score and inflate your debt-to-income ratio at the worst possible moment. Keep
              your credit stable from a few months out until you close.
            </p>
          </div>

          {/* Conditional recommendation */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={h2}>So — should you buy now?</h2>
            <p style={p}>
              For most people at 640 with <span style={strong}>steady income, manageable debt, and enough saved for both a
              down payment and an emergency fund</span>, buying now is often reasonable. You start building equity, you can
              refinance if your score and rates improve, and you&apos;re not betting on an unpredictable market by waiting.
            </p>
            <p style={p}>But lean toward waiting and raising your score first if any of these fits you:</p>
            <p style={p}>
              <span style={strong}>1. You&apos;re close to a threshold with simple fixes.</span> If paying down a couple of
              card balances or correcting a credit-report error would lift you into a higher tier in a few months, the rate
              savings can be worth the short wait.
            </p>
            <p style={p}>
              <span style={strong}>2. The higher-rate payment would strain your budget.</span> If the fair-credit payment
              is right at the edge of what you can handle, a lower rate isn&apos;t a luxury — it&apos;s the breathing room
              that keeps you out of trouble. Waiting to earn it is defensive, not greedy.
            </p>
            <p style={p}>
              <span style={strong}>3. Buying now would wipe out your emergency fund.</span> If the only way to buy today is
              to leave yourself with no cushion, wait and build one first. Homeownership without a safety net is fragile.
            </p>
            <p style={p}>
              And if you&apos;re unsure, <span style={strong}>get pre-approved anyway</span>. It&apos;s low-cost, it
              doesn&apos;t commit you to anything, and it replaces the guessing with a real number and rate to decide on —
              which beats talking yourself in or out of a house on a hunch.
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
            isn&apos;t your advisor, and the right move depends on details only you know, including your full credit
            picture, income, and local market. Loan program rules and rates change; confirm the current specifics with a
            licensed loan officer or a HUD-approved housing counselor before you commit.
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
            { href: "/home-affordability", label: "Home Affordability Calculator" },
            { href: "/qualify", label: "Mortgage Qualifier" },
            { href: "/down-payment", label: "Down Payment Calculator" },
            { href: "/mortgage", label: "Mortgage Calculator" },
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
