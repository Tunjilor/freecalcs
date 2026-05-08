import type { Metadata } from 'next';
import MortgageQualifier from './calculator';

export const metadata: Metadata = {
  title: 'Mortgage Qualifier Calculator 2026 | Do I Qualify? | freecalcs.io',
  description: 'Find out if you qualify for a mortgage. Checks Conventional, FHA, VA, USDA, and Jumbo loans. DTI analysis, credit score impact, and improvement tips.',
  alternates: { canonical: 'https://www.freecalcs.io/qualify' },
  openGraph: {
    title: 'Mortgage Qualifier Calculator 2026 | freecalcs.io',
    description: 'Instant mortgage qualification check for all 5 loan programs.',
    url: 'https://www.freecalcs.io/qualify',
    siteName: 'freecalcs.io',
    type: 'website',
  },
};

export default function Page() {
  return <MortgageQualifier />;
}
