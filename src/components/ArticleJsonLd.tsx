import type { AuthorInfo } from './Author';
import { ORGANIZATION } from './SiteJsonLd';

// Reusable Article structured data for blog posts. Drop one into any post:
// <ArticleJsonLd headline=... description=... url=... author={AUTHORS.x}
// datePublished="2026-06-17" dateModified="2026-06-17" />.

// An article is written either by a person or by the site itself — schema.org
// accepts Person or Organization for `author`. Pass ORGANIZATION (the very node
// from SiteJsonLd, not a copy) for posts with no individual byline: it carries
// the site's @id, so author and publisher resolve to one entity instead of a
// lookalike. Pass an AuthorInfo when a real person wrote it.
export type ArticleAuthor = AuthorInfo | typeof ORGANIZATION;

export type ArticleJsonLdProps = {
  headline: string;
  description: string;
  url: string;
  author: ArticleAuthor;
  // Required on purpose — no fallback. A missing date should be a type error
  // that forces someone to go find the real one, not a silently-guessed value.
  // The blog index (app/blog/page.tsx) holds the published date for every post
  // and is what the post itself displays; source it from there so the markup
  // matches the visible date. Deriving it from `git log` instead would emit
  // 2026-05-09 on posts whose page reads "Apr 1, 2026" — a visible-content
  // mismatch Google treats as a policy violation, and it breaks outright on
  // the shallow clones CI uses.
  datePublished: string; // ISO date, e.g. "2026-06-17"
  dateModified?: string; // defaults to datePublished
  section?: string; // e.g. "Mortgage"
  // Absolute URL(s) of real article artwork, per Google's Article guidance
  // (it prefers several aspect ratios — 16x9, 4x3, 1x1 — of the same image).
  // Omitted from the output entirely when absent. Never fill this with a
  // placeholder, an empty string, or the site logo standing in for artwork:
  // an image that does not depict the article is worse than no image key.
  image?: string | string[];
};

export default function ArticleJsonLd({ headline, description, url, author, datePublished, dateModified, section, image }: ArticleJsonLdProps) {
  // ORGANIZATION carries an '@id'; an AuthorInfo never does. That is the
  // discriminator. The org node is passed through untouched so it keeps that
  // @id — rebuilding it here would defeat the point of sharing the entity.
  const authorNode =
    '@id' in author
      ? author
      : { '@type': 'Person', name: author.name, ...(author.url ? { url: author.url } : {}) };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: authorNode,
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
    ...(image ? { image } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
