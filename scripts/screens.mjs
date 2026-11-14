/**
 * Screenshot every page of one or more themes at 390, 768 and 1440 px.
 *
 *   npm run screens -- figure          # one theme
 *   npm run screens                    # every registered theme
 *
 * Builds in preview mode, serves dist/ (scripts/serve-dist.mjs), and writes full-page PNGs to
 * tests/screenshots/<theme>/<width>/<page>.png (PNGs are not committed).
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { chromium } from '@playwright/test';
import { THEME_IDS } from '../src/themes/ids.ts';
import { serveDist } from './serve-dist.mjs';

const WIDTHS = [390, 768, 1440];
const PORT = 4330;
const root = process.cwd();
const themes = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const selected = themes.length ? themes : [...THEME_IDS];
for (const t of selected) {
  if (!THEME_IDS.includes(t)) {
    console.error(`Unknown theme "${t}". Registered: ${THEME_IDS.join(', ')}`);
    process.exit(1);
  }
}

const env = { ...process.env, PREVIEW_THEMES: 'true', BASE_PATH: '/' };
console.log('Building (preview mode)…');
const build = spawnSync('npx', ['astro', 'build'], { env, stdio: 'ignore' });
if (build.status !== 0) {
  console.error('Build failed. Run `PREVIEW_THEMES=true npm run build` to see why.');
  process.exit(1);
}

const server = await serveDist({ port: PORT, base: '/' });
const base = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
try {
  for (const theme of selected) {
    const dir = join(root, 'dist', 'themes', theme);
    if (!existsSync(dir)) continue;
    const pages = readdirSync(dir, { recursive: true, encoding: 'utf8' })
      .filter((f) => f.endsWith('index.html'))
      .map((f) => relative(dir, join(dir, f)).split(sep).slice(0, -1).join('/'));
    for (const width of WIDTHS) {
      const out = join(root, 'tests', 'screenshots', theme, String(width));
      mkdirSync(out, { recursive: true });
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      for (const p of pages) {
        await page.goto(`${base}/themes/${theme}/${p ? `${p}/` : ''}`, {
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
    console.log(
      `${theme}: ${pages.length} pages × ${WIDTHS.length} widths → tests/screenshots/${theme}/`,
    );
  }
} finally {
  await browser.close();
  server.close();
}
