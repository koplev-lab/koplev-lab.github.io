/** No broken internal links, image sources or in-page anchors. */
import { expect, test } from '@playwright/test';
import { BASE } from './helpers/config';
import { pages, read, resolveInternal } from './helpers/dist';

test('internal links and assets resolve', () => {
  const broken: string[] = [];
  for (const { file, url } of pages()) {
    const html = read(file);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    const refs = [
      ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]!),
      ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) =>
        m[1]!.split(',').map((s) => s.trim().split(/\s+/)[0]!),
      ),
    ];
    for (const ref of refs) {
      if (ref.startsWith('#')) {
        if (ref.length > 1 && !ids.has(ref.slice(1))) broken.push(`${url}: missing anchor ${ref}`);
      } else if (ref.startsWith('/')) {
        if (!ref.startsWith(BASE)) broken.push(`${url}: ${ref} ignores the base path`);
        else if (!resolveInternal(ref)) broken.push(`${url}: ${ref} not found`);
      }
    }
  }
  expect(broken).toEqual([]);
});
