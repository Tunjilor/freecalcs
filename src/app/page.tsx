import Link from "next/link";

const calcs = [
  // Row 1 — Real estate (4 cards)
  { slug: "mortgage", label: "Mortgage Calculator", icon: "🏠", desc: "Payments, amortization & more", category: null },
  { slug: "qualify", label: "Mortgage Qualifier", icon: "✅", desc: "Do you qualify for a mortgage?", category: null },
  { slug: "rent-vs-buy", label: "Rent vs Buy", icon: "🏡", desc: "Is buying a home worth it?", category: null },
  { slug: "loan", label: "Loan & EMI", icon: "🏦", desc: "Monthly payments for any loan", category: null },

  // Row 2 — Income & finance (4 cards)
  { slug: "salary", label: "Salary & Take-Home", icon: "💵", desc: "Net pay after federal & state taxes", category: null },
  { slug: "tax", label: "Income Tax", icon: "🧾", desc: "Federal income tax estimate 2024", category: null },
  { slug: "compound-interest", label: "Compound Interest", icon: "📈", desc: "Savings & investment growth", category: null },
  { slug: "percentage", label: "Percentage Calculator", icon: "﹪", desc: "Percent of, change & difference", category: null },

  // Row 3 — Health & general (4 cards)
  { slug: "bmi", label: "BMI Calculator", icon: "⚖️", desc: "Body mass index for adults", category: null },
  { slug: "tdee", label: "TDEE & Calories", icon: "🔥", desc: "Daily energy expenditure & macros", category: null },
  { slug: "age", label: "Age Calculator", icon: "🎂", desc: "Exact age in years, months & days", category: null },
  { slug: "tip", label: "Tip Calculator", icon: "🍽️", desc: "Split bills & calculate tips", category: null },
];

const categories = [
  { label: "🏠 Real estate & mortgage", start: 0, end: 4 },
  { label: "💰 Income & finance", start: 4, end: 8 },
  { label: "❤️ Health & general", start: 8, end: 12 },
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f9fb; }

        .nav-link {
          color: #6b7280; text-decoration: none;
          font-size: 14px; font-weight: 500;
          transition: color 0.15s;
        }
        .nav-link:hover { color: #111; }

        .calc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 0;
        }

        .calc-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px 18px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
          min-height: 120px;
        }
        .calc-card:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 20px rgba(37,99,235,0.10);
          transform: translateY(-2px);
        }
        .calc-icon { font-size: 26px; line-height: 1; margin-bottom: 6px; }
        .calc-label { font-size: 14px; font-weight: 700; color: #111; line-height: 1.3; }
        .calc-desc { font-size: 12px; color: #9ca3af; line-height: 1.4; }

        .category-label {
          font-size: 11px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin: 28px 0 10px;
        }
        .category-label:first-of-type { margin-top: 0; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 18px;
        }
        .pulse {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #2563eb;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* Tablet: 2 columns */
        @media (max-width: 900px) {
          .calc-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .calc-card { min-height: 100px; }
        }

        /* Mobile: 2 columns, compact */
        @media (max-width: 600px) {
          .calc-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .calc-card { padding: 14px 12px; min-height: 90px; }
          .calc-icon { font-size: 22px; }
          .calc-label { font-size: 13px; }
          .calc-desc { font-size: 11px; display: none; }
          h1 { font-size: 30px !important; }
          .hero-section { padding: 32px 16px 20px !important; }
          .grid-section { padding: 0 16px 60px !important; }
          .category-label { margin-top: 20px; }
        }

        /* Very small phones: still 2 columns */
        @media (max-width: 360px) {
          .calc-grid { gap: 8px; }
          .calc-card { padding: 12px 10px; }
          .calc-icon { font-size: 20px; }
          .calc-label { font-size: 12px; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>freecalcs</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>.io</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/about" className="nav-link">About</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 32px" }}>
        <div className="hero-badge">
          <span className="pulse" />
          100% free — no sign-up, no ads blocking results
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 50px)", fontWeight: 800, lineHeight: 1.1, color: "#111", marginBottom: 14 }}>
          The calculators<br />
          <span style={{ color: "#2563eb" }}>people actually use</span>
        </h1>
        <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 440, lineHeight: 1.6 }}>
          Fast, accurate tools for money, health, and everyday decisions. Built to compete with the best — completely free.
        </p>
      </section>

      {/* Calculator grid */}
      <section className="grid-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        {categories.map((cat) => (
          <div key={cat.label}>
            <p className="category-label">{cat.label}</p>
            <div className="calc-grid">
              {calcs.slice(cat.start, cat.end).map((c) => (
                <Link key={c.slug + c.label} href={"/" + c.slug} className="calc-card">
                  <span className="calc-icon">{c.icon}</span>
                  <span className="calc-label">{c.label}</span>
                  <span className="calc-desc">{c.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "28px 24px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
        © {new Date().getFullYear()} freecalcs.io — Free tools, always.
      </footer>
    </main>
  );
}