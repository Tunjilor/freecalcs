// Centralized design tokens for the calculator system.
//
// This is the SINGLE source of truth for color, gradient, radius, spacing,
// typography, and chart palette across every calculator page. Per
// docs/BUILD-STANDARD.md §3, no calculator or definition hardcodes a hex value —
// they read from here so the whole family looks like one product.
//
// The values below intentionally match the visual language already shipped in
// the existing pages (blue #2563eb primary, dark slate hero gradient, soft
// grey cards) so /va-loan is indistinguishable in family from /mortgage.

export const tokens = {
  color: {
    // Brand
    brand: "#2563eb",
    brandDark: "#1e3a5f",
    brandTint: "#eff6ff", // light blue chip / link background
    // Ink / text
    ink: "#111111",
    ink900: "#0f172a",
    body: "#374151",
    muted: "#6b7280",
    faint: "#9ca3af",
    // Surfaces & lines
    surface: "#ffffff",
    surfaceAlt: "#f8f9fb",
    pageTint: "#f8fafc",
    line: "#e5e7eb",
    lineSoft: "#f3f4f6",
    // Status
    success: "#15803d",
    successBg: "#dcfce7",
    successBorder: "#86efac",
    warn: "#92400e",
    warnBg: "#fffbeb",
    warnBorder: "#fcd34d",
    danger: "#dc2626",
    dangerBg: "#fee2e2",
    dangerBorder: "#fca5a5",
    onBrand: "#ffffff",
    onBrandFaint: "rgba(255,255,255,0.65)",
    onBrandPanel: "rgba(255,255,255,0.15)",
  },
  gradient: {
    hero: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)",
    page: "linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)",
  },
  radius: { sm: 8, md: 10, lg: 14, xl: 20 },
  space: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28 },
  font: {
    family:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
    // sizes
    label: 12,
    body: 14,
    lead: 15,
    h2: 22,
    h3: 18,
    hero: 56,
  },
  // Chart series palette (principal / interest / accent). Ordered by salience.
  chart: ["#2563eb", "#dc2626", "#15803d", "#f59e0b", "#7c3aed"],
  shadow: {
    hero: "0 8px 32px rgba(37,99,235,.25)",
    card: "0 1px 3px rgba(0,0,0,0.08)",
  },
  layout: { maxWidth: 1100, readWidth: 720, inputCol: 380 },
} as const;

export type Tokens = typeof tokens;
