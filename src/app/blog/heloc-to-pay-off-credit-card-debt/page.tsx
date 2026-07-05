import type { Metadata } from "next";
import CalcCTA from "@/components/blog/CalcCTA";
import RelatedTools from "@/components/blog/RelatedTools";
import { tokens as t } from "@/lib/calculator/tokens";

const URL = "https://www.freecalcs.io/blog/heloc-to-pay-off-credit-card-debt";
const TITLE = "Should I Use a HELOC to Pay Off Credit Card Debt?";
const DESCRIPTION =
  "Trading 22% card debt for a 9% HELOC can save thousands — or leave you owing on both. A plain-English walkthrough of the math, the risks, and how to tell which it'll be for you.";

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "freecalcs.io", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "Is a HELOC really cheaper than credit cards?",
    a: "Almost always on rate — cards routinely charge 18–26% while a HELOC is usually single digits. On a balance you can't clear in a month or two, that gap saves real money. But a HELOC's rate is typically variable and the debt is secured by your home, so 'cheaper' only holds if you can handle the payment and don't re-run up the cards.",
  },
  {
    q: "Can I lose my house with a HELOC?",
    a: "Yes — that's the core trade-off. Credit card debt is unsecured, so the worst case is damaged credit and collections. A HELOC is secured by your home, so if you can't make the payments, the lender can ultimately foreclose. That risk is manageable with steady income, but it's the reason to be honest about the new payment before you borrow.",
  },
  {
    q: "Should I use a HELOC or a personal loan to pay off debt?",
    a: "A fixed-rate personal loan doesn't put your house on the line and its rate can't rise, but it's usually a few points higher than a HELOC. A HELOC is cheaper and flexible but variable and secured. If the two rates are close after fees, many people prefer the personal loan for the lower risk. Compare both against simply attacking the cards directly.",
  },
  {
    q: "What is the biggest mistake people make?",
    a: "Paying off the cards with a HELOC and then running the cards back up. The balances feel like free money again, and two years later you owe the HELOC and new card debt — more total debt than you started with, part of it now secured by your home. If you're not certain the cards will stay at zero, the lower rate is a trap, not a tool.",
  },
  {
    q: "Does moving debt to a HELOC hurt my credit?",
    a: "Opening a HELOC adds a hard inquiry and a new account, which can dip your score briefly. But paying off cards lowers your credit utilization, which usually helps over time. The bigger risk to your credit — and your home — is charging the cards back up while you still owe on the HELOC.",
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
            <span style={heroChip}>Loans &amp; Debt</span>
            <span style={heroMeta}>8 min read</span>
            <span style={heroMeta}>Jul 5, 2026</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.3, color: t.color.onBrand }}>{TITLE}</h1>
          <p style={{ color: t.color.onBrandFaint, fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            Trading 22% card debt for a 9% HELOC can save thousands — or leave you owing on both. Here&apos;s how to tell which it&apos;ll be for you.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: read, margin: "0 auto", padding: "40px 16px" }}>
        <div style={card}>
          {/* Your situation */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 17, color: t.color.body, lineHeight: 1.75, margin: "0 0 16px" }}>
              If you&apos;re carrying a few thousand dollars on credit cards at 20-something percent, and you&apos;ve built
              up real equity in your home, you&apos;ve probably had the thought: what if I just move this debt somewhere
              cheaper? A home equity line of credit (HELOC) at around 9% instead of 22% sounds like an obvious win.
            </p>
            <p style={p}>
              Sometimes it is. Sometimes it quietly makes things worse. The difference comes down to a few things about
              your situation — and one habit. Let&apos;s walk through it honestly, with real numbers, so you can judge
              your own case.
            </p>
          </div>

          {/* What you're actually doing */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>What you&apos;re actually doing</h2>
            <p style={p}>
              Using a HELOC to pay off cards doesn&apos;t erase the debt — it <span style={strong}>moves</span> it, and
              changes what&apos;s backing it. Right now your card debt is <span style={strong}>unsecured</span>: if
              everything fell apart, the worst the card company can do is damage your credit and send it to collections. A
              HELOC is <span style={strong}>secured by your house</span>. Move the debt there and you&apos;ve traded a lower
              rate for a real risk — miss enough payments and the lender can foreclose.
            </p>
            <p style={p}>
              That&apos;s not a reason to never do it. It&apos;s the reason to be honest about whether you can handle the
              new payment before you sign. The upside is the rate: credit cards routinely charge 18–26%, while a HELOC is
              usually single digits. On a balance you can&apos;t clear in a month or two, that gap is real money.
            </p>
          </div>

          {/* The math */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The math, with real numbers</h2>
            <p style={p}>
              Say you owe <span style={strong}>$15,000 on cards at 22%</span>, and you can put <span style={strong}>$400
              a month</span> toward it. Paying it off on the cards, that takes roughly <span style={strong}>five years and
              about $10,000 in interest</span> — and that&apos;s only if you never charge another dollar. Pay just the
              minimum instead, and you&apos;re looking at 20-plus years.
            </p>
            <p style={p}>
              Move that same $15,000 to a <span style={strong}>HELOC at 9%</span> and keep paying $400 a month, and
              it&apos;s gone in under four years for roughly <span style={strong}>$2,600 in interest</span>. Same payment,
              same discipline — about <span style={strong}>$8,000 less interest</span>, and out of debt sooner. That, in a
              sentence, is the case for doing it.
            </p>
            <CalcCTA
              href="/credit-card-payoff"
              label="See what your cards are actually costing you"
              blurb="Enter your real balance, APR, and monthly payment to see your exact payoff time and interest — and how much a fixed payment beats the shrinking minimum."
              cta="Open the credit card payoff calculator"
            />
            <p style={p}>
              Whether a HELOC is even on the table depends on your equity. Lenders let you borrow up to a combined
              loan-to-value (CLTV) limit — often 80–90% of your home&apos;s value, minus what you still owe on the
              mortgage. If your home is worth $500,000 and you owe $300,000, an 85% limit means a line of up to about
              <span style={strong}> $125,000</span> — far more than enough for a $15,000 balance.
            </p>
            <CalcCTA
              href="/heloc"
              label="See your available credit line and payment"
              blurb="Enter your home value, mortgage balance, and CLTV limit to estimate how much you could borrow — and what the interest-only and repayment payments would look like."
              cta="Open the HELOC calculator"
            />
          </div>

          {/* The trap */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The trap that turns this into a mistake</h2>
            <p style={p}>
              Here&apos;s the part that sinks people. You move $15,000 off the cards and onto the HELOC. The cards now show
              a $0 balance — and they feel like free money again. Over the next two years you drift back to $8,000 in card
              debt. Now you owe the <span style={strong}>$15,000 HELOC and $8,000 on cards at 22%</span>: more total debt
              than you started with, and part of it is secured by your house.
            </p>
            <p style={p}>
              This isn&apos;t a rare edge case — it&apos;s the single most common way a HELOC payoff goes wrong. The rate
              savings are real, but they only matter if the cards stay at zero. If you&apos;re not certain they will, the
              lower rate is a trap, not a tool.
            </p>
          </div>

          {/* Other mistakes */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Other things people get wrong</h2>
            <p style={p}>
              <span style={strong}>Assuming the rate is fixed.</span> Most HELOCs carry a <span style={strong}>variable
              rate</span> tied to the prime rate. The 9% you start with can climb if rates rise — and unlike a fixed loan,
              your payment moves with it. Budget as if the rate could be a couple of points higher than today&apos;s.
            </p>
            <p style={p}>
              <span style={strong}>Ignoring closing costs and fees.</span> Some HELOCs carry appraisal, origination, or
              annual fees. On a modest balance, those can eat into the interest you&apos;re saving — compare the real,
              all-in cost, not just the headline rate.
            </p>
            <p style={p}>
              <span style={strong}>Coasting through the interest-only period.</span> Many HELOCs let you pay interest-only
              for the first several years. That keeps the payment low but doesn&apos;t reduce the balance, and the payment
              jumps when the repayment period begins. If you consolidate onto a HELOC, make sure you&apos;re actually
              paying down principal — not just servicing it.
            </p>
          </div>

          {/* The conditional recommendation */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={h2}>So — should you?</h2>
            <p style={p}>
              For most people in this exact situation — a <span style={strong}>steady income</span>, card debt at
              genuinely high rates, <span style={strong}>real equity</span> in the home, and honest confidence you
              <span style={strong}> won&apos;t run the cards back up</span> — the math favors moving the debt to a lower
              rate and killing the 22% first. The interest savings are large and real.
            </p>
            <p style={p}>But don&apos;t do it if any of these three things is true:</p>
            <p style={p}>
              <span style={strong}>1. Your income is shaky, or the payment would stretch you.</span> You&apos;re putting
              your home on the line now, not just your credit score. Unsecured debt is survivable in a crisis; a secured
              debt you can&apos;t pay is a foreclosure risk.
            </p>
            <p style={p}>
              <span style={strong}>2. You&apos;re not sure the cards will stay at zero.</span> If there&apos;s a real
              chance you&apos;ll run them back up, this move can leave you worse off. Be honest with yourself — the trap is
              common for a reason.
            </p>
            <p style={p}>
              <span style={strong}>3. The rate isn&apos;t much lower after fees, or it&apos;s variable and a rise would
              hurt.</span> If a fixed-rate personal loan gets you a similar rate without putting your house on the line,
              that&apos;s often the safer trade.
            </p>
            <p style={p}>
              If you&apos;re unsure, that&apos;s a good reason to slow down. A fixed-rate personal loan, a 0%
              balance-transfer card, or simply attacking the highest-rate card with the avalanche method can get you out of
              high-interest debt without secured-debt risk.
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
            isn&apos;t your financial advisor, and the right call depends on details only you know. For a decision this
            size, especially one that puts your home on the line, it&apos;s worth talking to a qualified professional or a
            nonprofit credit counselor.
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
            { href: "/credit-card-payoff", label: "Credit Card Payoff Calculator" },
            { href: "/heloc", label: "HELOC Calculator" },
            { href: "/debt-consolidation", label: "Debt Consolidation Calculator" },
            { href: "/debt-payoff", label: "Debt Payoff Calculator" },
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
