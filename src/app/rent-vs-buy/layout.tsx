import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator | Is Buying a Home Worth It? | freecalcs.io',
  description: 'Compare the true cost of renting vs buying a home. Includes opportunity cost, home appreciation, tax benefits, and break-even analysis.',
  alternates: { canonical: 'https://www.freecalcs.io/rent-vs-buy' },
  openGraph: {
    title: 'Rent vs Buy Calculator | Is Buying a Home Worth It? | freecalcs.io',
    description: 'Compare the true cost of renting vs buying a home. Includes opportunity cost, home appreciation, tax benefits, and break-even analysis.',
    url: 'https://www.freecalcs.io/rent-vs-buy',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rent vs Buy Calculator | Is Buying a Home Worth It? | freecalcs.io',
    description: 'Compare the true cost of renting vs buying a home. Includes opportunity cost, home appreciation, tax benefits, and break-even analysis.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
