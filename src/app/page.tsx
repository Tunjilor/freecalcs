import Link from "next/link";

const calcs = [
  { slug: "mortgage", label: "Mortgage Calculator", icon: "🏠", desc: "Monthly payments, amortization & more" },
  { slug: "qualify", label: "Mortgage Qualifier", icon: "✅", desc: "Do you qualify for a mortgage?" },
  { slug: "rent-vs-buy", label: "Rent vs Buy", icon: "🏡", desc: "Is buying a home worth it?" },
  { slug: "salary", label: "Salary & Take-Home", icon: "💵", desc: "Net pay after federal & state taxes" },
  { slug: "tax", label: "Income Tax", icon: "🧾", desc: "Federal income tax estimate 2024" },
  { slug: "bmi", label: "BMI Calculator", icon: "⚖️", desc: "Body mass index for adults" },
  { slug: "tdee", label: "TDEE & Calories", icon: "🔥", desc: "Daily energy expenditure & macros" },
  { slug: "compound-interest", label: "Compound Interest", icon: "📈", desc: "Savings & investment growth" },
  { slug: "loan", label: "Loan & EMI", icon: "🏦", desc: "Monthly payments for any loan" },
  { slug: "age", label: "Age Calculator", icon: "🎂", desc: "Exact age in years, months & days" },
  { slug: "percentage", label: "Percentage Calculator", icon: "﹪", desc: "Percent of, change & difference" },
  { slug: "mortgage", label: "Coming Soon", icon: "🔜", desc: "More calculators on the way" },
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f9fb; }
        .nav-link { color: #6b7280; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .calc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .calc-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .calc-card:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 20px rgba(37,99,235,0.10);
          transform: translateY(-2px);
        }
        .calc-card.coming-soon {
          opacity: 0.45;
          cursor: default;
          pointer-events: none;
          background: #f8f9fb;
        }
        .calc-icon { font-size: 28px; line-height: 1; margin-bottom: 4px; }
        .calc-label { font-size: 15px; font-weight: 600; color: #111; }
        .calc-desc { font-size: 13px; color: #9ca3af; line-height: 1.4; }
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
          width: 7px; height: 7px; border-radius: 50%;
          background: #2563eb;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .category-label {
          font-size: 11px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 10px;
          margin-top: 24px;
        }
        @media (max-width: 1000px) {
          .calc-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 680px) {
          .calc-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .calc-card { padding: 16px; }
          .calc-icon { font-size: 22px; }
          .calc-label { font-size: 13px; }
          .calc-desc { font-size: 11px; }
          .hero-section { padding: 36px 16px 24px !important; }
          .grid-section { padding: 0 16px 60px !important; }
          nav { padding: 0 16px !important; }
          h1 { font-size: 32px !important; }
        }
        @media (max-width: 380px) {
          .calc-grid { gap: 8px; }
          .calc-card { padding: 12px; }
          .calc-icon { font-size: 20px; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
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
      <section className="hero-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 36px" }}>
        <div className="hero-badge">
          <span className="pulse" />
          100% free — no sign-up, no ads blocking results
        </div>
        <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.1, color: "#111", marginBottom: 14 }}>
          The calculators<br />
          <span style={{ color: "#2563eb" }}>people actually use</span>
        </h1>
        <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 460, lineHeight: 1.6 }}>
          Fast, accurate tools for money, health, and everyday decisions. Built to compete with the best — completely free.
        </p>
      </section>

      {/* Grid */}
      <section className="grid-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Real estate group label */}
        <p className="category-label">🏠 Real estate & mortgage</p>
        <div className="calc-grid" style={{ marginBottom: 0 }}>
          {calcs.slice(0, 3).map((c) => (
            <Link key={c.slug + c.label} href={"/" + c.slug}
              className={`calc-card${c.label === "Coming Soon" ? " coming-soon" : ""}`}>
              <span className="calc-icon">{c.icon}</span>
              <span className="calc-label">{c.label}</span>
              <span className="calc-desc">{c.desc}</span>
            </Link>
          ))}
        </div>

        {/* Finance group label */}
        <p className="category-label">💰 Income & finance</p>
        <div className="calc-grid" style={{ marginBottom: 0 }}>
          {calcs.slice(3, 7).map((c) => (
            <Link key={c.slug + c.label} href={"/" + c.slug}
              className={`calc-card${c.label === "Coming Soon" ? " coming-soon" : ""}`}>
              <span className="calc-icon">{c.icon}</span>
              <span className="calc-label">{c.label}</span>
              <span className="calc-desc">{c.desc}</span>
            </Link>
          ))}
        </div>

        {/* General group label */}
        <p className="category-label">🔢 General calculators</p>
        <div className="calc-grid">
          {calcs.slice(7).map((c) => (
            <Link key={c.slug + c.label} href={"/" + c.slug}
              className={`calc-card${c.label === "Coming Soon" ? " coming-soon" : ""}`}>
              <span className="calc-icon">{c.icon}</span>
              <span className="calc-label">{c.label}</span>
              <span className="calc-desc">{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "28px 24px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
        © {new Date().getFullYear()} freecalcs.io — Free tools, always.
      </footer>
    </main>
  );
}