import Script from 'next/script';
import type { Metadata } from 'next';
import TDEECalculator from './calculator';
export const metadata: Metadata = {
  title: 'TDEE Calculator 2026 | Total Daily Energy Expenditure & Macros | freecalcs.io',
  description: 'Free TDEE calculator using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas. Get maintenance calories, goal calories, and macro breakdown.',
  alternates: { canonical: 'https://www.freecalcs.io/tdee' },
  openGraph: { title: 'TDEE Calculator 2026 | freecalcs.io', description: 'TDEE, BMR, macros, and calorie goals. 3 formulas, all activity levels.', url: 'https://www.freecalcs.io/tdee', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'TDEE Calculator 2026 | freecalcs.io', description: 'TDEE and calorie goals with macro breakdown.' },
};
const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is TDEE?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day. It includes your Basal Metabolic Rate, the thermic effect of food, and all physical activity. Eating below your TDEE creates a calorie deficit for fat loss."
          }
        },
        {
          "@type": "Question",
          "name": "What is the most accurate BMR formula?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Mifflin-St Jeor equation is considered the most accurate for most people and is recommended by the Academy of Nutrition and Dietetics. The Katch-McArdle formula is more accurate if you know your body fat percentage."
          }
        },
        {
          "@type": "Question",
          "name": "How many calories should I eat to lose weight?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A safe calorie deficit is 500 calories below your TDEE, which results in approximately 1 pound of fat loss per week. Never eat below 1,200 calories for women or 1,500 for men without medical supervision."
          }
        },
        {
          "@type": "Question",
          "name": "How does activity level affect TDEE?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Activity level can increase your calorie needs by 20% to 90% above your BMR. A sedentary person might burn 1,800 calories daily while a very active person of the same size could burn 3,000 or more."
          }
        }
      ]
    },
    {
      "@type": "WebApplication",
      "name": "TDEE Calculator",
      "url": "https://www.freecalcs.io/tdee",
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

export default function Page() { return (<><Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} /><TDEECalculator /></>); }
