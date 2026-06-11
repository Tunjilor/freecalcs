import Script from 'next/script';
import type { Metadata } from 'next';
import SalaryCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Salary & Take-Home Pay Calculator 2026 | All 50 States',
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
  { q: 'What are FICA taxes and how much do I pay?', a: 'FICA includes Social Security (6.2% on wages up to $184,500 in 2026) and Medicare (1.45% on all wages, plus an extra 0.9% on wages above $200,000 for single filers). Your employer matches these — self-employed individuals pay both halves (15.3% total).' },
  { q: 'How do 401(k) contributions reduce my taxes?', a: 'Traditional 401(k) contributions reduce your taxable income dollar-for-dollar. Contributing $10,000 in the 22% bracket saves approximately $2,200 in federal taxes that year. The money grows tax-deferred until withdrawal.' },
  { q: 'What is the difference between marginal and effective tax rate?', a: "Your marginal rate is what you pay on your last dollar of income (your top bracket). Your effective rate is total tax ÷ total income — the actual average. Someone in the 22% bracket doesn't pay 22% on all income, only on the portion above the threshold." },
  { q: 'Which states have no income tax in 2026?', a: 'Nine states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. This can save thousands per year compared to high-tax states like California (up to 13.3%) or New Jersey (up to 10.75%).' },
  { q: 'How do I convert my annual salary to an hourly rate?', a: 'Divide your annual salary by 2,080 — that\'s 52 weeks × 40 hours. A $60,000 salary = ~$28.85/hour. A $80,000 salary = ~$38.46/hour. A $100,000 salary = ~$48.08/hour. This is your pre-tax hourly equivalent; your take-home hourly rate will be lower after deductions.' },
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

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>How Your Paycheck Is Actually Calculated</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Your gross salary is not what lands in your bank account. Between your employer paying you and you receiving it, the government takes several bites. Federal income tax is the largest deduction for most earners, calculated on a progressive bracket system — you don't pay the same rate on every dollar, only on the dollars that fall within each bracket.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>On top of federal income tax, you pay FICA taxes: 6.2% of wages up to $184,500 for Social Security, and 1.45% on all wages for Medicare (plus an extra 0.9% if you earn above $200,000). These are fixed-rate taxes — they don't have brackets. State income tax adds another layer if you live in one of the 41 states that tax income.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>The Biggest Lever: Pre-Tax Contributions</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Traditional 401(k) contributions reduce your taxable income before taxes are calculated. If you earn $85,000 and contribute $10,000 to your 401(k), you're only taxed on $75,000. In the 22% federal bracket, that's a $2,200 savings. HSA contributions (up to $4,300 for self-only in 2026) are even better — they reduce federal income tax, state income tax, and FICA taxes simultaneously, a rare triple tax advantage.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Your W-4 withholding form tells your employer how much to take out. Getting this right matters: too little and you owe at tax time; too much and you're giving the government an interest-free loan. Use the IRS Tax Withholding Estimator after running your numbers here to dial it in.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Salary vs Hourly: Converting Between the Two</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The standard conversion is to divide annual salary by 2,080 (52 weeks × 40 hours). A $75,000 salary equals $36.06/hour. A $100,000 salary equals $48.08/hour. Going the other way: multiply hourly rate × 2,080. A $25/hour job pays $52,000 annually before taxes. This calculator handles both salary and hourly inputs — select your payment type to switch modes.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>Keep in mind that salaried employees often work more than 40 hours without overtime pay, while hourly workers receive 1.5× their rate for hours over 40 in a week. Factor this into your actual hourly equivalent when comparing job offers.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/tax" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Federal tax calculator →</a>
            <a href="/blog/2026-tax-brackets-guide" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>2026 tax brackets guide →</a>
          </div>
        </div>
      </article>
    </>
  );
}
