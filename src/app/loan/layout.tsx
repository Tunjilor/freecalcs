import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan & EMI Calculator | Monthly Payments & Amortization | freecalcs.io',
  description: 'Calculate monthly loan payments, total interest, and full amortization for personal, auto, student, or mortgage loans. Rate comparison and extra payment impact.',
  alternates: { canonical: 'https://www.freecalcs.io/loan' },
  openGraph: {
    title: 'Loan & EMI Calculator | Monthly Payments & Amortization | freecalcs.io',
    description: 'Calculate monthly loan payments, total interest, and full amortization for personal, auto, student, or mortgage loans. Rate comparison and extra payment impact.',
    url: 'https://www.freecalcs.io/loan',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loan & EMI Calculator | Monthly Payments & Amortization | freecalcs.io',
    description: 'Calculate monthly loan payments, total interest, and full amortization for personal, auto, student, or mortgage loans. Rate comparison and extra payment impact.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
