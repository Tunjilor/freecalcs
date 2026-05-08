import type { Metadata } from 'next';
import MortgageCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Mortgage Calculator 2026 | Payment, Amortization & Comparison | freecalcs.io',
  description: 'Calculate monthly mortgage payments with full amortization schedule, extra payment impact, and loan comparison. Includes PMI, taxes, and insurance.',
  alternates: { canonical: 'https://www.freecalcs.io/mortgage' },
  openGraph: {
    title: 'Mortgage Calculator 2026 | freecalcs.io',
    description: 'Full mortgage payment breakdown with amortization, extra payments, and loan comparison.',
    url: 'https://www.freecalcs.io/mortgage',
    siteName: 'freecalcs.io',
    type: 'website',
  },
};

export default function Page() {
  return <MortgageCalculator />;
}
