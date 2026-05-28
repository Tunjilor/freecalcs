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

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>How Exact Age Is Calculated</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Calculating age sounds simple — subtract the birth year from the current year — but exact age in years, months, and days requires careful handling of several edge cases. Months have different lengths (28, 29, 30, or 31 days). Leap years add a February 29th that does not exist in other years. And the "current month" calculation depends on whether your birthday has passed yet this year.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The correct algorithm works backwards from today's date: first count complete years since your birthday, then count complete months since your last birthday, then count the remaining days. For someone born March 15, 1990 and today being May 28, 2026 — 36 complete years (last birthday: March 15, 2026), then 2 complete months (April 15, May 15), then 13 remaining days. Result: 36 years, 2 months, 13 days.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Age in Context: Generations, Zodiac, and Milestones</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Generation boundaries are widely referenced in culture and marketing. Gen Z spans roughly 1997–2012; Millennials 1981–1996; Gen X 1965–1980; Baby Boomers 1946–1964; the Silent Generation 1928–1945. These ranges are not universally agreed upon — Pew Research, researchers, and popular culture sometimes use slightly different cutoffs — but they represent real shared cultural experiences shaped by the technology and events of each era.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The Western zodiac is based purely on your birth month and day, with 12 signs each spanning roughly 30 days. The Chinese zodiac follows a 12-year cycle of animal signs, but resets at the Chinese New Year (late January or early February), not January 1st — so someone born in early January has the zodiac of the previous calendar year.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Fun Age Facts</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>You've lived approximately 525,960 minutes for every year of age, and your heart has beaten roughly 38 million times per year. In 1 billion seconds, you would be about 31.7 years old — so most people alive today have already passed the 1 billion second mark. Your body replaces most of its cells over a 7–10 year period, meaning the physical "you" today is largely different material from the you of a decade ago.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>If you were born on February 29th (a leap day), you have a "calendar birthday" only in leap years — roughly once every 4 years. Between leap years, most systems consider March 1st your birthday. There are approximately 5 million people worldwide with February 29th birthdays — called leaplings or leap day babies.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/bmi" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>BMI calculator →</a>
            <a href="/tdee" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>TDEE calculator →</a>
          </div>
        </div>
      </article>
    </>
  );
}
