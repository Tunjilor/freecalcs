import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tip Calculator | Bill Splitter & Service Presets | freecalcs.io',
  description: 'Calculate tips and split bills. Custom tip percentage, service presets for restaurants, bars, salons, and rideshare. Round-up option and per-person breakdown.',
  alternates: { canonical: 'https://www.freecalcs.io/tip' },
  openGraph: {
    title: 'Tip Calculator | Bill Splitter & Service Presets | freecalcs.io',
    description: 'Calculate tips and split bills. Custom tip percentage, service presets for restaurants, bars, salons, and rideshare. Round-up option and per-person breakdown.',
    url: 'https://www.freecalcs.io/tip',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tip Calculator | Bill Splitter & Service Presets | freecalcs.io',
    description: 'Calculate tips and split bills. Custom tip percentage, service presets for restaurants, bars, salons, and rideshare. Round-up option and per-person breakdown.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
