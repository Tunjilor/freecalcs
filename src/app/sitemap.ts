import type { MetadataRoute } from 'next';
import { execFileSync } from 'node:child_process';

const base = 'https://www.freecalcs.io';

type ChangeFreq = 'weekly' | 'monthly' | 'yearly';

// `src` is the file or route directory whose git history decides the page's
// lastmod. A route directory covers its page, client component, definition,
// compute module, and so on.
const pages: { path: string; src: string; priority: number; changeFreq: ChangeFreq }[] = [
  { path: '', src: 'src/app/page.tsx', priority: 1.0, changeFreq: 'weekly' },
  { path: '/mortgage', src: 'src/app/mortgage', priority: 0.9, changeFreq: 'monthly' },
  { path: '/va-loan', src: 'src/app/va-loan', priority: 0.9, changeFreq: 'monthly' },
  { path: '/refinance', src: 'src/app/refinance', priority: 0.9, changeFreq: 'monthly' },
  { path: '/heloc', src: 'src/app/heloc', priority: 0.8, changeFreq: 'monthly' },
  { path: '/home-affordability', src: 'src/app/home-affordability', priority: 0.9, changeFreq: 'monthly' },
  { path: '/down-payment', src: 'src/app/down-payment', priority: 0.8, changeFreq: 'monthly' },
  { path: '/fha-loan', src: 'src/app/fha-loan', priority: 0.9, changeFreq: 'monthly' },
  { path: '/usda-loan', src: 'src/app/usda-loan', priority: 0.9, changeFreq: 'monthly' },
  { path: '/mortgage-payoff', src: 'src/app/mortgage-payoff', priority: 0.9, changeFreq: 'monthly' },
  { path: '/15-vs-30-year-mortgage', src: 'src/app/15-vs-30-year-mortgage', priority: 0.8, changeFreq: 'monthly' },
  { path: '/debt-to-income', src: 'src/app/debt-to-income', priority: 0.9, changeFreq: 'monthly' },
  { path: '/amortization', src: 'src/app/amortization', priority: 0.9, changeFreq: 'monthly' },
  { path: '/closing-costs', src: 'src/app/closing-costs', priority: 0.9, changeFreq: 'monthly' },
  { path: '/mortgage-points', src: 'src/app/mortgage-points', priority: 0.8, changeFreq: 'monthly' },
  { path: '/auto-loan', src: 'src/app/auto-loan', priority: 0.9, changeFreq: 'monthly' },
  { path: '/personal-loan', src: 'src/app/personal-loan', priority: 0.9, changeFreq: 'monthly' },
  { path: '/debt-payoff', src: 'src/app/debt-payoff', priority: 0.9, changeFreq: 'monthly' },
  { path: '/loan-payoff', src: 'src/app/loan-payoff', priority: 0.8, changeFreq: 'monthly' },
  { path: '/credit-card-payoff', src: 'src/app/credit-card-payoff', priority: 0.9, changeFreq: 'monthly' },
  { path: '/debt-consolidation', src: 'src/app/debt-consolidation', priority: 0.9, changeFreq: 'monthly' },
  { path: '/tax-refund', src: 'src/app/tax-refund', priority: 0.9, changeFreq: 'monthly' },
  { path: '/paycheck', src: 'src/app/paycheck', priority: 0.9, changeFreq: 'monthly' },
  { path: '/self-employment-tax', src: 'src/app/self-employment-tax', priority: 0.8, changeFreq: 'monthly' },
  { path: '/capital-gains-tax', src: 'src/app/capital-gains-tax', priority: 0.8, changeFreq: 'monthly' },
  { path: '/qualify', src: 'src/app/qualify', priority: 0.9, changeFreq: 'monthly' },
  { path: '/salary', src: 'src/app/salary', priority: 0.9, changeFreq: 'monthly' },
  { path: '/tax', src: 'src/app/tax', priority: 0.9, changeFreq: 'monthly' },
  { path: '/bmi', src: 'src/app/bmi', priority: 0.8, changeFreq: 'monthly' },
  { path: '/tdee', src: 'src/app/tdee', priority: 0.8, changeFreq: 'monthly' },
  { path: '/compound-interest', src: 'src/app/compound-interest', priority: 0.8, changeFreq: 'monthly' },
  { path: '/retirement', src: 'src/app/retirement', priority: 0.9, changeFreq: 'monthly' },
  { path: '/401k', src: 'src/app/401k', priority: 0.9, changeFreq: 'monthly' },
  { path: '/roth-vs-traditional', src: 'src/app/roth-vs-traditional', priority: 0.8, changeFreq: 'monthly' },
  { path: '/savings-goal', src: 'src/app/savings-goal', priority: 0.8, changeFreq: 'monthly' },
  { path: '/emergency-fund', src: 'src/app/emergency-fund', priority: 0.8, changeFreq: 'monthly' },
  { path: '/budget', src: 'src/app/budget', priority: 0.8, changeFreq: 'monthly' },
  { path: '/hourly-to-salary', src: 'src/app/hourly-to-salary', priority: 0.8, changeFreq: 'monthly' },
  { path: '/inflation', src: 'src/app/inflation', priority: 0.9, changeFreq: 'monthly' },
  { path: '/investment-return', src: 'src/app/investment-return', priority: 0.8, changeFreq: 'monthly' },
  { path: '/net-worth', src: 'src/app/net-worth', priority: 0.8, changeFreq: 'monthly' },
  { path: '/calorie-deficit', src: 'src/app/calorie-deficit', priority: 0.8, changeFreq: 'monthly' },
  { path: '/body-fat', src: 'src/app/body-fat', priority: 0.8, changeFreq: 'monthly' },
  { path: '/rent-affordability', src: 'src/app/rent-affordability', priority: 0.9, changeFreq: 'monthly' },
  { path: '/car-affordability', src: 'src/app/car-affordability', priority: 0.9, changeFreq: 'monthly' },
  { path: '/car-lease', src: 'src/app/car-lease', priority: 0.9, changeFreq: 'monthly' },
  { path: '/student-loan', src: 'src/app/student-loan', priority: 0.9, changeFreq: 'monthly' },
  { path: '/sales-tax', src: 'src/app/sales-tax', priority: 0.9, changeFreq: 'monthly' },
  { path: '/discount', src: 'src/app/discount', priority: 0.8, changeFreq: 'monthly' },
  { path: '/profit-margin', src: 'src/app/profit-margin', priority: 0.8, changeFreq: 'monthly' },
  { path: '/cd', src: 'src/app/cd', priority: 0.8, changeFreq: 'monthly' },
  { path: '/simple-interest', src: 'src/app/simple-interest', priority: 0.7, changeFreq: 'monthly' },
  { path: '/macro', src: 'src/app/macro', priority: 0.8, changeFreq: 'monthly' },
  { path: '/life-insurance', src: 'src/app/life-insurance', priority: 0.9, changeFreq: 'monthly' },
  { path: '/term-life', src: 'src/app/term-life', priority: 0.8, changeFreq: 'monthly' },
  { path: '/auto-insurance-estimator', src: 'src/app/auto-insurance-estimator', priority: 0.8, changeFreq: 'monthly' },
  { path: '/loan', src: 'src/app/loan', priority: 0.8, changeFreq: 'monthly' },
  { path: '/rent-vs-buy', src: 'src/app/rent-vs-buy', priority: 0.8, changeFreq: 'monthly' },
  { path: '/age', src: 'src/app/age', priority: 0.7, changeFreq: 'monthly' },
  { path: '/percentage', src: 'src/app/percentage', priority: 0.7, changeFreq: 'monthly' },
  { path: '/tip', src: 'src/app/tip', priority: 0.7, changeFreq: 'monthly' },
  { path: '/blog', src: 'src/app/blog/page.tsx', priority: 0.8, changeFreq: 'weekly' },
  ...[
    'using-your-va-loan-twice',
    'heloc-to-pay-off-credit-card-debt',
    'roth-vs-traditional-95k-income',
    'pay-off-low-rate-mortgage-early',
    'can-i-buy-a-house-with-640-credit-score',
    'should-i-refinance-to-save-200-a-month',
    'how-big-should-emergency-fund-be',
    'rent-or-buy-a-home',
    'starting-retirement-savings-at-42',
    '15-year-vs-30-year-mortgage',
    'compound-interest-explained',
    '2026-tax-brackets-guide',
    'how-to-calculate-mortgage-payment',
    'what-is-tdee',
    'bmi-what-your-number-means',
    'fha-vs-conventional-vs-va-vs-usda',
    'usda-loan-eligibility',
    'fha-vs-conventional-which-is-cheaper',
    'mortgage-refinance-requirements',
    'va-loan-eligibility',
    'fha-loan-requirements',
    '28-36-rule-mortgage',
    'pay-off-mortgage-early',
  ].map((slug) => ({
    path: `/blog/${slug}`,
    src: `src/app/blog/${slug}`,
    priority: 0.7,
    changeFreq: 'monthly' as const,
  })),
  { path: '/scientific', src: 'src/app/scientific', priority: 0.7, changeFreq: 'monthly' },
  { path: '/privacy', src: 'src/app/privacy', priority: 0.3, changeFreq: 'yearly' },
  { path: '/about', src: 'src/app/about', priority: 0.5, changeFreq: 'yearly' },
  { path: '/contact', src: 'src/app/contact', priority: 0.4, changeFreq: 'yearly' },
  { path: '/terms', src: 'src/app/terms', priority: 0.3, changeFreq: 'yearly' },
  { path: '/affiliate-disclosure', src: 'src/app/affiliate-disclosure', priority: 0.3, changeFreq: 'yearly' },
];

// Last commit date for every file under src/app, newest first, from one
// `git log` call at build time. Returns an empty map if git or the history is
// unavailable, in which case every page falls back to the build date.
//
// On a shallow clone the oldest commit in the clone appears to add every file,
// so a page untouched within the clone's depth gets that commit's date. That
// date is later than the real one but never later than the build, so it is
// still the better guess.
function gitLastModified(): Map<string, Date> {
  const dates = new Map<string, Date>();
  try {
    const out = execFileSync(
      'git',
      ['log', '--format=@%cI', '--name-only', '--no-renames', '--', 'src/app'],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
    );
    let current: Date | null = null;
    for (const line of out.split('\n')) {
      const l = line.trim();
      if (!l) continue;
      if (l.startsWith('@')) {
        current = new Date(l.slice(1));
      } else if (current && !dates.has(l)) {
        dates.set(l, current);
      }
    }
  } catch {
    // No git binary or no repository: use the build-date fallback.
  }
  return dates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();
  const fileDates = gitLastModified();

  const lastModifiedFor = (src: string): Date => {
    let latest: Date | null = null;
    for (const [file, date] of fileDates) {
      if ((file === src || file.startsWith(`${src}/`)) && (!latest || date > latest)) latest = date;
    }
    return latest ?? buildDate;
  };

  return pages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: lastModifiedFor(p.src),
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }));
}
