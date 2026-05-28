import type { Metadata } from 'next';
import LoanCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Loan & EMI Calculator 2026 | Monthly Payments & Amortization | freecalcs.io',
  description: 'Calculate monthly loan payments, total interest, and full amortization for personal, auto, student, or mortgage loans. Free, instant, no sign-up.',
  alternates: { canonical: 'https://www.freecalcs.io/loan' },
  openGraph: { title: 'Loan & EMI Calculator 2026 | freecalcs.io', description: 'Monthly payments, total interest, and amortization for any loan type.', url: 'https://www.freecalcs.io/loan', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Loan & EMI Calculator 2026 | freecalcs.io', description: 'Monthly payments and amortization for personal, auto, student, and mortgage loans.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Loan & EMI Calculator',
      url: 'https://www.freecalcs.io/loan',
      description: 'Calculate monthly loan payments, total interest, and full amortization for personal, auto, student, or mortgage loans.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is EMI and how is it calculated?', acceptedAnswer: { '@type': 'Answer', text: 'EMI (Equated Monthly Installment) is the fixed monthly payment on a loan. It is calculated with the formula: P × [r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the monthly interest rate, and n is the number of months. Early payments are mostly interest; later payments are mostly principal.' } },
        { '@type': 'Question', name: 'What factors affect my loan interest rate?', acceptedAnswer: { '@type': 'Answer', text: 'Key factors include credit score (higher score = lower rate), loan term (shorter terms often have lower rates), loan type (secured vs unsecured), debt-to-income ratio, employment history, and lender competition. Improving your credit score by 40–50 points can lower your rate by 0.5–1% or more.' } },
        { '@type': 'Question', name: 'What is the difference between fixed and variable interest rates?', acceptedAnswer: { '@type': 'Answer', text: 'A fixed rate stays the same for the entire loan term — your payment is predictable. A variable rate starts lower but can change based on market indexes, making future payments uncertain. Fixed rates suit borrowers who want certainty; variable rates can save money if you plan to repay quickly or rates fall.' } },
        { '@type': 'Question', name: 'How does loan amortization work?', acceptedAnswer: { '@type': 'Answer', text: 'Amortization is paying off a loan through regular payments over time. In early payments, most goes toward interest. As the balance decreases, more goes toward principal. By the final payment, almost all of it is principal. This is why making extra payments early saves disproportionately more interest.' } },
        { '@type': 'Question', name: 'Can I pay off a loan early and save on interest?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — paying off a loan early almost always saves interest. An extra $100 per month on a $25,000 car loan at 7% over 5 years saves about $800 in interest and pays it off 6 months early. Always check if your loan has prepayment penalties before making extra payments.' } },
      ],
    },
  ],
};

const faqs = [
  { q: 'What is EMI and how is it calculated?', a: "EMI (Equated Monthly Installment) is the fixed monthly payment on a loan. It's calculated with: P × [r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the monthly interest rate, and n is the number of months. Each payment covers both interest and principal, with the interest share declining over time." },
  { q: 'What factors affect my loan interest rate?', a: 'Key factors include credit score (higher score = lower rate), loan term, loan type (secured vs unsecured), debt-to-income ratio, employment history, and lender competition. Improving your credit score by 40–50 points can lower your rate by 0.5–1% or more.' },
  { q: 'What is the difference between fixed and variable interest rates?', a: "A fixed rate stays the same for the entire loan term — payment is predictable. A variable rate starts lower but can change based on market indexes, making future payments uncertain. Fixed rates suit borrowers who want certainty; variable rates work if you'll repay quickly or expect rates to fall." },
  { q: 'How does loan amortization work?', a: 'Amortization pays off a loan through regular payments. Early payments are mostly interest; as the balance falls, more goes to principal. By the final payment, almost all of it is principal. This is why extra payments early in the loan save disproportionately more interest.' },
  { q: 'Can I pay off a loan early and save on interest?', a: "Yes. An extra $100/month on a $25,000 car loan at 7% over 5 years saves ~$800 in interest and pays it off 6 months early. Always check if your loan has prepayment penalties before making extra payments." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LoanCalculator />
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
