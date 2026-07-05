import type { Metadata } from 'next';
import MortgageCalculator from '../../mortgage/calculator';
import ComparisonTable from './comparison-table';
import Author, { AUTHORS } from '@/components/Author';
import ArticleJsonLd from '@/components/ArticleJsonLd';
import RelatedTools from '@/components/blog/RelatedTools';

export const metadata: Metadata = {
  title: 'FHA vs Conventional vs VA vs USDA: Which Loan is Right for You | freecalcs.io',
  description: 'A clear comparison of the four main mortgage loan types. Find out which one you qualify for and which saves you the most money.',
  alternates: { canonical: 'https://www.freecalcs.io/blog/fha-vs-conventional-vs-va-vs-usda' },
  openGraph: { title: 'FHA vs Conventional vs VA vs USDA: Which Loan is Right for You', description: 'A clear comparison of the four main mortgage loan types. Find out which one you qualify for and which saves you the most money.', url: 'https://www.freecalcs.io/blog/fha-vs-conventional-vs-va-vs-usda', siteName: 'freecalcs.io', type: 'article' },
};

const faqs = [
  {
    q: 'Which loan has the lowest down payment?',
    a: 'VA and USDA loans both allow 0% down for eligible borrowers. FHA requires 3.5% down with a 580+ credit score, and conventional loans start as low as 3%.',
  },
  {
    q: 'Is an FHA or conventional loan cheaper?',
    a: 'It depends on how long you keep the loan. FHA is easier to qualify for, but its mortgage insurance can last the life of the loan. Conventional PMI cancels once you reach about 20% equity, so conventional is often cheaper over time for buyers with good credit.',
  },
  {
    q: 'What credit score do I need?',
    a: 'Roughly: 620 for conventional, 580 for FHA at 3.5% down (500 with 10% down), and no official minimum for VA or USDA — though lenders typically look for 580–640.',
  },
  {
    q: 'Can I switch from an FHA loan to a conventional loan later?',
    a: 'Yes. Many buyers start with an FHA loan and refinance into a conventional loan once they have 20% equity, which removes the FHA mortgage insurance.',
  },
  {
    q: "What's the difference between PMI, MIP, the VA funding fee, and the USDA guarantee fee?",
    a: 'They all protect the lender, but they work differently. PMI (conventional) is cancellable. MIP (FHA) has an upfront and annual portion and often lasts the life of the loan. The VA funding fee is a one-time charge with no monthly insurance. The USDA guarantee fee has a small upfront and annual portion. The names differ; the purpose is the same.',
  },
];

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

export default function Article() {
  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif', background: 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)', minHeight: '100vh' }}>
      <ArticleJsonLd
        headline="FHA vs Conventional vs VA vs USDA: Which Loan is Right for You"
        description="A clear comparison of the four main mortgage loan types. Find out which one you qualify for and which saves you the most money."
        url="https://www.freecalcs.io/blog/fha-vs-conventional-vs-va-vs-usda"
        author={AUTHORS.jamie}
        datePublished="2026-04-22"
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
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.3, color: '#fff' }}>FHA vs Conventional vs VA vs USDA: Which Loan is Right for You</h1>
          <p style={{ color: '#93c5fd', fontSize: 15, margin: 0, lineHeight: 1.6 }}>A clear comparison of the four main mortgage loan types. Find out which one you qualify for and which saves you the most money.</p>
        </div>
      </div>

      {/* Intro + comparison table */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 16px 8px' }}>
        {/* Author byline + bio */}
        <Author author={AUTHORS.jamie} />

        <p style={{ fontSize: 17, color: '#334155', lineHeight: 1.75, margin: '0 0 32px' }}>
          Conventional, FHA, VA, and USDA are the four main ways to finance a home in the United States. The difference
          between them comes down to a few things: how much you must put down, the credit score you need, and — the big
          one — how you pay for mortgage insurance. This guide compares all four side by side so you can see which fits
          your situation, then estimate a real monthly payment with the calculator below. (All figures reflect 2026
          program rules.)
        </p>

        <section style={{ marginBottom: 28 }}>
          <h2 style={h2Style}>How the four loan types compare</h2>
          <p style={{ ...pStyle, margin: '0 0 18px' }}>
            Scroll the table sideways on a phone to see every program. The clearest differences show up in the mortgage
            insurance and upfront fee rows.
          </p>
          <ComparisonTable />
        </section>
      </div>

      {/* Embedded mortgage calculator, directly below the table (full-width band) */}
      <MortgageCalculator embedded />

      {/* Internal links + remaining editorial */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '8px 16px 40px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '0 0 36px' }}>
          <a href="/mortgage" style={{ background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, textDecoration: 'none' }}>Open the full Mortgage Calculator →</a>
          <a href="/qualify" style={{ background: '#fff', color: '#2563eb', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bfdbfe', textDecoration: 'none' }}>Check if you qualify →</a>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>The biggest difference is mortgage insurance</h2>
          <p style={pStyle}>
            Down payment usually gets the attention, but mortgage insurance is what quietly drives long-term cost. With a
            conventional loan, PMI goes away once you build about 20% equity. FHA insurance, by contrast, sticks around
            for the life of the loan unless you put at least 10% down. VA loans skip monthly insurance entirely in
            exchange for a one-time funding fee, which is why they&apos;re often the cheapest option over time for those who
            qualify. USDA sits in between: low fees that never fully disappear. So the &ldquo;cheapest&rdquo; loan depends
            less on the down payment and more on how long you&apos;ll keep the loan and how fast you&apos;ll build equity.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Which loan is right for you?</h2>
          <p style={pStyle}>
            If you have strong credit and can eventually reach 20% equity, a conventional loan avoids permanent
            insurance. If your credit is in the 500s–low 600s or your down payment is small, FHA is the most forgiving.
            If you&apos;ve served in the military, a VA loan is almost always the best deal — no down payment and no monthly
            insurance. And if you&apos;re buying in a rural or suburban area and your income is moderate, USDA offers a
            zero-down option with the lowest ongoing fees. Many buyers qualify for more than one, so it&apos;s worth comparing
            the total cost, not just the monthly payment.
          </p>
        </section>

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
          This guide is for general informational purposes only and is not financial or lending advice. Loan terms,
          fees, and limits vary by lender, county, and your individual situation. Confirm current details with a
          licensed lender before making decisions.
        </p>

        <RelatedTools tools={[{href:'/qualify',label:'Mortgage Qualifier'},{href:'/va-loan',label:'VA Loan Calculator'},{href:'/home-affordability',label:'Home Affordability Calculator'}]} />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <a href="/blog" style={{ background: '#fff', color: '#2563eb', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, border: '1px solid #bfdbfe', textDecoration: 'none' }}>← All Articles</a>
          <a href="/qualify" style={{ background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>Mortgage Qualifier</a>
        </div>
      </div>
    </div>
  );
}
