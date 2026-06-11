import Script from 'next/script';
import type { Metadata } from 'next';
import BMICalculator from './calculator';
export const metadata: Metadata = {
  title: 'BMI Calculator 2026 | Body Mass Index & Healthy Weight',
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
        },
        {
          "@type": "Question",
          "name": "Does BMI differ for men and women?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The standard BMI formula and categories are the same for men and women. However, at the same BMI, women typically have higher body fat percentages than men due to physiological differences. Some practitioners use separate body fat benchmarks by sex, but official WHO and CDC BMI categories are gender-neutral."
          }
        },
        {
          "@type": "Question",
          "name": "Is the BMI calculator different for children?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. BMI for children ages 2-19 uses age and sex in addition to height and weight. Rather than fixed categories, children's BMI is expressed as a percentile compared to peers of the same age and sex. At or above the 95th percentile is considered obese; 85th to 95th percentile is overweight. The CDC has a dedicated children's BMI calculator."
          }
        },
        {
          "@type": "Question",
          "name": "What should I track alongside BMI for a better picture of health?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BMI is a starting point. More complete indicators include waist circumference (high risk above 35 inches for women, 40 for men), waist-to-height ratio (below 0.5 is ideal), body fat percentage via DEXA scan, blood pressure, fasting blood glucose, and cholesterol levels."
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

const faqUi = [
  { q: 'What is a healthy BMI range for adults?', a: "A healthy BMI is generally between 18.5 and 24.9. Below 18.5 is underweight; 25–29.9 is overweight; 30+ is obese. BMI is a screening tool and doesn't directly measure body fat." },
  { q: 'Is BMI an accurate measure of health?', a: "BMI is a useful population-level screening tool but has limitations. It doesn't distinguish between muscle and fat — athletes may have a high BMI despite being very healthy. Use it alongside waist circumference, body fat percentage, and other health markers." },
  { q: 'How is BMI calculated?', a: "BMI = weight (kg) ÷ height² (m²). In imperial: (weight in lbs × 703) ÷ height² (inches). For a 170 lb person at 5'9\" (69 in): (170 × 703) ÷ 69² = 25.1." },
  { q: 'What is BMI prime?', a: "BMI prime is your BMI divided by 25 (the upper normal limit). A BMI prime of 1.0 means exactly at the normal/overweight boundary. Below 1.0 is normal; above 1.0 is overweight. A BMI prime of 0.9 means 10% below the overweight threshold." },
  { q: 'Does BMI differ for men and women?', a: "The BMI formula and categories are the same for men and women. However, at the same BMI, women typically have higher body fat percentages due to physiological differences. Some practitioners use sex-specific body fat benchmarks, but official WHO/CDC categories are gender-neutral." },
  { q: 'Is the BMI calculator different for children?', a: "Yes — BMI for children and teens (ages 2–19) uses age and sex in addition to height and weight. Rather than fixed categories, children's BMI is expressed as a percentile compared to others the same age and sex. A child in the 95th percentile or above is considered obese; 85th–95th percentile is overweight. The CDC has a dedicated children's BMI calculator." },
  { q: 'What should I track alongside BMI for a better picture of health?', a: "BMI is a starting point, not the full story. More complete health indicators include: waist circumference (high risk above 35 inches for women, 40 for men), waist-to-height ratio (below 0.5 is ideal), body fat percentage (measured by DEXA scan or bioelectrical impedance), blood pressure, fasting blood glucose, and cholesterol levels." },
];

export default function Page() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} />
      <BMICalculator />
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Frequently Asked Questions</h2>
        {faqUi.map(({ q, a }) => (
          <details key={q} style={{ borderBottom: '1px solid #e5e7eb', padding: '14px 0' }}>
            <summary style={{ fontWeight: 700, fontSize: 15, color: '#111', cursor: 'pointer', listStyle: 'none' }}>{q}</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{a}</p>
          </details>
        ))}
      </section>

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>What Is BMI and Why Does It Matter?</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Body Mass Index (BMI) is a number calculated from your height and weight that serves as a quick screening tool for weight-related health risk. It was developed by Belgian mathematician Adolphe Quetelet in the 1830s and adopted by the medical community as a low-cost, easily calculated proxy for body fat. Despite its age and limitations, it remains the most widely used health screening metric globally.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The formula is simple: weight in kilograms divided by height in meters squared. In imperial units: (weight in pounds × 703) ÷ height in inches². The result places you in one of five WHO-defined categories: underweight (below 18.5), normal weight (18.5–24.9), overweight (25–29.9), obese class I (30–34.9), obese class II (35–39.9), or obese class III (40+).</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>BMI Categories and Health Risk</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Research consistently shows that BMI correlates with health outcomes at the population level. Adults with a BMI in the obese range face significantly higher risks of type 2 diabetes, hypertension, heart disease, sleep apnea, and certain cancers. Conversely, very low BMI is associated with malnutrition, osteoporosis, and immune deficiency.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>However, BMI is a screening tool, not a diagnosis. The metric cannot distinguish between muscle and fat, and people of different ethnicities may face different health risks at the same BMI. Asian populations, for example, face elevated metabolic risk at BMI thresholds about 2–3 points lower than the WHO standards. Some health authorities now recommend a BMI cutoff of 23 for "overweight" in Asian adults.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>What to Do With Your BMI Result</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>A BMI outside the normal range is a prompt to look deeper — not a verdict. If your BMI is elevated, measure your waist circumference (high risk: above 35 inches for women, 40 inches for men) and ask your doctor about fasting blood glucose, blood pressure, and cholesterol. If your BMI is high because you're muscular, these other markers will likely be normal.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>If weight loss is the goal, knowing your Total Daily Energy Expenditure (TDEE) — how many calories you burn per day — is the next step. A consistent 500 calorie/day deficit below your TDEE produces roughly 1 pound of fat loss per week.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/tdee" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Calculate your TDEE →</a>
            <a href="/blog/bmi-what-your-number-means" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>What your BMI really means →</a>
          </div>
        </div>
      </article>
    </>
  );
}
