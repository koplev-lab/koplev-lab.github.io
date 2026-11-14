/**
 * Minimal static server for dist/, used by the tests and `npm run screens`.
 * (Astro's own preview server allows only one instance per project.)
 *
 *   node scripts/serve-dist.mjs [port] [basePath]
 */
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

export function serveDist({ port = 4321, base = '/', dist = join(process.cwd(), 'dist') } = {}) {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const server = createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
    if (!path.startsWith(prefix) && `${path}/` !== prefix) return res.writeHead(404).end();
    path = `/${path.slice(prefix.length)}`;
    if (path.endsWith('/')) path += 'index.html';
    const file = join(dist, normalize(path));
    if (!file.startsWith(dist)) return res.writeHead(403).end();
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      try {
        const body = await readFile(join(dist, '404.html'));
        res.writeHead(404, { 'content-type': TYPES['.html'] }).end(body);
      } catch {
        res.writeHead(404).end();
      }
    }
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [port = '4321', base = '/'] = process.argv.slice(2);
  await serveDist({ port: Number(port), base });
  console.log(`Serving dist/ at http://127.0.0.1:${port}${base}`);
}
