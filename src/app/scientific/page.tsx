import type { Metadata } from 'next';
import ScientificCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Scientific Calculator | Trig, Logs, Square Roots & Constants | freecalcs.io',
  description: 'Free online scientific calculator with trigonometric functions (sin, cos, tan), logarithms, square roots, exponents, and constants π and e. No download required.',
  alternates: { canonical: 'https://www.freecalcs.io/scientific' },
  openGraph: { title: 'Scientific Calculator | freecalcs.io', description: 'Trig functions, logarithms, square roots, exponents, and constants — full scientific calculator, free online.', url: 'https://www.freecalcs.io/scientific', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Scientific Calculator | freecalcs.io', description: 'Free online scientific calculator with trig, logs, square roots, and constants.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Scientific Calculator',
      url: 'https://www.freecalcs.io/scientific',
      description: 'Free online scientific calculator with trigonometric functions, logarithms, square roots, exponents, and constants π and e.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What scientific functions does this calculator support?', acceptedAnswer: { '@type': 'Answer', text: 'This calculator supports basic arithmetic (+ - × ÷), exponentiation (^), trigonometric functions (sin, cos, tan), logarithms (log base 10, natural log ln), square root (√), parentheses for grouping, and the constants π (pi = 3.14159) and e (Euler\'s number = 2.71828). All trig functions use radians.' } },
        { '@type': 'Question', name: 'How do I calculate sine, cosine, and tangent?', acceptedAnswer: { '@type': 'Answer', text: 'Click sin(, cos(, or tan(, enter your angle in radians, close the parenthesis, and press =. To convert degrees to radians multiply by π/180. Example: sin(30°) = sin(0.5236) ≈ 0.5. Common values: sin(π/2) = 1, cos(0) = 1, tan(π/4) = 1.' } },
        { '@type': 'Question', name: 'How do I calculate a square root or logarithm?', acceptedAnswer: { '@type': 'Answer', text: 'Square root: press √(, enter the number, press =. Example: √(144) = 12. Log base 10: press log(, enter the number, press =. Example: log(100) = 2. Natural log (base e): press ln(, enter the number, press =. Example: ln(e) = 1.' } },
        { '@type': 'Question', name: 'What is the order of operations in this calculator?', acceptedAnswer: { '@type': 'Answer', text: 'This calculator follows PEMDAS/BODMAS: Parentheses first, then Exponents (^), then Multiplication and Division left to right, then Addition and Subtraction left to right. Use parentheses to ensure calculations execute in the intended order when combining multiple operations.' } },
        { '@type': 'Question', name: 'How do I use π and e in calculations?', acceptedAnswer: { '@type': 'Answer', text: 'Press the π button to insert pi (3.14159265) into your expression. Press the e button to insert Euler\'s number (2.71828182). You can use them like any other number. For example: 2 × π ≈ 6.2832; e^2 ≈ 7.389.' } },
      ],
    },
  ],
};

const faqs = [
  { q: 'What scientific functions does this calculator support?', a: "This calculator supports basic arithmetic (+ - × ÷), exponentiation (^), trigonometric functions (sin, cos, tan), logarithms (log base 10 and natural log ln), square root (√), parentheses for grouping, and constants π (pi = 3.14159) and e (Euler's number = 2.71828). All trig functions use radians." },
  { q: 'How do I calculate sine, cosine, and tangent?', a: "Click 'sin(', 'cos(', or 'tan(', enter your angle in radians, close the parenthesis, and press =. To convert degrees to radians multiply by π/180. Example: sin(30°) = sin(0.5236) ≈ 0.5. Common values: sin(π/2) = 1, cos(0) = 1, tan(π/4) = 1." },
  { q: 'How do I calculate a square root or logarithm?', a: "Square root: press √(, enter the number, press =. Example: √(144) = 12. Log base 10: press log(, enter the number, press =. Example: log(100) = 2. Natural log (base e): press ln(, enter the number, press =. Example: ln(e) = 1." },
  { q: 'What is the order of operations in this calculator?', a: 'This calculator follows PEMDAS/BODMAS: Parentheses first, then Exponents (^), then Multiplication and Division left to right, then Addition and Subtraction left to right. Use parentheses to ensure calculations execute in the intended order when combining multiple operations.' },
  { q: 'How do I use π and e in calculations?', a: "Press the π button to insert pi (3.14159265) into your expression. Press the e button to insert Euler's number (2.71828182). You can use them like any other number. For example: 2 × π ≈ 6.2832; e^2 ≈ 7.389." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ScientificCalculator />
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Frequently Asked Questions</h2>
        {faqs.map(({ q, a }) => (
          <details key={q} style={{ borderBottom: '1px solid #e5e7eb', padding: '14px 0' }}>
            <summary style={{ fontWeight: 700, fontSize: 15, color: '#111', cursor: 'pointer', listStyle: 'none' }}>{q}</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
