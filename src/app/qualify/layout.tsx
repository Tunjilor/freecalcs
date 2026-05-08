import type { Metadata } from 'next';

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
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Qualifier 2026 | freecalcs.io',
    description: 'Instant mortgage qualification for Conventional, FHA, VA, USDA, and Jumbo loans.',
  },
};

export default function QualifyLayout({ children }: { children: React.ReactNode }) {
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
