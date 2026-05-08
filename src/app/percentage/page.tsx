import type { Metadata } from 'next';
import PercentageCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Percentage Calculator | 7 Tools in One | freecalcs.io',
  description: 'Seven percentage calculators: percent of a number, percentage change, discount calculator, tip calculator, percentage difference, increase and decrease.',
  alternates: { canonical: 'https://www.freecalcs.io/percentage' },
};
export default function Page() { return <PercentageCalculator />; }
