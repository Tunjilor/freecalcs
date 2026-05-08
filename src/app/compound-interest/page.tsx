import Script from 'next/script';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import CompoundInterestCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | Growth Chart & Year-by-Year Table | freecalcs.io',
  description: 'See how your money grows with compound interest. Visual growth chart, year-by-year breakdown, contribution impact, inflation adjustment, and Rule of 72.',
  alternates: { canonical: 'https://www.freecalcs.io/compound-interest' },
  openGraph: {
    title: 'Compound Interest Calculator | freecalcs.io',
    description: 'Compound interest with growth chart, contributions, inflation, and Rule of 72.',
    url: 'https://www.freecalcs.io/compound-interest',
    siteName: 'freecalcs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator | freecalcs.io',
    description: 'Growth chart, contributions, inflation adjustment, and Rule of 72.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is compound interest?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Compound interest is interest earned on both your initial principal and on the interest that has already been added. This creates exponential growth over time, unlike simple interest which only earns on the original amount."
          }
        },
        {
          "@type": "Question",
          "name": "How often should interest compound?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The more frequently interest compounds, the more you earn. Daily compounding yields slightly more than monthly, which yields more than annually. Most savings accounts compound daily, while many investments compound monthly or quarterly."
          }
        },
        {
          "@type": "Question",
          "name": "What is the Rule of 72?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Rule of 72 is a quick way to estimate how long it takes to double your money. Divide 72 by your annual interest rate. For example, at 8% interest, your money doubles in approximately 9 years (72 / 8 = 9)."
          }
        },
        {
          "@type": "Question",
          "name": "How does inflation affect compound interest?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Inflation reduces the real purchasing power of your returns. If your investment earns 8% but inflation is 3%, your real return is approximately 5%. Always consider inflation-adjusted returns when planning long-term."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between APR and APY?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "APR (Annual Percentage Rate) is the stated interest rate without compounding. APY (Annual Percentage Yield) includes the effect of compounding. APY is always equal to or higher than APR and reflects what you actually earn."
          }
        },
        {
          "@type": "Question",
          "name": "How much will $10,000 grow in 20 years?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "At 7% compounded annually, $10,000 grows to approximately $38,697 in 20 years. At 10%, it grows to about $67,275. Adding monthly contributions dramatically increases the final amount."
          }
        }
      ]
    },
    {
      "@type": "WebApplication",
      "name": "Compound Interest Calculator",
      "url": "https://www.freecalcs.io/compound-interest",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
};

export default function Page() {
  return (<><Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} /><CompoundInterestCalculator /></>);
}