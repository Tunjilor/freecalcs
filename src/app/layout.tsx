import type { Metadata } from 'next';
import './globals.css';

// Google AdSense publisher ID. This is ONLY the loader / site-verification
// script (for review) — no ad units or Auto Ads are configured yet.
const ADSENSE_CLIENT = 'ca-pub-4733406265730984';

// Impact.com site-verification tag. Impact issues this with a non-standard
// `value` attribute instead of `content`, so React's <meta> types reject it as
// a literal JSX attribute. React renders it correctly at runtime — the gap is
// only in the typings — so it's spread in as props. Do not "fix" this to
// `content`: Impact's crawler matches on `value` and would fail verification.
const IMPACT_VERIFICATION = {
  name: 'impact-site-verification',
  value: '8f4f74b5-feb3-41fb-bca1-1ef420685622',
} as React.MetaHTMLAttributes<HTMLMetaElement>;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.freecalcs.io'),
  title: { default: 'Free Calculators -- freecalcs.io', template: '%s' },
  description: 'Free online calculators for mortgage, salary, BMI, taxes, compound interest and more. Fast, accurate, no sign-up required.',
  keywords: ['free calculator','mortgage calculator','salary calculator','BMI calculator','tax calculator','compound interest calculator','TDEE calculator','loan calculator'],
  authors: [{ name: 'freecalcs.io' }],
  creator: 'freecalcs.io',
  publisher: 'freecalcs.io',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { type: 'website', locale: 'en_US', url: 'https://www.freecalcs.io', siteName: 'freecalcs.io' },
  twitter: { card: 'summary_large_image', site: '@freecalcsio' },
};

const CALCS = [
  { name: 'Mortgage Calculator', href: '/mortgage', icon: 'H' },
  { name: 'Mortgage Qualifier', href: '/qualify', icon: 'Q' },
  { name: 'VA Loan Calculator', href: '/va-loan', icon: 'V' },
  { name: 'Refinance Calculator', href: '/refinance', icon: 'I' },
  { name: 'HELOC Calculator', href: '/heloc', icon: 'J' },
  { name: 'Home Affordability', href: '/home-affordability', icon: 'M' },
  { name: 'Down Payment', href: '/down-payment', icon: 'W' },
  { name: 'Rent vs Buy', href: '/rent-vs-buy', icon: 'R' },
  { name: 'Loan & EMI', href: '/loan', icon: 'L' },
  { name: 'Auto Loan Calculator', href: '/auto-loan', icon: 'U' },
  { name: 'Personal Loan Calculator', href: '/personal-loan', icon: 'N' },
  { name: 'Debt Payoff Calculator', href: '/debt-payoff', icon: 'X' },
  { name: 'Loan Payoff Calculator', href: '/loan-payoff', icon: 'O' },
  { name: 'Credit Card Payoff', href: '/credit-card-payoff', icon: '$' },
  { name: 'Debt Consolidation', href: '/debt-consolidation', icon: '≡' },
  { name: 'Salary & Take-Home', href: '/salary', icon: 'S' },
  { name: 'Income Tax', href: '/tax', icon: 'T' },
  { name: 'Tax Refund Estimator', href: '/tax-refund', icon: 'F' },
  { name: 'Paycheck Calculator', href: '/paycheck', icon: 'K' },
  { name: 'Self-Employment Tax', href: '/self-employment-tax', icon: 'E' },
  { name: 'Capital Gains Tax', href: '/capital-gains-tax', icon: 'G' },
  { name: 'Compound Interest', href: '/compound-interest', icon: 'C' },
  { name: 'Retirement Calculator', href: '/retirement', icon: 'Z' },
  { name: '401(k) Calculator', href: '/401k', icon: 'Y' },
  { name: 'Roth vs Traditional', href: '/roth-vs-traditional', icon: '⊕' },
  { name: 'Savings Goal', href: '/savings-goal', icon: '★' },
  { name: 'Life Insurance', href: '/life-insurance', icon: '✚' },
  { name: 'Term Life Insurance', href: '/term-life', icon: '❉' },
  { name: 'Auto Insurance Estimator', href: '/auto-insurance-estimator', icon: '🚗' },
  { name: 'Percentage Calc', href: '/percentage', icon: '%' },
  { name: 'BMI Calculator', href: '/bmi', icon: 'B' },
  { name: 'TDEE & Calories', href: '/tdee', icon: 'D' },
  { name: 'Age Calculator', href: '/age', icon: 'A' },
  { name: 'Tip Calculator', href: '/tip', icon: 'P' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Impact.com site verification (site-wide, in <head>) — verification only,
            no affiliate links or tracking. Written as a literal <meta> rather than
            via the Metadata API's verification.other, because Impact's tag uses a
            non-standard `value` attribute and the Metadata API only ever emits
            `content` — which Impact's crawler would not match. Kept here so the
            literal tag is present in the RAW HTML head for a no-JS crawl. */}
        <meta {...IMPACT_VERIFICATION} />
        {/* Awin site verification (site-wide, in <head>) — verification only, no
            affiliate links or tracking. Awin's tag uses the generic name="verification"
            with the standard `content` attribute, so it's a plain literal <meta> (no
            typing workaround needed, unlike Impact's non-standard `value`). Kept as a
            literal tag so it's present in the RAW HTML head for a no-JS crawl. Do NOT
            normalize the two providers' attributes to match — each crawler matches on
            the exact attribute it issued (`value` for Impact, `content` for Awin). */}
        <meta name="verification" content="06de1a74130867843f1972e9c3002820" />
        {/* Google AdSense loader (site-wide, in <head>) — verification/review only,
            no ad units. Rendered as a plain <script> so the literal tag is present
            in the RAW HTML head for AdSense's no-JS site review. (next/script in the
            App Router only emits a preload link + client injection, which a no-JS
            scan can miss.) */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif', background: '#f8fafc' }}>

        {/* Global Nav */}
        <nav style={{ background: '#1e3a5f', borderBottom: '1px solid rgba(255,255,255,.1)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#2563eb', color: '#fff', fontWeight: 800, fontSize: 15, padding: '3px 8px', borderRadius: 6, letterSpacing: '-0.3px' }}>free</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>calcs.io</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <a href="/blog" className="nav-link">Blog</a>
              <a href="/about" className="nav-link">About</a>
              <span style={{ color: '#64748b', fontSize: 12, marginLeft: 8, background: 'rgba(255,255,255,.08)', padding: '3px 10px', borderRadius: 20 }}>100% Free</span>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main>{children}</main>

        {/* Global Footer */}
        <footer style={{ background: '#0f172a', color: '#94a3b8', marginTop: 60 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px 32px' }}>

            {/* Top: brand + all calculators */}
            <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40, marginBottom: 40 }}>

              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ background: '#2563eb', color: '#fff', fontWeight: 800, fontSize: 14, padding: '2px 7px', borderRadius: 5 }}>free</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>calcs.io</span>
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.6, margin: '0 0 16px', color: '#64748b' }}>Free, accurate calculators for money, health, and everyday decisions. No sign-up. No ads blocking results. Always free.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <a href="/blog" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>Blog</a>
                  <a href="/about" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>About</a>
                  <a href="/contact" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>Contact</a>
                  <a href="/privacy" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>Privacy Policy</a>
                  <a href="/terms" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>Terms of Service</a>
                  <a href="/affiliate-disclosure" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>Affiliate Disclosure</a>
                </div>
              </div>

              {/* All Calculators */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 14px' }}>All Calculators</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '6px 12px' }}>
                  {CALCS.map(c => (
                    <a key={c.href} href={c.href} style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 5, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#60a5fa', flexShrink: 0 }}>{c.icon}</span>
                      {c.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <p style={{ fontSize: 12, margin: 0, color: '#475569' }}>
                &copy; 2026 freecalcs.io &mdash; Free tools, always.
              </p>
              <p style={{ fontSize: 11, margin: 0, color: '#334155' }}>
                Not financial, tax, or medical advice. For informational purposes only.
              </p>
            </div>
          </div>
        </footer>

        <style>{`
          *{box-sizing:border-box;}
          body{-webkit-font-smoothing:antialiased;}
          a:hover{opacity:.85;}
          input,select,textarea{font-family:inherit;}
          .nav-link{color:#cbd5e1;font-size:13px;font-weight:500;text-decoration:none;padding:6px 12px;border-radius:8px;transition:background .15s;}
          .nav-link:hover{background:rgba(255,255,255,.1);opacity:1;}
          @media(max-width:680px){
            .footer-grid{grid-template-columns:1fr!important;}
          }
        `}</style>
      </body>
    </html>
  );
}