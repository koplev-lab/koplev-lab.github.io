/** The home page's rotating news block: one item at a time, advances by itself. */
import { expect, test } from '@playwright/test';

test('news carousel rotates', async ({ page }) => {
  await page.goto('');
  const root = page.locator('[data-carousel]');
  if ((await root.count()) === 0) test.skip(true, 'No featured news');
  const slides = root.locator('[data-slide]');
  if ((await slides.count()) < 2) test.skip(true, 'Only one featured news item');

  await page.mouse.move(0, 0);
  await expect(root.locator('[data-slide].is-active')).toHaveCount(1);
  await expect(slides.nth(0)).toBeVisible();
  await expect(slides.nth(1)).toBeHidden();

  // Shorten the interval and restart the fill so the test doesn't wait 6 seconds.
  await root.evaluate((el) => {
    el.style.setProperty('--interval', '0.3s');
    const fill = el.querySelector<HTMLElement>('[data-fill]')!;
    fill.style.animation = 'none';
    void fill.offsetWidth;
    fill.style.animation = '';
  });
  await expect(slides.nth(1)).toBeVisible({ timeout: 3000 });
  await expect(slides.nth(0)).toBeHidden();
});

test('news carousel lists the items under reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL ?? '');
  const slides = page.locator('[data-carousel] [data-slide]');
  if ((await slides.count()) === 0) test.skip(true, 'No featured news');
  for (const slide of await slides.all()) await expect(slide).toBeVisible();
  await context.close();
});

test('news carousel keeps rotating with the pointer over it', async ({ page }) => {
  await page.goto('');
  const root = page.locator('[data-carousel]');
  if ((await root.count()) === 0) test.skip(true, 'No featured news');
  const slides = root.locator('[data-slide]');
  if ((await slides.count()) < 2) test.skip(true, 'Only one featured news item');

  await root.scrollIntoViewIfNeeded();
  await root.hover();
  await root.evaluate((el) => {
    el.style.setProperty('--interval', '0.3s');
    const fill = el.querySelector<HTMLElement>('[data-fill]')!;
    fill.style.animation = 'none';
    void fill.offsetWidth;
    fill.style.animation = '';
  });
  await expect(slides.nth(1)).toBeVisible({ timeout: 3000 });
});
