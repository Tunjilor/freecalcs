import Script from 'next/script';
import type { Metadata } from 'next';
import TaxCalculator from './calculator';
export const metadata: Metadata = {
  title: 'Federal Income Tax Calculator 2026 | Refund Estimator | freecalcs.io',
  description: 'Estimate your 2026 federal tax bill or refund. Bracket breakdown, capital gains tax, self-employment tax, child tax credit, and tax planning tips.',
  alternates: { canonical: 'https://www.freecalcs.io/tax' },

  openGraph: { title: 'Federal Income Tax Calculator 2026 | freecalcs.io', description: 'Estimate your 2026 federal tax bill or refund.', url: 'https://www.freecalcs.io/tax', siteName: 'freecalcs.io', type: 'website' },
};
const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do federal tax brackets work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tax brackets are marginal, meaning only the income within each bracket is taxed at that rate. For example, if you earn $50,000, you do not pay 22% on all of it. The first $11,600 is taxed at 10%, the next portion at 12%, and so on."
          }
        },
        {
          "@type": "Question",
          "name": "Should I take the standard deduction or itemize?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Take whichever is larger. The 2026 standard deduction is $15,000 for single filers and $30,000 for married filing jointly. Itemize only if your mortgage interest, state taxes, charitable donations, and other deductions exceed these amounts."
          }
        },
        {
          "@type": "Question",
          "name": "What is the capital gains tax rate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Long-term capital gains (assets held over one year) are taxed at 0%, 15%, or 20% depending on your income. Short-term gains are taxed as ordinary income. Most people pay the 15% long-term rate."
          }
        },
        {
          "@type": "Question",
          "name": "How does the child tax credit work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The child tax credit provides up to $2,000 per qualifying child under age 17. Up to $1,700 is refundable, meaning you can receive it even if you owe no tax. Income phase-outs begin at $200,000 for single filers."
          }
        },
        {
          "@type": "Question",
          "name": "What is self-employment tax?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Self-employed individuals pay both the employer and employee portions of Social Security and Medicare, totaling 15.3% on net earnings. You can deduct half of this amount from your gross income on your tax return."
          }
        }
      ]
    },
    {
      "@type": "WebApplication",
      "name": "Income Tax Calculator",
      "url": "https://www.freecalcs.io/tax",
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

export default function Page() { return (<><Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} /><TaxCalculator /></>); }
