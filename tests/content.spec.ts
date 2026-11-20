/** Every page renders the required content from src/content/. */
import { expect, test, type Page } from '@playwright/test';
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

test('home', async ({ page }) => {
  expectAll(
    await bodyText(page, ''),
    [expected.tagline, ...expected.navLabels, ...expected.openPositions],
    'home',
  );
});

test('research and project pages', async ({ page }) => {
  const text = await bodyText(page, 'research/');
  expectAll(text, [...expected.navLabels, ...expected.projects.map((p) => p.title)], 'research');
  for (const p of expected.projects) {
    expectAll(
      await bodyText(page, `research/${p.slug}/`),
      [p.title, ...expected.navLabels],
      p.slug,
    );
  }
});

test('publications', async ({ page }) => {
  const text = await bodyText(page, 'publications/');
  expectAll(text, [...expected.navLabels, ...expected.highlightTitles], 'publications');
  // Each cover links to the lab's paper in that issue.
  await expect(page.locator('.cover-band a[href^="https://doi.org/"] img')).toHaveCount(
    expected.coverCount,
  );
});

test('team', async ({ page }) => {
  const text = await bodyText(page, 'team/');
  expectAll(
    text,
    [
      ...expected.navLabels,
      ...expected.currentMembers,
      ...expected.alumni.flatMap((a) => [a.name, ...(a.next ? [a.next] : [])]),
    ],
    'team',
  );
});

test('news', async ({ page }) => {
  expectAll(await bodyText(page, 'news/'), [...expected.navLabels, ...expected.newsTitles], 'news');
});

test('about', async ({ page }) => {
  const text = await bodyText(page, 'about/');
  expectAll(text, [...expected.navLabels, expected.aboutLede, ...expected.funders], 'about');
});

test('join', async ({ page }) => {
  expectAll(
    await bodyText(page, 'join/'),
    [...expected.navLabels, ...expected.openPositions],
    'join',
  );
});
