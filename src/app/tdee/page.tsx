import Script from 'next/script';
import type { Metadata } from 'next';
import TDEECalculator from './calculator';
export const metadata: Metadata = {
  title: 'TDEE Calculator 2026 | Total Daily Energy Expenditure',
  description: 'Free TDEE calculator using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas. Get maintenance calories, goal calories, and macro breakdown.',
  alternates: { canonical: 'https://www.freecalcs.io/tdee' },
  openGraph: { title: 'TDEE Calculator 2026 | freecalcs.io', description: 'TDEE, BMR, macros, and calorie goals. 3 formulas, all activity levels.', url: 'https://www.freecalcs.io/tdee', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'TDEE Calculator 2026 | freecalcs.io', description: 'TDEE and calorie goals with macro breakdown.' },
};
// FAQ structured data is generated from the visible faqUi array (below) so the
// JSON-LD always matches what users see on the page, per Google's requirements.
const faqSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": faqUi.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
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
});

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
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema())}} />
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

      <article style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>What TDEE Actually Tells You</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Your Total Daily Energy Expenditure is the total number of calories your body burns in 24 hours. It combines four components: Basal Metabolic Rate (BMR — calories burned at rest just keeping you alive, roughly 60–70% of total), the Thermic Effect of Food (digesting food burns 8–10% of calories consumed), Non-Exercise Activity Thermogenesis or NEAT (unconscious movement like fidgeting, standing, walking — highly variable between individuals), and Exercise Activity Thermogenesis (deliberate workouts — often overestimated).</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The reason NEAT matters so much: two people of identical height, weight, and workout frequency can have TDEEs 300–500 calories apart based solely on how much they move during their non-exercise hours. Someone who walks throughout the day at a standing desk burns dramatically more than someone who sits 10 hours straight, even if both "go to the gym."</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Which TDEE Formula Is Most Accurate?</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>This calculator uses three formulas. <strong>Mifflin-St Jeor</strong> (1990) is the gold standard for most people, validated by the Academy of Nutrition and Dietetics with an average error of about 10%. <strong>Harris-Benedict</strong> (revised 1984) tends to overestimate by 5% but is widely used in clinical settings. <strong>Katch-McArdle</strong> is the most accurate formula if you know your body fat percentage, because it calculates from lean body mass rather than total weight — making it the best choice for athletes and muscular individuals whose BMR is often underestimated by weight-only formulas.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>How to Use TDEE to Actually Reach Your Goal</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Losing 1 pound of fat requires a cumulative deficit of approximately 3,500 calories. A 500 calorie/day deficit below your TDEE produces roughly 1 pound of weekly fat loss. A 1,000 calorie/day deficit produces 2 pounds. Most experts recommend not exceeding 1 pound/week for sustained results — larger deficits increase muscle loss, hunger, and the risk of metabolic adaptation (your body reduces TDEE in response to undereating).</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>The most common mistake: using your TDEE as a "permission slip" to eat exactly that amount. Your TDEE is an estimate with a ±10% error margin. Weigh yourself daily, take the 7-day average, and track it weekly. If your weight isn't moving in the right direction after 2 weeks at your target calories, adjust by 100–150 calories and repeat. Real data beats any formula.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/bmi" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>BMI calculator →</a>
            <a href="/blog/what-is-tdee" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Complete TDEE guide →</a>
          </div>
        </div>
      </article>
    </>
  );
}
