import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.freecalcs.io'),
  title: { default: 'Free Calculators -- freecalcs.io', template: '%s | freecalcs.io' },
  description: 'Free online calculators for mortgage, salary, BMI, taxes, compound interest and more. Fast, accurate, no sign-up required.',
  keywords: ['free calculator','mortgage calculator','salary calculator','BMI calculator','tax calculator','compound interest calculator','TDEE calculator','loan calculator'],
  authors: [{ name: 'freecalcs.io' }],
  creator: 'freecalcs.io',
  publisher: 'freecalcs.io',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { type: 'website', locale: 'en_US', url: 'https://www.freecalcs.io', siteName: 'freecalcs.io', title: 'Free Calculators -- freecalcs.io', description: 'Free online calculators for mortgage, salary, BMI, taxes, compound interest and more.' },
  twitter: { card: 'summary_large_image', site: '@freecalcsio', title: 'Free Calculators -- freecalcs.io', description: 'Free online calculators for mortgage, salary, BMI, taxes, compound interest and more.' },
};

const CALCS = [
  { name: 'Mortgage Calculator', href: '/mortgage', icon: 'H' },
  { name: 'Mortgage Qualifier', href: '/qualify', icon: 'Q' },
  { name: 'Rent vs Buy', href: '/rent-vs-buy', icon: 'R' },
  { name: 'Loan & EMI', href: '/loan', icon: 'L' },
  { name: 'Salary & Take-Home', href: '/salary', icon: 'S' },
  { name: 'Income Tax', href: '/tax', icon: 'T' },
  { name: 'Compound Interest', href: '/compound-interest', icon: 'C' },
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
                  <a href="/privacy" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>Privacy Policy</a>
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
