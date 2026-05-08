import type { Metadata } from 'next';
import ScientificCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Scientific Calculator | Free Online | freecalcs.io',
  description: 'Free online scientific calculator with trig, log, exponents, memory, and history. No sign-up required.',
  alternates: { canonical: 'https://www.freecalcs.io/scientific' },
  openGraph: {
    title: 'Scientific Calculator | freecalcs.io',
    description: 'Free scientific calculator with advanced math functions.',
    url: 'https://www.freecalcs.io/scientific',
    siteName: 'freecalcs.io',
    type: 'website',
  },
};

export default function Page() {
  return <ScientificCalculator />;
}
