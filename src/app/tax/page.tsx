import type { Metadata } from 'next';
import TaxCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Federal Income Tax Calculator 2026 | Refund Estimator | freecalcs.io',
  description: 'Estimate your 2026 federal tax bill or refund. Bracket breakdown, capital gains tax, self-employment tax, child tax credit, and tax planning tips.',
  alternates: { canonical: 'https://www.freecalcs.io/tax' },

  openGraph: { title: 'Federal Income Tax Calculator 2026 | freecalcs.io', description: 'Estimate your 2026 federal tax bill or refund.', url: 'https://www.freecalcs.io/tax', siteName: 'freecalcs.io', type: 'website' },
};
export default function Page() { return <TaxCalculator />; }
