/**
 * Static checks on the build output: no third-party requests and the JS budget.
 */
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { BASE } from './helpers/config';
import { DIST, pages, read, resolveInternal, walk } from './helpers/dist';

const HOME_JS_BUDGET = 30 * 1024;
/** XML namespaces are identifiers, not requests. */
const NAMESPACE = /^https?:\/\/www\.w3\.org\//;

test('no third-party URLs in HTML (except outbound <a href>) and canonical/OG metadata', () => {
  const offenders: string[] = [];
  for (const { file, url } of pages()) {
    for (const [, tag, attrs] of read(file).matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) {
      if (tag!.toLowerCase() === 'a') continue;
      const isMeta = /^(meta|link)$/i.test(tag!) && /(rel="canonical"|property="og:)/.test(attrs!);
      for (const [, name, value] of attrs!.matchAll(/\s([\w:-]+)="(https?:\/\/[^"]+)"/g)) {
        if (NAMESPACE.test(value!) || (isMeta && (name === 'href' || name === 'content'))) continue;
        offenders.push(`${url}: <${tag} ${name}="${value}">`);
      }
    }
  }
  expect(offenders).toEqual([]);
});

test('no third-party URLs in CSS or JS', () => {
  const offenders: string[] = [];
  for (const file of walk(DIST, /\.(css|js|mjs)$/)) {
    for (const [m] of read(file).matchAll(/https?:\/\/[^\s"'`)]+/g)) {
      if (!NAMESPACE.test(m)) offenders.push(`${file.slice(DIST.length)}: ${m}`);
    }
  }
  expect(offenders).toEqual([]);
});

test('JS budget: none on inner pages, home within budget', () => {
  const problems: string[] = [];
  for (const { file, url } of pages()) {
    const html = read(file);
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(
      ([, attrs]) => !/type="application\/(ld\+)?json"/.test(attrs!),
    );
    if (url !== BASE) {
      if (scripts.length) problems.push(`${url}: ${scripts.length} script(s) on a non-home page`);
      continue;
    }
    let bytes = 0;
    for (const [, attrs, inline] of scripts) {
      const src = attrs!.match(/src="([^"]+)"/)?.[1];
      const code = src
        ? readFileSync(resolveInternal(src) ?? join(DIST, 'missing'))
        : Buffer.from(inline!);
      bytes += gzipSync(code).length;
    }
    if (bytes > HOME_JS_BUDGET)
      problems.push(`${url}: ${bytes} bytes gzipped JS (budget ${HOME_JS_BUDGET})`);
  }
  expect(problems).toEqual([]);
});
