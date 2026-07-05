import type { Metadata } from "next";
import CalcCTA from "@/components/blog/CalcCTA";
import RelatedTools from "@/components/blog/RelatedTools";
import { tokens as t } from "@/lib/calculator/tokens";

const URL = "https://www.freecalcs.io/blog/roth-vs-traditional-95k-income";
const TITLE = "I Make $95,000 a Year. Should I Choose Roth or Traditional?";
const DESCRIPTION =
  "At $95,000 you're in the 22% bracket, so the choice comes down to one question: will your tax rate in retirement be higher or lower than today? A plain-English walkthrough with real 2026 numbers.";

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "freecalcs.io", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "Roth or Traditional at $95,000 — what's the short answer?",
    a: "At $95k (single, 2026) your marginal rate is 22%, which is historically moderate. If you expect your retirement tax rate to be the same or higher, Roth tends to win because you lock in 22% now and never pay tax on the growth. If you're confident it'll be clearly lower, Traditional wins. Nobody knows future rates for certain, so many people split their contributions.",
  },
  {
    q: "What tax bracket am I in at $95,000?",
    a: "Single in 2026, a $95,000 salary lands in the 22% marginal bracket. After the standard deduction your taxable income is roughly $78,900, which sits inside the 22% band ($50,400–$105,700). 'Marginal' means 22% applies to your next dollar — your overall effective rate is lower because the first chunks are taxed at 10% and 12%.",
  },
  {
    q: "How do I know if my tax rate will be lower in retirement?",
    a: "You don't, for certain — that's the honest catch. It depends on your future income, withdrawals, Social Security, where you live, and where Congress sets rates decades from now. A common assumption is that you'll spend less and drop a bracket, but large 401(k)/IRA balances, Social Security, and the loss of deductions can keep retirees at 22% or push them higher. Treat 'lower in retirement' as an assumption to test, not a given.",
  },
  {
    q: "Does my employer match go into Roth or Traditional?",
    a: "Historically employer matching contributions were always pre-tax (Traditional), even if your own contributions are Roth — though recent rules now let some plans offer a Roth match if you elect and pay tax on it. Either way, the match is free money: contribute at least enough to get the full match before optimizing Roth vs Traditional. The match matters far more than the tax-treatment choice.",
  },
  {
    q: "Can I contribute to both Roth and Traditional?",
    a: "Yes. You can split your contributions between Roth and Traditional (within the combined annual limit), which is exactly how many people hedge the uncertainty about future tax rates. Putting some in each gives you tax-free and tax-deferred money to draw from in retirement, which also creates flexibility to manage your taxable income year to year.",
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
            <span style={heroChip}>Investing &amp; Retirement</span>
            <span style={heroMeta}>8 min read</span>
            <span style={heroMeta}>Jul 5, 2026</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.3, color: t.color.onBrand }}>{TITLE}</h1>
          <p style={{ color: t.color.onBrandFaint, fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            At $95,000 you&apos;re in the 22% bracket, so the whole decision comes down to one question: will your tax rate
            in retirement be higher or lower than it is today?
          </p>
        </div>
      </div>

      <div style={{ maxWidth: read, margin: "0 auto", padding: "40px 16px" }}>
        <div style={card}>
          {/* Your situation */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 17, color: t.color.body, lineHeight: 1.75, margin: "0 0 16px" }}>
              You&apos;re making $95,000 a year, you&apos;re putting money into a retirement account, and the form asks you
              to pick: <span style={strong}>Roth or Traditional?</span> It sounds like a technical detail. It isn&apos;t —
              over 30 years the choice can swing your after-tax retirement balance by tens of thousands of dollars.
            </p>
            <p style={p}>
              The good news is that the decision rests on a single, understandable question. Let&apos;s work through it in
              plain terms, with real 2026 numbers, so you can judge your own case instead of guessing.
            </p>
          </div>

          {/* What you're choosing */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>What you&apos;re actually choosing</h2>
            <p style={p}>
              Both accounts grow the same way; the only difference is <span style={strong}>when you pay the tax</span>.
              With <span style={strong}>Traditional</span>, your contribution is deducted from your income now — you skip
              the tax today, and then pay ordinary income tax on every dollar you withdraw in retirement. With
              <span style={strong}> Roth</span>, you pay the tax now, on today&apos;s income, and then the money grows and
              comes out in retirement <span style={strong}>completely tax-free</span>.
            </p>
            <p style={p}>
              So it&apos;s not really &quot;deduction vs no deduction.&quot; It&apos;s <span style={strong}>pay tax now or
              pay tax later</span> — and which one wins depends entirely on whether your tax rate later is higher or lower
              than your rate today. At $95,000, single, in 2026, your rate today is the <span style={strong}>22% marginal
              bracket</span>.
            </p>
          </div>

          {/* The math */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The math, with real numbers</h2>
            <p style={p}>
              Say you contribute <span style={strong}>$7,000 a year for 30 years</span> and it grows at about 7% a year.
              On a pre-tax basis, that builds to roughly <span style={strong}>$661,000</span> either way — same
              contributions, same growth. The difference is only in what you keep after tax:
            </p>
            <p style={p}>
              <span style={strong}>Roth</span> — you already paid the 22% on the way in, so all ~$661,000 is yours:
              effectively about <span style={strong}>$516,000</span> in today&apos;s-tax terms, and nothing more is owed.
              <br />
              <span style={strong}>Traditional</span> — you owe ordinary income tax on withdrawals. If your retirement
              rate is <span style={strong}>12%</span>, you keep about <span style={strong}>$582,000</span> — Traditional
              wins by roughly $66,000. If it&apos;s <span style={strong}>32%</span>, you keep about
              <span style={strong}> $450,000</span> — now Roth wins by about $66,000.
            </p>
            <p style={p}>
              Notice what happened: at the <span style={strong}>same 22%</span> in retirement, the two are identical. Every
              dollar of difference comes from the gap between your rate now and your rate later.
            </p>
            <CalcCTA
              href="/roth-vs-traditional"
              label="See which one wins for your numbers"
              blurb="Enter your income, contribution, years, and an assumed retirement tax rate to see the after-tax winner — and by how much — with your own figures."
              cta="Open the Roth vs Traditional calculator"
            />
          </div>

          {/* The deciding question */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The one question that decides it</h2>
            <p style={p}>
              Strip away the jargon and it&apos;s this: <span style={strong}>will your tax rate in retirement be higher or
              lower than your 22% today?</span>
            </p>
            <p style={p}>
              <span style={strong}>Traditional wins if your future rate is lower.</span> You skip 22% now and pay, say,
              12% later. <span style={strong}>Roth wins if your future rate is higher.</span> You lock in 22% now and pay
              nothing later, even if rates have climbed. And if the rate is the same, it&apos;s a wash.
            </p>
            <p style={p}>
              Here&apos;s the honest part nobody can escape: <span style={strong}>no one knows future tax rates for
              certain.</span> Your own income in retirement is a guess, and where Congress sets rates in 30 years is
              anyone&apos;s. That uncertainty isn&apos;t a reason to freeze — it&apos;s the exact reason many people
              <span style={strong}> split</span> their contributions, putting some in each so they&apos;re hedged no matter
              which way rates go.
            </p>
          </div>

          {/* Employer match */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>First, though: the employer match</h2>
            <p style={p}>
              Before you agonize over Roth vs Traditional, make sure you&apos;re getting your full employer match — that
              decision dwarfs this one. A match is an instant 50–100% return that no tax-treatment choice can beat. If
              your plan matches, contribute at least enough to capture all of it first; the{" "}
              <a href="/401k" style={inlineLink}>401(k) calculator</a> shows exactly how much the match adds over time.
            </p>
            <p style={p}>
              One wrinkle worth knowing: the <span style={strong}>match itself has traditionally been pre-tax</span>, even
              when your own contributions are Roth. So a &quot;Roth 401(k)&quot; saver often still ends up with a bucket of
              Traditional money from the match — a built-in split you didn&apos;t have to plan.
            </p>
          </div>

          {/* Common mistakes */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Common mistakes people make</h2>
            <p style={p}>
              <span style={strong}>Assuming you&apos;ll automatically be in a lower bracket.</span> It&apos;s the default
              belief, but it&apos;s not guaranteed. A healthy 401(k) balance throws off large taxable withdrawals, Social
              Security is partly taxable, and you lose the deductions that shelter income while you&apos;re working — plenty
              of retirees stay at 22% or move up. If &quot;lower later&quot; is just a hope, Roth is the safer bet.
            </p>
            <p style={p}>
              <span style={strong}>Forgetting that Roth has no required minimum distributions.</span> Traditional accounts
              force you to start withdrawing (and paying tax) in your 70s, whether you need the money or not. Roth IRAs
              don&apos;t — so the money can keep growing tax-free and pass to heirs more cleanly. That flexibility is real
              value the pure rate math doesn&apos;t capture.
            </p>
            <p style={p}>
              <span style={strong}>Over-thinking it while under-saving.</span> The single biggest driver of your
              retirement is how much you contribute, not whether it&apos;s Roth or Traditional. Getting the full match and
              raising your contribution rate matters more than nailing the tax bucket perfectly.
            </p>
          </div>

          {/* The conditional recommendation */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={h2}>So — which should you pick?</h2>
            <p style={p}>
              For most people at $95,000 with a normal career arc, <span style={strong}>Roth is a reasonable default</span>
              . At 22% you&apos;re locking in a historically moderate rate, you get decades of tax-free growth, you dodge
              required distributions, and you&apos;re protected if rates rise. When the future is uncertain and today&apos;s
              rate is moderate, paying the known 22% is often the safer trade.
            </p>
            <p style={p}>But lean Traditional instead if any of these fits you:</p>
            <p style={p}>
              <span style={strong}>1. You have good reason to expect a clearly lower rate in retirement.</span> You plan
              to retire early before Social Security and large withdrawals kick in, you&apos;ll move to a no-income-tax
              state, or you expect to spend well below your current income. Skipping 22% now to pay 12% later is a real win.
            </p>
            <p style={p}>
              <span style={strong}>2. You need the deduction to afford to save at all.</span> If the tax break on a
              Traditional contribution is what lets you put money in — or lets you contribute more — the higher balance can
              outweigh the tax-treatment question. Saving more in Traditional beats saving less in Roth.
            </p>
            <p style={p}>
              <span style={strong}>3. You&apos;re genuinely unsure — so hedge.</span> That&apos;s not indecision,
              it&apos;s honest. Splitting your contributions between Roth and Traditional gives you both tax-free and
              tax-deferred money in retirement, and the flexibility to manage your taxable income year to year.
            </p>
          </div>

          {/* Disclaimer reinforcement */}
          <p
            style={{
              fontSize: 12, color: t.color.faint, lineHeight: 1.6, fontStyle: "italic",
              borderTop: `1px solid ${t.color.line}`, paddingTop: 20, margin: "8px 0 0",
            }}
          >
            This article is information to help you think through the trade-off — it isn&apos;t financial or tax advice.
            freecalcs isn&apos;t your advisor, and the right answer depends on details only you know, including your full
            tax picture and your state. For a decision that compounds over decades, it&apos;s worth confirming with a
            qualified tax professional or fee-only financial advisor.
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
            { href: "/roth-vs-traditional", label: "Roth vs Traditional Calculator" },
            { href: "/401k", label: "401(k) Calculator" },
            { href: "/retirement", label: "Retirement Calculator" },
            { href: "/savings-goal", label: "Savings Goal Calculator" },
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
