import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Calculator 2026 | Payment, Amortization & Affordability | freecalcs.io',
  description: 'Free mortgage calculator with full amortization schedule, extra payment analysis, refinance comparison, and affordability check. Updated for 2026 rates.',
  alternates: { canonical: 'https://www.freecalcs.io/mortgage' },
  openGraph: {
    title: 'Mortgage Calculator 2026 | freecalcs.io',
    description: 'Full amortization, extra payments, refinance comparison, and affordability. 2026 rates.',
    url: 'https://www.freecalcs.io/mortgage',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator 2026 | freecalcs.io',
    description: 'Full amortization, extra payments, refinance, and affordability analysis.',
  },
};

export default function MortgageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      marginTop: '-52px',
      background: '#ffffff',
      minHeight: '100vh',
    }}>
      {children}
    </div>
  );
}
