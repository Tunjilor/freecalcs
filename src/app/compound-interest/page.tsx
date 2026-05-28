import Script from 'next/script';
import type { Metadata } from 'next';
import CompoundInterestCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | Growth Chart & Year-by-Year Table | freecalcs.io',
  description: 'See how your money grows with compound interest. Visual growth chart, year-by-year breakdown, contribution impact, inflation adjustment, and Rule of 72.',
  alternates: { canonical: 'https://www.freecalcs.io/compound-interest' },
  openGraph: {
    title: 'Compound Interest Calculator | freecalcs.io',
    description: 'Compound interest with growth chart, contributions, inflation, and Rule of 72.',
    url: 'https://www.freecalcs.io/compound-interest',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator | freecalcs.io',
    description: 'Growth chart, contributions, inflation adjustment, and Rule of 72.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is compound interest?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Compound interest is interest earned on both your initial principal and on the interest that has already been added. This creates exponential growth over time, unlike simple interest which only earns on the original amount."
          }
        },
        {
          "@type": "Question",
          "name": "How often should interest compound?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The more frequently interest compounds, the more you earn. Daily compounding yields slightly more than monthly, which yields more than annually. Most savings accounts compound daily, while many investments compound monthly or quarterly."
          }
        },
        {
          "@type": "Question",
          "name": "What is the Rule of 72?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Rule of 72 is a quick way to estimate how long it takes to double your money. Divide 72 by your annual interest rate. For example, at 8% interest, your money doubles in approximately 9 years (72 / 8 = 9)."
          }
        },
        {
          "@type": "Question",
          "name": "How does inflation affect compound interest?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Inflation reduces the real purchasing power of your returns. If your investment earns 8% but inflation is 3%, your real return is approximately 5%. Always consider inflation-adjusted returns when planning long-term."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between APR and APY?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "APR (Annual Percentage Rate) is the stated interest rate without compounding. APY (Annual Percentage Yield) includes the effect of compounding. APY is always equal to or higher than APR and reflects what you actually earn."
          }
        },
        {
          "@type": "Question",
          "name": "How much will $10,000 grow in 20 years?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "At 7% compounded annually, $10,000 grows to approximately $38,697 in 20 years. At 10%, it grows to about $67,275. Adding monthly contributions dramatically increases the final amount."
          }
        },
        {
          "@type": "Question",
          "name": "How do regular monthly contributions affect compound interest growth?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "$10,000 invested at 7% with no contributions grows to about $76,000 in 30 years. Add $200 per month and it grows to about $318,000. Add $500 per month and it reaches about $620,000. The contributions themselves are only $72,000 and $180,000 respectively — the rest is compounding. Consistent monthly investing is the most powerful wealth-building habit."
          }
        }
      ]
    },
    {
      "@type": "WebApplication",
      "name": "Compound Interest Calculator",
      "url": "https://www.freecalcs.io/compound-interest",
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
  { q: 'What is the difference between simple and compound interest?', a: 'Simple interest is calculated only on the principal. Compound interest is calculated on principal plus accumulated interest, creating exponential growth. At 7%, $10,000 grows to $31,000 over 30 years with simple interest but $76,123 with annual compounding.' },
  { q: 'How does compounding frequency affect growth?', a: '$10,000 at 6% APR over 10 years: annual compounding → $18,061; monthly compounding → $18,167; daily compounding → $18,196. The jump from annual to monthly compounding is the most meaningful difference.' },
  { q: 'What is the Rule of 72?', a: "Divide 72 by your annual interest rate to estimate how long it takes to double your money. At 6%, money doubles in ~12 years; at 8%, ~9 years; at 10%, ~7.2 years. It's accurate within a year or two for most rates." },
  { q: 'Why does starting to invest early matter so much?', a: '$5,000 invested at age 25 at 7% grows to ~$71,000 by age 65. The same $5,000 invested at 35 only grows to ~$37,000. Starting 10 years earlier nearly doubles the outcome — without investing any more money.' },
  { q: 'What is the difference between APR and APY?', a: 'APR is the stated interest rate without compounding effects. APY includes compounding within the year. At 6% APR compounded monthly, the APY is 6.168%. APY is what you actually earn on deposits; APR is what lenders advertise for loans.' },
  { q: 'How do regular monthly contributions affect compound interest growth?', a: "Monthly contributions dramatically accelerate growth. $10,000 invested at 7% with no contributions grows to ~$76,000 in 30 years. Add just $200/month and it grows to ~$318,000. Add $500/month and it reaches ~$620,000. The contributions themselves are only $72,000 and $180,000 respectively — the rest is compounding. This is why consistent, automatic investing every month is the single most powerful wealth-building habit." },
  { q: 'What will $10,000 grow to in 20 years?', a: "At 6% compounded annually: ~$32,071. At 7%: ~$38,697. At 8%: ~$46,610. At 10%: ~$67,275. At 12%: ~$96,463. The difference between 6% and 10% is enormous — $10,000 becomes either $32K or $67K, more than double. This illustrates why investment fees and return rates matter so much over long time horizons." },
];

export default function Page() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} />
      <CompoundInterestCalculator />
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
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>Why Compound Interest Is the Most Powerful Force in Personal Finance</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The phrase often attributed to Einstein — "compound interest is the eighth wonder of the world" — captures something mathematically true: compounding turns time into money. Unlike simple interest which earns only on the original principal, compound interest earns on principal plus all previously accumulated interest. This creates exponential growth that accelerates as the years pass.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>At 7% annual return, $10,000 grows to $38,697 in 20 years and $76,123 in 30 years. The extra 10 years nearly doubles the outcome — not because you added any money, but because compounding had more time to work. This is why financial advisors repeat "start early" so insistently. Waiting a decade to begin investing can cost more than the total amount you eventually invest.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>The Three Variables That Control Your Growth</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}><strong>Rate of return</strong> is important but often over-focused. The difference between 6% and 8% on $10,000 over 30 years is $43,000 — significant, but not controllable. What you can control: reducing investment fees (each 1% fee costs you roughly 28% of your final balance over 30 years), choosing diversified low-cost index funds, and avoiding panic-selling during market downturns.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}><strong>Regular contributions</strong> are the most underappreciated lever. Contributing $500/month at 7% for 30 years produces $567,000 — far more than a one-time $50,000 investment ($380,000 at the same rate). The contributions themselves total only $180,000; the other $387,000 is pure compounding.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}><strong>Compounding frequency</strong> matters less than people think. Daily compounding versus monthly compounding on $10,000 at 6% for 10 years produces a difference of only $29. Focus your energy on rate and contributions, not finding accounts that compound more frequently.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Compound Interest Works Against You Too</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>Credit card debt compounds at 20–30% annually. A $5,000 balance at 24% APR grows to $25,795 in 10 years if you make no payments. The same math that makes investing powerful makes high-interest debt catastrophic. Paying off 20%+ interest debt before investing (except for employer 401k matches) is almost always the mathematically correct decision.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/loan" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Loan & interest calculator →</a>
            <a href="/blog/compound-interest-explained" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Deep dive: compound interest →</a>
          </div>
        </div>
      </article>
    </>
  );
}