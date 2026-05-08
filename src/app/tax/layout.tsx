import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Federal Income Tax Calculator 2026 | Refund Estimator | freecalcs.io',
  description: 'Estimate your 2026 federal tax bill or refund. Includes bracket breakdown, capital gains tax, self-employment tax, child tax credit, and tax planning tips.',
  alternates: { canonical: 'https://www.freecalcs.io/tax' },
  openGraph: {
    title: 'Federal Income Tax Calculator 2026 | Refund Estimator | freecalcs.io',
    description: 'Estimate your 2026 federal tax bill or refund. Includes bracket breakdown, capital gains tax, self-employment tax, child tax credit, and tax planning tips.',
    url: 'https://www.freecalcs.io/tax',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Federal Income Tax Calculator 2026 | Refund Estimator | freecalcs.io',
    description: 'Estimate your 2026 federal tax bill or refund. Includes bracket breakdown, capital gains tax, self-employment tax, child tax credit, and tax planning tips.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
