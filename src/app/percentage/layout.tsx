import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Percentage Calculator | 7 Tools in One | freecalcs.io',
  description: 'Seven percentage calculators: percent of a number, percentage change, discount calculator, tip calculator, percentage difference, increase and decrease. Instant results.',
  alternates: { canonical: 'https://www.freecalcs.io/percentage' },
  openGraph: {
    title: 'Percentage Calculator | 7 Tools in One | freecalcs.io',
    description: 'Seven percentage calculators: percent of a number, percentage change, discount calculator, tip calculator, percentage difference, increase and decrease. Instant results.',
    url: 'https://www.freecalcs.io/percentage',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Percentage Calculator | 7 Tools in One | freecalcs.io',
    description: 'Seven percentage calculators: percent of a number, percentage change, discount calculator, tip calculator, percentage difference, increase and decrease. Instant results.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
