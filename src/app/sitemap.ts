import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.freecalcs.io';
  const now = new Date();

  const pages = [
    { url: base, priority: 1.0, changeFreq: 'weekly' },
    { url: `${base}/mortgage`, priority: 0.9, changeFreq: 'monthly' },
    { url: `${base}/qualify`, priority: 0.9, changeFreq: 'monthly' },
    { url: `${base}/salary`, priority: 0.9, changeFreq: 'monthly' },
    { url: `${base}/tax`, priority: 0.9, changeFreq: 'monthly' },
    { url: `${base}/bmi`, priority: 0.8, changeFreq: 'monthly' },
    { url: `${base}/tdee`, priority: 0.8, changeFreq: 'monthly' },
    { url: `${base}/compound-interest`, priority: 0.8, changeFreq: 'monthly' },
    { url: `${base}/loan`, priority: 0.8, changeFreq: 'monthly' },
    { url: `${base}/rent-vs-buy`, priority: 0.8, changeFreq: 'monthly' },
    { url: `${base}/age`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/percentage`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/tip`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/blog`, priority: 0.8, changeFreq: 'weekly' },
    { url: `${base}/blog/compound-interest-explained`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/blog/2026-tax-brackets-guide`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/blog/how-to-calculate-mortgage-payment`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/blog/what-is-tdee`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/blog/bmi-what-your-number-means`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/blog/fha-vs-conventional-vs-va-vs-usda`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/blog/28-36-rule-mortgage`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/blog/pay-off-mortgage-early`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/scientific`, priority: 0.7, changeFreq: 'monthly' },
    { url: `${base}/privacy`, priority: 0.3, changeFreq: 'yearly' },
    { url: `${base}/about`, priority: 0.5, changeFreq: 'yearly' },
  ];

  return pages.map(p => ({
    url: p.url,
    lastModified: now,
    changeFrequency: p.changeFreq as 'weekly' | 'monthly' | 'yearly',
    priority: p.priority,
  }));
}