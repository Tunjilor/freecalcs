import type { Metadata } from 'next';
import TipCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Tip Calculator | Bill Splitter & Service Presets | freecalcs.io',
  description: 'Calculate tips and split bills. Custom tip percentage, service presets for restaurants, bars, salons, and rideshare. Free, instant, no sign-up.',
  alternates: { canonical: 'https://www.freecalcs.io/tip' },
  openGraph: { title: 'Tip Calculator | freecalcs.io', description: 'Calculate tips and split bills with service presets for restaurants, bars, salons, and rideshare.', url: 'https://www.freecalcs.io/tip', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Tip Calculator | freecalcs.io', description: 'Calculate tips and split bills. Service presets for restaurants, bars, and salons.' },
};

const jsonLd = {
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
      mainEntity: [
        { '@type': 'Question', name: 'What is the standard tip percentage at a restaurant?', acceptedAnswer: { '@type': 'Answer', text: 'The standard restaurant tip in the US is 15–20% for satisfactory service, 20–25% for excellent service, and 10–15% for poor service. Fast casual counter service does not require a tip, though it is appreciated.' } },
        { '@type': 'Question', name: 'Should you calculate the tip before or after tax?', acceptedAnswer: { '@type': 'Answer', text: 'Tipping on the pre-tax total is perfectly acceptable and slightly more common, though tipping on the post-tax total is also fine. The difference on a typical bill is only $1–3. This calculator lets you choose either approach.' } },
        { '@type': 'Question', name: 'How do you split a bill evenly among multiple people?', acceptedAnswer: { '@type': 'Answer', text: 'Add the full bill total including tax and tip, then divide by the number of people. For a $120 bill with 20% tip: $120 × 1.20 = $144, divided by 4 people = $36 each. This calculator handles any number of diners in real time.' } },
        { '@type': 'Question', name: 'What is the appropriate tip for different services?', acceptedAnswer: { '@type': 'Answer', text: 'US guidelines: Restaurant servers 18–22%; Bartenders $1–2 per drink or 15–20%; Hair stylists/barbers 15–25%; Food delivery 15–20% (minimum $3–5); Taxi/rideshare 15–20%; Hotel housekeeping $2–5 per night; Valet $2–5.' } },
        { '@type': 'Question', name: 'How do you calculate a 20% tip quickly in your head?', acceptedAnswer: { '@type': 'Answer', text: 'Move the decimal one place left for 10%, then double for 20%. For a $67.50 bill: 10% = $6.75, doubled = $13.50. For 15%: find 10% ($6.75) and add half ($3.38) = $10.13. For 18%: find 20% ($13.50) and subtract 10% of that ($1.35) = $12.15.' } },
      ],
    },
  ],
};

const faqs = [
  { q: 'What is the standard tip percentage at a restaurant?', a: "The standard restaurant tip in the US is 15–20% for satisfactory service, 20–25% for excellent service, and 10–15% for poor service. Fast casual counter service doesn't require a tip, though it's appreciated." },
  { q: 'Should you calculate the tip before or after tax?', a: "Tipping on the pre-tax total is perfectly acceptable and slightly more common, though tipping on the post-tax total is also fine. The difference on a typical bill is only $1–3. This calculator lets you choose either approach." },
  { q: 'How do you split a bill evenly among multiple people?', a: 'Add the full bill total (including tax and tip), then divide by the number of people. For a $120 bill with 20% tip: $120 × 1.20 = $144 ÷ 4 people = $36 each. This calculator handles any number of diners in real time.' },
  { q: 'What is the appropriate tip for different services?', a: 'US guidelines: Restaurant servers: 18–22%; Bartenders: $1–2/drink or 15–20%; Hair stylists/barbers: 15–25%; Food delivery: 15–20% (min $3–5); Taxi/rideshare: 15–20%; Hotel housekeeping: $2–5/night; Valet: $2–5.' },
  { q: 'How do you calculate a 20% tip quickly in your head?', a: "Move the decimal one place left for 10%, then double for 20%. For a $67.50 bill: 10% = $6.75, doubled = $13.50. For 15%: find 10% ($6.75) and add half ($3.38) to get $10.13." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
    </>
  );
}
