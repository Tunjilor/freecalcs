import type { Metadata } from 'next';
import AgeCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Age Calculator | Exact Age, Zodiac Sign & Birthday Countdown | freecalcs.io',
  description: 'Find your exact age in years, months, days, hours and seconds. Zodiac sign, Chinese zodiac, generation, planetary age, and milestone countdown.',
  keywords: ['age calculator', 'free age calculator', 'freecalcs.io'],
  alternates: { canonical: 'https://www.freecalcs.io/age' },
  openGraph: {
    title: 'Age Calculator | Exact Age, Zodiac Sign & Birthday Countdown | freecalcs.io',
    description: 'Find your exact age in years, months, days, hours and seconds. Zodiac sign, Chinese zodiac, generation, planetary age, and milestone countdown.',
    url: 'https://www.freecalcs.io/age',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator | Exact Age, Zodiac Sign & Birthday Countdown | freecalcs.io',
    description: 'Find your exact age in years, months, days, hours and seconds. Zodiac sign, Chinese zodiac, generation, planetary age, and milestone countdown.',
  },
};

export default function Page() {
  return <AgeCalculator />;
}