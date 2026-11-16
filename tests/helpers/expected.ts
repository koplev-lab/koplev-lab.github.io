/**
 * Reads the content files directly (independently of the site's data layer)
 * to know which text the pages must render.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT = join(process.cwd(), 'src/content');

const unquote = (v: string) => {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).replace(/''/g, "'");
  }
  return t;
};

/** Top-level scalar keys of a YAML document (enough for the fields tests need). */
function topLevel(yaml: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of yaml.split('\n')) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (m && m[2] !== '') out[m[1]!] = unquote(m[2]!);
  }
  return out;
}

/** Scalar children of a top-level mapping key, e.g. block(yaml, 'nav'). */
function block(yaml: string, key: string): Record<string, string> {
  const lines = yaml.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`${key}:`));
  const out: Record<string, string> = {};
  for (const line of lines.slice(start + 1)) {
    if (!/^\s/.test(line) && line.trim() !== '') break;
    const m = line.match(/^ {2}([A-Za-z][\w -]*):\s*(.+)$/);
    if (m) out[m[1]!] = unquote(m[2]!);
  }
  return out;
}

function frontmatter(file: string): Record<string, string> {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m ? topLevel(m[1]!) : {};
}

/** Entries of a collection; files starting with "_" are held back from the site. */
function collection(dir: string) {
  return readdirSync(join(CONTENT, dir))
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => ({ slug: f.replace(/\.md$/, ''), data: frontmatter(join(CONTENT, dir, f)) }));
}

/** `name:` values of the list under a top-level key, e.g. listNames(yaml, 'funders'). */
function listNames(yaml: string, key: string): string[] {
  const lines = yaml.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`${key}:`));
  const out: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (!/^\s/.test(line) && line.trim() !== '' && !line.startsWith('#')) break;
    const m = line.match(/^ {2}- name:\s*(.+)$/);
    if (m) out.push(unquote(m[1]!));
  }
  return out;
}

const siteYaml = readFileSync(join(CONTENT, 'site.yaml'), 'utf8');
const site = topLevel(siteYaml);
const publications = JSON.parse(
  readFileSync(join(process.cwd(), 'src/data/publications.json'), 'utf8'),
) as {
  items: { doi: string | null; title: string }[];
};

export const expected = {
  tagline: site.tagline!,
  navLabels: Object.values(block(siteYaml, 'nav')),
  currentMembers: collection('members')
    .filter((m) => m.data.current !== 'false' && m.data.role !== 'Alumni')
    .map((m) => m.data.name!),
  alumni: collection('members')
    .filter((m) => m.data.current === 'false' || m.data.role === 'Alumni')
    .map((m) => ({ name: m.data.name!, next: m.data.nextPosition })),
  funders: listNames(siteYaml, 'funders'),
  /** Positions still open today (the build runs the same day as the tests). */
  openPositions: collection('positions')
    .filter((p) => p.data.deadline! >= new Date().toISOString().slice(0, 10))
    .map((p) => p.data.title!),
  projects: collection('projects').map((p) => ({ slug: p.slug, title: p.data.title! })),
  highlightTitles: collection('highlights').map((h) => {
    const doi = h.data.doi!.toLowerCase();
    const pub = publications.items.find((p) => p.doi === doi);
    if (!pub) throw new Error(`Highlight ${h.slug}: DOI ${doi} not in publications.json`);
    return pub.title;
  }),
  aboutLede: frontmatter(join(CONTENT, 'pages/about.md')).lede!,
};
