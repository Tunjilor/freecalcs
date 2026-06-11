import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.freecalcs.io';

  // Per-page last-modified dates, derived from git history (last commit that
  // touched each route). Pages updated in the SEO cleanup carry that date.
  // Update the relevant entry when a page's content materially changes.
  const pages = [
    { url: base, priority: 1.0, changeFreq: 'weekly', lastMod: '2026-05-09' },
    { url: `${base}/mortgage`, priority: 0.9, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/qualify`, priority: 0.9, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/salary`, priority: 0.9, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/tax`, priority: 0.9, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/bmi`, priority: 0.8, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/tdee`, priority: 0.8, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/compound-interest`, priority: 0.8, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/loan`, priority: 0.8, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/rent-vs-buy`, priority: 0.8, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/age`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/percentage`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-05-28' },
    { url: `${base}/tip`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/blog`, priority: 0.8, changeFreq: 'weekly', lastMod: '2026-05-07' },
    { url: `${base}/blog/compound-interest-explained`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-05-09' },
    { url: `${base}/blog/2026-tax-brackets-guide`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-05-28' },
    { url: `${base}/blog/how-to-calculate-mortgage-payment`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-05-09' },
    { url: `${base}/blog/what-is-tdee`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-05-09' },
    { url: `${base}/blog/bmi-what-your-number-means`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-05-09' },
    { url: `${base}/blog/fha-vs-conventional-vs-va-vs-usda`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/blog/usda-loan-eligibility`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/blog/fha-vs-conventional-which-is-cheaper`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/blog/mortgage-refinance-requirements`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/blog/va-loan-eligibility`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/blog/fha-loan-requirements`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/blog/28-36-rule-mortgage`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-05-09' },
    { url: `${base}/blog/pay-off-mortgage-early`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-05-09' },
    { url: `${base}/scientific`, priority: 0.7, changeFreq: 'monthly', lastMod: '2026-06-10' },
    { url: `${base}/privacy`, priority: 0.3, changeFreq: 'yearly', lastMod: '2026-05-08' },
    { url: `${base}/about`, priority: 0.5, changeFreq: 'yearly', lastMod: '2026-05-07' },
  ];

  return pages.map(p => ({
    url: p.url,
    lastModified: p.lastMod,
    changeFrequency: p.changeFreq as 'weekly' | 'monthly' | 'yearly',
    priority: p.priority,
  }));
}
