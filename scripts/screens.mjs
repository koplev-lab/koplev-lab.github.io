/**
 * Screenshot every page at 390, 768 and 1440 px for design review.
 *
 *   npm run screens
 *
 * Builds the site, serves dist/ (scripts/serve-dist.mjs) and writes full-page PNGs to
 * screenshots/<width>/<page>.png (not committed).
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { serveDist } from './serve-dist.mjs';

const WIDTHS = [390, 768, 1440];
const PORT = 4330;
const root = process.cwd();
const dist = join(root, 'dist');

console.log('Building…');
const build = spawnSync('npx', ['astro', 'build'], {
  env: { ...process.env, BASE_PATH: '/' },
  stdio: 'ignore',
});
if (build.status !== 0) {
  console.error('Build failed. Run `npm run build` to see why.');
  process.exit(1);
}

const pages = readdirSync(dist, { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('index.html'))
  .map((f) => f.slice(0, -'index.html'.length).replace(/\/$/, ''));

const server = await serveDist({ port: PORT, base: '/' });
const browser = await chromium.launch();
try {
  for (const width of WIDTHS) {
    const out = join(root, 'screenshots', String(width));
    mkdirSync(out, { recursive: true });
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const p of pages) {
      await page.goto(`http://127.0.0.1:${PORT}/${p ? `${p}/` : ''}`, {
        waitUntil: 'networkidle',
      });
      await page.evaluate(async () => {
        // Trigger lazy-loaded images, then wait for them and for fonts.
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
        await Promise.all(
          [...document.images].map((img) =>
            img.complete
              ? null
              : new Promise((r) => img.addEventListener('load', r, { once: true })),
          ),
        );
        await document.fonts.ready;
      });
      const name = p ? p.replace(/\//g, '--') : 'home';
      await page.screenshot({ path: join(out, `${name}.png`), fullPage: true });
    }
    await page.close();
  }
  console.log(`${pages.length} pages × ${WIDTHS.length} widths → screenshots/`);
} finally {
  await browser.close();
  server.close();
}
