import type { Metadata } from 'next';
import AgeCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Age Calculator | Exact Age, Zodiac Sign & Birthday Countdown | freecalcs.io',
  description: 'Find your exact age in years, months, days, hours and seconds. Zodiac sign, Chinese zodiac, generation, planetary age, and milestone countdown.',
  alternates: { canonical: 'https://www.freecalcs.io/age' },

  openGraph: { title: 'Age Calculator | freecalcs.io', description: 'Find your exact age in years, months, days, hours and seconds.', url: 'https://www.freecalcs.io/age', siteName: 'freecalcs.io', type: 'website' },
};
export default function Page() { return <AgeCalculator />; }
