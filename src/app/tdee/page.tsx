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
        },
        {
          "@type": "Question",
          "name": "How do I choose the right activity level for an accurate TDEE estimate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Be honest and conservative: Sedentary (desk job, little exercise); Lightly active (1-3 light workouts per week); Moderately active (3-5 workouts per week); Very active (6-7 hard workouts per week); Extra active (physical job plus daily training). Most people overestimate — start conservative and adjust based on real weight changes over 2-4 weeks."
          }
        },
        {
          "@type": "Question",
          "name": "Why do most people overestimate their activity level?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Research shows people overestimate how active they are by 30-50%. A one-hour gym session counts as lightly active if the other 23 hours involve sitting. NEAT (Non-Exercise Activity Thermogenesis — fidgeting, walking, standing) varies enormously between people and accounts for 15-30% of total daily energy expenditure. If eating at your calculated TDEE but not losing weight, drop to the activity level below and reassess."
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

const faqUi = [
  { q: 'What is TDEE and why does it matter for weight management?', a: "TDEE (Total Daily Energy Expenditure) is the total calories your body burns per day — BMR plus all physical activity. It's the key number for weight management: eat below TDEE to lose weight, above to gain, equal to maintain." },
  { q: 'What is the difference between BMR and TDEE?', a: "BMR is the calories your body burns at complete rest to stay alive (breathing, circulation, organ function). TDEE multiplies BMR by an activity factor. A sedentary person's TDEE is ~1.2× their BMR; a very active person's TDEE can be ~1.9× their BMR." },
  { q: 'Which TDEE formula is most accurate?', a: 'Mifflin-St Jeor (1990) is the most accurate for most people, with ~±10% error. Harris-Benedict is slightly less accurate but widely used. Katch-McArdle is most accurate if you know your body fat percentage, making it best for athletic or muscular individuals.' },
  { q: 'How many calories should I eat to lose 1 pound per week?', a: 'One pound of fat ≈ 3,500 calories. To lose 1 lb/week, eat 500 calories below your TDEE daily. To lose 2 lbs/week, eat 1,000 below. Most experts advise not going below 1,200 cal/day for women or 1,500 for men to avoid muscle loss.' },
  { q: 'How do I choose the right activity level for an accurate TDEE estimate?', a: "Be honest and conservative: Sedentary (desk job, minimal exercise); Lightly active (1–3 light workouts/week); Moderately active (3–5 workouts/week); Very active (6–7 hard workouts/week); Extra active (physical job + daily training). Most people overestimate — start conservative and adjust based on real weight changes over 2–4 weeks." },
  { q: 'Why do most people overestimate their activity level?', a: "Research consistently shows people overestimate how active they are by 30–50%. A one-hour gym session counts as 'lightly active' if the other 23 hours involve sitting. NEAT (Non-Exercise Activity Thermogenesis — fidgeting, walking, standing) accounts for 15–30% of total daily energy expenditure and varies enormously between people. If you're eating at your 'calculated' TDEE but not losing weight, drop to the activity level below and reassess." },
  { q: 'How many calories do I burn in a day without exercising?', a: "For a sedentary adult, TDEE is roughly: BMR × 1.2. For a 5'9\", 170 lb, 35-year-old man, BMR is ~1,800 calories, making TDEE ~2,160 calories without any planned exercise. For a 5'5\", 140 lb, 35-year-old woman, BMR is ~1,440, making TDEE ~1,728. These are estimates — track your actual weight changes over 2 weeks to calibrate." },
];

export default function Page() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} />
      <TDEECalculator />
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Frequently Asked Questions</h2>
        {faqUi.map(({ q, a }) => (
          <details key={q} style={{ borderBottom: '1px solid #e5e7eb', padding: '14px 0' }}>
            <summary style={{ fontWeight: 700, fontSize: 15, color: '#111', cursor: 'pointer', listStyle: 'none' }}>{q}</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
