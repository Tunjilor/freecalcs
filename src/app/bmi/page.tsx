import type { Metadata } from 'next';
import BMICalculator from './calculator';

export const metadata: Metadata = {
  title: 'BMI Calculator 2026 | Body Mass Index & Healthy Weight | freecalcs.io',
  description: 'Free BMI calculator with visual gauge, body fat estimate, BMI prime, healthy weight range, and health risk analysis. WHO/CDC standards. Adults and children.',
  keywords: ['bmi calculator', 'free bmi calculator', 'freecalcs.io'],
  alternates: { canonical: 'https://www.freecalcs.io/bmi' },
  openGraph: {
    title: 'BMI Calculator 2026 | Body Mass Index & Healthy Weight | freecalcs.io',
    description: 'Free BMI calculator with visual gauge, body fat estimate, BMI prime, healthy weight range, and health risk analysis. WHO/CDC standards. Adults and children.',
    url: 'https://www.freecalcs.io/bmi',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator 2026 | Body Mass Index & Healthy Weight | freecalcs.io',
    description: 'Free BMI calculator with visual gauge, body fat estimate, BMI prime, healthy weight range, and health risk analysis. WHO/CDC standards. Adults and children.',
  },
};

export default function Page() {
  return <BMICalculator />;
}