import type { Metadata } from 'next';
import CompoundInterestCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | Growth Chart & Year-by-Year Table | freecalcs.io',
  description: 'See how your money grows with compound interest. Visual growth chart, year-by-year breakdown, contribution impact, inflation adjustment, and Rule of 72.',
  alternates: { canonical: 'https://www.freecalcs.io/compound-interest' },
  openGraph: {
    title: 'Compound Interest Calculator | freecalcs.io',
    description: 'Compound interest with growth chart, contributions, inflation, and Rule of 72.',
    url: 'https://www.freecalcs.io/compound-interest',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator | freecalcs.io',
    description: 'Growth chart, contributions, inflation adjustment, and Rule of 72.',
  },
};

export default function Page() {
  return <CompoundInterestCalculator />;
}