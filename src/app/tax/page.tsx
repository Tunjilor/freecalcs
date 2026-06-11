import Script from 'next/script';
import type { Metadata } from 'next';
import TaxCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Federal Income Tax Calculator 2025 & 2026 | Refund Estimator',
  description: 'Estimate your 2025 or 2026 federal income tax, refund, and effective rate. Pick your tax year for the right IRS standard deduction and brackets, plus capital gains and self-employment tax.',
  alternates: { canonical: 'https://www.freecalcs.io/tax' },
  openGraph: { title: 'Federal Income Tax Calculator 2025 & 2026 | freecalcs.io', description: 'Estimate your 2025 or 2026 federal tax bill or refund. Switch tax year for updated standard deductions and IRS brackets.', url: 'https://www.freecalcs.io/tax', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Federal Income Tax Calculator 2025 & 2026 | freecalcs.io', description: 'Estimate your 2025 or 2026 federal tax bill or refund with full bracket breakdown.' },
};

const faqs = [
  {
    q: "What's the difference between the 2025 and 2026 tax year?",
    a: "The 2025 tax year is what you file a return for in early 2026; the 2026 tax year is what you'll file in early 2027 and what you plan for during 2026. The brackets and standard deduction are slightly higher for 2026 due to inflation adjustments.",
  },
  {
    q: 'What is the standard deduction for 2026?',
    a: '$16,100 for single filers and those married filing separately, $24,150 for heads of household, and $32,200 for married couples filing jointly.',
  },
  {
    q: 'Does a higher tax bracket mean all my income is taxed at that rate?',
    a: 'No. Only the portion of your income above each threshold is taxed at the higher rate. The rest is taxed at the lower rates beneath it, so your overall effective rate is lower than your top bracket.',
  },
  {
    q: "What's the difference between marginal and effective tax rate?",
    a: 'Your marginal rate is the rate on your last dollar of income (your bracket). Your effective rate is your total tax divided by your total income — always lower, because of the layered system.',
  },
  {
    q: 'Is this calculator the same as my actual tax bill?',
    a: "It's a close estimate of federal income tax based on your income, filing status, and the standard deduction. It doesn't include every credit, state tax, or special situation, so treat it as a planning tool, not a filed return.",
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'WebApplication',
      name: 'Federal Income Tax Calculator',
      url: 'https://www.freecalcs.io/tax',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
};

const h2Main: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 };
const h2Sub: React.CSSProperties = { fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 };
const para: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 };

export default function Page() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <TaxCalculator />

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          {/* Intro */}
          <p style={{ fontSize: 17, color: '#334155', lineHeight: 1.75, marginBottom: 36 }}>
            This calculator estimates your U.S. federal income tax. Pick your tax year and filing status, enter your
            income, and it applies the current standard deduction and the seven federal tax brackets to estimate what
            you owe. Use 2025 to check a return you&apos;ve already filed, or 2026 to plan for the year ahead.
          </p>

          <h2 style={h2Main}>2025 vs 2026 — what changed</h2>
          <p style={para}>
            Each year the IRS adjusts the standard deduction and bracket thresholds for inflation, so the same income
            can owe slightly different tax depending on the year. For 2026, the standard deduction rises to $16,100 for
            single filers and $32,200 for married couples filing jointly, up from $15,750 and $31,500 in 2025. The seven
            tax rates themselves (10% through 37%) are unchanged. A major law, the One Big Beautiful Bill Act passed in
            2025, made the current rate structure permanent and added some new deductions — so the days of the brackets
            expiring are, for now, behind us.
          </p>

          <h2 style={h2Sub}>How federal income tax actually works</h2>
          <p style={para}>
            The U.S. uses a progressive system, which is widely misunderstood. Your &ldquo;tax bracket&rdquo; is not the
            rate you pay on all your income — it&apos;s the rate on your top dollar. Income is taxed in layers: the first
            chunk at 10%, the next at 12%, and so on. So someone &ldquo;in the 22% bracket&rdquo; pays 10% and 12% on the
            lower portions of their income and only 22% on the part above that threshold. That&apos;s why your effective
            rate (total tax ÷ total income) is always lower than your bracket. The calculator above does this layered
            math for you.
          </p>

          <h2 style={h2Sub}>Standard deduction vs itemizing</h2>
          <p style={para}>
            Before brackets apply, you subtract either the standard deduction or your itemized deductions — whichever is
            larger. Most filers take the standard deduction because it now exceeds what they could itemize. You&apos;d
            itemize only if deductible expenses (like mortgage interest, state and local taxes, and charitable gifts) add
            up to more than your standard deduction.
          </p>
        </div>
      </article>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 24px' }}>
        <h2 style={h2Main}>Frequently Asked Questions</h2>
        {faqs.map(({ q, a }) => (
          <details key={q} style={{ borderBottom: '1px solid #e5e7eb', padding: '14px 0' }}>
            <summary style={{ fontWeight: 700, fontSize: 15, color: '#111', cursor: 'pointer', listStyle: 'none' }}>{q}</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{a}</p>
          </details>
        ))}
      </section>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 64px' }}>
        <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, fontStyle: 'italic', borderTop: '1px solid #e5e7eb', paddingTop: 20, marginBottom: 28 }}>
          This calculator provides estimates for general informational purposes only and is not tax advice. It covers
          federal income tax using the standard deduction and does not account for all credits, state taxes, or
          individual circumstances. Consult a qualified tax professional or the IRS for your specific situation.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="/salary" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Salary take-home calculator →</a>
          <a href="/blog/2026-tax-brackets-guide" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>2026 tax brackets explained →</a>
        </div>
      </div>
    </>
  );
}
