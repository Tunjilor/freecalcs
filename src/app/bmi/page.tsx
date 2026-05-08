import Script from 'next/script';
import type { Metadata } from 'next';
import BMICalculator from './calculator';
export const metadata: Metadata = {
  title: 'BMI Calculator 2026 | Body Mass Index & Healthy Weight | freecalcs.io',
  description: 'Free BMI calculator with visual gauge, body fat estimate, BMI prime, healthy weight range, and health risk analysis. WHO/CDC standards. Adults and children.',
  alternates: { canonical: 'https://www.freecalcs.io/bmi' },
  openGraph: { title: 'BMI Calculator 2026 | freecalcs.io', description: 'BMI with body fat, BMI prime, healthy weight range, health risks.', url: 'https://www.freecalcs.io/bmi', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'BMI Calculator 2026 | freecalcs.io', description: 'BMI with body fat, BMI prime, and health risk analysis.' },
};
const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a healthy BMI range?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A healthy BMI is generally between 18.5 and 24.9. Below 18.5 is considered underweight, 25-29.9 is overweight, and 30 or above is classified as obese. BMI is a screening tool and does not directly measure body fat."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate is BMI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BMI is a useful population-level screening tool but has limitations for individuals. It does not distinguish between muscle and fat mass, so athletic people may have a high BMI despite being healthy. Body fat percentage is a more precise measure."
          }
        },
        {
          "@type": "Question",
          "name": "How is BMI calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BMI equals weight in kilograms divided by height in meters squared. In imperial units: (weight in pounds times 703) divided by (height in inches squared). The formula is the same for men and women."
          }
        },
        {
          "@type": "Question",
          "name": "What is BMI Prime?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BMI Prime is your BMI divided by 25 (the upper limit of normal weight). A BMI Prime of 1.0 means you are exactly at the upper threshold. Below 1.0 is normal weight, above 1.0 is overweight."
          }
        }
      ]
    },
    {
      "@type": "WebApplication",
      "name": "BMI Calculator",
      "url": "https://www.freecalcs.io/bmi",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
};

export default function Page() { return (<><Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} /><BMICalculator />; }
