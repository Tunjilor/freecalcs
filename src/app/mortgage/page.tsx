import Script from 'next/script';
import type { Metadata } from 'next';
import MortgageCalculator from './calculator';
import RelatedTools from '@/components/blog/RelatedTools';

export const metadata: Metadata = {
  title: 'Mortgage Calculator 2026 | Payment & Amortization',
  description: 'Calculate monthly mortgage payments with full amortization schedule, extra payment impact, and loan comparison. Includes PMI, taxes, and insurance.',
  alternates: { canonical: 'https://www.freecalcs.io/mortgage' },
  openGraph: {
    title: 'Mortgage Calculator 2026 | freecalcs.io',
    description: 'Full mortgage payment breakdown with amortization, extra payments, and loan comparison.',
    url: 'https://www.freecalcs.io/mortgage',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator 2026 | freecalcs.io',
    description: 'Full amortization, extra payments, refinance, and affordability analysis.',
  },
};

// FAQ structured data is generated from the visible faqUi array (below) so the
// JSON-LD always matches what users see on the page, per Google's requirements.
const faqSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": faqUi.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
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
});

const faqUi = [
  { q: 'How is a monthly mortgage payment calculated?', a: "Your monthly payment uses the formula: P × [r(1+r)^n] / [(1+r)^n - 1], where P is the loan amount, r is the monthly rate (annual ÷ 12), and n is total payments. For a $400,000 loan at 6.27% for 30 years, that's ~$2,469/month in principal and interest." },
  { q: 'What is PMI and when is it required?', a: 'Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. It typically costs 0.5–1% of the loan amount per year and is automatically removed once you reach 20% equity.' },
  { q: 'Should I get a 15-year or 30-year mortgage?', a: 'A 15-year mortgage saves roughly half the total interest but has ~40% higher monthly payments. A 30-year offers lower payments and flexibility. Choose based on your budget and financial goals.' },
  { q: 'How much do extra payments save?', a: 'Even $100–$200 extra per month can save tens of thousands in interest. For a $400,000 loan at 6.27%, an extra $200/month saves ~$58,000 in interest and pays off the loan 5 years early. Use the extra payment field above to see your exact savings.' },
  { q: 'What credit score do I need for the best mortgage rate?', a: 'A score of 740+ typically qualifies for the best conventional rates. Scores 680–739 get good rates, while FHA accepts as low as 580 with 3.5% down. Each 20-point improvement can lower your rate by ~0.125–0.25%.' },
  { q: 'What are closing costs and how much will I pay?', a: "Closing costs are the fees to finalize your mortgage, typically 2–5% of the purchase price. On a $400,000 home that's $8,000–$20,000. They include loan origination fees, appraisal, title insurance, escrow, recording fees, and prepaid property taxes and insurance. You can sometimes negotiate a seller credit to cover part of these costs." },
  { q: 'What is the difference between a fixed-rate and adjustable-rate mortgage?', a: "A fixed-rate mortgage keeps the same interest rate for the entire loan term — your payment never changes. An adjustable-rate mortgage (ARM) starts with a lower fixed rate for a set period (e.g., 5/1 ARM = fixed 5 years, then adjusts annually). ARMs can save money if you plan to sell or refinance before the adjustment period begins." },
];

export default function Page() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema())}} />
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

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>How This Mortgage Calculator Works</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>This free mortgage calculator computes your monthly payment using the standard amortization formula, then breaks down how much of every payment goes toward principal versus interest. Enter your home price, down payment, interest rate, and loan term to instantly see your payment, total interest, and full amortization schedule.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The calculator handles four modes: buying a home, refinancing, accessing home equity, and affordability checking. Switch between them using the mode buttons at the top of the calculator.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Understanding Mortgage Amortization</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Amortization means paying off a loan through fixed monthly payments over time. The math behind it means your early payments are almost entirely interest — on a $400,000 mortgage at 6.5% for 30 years, your first payment of $2,528 contains $2,167 in interest and only $361 in principal. By year 15, those numbers flip. By the final payment, nearly everything goes to principal.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>This is why making extra payments early in the loan is so powerful. An extra $200/month in year one reduces your principal by $200 — which then avoids 30 years of compounding interest on that $200. Use the <strong>Extra monthly payment</strong> field to see exactly how much you save.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>The True Cost of a Mortgage</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Most people focus on the monthly payment, but the total interest paid is the number that deserves attention. On a 30-year $400,000 mortgage at 6.5%, you pay $910,080 total — more than double the amount you borrowed. A 15-year mortgage at 5.75% on the same loan costs $573,000 total, saving $337,000. The Amortization tab shows your exact payoff date and cumulative interest month by month.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Don't forget closing costs (2–5% of purchase price) and ongoing costs: property taxes, homeowners insurance, HOA fees, and maintenance (budget 1–2% of home value per year). A $400,000 home can easily cost $500–$700 more per month in these costs beyond the mortgage payment itself.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>How to Get the Lowest Mortgage Rate</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>Your credit score is the single biggest lever. Moving from 680 to 740 can reduce your rate by 0.5%, which saves $65,000 in interest on a $400,000 loan over 30 years. Beyond that: put 20% down to eliminate PMI, compare at least 3 lenders (rates vary by 0.5%+ between lenders), consider a shorter loan term for a lower rate, and lock your rate quickly once you find a home since rates move daily.</p>

          <RelatedTools heading="Keep reading" tools={[{href:'/blog/how-to-calculate-mortgage-payment',label:'How to calculate your mortgage payment'},{href:'/blog/28-36-rule-mortgage',label:'The 28/36 rule: how much house you can afford'}]} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            <a href="/qualify" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Do I qualify for a mortgage? →</a>
            <a href="/rent-vs-buy" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Rent vs Buy calculator →</a>
            <a href="/blog/pay-off-mortgage-early" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>How to pay off early →</a>
          </div>
        </div>
      </article>
    </>
  );
}
