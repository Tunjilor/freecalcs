import Script from 'next/script';
import type { Metadata } from 'next';
import TaxCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Federal Income Tax Calculator 2026 | Refund Estimator | freecalcs.io',
  description: 'Estimate your 2026 federal tax bill or refund. Bracket breakdown, capital gains tax, self-employment tax, child tax credit, and tax planning tips.',
  alternates: { canonical: 'https://www.freecalcs.io/tax' },
  openGraph: { title: 'Federal Income Tax Calculator 2026 | freecalcs.io', description: 'Estimate your 2026 federal tax bill or refund.', url: 'https://www.freecalcs.io/tax', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Federal Income Tax Calculator 2026 | freecalcs.io', description: 'Estimate your 2026 federal tax bill or refund with full bracket breakdown.' },
};
const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do federal tax brackets work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tax brackets are marginal, meaning only the income within each bracket is taxed at that rate. For example, if you earn $50,000, you do not pay 22% on all of it. The first $11,600 is taxed at 10%, the next portion at 12%, and so on."
          }
        },
        {
          "@type": "Question",
          "name": "Should I take the standard deduction or itemize?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Take whichever is larger. The 2026 standard deduction is $16,100 for single filers and $32,200 for married filing jointly. Itemize only if your mortgage interest, SALT (capped at $10,000), charitable donations, and other deductions exceed these amounts."
          }
        },
        {
          "@type": "Question",
          "name": "What is the capital gains tax rate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Long-term capital gains (assets held over one year) are taxed at 0%, 15%, or 20% depending on your income. Short-term gains are taxed as ordinary income. Most people pay the 15% long-term rate."
          }
        },
        {
          "@type": "Question",
          "name": "How does the child tax credit work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The child tax credit provides up to $2,000 per qualifying child under age 17. Up to $1,700 is refundable, meaning you can receive it even if you owe no tax. Income phase-outs begin at $200,000 for single filers."
          }
        },
        {
          "@type": "Question",
          "name": "What is self-employment tax?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Self-employed individuals pay both the employer and employee portions of Social Security and Medicare, totaling 15.3% on net earnings. You can deduct half of this amount from your gross income on your tax return."
          }
        }
      ]
    },
    {
      "@type": "WebApplication",
      "name": "Income Tax Calculator",
      "url": "https://www.freecalcs.io/tax",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
};

const faqUi = [
  { q: 'What are the 2026 federal income tax brackets?', a: 'For single filers in 2026: 10% up to $11,925; 12% $11,925–$48,475; 22% $48,475–$103,350; 24% $103,350–$197,300; 32% $197,300–$250,525; 35% $250,525–$626,350; 37% above $626,350. Married filing jointly thresholds are roughly double.' },
  { q: 'Should I take the standard deduction or itemize?', a: 'Take whichever is larger. The 2026 standard deduction is $16,100 for single filers and $32,200 for married filing jointly (increased from 2025 under TCJA). Itemize only if your combined mortgage interest, state and local taxes (SALT, capped at $10,000), charitable donations, and other deductions exceed these amounts.' },
  { q: 'What is the Child Tax Credit for 2026?', a: 'The Child Tax Credit provides up to $2,000 per qualifying child under age 17. Up to $1,700 is refundable — meaning you can receive it even if you owe no federal tax. The credit phases out starting at $200,000 of income for single filers and $400,000 for married filing jointly.' },
  { q: 'What is the difference between a tax deduction and a tax credit?', a: 'A deduction reduces taxable income — a $1,000 deduction in the 22% bracket saves $220. A credit reduces your tax bill dollar-for-dollar — a $1,000 credit saves $1,000. Credits are generally far more valuable than equivalent deductions.' },
  { q: 'How are capital gains taxed differently from regular income?', a: 'Long-term capital gains (assets held over 1 year) are taxed at 0%, 15%, or 20% — much lower than ordinary income rates. Short-term gains (held ≤ 1 year) are taxed as ordinary income. Most middle-income earners pay 15% on long-term gains.' },
  { q: 'What is self-employment tax?', a: 'Self-employed individuals pay both employer and employee portions of Social Security and Medicare, totaling 15.3% on net earnings. You can deduct half of this on your return. Additionally, self-employed people can deduct health insurance premiums and contribute to a Solo 401(k) or SEP-IRA to reduce taxable income.' },
];

export default function Page() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} />
      <TaxCalculator />
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Frequently Asked Questions</h2>
        {faqUi.map(({ q, a }) => (
          <details key={q} style={{ borderBottom: '1px solid #e5e7eb', padding: '14px 0' }}>
            <summary style={{ fontWeight: 700, fontSize: 15, color: '#111', cursor: 'pointer', listStyle: 'none' }}>{q}</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{a}</p>
          </details>
        ))}
      </section>

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>How the US Federal Income Tax System Works</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The United States uses a progressive marginal tax system, meaning different portions of your income are taxed at different rates. The most common misconception is that earning more money can put you in a higher bracket and make you "worse off." That is not how it works. If you move from the 22% bracket into the 24% bracket, only the dollars above the 24% threshold are taxed at 24% — not your entire income.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>For 2026, the seven federal brackets for single filers run from 10% on the first $11,925 of taxable income up to 37% on income above $626,350. Your taxable income is your gross income minus your standard deduction ($16,100 for single filers in 2026) and any other above-the-line deductions like 401(k) contributions, student loan interest, and HSA contributions.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Refund vs Owing: What It Actually Means</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Getting a refund does not mean you paid less tax — it means your employer withheld more than your actual tax liability throughout the year and you're getting the overpayment back. Owing money means your withholding was insufficient. Neither situation changes your total tax bill. The goal should be to get as close to $0 as possible — a big refund means you gave the IRS an interest-free loan all year.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The most accurate way to calculate your expected tax bill is to estimate your total income, subtract your standard deduction (or itemized deductions), apply the brackets to the result, then subtract any tax credits (Child Tax Credit, education credits, etc.). This calculator does all of that automatically.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>The Most Effective Legal Tax Reductions in 2026</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Contributing the maximum to a traditional 401(k) ($23,500 in 2026) reduces taxable income by $23,500. At a 22% marginal rate, that's $5,170 in immediate federal tax savings, plus deferred state taxes. HSA contributions ($4,300 individual / $8,550 family) avoid federal income tax, state income tax, and FICA taxes — a triple benefit no other account offers.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>Tax credits beat deductions dollar-for-dollar. The Child Tax Credit ($2,000 per qualifying child under 17, up to $1,700 refundable) directly reduces your tax bill — not just your taxable income. The Earned Income Tax Credit, education credits, and retirement savings credits can be worth thousands more. Run your numbers in this calculator to see the full picture.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/salary" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Salary take-home calculator →</a>
            <a href="/blog/2026-tax-brackets-guide" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>2026 tax brackets explained →</a>
          </div>
        </div>
      </article>
    </>
  );
}
