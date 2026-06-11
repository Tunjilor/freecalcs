// Server-rendered, accessible comparison table for the four main loan programs.
// Horizontal scroll on small screens (keyboard-focusable region); the Feature
// column is a sticky row header so labels stay visible while scrolling.

const COLS = ['Conventional', 'FHA', 'VA', 'USDA'] as const;

const ROWS: { feature: string; values: string[] }[] = [
  {
    feature: 'Minimum down payment',
    values: ['As low as 3% (often 5%)', '3.5% with a 580+ score (10% if 500–579)', '0%', '0%'],
  },
  {
    feature: 'Minimum credit score',
    values: [
      'Typically 620',
      '580 for 3.5% down; 500–579 with 10% down',
      'No VA minimum; lenders often want 580–620',
      'No USDA minimum; lenders often want 640',
    ],
  },
  {
    feature: 'Mortgage insurance',
    values: [
      'PMI required if you put down less than 20%; cancellable once you reach ~20% equity',
      'Upfront MIP of 1.75% plus an annual MIP of about 0.45%–1.05% (commonly ~0.55%). Lasts the life of the loan unless you put 10%+ down, then it can drop after 11 years',
      'No monthly mortgage insurance',
      'Upfront guarantee fee of 1% plus an annual fee of 0.35%, for the life of the loan',
    ],
  },
  {
    feature: 'One-time upfront fee',
    values: [
      'None (beyond PMI)',
      '1.75% upfront MIP (can be rolled into the loan)',
      'Funding fee, typically 2.15% for first use with no down payment (range ~1.25%–3.3%); $0 for veterans with a service-connected disability',
      '1% guarantee fee (can be rolled into the loan)',
    ],
  },
  {
    feature: 'Income limits',
    values: ['None for standard loans', 'None', 'None', 'Yes — generally up to 115% of the area median income'],
  },
  {
    feature: 'Location restrictions',
    values: ['None', 'None', 'None', 'Home must be in a USDA-eligible rural or suburban area'],
  },
  {
    feature: 'Loan limits (2026, one-unit)',
    values: [
      'Conforming baseline $832,750 (up to $1,249,125 in high-cost areas)',
      'Floor $541,287; ceiling $1,249,125 (varies by county)',
      'No limit with full entitlement',
      'No set limit; capped by income and repayment ability',
    ],
  },
  {
    feature: 'Occupancy',
    values: ['Primary, second home, or investment', 'Primary residence', 'Primary residence', 'Primary residence'],
  },
  {
    feature: 'Best for',
    values: [
      'Buyers with 620+ credit who can avoid lifelong insurance and cancel PMI later',
      'First-time buyers, lower credit scores, or higher debt-to-income ratios',
      'Eligible veterans, active-duty service members, and qualifying surviving spouses',
      'Low-to-moderate-income buyers in eligible rural and suburban areas',
    ],
  },
];

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const colHeadBase: React.CSSProperties = {
  background: '#1e3a5f',
  color: '#fff',
  fontSize: 12,
  fontWeight: 700,
  textAlign: 'left',
  padding: '13px 16px',
  textTransform: 'uppercase',
  letterSpacing: '.04em',
  verticalAlign: 'middle',
  borderBottom: '1px solid #1e3a5f',
};

export default function ComparisonTable() {
  return (
    <div
      role="region"
      aria-label="Comparison of Conventional, FHA, VA, and USDA home loans"
      tabIndex={0}
      style={{
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 24px rgba(0,0,0,.06)',
        background: '#fff',
      }}
    >
      <table style={{ width: '100%', minWidth: 820, borderCollapse: 'collapse', fontSize: 14 }}>
        <caption style={srOnly}>
          Side-by-side comparison of Conventional, FHA, VA, and USDA home loans by down payment, credit score,
          mortgage insurance, fees, income and location limits, loan limits, occupancy, and who each loan is best for.
          Figures reflect 2026 program rules.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              style={{
                ...colHeadBase,
                position: 'sticky',
                left: 0,
                zIndex: 2,
                minWidth: 168,
                borderRight: '1px solid rgba(255,255,255,.15)',
              }}
            >
              Feature
            </th>
            {COLS.map((c) => (
              <th key={c} scope="col" style={{ ...colHeadBase, minWidth: 168 }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => {
            const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
            return (
              <tr key={row.feature}>
                <th
                  scope="row"
                  style={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                    background: bg,
                    color: '#0f172a',
                    fontSize: 13,
                    fontWeight: 700,
                    textAlign: 'left',
                    verticalAlign: 'top',
                    padding: '12px 16px',
                    lineHeight: 1.5,
                    borderBottom: '1px solid #e2e8f0',
                    borderRight: '1px solid #e2e8f0',
                  }}
                >
                  {row.feature}
                </th>
                {row.values.map((v, j) => (
                  <td
                    key={j}
                    style={{
                      background: bg,
                      color: '#374151',
                      fontSize: 13.5,
                      verticalAlign: 'top',
                      padding: '12px 16px',
                      lineHeight: 1.55,
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
