import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Calculators | Mortgage, Tax, Salary, BMI & More | freecalcs.io",
  description: "Free online calculators for mortgage payments, income tax, salary, compound interest, BMI, TDEE, and more. No sign-up required. Fast, accurate, and mobile-friendly.",
  alternates: { canonical: "https://www.freecalcs.io" },
  openGraph: { title: "Free Online Calculators | freecalcs.io", description: "Fast, accurate tools for money, health, and everyday decisions.", url: "https://www.freecalcs.io", siteName: "freecalcs.io", type: "website" },
};

const calcs = [
  { slug: "mortgage", label: "Mortgage Calculator", icon: "🏠", desc: "Payments, amortization & loan comparison" },
  { slug: "qualify", label: "Mortgage Qualifier", icon: "✅", desc: "Check all 5 loan programs instantly" },
  { slug: "rent-vs-buy", label: "Rent vs Buy", icon: "🏡", desc: "True cost comparison over time" },
  { slug: "loan", label: "Loan & EMI", icon: "🏦", desc: "Monthly payments for any loan type" },
  { slug: "salary", label: "Salary & Take-Home", icon: "💵", desc: "Net pay after federal & state taxes" },
  { slug: "tax", label: "Income Tax 2026", icon: "🧾", desc: "Federal tax, refund & bracket breakdown" },
  { slug: "compound-interest", label: "Compound Interest", icon: "📈", desc: "Growth chart & contribution impact" },
  { slug: "percentage", label: "Percentage Calculator", icon: "﹪", desc: "7 percentage tools in one" },
  { slug: "bmi", label: "BMI Calculator", icon: "⚖️", desc: "BMI, body fat & health analysis" },
  { slug: "tdee", label: "TDEE & Calories", icon: "🔥", desc: "Daily calories, BMR & macro split" },
  { slug: "age", label: "Age Calculator", icon: "🎂", desc: "Exact age, zodiac & milestones" },
  { slug: "tip", label: "Tip Calculator", icon: "🍽️", desc: "Split bills & service presets" },
  { slug: "scientific", label: "Scientific Calculator", icon: "🔬", desc: "Trig, log, exponents & memory" },
];

const categories = [
  { label: "🏠 Real estate & mortgage", start: 0, end: 4 },
  { label: "💰 Income & finance", start: 4, end: 8 },
  { label: "❤️ Health & everyday", start: 8, end: 13 },
];

const blogPosts = [
  { slug: "compound-interest-explained", title: "Compound Interest: Why Einstein Called It the 8th Wonder", category: "Investing", color: "#7c3aed" },
  { slug: "2026-tax-brackets-guide", title: "2026 Federal Tax Brackets: Complete Guide", category: "Taxes", color: "#ef4444" },
  { slug: "how-to-calculate-mortgage-payment", title: "How to Calculate Your Mortgage Payment", category: "Mortgage", color: "#2563eb" },
  { slug: "what-is-tdee", title: "What is TDEE and How Many Calories Should You Eat?", category: "Health", color: "#10b981" },
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f8fafc 0%,#eef2ff 40%,#f0fdf4 100%)", fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Inter,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .calc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 0;
        }
        .calc-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 18px;
          padding: 22px 18px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.25s ease;
          min-height: 120px;
        }
        .calc-card:hover {
          border-color: #2563eb;
          box-shadow: 0 8px 30px rgba(37,99,235,0.12);
          transform: translateY(-3px);
        }
        .calc-icon { font-size: 28px; line-height: 1; margin-bottom: 6px; }
        .calc-label { font-size: 14px; font-weight: 700; color: #111; line-height: 1.3; }
        .calc-desc { font-size: 12px; color: #64748b; line-height: 1.4; }
        .category-label {
          font-size: 11px; font-weight: 700; color: #64748b;
          text-transform: uppercase; letter-spacing: 0.07em;
          margin: 32px 0 12px;
        }
        .category-label:first-of-type { margin-top: 0; }
        .blog-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 16px;
          padding: 20px;
          text-decoration: none;
          display: block;
          transition: all 0.25s ease;
        }
        .blog-card:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 20px rgba(37,99,235,0.08);
          transform: translateY(-2px);
        }
        @media (max-width: 900px) {
          .calc-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .calc-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .calc-card { padding: 14px 12px; min-height: 90px; }
          .calc-icon { font-size: 22px; }
          .calc-label { font-size: 13px; }
          .calc-desc { font-size: 11px; display: none; }
          .hero-section { padding: 32px 16px 20px !important; }
          .grid-section { padding: 0 16px 40px !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)", padding: "0 0 56px" }}>

        <section className="hero-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", padding: "6px 16px", borderRadius: 24, marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite", flexShrink: 0 }}></span>
            <span style={{ fontSize: 13, color: "#93c5fd", fontWeight: 500 }}>13 free calculators — no sign-up, no ads</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.08, color: "#fff", marginBottom: 16, letterSpacing: "-0.02em" }}>
            The calculators<br />
            <span style={{ background: "linear-gradient(90deg,#60a5fa,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>people actually use.</span>
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", maxWidth: 480, lineHeight: 1.65, marginBottom: 28 }}>
            Fast, accurate tools for money, health, and everyday decisions. Built to compete with the best — completely free.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[["Mortgage","mortgage"],["Salary","salary"],["Tax 2026","tax"],["Compound Interest","compound-interest"]].map(([label, slug]) => (
              <Link key={slug} href={"/"+slug} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 12, textDecoration: "none", transition: "background 0.15s", backdropFilter: "blur(8px)" }}>{label}</Link>
            ))}
          </div>
        </section>
      </div>

      {/* Calculator grid */}
      <section className="grid-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 48px" }}>
        {categories.map((cat) => (
          <div key={cat.label}>
            <p className="category-label">{cat.label}</p>
            <div className="calc-grid">
              {calcs.slice(cat.start, cat.end).map((c) => (
                <Link key={c.slug} href={"/" + c.slug} className="calc-card">
                  <span className="calc-icon">{c.icon}</span>
                  <span className="calc-label">{c.label}</span>
                  <span className="calc-desc">{c.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Blog section */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Latest from the Blog</h2>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Guides, tips, and strategies to make smarter decisions</p>
          </div>
          <Link href="/blog" style={{ fontSize: 13, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>View all →</Link>
        </div>
        <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {blogPosts.map((post) => (
            <Link key={post.slug} href={"/blog/" + post.slug} className="blog-card">
              <div style={{ height: 4, background: post.color, borderRadius: 4, marginBottom: 14 }}></div>
              <span style={{ fontSize: 10, fontWeight: 700, color: post.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{post.category}</span>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "8px 0 0", lineHeight: 1.4 }}>{post.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "28px 32px", border: "1px solid rgba(226,232,240,0.8)", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {[
            ["🔒", "100% Private", "All calculations happen in your browser"],
            ["⚡", "Instant Results", "No loading, no waiting, no sign-up"],
            ["📱", "Mobile Friendly", "Works perfectly on any device"],
            ["🎯", "Accurate", "Built with real formulas and 2026 data"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ textAlign: "center", flex: "1 1 200px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>{title}</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>© 2026 freecalcs.io — Free tools, always.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/blog" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Blog</Link>
            <Link href="/about" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>About</Link>
            <Link href="/privacy" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
