import type { Metadata } from 'next';
import PercentageCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Percentage Calculator | 7 Tools in One | freecalcs.io',
  description: 'Seven percentage calculators: percent of a number, percentage change, discount calculator, tip calculator, percentage difference, increase and decrease.',
  alternates: { canonical: 'https://www.freecalcs.io/percentage' },
  openGraph: { title: 'Percentage Calculator | 7 Tools in One | freecalcs.io', description: 'Percent of, change, discount, difference, increase, and decrease — all in one.', url: 'https://www.freecalcs.io/percentage', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Percentage Calculator | freecalcs.io', description: 'Seven percentage tools: percent of, change, discount, tip, difference, increase and decrease.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Percentage Calculator',
      url: 'https://www.freecalcs.io/percentage',
      description: 'Seven percentage calculators in one: percent of a number, percentage change, discount, tip, difference, increase and decrease.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I calculate what percentage one number is of another?', acceptedAnswer: { '@type': 'Answer', text: 'Divide the part by the whole, then multiply by 100. Example: what percent is 30 of 150? 30 ÷ 150 × 100 = 20%. This works for calculating market share, test grades, tip amounts, and many everyday situations.' } },
        { '@type': 'Question', name: 'What is the difference between percentage change and percentage difference?', acceptedAnswer: { '@type': 'Answer', text: 'Percentage change measures how much a value changed relative to its starting point: (New − Old) ÷ Old × 100. Percentage difference measures the gap between two values without a clear starting point: |A − B| ÷ ((A + B) ÷ 2) × 100. Use change for before/after comparisons; use difference for comparing two equal alternatives.' } },
        { '@type': 'Question', name: 'How do I calculate a discount percentage?', acceptedAnswer: { '@type': 'Answer', text: 'Sale price = Original price × (1 − Discount% ÷ 100). For 25% off an $80 item: $80 × 0.75 = $60. To find the discount percentage: (Original − Sale) ÷ Original × 100. From $80 down to $60: ($80 − $60) ÷ $80 × 100 = 25% off.' } },
        { '@type': 'Question', name: 'How do I add a percentage to a number?', acceptedAnswer: { '@type': 'Answer', text: 'Multiply the number by (1 + percentage ÷ 100). For a 15% increase on $200: $200 × 1.15 = $230. For 7% sales tax on a $50 item: $50 × 1.07 = $53.50. To subtract a percentage: multiply by (1 − percentage ÷ 100).' } },
        { '@type': 'Question', name: 'How do I find the original price before a percentage increase?', acceptedAnswer: { '@type': 'Answer', text: 'Divide the new value by (1 + percentage ÷ 100). If a price increased 20% to reach $120, the original was $120 ÷ 1.20 = $100. Useful for finding pre-tax prices, original prices before markup, or starting values before a raise.' } },
      ],
    },
  ],
};

const faqs = [
  { q: 'How do I calculate what percentage one number is of another?', a: 'Divide the part by the whole, then multiply by 100. Example: what percent is 30 of 150? 30 ÷ 150 × 100 = 20%. This works for market share, test grades, tip amounts, and countless everyday situations.' },
  { q: 'What is the difference between percentage change and percentage difference?', a: 'Percentage change measures how much a value changed relative to its starting point: (New − Old) ÷ Old × 100. Percentage difference measures the gap between two values without a clear starting point: |A − B| ÷ ((A + B) ÷ 2) × 100. Use change for before/after; use difference for two equal alternatives.' },
  { q: 'How do I calculate a discount percentage?', a: "Sale price = Original price × (1 − Discount% ÷ 100). For 25% off an $80 item: $80 × 0.75 = $60. To find the discount %: (Original − Sale) ÷ Original × 100. From $80 to $60: ($80 − $60) ÷ $80 × 100 = 25% off." },
  { q: 'How do I add a percentage to a number?', a: "Multiply by (1 + percentage ÷ 100). For a 15% increase on $200: $200 × 1.15 = $230. For 7% sales tax on $50: $50 × 1.07 = $53.50. To subtract a percentage: multiply by (1 − percentage ÷ 100)." },
  { q: 'How do I find the original price before a percentage increase?', a: "Divide the new value by (1 + percentage ÷ 100). If a price increased 20% to reach $120, the original was $120 ÷ 1.20 = $100. Useful for finding pre-tax prices, original prices before markup, or starting values before a salary raise." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PercentageCalculator />
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
