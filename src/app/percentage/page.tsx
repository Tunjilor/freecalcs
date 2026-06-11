import type { Metadata } from 'next';
import PercentageCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Percentage Calculator | 7 Tools in One | freecalcs.io',
  description: 'Seven percentage calculators: percent of a number, percentage change, discount calculator, tip calculator, percentage difference, increase and decrease.',
  alternates: { canonical: 'https://www.freecalcs.io/percentage' },
  openGraph: { title: 'Percentage Calculator | 7 Tools in One | freecalcs.io', description: 'Percent of, change, discount, difference, increase, and decrease — all in one.', url: 'https://www.freecalcs.io/percentage', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Percentage Calculator | freecalcs.io', description: 'Seven percentage tools: percent of, change, discount, tip, difference, increase and decrease.' },
};

// FAQ structured data is generated from the visible faqs array so the JSON-LD
// always matches what users see on the page, per Google's requirements.
const jsonLd = () => ({
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
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
});

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
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

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>Percentages in Everyday Life</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Percentages are the language of comparison. Interest rates, tax rates, discounts, grades, poll results, nutrition labels, investment returns, and salary negotiations are all expressed as percentages. Understanding how to move between the three forms — percentage, decimal, and fraction — and how to apply the basic percentage operations fluently is one of the most practically useful math skills in daily life.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The word "percent" comes from the Latin "per centum," meaning per hundred. A percentage is always a ratio expressed out of 100. 45% means 45 out of 100, or 0.45 as a decimal, or 9/20 as a fraction. To convert percentage to decimal, divide by 100. To convert decimal to percentage, multiply by 100.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>The Seven Most Common Percentage Calculations</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 8 }}>This calculator handles all seven:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {[
              ['What is X% of Y?', 'Multiply Y × (X÷100). Example: 15% of $240 = $36.'],
              ['X is what % of Y?', 'Divide X by Y, multiply by 100. Example: 30 is what % of 150? = 20%.'],
              ['Percentage change', '(New − Old) ÷ Old × 100. Price rose from $80 to $96: +20%.'],
              ['Percentage difference', '|A − B| ÷ ((A+B)÷2) × 100. Comparing two equal alternatives.'],
              ['Percentage increase', 'New = Original × (1 + rate÷100). Add 8% tax to $50: $54.'],
              ['Percentage decrease / discount', 'Sale = Original × (1 − rate÷100). 30% off $120: $84.'],
              ['Reverse percentage', 'Original = New ÷ (1 + rate÷100). $138 after 15% markup: $120 original.'],
            ].map(([name, example]) => (
              <div key={name} style={{ padding: '12px 16px', background: '#f8f9fb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>{name}</p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{example}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 8 }}>Common Percentage Mistakes to Avoid</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>A 50% increase followed by a 50% decrease does not return to the original value — it leaves you 25% lower. If something increases by 100% it doubles; a 200% increase means it triples. Percentage points and percentages are different: if a rate goes from 4% to 6%, that is a 2 percentage point increase but a 50% percentage increase.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>When comparing two numbers as a percentage, always clarify which is the base. "A is 20% more than B" and "B is 20% less than A" sound similar but describe different relationships. Use this calculator to avoid any ambiguity — plug in your numbers and it handles the math precisely.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/tip" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Tip calculator →</a>
            <a href="/compound-interest" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Compound interest calculator →</a>
          </div>
        </div>
      </article>
    </>
  );
}
