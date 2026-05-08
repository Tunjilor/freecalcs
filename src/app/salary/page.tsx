import type { Metadata } from 'next';
import SalaryCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Salary & Take-Home Pay Calculator 2026 | All 50 States | freecalcs.io',
  description: 'Free salary and paycheck calculator. See real take-home pay after federal tax, state tax, FICA, and 401k deductions. All 50 states, 2026 rates. No sign-up.',
  alternates: { canonical: 'https://www.freecalcs.io/salary' },
  openGraph: { title: 'Salary & Take-Home Pay Calculator 2026 | All 50 States | freecalcs.io', description: 'Free salary calculator. All 50 states, 2026 rates.', url: 'https://www.freecalcs.io/salary', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Salary & Take-Home Pay Calculator 2026 | freecalcs.io', description: 'Free salary calculator. All 50 states, 2026 rates.' },
};
export default function Page() { return <SalaryCalculator />; }
