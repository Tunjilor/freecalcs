import type { Metadata } from 'next';
import LoanCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Loan & EMI Calculator 2026 | Payments & Amortization',
  description: 'Calculate monthly loan payments, total interest, and full amortization for personal, auto, student, or mortgage loans. Free, instant, no sign-up.',
  alternates: { canonical: 'https://www.freecalcs.io/loan' },
  openGraph: { title: 'Loan & EMI Calculator 2026 | freecalcs.io', description: 'Monthly payments, total interest, and amortization for any loan type.', url: 'https://www.freecalcs.io/loan', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Loan & EMI Calculator 2026 | freecalcs.io', description: 'Monthly payments and amortization for personal, auto, student, and mortgage loans.' },
};

// FAQ structured data is generated from the visible faqs array so the JSON-LD
// always matches what users see on the page, per Google's requirements.
const jsonLd = () => ({
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
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
});

const faqs = [
  { q: 'What is EMI and how is it calculated?', a: "EMI (Equated Monthly Installment) is the fixed monthly payment on a loan. It's calculated with: P × [r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the monthly interest rate, and n is the number of months. Each payment covers both interest and principal, with the interest share declining over time." },
  { q: 'What factors affect my loan interest rate?', a: 'Key factors include credit score (higher score = lower rate), loan term, loan type (secured vs unsecured), debt-to-income ratio, employment history, and lender competition. Improving your credit score by 40–50 points can lower your rate by 0.5–1% or more.' },
  { q: 'What is the difference between fixed and variable interest rates?', a: "A fixed rate stays the same for the entire loan term — payment is predictable. A variable rate starts lower but can change based on market indexes, making future payments uncertain. Fixed rates suit borrowers who want certainty; variable rates work if you'll repay quickly or expect rates to fall." },
  { q: 'How does loan amortization work?', a: 'Amortization pays off a loan through regular payments. Early payments are mostly interest; as the balance falls, more goes to principal. By the final payment, almost all of it is principal. This is why extra payments early in the loan save disproportionately more interest.' },
  { q: 'Can I pay off a loan early and save on interest?', a: "Yes. An extra $100/month on a $25,000 car loan at 7% over 5 years saves ~$800 in interest and pays it off 6 months early. Always check if your loan has prepayment penalties before making extra payments." },
  { q: 'Is a shorter or longer loan term better?', a: "Shorter term = higher monthly payment, less total interest, faster payoff and equity building. Longer term = lower monthly payment, more total interest, more cash flow flexibility. Example: a $25,000 loan at 7% — 3-year term costs $772/month but only $2,800 in interest; 6-year term costs $428/month but $5,800 in total interest. Choose shorter if you can afford it; choose longer if cash flow is tight." },
  { q: 'What is the difference between a personal loan, auto loan, and mortgage?', a: "All three use the same amortization math, but differ in collateral, rates, and terms. Mortgages are secured by the home (lowest rates, 10–30 year terms). Auto loans are secured by the vehicle (moderate rates, 3–7 years). Personal loans are unsecured (highest rates, 1–7 years). This calculator works for all three — just enter the correct amount, rate, and term." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
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

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>How Loan Amortization Actually Works</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Every loan payment you make has two parts: interest and principal. In the early months of a loan, almost all of your payment goes toward interest — the cost of borrowing — and almost nothing reduces the actual balance you owe. As the balance falls over time, the interest portion shrinks and the principal portion grows. By the final payment, nearly everything is principal. This is amortization.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>On a $20,000 car loan at 7% for 60 months, your first payment of $396 includes $117 in interest and only $279 toward your balance. Your last payment is mostly principal. This front-loaded interest structure is why extra payments made early in a loan save dramatically more money than extra payments made late.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Choosing the Right Loan Term</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Shorter terms mean higher monthly payments but far less total interest. A $25,000 personal loan at 8% over 3 years costs $783/month and $3,188 in total interest. The same loan over 5 years costs $507/month — but $5,425 in total interest, nearly double. If your budget allows the higher payment, the shorter term is almost always the better financial decision.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The one exception: if you have high-interest debt elsewhere. Taking a longer loan term at 8% to free up cash for paying off 22% credit card debt is mathematically sound. Always compare your loan rate against the rates of all your other debts before deciding on a term.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Personal, Auto, Student, and Mortgage Loans Compared</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>All loans use the same amortization math, but differ significantly in rates and terms. Mortgages (secured by real estate) carry the lowest rates, currently 6–7%, and run 10–30 years. Auto loans (secured by the vehicle) run 5–8% for 3–7 years. Student loans run 5–8% federal, higher private. Personal loans (unsecured) are the most expensive at 10–30% and 1–7 years — but fastest to obtain and most flexible in use.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>This calculator works for all loan types. Simply enter the loan amount, annual interest rate, and term in months or years. Use it to compare different rate or term scenarios side by side before committing to a loan offer.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/mortgage" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Mortgage calculator →</a>
            <a href="/compound-interest" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Compound interest calculator →</a>
          </div>
        </div>
      </article>
    </>
  );
}
