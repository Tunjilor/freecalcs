import type { Metadata } from 'next';
import RentVsBuy from './calculator';

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator 2026 | Should You Buy a Home? | freecalcs.io',
  description: 'Find out whether buying or renting makes more financial sense. Includes home appreciation, property tax, rent increases, and break-even analysis.',
  alternates: { canonical: 'https://www.freecalcs.io/rent-vs-buy' },
  openGraph: {
    title: 'Rent vs Buy Calculator 2026 | freecalcs.io',
    description: 'Compare the true cost of renting vs buying a home over time.',
    url: 'https://www.freecalcs.io/rent-vs-buy',
    siteName: 'freecalcs.io',
    type: 'website',
  },
};

export default function Page() {
  return <RentVsBuy />;
}
