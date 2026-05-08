import type { Metadata } from 'next';
import LoanCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Loan & EMI Calculator | Monthly Payments & Amortization | freecalcs.io',
  description: 'Calculate monthly loan payments, total interest, and full amortization for personal, auto, student, or mortgage loans.',
  alternates: { canonical: 'https://www.freecalcs.io/loan' },
};
export default function Page() { return <LoanCalculator />; }
