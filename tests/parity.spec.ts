/**
 * Content parity: every theme renders the same required content.
 * "Same content, different design."
 */
import { expect, test, type Page } from '@playwright/test';
import { THEME_IDS } from '../src/themes/ids';
import { expected } from './helpers/expected';

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

async function bodyText(page: Page, path: string) {
  const res = await page.goto(path);
  expect(res?.status(), `${path} should load`).toBe(200);
  return norm(await page.locator('body').innerText());
}

function expectAll(text: string, items: string[], where: string) {
  for (const item of items) expect(text, `"${item}" missing on ${where}`).toContain(norm(item));
}

// Each theme in preview mode, plus the root site (active theme).
const roots = [
  ...THEME_IDS.map((id) => ({ name: id, prefix: `themes/${id}/` })),
  { name: 'root', prefix: '' },
];

for (const { name, prefix } of roots) {
  test.describe(`parity: ${name}`, () => {
    if (name !== 'root') {
      test('scopes its CSS with data-theme', async ({ page }) => {
        // Theme CSS can be bundled on other themes' pages, so it must be scoped
        // under :root[data-theme='<id>']; this checks the Layout sets the scope.
        await page.goto(prefix);
        await expect(page.locator('html')).toHaveAttribute('data-theme', name);
      });
    }

    test('home', async ({ page }) => {
      const text = await bodyText(page, prefix);
      expectAll(text, [expected.tagline, ...expected.navLabels], 'home');
    });

    test('research and project pages', async ({ page }) => {
      const text = await bodyText(page, `${prefix}research/`);
      expectAll(
        text,
        [...expected.navLabels, ...expected.projects.map((p) => p.title)],
        'research',
      );
      for (const p of expected.projects) {
        expectAll(
          await bodyText(page, `${prefix}research/${p.slug}/`),
          [p.title, ...expected.navLabels],
          p.slug,
        );
      }
    });

    test('publications', async ({ page }) => {
      const text = await bodyText(page, `${prefix}publications/`);
      expectAll(text, [...expected.navLabels, ...expected.highlightTitles], 'publications');
    });

    test('team', async ({ page }) => {
      const text = await bodyText(page, `${prefix}team/`);
      expectAll(text, [...expected.navLabels, ...expected.currentMembers], 'team');
    });

    test('about', async ({ page }) => {
      const text = await bodyText(page, `${prefix}about/`);
      expectAll(text, [...expected.navLabels, expected.aboutLede], 'about');
    });

    test('join', async ({ page }) => {
      expectAll(await bodyText(page, `${prefix}join/`), expected.navLabels, 'join');
    });
  });
}
