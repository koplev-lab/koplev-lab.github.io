/**
 * Refresh src/data/publications.json from OpenAlex.
 *
 *   npm run pubs
 *
 * - Fetches every work linked to the PI's ORCID (PI_ORCID in src/site.config.ts).
 * - Keeps articles, reviews, preprints, books and chapters; drops errata,
 *   peer reviews, conference abstracts and similar.
 * - Merges a preprint into its published version (same normalized title) and
 *   keeps the preprint link.
 * - Applies src/data/publications.overrides.json (hide / fix / add).
 * - Writes the file sorted by date, newest first, with stable formatting.
 *
 * On any network or API error it exits non-zero and leaves the existing file
 * untouched. The site build never calls the network.
 *
 * Optional env: OPENALEX_API_KEY (raises the daily request budget).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PI_ORCID } from '../src/site.config.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const OUT = `${root}src/data/publications.json`;
const OVERRIDES = `${root}src/data/publications.overrides.json`;
const SITE_YAML = `${root}src/content/site.yaml`;

const INCLUDED_TYPES = new Set(['article', 'review', 'preprint', 'book', 'book-chapter', 'letter']);
const SELECT = [
  'id',
  'doi',
  'title',
  'type',
  'publication_date',
  'publication_year',
  'primary_location',
  'open_access',
  'authorships',
].join(',');

function fail(message) {
  console.error(`fetch-publications: ${message}`);
  console.error('publications.json was not changed.');
  process.exit(1);
}

/** Read contact.email from site.yaml without a YAML dependency. */
async function contactEmail() {
  const yaml = await readFile(SITE_YAML, 'utf8');
  const m = yaml.match(/^contact:\s*\n(?:[ \t]+.*\n)*?[ \t]+email:\s*['"]?([^'"\s#]+)/m);
  return m?.[1];
}

async function fetchAll(orcid, mailto) {
  const works = [];
  let cursor = '*';
  while (cursor) {
    const params = new URLSearchParams({
      filter: `author.orcid:${orcid}`,
      per_page: '200',
      cursor,
      select: SELECT,
    });
    if (mailto) params.set('mailto', mailto);
    if (process.env.OPENALEX_API_KEY) params.set('api_key', process.env.OPENALEX_API_KEY);
    const res = await fetch(`https://api.openalex.org/works?${params}`, {
      headers: { 'User-Agent': 'lab-website-publications/1.0' },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`OpenAlex responded ${res.status} ${res.statusText}`);
    const body = await res.json();
    works.push(...body.results);
    cursor = body.results.length ? body.meta.next_cursor : null;
  }
  return works;
}

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim();

const normDoi = (d) => (d ? d.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').toLowerCase() : null);
const normTitle = (t) =>
  t
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
const bareOrcid = (o) => (o ? o.replace(/^https?:\/\/orcid\.org\//, '') : undefined);

function normalize(w) {
  const source = w.primary_location?.source;
  const doi = normDoi(w.doi);
  const item = {
    id: w.id.replace('https://openalex.org/', ''),
    doi,
    title: decode(w.title ?? ''),
    authors: w.authorships.map((a) => {
      const author = { name: a.author.display_name };
      const orcid = bareOrcid(a.author.orcid);
      if (orcid) author.orcid = orcid;
      return author;
    }),
    venue: source?.display_name ?? null,
    year: w.publication_year,
    date: w.publication_date,
    type: w.type,
  };
  const oa = w.open_access?.is_oa ? w.open_access.oa_url : null;
  if (oa) item.oaUrl = oa;
  // Internal only, removed before writing.
  Object.defineProperty(item, '_sourceType', { value: source?.type ?? null });
  return item;
}

const isPreprint = (p) =>
  p.type === 'preprint' || /rxiv|research square|ssrn|preprints/i.test(p.venue ?? '');

/** Lower is better: journal article < other published < repository copy < preprint. */
function rank(p) {
  if (isPreprint(p)) return 3;
  if (p._sourceType === 'repository') return 2;
  if (p._sourceType === 'journal') return 0;
  return 1;
}

function dedupe(items) {
  const byDoi = new Map();
  const noDoi = [];
  for (const p of items) {
    if (!p.doi) noDoi.push(p);
    else if (!byDoi.has(p.doi)) byDoi.set(p.doi, p);
  }
  const groups = new Map();
  for (const p of [...byDoi.values(), ...noDoi]) {
    const key = normTitle(p.title);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  const out = [];
  for (const group of groups.values()) {
    group.sort((a, b) => rank(a) - rank(b) || (b.date ?? '').localeCompare(a.date ?? ''));
    const [keep, ...rest] = group;
    if (!isPreprint(keep)) {
      const pre = rest.find(isPreprint);
      if (pre) keep.preprintUrl = pre.doi ? `https://doi.org/${pre.doi}` : pre.oaUrl;
    }
    out.push(keep);
  }
  return out;
}

async function loadOverrides() {
  try {
    const o = JSON.parse(await readFile(OVERRIDES, 'utf8'));
    return { hide: o.hide ?? [], fix: o.fix ?? {}, add: o.add ?? [] };
  } catch (e) {
    if (e.code === 'ENOENT') return { hide: [], fix: {}, add: [] };
    throw new Error(`could not read publications.overrides.json: ${e.message}`);
  }
}

function applyOverrides(items, { hide, fix, add }) {
  const hidden = new Set(hide.map(normDoi));
  let out = items.filter((p) => !hidden.has(p.doi));
  out = out.map((p) => (p.doi && fix[p.doi] ? { ...p, ...fix[p.doi] } : p));
  for (const key of Object.keys(fix)) {
    if (normDoi(key) !== key)
      console.warn(`  overrides.fix: write DOI keys in lower case without prefix (${key})`);
    else if (!out.some((p) => p.doi === key))
      console.warn(`  overrides.fix: no publication with DOI ${key}`);
  }
  for (const a of add) {
    if (!a.title || !a.year || !a.authors?.length)
      throw new Error(`overrides.add entries need title, year and authors: ${JSON.stringify(a)}`);
    const doi = normDoi(a.doi ?? null);
    if (doi && out.some((p) => p.doi === doi)) continue;
    out.push({
      id: a.id ?? `manual-${normTitle(a.title).slice(0, 40)}`,
      doi,
      title: a.title,
      authors: a.authors,
      venue: a.venue ?? null,
      year: a.year,
      date: a.date ?? `${a.year}-01-01`,
      type: a.type ?? 'article',
      ...(a.oaUrl ? { oaUrl: a.oaUrl } : {}),
      ...(a.preprintUrl ? { preprintUrl: a.preprintUrl } : {}),
    });
  }
  return out;
}

/** Fixed key order keeps diffs small. */
function serialize(items, orcid) {
  const keys = [
    'id',
    'doi',
    'title',
    'authors',
    'venue',
    'year',
    'date',
    'type',
    'oaUrl',
    'preprintUrl',
  ];
  const clean = items.map((p) =>
    Object.fromEntries(keys.filter((k) => p[k] !== undefined).map((k) => [k, p[k]])),
  );
  return `${JSON.stringify({ source: 'OpenAlex', orcid, count: clean.length, items: clean }, null, 2)}\n`;
}

async function main() {
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(PI_ORCID))
    fail(`PI_ORCID is not set (got "${PI_ORCID}").`);
  const mailto = await contactEmail();
  let raw;
  try {
    raw = await fetchAll(PI_ORCID, mailto);
  } catch (e) {
    fail(`request failed: ${e.message}`);
  }
  if (!raw.length) fail('OpenAlex returned no works; refusing to write an empty list.');

  const kept = raw.filter((w) => INCLUDED_TYPES.has(w.type) && w.title).map(normalize);
  let items = dedupe(kept);
  try {
    items = applyOverrides(items, await loadOverrides());
  } catch (e) {
    fail(e.message);
  }
  items.sort(
    (a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title),
  );

  const next = serialize(items, PI_ORCID);
  const prev = await readFile(OUT, 'utf8').catch(() => '');
  if (prev === next) {
    console.log(`fetch-publications: ${items.length} publications, no changes.`);
    return;
  }
  await writeFile(OUT, next);
  console.log(
    `fetch-publications: wrote ${items.length} publications (${raw.length} works from OpenAlex, ${raw.length - kept.length} excluded by type, ${kept.length - items.length} merged as duplicates).`,
  );
}

await main();
