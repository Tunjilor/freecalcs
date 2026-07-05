import type { Metadata } from "next";
import CalcCTA from "@/components/blog/CalcCTA";
import RelatedTools from "@/components/blog/RelatedTools";
import { tokens as t } from "@/lib/calculator/tokens";

const URL = "https://www.freecalcs.io/blog/how-big-should-emergency-fund-be";
const TITLE = "How Big Should My Emergency Fund Actually Be?";
const DESCRIPTION =
  "\"Three to six months of expenses\" is a huge range and nearly useless without tailoring. The right size depends on your income stability, dependents, and — crucially — essential expenses, not your whole lifestyle.";

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "freecalcs.io", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "How many months of expenses should an emergency fund cover?",
    a: "The common rule is three to six months, but the right end of that range depends on you. Lean toward three months if you have stable, dual income, few dependents, and a job you could replace quickly. Lean toward six months or more if you're a single earner, self-employed, have variable or commission income, support dependents, or work in a field where finding a new role takes time. It's a scale, not a single number.",
  },
  {
    q: "What counts as an essential expense?",
    a: "The things you'd still have to pay if your income stopped: housing (rent or mortgage), utilities, groceries, insurance, transportation to work, and minimum debt payments. It does NOT include dining out, vacations, subscriptions, or discretionary shopping — you'd cut those in a real emergency. Sizing your fund on essentials, not your full lifestyle spending, usually makes the target smaller and less intimidating than people expect.",
  },
  {
    q: "Where should I keep my emergency fund?",
    a: "In a high-yield savings account — somewhere liquid, safe, and earning a little interest (often around 4–5%). Not in checking, where it earns nothing, and not invested in stocks, where it could be down 20% exactly when you need it. The whole point of the fund is that the money is there, in full, on the day an emergency hits — so safety and access matter more than returns.",
  },
  {
    q: "Should I build my emergency fund before paying off debt?",
    a: "Build a small starter buffer (around $1,000) first, then usually capture any employer 401(k) match and attack high-interest debt before finishing the full fund. A 22% credit card costs you far more than a savings account earns, so clearing it is a higher priority than a fully-stocked fund. The exception is the starter buffer — you want at least a little cushion so a small surprise doesn't send you back to the cards.",
  },
  {
    q: "Can I have too much in an emergency fund?",
    a: "Yes. Money beyond what a realistic emergency would require is idle cash slowly losing value to inflation, when it could be working toward retirement or other goals. Once you've hit a sensible target for your situation — and captured your match and cleared high-interest debt — additional dollars generally do more invested than sitting in savings. Right-size the fund; don't let it become a hoard.",
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
            <span style={heroChip}>Savings</span>
            <span style={heroMeta}>8 min read</span>
            <span style={heroMeta}>Jul 5, 2026</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.3, color: t.color.onBrand }}>{TITLE}</h1>
          <p style={{ color: t.color.onBrandFaint, fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            &quot;Three to six months of expenses&quot; can mean $12,000 or $24,000 — the same advice with double the number.
            Here&apos;s how to find which end is actually you.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: read, margin: "0 auto", padding: "40px 16px" }}>
        <div style={card}>
          {/* Your situation */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 17, color: t.color.body, lineHeight: 1.75, margin: "0 0 16px" }}>
              You&apos;ve heard the rule a hundred times: keep three to six months of expenses in an emergency fund. It
              sounds tidy — until you try to act on it and realize &quot;three to six months&quot; is a spread of
              $12,000 versus $24,000. That&apos;s not a target; that&apos;s a shrug.
            </p>
            <p style={p}>
              The honest answer is that the right size is genuinely personal, and there&apos;s a simple way to pin it down.
              Two things make the number clearer than the rule of thumb suggests — and one of them usually makes it
              <span style={strong}> smaller</span> than you fear. Let&apos;s work through it.
            </p>
          </div>

          {/* What it covers */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>First: it covers essentials, not your whole life</h2>
            <p style={p}>
              This is the part most people get wrong, and it&apos;s good news. An emergency fund is sized on your
              <span style={strong}> essential</span> monthly expenses — the things you&apos;d still have to pay if your
              income stopped tomorrow: <span style={strong}>rent or mortgage, utilities, groceries, insurance,
              transportation to work, and minimum debt payments</span>.
            </p>
            <p style={p}>
              It is <span style={strong}>not</span> sized on your full lifestyle. Dining out, vacations, streaming
              subscriptions, new clothes, the gym you could pause — in a real emergency, those get cut. So when you picture
              &quot;six months of everything I spend,&quot; you&apos;re overestimating. The fund only has to cover the
              bills that don&apos;t stop, which is often meaningfully less than your total spending.
            </p>
          </div>

          {/* Where you land */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Second: where you land on the 3-to-6 scale</h2>
            <p style={p}>
              The number of months you need scales with how quickly you could recover from losing your income. Three
              factors move you along the scale:
            </p>
            <p style={p}>
              <span style={strong}>Income stability.</span> Two stable W-2 salaries in a household? You can lean toward the
              low end — if one income pauses, the other cushions it. A single earner, or income that&apos;s variable,
              commission-based, seasonal, or self-employed? Lean higher — you have less to fall back on and less predictable
              cash flow.
            </p>
            <p style={p}>
              <span style={strong}>Dependents.</span> The more people who rely on your income — kids, a non-working
              partner, aging parents — the bigger the cushion should be, because more is riding on it and the stakes of
              running out are higher.
            </p>
            <p style={p}>
              <span style={strong}>How replaceable your income is.</span> If your skills are in demand and you could land a
              new role in a few weeks, a smaller fund bridges the gap. If your field is niche or hiring is slow, assume a
              longer search and save more. High fixed obligations (a big mortgage, medical costs) push the number up too.
            </p>
          </div>

          {/* The math */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The math, with real numbers</h2>
            <p style={p}>
              Say your <span style={strong}>essential</span> expenses come to about <span style={strong}>$4,000 a
              month</span>. Then three months is <span style={strong}>$12,000</span> and six months is
              <span style={strong}> $24,000</span>. That&apos;s your range — now place yourself on it. Stable dual income,
              no dependents, marketable skills? Aim near <span style={strong}>$12,000</span>. Single or self-employed
              income, or people depending on you? Aim for <span style={strong}>$24,000</span> or a bit more.
            </p>
            <p style={p}>
              Once you have a target, the useful question becomes: how much do I set aside each month, and how long until
              I&apos;m there? Parking it in a high-yield savings account earning around 4–5% helps a little along the way.
            </p>
            <CalcCTA
              href="/savings-goal"
              label="Turn your target into a monthly plan"
              blurb="Enter your emergency-fund target, what you've saved so far, and a timeline to see exactly how much to set aside each month — and automate it so the fund actually gets built."
              cta="Open the savings goal calculator"
            />
          </div>

          {/* The honest nuance */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The honest nuance: bigger isn&apos;t automatically better</h2>
            <p style={p}>
              It&apos;s tempting to think a giant emergency fund is just extra safety. But past a sensible target,
              it&apos;s <span style={strong}>idle cash slowly losing to inflation</span> — money that, once you&apos;re
              genuinely covered, would do more working toward retirement. You can see how even modest amounts grow over time
              with the <a href="/compound-interest" style={inlineLink}>compound interest calculator</a>; every extra year
              that money sits beyond what you need is growth you&apos;re giving up.
            </p>
            <p style={p}>
              <span style={strong}>Sequence matters more than size.</span> A sensible order for most people: build a small
              <span style={strong}> starter buffer</span> (around $1,000) first, then capture any{" "}
              <span style={strong}>employer 401(k) match</span> (free money you can&apos;t beat), then kill{" "}
              <span style={strong}>high-interest debt</span> (a 22% card outruns any savings rate), then finish building the
              full fund, and only then push extra dollars into investing. Racing to a six-month fund while ignoring the
              match or carrying credit-card debt is the wrong order.
            </p>
            <p style={p}>
              And keep it in the <span style={strong}>right place</span>: a high-yield savings account — liquid and safe.
              Not checking, where it earns nothing, and not the stock market, where it could be down 20% on the exact day
              you lose your job. The fund&apos;s job is certainty, not returns.
            </p>
          </div>

          {/* Common mistakes */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Common mistakes</h2>
            <p style={p}>
              <span style={strong}>Sizing it on lifestyle instead of essentials.</span> Using your total spending inflates
              the target and can leave you over-saving. Base it on the bills that wouldn&apos;t stop.
            </p>
            <p style={p}>
              <span style={strong}>Keeping it in the wrong account.</span> Left in checking it earns nothing; invested in
              stocks it can drop right when you need it. High-yield savings is the sweet spot: safe, liquid, and earning a
              little.
            </p>
            <p style={p}>
              <span style={strong}>Building it in the wrong order.</span> Fully funding six months before capturing your
              employer match or clearing high-interest debt costs you more than the fund protects. Starter buffer, then
              match, then high-rate debt, then finish the fund.
            </p>
            <p style={p}>
              <span style={strong}>Never starting because the number feels huge.</span> $24,000 is paralyzing; $1,000 is
              not. Start with a small starter buffer, automate a monthly amount, and let it build. A partly-funded emergency
              fund beats a perfect plan you never begin.
            </p>
          </div>

          {/* Conditional recommendation */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={h2}>So — how big should yours be?</h2>
            <p style={p}>
              Start by finding your <span style={strong}>essential</span> monthly expenses, then place yourself on the
              scale rather than defaulting to a round number.
            </p>
            <p style={p}>
              <span style={strong}>Aim toward three months</span> if you have stable, dual household income, few or no
              dependents, marketable skills you could redeploy quickly, and manageable fixed costs. Your income is unlikely
              to fully stop, and you could recover fast — a leaner fund does the job and frees money for other goals.
            </p>
            <p style={p}>
              <span style={strong}>Aim for six months or more</span> if you&apos;re a single earner, self-employed, or have
              variable, commission, or seasonal income; if people depend on you; or if your role would take a while to
              replace. When a gap could be long and the stakes are higher, the bigger cushion is worth the idle cash.
            </p>
            <p style={p}>
              And whatever your target, respect the <span style={strong}>sequence</span>: a $1,000 starter buffer first,
              then your employer match and high-interest debt, then finish the fund. If you&apos;re somewhere in the middle
              — some stability, some uncertainty — landing around four months and adjusting as your life changes is a
              perfectly honest answer. The goal isn&apos;t a perfect number; it&apos;s a cushion sized to your real risk.
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
            isn&apos;t your advisor, and the right amount depends on details only you know, including your job security,
            dependents, and full financial picture. If you&apos;re weighing this alongside debt or retirement decisions,
            consider talking with a qualified, fee-only financial professional.
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
            { href: "/savings-goal", label: "Savings Goal Calculator" },
            { href: "/compound-interest", label: "Compound Interest Calculator" },
            { href: "/debt-payoff", label: "Debt Payoff Calculator" },
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
