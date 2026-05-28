import Script from 'next/script';
import type { Metadata } from 'next';
import MortgageCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Mortgage Calculator 2026 | Payment, Amortization & Comparison | freecalcs.io',
  description: 'Calculate monthly mortgage payments with full amortization schedule, extra payment impact, and loan comparison. Includes PMI, taxes, and insurance.',
  alternates: { canonical: 'https://www.freecalcs.io/mortgage' },
  openGraph: {
    title: 'Mortgage Calculator 2026 | freecalcs.io',
    description: 'Full mortgage payment breakdown with amortization, extra payments, and loan comparison.',
    url: 'https://www.freecalcs.io/mortgage',
    siteName: 'freecalcs.io',
    type: 'website',
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
          "name": "How is a monthly mortgage payment calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Monthly payments are calculated using the loan amount, interest rate, and loan term. The formula accounts for amortization so each payment covers both principal and interest, with early payments being mostly interest."
          }
        },
        {
          "@type": "Question",
          "name": "What is PMI and when is it required?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. PMI typically costs 0.5% to 1% of the loan amount annually and can be removed once you reach 20% equity."
          }
        },
        {
          "@type": "Question",
          "name": "Should I get a 15-year or 30-year mortgage?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 15-year mortgage has higher monthly payments but saves roughly half the total interest compared to a 30-year. A 30-year offers lower payments and more flexibility. Choose based on your budget and financial goals."
          }
        },
        {
          "@type": "Question",
          "name": "How much do extra payments save?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Even an extra $100 per month on a $320,000 mortgage at 6.5% can save over $45,000 in interest and pay off the loan 4-5 years early. Extra payments go directly toward principal reduction."
          }
        },
        {
          "@type": "Question",
          "name": "What credit score do I need for the best mortgage rate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A credit score of 740 or higher typically qualifies for the best conventional mortgage rates. Scores between 680-739 get good rates, while FHA loans accept scores as low as 580 with a 3.5% down payment."
          }
        }
      ]
    },
    {
      "@type": "WebApplication",
      "name": "Mortgage Calculator",
      "url": "https://www.freecalcs.io/mortgage",
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
  { q: 'How is a monthly mortgage payment calculated?', a: "Your monthly payment uses the formula: P × [r(1+r)^n] / [(1+r)^n - 1], where P is the loan amount, r is the monthly rate (annual ÷ 12), and n is total payments. For a $400,000 loan at 6.27% for 30 years, that's ~$2,469/month in principal and interest." },
  { q: 'What is PMI and when is it required?', a: 'Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. It typically costs 0.5–1% of the loan amount per year and is automatically removed once you reach 20% equity.' },
  { q: 'Should I get a 15-year or 30-year mortgage?', a: 'A 15-year mortgage saves roughly half the total interest but has ~40% higher monthly payments. A 30-year offers lower payments and flexibility. Choose based on your budget and financial goals.' },
  { q: 'How much do extra payments save?', a: 'Even $100–$200 extra per month can save tens of thousands in interest. For a $400,000 loan at 6.27%, an extra $200/month saves ~$58,000 in interest and pays off the loan 5 years early. Use the extra payment field above to see your exact savings.' },
  { q: 'What credit score do I need for the best mortgage rate?', a: 'A score of 740+ typically qualifies for the best conventional rates. Scores 680–739 get good rates, while FHA accepts as low as 580 with 3.5% down. Each 20-point improvement can lower your rate by ~0.125–0.25%.' },
];

export default function Page() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} />
      <MortgageCalculator />
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Frequently Asked Questions</h2>
        {faqUi.map(({ q, a }) => (
          <details key={q} style={{ borderBottom: '1px solid #e5e7eb', padding: '14px 0' }}>
            <summary style={{ fontWeight: 700, fontSize: 15, color: '#111', cursor: 'pointer', listStyle: 'none' }}>{q}</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
