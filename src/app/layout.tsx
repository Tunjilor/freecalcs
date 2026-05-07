import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.freecalcs.io"),
  title: {
    default: "Free Calculators — freecalcs.io",
    template: "%s | freecalcs.io",
  },
  description: "Free online calculators for mortgage, salary, BMI, taxes, compound interest and more. Fast, accurate, no sign-up required.",
  keywords: ["free calculator", "mortgage calculator", "salary calculator", "BMI calculator", "tax calculator", "compound interest calculator"],
  authors: [{ name: "freecalcs.io" }],
  creator: "freecalcs.io",
  publisher: "freecalcs.io",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: "freecalcs.io",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@freecalcsio",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}