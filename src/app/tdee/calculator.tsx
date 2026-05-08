import type { Metadata } from 'next';
import TDEECalculator from './calculator';

export const metadata: Metadata = {
  title: 'TDEE Calculator 2026 | Total Daily Energy Expenditure & Macros | freecalcs.io',
  description: 'Free TDEE calculator using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas. Get maintenance calories, goal calories, and macro breakdown.',
  keywords: ['tdee calculator', 'free tdee calculator', 'freecalcs.io'],
  alternates: { canonical: 'https://www.freecalcs.io/tdee' },
  openGraph: {
    title: 'TDEE Calculator 2026 | Total Daily Energy Expenditure & Macros | freecalcs.io',
    description: 'Free TDEE calculator using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas. Get maintenance calories, goal calories, and macro breakdown.',
    url: 'https://www.freecalcs.io/tdee',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDEE Calculator 2026 | Total Daily Energy Expenditure & Macros | freecalcs.io',
    description: 'Free TDEE calculator using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas. Get maintenance calories, goal calories, and macro breakdown.',
  },
};

export default function Page() {
  return <TDEECalculator />;
}