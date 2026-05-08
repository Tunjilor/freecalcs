import type { Metadata } from 'next';
import LoanCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Loan & EMI Calculator | Monthly Payments & Amortization | freecalcs.io',
  description: 'Calculate monthly loan payments, total interest, and full amortization for personal, auto, student, or mortgage loans.',
  alternates: { canonical: 'https://www.freecalcs.io/loan' },

  openGraph: { title: 'Loan & EMI Calculator | freecalcs.io', description: 'Calculate monthly loan payments, total interest, and full amortization.', url: 'https://www.freecalcs.io/loan', siteName: 'freecalcs.io', type: 'website' },
};
export default function Page() { return <LoanCalculator />; }
