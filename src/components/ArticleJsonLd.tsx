import type { AuthorInfo } from './Author';
import { ORGANIZATION } from './SiteJsonLd';

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
    // The shared site Organization node, not a restated copy. Embedding it (a)
    // gives the publisher a logo it never had here, and (b) carries the same
    // @id as the homepage's node, so Article, WebSite and Organization all
    // resolve to one entity instead of three lookalikes. Do not swap this for
    // a bare { '@id': ... }: Google reads structured data per page, so the
    // reference would dangle with the node itself defined only on the homepage.
    publisher: ORGANIZATION,
    datePublished,
    dateModified: dateModified ?? datePublished,
    ...(section ? { articleSection: section } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
