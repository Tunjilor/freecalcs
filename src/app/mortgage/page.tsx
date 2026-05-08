import Script from 'next/script';
import type { Metadata } from 'next';
import MortgageCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Mortgage Calculator 2026 | Payment, Amortization & Comparison | freecalcs.io',
  description: 'Calculate monthly mortgage payments with full amortization schedule, extra payment impact, and loan comparison. Includes PMI, taxes, and insurance.',
  alternates: { canonical: 'https://www.freecalcs.io/mortgage' },
  openGraph: {
    title: 'Mortgage Calculator 2026 | freecalcs.io',
    description: 'Full mortgage payment breakdown with amortization, extra payments, and loan comparison.',
    url: 'https://www.freecalcs.io/mortgage',
    siteName: 'freecalcs.io',
    type: 'website',
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
          "name": "How is a monthly mortgage payment calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Monthly payments are calculated using the loan amount, interest rate, and loan term. The formula accounts for amortization so each payment covers both principal and interest, with early payments being mostly interest."
          }
        },
        {
          "@type": "Question",
          "name": "What is PMI and when is it required?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. PMI typically costs 0.5% to 1% of the loan amount annually and can be removed once you reach 20% equity."
          }
        },
        {
          "@type": "Question",
          "name": "Should I get a 15-year or 30-year mortgage?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 15-year mortgage has higher monthly payments but saves roughly half the total interest compared to a 30-year. A 30-year offers lower payments and more flexibility. Choose based on your budget and financial goals."
          }
        },
        {
          "@type": "Question",
          "name": "How much do extra payments save?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Even an extra $100 per month on a $320,000 mortgage at 6.5% can save over $45,000 in interest and pay off the loan 4-5 years early. Extra payments go directly toward principal reduction."
          }
        },
        {
          "@type": "Question",
          "name": "What credit score do I need for the best mortgage rate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A credit score of 740 or higher typically qualifies for the best conventional mortgage rates. Scores between 680-739 get good rates, while FHA loans accept scores as low as 580 with a 3.5% down payment."
          }
        }
      ]
    },
    {
      "@type": "WebApplication",
      "name": "Mortgage Calculator",
      "url": "https://www.freecalcs.io/mortgage",
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
  return (<><Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} /><MortgageCalculator /></>);
}
