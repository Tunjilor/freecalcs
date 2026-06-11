import type { Metadata } from 'next';
import TipCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Tip Calculator | Bill Splitter & Service Presets',
  description: 'Calculate tips and split bills. Custom tip percentage, service presets for restaurants, bars, salons, and rideshare. Free, instant, no sign-up.',
  alternates: { canonical: 'https://www.freecalcs.io/tip' },
  openGraph: { title: 'Tip Calculator | freecalcs.io', description: 'Calculate tips and split bills with service presets for restaurants, bars, salons, and rideshare.', url: 'https://www.freecalcs.io/tip', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Tip Calculator | freecalcs.io', description: 'Calculate tips and split bills. Service presets for restaurants, bars, and salons.' },
};

// FAQ structured data is generated from the visible faqs array so the JSON-LD
// always matches what users see on the page, per Google's requirements.
const jsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Tip Calculator',
      url: 'https://www.freecalcs.io/tip',
      description: 'Calculate tips and split bills with custom percentages and service presets for restaurants, bars, salons, and rideshare.',
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
  { q: 'What is the standard tip percentage at a restaurant?', a: "The standard restaurant tip in the US is 15–20% for satisfactory service, 20–25% for excellent service, and 10–15% for poor service. Fast casual counter service doesn't require a tip, though it's appreciated." },
  { q: 'Should you calculate the tip before or after tax?', a: "Tipping on the pre-tax total is perfectly acceptable and slightly more common, though tipping on the post-tax total is also fine. The difference on a typical bill is only $1–3. This calculator lets you choose either approach." },
  { q: 'How do you split a bill evenly among multiple people?', a: 'Add the full bill total (including tax and tip), then divide by the number of people. For a $120 bill with 20% tip: $120 × 1.20 = $144 ÷ 4 people = $36 each. This calculator handles any number of diners in real time.' },
  { q: 'What is the appropriate tip for different services?', a: 'US guidelines: Restaurant servers: 18–22%; Bartenders: $1–2/drink or 15–20%; Hair stylists/barbers: 15–25%; Food delivery: 15–20% (min $3–5); Taxi/rideshare: 15–20%; Hotel housekeeping: $2–5/night; Valet: $2–5.' },
  { q: 'How do you calculate a 20% tip quickly in your head?', a: "Move the decimal one place left for 10%, then double for 20%. For a $67.50 bill: 10% = $6.75, doubled = $13.50. For 15%: find 10% ($6.75) and add half ($3.38) to get $10.13." },
  { q: 'How much should I tip for food delivery and takeout in 2026?', a: "For delivery: 15–20% is standard, with a minimum of $4–5 regardless of bill size (delivery workers often cover their own gas and vehicle costs). For bad weather, remote addresses, or large orders, tip on the higher end. For takeout/counter service: 10–15% is now considered polite for complex orders; $0–10% is acceptable for simple counter pickup. These norms have shifted significantly since 2020." },
  { q: 'Is 20% now the standard tip, or is 15% still acceptable?', a: "Tipping norms have shifted. In 2026, 20% of the pre-tax bill is widely considered the new baseline for good sit-down restaurant service — not exceptional, just satisfactory. 15% now signals below-average service. 25%+ is appropriate for excellent service or when servers go significantly above expectations. This shift reflects rising costs and stagnant tipped-minimum wages in many states." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <TipCalculator />
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
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>US Tipping Guide: How Much to Tip in Every Situation</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Tipping in the United States is not optional for most service workers — it is the primary source of their income. Many servers earn a federal tipped minimum wage of $2.13/hour (with states required to make up the difference if tips don't reach regular minimum wage, though enforcement varies widely). In practice, US servers rely on tips for 60–70% of their total income. This is why tipping norms exist and why they carry real financial consequences.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Norms have shifted in recent years. A 2026 survey found that 20% is now considered the standard baseline for good restaurant service, up from 15% a decade ago. Rising food costs and stagnant wage floors have driven this shift. Many diners now tip 22–25% for excellent service and reserve 15% for below-average experiences.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Complete 2026 Tipping Reference</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 24 }}>
            {[
              ['Sit-down restaurant', '18–22%'],
              ['Bar / cocktails', '$1–2/drink or 15–20%'],
              ['Food delivery', '15–20%, min $4–5'],
              ['Counter / fast casual', '10–15% (optional)'],
              ['Coffee shop', '$0–$2 per drink'],
              ['Rideshare (Uber/Lyft)', '15–20%'],
              ['Taxi', '15–20%'],
              ['Hotel housekeeping', '$2–5/night'],
              ['Valet parking', '$2–5 on pickup'],
              ['Hair stylist / barber', '15–25%'],
              ['Nail salon', '15–20%'],
              ['Spa / massage', '15–20%'],
              ['Movers', '$20–50/person'],
              ['Pizza delivery', '$3–5 minimum'],
            ].map(([service, amount]) => (
              <div key={service} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 14 }}>
                <span style={{ color: '#374151' }}>{service}</span>
                <span style={{ fontWeight: 700, color: '#111' }}>{amount}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Mental Math Shortcuts for Tipping</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>For 20%: move the decimal one place left (10%), then double it. On a $67 bill: $6.70 × 2 = $13.40. For 15%: find 10% ($6.70), then add half ($3.35) = $10.05. For 18%: find 20% ($13.40), then subtract 10% of that ($1.34) = $12.06. For an exact percentage on a round number, multiply the bill by the decimal: $80 × 0.20 = $16.00.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>When splitting a bill, always calculate the tip on the full pre-split total first, then divide. Calculating per-person first and rounding down can shortchange the server significantly on large groups.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/percentage" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Percentage calculator →</a>
          </div>
        </div>
      </article>
    </>
  );
}
