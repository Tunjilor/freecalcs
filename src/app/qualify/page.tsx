import type { Metadata } from 'next';
import MortgageQualifier from './calculator';

export const metadata: Metadata = {
  title: 'Mortgage Qualifier Calculator 2026 | Do I Qualify? | freecalcs.io',
  description: 'Find out if you qualify for a mortgage. Checks Conventional, FHA, VA, USDA, and Jumbo loans. DTI analysis, credit score impact, and improvement tips.',
  alternates: { canonical: 'https://www.freecalcs.io/qualify' },
  openGraph: { title: 'Mortgage Qualifier Calculator 2026 | freecalcs.io', description: 'Instant mortgage qualification check for all 5 loan programs.', url: 'https://www.freecalcs.io/qualify', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Mortgage Qualifier 2026 | freecalcs.io', description: 'Instant mortgage qualification for Conventional, FHA, VA, USDA, and Jumbo loans.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Mortgage Qualifier Calculator',
      url: 'https://www.freecalcs.io/qualify',
      description: 'Find out if you qualify for a mortgage. Checks Conventional, FHA, VA, USDA, and Jumbo loans with DTI analysis and credit score impact.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What credit score do I need to qualify for a mortgage?', acceptedAnswer: { '@type': 'Answer', text: 'Conventional loans require a minimum 620 FICO score; FHA accepts 580 for 3.5% down (or 500 with 10% down); VA loans require 580+ at most lenders; USDA requires 640; Jumbo loans typically need 700+. Scores above 720 unlock the best rates, and every 20-point improvement can reduce your rate by 0.125–0.25%.' } },
        { '@type': 'Question', name: 'What is debt-to-income ratio and what is the maximum allowed?', acceptedAnswer: { '@type': 'Answer', text: 'DTI is monthly debt payments divided by gross monthly income. Front-end DTI (housing only) should be 28% or less; back-end DTI (all debts) should be 43% or less for conventional loans. FHA allows up to 57% back-end DTI in some cases.' } },
        { '@type': 'Question', name: 'What is the difference between pre-qualification and pre-approval?', acceptedAnswer: { '@type': 'Answer', text: 'Pre-qualification is a quick estimate based on self-reported income and debts — no credit check, takes minutes. Pre-approval involves a hard credit pull and full document review, resulting in a conditional commitment letter. Sellers take pre-approval far more seriously.' } },
        { '@type': 'Question', name: 'How much down payment do I need to buy a home?', acceptedAnswer: { '@type': 'Answer', text: 'Conventional loans allow as little as 3% down (PMI applies below 20%). FHA requires 3.5% with a 580+ score or 10% with a 500–579 score. VA and USDA loans require 0% down for eligible buyers. A 20% down payment eliminates PMI (~$100–$300/month on a $400,000 loan).' } },
        { '@type': 'Question', name: 'What documents do lenders require for mortgage approval?', acceptedAnswer: { '@type': 'Answer', text: 'Lenders typically require: 2 years of W-2s or tax returns, recent pay stubs (last 30 days), 2 months of bank statements, a photo ID, and proof of assets for the down payment. Self-employed borrowers must document 2 years of net income after deductions.' } },
      ],
    },
  ],
};

const faqs = [
  { q: 'What credit score do I need to qualify for a mortgage?', a: 'Conventional loans require a minimum 620 FICO score; FHA accepts 580 for 3.5% down (or 500 with 10% down); VA loans require 580+ at most lenders; USDA requires 640; Jumbo loans typically need 700+. Scores above 720 unlock the best rates, and every 20-point improvement can reduce your rate by 0.125–0.25%.' },
  { q: 'What is debt-to-income ratio and what is the maximum allowed?', a: 'DTI is monthly debt payments divided by gross monthly income. Front-end DTI (housing costs only) should be ≤28%; back-end DTI (all debts) should be ≤43% for conventional loans. FHA allows back-end DTI up to 57% in some cases. This calculator checks both ratios against every loan program.' },
  { q: 'What is the difference between pre-qualification and pre-approval?', a: "Pre-qualification is a quick estimate based on self-reported income and debts — no credit check required, takes minutes. Pre-approval involves a hard credit pull and full document review, resulting in a conditional commitment letter. Sellers take pre-approval far more seriously when evaluating offers." },
  { q: 'How much down payment do I need to buy a home?', a: 'Conventional loans allow as little as 3% down (PMI applies below 20%). FHA requires 3.5% with a 580+ score or 10% with a 500–579 score. VA and USDA loans require 0% down for eligible buyers. A 20% down payment eliminates PMI, which typically costs $100–$300/month on a $400,000 loan.' },
  { q: 'What documents do lenders require for mortgage approval?', a: 'Lenders typically require: 2 years of W-2s or tax returns, recent pay stubs (last 30 days), 2 months of bank statements, a photo ID, and proof of assets for the down payment. Self-employed borrowers must document 2 years of net income after deductions.' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MortgageQualifier />
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Frequently Asked Questions</h2>
        {faqs.map(({ q, a }) => (
          <details key={q} style={{ borderBottom: '1px solid #e5e7eb', padding: '14px 0' }}>
            <summary style={{ fontWeight: 700, fontSize: 15, color: '#111', cursor: 'pointer', listStyle: 'none' }}>{q}</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
