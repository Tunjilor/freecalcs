import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FHA Loan Requirements 2026: Do You Qualify? | freecalcs.io',
  description: 'The full FHA loan requirements for 2026 — credit score, down payment, DTI, mortgage insurance, and income rules — explained in plain English.',
  alternates: { canonical: 'https://www.freecalcs.io/blog/fha-loan-requirements' },
  openGraph: { title: 'FHA Loan Requirements 2026: Do You Qualify?', description: 'The full FHA loan requirements for 2026 — credit score, down payment, DTI, mortgage insurance, and income rules — explained in plain English.', url: 'https://www.freecalcs.io/blog/fha-loan-requirements', siteName: 'freecalcs.io', type: 'article' },
};

const faqs = [
  {
    q: 'What credit score do I need for an FHA loan?',
    a: "At least 580 to qualify with a 3.5% down payment. Scores from 500 to 579 can still qualify with 10% down. Below 500, FHA financing generally isn't available.",
  },
  {
    q: 'How much down payment do I need for an FHA loan?',
    a: 'As little as 3.5% with a 580+ credit score, or 10% with a score between 500 and 579. The down payment can come from gift funds with a gift letter.',
  },
  {
    q: 'What is the maximum DTI for an FHA loan?',
    a: 'The standard guidelines are 31% front-end and 43% back-end, but lenders can approve up to 50% (sometimes higher) with compensating factors like cash reserves or strong credit.',
  },
  {
    q: 'Does an FHA loan require mortgage insurance?',
    a: 'Yes — a 1.75% upfront premium plus an annual premium around 0.55%. With less than 10% down it lasts the life of the loan; the usual way to remove it is to refinance into a conventional loan at 20% equity.',
  },
  {
    q: 'Can I get an FHA loan after bankruptcy or foreclosure?',
    a: 'Usually yes, after a waiting period — typically three years after a foreclosure and two years after a Chapter 7 bankruptcy, shorter than conventional loans require.',
  },
  {
    q: 'Do I have to be a first-time buyer to get an FHA loan?',
    a: 'No. FHA loans are open to repeat buyers too, as long as the home will be your primary residence and you meet the requirements.',
  },
];

// FAQ structured data is generated from the visible faqs array so the JSON-LD
// always matches what users see on the page, per Google's requirements.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', lineHeight: 1.3 };
const pStyle: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.8, margin: '0 0 16px' };
const linkStyle: React.CSSProperties = { color: '#2563eb', fontWeight: 600, textDecoration: 'none' };

export default function Article() {
  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif', background: 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)', color: '#fff', padding: '40px 16px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <a href="/blog" style={{ color: '#93c5fd', fontSize: 13, textDecoration: 'none' }}>← Back to Blog</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 12px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#2563eb22', padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.06em' }}>Mortgage</span>
            <span style={{ fontSize: 12, color: '#93c5fd' }}>7 min read</span>
            <span style={{ fontSize: 12, color: '#93c5fd' }}>Updated Jun 2026</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.3, color: '#fff' }}>FHA Loan Requirements in 2026: Do You Qualify?</h1>
          <p style={{ color: '#93c5fd', fontSize: 15, margin: 0, lineHeight: 1.6 }}>The full FHA loan requirements for 2026 — credit score, down payment, DTI, mortgage insurance, and income rules — explained in plain English.</p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 16px 40px' }}>
        {/* Intro */}
        <p style={{ fontSize: 17, color: '#334155', lineHeight: 1.75, margin: '0 0 36px' }}>
          FHA loans are the go-to option for buyers who don&apos;t fit the conventional mold — lower credit scores,
          smaller down payments, or a bumpier financial history are all workable. Backed by the Federal Housing
          Administration and issued by regular lenders, they trade easier qualification for mortgage insurance. This
          guide lays out every requirement you need to meet in 2026, so you can tell at a glance whether an FHA loan is
          within reach.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>FHA requirements at a glance</h2>
          <p style={pStyle}>
            To qualify for an FHA loan you&apos;ll generally need: a credit score of at least 580 (with a 3.5% down
            payment), a debt-to-income ratio around 43% or less, a steady two-year income history, and a home that will
            be your primary residence and passes an FHA appraisal. You don&apos;t have to be a first-time buyer. Each
            requirement is broken down below, including where there&apos;s flexibility.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Credit score and down payment</h2>
          <p style={pStyle}>
            This is the headline, and the two are linked. With a credit score of 580 or higher, you can put down as
            little as 3.5%. With a score between 500 and 579, you can still qualify, but you&apos;ll need 10% down. Below
            500, FHA financing generally isn&apos;t available. That 580/3.5% tier is what makes FHA so accessible — far
            more forgiving than the ~620 most conventional loans want. Your down payment can also come from gift funds
            (from family, an employer, or a charity), as long as you provide a gift letter confirming it&apos;s a gift
            and not a loan.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Debt-to-income ratio</h2>
          <p style={pStyle}>
            Your debt-to-income (DTI) ratio is how much of your gross monthly income goes to debt. FHA looks at two
            numbers: a front-end ratio (just your housing payment) capped around 31%, and a back-end ratio (all your
            monthly debts) capped around 43%. The good news is these are guidelines, not hard walls — with compensating
            factors like solid cash reserves, strong credit, or significant residual income, lenders can approve DTIs up
            to 50% (and occasionally higher through manual underwriting). This flexibility is a big reason FHA works for
            buyers carrying student loans or other debt.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Income and employment</h2>
          <p style={pStyle}>
            There&apos;s no minimum or maximum income to qualify — what matters is stability. You&apos;ll generally need
            to show a consistent two-year work history, though it doesn&apos;t have to be two years at the same employer.
            Variable income like overtime, commissions, or bonuses usually needs a two-year track record to count, and
            any gaps in employment will need a brief explanation. The goal is simply to show the lender your income is
            reliable enough to support the payment. To see what payment your income can comfortably carry, run the
            numbers through our <a href="/mortgage" style={linkStyle}>mortgage calculator</a>.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Mortgage insurance — the tradeoff</h2>
          <p style={pStyle}>
            The catch with FHA is mortgage insurance, which every FHA borrower pays regardless of credit score. There are
            two pieces: an upfront premium of 1.75% of the loan (usually rolled into the balance) and an annual premium
            of about 0.55% built into your monthly payment. The important detail is duration: if you put down less than
            10%, that annual premium lasts the life of the loan and never cancels on its own. The common way to escape it
            is to refinance into a conventional loan once you&apos;ve built 20% equity. We break down exactly when
            that&apos;s worth it in our{' '}
            <a href="/blog/fha-vs-conventional-which-is-cheaper" style={linkStyle}>FHA vs. Conventional cost comparison</a>.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Loan limits</h2>
          <p style={pStyle}>
            FHA caps how much you can borrow, and the limit depends on your county. For 2026, the floor (which applies in
            most of the country) is $541,287 for a single-family home, and the ceiling in high-cost areas is $1,249,125.
            If the home you want pushes your loan above your county&apos;s FHA limit, you&apos;d need to look at a
            conventional loan instead. You can check your county&apos;s exact figure on HUD&apos;s FHA loan limit lookup.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Property requirements</h2>
          <p style={pStyle}>
            The home has to be your primary residence — FHA loans can&apos;t be used for vacation homes or investment
            properties. It also has to pass an FHA appraisal, which both sets the value and confirms the property meets
            the FHA&apos;s Minimum Property Requirements: essentially that it&apos;s safe, structurally sound, and
            sanitary. Issues like peeling paint on older homes, broken systems, or safety hazards may need to be fixed
            before the loan can close.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Buying after bankruptcy or foreclosure</h2>
          <p style={pStyle}>
            One of FHA&apos;s biggest advantages is how it treats past credit events. After a foreclosure, you&apos;ll
            typically wait three years before you can get an FHA loan — much shorter than the seven years conventional
            usually requires. After a Chapter 7 bankruptcy, the wait is generally two years from discharge; after Chapter
            13, you may qualify after a year of on-time plan payments with court approval. In each case you&apos;ll need
            to show you&apos;ve rebuilt stable financial footing since.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Is an FHA loan right for you?</h2>
          <p style={pStyle}>
            Lean FHA if your credit is in the 500s to low 600s, your down payment is small, your DTI is on the higher
            side, or you&apos;re recovering from a credit event — it&apos;s built for exactly those situations. If your
            credit is strong (700+) and you can put down 5% or more, compare it against a conventional loan, since you may
            pay less and be able to cancel mortgage insurance. And if you&apos;re a veteran or buying rurally, check VA
            and USDA too — our{' '}
            <a href="/blog/fha-vs-conventional-vs-va-vs-usda" style={linkStyle}>full four-loan comparison</a> lays them
            all out.
          </p>
        </section>

        {/* Related links */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '0 0 36px' }}>
          <a href="/mortgage" style={{ background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, textDecoration: 'none' }}>Estimate your payment →</a>
          <a href="/qualify" style={{ background: '#fff', color: '#2563eb', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bfdbfe', textDecoration: 'none' }}>Check if you qualify →</a>
          <a href="/blog/fha-vs-conventional-which-is-cheaper" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bbf7d0', textDecoration: 'none' }}>FHA vs Conventional: which is cheaper →</a>
          <a href="/blog/fha-vs-conventional-vs-va-vs-usda" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bbf7d0', textDecoration: 'none' }}>Compare all 4 loan types →</a>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map(({ q, a }) => (
              <details key={q} style={{ padding: '16px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <summary style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', cursor: 'pointer', listStyle: 'none' }}>{q}</summary>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '10px 0 0' }}>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: 20, margin: '0 0 28px' }}>
          This guide is for general informational purposes only and is not financial or lending advice. FHA requirements,
          premiums, and limits vary by lender and county and can change. Confirm current requirements with an
          FHA-approved lender before making decisions.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/blog" style={{ background: '#fff', color: '#2563eb', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, border: '1px solid #bfdbfe', textDecoration: 'none' }}>← All Articles</a>
          <a href="/qualify" style={{ background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>Mortgage Qualifier</a>
        </div>
      </div>
    </div>
  );
}
