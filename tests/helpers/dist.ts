import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { BASE } from './config';

export const DIST = join(process.cwd(), 'dist');

export function walk(dir: string, ext: RegExp): string[] {
  if (!existsSync(dir)) throw new Error('dist/ not found. Run "npm run build:test" first.');
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .map((f) => join(dir, f))
    .filter((f) => ext.test(f) && statSync(f).isFile());
}

/** Every built HTML page, as { file, url } with url relative to the server root. */
export function pages(): { file: string; url: string }[] {
  return walk(DIST, /\.html$/)
    .map((file) => {
      const rel = relative(DIST, file).split(sep).join('/');
      const path = rel.endsWith('index.html') ? rel.slice(0, -'index.html'.length) : rel;
      return { file, url: `${BASE}${path}` };
    })
    .sort((a, b) => a.url.localeCompare(b.url));
}

/** Map an internal URL (starting with BASE) to a file in dist/, or null if missing. */
export function resolveInternal(url: string): string | null {
  const path = decodeURIComponent(url.slice(BASE.length).split(/[?#]/)[0] ?? '');
  const candidates =
    path === '' || path.endsWith('/')
      ? [join(DIST, path, 'index.html')]
      : [join(DIST, path), join(DIST, path, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

export const read = (file: string) => readFileSync(file, 'utf8');
