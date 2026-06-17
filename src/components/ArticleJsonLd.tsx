import type { AuthorInfo } from './Author';

// Reusable Article structured data for blog posts. Renders an Article schema
// with a Person author and datePublished/dateModified. Drop one of these into
// any post: <ArticleJsonLd headline=... description=... url=... author={AUTHORS.x}
// datePublished="2026-06-17" dateModified="2026-06-17" />.
export type ArticleJsonLdProps = {
  headline: string;
  description: string;
  url: string;
  author: AuthorInfo;
  datePublished: string; // ISO date, e.g. "2026-06-17"
  dateModified?: string; // defaults to datePublished
  section?: string; // e.g. "Mortgage"
};

export default function ArticleJsonLd({ headline, description, url, author, datePublished, dateModified, section }: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Person', name: author.name, ...(author.url ? { url: author.url } : {}) },
    publisher: {
      '@type': 'Organization',
      name: 'freecalcs.io',
      url: 'https://www.freecalcs.io',
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    ...(section ? { articleSection: section } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
