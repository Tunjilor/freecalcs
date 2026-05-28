import Script from 'next/script';
import type { Metadata } from 'next';
import SalaryCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Salary & Take-Home Pay Calculator 2026 | All 50 States | freecalcs.io',
  description: 'Free salary and paycheck calculator. See real take-home pay after federal tax, state tax, FICA, and 401k deductions. All 50 states, 2026 rates. No sign-up.',
  alternates: { canonical: 'https://www.freecalcs.io/salary' },
  openGraph: { title: 'Salary & Take-Home Pay Calculator 2026 | All 50 States | freecalcs.io', description: 'Free salary calculator. All 50 states, 2026 rates.', url: 'https://www.freecalcs.io/salary', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Salary & Take-Home Pay Calculator 2026 | freecalcs.io', description: 'Free salary calculator. All 50 states, 2026 rates.' },
};
const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is take-home pay calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Take-home pay starts with gross salary, then subtracts federal income tax, state income tax, Social Security (6.2%), Medicare (1.45%), and any pre-tax deductions like 401(k) contributions and health insurance premiums."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between gross and net pay?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gross pay is your total earnings before any deductions. Net pay (take-home pay) is what you actually receive after federal taxes, state taxes, FICA taxes, and voluntary deductions are subtracted."
          }
        },
        {
          "@type": "Question",
          "name": "How do 401(k) contributions affect my taxes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Traditional 401(k) contributions reduce your taxable income dollar-for-dollar. Contributing $10,000 to a 401(k) in the 22% tax bracket saves approximately $2,200 in federal taxes that year."
          }
        },
        {
          "@type": "Question",
          "name": "Which states have no income tax?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nine states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. This can save thousands per year depending on your income level."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert salary to hourly rate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Divide your annual salary by 2,080 (52 weeks times 40 hours). For example, a $75,000 salary equals approximately $36.06 per hour before taxes."
          }
        }
      ]
    },
    {
      "@type": "WebApplication",
      "name": "Salary Calculator",
      "url": "https://www.freecalcs.io/salary",
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
  { q: 'What is the difference between gross pay and net pay?', a: "Gross pay is your total earnings before deductions. Net pay (take-home) is what you receive after federal tax, state tax, FICA (Social Security + Medicare), and voluntary deductions like 401(k) and health insurance." },
  { q: 'What are FICA taxes and how much do I pay?', a: 'FICA includes Social Security (6.2% up to $176,100 in 2026) and Medicare (1.45% on all wages, plus 0.9% on wages above $200,000 for single filers). Your employer matches these — self-employed individuals pay both halves (15.3%).' },
  { q: 'How do 401(k) contributions reduce my taxes?', a: 'Traditional 401(k) contributions reduce your taxable income dollar-for-dollar. Contributing $10,000 in the 22% bracket saves approximately $2,200 in federal taxes that year. The money grows tax-deferred until withdrawal.' },
  { q: 'What is the difference between marginal and effective tax rate?', a: "Your marginal rate is what you pay on your last dollar of income (your top bracket). Your effective rate is total tax ÷ total income — the actual average. Someone in the 22% bracket doesn't pay 22% on all income, only on the portion above the threshold." },
  { q: 'Which states have no income tax in 2026?', a: 'Nine states have no income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. This can save thousands per year compared to high-tax states like California (up to 13.3%) or New Jersey (up to 10.75%).' },
];

export default function Page() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} />
      <SalaryCalculator />
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
