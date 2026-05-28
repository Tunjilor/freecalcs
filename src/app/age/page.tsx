import type { Metadata } from 'next';
import AgeCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Age Calculator | Exact Age, Zodiac Sign & Birthday Countdown | freecalcs.io',
  description: 'Find your exact age in years, months, days, hours and seconds. Zodiac sign, Chinese zodiac, generation, planetary age, and milestone countdown.',
  alternates: { canonical: 'https://www.freecalcs.io/age' },
  openGraph: { title: 'Age Calculator | freecalcs.io', description: 'Exact age in years, months, days, hours. Zodiac sign, Chinese zodiac, generation, and birthday countdown.', url: 'https://www.freecalcs.io/age', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Age Calculator | freecalcs.io', description: 'Exact age with zodiac sign, Chinese zodiac, generation, and birthday countdown.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Age Calculator',
      url: 'https://www.freecalcs.io/age',
      description: 'Calculate exact age in years, months, days, hours and seconds, with zodiac sign, Chinese zodiac, generation, and birthday countdown.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How is exact age calculated in years, months, and days?', acceptedAnswer: { '@type': 'Answer', text: 'Exact age subtracts the birth date from today, handling month-length variations and leap years. For example, born March 15, 1990 and today is May 28, 2026: 36 years, then counting forward from March 15, 2026 gives 2 months and 13 days. Total: 36 years, 2 months, 13 days.' } },
        { '@type': 'Question', name: 'How do leap years affect age calculation?', acceptedAnswer: { '@type': 'Answer', text: 'Leap years add an extra day (February 29) every 4 years, with exceptions for century years not divisible by 400. For someone born on Feb 29, most systems count their birthday as March 1 in non-leap years. This calculator correctly accounts for leap years when computing exact days between dates.' } },
        { '@type': 'Question', name: 'How do I calculate my age in days or hours?', acceptedAnswer: { '@type': 'Answer', text: 'Count the exact calendar days between your birth date and today. For someone born 36 years ago, they have lived approximately 13,149 days or 315,576 hours. This calculator computes all these values automatically.' } },
        { '@type': 'Question', name: 'What is the difference between chronological age and biological age?', acceptedAnswer: { '@type': 'Answer', text: 'Chronological age is simply your age based on your birth date — what this calculator measures. Biological age reflects how your body has aged based on health markers like telomere length and organ function. Two people of the same chronological age can have very different biological ages based on genetics, diet, and lifestyle.' } },
        { '@type': 'Question', name: 'How is the Chinese zodiac year determined?', acceptedAnswer: { '@type': 'Answer', text: 'The Chinese zodiac follows a 12-year cycle with animals: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. The Chinese New Year falls in late January or February, so if you were born before that date in a given year, your zodiac animal is from the previous calendar year.' } },
      ],
    },
  ],
};

const faqs = [
  { q: 'How is exact age calculated in years, months, and days?', a: "Exact age subtracts the birth date from today's date, handling month-length variations and leap years. For example, born March 15, 1990 and today is May 28, 2026: 36 years, then counting forward from March 15, 2026 gives 2 months and 13 days. Total: 36 years, 2 months, 13 days." },
  { q: 'How do leap years affect age calculation?', a: 'Leap years add an extra day (February 29) every 4 years, with exceptions for century years not divisible by 400. For someone born on Feb 29, most systems count their birthday as March 1 in non-leap years. This calculator correctly accounts for leap years when computing exact days between dates.' },
  { q: 'How do I calculate my age in days or hours?', a: "Count the exact calendar days between your birth date and today. For someone born 36 years ago, they've lived approximately 13,149 days or 315,576 hours. This calculator computes all these values automatically." },
  { q: 'What is the difference between chronological age and biological age?', a: "Chronological age is simply your age based on your birth date — what this calculator measures. Biological age reflects how your body has aged based on health markers like telomere length and organ function. Two people of the same chronological age can have very different biological ages based on genetics, diet, exercise, and lifestyle." },
  { q: 'How is the Chinese zodiac year determined?', a: "The Chinese zodiac follows a 12-year cycle with 12 animals: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. The Chinese New Year falls in late January or February, so if you were born before that date in a given year, your zodiac animal is from the previous calendar year." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AgeCalculator />
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
