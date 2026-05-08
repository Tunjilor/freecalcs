import type { Metadata } from 'next';
import TipCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Tip Calculator | Bill Splitter & Service Presets | freecalcs.io',
  description: 'Calculate tips and split bills. Custom tip percentage, service presets for restaurants, bars, salons, and rideshare.',
  alternates: { canonical: 'https://www.freecalcs.io/tip' },

  openGraph: { title: 'Tip Calculator | freecalcs.io', description: 'Calculate tips and split bills with service presets.', url: 'https://www.freecalcs.io/tip', siteName: 'freecalcs.io', type: 'website' },
};
export default function Page() { return <TipCalculator />; }
