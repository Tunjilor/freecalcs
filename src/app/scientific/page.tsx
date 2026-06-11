import type { Metadata } from 'next';
import ScientificCalculator from './calculator';

export const metadata: Metadata = {
  title: 'Scientific Calculator | Trig, Logs & Square Roots',
  description: 'Free online scientific calculator with trigonometric functions (sin, cos, tan), logarithms, square roots, exponents, and constants π and e. No download required.',
  alternates: { canonical: 'https://www.freecalcs.io/scientific' },
  openGraph: { title: 'Scientific Calculator | freecalcs.io', description: 'Trig functions, logarithms, square roots, exponents, and constants — full scientific calculator, free online.', url: 'https://www.freecalcs.io/scientific', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Scientific Calculator | freecalcs.io', description: 'Free online scientific calculator with trig, logs, square roots, and constants.' },
};

// FAQ structured data is generated from the visible faqs array so the JSON-LD
// always matches what users see on the page, per Google's requirements.
const jsonLd = () => ({
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
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
});

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
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

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>What This Scientific Calculator Can Do</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>This free online scientific calculator supports the full range of functions needed for algebra, trigonometry, pre-calculus, and basic engineering calculations. It handles arithmetic operations, exponentiation, trigonometric functions (sin, cos, tan in radians), inverse functions, logarithms (base 10 and natural log), square roots, and the constants π and e — everything you'd find on a standard scientific calculator, in your browser with no download or sign-up required.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Trigonometry: Working in Radians</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>This calculator's trig functions (sin, cos, tan) accept angles in radians, which is the standard in mathematics and most scientific contexts. If you have an angle in degrees, convert it first: multiply by π/180. Common conversions to memorize: 30° = π/6 ≈ 0.5236 radians; 45° = π/4 ≈ 0.7854; 60° = π/3 ≈ 1.0472; 90° = π/2 ≈ 1.5708; 180° = π ≈ 3.1416.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Key trig values to know: sin(0) = 0, sin(π/6) = 0.5, sin(π/2) = 1. cos(0) = 1, cos(π/3) = 0.5, cos(π/2) = 0. tan(π/4) = 1. These come up constantly in physics, engineering, and calculus problems.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Logarithms: log vs ln</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>log (base 10) answers the question: "10 to what power equals this number?" log(100) = 2 because 10² = 100. log(1000) = 3. log(1) = 0. ln (natural log, base e) answers: "e to what power equals this number?" ln(e) = 1. ln(1) = 0. ln(e²) = 2. Natural logarithms appear throughout calculus, physics, and financial mathematics — compound interest, radioactive decay, and population growth all use ln.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>To convert between bases: log base b of x = ln(x) / ln(b). To calculate log base 2 of 32: ln(32) / ln(2) = 3.466 / 0.693 = 5. This is the change of base formula, and this calculator handles it through the ln and log functions.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Exponents and the ^ Operator</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>Use ^ for powers: 2^10 = 1024, 3^4 = 81, 5^0.5 = √5 ≈ 2.236. Negative exponents: 2^-3 = 1/8 = 0.125. Fractional exponents are equivalent to roots: x^(1/3) is the cube root of x. Combine with parentheses for complex expressions: (2+3)^2 = 25. The calculator evaluates full expressions before returning a result, so you can chain multiple operations with parentheses for precision.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/percentage" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Percentage calculator →</a>
            <a href="/compound-interest" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Compound interest calculator →</a>
          </div>
        </div>
      </article>
    </>
  );
}
