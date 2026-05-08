import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Age Calculator | Exact Age, Zodiac Sign & Birthday Countdown | freecalcs.io',
  description: 'Find your exact age in years, months, days, hours and seconds. Zodiac sign, Chinese zodiac, generation, planetary age, and milestone countdown.',
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
