import Link from "next/link";

const calcs = [
  { slug: "mortgage", label: "Mortgage", icon: "🏠", desc: "Monthly payments & amortization" },
  { slug: "salary", label: "Salary & Take-Home", icon: "💵", desc: "Net pay after taxes" },
  { slug: "bmi", label: "BMI", icon: "⚖️", desc: "Body mass index for adults" },
  { slug: "tdee", label: "TDEE & Calories", icon: "🔥", desc: "Daily energy & macros" },
  { slug: "tax", label: "Income Tax", icon: "🧾", desc: "Federal tax estimate" },
  { slug: "compound-interest", label: "Compound Interest", icon: "📈", desc: "Savings growth over time" },
  { slug: "loan", label: "Loan & EMI", icon: "🏦", desc: "Monthly repayments" },
  { slug: "rent-vs-buy", label: "Rent vs Buy", icon: "🏡", desc: "Is buying worth it?" },
  { slug: "tip", label: "Tip Calculator", icon: "🍽️", desc: "Split bills instantly" },
  { slug: "age", label: "Age Calculator", icon: "🎂", desc: "Exact age to the day" },
  { slug: "percentage", label: "Percentage", icon: "﹪", desc: "Percent of, change & more" },
  { slug: "scientific", label: "Scientific Calculator", icon: "🔬", desc: "Full scientific functions" },
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
        .calc-icon { font-size: 28px; line-height: 1; margin-bottom: 4px; }
        .calc-label { font-size: 15px; font-weight: 600; color: #111; }
        .calc-desc { font-size: 13px; color: #9ca3af; line-height: 1.4; }
        .nav-link { color: #6b7280; text-decoration: none; font-size: 14px; font-weight: 500; }
        .nav-link:hover { color: #111; }

        @media (max-width: 900px) {
          .calc-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .calc-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .calc-card { padding: 16px; }
          .calc-icon { font-size: 24px; }
          .calc-label { font-size: 14px; }
          .calc-desc { font-size: 12px; }
          h1 { font-size: 36px !important; }
          .hero { padding: 40px 16px 28px !important; }
          .grid-section { padding: 0 16px 60px !important; }
          nav { padding: 0 16px !important; }
          .nav-inner { padding: 0 !important; }
        }
        @media (max-width: 380px) {
          .calc-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .calc-card { padding: 12px; }
        }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 24px" }}>
        <div className="nav-inner" style={{ maxWidth: 1100, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>
            <b style={{ fontSize: 22, color: "#111" }}>freecalcs</b>
            <b style={{ fontSize: 22, color: "#2563eb" }}>.io</b>
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/about" className="nav-link">About</Link>
          </div>
        </div>
      </nav>

      <section className="hero" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 36px" }}>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, color: "#111", marginBottom: 14 }}>
          The calculators<br />
          <span style={{ color: "#2563eb" }}>people actually use</span>
        </h1>
        <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 440, lineHeight: 1.6 }}>
          Fast, accurate tools for money, health, and everyday math. Free, always.
        </p>
      </section>

      <section className="grid-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="calc-grid">
          {calcs.map((c) => (
            <Link key={c.slug} href={"/" + c.slug} className="calc-card">
              <span className="calc-icon">{c.icon}</span>
              <span className="calc-label">{c.label}</span>
              <span className="calc-desc">{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px 16px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
        © {new Date().getFullYear()} freecalcs.io — Free tools, always.
      </footer>
    </main>
  );
}