import type { Metadata } from 'next';
import Author, { AUTHORS } from '@/components/Author';
import ArticleJsonLd from '@/components/ArticleJsonLd';
import CalcCTA from '@/components/blog/CalcCTA';
import RelatedTools from '@/components/blog/RelatedTools';

export const metadata: Metadata = {
  title: 'Refinance Requirements 2026: Conventional, FHA, VA, USDA | freecalcs.io',
  description: 'Mortgage refinance qualification requirements for 2026 — credit, equity, and DTI for conventional, FHA, VA, and USDA loans, plus streamline options.',
  alternates: { canonical: 'https://www.freecalcs.io/blog/mortgage-refinance-requirements' },
  openGraph: { title: 'Refinance Requirements 2026: Conventional, FHA, VA, USDA', description: 'Mortgage refinance qualification requirements for 2026 — credit, equity, and DTI for conventional, FHA, VA, and USDA loans, plus streamline options.', url: 'https://www.freecalcs.io/blog/mortgage-refinance-requirements', siteName: 'freecalcs.io', type: 'article' },
};

const faqs = [
  {
    q: 'What do I need to refinance my mortgage?',
    a: 'Generally a credit score around 620 or higher, at least 20% equity (an 80% LTV or lower), a debt-to-income ratio under about 43%, a clean recent payment history, and enough cash or equity to cover closing costs of 2–6%. Streamline programs relax several of these.',
  },
  {
    q: 'What credit score do I need to refinance?',
    a: 'About 620 for a conventional refinance and often lower for FHA. VA and USDA streamline refinances may skip the credit check entirely, while cash-out refinances usually want 640 or higher.',
  },
  {
    q: 'How much equity do I need to refinance?',
    a: 'Most lenders want at least 20% equity (80% LTV). Cash-out refinances typically require you to keep 20% equity in the home, capping the loan at 80% of value — though VA cash-out can go higher. Streamline refinances are flexible on equity.',
  },
  {
    q: 'What is a streamline refinance?',
    a: "A faster refinance available for existing FHA, VA, and USDA loans that lowers your rate while skipping the appraisal and most documentation. You must already have that loan type and be current on payments. There's no conventional streamline.",
  },
  {
    q: 'Can I take cash out when I refinance?',
    a: "Yes, with a cash-out refinance, usually up to 80% of your home's value (keeping 20% equity). VA cash-out can reach up to 100% by program rules, though lenders often cap it lower. USDA loans don't offer cash-out refinancing.",
  },
  {
    q: 'Can I switch loan types when I refinance?',
    a: 'Yes. A common move is refinancing from FHA into conventional to drop mortgage insurance once you have 20% equity. A VA cash-out refinance can also convert an FHA, USDA, or conventional loan into a VA loan if you have VA eligibility.',
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
const labelStyle: React.CSSProperties = { color: '#0f172a' };

export default function Article() {
  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif', background: 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)', minHeight: '100vh' }}>
      <ArticleJsonLd
        headline="Refinance Requirements 2026: Conventional, FHA, VA, USDA"
        description="Mortgage refinance qualification requirements for 2026 — credit, equity, and DTI for conventional, FHA, VA, and USDA loans, plus streamline options."
        url="https://www.freecalcs.io/blog/mortgage-refinance-requirements"
        author={AUTHORS.jamie}
        datePublished="2026-06-10"
        dateModified="2026-06-10"
        section="Mortgage"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)', color: '#fff', padding: '40px 16px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <a href="/blog" style={{ color: '#93c5fd', fontSize: 13, textDecoration: 'none' }}>← Back to Blog</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 12px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#2563eb22', padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.06em' }}>Mortgage</span>
            <span style={{ fontSize: 12, color: '#93c5fd' }}>8 min read</span>
            <span style={{ fontSize: 12, color: '#93c5fd' }}>Updated Jun 2026</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.3, color: '#fff' }}>Mortgage Refinance Requirements: Do You Qualify in 2026?</h1>
          <p style={{ color: '#93c5fd', fontSize: 15, margin: 0, lineHeight: 1.6 }}>Mortgage refinance qualification requirements for 2026 — credit, equity, and DTI for conventional, FHA, VA, and USDA loans, plus streamline options.</p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 16px 40px' }}>
        {/* Author byline + bio */}
        <Author author={AUTHORS.jamie} />

        {/* Intro */}
        <p style={{ fontSize: 17, color: '#334155', lineHeight: 1.75, margin: '0 0 36px' }}>
          Refinancing replaces your current mortgage with a new one — ideally at a lower rate, a shorter term, or with
          cash pulled from your equity. Whether you qualify, and how much work it takes, comes down to two questions:
          what type of loan do you have now, and what are you trying to accomplish? This guide covers the general
          requirements that apply to every refinance, then the specific qualification rules for conventional, FHA, VA,
          and USDA loans — including the &ldquo;streamline&rdquo; shortcuts that can skip the appraisal entirely.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Two questions that decide your path</h2>
          <p style={pStyle}>
            Before the numbers, figure out where you fall. First: what loan do you have today? If you already have an
            FHA, VA, or USDA loan and just want a lower rate, you may qualify for a fast streamline refinance that skips
            most of the paperwork. Second: do you want cash out, or just a better rate? A simple rate-and-term refinance
            is easier to qualify for; a cash-out refinance — where you borrow against your equity and pocket the
            difference — has stricter limits because it raises the lender&apos;s risk. Almost every requirement below
            flexes based on those two answers.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>The general requirements</h2>
          <p style={pStyle}>No matter which loan you&apos;re refinancing, lenders look at the same core factors.</p>
          <p style={pStyle}><strong style={labelStyle}>Credit score:</strong> Around 620 is the common floor for a conventional refinance. FHA refinances can go lower, and streamline options may skip the credit check entirely. Cash-out refinances usually want a higher score, often 640 or above.</p>
          <p style={pStyle}><strong style={labelStyle}>Equity (and LTV):</strong> Most lenders want you to have at least 20% equity — meaning your loan is 80% or less of the home&apos;s value. For a cash-out refinance, you generally have to leave 20% equity in the home, so 80% LTV is the typical ceiling (VA is the main exception). Streamline refinances are far more flexible on equity.</p>
          <p style={pStyle}><strong style={labelStyle}>Debt-to-income ratio:</strong> Lenders usually want your total monthly debts below about 43% of gross income, though some allow up to 50% with strong credit. Cash-out refinances often require a lower DTI.</p>
          <p style={pStyle}><strong style={labelStyle}>Payment history:</strong> Your current mortgage needs to be in good standing — typically no late payments in the last 6 to 12 months.</p>
          <p style={pStyle}><strong style={labelStyle}>Closing costs:</strong> Expect 2% to 6% of the loan amount. You can sometimes roll these into the new loan instead of paying out of pocket, though that increases your balance.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Conventional refinance</h2>
          <p style={pStyle}>
            A conventional refinance (backed by Fannie Mae or Freddie Mac) typically needs a 620+ score, a DTI under
            about 45–50%, and ideally 20% equity. There&apos;s no &ldquo;streamline&rdquo; version — Fannie and Freddie
            don&apos;t offer one — so you&apos;ll go through a full appraisal and underwriting. The big payoff: if your
            home has appreciated or you&apos;ve paid down enough that your loan is under 80% of the value, a conventional
            refinance lets you drop mortgage insurance entirely. Cash-out conventional refinances are capped at 80% LTV.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>FHA refinance</h2>
          <p style={pStyle}>
            FHA gives you two main paths. The FHA Streamline Refinance is for homeowners who already have an FHA loan and
            just want a lower rate. It&apos;s fast: usually no appraisal, no income verification, and minimal
            documentation — but you must be current on payments and the new loan has to produce a real benefit (a
            meaningfully lower payment). The catch is that it keeps FHA mortgage insurance. The FHA Cash-Out Refinance is
            the heavier path: it&apos;s capped at 80% LTV, generally wants around a 620 score, and requires a full
            appraisal. If your goal is to escape FHA mortgage insurance for good, the usual move is to{' '}
            <a href="/blog/fha-vs-conventional-which-is-cheaper" style={linkStyle}>refinance into a conventional loan</a>{' '}
            once you reach 20% equity.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>VA refinance</h2>
          <p style={pStyle}>
            For veterans, the VA Interest Rate Reduction Refinance Loan (IRRRL) is one of the easiest refinances
            available — but only if your current loan is already a VA loan. It usually requires no appraisal, no income
            verification, and often no credit pull, carries a low 0.5% funding fee, and exists purely to lower your rate
            or move from an adjustable to a fixed rate. You can&apos;t take cash out (beyond up to $6,000 for
            energy-efficient improvements). The VA Cash-Out Refinance is the full-underwriting option: it requires an
            appraisal and complete documentation, allows up to 100% LTV by VA rules (though many lenders cap it at
            90–95%), charges no monthly mortgage insurance, and — uniquely — can convert a non-VA loan into a VA loan if
            you have VA eligibility.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>USDA refinance</h2>
          <p style={pStyle}>
            USDA refinancing is available to homeowners who already have a USDA-guaranteed loan. The USDA
            Streamlined-Assist option is the simplest — no income, credit, or employment verification and no appraisal —
            designed just to lower your payment. The USDA Standard Streamline still skips the appraisal but does check
            your credit, income, and DTI. Either way, you generally need to be current on your mortgage with a clean
            recent payment history. USDA refinancing doesn&apos;t offer a cash-out option.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Rate-and-term vs. cash-out, in one line</h2>
          <p style={pStyle}>
            If you&apos;re only chasing a lower rate or shorter term, you&apos;re doing a rate-and-term refinance —
            easier to qualify for, with more flexible LTV. If you want to borrow against your equity, you&apos;re doing a
            cash-out refinance — expect a higher credit bar, a lower DTI ceiling, and an 80% LTV cap (100% for VA).
            Knowing which one you want tells you most of what you&apos;ll need. Either way, run your target rate and
            balance through our <a href="/mortgage" style={linkStyle}>mortgage calculator</a> to estimate the new payment
            before you apply.
          </p>
        </section>

        {/* Related links */}
        <CalcCTA href="/refinance" label="Should you refinance? See your break-even" blurb="Compare your current loan to a new rate and term — monthly savings, the break-even point in months, and whether it actually cuts your lifetime interest." cta="Open the refinance calculator" />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '0 0 36px' }}>
          <a href="/mortgage" style={{ background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, textDecoration: 'none' }}>Estimate your payment →</a>
          <a href="/qualify" style={{ background: '#fff', color: '#2563eb', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bfdbfe', textDecoration: 'none' }}>Check if you qualify →</a>
          <a href="/blog/fha-vs-conventional-which-is-cheaper" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bbf7d0', textDecoration: 'none' }}>FHA vs Conventional: which is cheaper →</a>
          <a href="/blog/usda-loan-eligibility" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bbf7d0', textDecoration: 'none' }}>USDA eligibility guide →</a>
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
          This guide is for general informational purposes only and is not financial or lending advice. Refinance
          requirements, rates, and fees vary by lender, loan type, and individual circumstances. Confirm current
          eligibility with a licensed lender before making decisions.
        </p>

        <RelatedTools tools={[{href:'/refinance',label:'Refinance Calculator'},{href:'/heloc',label:'HELOC Calculator'},{href:'/mortgage',label:'Mortgage Calculator'}]} />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <a href="/blog" style={{ background: '#fff', color: '#2563eb', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, border: '1px solid #bfdbfe', textDecoration: 'none' }}>← All Articles</a>
          <a href="/qualify" style={{ background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>Mortgage Qualifier</a>
        </div>
      </div>
    </div>
  );
}
