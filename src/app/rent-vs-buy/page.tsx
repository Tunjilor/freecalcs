import type { Metadata } from 'next';
import RentVsBuy from './calculator';

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator 2026 | Should You Buy a Home?',
  description: 'Find out whether buying or renting makes more financial sense. Includes home appreciation, property tax, rent increases, and break-even analysis.',
  alternates: { canonical: 'https://www.freecalcs.io/rent-vs-buy' },
  openGraph: { title: 'Rent vs Buy Calculator 2026 | freecalcs.io', description: 'Compare the true cost of renting vs buying a home over time.', url: 'https://www.freecalcs.io/rent-vs-buy', siteName: 'freecalcs.io', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Rent vs Buy Calculator 2026 | freecalcs.io', description: 'Find out whether renting or buying makes more financial sense with break-even analysis.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Rent vs Buy Calculator',
      url: 'https://www.freecalcs.io/rent-vs-buy',
      description: 'Find out whether buying or renting makes more financial sense with appreciation, property tax, rent increases, and break-even analysis.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'When does buying a home make more financial sense than renting?', acceptedAnswer: { '@type': 'Answer', text: 'Buying makes sense when you plan to stay past the break-even point (typically 3–7 years), local price-to-rent ratios are reasonable, you can afford a 10–20% down payment, and you are financially stable. If you might move within 2–3 years, renting is usually cheaper once transaction costs are factored in.' } },
        { '@type': 'Question', name: 'What is the break-even point for buying vs renting?', acceptedAnswer: { '@type': 'Answer', text: 'The break-even point is the number of years it takes for total buying costs (mortgage, down payment, taxes, maintenance) to equal total renting costs. It accounts for home appreciation, equity built, and rent increases over time. Most markets have break-even points between 3 and 8 years.' } },
        { '@type': 'Question', name: 'What hidden costs of homeownership should I factor in?', acceptedAnswer: { '@type': 'Answer', text: 'Beyond the mortgage: property tax (0.5–2.5% of value per year), homeowners insurance (~$1,200–$2,000 per year), maintenance (1–2% of home value per year), HOA fees if applicable, closing costs (2–5% of purchase price), and potential major repairs. These hidden costs can add $500–$1,500+ per month to true housing cost.' } },
        { '@type': 'Question', name: 'How does home appreciation affect the rent vs buy decision?', acceptedAnswer: { '@type': 'Answer', text: 'Home appreciation builds equity over time and is a major factor in whether buying beats renting. At 3% annual appreciation, a $400,000 home is worth about $537,000 after 10 years. This gain partially offsets ownership costs. Higher appreciation markets favor buying; flat markets narrow the advantage.' } },
        { '@type': 'Question', name: 'Should I buy a house in 2026 or keep renting?', acceptedAnswer: { '@type': 'Answer', text: 'It depends on your local market, how long you plan to stay, and your financial readiness. Use this calculator with your actual numbers — home price, rent, mortgage rate, and expected years to stay. If the result shows renting is better over your timeframe, renting is likely the smarter financial move right now.' } },
        { '@type': 'Question', name: 'Is buying a home worth it in 2026 with high mortgage rates?', acceptedAnswer: { '@type': 'Answer', text: 'Higher rates of 6-7% shift the break-even point later, requiring a longer stay for buying to beat renting. At 7%, the break-even on a $400,000 home versus $2,200 monthly rent might be 6-8 years instead of 3-4 years at 4%. If rents are rising fast in your area and you plan to stay 7 or more years, buying can still make financial sense.' } },
        { '@type': 'Question', name: 'How much do I need saved before buying a home?', acceptedAnswer: { '@type': 'Answer', text: 'Beyond the down payment of 3-20% of the purchase price, you need closing costs of 2-5% of purchase price (typically $8,000-$20,000 on a $400,000 home), 2-6 months of mortgage payments in reserve, and an emergency fund for repairs. A good rule of thumb is to have at least 25-30% of the home purchase price saved in total before buying.' } },
      ],
    },
  ],
};

const faqs = [
  { q: 'When does buying a home make more financial sense than renting?', a: "Buying makes sense when you plan to stay past the break-even point (typically 3–7 years), local price-to-rent ratios are reasonable, you can afford a 10–20% down payment, and you're financially stable. If you might move within 2–3 years, renting is usually cheaper once transaction costs are factored in." },
  { q: 'What is the break-even point for buying vs renting?', a: 'The break-even point is how many years it takes for total buying costs to equal total renting costs, accounting for home appreciation, equity built, and rent increases. Most markets have break-even points between 3 and 8 years. Buying before your break-even point means renting was cheaper.' },
  { q: 'What hidden costs of homeownership should I factor in?', a: "Beyond the mortgage: property tax (0.5–2.5% of value/year), homeowners insurance (~$1,200–$2,000/year), maintenance (1–2% of home value/year), HOA fees if applicable, closing costs (2–5% of purchase price), and potential major repairs. These can add $500–$1,500+ to your true monthly housing cost." },
  { q: 'How does home appreciation affect the rent vs buy decision?', a: 'Home appreciation builds equity over time. At 3% annual appreciation, a $400,000 home is worth ~$537,000 after 10 years. This gain partially offsets ownership costs. Higher appreciation markets favor buying; flat or declining markets narrow the advantage.' },
  { q: 'Should I buy a house in 2026 or keep renting?', a: "It depends on your local market, how long you plan to stay, and your financial readiness. Use this calculator with your actual numbers — home price, rent, mortgage rate, and expected years to stay. If the result shows renting is better over your timeframe, renting is likely the smarter financial move right now." },
  { q: 'Is buying a home worth it in 2026 with high mortgage rates?', a: "Higher rates (6–7%) shift the break-even point later — you need to stay in the home longer for buying to beat renting. At 7%, the break-even on a $400,000 home vs $2,200/month rent might be 6–8 years instead of 3–4 years at 4%. That said, if rents in your area are rising fast, if you plan to stay 7+ years, or if you find an underpriced property, buying can still make sense. Run your actual numbers in this calculator to find your specific break-even." },
  { q: 'How much do I need saved before buying a home?', a: "Beyond the down payment (3–20% of purchase price), you need: closing costs (2–5% of purchase price, typically $8,000–$20,000 on a $400,000 home), 2–6 months of mortgage payments in reserve (most lenders require this), and an emergency fund for repairs. Rule of thumb: have at least 25–30% of the home's purchase price saved total before buying." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RentVsBuy />
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
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>Why Rent vs Buy Is More Than a Simple Math Problem</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The rent vs buy decision is the largest financial choice most people make — and it is frequently made with incomplete information. The common assumption that "buying is always better because you build equity" ignores the true costs of homeownership: closing costs (2–5% of purchase price), property taxes (0.5–2.5%/year), homeowners insurance, maintenance (budget 1–2% of value/year), and the opportunity cost of the down payment money.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Renting is not "throwing money away." Renters keep their down payment invested, avoid maintenance costs and repair surprises, and maintain the flexibility to move for better job opportunities. Whether renting or buying is smarter depends entirely on your local market, how long you plan to stay, and what you do with the money you would otherwise put toward a down payment and ownership costs.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>The Break-Even Point: The Number That Matters Most</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>The break-even point is how many years you need to stay in a home before buying becomes cheaper than renting. Before that point, renting is the better financial decision. After it, buying pulls ahead. In most US markets, break-even runs between 3 and 8 years. In expensive coastal cities like San Francisco or New York, it can be 10–15 years. In affordable Midwest markets, it may be under 3 years.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>At today's 6.5–7% mortgage rates, the break-even point has stretched significantly compared to the 2020–2021 low-rate environment. A home that made sense to buy at 3% may take 8 years to break even at 7%. Use the years slider in this calculator to find your personal break-even and compare it to how long you realistically plan to stay.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12, marginTop: 32 }}>Price-to-Rent Ratio: How to Read Your Local Market</h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>Divide a home's purchase price by its annual rent to get the price-to-rent ratio. A ratio below 15 generally favors buying; 15–20 is neutral; above 20 favors renting. In Austin, the ratio is around 18. In San Francisco, it is over 30 — meaning you'd pay 30 years of rent to buy an equivalent property. This is a quick market-level sanity check before running the full calculation.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>Home appreciation assumptions matter enormously. At 3% annual appreciation, a $400,000 home is worth $537,000 in 10 years — that $137,000 gain changes the calculation significantly. This calculator lets you adjust the appreciation rate for your market. Conservative estimate: use 2–3%. Optimistic: 4–5%. Never assume appreciation, however — some markets have seen home values stagnate or decline for a decade.</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/mortgage" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Mortgage payment calculator →</a>
            <a href="/qualify" style={{ background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>Do I qualify? →</a>
            <a href="/blog/28-36-rule-mortgage" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}>The 28/36 affordability rule →</a>
          </div>
        </div>
      </article>
    </>
  );
}
