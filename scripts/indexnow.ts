// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam,
// Naver, etc. share submissions via api.indexnow.org).
//
// Run by .github/workflows/indexnow.yml after each successful production
// deploy, or by hand: `node scripts/indexnow.ts`. Node 24 runs this .ts file
// directly (type stripping), so keep to erasable-only TypeScript syntax.
//
// Fails loudly (non-zero exit) on any problem — an empty sitemap, a key file
// that isn't being served, or a non-2xx IndexNow response — so a broken ping
// shows up as a red Action instead of going unnoticed.

const HOST = 'www.freecalcs.io';
const KEY = '94fc71337865fbbee71cb5070994179f';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10_000; // IndexNow per-request limit
const ATTEMPTS = 3;

// What each IndexNow status means, per https://www.indexnow.org/documentation.
const STATUS_MEANING: Record<number, string> = {
  200: 'OK, URLs submitted',
  202: 'Accepted, key validation pending',
  400: 'Bad request, invalid format',
  403: 'Forbidden, key not valid (key file missing or mismatched)',
  422: 'Unprocessable, URLs do not belong to the host or key mismatch',
  429: 'Too many requests, potential spam',
};

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  if (!res.ok) throw new Error(`GET ${url} returned ${res.status}`);
  return res.text();
}

async function getSitemapUrls(): Promise<string[]> {
  const xml = await fetchText(SITEMAP_URL);
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1]);
  // IndexNow rejects the whole request (422) if any URL is off-host.
  const urls = [...new Set(locs)].filter((u) => new URL(u).host === HOST);
  if (urls.length === 0) throw new Error(`No ${HOST} URLs found in ${SITEMAP_URL}`);
  if (urls.length > MAX_URLS) throw new Error(`${urls.length} URLs exceeds the ${MAX_URLS} per-request limit`);
  return urls;
}

async function verifyKeyFile(): Promise<void> {
  const body = (await fetchText(KEY_LOCATION)).trim();
  if (body !== KEY) throw new Error(`Key file at ${KEY_LOCATION} does not contain the expected key`);
}

async function submit(urls: string[]): Promise<void> {
  const payload = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls });

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    let status: number;
    let body: string;
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: payload,
      });
      status = res.status;
      body = (await res.text()).trim();
    } catch (err) {
      if (attempt === ATTEMPTS) throw err;
      console.warn(`Attempt ${attempt}: network error (${(err as Error).message}), retrying`);
      await sleep(attempt * 5_000);
      continue;
    }

    const meaning = STATUS_MEANING[status] ?? 'Unexpected status';
    console.log(`IndexNow responded ${status}: ${meaning}${body ? `\n  body: ${body}` : ''}`);

    if (status === 200 || status === 202) return;
    // Only throttling and server errors are worth retrying; a 4xx means the
    // request itself is wrong and will fail the same way again.
    const retryable = status === 429 || status >= 500;
    if (!retryable || attempt === ATTEMPTS) {
      throw new Error(`IndexNow submission failed with ${status} (${meaning})`);
    }
    await sleep(attempt * 5_000);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  const urls = await getSitemapUrls();
  console.log(`Found ${urls.length} URLs in ${SITEMAP_URL}`);
  await verifyKeyFile();
  console.log(`Key file verified at ${KEY_LOCATION}`);
  await submit(urls);
  console.log(`Submitted ${urls.length} URLs to IndexNow`);
}

main().catch((err: unknown) => {
  console.error(`::error::${(err as Error).message}`);
  process.exit(1);
});
