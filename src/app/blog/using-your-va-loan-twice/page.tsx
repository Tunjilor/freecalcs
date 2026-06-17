import type { Metadata } from 'next';
import Author, { AUTHORS } from '@/components/Author';
import ArticleJsonLd from '@/components/ArticleJsonLd';

const URL = 'https://www.freecalcs.io/blog/using-your-va-loan-twice';
const PUBLISHED = '2026-06-17';
const MODIFIED = '2026-06-17';

export const metadata: Metadata = {
  title: 'Using Your VA Loan Twice (and What My Disability Rating Changed) | freecalcs.io',
  description: "A veteran's first-hand account of buying twice with the VA loan — restoring entitlement after a sale, $0 down both times, and how a service-connected disability rating waived the funding fee and unlocked a major Georgia property-tax exemption.",
  keywords: ['VA loan second time', 'reuse VA loan', 'VA entitlement restoration', 'VA funding fee disabled veteran', 'Georgia disabled veteran property tax', 'VA loan no down payment'],
  authors: [{ name: 'Jamie' }],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Using Your VA Loan Twice (and What My Disability Rating Changed)',
    description: 'Buying twice with the VA benefit — entitlement, $0 down, the funding fee waiver, and the Georgia disabled-veteran property tax exemption.',
    url: URL,
    siteName: 'freecalcs.io',
    type: 'article',
  },
  twitter: { card: 'summary_large_image' },
};

const faqs = [
  {
    q: 'Can you use a VA loan more than once?',
    a: 'Yes. There is no limit over your lifetime and no first-time-buyer requirement. Selling a VA-financed home and paying off the loan restores your full entitlement, letting you buy again with zero down.',
  },
  {
    q: 'Do disabled veterans pay the VA funding fee?',
    a: 'No. Veterans receiving compensation for a service-connected disability are exempt from the VA funding fee entirely. On a typical purchase that is thousands of dollars saved.',
  },
  {
    q: 'What is the Georgia property tax exemption for disabled veterans?',
    a: 'Georgia exempts roughly $85,645 of assessed value (2026 figure, indexed annually) from all ad valorem property taxes on the primary residence of a veteran rated 100% permanently and totally disabled, or paid at that rate due to unemployability. You apply once through your county tax assessor with your VA documentation.',
  },
  {
    q: 'Do you need a down payment for a second VA loan?',
    a: 'No. With restored full entitlement, a second VA purchase can be made with $0 down and no monthly mortgage insurance, exactly like the first.',
  },
  {
    q: 'Does selling my first home restore my VA entitlement?',
    a: 'Yes — selling the property and paying off the VA loan generally restores full entitlement, so you can reuse the benefit with no loan cap on the next purchase.',
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
const affiliateStyle: React.CSSProperties = { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '16px 20px', margin: '0 0 16px', fontSize: 15, color: '#374151', lineHeight: 1.7 };

export default function Article() {
  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif', background: 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)', minHeight: '100vh' }}>
      <ArticleJsonLd
        headline="Using Your VA Loan Twice (and What My Disability Rating Changed)"
        description="A veteran's first-hand account of buying twice with the VA loan — restoring entitlement after a sale, $0 down both times, and how a service-connected disability rating waived the funding fee and unlocked a major Georgia property-tax exemption."
        url={URL}
        author={AUTHORS.jamie}
        datePublished={PUBLISHED}
        dateModified={MODIFIED}
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
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.3, color: '#fff' }}>Using Your VA Loan Twice (and What My Disability Rating Changed)</h1>
          <p style={{ color: '#93c5fd', fontSize: 15, margin: 0, lineHeight: 1.6 }}>Buying twice with the VA benefit — entitlement, $0 down, the funding fee waiver, and the Georgia disabled-veteran property tax exemption.</p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 16px 40px' }}>
        {/* Author byline + bio */}
        <Author author={AUTHORS.jamie} />

        {/* Intro */}
        <p style={{ fontSize: 17, color: '#334155', lineHeight: 1.75, margin: '0 0 36px' }}>
          Most VA loan guides are written by people who&apos;ve never pulled a Certificate of Eligibility in their life.
          I&apos;ve used the benefit twice, in two different states, under two very different sets of circumstances — once
          as a healthy junior enlisted guy, and once after I&apos;d come home with a service-connected disability. The
          second time around was a completely different experience, and almost nobody writes about what actually changes.
          So here&apos;s the version I wish someone had handed me.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>You can absolutely use the VA loan more than once</h2>
          <p style={pStyle}>
            This is the first thing people get wrong. They think the VA loan is a one-shot, first-time-buyer benefit. It
            isn&apos;t. There&apos;s no limit on how many times you can use it over a lifetime, and there&apos;s no
            first-time-buyer requirement at all.
          </p>
          <p style={pStyle}>
            The piece that makes reuse work is something called <strong>entitlement</strong> — the amount the VA
            guarantees on your behalf. When I bought in Clearwater around 2014, I used part of my entitlement. When I sold
            that house in 2017 and paid off the loan, my <strong>full entitlement was restored</strong>. That&apos;s the
            key move: sell the home, pay off the VA loan, and your entitlement resets so you can buy again with zero down
            on the next one. If you keep the first home and try to buy a second with a VA loan, it gets more complicated —
            you&apos;re working with whatever entitlement is left. But a clean sale wipes the slate.
          </p>
          <p style={pStyle}>
            If you want to see whether you&apos;d clear a lender&apos;s numbers on a second purchase, our{' '}
            <a href="/qualify" style={linkStyle}>mortgage qualifier</a> runs your DTI against the VA program the same way a
            loan officer would.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>$0 down — both times</h2>
          <p style={pStyle}>
            I put the minimum down on both houses, and for a VA loan the minimum is <strong>nothing</strong>. Zero. Both
            times I financed 100% of the purchase price with no down payment and no monthly mortgage insurance.
          </p>
          <p style={pStyle}>
            That second part is the quietly huge one. On an FHA or a low-down conventional loan you&apos;re paying mortgage
            insurance every single month — often $100 to $300 on a typical loan. The VA loan has none of that, ever, even
            with nothing down. Over the years I&apos;ve owned these homes, that&apos;s real money that stayed in my pocket
            instead of going to an insurer. If you want to see the gap for yourself, run a VA scenario (no PMI) against an
            FHA one in our <a href="/mortgage" style={linkStyle}>mortgage calculator</a> — the monthly difference
            surprises people.
          </p>
          <p style={affiliateStyle}>
            Thinking about a VA purchase and want to compare real rates from VA-friendly lenders without a hard credit
            pull? <a href="#" style={linkStyle}>Compare lender options here</a>.{' '}
            <em style={{ color: '#92400e', fontStyle: 'italic' }}>(affiliate link)</em>
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>What my disability rating changed</h2>
          <p style={pStyle}>
            Here&apos;s where my two purchases really diverged, and it&apos;s the part I most want other disabled vets to
            understand.
          </p>
          <p style={pStyle}>
            <strong>The funding fee disappeared.</strong> The VA loan doesn&apos;t charge monthly insurance, but it does
            charge a one-time <strong>funding fee</strong> — usually around 2.15% of the loan amount for a first-time,
            no-down purchase. On my first home, that fee applied (you can roll it into the loan, which I did). But veterans
            who receive compensation for a service-connected disability are <strong>exempt from the funding fee
            entirely</strong>. By the time I bought in Georgia in 2020, I was receiving disability compensation, so the fee
            was simply waived — on a typical loan, thousands of dollars I didn&apos;t pay. Same benefit, completely
            different cost.
          </p>
          <p style={pStyle}>
            <strong>Georgia gave me a property tax break I didn&apos;t expect.</strong> This one I had to learn after the
            fact. Georgia offers a homestead property-tax exemption for veterans rated 100% permanently and totally
            service-connected disabled — or paid at that rate due to individual unemployability. For 2026 it exempts
            roughly <strong>$85,645 of your home&apos;s assessed value</strong> from all ad valorem taxes — state, county,
            municipal, and school — on your primary residence, and the figure indexes up most years. Because Georgia
            assesses homes at 40% of fair market value, that exemption erases a large chunk of the tax bill, and for a lot
            of homes around here it wipes out most of it. It&apos;s not automatic — you file a one-time application with
            your county assessor and show your VA disability documentation. I qualified, and I almost left it on the table
            because nobody told me to apply. If that&apos;s you, don&apos;t make the same mistake.
          </p>
          <p style={pStyle}>
            There&apos;s even a separate exemption that removes the annual ad valorem or title tax on one personal vehicle
            for totally disabled vets — different from the home, but worth knowing.
          </p>
          <p style={affiliateStyle}>
            Not sure of your current rating or how it affects fees? It&apos;s worth confirming before you shop.{' '}
            <a href="#" style={linkStyle}>Check your credit and VA eligibility profile</a>.{' '}
            <em style={{ color: '#92400e', fontStyle: 'italic' }}>(affiliate link)</em>
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>What I&apos;d tell a vet buying for the first or second time</h2>
          <p style={pStyle}>A few things experience taught me that the brochures don&apos;t:</p>
          <p style={pStyle}>
            <strong>Get your Certificate of Eligibility early, but don&apos;t stress about it.</strong> Most lenders pull
            it instantly through the VA portal. Both times mine came back the same day. If they need paperwork, it&apos;s
            usually your DD-214.
          </p>
          <p style={pStyle}>
            <strong>The VA cares about residual income, not just DTI.</strong> This is unique to VA loans. Beyond your
            debt-to-income ratio, the VA looks at the actual cash left in your budget each month after your big
            obligations. A strong residual income can carry you past a higher DTI or a thinner credit file. It&apos;s a
            more humane way to underwrite, honestly.
          </p>
          <p style={pStyle}>
            <strong>Shop more than one lender.</strong> Not every lender treats VA loans — or disabled veterans — the same
            way, and rate quotes vary more than you&apos;d think. Even a quarter-point difference is tens of thousands of
            dollars over 30 years.
          </p>
          <p style={pStyle}>
            <strong>Confirm the property meets VA standards.</strong> The VA appraisal isn&apos;t just about value; it
            checks that the home is safe, sound, and sanitary (the Minimum Property Requirements). It&apos;s protected me
            from a couple of money pits.
          </p>
          <p style={pStyle}>
            If you want the full eligibility breakdown — service requirements, the COE, surviving-spouse rules — I wrote a
            companion piece: <a href="/blog/va-loan-eligibility" style={linkStyle}>VA Loan Eligibility 2026</a>. And if
            you&apos;re weighing VA against the other zero-and-low-down options,{' '}
            <a href="/blog/fha-vs-conventional-vs-va-vs-usda" style={linkStyle}>FHA vs Conventional vs VA vs USDA</a> lays
            them side by side.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Bottom line</h2>
          <p style={pStyle}>
            The VA loan got me into two homes with nothing down and no monthly mortgage insurance, and the second time —
            once I was receiving disability compensation — it cost me even less, between the waived funding fee and
            Georgia&apos;s property-tax exemption. If you&apos;ve earned this benefit, use it, and use all of it. The
            savings are bigger than most people realize, and a lot of them only show up if you know to ask.
          </p>
        </section>

        {/* Related links */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '0 0 36px' }}>
          <a href="/mortgage" style={{ background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, textDecoration: 'none' }}>Estimate your payment →</a>
          <a href="/qualify" style={{ background: '#fff', color: '#2563eb', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bfdbfe', textDecoration: 'none' }}>Check if you qualify →</a>
          <a href="/blog/va-loan-eligibility" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bbf7d0', textDecoration: 'none' }}>VA eligibility guide →</a>
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
          This article reflects the author&apos;s personal experience and is for general informational purposes only — it
          is not financial, tax, or lending advice. VA program rules, the funding fee, and state tax exemptions vary by
          service history, disability status, county, and year. Confirm current figures and your eligibility with the VA,
          a VA-approved lender, and your county tax assessor before making decisions.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/blog" style={{ background: '#fff', color: '#2563eb', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, border: '1px solid #bfdbfe', textDecoration: 'none' }}>← All Articles</a>
          <a href="/qualify" style={{ background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>Mortgage Qualifier</a>
        </div>
      </div>
    </div>
  );
}
